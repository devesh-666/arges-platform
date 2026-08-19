import { useState } from 'react';
import { api } from '../lib/api';
import { useApiData, field } from '../hooks/useApiData';
import { DashShell, Stat, Panel, DataState, type NavSection } from '../components/DashShell';
import { ChangePasswordCard } from '../components/ChangePasswordCard';

const SECTIONS: NavSection[] = [
  { title: 'Access', items: [
    { id: 'overview', label: 'Overview' },
    { id: 'request', label: 'Request access' },
    { id: 'history', label: 'Viewing history' },
  ] },
  { title: 'Account', items: [
    { id: 'location', label: 'Location' },
    { id: 'security', label: 'Security' },
  ] },
];

type Row = Record<string, unknown>;

const TYPES: [string, string][] = [
  ['video_audio', 'Video and audio'],
  ['audio_only', 'Audio only'],
  ['gps_only', 'Location only'],
];

/**
 * The member is the least-privileged human role: they see nothing until the
 * wearer consents, so this dashboard is built around asking rather than
 * watching. Consent state is owned by the backend (lib/consent.ts) — the UI
 * only reflects it.
 */
export function MemberDashboard() {
  const [active, setActive] = useState('overview');
  const [type, setType] = useState('video_audio');
  const [duration, setDuration] = useState(15);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState('');

  const requests = useApiData<unknown[]>(() => api.requests.list(), []);
  const devices = useApiData<unknown[]>(() => api.devices.list(), []);

  const rows = requests.data as Row[];
  const activeGrant = rows.find((r) => field(r, 'status', '') === 'active');
  const pending = rows.filter((r) => field(r, 'status', '') === 'pending');
  const device = (devices.data[0] ?? null) as Row | null;

  const send = async () => {
    setSending(true);
    setSent('');
    try {
      await api.requests.create({ type, durationMinutes: duration });
      setSent('Request sent. The wearer will be asked out loud, and can decline.');
      await requests.refetch();
    } catch (e) {
      setSent(e instanceof Error ? e.message : 'Could not send the request.');
    } finally {
      setSending(false);
    }
  };

  return (
    <DashShell
      role="Family member"
      sections={SECTIONS}
      active={active}
      onNavigate={setActive}
      title={active === 'request' ? 'Request access' : active === 'history' ? 'Viewing history' : active === 'location' ? 'Location' : active === 'security' ? 'Security' : 'Overview'}
      subtitle={active === 'overview' ? 'You see only what has been agreed to.' : undefined}
      actions={<button className="btn btn-outline btn-sm" onClick={() => void requests.refetch()}>Refresh</button>}
    >
      {active === 'overview' && (
        <>
          <div className="grid-stats">
            <Stat label="Access" value={activeGrant ? 'Granted' : 'None'} tone={activeGrant ? 'ok' : undefined} note={activeGrant ? String(field(activeGrant, 'type', '')).replace('_', ' ') : 'Nothing is being streamed'} />
            <Stat label="Pending" value={pending.length} tone={pending.length ? 'warn' : undefined} note="Awaiting a reply" />
            <Stat label="Device" value={device ? String(field(device, 'status', '—')) : '—'} note={device ? String(field(device, 'name', '')) : undefined} />
            <Stat label="Requests made" value={rows.length} note="All time" />
          </div>

          <Panel title="Your requests">
            <DataState loading={requests.loading} error={requests.error} empty={!rows.length}>
              <RequestTable rows={rows} />
            </DataState>
          </Panel>
        </>
      )}

      {active === 'request' && (
        <Panel title="Ask to view">
          <div className="panel" style={{ padding: 'var(--s5)', maxWidth: 520 }}>
            <div className="field" style={{ marginBottom: 'var(--s4)' }}>
              <label className="field-label" htmlFor="rq-type">What do you need?</label>
              <select id="rq-type" className="input" value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="rq-dur">For how long — minutes</label>
              <input id="rq-dur" className="input tabular" type="number" min={1} max={120}
                value={duration} onChange={(e) => setDuration(Number(e.target.value) || 1)} />
            </div>

            <button className="btn btn-accent" style={{ width: '100%', marginTop: 'var(--s5)' }} disabled={sending} onClick={() => void send()}>
              {sending ? 'Sending…' : 'Send request'}
            </button>

            {sent && <p role="status" className="form-note" style={{ marginTop: 'var(--s4)' }}>{sent}</p>}

            <p className="form-note" style={{ marginTop: 'var(--s4)' }}>
              Access ends automatically when the time is up, and the wearer can revoke it
              at any moment.
            </p>
          </div>
        </Panel>
      )}

      {active === 'history' && (
        <Panel title="Every request you have made">
          <DataState loading={requests.loading} error={requests.error} empty={!rows.length}>
            <RequestTable rows={rows} />
          </DataState>
        </Panel>
      )}

      {active === 'location' && (
        <Panel title="Location">
          <div className="card">
            <p className="mono" style={{ color: 'var(--mute)' }}>
              {activeGrant || field<boolean>(device, 'gpsShared', false) ? 'VISIBLE' : 'NOT SHARED'}
            </p>
            <p className="body-mute" style={{ marginTop: 'var(--s3)', fontSize: '0.875rem' }}>
              Location is only visible while the wearer's privacy settings allow it, or
              while an active grant is running.
            </p>
          </div>
        </Panel>
      )}

      {active === 'security' && (
        <Panel title="Security">
          <div style={{ maxWidth: 520 }}><ChangePasswordCard /></div>
        </Panel>
      )}
    </DashShell>
  );
}

function RequestTable({ rows }: { rows: Record<string, unknown>[] }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Type</th><th>Duration</th><th>Status</th><th>Ends</th></tr></thead>
        <tbody>
          {rows.map((r, i) => {
            const status = String(field(r, 'status', '—'));
            const tone = status === 'active' ? 'tag-ok' : status === 'pending' ? 'tag-warn' : status === 'declined' ? 'tag-danger' : '';
            return (
              <tr key={String(field(r, '_id', i))}>
                <td className="mono">{String(field(r, 'type', '—')).replace('_', ' ').toUpperCase()}</td>
                <td className="mono tabular">{String(field(r, 'durationMinutes', '—'))} MIN</td>
                <td><span className={`tag ${tone}`}>{status}</span></td>
                <td className="mono" style={{ color: 'var(--mute)' }}>
                  {field(r, 'expiresAt', null) ? new Date(String(field(r, 'expiresAt', ''))).toLocaleTimeString() : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
