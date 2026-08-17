import { useState } from 'react';
import { api } from '../lib/api';
import { useApiData, field } from '../hooks/useApiData';
import { DashShell, Stat, Panel, DataState, type NavSection } from '../components/DashShell';
import { ChangePasswordCard } from '../components/ChangePasswordCard';

const SECTIONS: NavSection[] = [
  { title: 'Monitor', items: [
    { id: 'overview', label: 'Overview' },
    { id: 'device', label: 'Device' },
    { id: 'location', label: 'Location' },
  ] },
  { title: 'Family', items: [
    { id: 'members', label: 'Members' },
    { id: 'requests', label: 'Consent requests' },
  ] },
  { title: 'Safety', items: [
    { id: 'alerts', label: 'Alerts' },
    { id: 'security', label: 'Security' },
  ] },
];

type Row = Record<string, unknown>;

export function FamilyDashboard() {
  const [active, setActive] = useState('overview');
  const [busy, setBusy] = useState<string | null>(null);

  const devices = useApiData<unknown[]>(() => api.devices.list(), []);
  const families = useApiData<unknown[]>(() => api.families.list(), []);
  const requests = useApiData<unknown[]>(() => api.requests.list(), []);
  const alerts = useApiData<unknown[]>(() => api.alerts.list(), []);

  const device = (devices.data[0] ?? null) as Row | null;
  const family = (families.data[0] ?? null) as Row | null;
  const members = (field<unknown[]>(family, 'members', []) ?? []) as Row[];
  const pending = (requests.data as Row[]).filter((r) => field(r, 'status', '') === 'pending');
  const openAlerts = (alerts.data as Row[]).filter((a) => field(a, 'status', '') !== 'resolved');

  const battery = field<number>(device, 'battery', 0);

  const respond = async (id: string, accepted: boolean) => {
    setBusy(id);
    try { await api.requests.respond(id, accepted); await requests.refetch(); }
    catch { /* surfaced by the panel's error state on next load */ }
    finally { setBusy(null); }
  };

  const resolve = async (id: string) => {
    setBusy(id);
    try { await api.alerts.resolve(id); await alerts.refetch(); }
    catch { /* as above */ }
    finally { setBusy(null); }
  };

  return (
    <DashShell
      role="Family head"
      sections={SECTIONS.map((s) => ({
        ...s,
        items: s.items.map((i) =>
          i.id === 'requests' && pending.length ? { ...i, badge: String(pending.length) }
          : i.id === 'alerts' && openAlerts.length ? { ...i, badge: String(openAlerts.length) }
          : i),
      }))}
      active={active}
      onNavigate={setActive}
      title={TITLES[active] ?? 'Overview'}
      subtitle={SUBTITLES[active]}
      actions={<button className="btn btn-outline btn-sm" onClick={() => { void devices.refetch(); void families.refetch(); void requests.refetch(); void alerts.refetch(); }}>Refresh</button>}
    >
      {active === 'overview' && (
        <>
          <div className="grid-stats">
            <Stat label="Device" value={device ? String(field(device, 'status', '—')) : '—'} note={device ? String(field(device, 'name', '')) : undefined} tone={field(device, 'status', '') === 'online' ? 'ok' : undefined} />
            <Stat label="Battery" value={device ? `${battery}%` : '—'} tone={battery && battery < 25 ? 'warn' : undefined} note={device ? `Firmware ${field(device, 'firmware', '—')}` : undefined} />
            <Stat label="Members" value={members.length} note="In this family" />
            <Stat label="Pending requests" value={pending.length} tone={pending.length ? 'warn' : undefined} note="Awaiting consent" />
          </div>

          <Panel title="Open alerts">
            <DataState loading={alerts.loading} error={alerts.error} empty={!openAlerts.length}>
              <AlertTable rows={openAlerts} busy={busy} onResolve={resolve} />
            </DataState>
          </Panel>
        </>
      )}

      {active === 'device' && (
        <Panel title="Paired device">
          <DataState loading={devices.loading} error={devices.error} empty={!device}>
            <div className="table-wrap">
              <table className="table">
                <tbody>
                  {device && ([
                    ['Name', field(device, 'name', '—')],
                    ['Code', field(device, 'code', '—')],
                    ['Status', field(device, 'status', '—')],
                    ['Battery', `${battery}%`],
                    ['Firmware', field(device, 'firmware', '—')],
                    ['Temperature', `${field(device, 'temperature', '—')}°C`],
                    ['Face verified', field<boolean>(device, 'faceVerified', false) ? 'Yes' : 'No'],
                  ] as [string, unknown][]).map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row" style={{ width: 200 }}>{k}</th>
                      <td className="mono">{String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataState>
        </Panel>
      )}

      {active === 'location' && (
        <Panel title="Last known position">
          <DataState loading={devices.loading} error={devices.error} empty={!device}>
            <div className="card">
              <p className="mono" style={{ color: 'var(--mute)' }}>
                {device && (field(device, 'location', null) as Row | null)
                  ? `${field((field(device, 'location', {}) as Row), 'lat', '—')}, ${field((field(device, 'location', {}) as Row), 'lng', '—')}`
                  : 'NO FIX'}
              </p>
              <p className="body-mute" style={{ marginTop: 'var(--s3)', fontSize: '0.875rem' }}>
                Position is reported by the NEO-6M module in the right temple. It is
                visible to family only while the wearer's privacy settings allow it.
              </p>
            </div>
          </DataState>
        </Panel>
      )}

      {active === 'members' && (
        <Panel title="Family members">
          <DataState loading={families.loading} error={families.error} empty={!members.length}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Relation</th><th>GPS</th><th>Video</th></tr></thead>
                <tbody>
                  {members.map((m, i) => {
                    const perms = field<Row>(m, 'permissions', {});
                    return (
                      <tr key={String(field(m, 'userId', i))}>
                        <td>{String(field(m, 'name', '—'))}</td>
                        <td className="mono">{String(field(m, 'relation', '—')).toUpperCase()}</td>
                        <td>{field<boolean>(perms, 'canSeeGPS', false) ? <span className="tag tag-ok">Allowed</span> : <span className="tag">Denied</span>}</td>
                        <td>{field<boolean>(perms, 'canRequestVideo', false) ? <span className="tag tag-ok">Allowed</span> : <span className="tag">Denied</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DataState>
        </Panel>
      )}

      {active === 'requests' && (
        <Panel title="Consent requests">
          <DataState loading={requests.loading} error={requests.error} empty={!requests.data.length}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>From</th><th>Type</th><th>Duration</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {(requests.data as Row[]).map((r, i) => {
                    const id = String(field(r, '_id', i));
                    const status = String(field(r, 'status', '—'));
                    return (
                      <tr key={id}>
                        <td>{String(field(r, 'fromUserName', '—'))}<span className="mono" style={{ color: 'var(--faint)', display: 'block' }}>{String(field(r, 'fromUserRelation', '')).toUpperCase()}</span></td>
                        <td className="mono">{String(field(r, 'type', '—')).replace('_', ' ').toUpperCase()}</td>
                        <td className="mono tabular">{String(field(r, 'durationMinutes', '—'))} MIN</td>
                        <td><span className={`tag ${status === 'pending' ? 'tag-warn' : status === 'active' ? 'tag-ok' : ''}`}>{status}</span></td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {status === 'pending' && (
                            <>
                              <button className="btn btn-accent btn-sm" disabled={busy === id} onClick={() => respond(id, true)}>Allow</button>
                              <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }} disabled={busy === id} onClick={() => respond(id, false)}>Decline</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DataState>
        </Panel>
      )}

      {active === 'alerts' && (
        <Panel title="All alerts">
          <DataState loading={alerts.loading} error={alerts.error} empty={!alerts.data.length}>
            <AlertTable rows={alerts.data as Row[]} busy={busy} onResolve={resolve} />
          </DataState>
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

const TITLES: Record<string, string> = {
  overview: 'Overview', device: 'Device', location: 'Location',
  members: 'Members', requests: 'Consent requests', alerts: 'Alerts', security: 'Security',
};

const SUBTITLES: Record<string, string> = {
  overview: 'Everything at a glance.',
  requests: 'Nothing is streamed until the wearer agrees.',
  alerts: 'Falls, SOS presses and hazards.',
};

function AlertTable({ rows, busy, onResolve }: { rows: Record<string, unknown>[]; busy: string | null; onResolve: (id: string) => void }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Type</th><th>Who</th><th>Where</th><th>Status</th><th /></tr></thead>
        <tbody>
          {rows.map((a, i) => {
            const id = String(field(a, '_id', i));
            const type = String(field(a, 'type', '—'));
            const status = String(field(a, 'status', '—'));
            const loc = field<Record<string, unknown>>(a, 'location', {});
            return (
              <tr key={id}>
                <td><span className={`tag ${type === 'sos' ? 'tag-danger' : type === 'fall' ? 'tag-warn' : ''}`}>{type.toUpperCase()}</span></td>
                <td>{String(field(a, 'userName', '—'))}</td>
                <td className="mono" style={{ color: 'var(--mute)' }}>{String(field(loc, 'address', '—'))}</td>
                <td className="mono">{status.toUpperCase()}</td>
                <td style={{ textAlign: 'right' }}>
                  {status !== 'resolved' && (
                    <button className="btn btn-outline btn-sm" disabled={busy === id} onClick={() => onResolve(id)}>Resolve</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
