import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Page =
  | 'dashboard'
  | 'analytics'
  | 'usermap'
  | 'financial'
  | 'users'
  | 'devices'
  | 'families'
  | 'helpers'
  | 'security'
  | 'faceverify'
  | 'audit'
  | 'alerts'
  | 'server'
  | 'updates'
  | 'settings';

const ADMIN_PASSWORD = 'arges-admin-2026';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const item = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

function ArgLogo() {
  return (
    <svg viewBox="0 0 100 100">
      <path d="M50 28 C28 28 14 50 14 50 C14 50 28 72 50 72 C72 72 86 50 86 50 C86 50 72 28 50 28 Z" stroke="#FF6B1A" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="9" stroke="#FF6B1A" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="3.5" fill="#FF6B1A" />
    </svg>
  );
}

export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState<Page>('dashboard');

  if (!authed) {
    return <AdminGate onAuthed={() => setAuthed(true)} />;
  }

  return (
    <div className="theme-admin min-h-screen">
      <div className="cursor-dot" />
      <div className="cursor-ring" />
      <div className="app">
        <Sidebar page={page} setPage={setPage} />
        <main className="main">
          <AnimatePresence mode="wait">
            <motion.div key={page} {...fadeUp}>
              {page === 'dashboard' && <Dashboard setPage={setPage} />}
              {page === 'analytics' && <Analytics />}
              {page === 'usermap' && <UserMap />}
              {page === 'financial' && <Financial />}
              {page === 'users' && <UsersPage />}
              {page === 'devices' && <DevicesPage />}
              {page === 'families' && <FamiliesPage />}
              {page === 'helpers' && <HelpersPage />}
              {page === 'security' && <SecurityPage />}
              {page === 'faceverify' && <FaceVerify />}
              {page === 'audit' && <AuditLogs />}
              {page === 'alerts' && <AlertsPage />}
              {page === 'server' && <ServerHealth />}
              {page === 'updates' && <UpdatesPage />}
              {page === 'settings' && <SettingsPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ============================ ADMIN GATE ============================ */
function AdminGate({ onAuthed }: { onAuthed: () => void }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  function check() {
    if (pass === ADMIN_PASSWORD) {
      onAuthed();
    } else {
      setError(true);
      setPass('');
      setTimeout(() => setError(false), 3000);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99000,
        background: 'rgba(0,0,8,0.95)',
        backdropFilter: 'blur(60px)',
        WebkitBackdropFilter: 'blur(60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ marginBottom: 24 }}>
          <svg viewBox="0 0 100 100" style={{ width: 64, height: 64, filter: 'drop-shadow(0 0 20px rgba(255,107,26,0.4))' }}>
            <path d="M50 28 C28 28 14 50 14 50 C14 50 28 72 50 72 C72 72 86 50 86 50 C86 50 72 28 50 28 Z" stroke="#FF6B1A" strokeWidth="3" fill="none" />
            <circle cx="50" cy="50" r="9" stroke="#FF6B1A" strokeWidth="3" fill="none" />
            <circle cx="50" cy="50" r="3.5" fill="#FF6B1A" />
          </svg>
        </div>
        <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '1.8rem', marginBottom: 6 }}>ARGES Vision Admin</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.7rem', color: 'var(--orange)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32 }}>Restricted Access · Authorized Personnel Only</div>
        <input
          type="password"
          placeholder="Enter admin password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') check(); }}
          style={{
            width: '100%',
            background: 'var(--glass)',
            border: `0.5px solid ${error ? 'var(--red)' : 'var(--glass-border-hi)'}`,
            borderRadius: 14,
            padding: '14px 20px',
            color: 'var(--white)',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            textAlign: 'center',
            marginBottom: 16,
            transition: 'border-color .3s',
          }}
        />
        {error && <div style={{ color: 'var(--red)', fontSize: '0.82rem', marginBottom: 12 }}>Incorrect password. Access denied.</div>}
        <button onClick={check} style={{ width: '100%', background: 'var(--orange)', color: '#000', padding: 14, borderRadius: 14, fontWeight: 600, fontSize: '0.92rem', border: 'none', cursor: 'pointer', transition: 'all .3s', boxShadow: '0 4px 20px var(--orange-glow)' }}>Authenticate →</button>
        <button onClick={onAuthed} style={{ width: '100%', background: 'transparent', color: 'var(--muted)', padding: 10, borderRadius: 14, fontWeight: 500, fontSize: '0.78rem', border: '0.5px solid var(--glass-border)', cursor: 'pointer', transition: 'all .3s', marginTop: 8 }}>Skip (Preview Mode)</button>
        <div style={{ marginTop: 20, fontSize: '0.72rem', color: 'var(--muted-2)' }}>Protected by Passkey + 2FA · All access is logged</div>
      </div>
    </div>
  );
}

/* ============================ SIDEBAR ============================ */
function Sidebar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const sections: { title: string; items: { page: Page; label: string; icon: string; badge?: string; badgeColor?: 'green' | 'red' }[] }[] = [
    {
      title: 'Overview',
      items: [
        { page: 'dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
        { page: 'analytics', label: 'Analytics', icon: 'M18 20V10 M12 20V4 M6 20v-6' },
        { page: 'usermap', label: 'User Map', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
        { page: 'financial', label: 'Financial', icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
      ],
    },
    {
      title: 'Management',
      items: [
        { page: 'users', label: 'Users', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', badge: '2,847' },
        { page: 'devices', label: 'Devices', icon: 'M2 3h20v14H2z M8 21h8 M12 17v4', badge: '1,924', badgeColor: 'green' },
        { page: 'families', label: 'Family Trees', icon: 'M9 11H5a2 2 0 0 0-2 2v7h6V11z M15 11h-6v9h6V11z M8 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M16 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', badge: '1,203' },
        { page: 'helpers', label: 'Helpers', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', badge: '486' },
      ],
    },
    {
      title: 'Security',
      items: [
        { page: 'security', label: 'Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', badge: '2FA', badgeColor: 'green' },
        { page: 'faceverify', label: 'Face Verify', icon: 'M23 7l-7 5 7 5V7z M1 5h15v14H1z M8 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', badge: '2', badgeColor: 'red' },
        { page: 'audit', label: 'Audit Logs', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8' },
      ],
    },
    {
      title: 'System',
      items: [
        { page: 'alerts', label: 'Alerts', icon: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01', badge: '3', badgeColor: 'red' },
        { page: 'server', label: 'Server Health', icon: 'M2 2h20v8H2z M2 14h20v8H2z M6 6h.01 M6 18h.01' },
        { page: 'updates', label: 'Updates & OTA', icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3' },
        { page: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <ArgLogo />
        ARGES
      </div>
      <div className="sidebar-role">Admin Control Panel</div>

      {sections.map((sec) => (
        <div className="nav-section" key={sec.title}>
          <div className="nav-section-title">{sec.title}</div>
          {sec.items.map((n) => (
            <div key={n.page} className={`nav-item${page === n.page ? ' active' : ''}`} onClick={() => setPage(n.page)}>
              <svg viewBox="0 0 24 24"><path d={n.icon} /></svg>
              {n.label}
              {n.badge && <span className={`nav-badge${n.badgeColor ? ' ' + n.badgeColor : ''}`}>{n.badge}</span>}
            </div>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">AD</div>
          <div className="info">
            <div className="name">Admin</div>
            <div className="role">Super Admin · ARGES</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ============================ TOPBAR ============================ */
function Topbar({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        <div className="subtitle">{subtitle}</div>
      </div>
      <div className="topbar-actions">{children}</div>
    </div>
  );
}

/* ============================ DASHBOARD ============================ */
function Dashboard({ setPage }: { setPage: (p: Page) => void }) {
  const stats = [
    { icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', color: 'orange', value: '923', label: 'Active Blind Users', trend: '↑ 47 this week' },
    { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', color: 'blue', value: '1,924', label: 'Paired Devices (Online)', trend: '↑ 12 today' },
    { icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', color: 'green', value: '486', label: 'Active Helpers (Echo)', trend: '↑ 8 new' },
    { icon: 'M9 11H5a2 2 0 0 0-2 2v7h6V11z M15 11h-6v9h6V11z M8 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M16 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', color: 'purple', value: '1,203', label: 'Family Trees', trend: '↑ 23 this month' },
  ];

  const recentUsers = [
    { init: 'RA', cls: 'blind', name: 'Ravi Kumar', email: 'ravi.k@email.com', type: <span className="badge orange"><span className="dot" />Blind</span>, status: <span className="badge green"><span className="dot" />Active</span>, joined: '2h ago' },
    { init: 'LA', cls: 'family', name: 'Lakshmi Ammal', email: 'lakshmi.a@email.com', type: <span className="badge gray">Family (Mother)</span>, status: <span className="badge green"><span className="dot" />Active</span>, joined: '5h ago' },
    { init: 'VS', cls: 'helper', name: 'Vikram Singh', email: 'vikram.s@email.com', type: <span className="badge gray">Helper (Echo)</span>, status: <span className="badge yellow"><span className="dot" />Pending</span>, joined: '1d ago' },
    { init: 'PD', cls: 'blind', name: 'Priya Devi', email: 'priya.d@email.com', type: <span className="badge orange"><span className="dot" />Blind</span>, status: <span className="badge red"><span className="dot" />Suspended</span>, joined: '3d ago' },
    { init: 'KA', cls: 'family', name: 'Karthik (Brother)', email: 'karthik.r@email.com', type: <span className="badge gray">Family (Brother)</span>, status: <span className="badge green"><span className="dot" />Active</span>, joined: '5d ago' },
  ];

  const activity = [
    { color: 'var(--green-bright)', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01', title: <><strong>Ravi Kumar</strong> paired new ARGES device</>, time: '2 min ago' },
    { color: 'var(--orange)', icon: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01', title: <><strong>SOS triggered</strong> by Priya Devi · Coimbatore</>, time: '12 min ago' },
    { color: '#AB47BC', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', title: <><strong>Vikram Singh</strong> helped 2 users via Echo</>, time: '28 min ago' },
    { color: '#42A5F5', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', title: <><strong>Lakshmi Ammal</strong> accepted viewing request</>, time: '45 min ago' },
  ];

  const health = [
    { dot: 'green', label: 'API Server (FastAPI)', val: '42ms · 99.9%' },
    { dot: 'green', label: 'Database (Supabase)', val: '8ms · 99.9%' },
    { dot: 'green', label: 'LiveKit Streaming', val: '24ms · 99.8%' },
    { dot: 'yellow', label: 'Bhashini (TTS/STT)', val: '180ms · 97.2%' },
    { dot: 'green', label: 'OTA Update Server', val: '12ms · 100%' },
  ];

  return (
    <div>
      <Topbar title="Dashboard" subtitle="System overview · Real-time monitoring">
        <button className="btn btn-ghost">+ Add User</button>
        <button className="btn">Broadcast Alert</button>
      </Topbar>

      <motion.div className="stats-grid" {...stagger}>
        {stats.map((s, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className={`stat-icon ${s.color}`}>
                <svg viewBox="0 0 24 24"><path d={s.icon} /></svg>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-trend up">{s.trend}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid-2">
        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div>
              <div className="panel-title">Recent Users</div>
              <div className="panel-sub">Latest registrations across all types</div>
            </div>
            <a className="panel-action" onClick={() => setPage('users')} style={{ cursor: 'pointer' }}>View all →</a>
          </div>
          <table>
            <thead>
              <tr><th>User</th><th>Type</th><th>Status</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.init}>
                  <td>
                    <div className="user-cell">
                      <div className={`user-avatar ${u.cls}`}>{u.init}</div>
                      <div>
                        <div className="user-name">{u.name}</div>
                        <div className="user-meta">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.type}</td>
                  <td>{u.status}</td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: 'var(--muted)' }}>{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div className="panel" {...item}>
            <div className="panel-header">
              <div><div className="panel-title">Live Activity</div></div>
              <span className="badge green"><span className="dot" />Live</span>
            </div>
            {activity.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-icon" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <svg viewBox="0 0 24 24" style={{ stroke: a.color }}><path d={a.icon} /></svg>
                </div>
                <div className="activity-content">
                  <div className="activity-title">{a.title}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div className="panel" {...item}>
            <div className="panel-header">
              <div><div className="panel-title">Server Health</div></div>
              <span className="badge green"><span className="dot" />All Systems Operational</span>
            </div>
            {health.map((h) => (
              <div className="health-row" key={h.label}>
                <div className="health-label">
                  <span className={`dot ${h.dot}`} />
                  {h.label}
                </div>
                <div className="health-value">{h.val}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ============================ ANALYTICS ============================ */
function Analytics() {
  const stats = [
    { icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', color: 'orange', value: '923', label: 'Blind Users', trend: '↑ 12% MoM' },
    { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', color: 'blue', value: '2,847', label: 'Total Users', trend: '↑ 18% MoM' },
    { icon: 'M22 12h-4l-3 9L9 3l-3 9H2', color: 'green', value: '7.2h', label: 'Avg Daily Usage', trend: '↑ 0.4h' },
    { icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', color: 'purple', value: '48k', label: 'AI Queries (30d)', trend: '↑ 23%' },
  ];
  return (
    <div>
      <Topbar title="Analytics" subtitle="Growth, usage, and engagement insights">
        <button className="btn btn-ghost">Export Report</button>
      </Topbar>
      <motion.div className="stats-grid" {...stagger}>
        {stats.map((s, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className={`stat-icon ${s.color}`}><svg viewBox="0 0 24 24"><path d={s.icon} /></svg></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-trend up">{s.trend}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div className="panel" {...item}>
        <div className="panel-header">
          <div><div className="panel-title">Top AI Features Used</div></div>
        </div>
        {([
          ['Object Detection', '18.2k', 88, 'var(--orange)'],
          ['OCR Reading', '12.7k', 62, 'var(--orange-bright)'],
          ['Currency ID', '6.4k', 31, 'var(--yellow)'],
          ['Face Recognition', '4.1k', 20, '#42A5F5'],
          ['Navigation', '3.8k', 18, '#AB47BC'],
        ] as const).map(([label, val, pct, color]) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: '0.85rem' }}>{label}</span>
              <span style={{ fontSize: '0.78rem', fontFamily: "'JetBrains Mono',monospace", color: color as string }}>{val}</span>
            </div>
            <div style={{ height: 5, background: 'var(--glass-border-hi)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ============================ USER MAP ============================ */
function UserMap() {
  const users = [
    { init: 'RA', cls: 'blind', name: 'Ravi Kumar', city: 'Coimbatore, TN', status: 'online' },
    { init: 'AN', cls: 'blind', name: 'Anjali Rao', city: 'Bengaluru, KA', status: 'online' },
    { init: 'PD', cls: 'blind', name: 'Priya Devi', city: 'Chennai, TN', status: 'online' },
    { init: 'MI', cls: 'blind', name: 'Mohammed Irfan', city: 'Mumbai, MH', status: 'offline' },
    { init: 'SR', cls: 'blind', name: 'Sneha Reddy', city: 'Hyderabad, TS', status: 'online' },
    { init: 'VS', cls: 'helper', name: 'Vikram Singh', city: 'Pune, MH', status: 'online' },
  ];
  return (
    <div>
      <Topbar title="User Map" subtitle="All ARGES users across India · Click a user to focus">
        <button className="btn btn-ghost btn-sm">All</button>
        <button className="btn btn-ghost btn-sm">Blind</button>
        <button className="btn btn-ghost btn-sm">SOS</button>
      </Topbar>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, height: 'calc(100vh - 200px)', minHeight: 600 }}>
          <div style={{ overflowY: 'auto', paddingRight: 4 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>Users (923)</div>
            {users.map((u) => (
              <motion.div key={u.init} whileHover={{ x: 2 }} style={{ padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--glass-border)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div className={`map-card-avatar ${u.cls}`} style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}>{u.init}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{u.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{u.city}</div>
                </div>
                <span className={`badge ${u.status === 'online' ? 'green' : 'gray'}`} style={{ fontSize: '0.6rem', padding: '2px 7px' }}><span className="dot" />{u.status === 'online' ? 'Online' : 'Offline'}</span>
              </motion.div>
            ))}
          </div>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', border: '0.5px solid var(--glass-border-hi)', background: 'radial-gradient(ellipse at 50% 40%, rgba(255,107,26,0.06), transparent 60%), #05050c' }}>
            {/* India markers */}
            <div style={{ position: 'absolute', top: '60%', left: '42%', width: 14, height: 14, borderRadius: '50%', background: '#FF6B1A', boxShadow: '0 0 12px rgba(255,107,26,0.7)', border: '2px solid #fff', animation: 'pulse 2s infinite' }} />
            <div style={{ position: 'absolute', top: '50%', left: '48%', width: 14, height: 14, borderRadius: '50%', background: '#FF6B1A', boxShadow: '0 0 12px rgba(255,107,26,0.7)', border: '2px solid #fff' }} />
            <div style={{ position: 'absolute', top: '55%', left: '55%', width: 14, height: 14, borderRadius: '50%', background: '#EF5350', boxShadow: '0 0 14px rgba(239,83,80,0.8)', border: '2px solid #fff', animation: 'pulse 1.5s infinite' }} />
            <div style={{ position: 'absolute', top: '30%', left: '30%', width: 14, height: 14, borderRadius: '50%', background: '#AB47BC', boxShadow: '0 0 12px rgba(171,71,188,0.7)', border: '2px solid #fff' }} />
            <div style={{ position: 'absolute', top: '70%', left: '35%', width: 14, height: 14, borderRadius: '50%', background: '#FF6B1A', boxShadow: '0 0 12px rgba(255,107,26,0.7)', border: '2px solid #fff' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, fontSize: '0.72rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>India · 7 cities · 923 users</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================ FINANCIAL ============================ */
function Financial() {
  const metrics = [
    { label: 'Revenue (MTD)', value: '₹8.4L', trend: '↑ 18%' },
    { label: 'MRR (Recurring)', value: '₹1.4L', trend: '↑ 12%' },
    { label: 'Active Subscriptions', value: '287', trend: '↑ 23' },
    { label: 'Avg Order Value', value: '₹10,847', trend: '↑ ₹340' },
  ];
  return (
    <div>
      <Topbar title="Financial" subtitle="Revenue, subscriptions, and unit economics">
        <button className="btn btn-ghost">Export Report</button>
      </Topbar>
      <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }} {...stagger}>
        {metrics.map((m, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className="stat-label" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{m.label}</div>
              <div className="stat-value">{m.value}</div>
              <div className="stat-trend up">{m.trend}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div className="panel" {...item}>
        <div className="panel-header">
          <div><div className="panel-title">Subscription Tiers</div></div>
        </div>
        {[
          ['ARGES One (₹9,999)', '614 units · ₹61.3L', 'var(--orange-bright)'],
          ['ARGES Family (₹12,999)', '309 units · ₹40.2L', 'var(--green-bright)'],
          ['ARGES Care (₹49/mo)', '287 active · ₹1.4L/mo', '#AB47BC'],
          ['NGO/Govt Bulk (₹7,499)', '47 units · ₹3.5L', 'var(--blue)'],
        ].map(([label, val, color]) => (
          <div className="health-row" key={label}>
            <div className="health-label" style={{ color }}>{label}</div>
            <div className="health-value">{val}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ============================ USERS ============================ */
function UsersPage() {
  const users = [
    { init: 'RA', cls: 'blind', name: 'Ravi Kumar', email: 'ravi.k@email.com', type: <span className="badge orange"><span className="dot" />Blind</span>, paired: '—', status: <span className="badge green"><span className="dot" />Active</span>, loc: 'Coimbatore, TN', la: '2m ago' },
    { init: 'LA', cls: 'family', name: 'Lakshmi Ammal', email: 'lakshmi.a@email.com', type: <span className="badge gray">Family (Mother)</span>, paired: 'Ravi Kumar', status: <span className="badge green"><span className="dot" />Active</span>, loc: 'Coimbatore, TN', la: '5m ago' },
    { init: 'KA', cls: 'family', name: 'Karthik Ravi', email: 'karthik.r@email.com', type: <span className="badge gray">Family (Brother)</span>, paired: 'Ravi Kumar', status: <span className="badge green"><span className="dot" />Active</span>, loc: 'Bengaluru, KA', la: '1h ago' },
    { init: 'PD', cls: 'blind', name: 'Priya Devi', email: 'priya.d@email.com', type: <span className="badge orange"><span className="dot" />Blind</span>, paired: '—', status: <span className="badge red"><span className="dot" />Suspended</span>, loc: 'Chennai, TN', la: '2d ago' },
    { init: 'VS', cls: 'helper', name: 'Vikram Singh', email: 'vikram.s@email.com', type: <span className="badge gray">Helper (Echo)</span>, paired: '—', status: <span className="badge yellow"><span className="dot" />Pending</span>, loc: 'Pune, MH', la: '1d ago' },
  ];
  return (
    <div>
      <Topbar title="Users" subtitle="Manage all blind users, family members, and helpers">
        <button className="btn">+ Add User</button>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header">
          <div><div className="panel-title">All Users</div><div className="panel-sub">2,847 total · 923 blind · 1,438 family · 486 helpers</div></div>
        </div>
        <table>
          <thead>
            <tr><th>User</th><th>Type</th><th>Paired To</th><th>Status</th><th>Location</th><th>Last Active</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.init}>
                <td>
                  <div className="user-cell">
                    <div className={`user-avatar ${u.cls}`}>{u.init}</div>
                    <div>
                      <div className="user-name">{u.name}</div>
                      <div className="user-meta">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>{u.type}</td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{u.paired}</td>
                <td>{u.status}</td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{u.loc}</td>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: 'var(--muted)' }}>{u.la}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

/* ============================ DEVICES ============================ */
function DevicesPage() {
  const stats = [
    { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01', color: 'green', value: '1,924', label: 'Online Devices', trend: '↑ 12 today' },
    { icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2', color: 'orange', value: '96%', label: 'Avg Uptime (30d)' },
    { icon: 'M2 3h20v14H2z M8 21h8', color: 'blue', value: 'v2.1.3', label: 'Latest Firmware' },
    { icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3', color: 'purple', value: '1,807', label: 'Devices on Latest FW' },
  ];
  const devices = [
    { id: 'ARGES-0014', user: 'Ravi Kumar', fw: 'v2.1.3', status: 'online', bat: '87%', temp: '38°C', up: '2h' },
    { id: 'ARGES-0089', user: 'Priya Devi', fw: 'v2.1.3', status: 'updating', bat: '42%', temp: '41°C', up: '6h' },
    { id: 'ARGES-0234', user: 'Mohammed Irfan', fw: 'v2.0.8', status: 'offline', bat: '—', temp: '—', up: '2d' },
    { id: 'ARGES-0512', user: 'Anjali Rao', fw: 'v2.1.3', status: 'online', bat: '94%', temp: '35°C', up: '8h' },
  ];
  const statusColor: Record<string, string> = { online: 'green', offline: 'red', updating: 'yellow' };
  return (
    <div>
      <Topbar title="Devices" subtitle="All ARGES hardware units · 1,924 online · 87 offline">
        <button className="btn">Push OTA Update</button>
      </Topbar>
      <motion.div className="stats-grid" {...stagger}>
        {stats.map((s, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className={`stat-icon ${s.color}`}><svg viewBox="0 0 24 24"><path d={s.icon} /></svg></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              {s.trend && <div className="stat-trend up">{s.trend}</div>}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div className="panel" {...item}>
        <div className="panel-header">
          <div><div className="panel-title">All Devices</div><div className="panel-sub">Firmware distribution: 94% v2.1.3 · 4% v2.0.8 · 2% older</div></div>
        </div>
        <div className="device-grid">
          {devices.map((d) => (
            <motion.div key={d.id} className="device-card" whileHover={{ y: -4 }}>
              <div className="device-header">
                <div>
                  <div className="device-name">{d.id}</div>
                  <div className="device-user">{d.user} · {d.fw}</div>
                </div>
                <span className={`badge ${statusColor[d.status]}`}><span className="dot" />{d.status.charAt(0).toUpperCase() + d.status.slice(1)}</span>
              </div>
              <div className="device-stats">
                <div className="device-stat"><div className="v">{d.bat}</div><div className="l">Battery</div></div>
                <div className="device-stat"><div className="v">{d.temp}</div><div className="l">Temp</div></div>
                <div className="device-stat"><div className="v">{d.up}</div><div className="l">{d.status === 'offline' ? 'Last seen' : 'Uptime'}</div></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ============================ FAMILIES ============================ */
function FamiliesPage() {
  const families = [
    { blind: 'Ravi Kumar', members: 5, relations: 'Mother, Father, Brother, Sister', created: 'Aug 2026' },
    { blind: 'Priya Devi', members: 3, relations: 'Uncle, Aunt', created: 'Jul 2026' },
    { blind: 'Anjali Rao', members: 4, relations: 'Father, Mother, Cousin', created: 'Jul 2026' },
    { blind: 'Mohammed Irfan', members: 2, relations: 'Spouse', created: 'Jun 2026' },
    { blind: 'Sneha Reddy', members: 6, relations: 'Father, Mother, 2 Brothers, Sister', created: 'Jun 2026' },
  ];
  return (
    <div>
      <Topbar title="Family Trees" subtitle="Visualize and manage family connections">
        <button className="btn">+ New Family</button>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header">
          <div><div className="panel-title">All Families</div><div className="panel-sub">1,203 family trees registered</div></div>
        </div>
        <table>
          <thead>
            <tr><th>Blind User</th><th>Members</th><th>Relations</th><th>Created</th></tr>
          </thead>
          <tbody>
            {families.map((f) => (
              <tr key={f.blind}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar blind">{f.blind.split(' ').map((x) => x[0]).join('').slice(0, 2)}</div>
                    <div className="user-name">{f.blind}</div>
                  </div>
                </td>
                <td><span className="badge orange">{f.members}</span></td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{f.relations}</td>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: 'var(--muted)' }}>{f.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

/* ============================ HELPERS ============================ */
function HelpersPage() {
  const helpers = [
    { rank: 1, n: 'Vikram Singh', loc: 'Pune, MH', sessions: 284, rating: 4.9, status: 'active' },
    { rank: 2, n: 'Deepa Nair', loc: 'Kochi, KL', sessions: 231, rating: 4.8, status: 'active' },
    { rank: 3, n: 'Rahul Mehta', loc: 'Mumbai, MH', sessions: 198, rating: 4.9, status: 'active' },
    { rank: 4, n: 'Saritha Joshi', loc: 'Bengaluru, KA', sessions: 167, rating: 4.7, status: 'active' },
    { rank: 5, n: 'Arjun Pillai', loc: 'Thiruvananthapuram, KL', sessions: 142, rating: 4.8, status: 'active' },
  ];
  const statusColor: Record<string, string> = { active: 'green', pending: 'yellow' };
  return (
    <div>
      <Topbar title="Helpers" subtitle="Echo Network volunteers providing remote vision">
        <button className="btn">+ Add Helper</button>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header">
          <div><div className="panel-title">Helper Leaderboard</div><div className="panel-sub">Top volunteers by help sessions this month</div></div>
        </div>
        <table>
          <thead>
            <tr><th>Rank</th><th>Helper</th><th>Location</th><th>Sessions</th><th>Rating</th><th>Status</th></tr>
          </thead>
          <tbody>
            {helpers.map((h) => (
              <tr key={h.rank}>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: h.rank <= 3 ? 'var(--orange)' : 'var(--muted)' }}>#{h.rank}</td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar helper">{h.n.split(' ').map((x) => x[0]).join('').slice(0, 2)}</div>
                    <div className="user-name">{h.n}</div>
                  </div>
                </td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{h.loc}</td>
                <td><span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{h.sessions}</span></td>
                <td><span style={{ color: 'var(--yellow)' }}>★</span> <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{h.rating}</span></td>
                <td><span className={`badge ${statusColor[h.status]}`}><span className="dot" />{h.status.charAt(0).toUpperCase() + h.status.slice(1)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

/* ============================ SECURITY PAGE ============================ */
function SecurityPage() {
  return (
    <div>
      <Topbar title="Security" subtitle="Authentication, sessions, and access control">
        <span className="badge green"><span className="dot" />Secured</span>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header">
          <div><div className="panel-title">Passkeys (WebAuthn)</div><div className="panel-sub">Passwordless biometric login</div></div>
          <button className="btn btn-ghost btn-sm">+ Add Passkey</button>
        </div>
        <div className="passkey-card">
          <div className="sec-icon key"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><circle cx="12" cy="16" r="1" /></svg></div>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Windows Hello</div><div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>This laptop · Created Aug 1, 2026</div></div>
          <span className="badge green">Active</span>
        </div>
        <div className="passkey-card">
          <div className="sec-icon phone"><svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" /></svg></div>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>iPhone 15 Pro (Face ID)</div><div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Mobile · Created Jul 15, 2026</div></div>
          <span className="badge green">Active</span>
        </div>
      </motion.div>
      <motion.div className="panel" {...item}>
        <div className="panel-header">
          <div><div className="panel-title">Two-Factor Authentication</div></div>
          <span className="badge green">Enabled</span>
        </div>
        <div className="sec-device">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="sec-icon shield"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
            <div><div style={{ fontSize: '0.88rem', fontWeight: 600 }}>TOTP (Google Authenticator)</div><div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>6-digit code · 30s rotation</div></div>
          </div>
          <button className="btn btn-ghost btn-sm">Reconfigure</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================ FACE VERIFY ============================ */
function FaceVerify() {
  const stats = [
    { icon: 'M23 7l-7 5 7 5V7z M1 5h15v14H1z M8 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', color: 'purple', value: '99.7%', label: 'Model Accuracy' },
    { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01', color: 'green', value: '1,841', label: 'Verified Wearers' },
    { icon: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4', color: 'red', value: '2', label: 'Unverified (Flagged)' },
    { icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2', color: 'orange', value: '5 min', label: 'Check Interval' },
  ];
  return (
    <div>
      <Topbar title="Face Verification" subtitle="Anti-transfer detection · On-device face ID">
        <span className="badge orange"><span className="dot" />2 Unverified Wearers</span>
      </Topbar>
      <motion.div className="stats-grid" {...stagger}>
        {stats.map((s, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className={`stat-icon ${s.color}`}><svg viewBox="0 0 24 24"><path d={s.icon} /></svg></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div className="panel" {...item}>
        <div className="panel-header">
          <div><div className="panel-title">How It Works</div></div>
        </div>
        {[
          ['1', 'var(--orange)', '#000', 'Enrollment', "During setup, the blind user's face is captured from 5 angles. A 128-dimensional face embedding is generated using MobileFaceNet and stored on-device only."],
          ['2', 'var(--orange)', '#000', 'Periodic Verification', 'Every 5 minutes, the camera captures a frame and compares the current wearer\'s face embedding against the enrolled one. Uses cosine similarity with threshold 0.65 (99.7% accuracy).'],
          ['3', 'var(--red)', '#fff', 'Transfer Detection', "If the face doesn't match for 2 consecutive checks (10 min), the device is flagged. All family members + admins receive an instant alert."],
          ['4', 'var(--red)', '#fff', 'Auto-Lock', "After 3 failed checks, the device locks and requires the blind user's registered phone to unlock via passkey. Only the rightful owner can restore it."],
        ].map(([num, bg, fg, title, desc]) => (
          <div key={num as string} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: bg as string, color: fg as string, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>{num}</div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ============================ AUDIT LOGS ============================ */
function AuditLogs() {
  const stats = [
    { icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6', color: 'blue', value: '14,287', label: 'Total Events (30d)' },
    { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01', color: 'green', value: '472', label: "Today's Events" },
    { icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2', color: 'orange', value: '7', label: 'High-Risk Actions' },
    { icon: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4', color: 'red', value: '0', label: 'Failed Access Attempts' },
  ];
  const logs = [
    { type: 'security', action: 'Remote-locked device ARGES-0734 (failed face verify)', who: 'admin@arges', when: '2m ago' },
    { type: 'access', action: 'Impersonated user: Ravi Kumar (support ticket #4892)', who: 'admin@arges', when: '18m ago' },
    { type: 'create', action: 'Pushed OTA v2.2.0 to 100% of devices', who: 'admin@arges', when: '1h ago' },
    { type: 'delete', action: 'Suspended user: Priya Devi (violation of ToS)', who: 'admin@arges', when: '2h ago' },
    { type: 'update', action: 'Updated feature flag: MediScan → ENABLED', who: 'admin@arges', when: '5h ago' },
    { type: 'access', action: 'Override accessed device ARGES-0014 (emergency SOS)', who: 'admin@arges', when: '6h ago' },
  ];
  const dotColor: Record<string, string> = { security: 'var(--orange)', access: 'var(--blue)', create: 'var(--green-bright)', update: 'var(--yellow)', delete: 'var(--red)' };
  const badgeColor: Record<string, string> = { security: 'orange', access: 'gray', create: 'green', update: 'yellow', delete: 'red' };
  return (
    <div>
      <Topbar title="Audit Logs" subtitle="Every admin action is recorded and immutable">
        <button className="btn btn-ghost">Export (DPDP)</button>
      </Topbar>
      <motion.div className="stats-grid" {...stagger}>
        {stats.map((s, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className={`stat-icon ${s.color}`}><svg viewBox="0 0 24 24"><path d={s.icon} /></svg></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div className="panel" {...item}>
        <div className="panel-header">
          <div><div className="panel-title">Action Timeline</div><div className="panel-sub">Immutable · Tamper-proof · Blockchain-hashed</div></div>
        </div>
        {logs.map((l, i) => (
          <div className="log-entry" key={i}>
            <div className="log-dot" style={{ background: dotColor[l.type] }} />
            <div className="log-content">
              <div>{l.action}</div>
              <div className="log-meta">{l.who} · {l.when}</div>
            </div>
            <span className={`badge ${badgeColor[l.type]}`} style={{ textTransform: 'capitalize' }}>{l.type}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ============================ ALERTS ============================ */
function AlertsPage() {
  const stats = [
    { icon: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4', color: 'orange', value: '3', label: 'Critical (Unresolved)' },
    { icon: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', color: 'red', value: '47', label: 'SOS Events (7d)' },
    { icon: 'M12 2L2 22h20L12 2z', color: 'yellow', value: '112', label: 'Fall Detections (7d)' },
    { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01', color: 'green', value: '98%', label: 'Resolution Rate' },
  ];
  const alerts = [
    { type: 'SOS', user: 'Priya Devi', loc: 'Coimbatore, TN', time: '12m ago', status: 'unresolved' },
    { type: 'Fall', user: 'Arjun Nair', loc: 'Kochi, KL', time: '28m ago', status: 'resolved' },
    { type: 'Hazard', user: 'Ravi Kumar', loc: 'Coimbatore, TN', time: '1h ago', status: 'resolved' },
    { type: 'SOS', user: 'Sneha Reddy', loc: 'Hyderabad, TS', time: '2h ago', status: 'resolved' },
    { type: 'Fall', user: 'Vijay Kumar', loc: 'Chennai, TN', time: '3h ago', status: 'resolved' },
  ];
  const typeColor: Record<string, string> = { SOS: 'red', Fall: 'yellow', Hazard: 'orange', Stranger: 'purple' };
  const statusColor: Record<string, string> = { resolved: 'green', unresolved: 'red' };
  return (
    <div>
      <Topbar title="Alerts" subtitle="SOS, falls, hazards, and system alerts">
        <button className="btn btn-ghost">Resolve All</button>
        <button className="btn">Broadcast</button>
      </Topbar>
      <motion.div className="stats-grid" {...stagger}>
        {stats.map((s, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className={`stat-icon ${s.color}`}><svg viewBox="0 0 24 24"><path d={s.icon} /></svg></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div className="panel" {...item}>
        <div className="panel-header">
          <div><div className="panel-title">Alert Timeline</div><div className="panel-sub">Most recent first</div></div>
        </div>
        <table>
          <thead>
            <tr><th>Type</th><th>User</th><th>Location</th><th>Time</th><th>Status</th></tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => (
              <tr key={i}>
                <td><span className={`badge ${typeColor[a.type] || 'gray'}`}>{a.type}</span></td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar blind" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>{a.user.split(' ').map((x) => x[0]).join('').slice(0, 2)}</div>
                    <div className="user-name" style={{ fontSize: '0.85rem' }}>{a.user}</div>
                  </div>
                </td>
                <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{a.loc}</td>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: 'var(--muted)' }}>{a.time}</td>
                <td><span className={`badge ${statusColor[a.status]}`}><span className="dot" />{a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

/* ============================ SERVER HEALTH ============================ */
function ServerHealth() {
  const services = [
    { dot: 'green', label: 'API Server (FastAPI)', val: '42ms · 99.9% uptime' },
    { dot: 'green', label: 'Database (Supabase)', val: '8ms · 99.9%' },
    { dot: 'green', label: 'LiveKit Streaming', val: '24ms · 99.8%' },
    { dot: 'yellow', label: 'Bhashini (TTS/STT)', val: '180ms · 97.2%' },
    { dot: 'green', label: 'OTA Update Server', val: '12ms · 100%' },
  ];
  return (
    <div>
      <Topbar title="Server Health" subtitle="Real-time infrastructure monitoring">
        <span className="badge green"><span className="dot" />All Systems Operational</span>
      </Topbar>
      <div className="grid-2">
        <motion.div className="panel" {...item}>
          <div className="panel-header"><div><div className="panel-title">Service Status</div></div></div>
          {services.map((s) => (
            <div className="health-row" key={s.label}>
              <div className="health-label"><span className={`dot ${s.dot}`} />{s.label}</div>
              <div className="health-value">{s.val}</div>
            </div>
          ))}
        </motion.div>
        <motion.div className="panel" {...item}>
          <div className="panel-header"><div><div className="panel-title">System Resources</div></div></div>
          {([
            ['CPU Usage', '23%', 23, 'var(--green-bright)'],
            ['Memory', '67%', 67, 'var(--yellow)'],
            ['Disk', '41%', 41, 'var(--green-bright)'],
            ['Bandwidth', '78%', 78, 'var(--orange)'],
          ] as const).map(([label, pct, w, color]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.82rem' }}>{label}</span>
                <span style={{ fontSize: '0.82rem', fontFamily: "'JetBrains Mono',monospace", color: color as string }}>{pct}</span>
              </div>
              <div style={{ height: 6, background: 'var(--glass-border-hi)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ============================ UPDATES ============================ */
function UpdatesPage() {
  return (
    <div>
      <Topbar title="Updates & OTA" subtitle="Push firmware updates to ARGES devices">
        <button className="btn">+ New OTA Campaign</button>
      </Topbar>
      <div className="grid-2">
        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div><div className="panel-title">Firmware Versions</div><div className="panel-sub">Distribution across all devices</div></div>
          </div>
          <div className="health-row">
            <div className="health-label" style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--green-bright)' }}>v2.1.3 (latest)</div>
            <div className="health-value">1,807 devices · 94%</div>
          </div>
          <div className="health-row">
            <div className="health-label" style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--yellow)' }}>v2.0.8</div>
            <div className="health-value">77 devices · 4%</div>
          </div>
          <div className="health-row">
            <div className="health-label" style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--muted)' }}>v1.9.x (legacy)</div>
            <div className="health-value">38 devices · 2%</div>
          </div>
        </motion.div>
        <motion.div className="panel" {...item}>
          <div className="panel-header"><div><div className="panel-title">Active OTA Campaigns</div></div></div>
          <div style={{ padding: '12px 0' }}>
            <div style={{ padding: 16, background: 'rgba(255,107,26,0.05)', border: '0.5px solid rgba(255,107,26,0.15)', borderRadius: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>v2.1.3 → v2.2.0 Rollout</span>
                <span className="badge orange">In Progress</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 10 }}>Bug fixes + Bhashini offline pack + improved YOLO model</div>
              <div style={{ height: 6, background: 'var(--glass-border-hi)', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: '34%', background: 'var(--orange)', borderRadius: 999 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>
                <span>623 / 1,807 updated</span>
                <span>34%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================ SETTINGS ============================ */
function SettingsPage() {
  const flags: [string, string, boolean][] = [
    ['Consent-Based Privacy', 'Require blind user consent before family video access', true],
    ['Echo Network', 'Enable volunteer helper system', true],
    ['OmniAccess', 'Allow device control (phone/laptop)', true],
    ['Companion AI', 'Emotional wellness monitoring', true],
    ['MediScan', 'Drug interaction checker (beta)', false],
    ['New Registrations', 'Allow new users to sign up', true],
  ];
  return (
    <div>
      <Topbar title="Settings" subtitle="Admin configuration and feature flags" />
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header">
          <div><div className="panel-title">Feature Flags</div><div className="panel-sub">Toggle features globally</div></div>
        </div>
        {flags.map(([title, sub, on]) => (
          <div key={title} className="toggle-row">
            <div>
              <div style={{ fontSize: '0.88rem' }}>{title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{sub}</div>
            </div>
            <div className={`toggle${on ? ' on' : ''}`} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
