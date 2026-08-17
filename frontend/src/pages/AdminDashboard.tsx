import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useApiData, field } from '../hooks/useApiData';
import { DashShell, Stat, Panel, DataState, type NavSection } from '../components/DashShell';
import { ChangePasswordCard } from '../components/ChangePasswordCard';

const SECTIONS: NavSection[] = [
  { title: 'Overview', items: [
    { id: 'overview', label: 'Dashboard' },
    { id: 'server', label: 'Server health' },
  ] },
  { title: 'Directory', items: [
    { id: 'users', label: 'Users' },
    { id: 'devices', label: 'Devices' },
    { id: 'families', label: 'Family trees' },
    { id: 'helpers', label: 'Helpers' },
  ] },
  { title: 'Oversight', items: [
    { id: 'alerts', label: 'Alerts' },
    { id: 'audit', label: 'Audit log' },
    { id: 'security', label: 'Security' },
  ] },
];

type Row = Record<string, unknown>;

/**
 * Administration. Every panel here reads from a real endpoint; the mutations
 * (suspend a user, lock a device) go through the same PATCH handlers that
 * diff old against new document state to decide which transactional email to
 * send — so changing status here really does notify the account.
 */
export function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [busy, setBusy] = useState<string | null>(null);
  const [health, setHealth] = useState<{ status?: string; db?: string } | null>(null);
  const [healthError, setHealthError] = useState(false);

  const stats = useApiData<Record<string, number>>(() => api.stats.get(), {});
  const users = useApiData<unknown[]>(() => api.users.list(), []);
  const devices = useApiData<unknown[]>(() => api.devices.list(), []);
  const families = useApiData<unknown[]>(() => api.families.list(), []);
  const helpers = useApiData<unknown[]>(() => api.helpers.list(), []);
  const alerts = useApiData<unknown[]>(() => api.alerts.list(), []);
  const audit = useApiData<unknown[]>(() => api.audit.list(), []);

  // /health sits outside the /api mount, so it is fetched directly rather
  // than through the client. It reports whether Mongo is attached or the
  // backend is answering from fixtures.
  useEffect(() => {
    const base = (import.meta.env.VITE_API_URL || '/api').replace(/\/api\/?$/, '');
    fetch(`${base}/health`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setHealth)
      .catch(() => setHealthError(true));
  }, []);

  const userRows = users.data as Row[];
  const deviceRows = devices.data as Row[];
  const alertRows = alerts.data as Row[];
  const openAlerts = alertRows.filter((a) => field(a, 'status', '') !== 'resolved');

  const setUserStatus = async (id: string, status: string) => {
    setBusy(id);
    try { await api.users.update(id, { status }); await users.refetch(); }
    catch { /* surfaced on next load */ }
    finally { setBusy(null); }
  };

  const setDeviceStatus = async (id: string, status: string) => {
    setBusy(id);
    try { await api.devices.update(id, { status }); await devices.refetch(); }
    catch { /* surfaced on next load */ }
    finally { setBusy(null); }
  };

  const resolveAlert = async (id: string) => {
    setBusy(id);
    try { await api.alerts.resolve(id); await alerts.refetch(); }
    catch { /* surfaced on next load */ }
    finally { setBusy(null); }
  };

  return (
    <DashShell
      role="Administrator"
      sections={SECTIONS.map((s) => ({
        ...s,
        items: s.items.map((i) => (i.id === 'alerts' && openAlerts.length ? { ...i, badge: String(openAlerts.length) } : i)),
      }))}
      active={active}
      onNavigate={setActive}
      title={TITLES[active] ?? 'Dashboard'}
      actions={
        <button className="btn btn-outline btn-sm" onClick={() => {
          void stats.refetch(); void users.refetch(); void devices.refetch();
          void alerts.refetch(); void audit.refetch();
        }}>Refresh</button>
      }
    >
      {active === 'overview' && (
        <>
          <div className="grid-stats">
            {/* /api/stats reports `totalUsers`, not `users` — the list length
                wins when it is available, and this is the fallback. */}
            <Stat label="Users" value={userRows.length || field<number>(stats.data as Row, 'totalUsers', 0)} note="Registered" />
            <Stat label="Devices" value={deviceRows.length || field<number>(stats.data as Row, 'devices', 0)} note="Paired" />
            <Stat label="Families" value={families.data.length || field<number>(stats.data as Row, 'families', 0)} note="Trees" />
            <Stat label="Open alerts" value={openAlerts.length} tone={openAlerts.length ? 'danger' : 'ok'} note="Unresolved" />
          </div>

          <Panel title="Recent alerts">
            <DataState loading={alerts.loading} error={alerts.error} empty={!alertRows.length}>
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Type</th><th>Who</th><th>Status</th><th /></tr></thead>
                  <tbody>
                    {alertRows.slice(0, 6).map((a, i) => {
                      const id = String(field(a, '_id', i));
                      const type = String(field(a, 'type', '—'));
                      const status = String(field(a, 'status', '—'));
                      return (
                        <tr key={id}>
                          <td><span className={`tag ${type === 'sos' ? 'tag-danger' : type === 'fall' ? 'tag-warn' : ''}`}>{type.toUpperCase()}</span></td>
                          <td>{String(field(a, 'userName', '—'))}</td>
                          <td className="mono">{status.toUpperCase()}</td>
                          <td style={{ textAlign: 'right' }}>
                            {status !== 'resolved' && <button className="btn btn-outline btn-sm" disabled={busy === id} onClick={() => resolveAlert(id)}>Resolve</button>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </DataState>
          </Panel>
        </>
      )}

      {active === 'server' && (
        <Panel title="Backend">
          <div className="grid-stats">
            <Stat label="API" value={healthError ? 'Unreachable' : health?.status === 'ok' ? 'Healthy' : '…'} tone={healthError ? 'danger' : health?.status === 'ok' ? 'ok' : undefined} />
            <Stat
              label="Database"
              value={healthError ? '—' : health?.db === 'connected' ? 'Connected' : health?.db === 'mock' ? 'Mock mode' : '…'}
              tone={health?.db === 'connected' ? 'ok' : health?.db === 'mock' ? 'warn' : undefined}
              note={health?.db === 'mock' ? 'Serving fixtures — no Mongo attached' : undefined}
            />
          </div>
          <p className="body-mute" style={{ marginTop: 'var(--s5)', fontSize: '0.875rem', maxWidth: '64ch' }}>
            The API answers in both states by design: when Mongo is unreachable it falls
            back to fixtures rather than failing, so a demo never depends on the database
            being up.
          </p>
        </Panel>
      )}

      {active === 'users' && (
        <Panel title={`Users · ${userRows.length}`}>
          <DataState loading={users.loading} error={users.error} empty={!userRows.length}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {userRows.map((u, i) => {
                    const id = String(field(u, '_id', i));
                    const status = String(field(u, 'status', '—'));
                    const suspended = status === 'suspended';
                    return (
                      <tr key={id}>
                        <td>{String(field(u, 'name', '—'))}</td>
                        <td className="mono" style={{ color: 'var(--mute)' }}>{String(field(u, 'email', '—'))}</td>
                        <td className="mono">{String(field(u, 'role', '—')).replace('_', ' ').toUpperCase()}</td>
                        <td><span className={`tag ${status === 'active' ? 'tag-ok' : suspended ? 'tag-danger' : 'tag-warn'}`}>{status}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-outline btn-sm" disabled={busy === id}
                            onClick={() => setUserStatus(id, suspended ? 'active' : 'suspended')}>
                            {suspended ? 'Reinstate' : 'Suspend'}
                          </button>
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

      {active === 'devices' && (
        <Panel title={`Devices · ${deviceRows.length}`}>
          <DataState loading={devices.loading} error={devices.error} empty={!deviceRows.length}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Code</th><th>Firmware</th><th>Battery</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {deviceRows.map((d, i) => {
                    const id = String(field(d, '_id', i));
                    const status = String(field(d, 'status', '—'));
                    const battery = field<number>(d, 'battery', 0);
                    const locked = status === 'locked';
                    return (
                      <tr key={id}>
                        <td>{String(field(d, 'name', '—'))}</td>
                        <td className="mono" style={{ color: 'var(--mute)' }}>{String(field(d, 'code', '—'))}</td>
                        <td className="mono">{String(field(d, 'firmware', '—'))}</td>
                        <td className="mono tabular" style={{ color: battery < 25 ? 'var(--warn)' : undefined }}>{battery}%</td>
                        <td><span className={`tag ${status === 'online' ? 'tag-ok' : locked ? 'tag-danger' : 'tag-warn'}`}>{status}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-outline btn-sm" disabled={busy === id}
                            onClick={() => setDeviceStatus(id, locked ? 'online' : 'locked')}>
                            {locked ? 'Unlock' : 'Lock'}
                          </button>
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

      {active === 'families' && (
        <Panel title={`Family trees · ${families.data.length}`}>
          <DataState loading={families.loading} error={families.error} empty={!families.data.length}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Family</th><th>Head</th><th>Members</th></tr></thead>
                <tbody>
                  {(families.data as Row[]).map((f, i) => (
                    <tr key={String(field(f, '_id', i))}>
                      <td className="mono">{String(field(f, '_id', '—'))}</td>
                      <td className="mono" style={{ color: 'var(--mute)' }}>{String(field(f, 'headId', '—'))}</td>
                      <td className="tabular">{(field<unknown[]>(f, 'members', []) ?? []).length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataState>
        </Panel>
      )}

      {active === 'helpers' && (
        <Panel title={`Echo helpers · ${helpers.data.length}`}>
          <DataState loading={helpers.loading} error={helpers.error} empty={!helpers.data.length}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>
                <tbody>
                  {(helpers.data as Row[]).map((h, i) => (
                    <tr key={String(field(h, '_id', i))}>
                      <td>{String(field(h, 'name', '—'))}</td>
                      <td className="mono" style={{ color: 'var(--mute)' }}>{String(field(h, 'email', '—'))}</td>
                      <td><span className={`tag ${field(h, 'status', '') === 'active' ? 'tag-ok' : ''}`}>{String(field(h, 'status', '—'))}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataState>
        </Panel>
      )}

      {active === 'alerts' && (
        <Panel title={`Alerts · ${alertRows.length}`}>
          <DataState loading={alerts.loading} error={alerts.error} empty={!alertRows.length}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Type</th><th>Who</th><th>Where</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {alertRows.map((a, i) => {
                    const id = String(field(a, '_id', i));
                    const type = String(field(a, 'type', '—'));
                    const status = String(field(a, 'status', '—'));
                    const loc = field<Row>(a, 'location', {});
                    return (
                      <tr key={id}>
                        <td><span className={`tag ${type === 'sos' ? 'tag-danger' : type === 'fall' ? 'tag-warn' : ''}`}>{type.toUpperCase()}</span></td>
                        <td>{String(field(a, 'userName', '—'))}</td>
                        <td className="mono" style={{ color: 'var(--mute)' }}>{String(field(loc, 'address', '—'))}</td>
                        <td className="mono">{status.toUpperCase()}</td>
                        <td style={{ textAlign: 'right' }}>
                          {status !== 'resolved' && <button className="btn btn-outline btn-sm" disabled={busy === id} onClick={() => resolveAlert(id)}>Resolve</button>}
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

      {active === 'audit' && (
        <Panel title="Audit log">
          <DataState loading={audit.loading} error={audit.error} empty={!audit.data.length}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>When</th><th>Actor</th><th>Action</th></tr></thead>
                <tbody>
                  {(audit.data as Row[]).map((l, i) => (
                    <tr key={String(field(l, '_id', i))}>
                      <td className="mono" style={{ color: 'var(--mute)', whiteSpace: 'nowrap' }}>
                        {field(l, 'createdAt', null) ? new Date(String(field(l, 'createdAt', ''))).toLocaleString() : '—'}
                      </td>
                      <td>{String(field(l, 'actorName', field(l, 'actorId', '—')))}</td>
                      <td className="mono">{String(field(l, 'action', '—'))}</td>
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

const TITLES: Record<string, string> = {
  overview: 'Dashboard', server: 'Server health', users: 'Users', devices: 'Devices',
  families: 'Family trees', helpers: 'Echo helpers', alerts: 'Alerts', audit: 'Audit log', security: 'Security',
};
