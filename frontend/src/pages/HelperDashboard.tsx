import { useState } from 'react';
import { api } from '../lib/api';
import { useApiData, field } from '../hooks/useApiData';
import { DashShell, Stat, Panel, DataState, type NavSection } from '../components/DashShell';
import { ChangePasswordCard } from '../components/ChangePasswordCard';

const SECTIONS: NavSection[] = [
  { title: 'Respond', items: [
    { id: 'overview', label: 'Dashboard' },
    { id: 'queue', label: 'Open requests' },
    { id: 'history', label: 'Session history' },
  ] },
  { title: 'You', items: [
    { id: 'network', label: 'The network' },
    { id: 'security', label: 'Security' },
  ] },
];

type Row = Record<string, unknown>;

/**
 * The Echo Network volunteer view. Unresolved alerts are the work queue —
 * a helper claims one by resolving it, which is the same endpoint the family
 * dashboard uses, so the two stay consistent without extra backend surface.
 */
export function HelperDashboard() {
  const [active, setActive] = useState('overview');
  const [busy, setBusy] = useState<string | null>(null);

  const alerts = useApiData<unknown[]>(() => api.alerts.list(), []);
  const helpers = useApiData<unknown[]>(() => api.helpers.list(), []);

  const rows = alerts.data as Row[];
  const open = rows.filter((a) => field(a, 'status', '') !== 'resolved');
  const done = rows.filter((a) => field(a, 'status', '') === 'resolved');
  const network = helpers.data as Row[];

  const claim = async (id: string) => {
    setBusy(id);
    try { await api.alerts.resolve(id); await alerts.refetch(); }
    catch { /* the panel surfaces failure on the next load */ }
    finally { setBusy(null); }
  };

  return (
    <DashShell
      role="Echo helper"
      sections={SECTIONS.map((s) => ({
        ...s,
        items: s.items.map((i) => (i.id === 'queue' && open.length ? { ...i, badge: String(open.length) } : i)),
      }))}
      active={active}
      onNavigate={setActive}
      title={active === 'queue' ? 'Open requests' : active === 'history' ? 'Session history' : active === 'network' ? 'The network' : active === 'security' ? 'Security' : 'Dashboard'}
      subtitle={active === 'overview' ? 'Five seconds is the promise. Keep it.' : undefined}
      actions={<button className="btn btn-outline btn-sm" onClick={() => void alerts.refetch()}>Refresh</button>}
    >
      {active === 'overview' && (
        <>
          <div className="grid-stats">
            <Stat label="Waiting now" value={open.length} tone={open.length ? 'warn' : 'ok'} note={open.length ? 'Someone needs help' : 'All clear'} />
            <Stat label="Resolved" value={done.length} note="All time" />
            <Stat label="Volunteers" value={network.length} note="In the network" />
            <Stat label="Status" value="Available" tone="ok" note="You are on call" />
          </div>

          <Panel title="Needs a responder">
            <DataState loading={alerts.loading} error={alerts.error} empty={!open.length}>
              <AlertQueue rows={open} busy={busy} onClaim={claim} />
            </DataState>
          </Panel>
        </>
      )}

      {active === 'queue' && (
        <Panel title="Open requests">
          <DataState loading={alerts.loading} error={alerts.error} empty={!open.length}>
            <AlertQueue rows={open} busy={busy} onClaim={claim} />
          </DataState>
        </Panel>
      )}

      {active === 'history' && (
        <Panel title="Resolved sessions">
          <DataState loading={alerts.loading} error={alerts.error} empty={!done.length}>
            <AlertQueue rows={done} busy={busy} onClaim={claim} />
          </DataState>
        </Panel>
      )}

      {active === 'network' && (
        <Panel title="Echo volunteers">
          <DataState loading={helpers.loading} error={helpers.error} empty={!network.length}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Languages</th><th>Status</th></tr></thead>
                <tbody>
                  {network.map((h, i) => (
                    <tr key={String(field(h, '_id', i))}>
                      <td>{String(field(h, 'name', '—'))}</td>
                      <td className="mono">{String(field(h, 'language', field(h, 'languages', '—'))).toUpperCase()}</td>
                      <td><span className={`tag ${field(h, 'status', '') === 'active' ? 'tag-ok' : ''}`}>{String(field(h, 'status', '—'))}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

function AlertQueue({ rows, busy, onClaim }: { rows: Record<string, unknown>[]; busy: string | null; onClaim: (id: string) => void }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Type</th><th>Who</th><th>Where</th><th>Raised</th><th /></tr></thead>
        <tbody>
          {rows.map((a, i) => {
            const id = String(field(a, '_id', i));
            const type = String(field(a, 'type', '—'));
            const loc = field<Record<string, unknown>>(a, 'location', {});
            const at = field(a, 'createdAt', null);
            return (
              <tr key={id}>
                <td><span className={`tag ${type === 'sos' ? 'tag-danger' : type === 'fall' ? 'tag-warn' : ''}`}>{type.toUpperCase()}</span></td>
                <td>{String(field(a, 'userName', '—'))}</td>
                <td className="mono" style={{ color: 'var(--mute)' }}>{String(field(loc, 'address', '—'))}</td>
                <td className="mono" style={{ color: 'var(--mute)' }}>{at ? new Date(String(at)).toLocaleTimeString() : '—'}</td>
                <td style={{ textAlign: 'right' }}>
                  {String(field(a, 'status', '')) !== 'resolved' && (
                    <button className="btn btn-accent btn-sm" disabled={busy === id} onClick={() => onClaim(id)}>Respond</button>
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
