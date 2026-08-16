import { useState } from 'react';
import { ChangePasswordCard } from '../components/ChangePasswordCard';
import { motion, AnimatePresence } from 'framer-motion';

type Page =
  | 'overview'
  | 'tree'
  | 'members'
  | 'device'
  | 'location'
  | 'requests'
  | 'alerts'
  | 'security'
  | 'settings';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
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

function NavIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24">
      <path d={d} />
    </svg>
  );
}

export function FamilyDashboard() {
  const [page, setPage] = useState<Page>('overview');

  return (
    <div className="theme-head min-h-screen">
      <div className="cursor-dot" />
      <div className="cursor-ring" />
      <div className="app">
        <Sidebar page={page} setPage={setPage} />
        <main className="main" id="main-content">
          <AnimatePresence mode="wait">
            <motion.div key={page} {...fadeUp}>
              {page === 'overview' && <Overview />}
              {page === 'tree' && <FamilyTree />}
              {page === 'members' && <Members />}
              {page === 'device' && <DeviceView />}
              {page === 'location' && <LocationView />}
              {page === 'requests' && <Requests />}
              {page === 'alerts' && <Alerts />}
              {page === 'security' && <Security />}
              {page === 'settings' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ============================ SIDEBAR ============================ */
function Sidebar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const nav: { section?: string; items: { page: Page; label: string; icon: string; badge?: string; badgeColor?: 'green' | 'red' }[] }[] = [
    {
      items: [
        { page: 'overview', label: 'Overview', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
        { page: 'tree', label: 'Family Tree', icon: 'M9 11H5a2 2 0 0 0-2 2v7h6V11z M15 11h-6v9h6V11z M8 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M16 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' },
        { page: 'members', label: 'Members', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', badge: '5' },
        { page: 'device', label: 'Device', icon: 'M2 3h20v14H2z M8 21h8', badge: '1', badgeColor: 'green' },
        { page: 'location', label: 'Location', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
      ],
    },
    {
      section: 'Access',
      items: [
        { page: 'requests', label: 'Consent Requests', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01', badge: '2' },
        { page: 'alerts', label: 'Alerts', icon: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' },
      ],
    },
    {
      section: 'Account',
      items: [
        { page: 'security', label: 'Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', badge: '2FA', badgeColor: 'green' },
        { page: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' },
      ],
    },
  ];

  return (
    <aside className="sidebar"><a href="#main-content" className="skip-link">Skip to main content</a>
      <a href="#" className="sidebar-logo">
        <ArgLogo />
        ARGES
      </a>
      <div className="sidebar-role">Family Head · Lakshmi</div>

      {nav.map((sec, i) => (
        <div key={i}>
          {sec.section && <div className="nav-section-title">{sec.section}</div>}
          {sec.items.map((n) => (
            <button
              type="button"
              key={n.page}
              className={`nav-item${page === n.page ? ' active' : ''}`}
              onClick={() => setPage(n.page)}
              aria-current={page === n.page ? 'page' : undefined}
            >
              <NavIcon d={n.icon} />
              {n.label}
              {n.badge && (
                <span className={`nav-badge${n.badgeColor ? ' ' + n.badgeColor : ''}`}>{n.badge}</span>
              )}
            </button>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">LA</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Lakshmi Ammal</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Family Head · Mother</div>
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

/* ============================ OVERVIEW ============================ */
function Overview() {
  const stats = [
    {
      icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
      color: 'orange',
      value: 'Ravi',
      label: 'Blind User · Online',
    },
    {
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
      color: 'blue',
      value: '5',
      label: 'Family Members',
    },
    {
      icon: 'M2 3h20v14H2z M8 21h8',
      color: 'green',
      value: '87%',
      label: 'Device Battery',
    },
    {
      icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
      color: 'purple',
      value: '2',
      label: 'Pending Requests',
    },
  ];

  return (
    <div>
      <Topbar title="Family Overview" subtitle="Welcome back, Lakshmi · You have full management access">
        <button className="btn">+ Add Member</button>
      </Topbar>

      <motion.div className="stats-grid" {...stagger}>
        {stats.map((s, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className={`stat-icon ${s.color}`}>
                <svg viewBox="0 0 24 24">
                  <path d={s.icon} />
                </svg>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div>
              <div className="panel-title">Ravi's Status</div>
              <div className="panel-sub">Live data from ARGES glasses</div>
            </div>
            <span className="badge green">
              <span className="dot" />
              Online
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
            {[
              ['Location', 'Home · Coimbatore', '11.0°N 76.9°E'],
              ['Activity', 'Walking', 'Last AI query: 8m ago'],
              ['Face Verify', 'Verified ✓', 'Checked 3m ago'],
              ['Privacy', 'Consent Mode', 'Video requires permission'],
            ].map(([label, val, meta]) => (
              <div key={label} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '0.5px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
                <div style={{ fontWeight: 600, color: label === 'Face Verify' ? 'var(--green)' : 'inherit' }}>{val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", marginTop: 4 }}>{meta}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div>
              <div className="panel-title">Quick Actions</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 14 }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              Request Video Access
            </button>
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 14 }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call Ravi (Two-Way Talk)
            </button>
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 14, borderColor: 'var(--red)', color: 'var(--red)' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Trigger Emergency SOS
            </button>
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 14 }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Add Family Member
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================ FAMILY TREE ============================ */
function FamilyTree() {
  return (
    <div>
      <Topbar title="Family Tree" subtitle="Your family structure · Click any member to manage">
        <button className="btn">+ Add Member</button>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="tree-container">
          <motion.div className="tree-node" whileHover={{ scale: 1.05 }}>
            <div className="user-avatar head" style={{ width: 56, height: 56, fontSize: '1.1rem' }}>LA</div>
            <div className="tree-label">
              <div className="name">Lakshmi (You)</div>
              <div className="role head">Family Head · Mother</div>
            </div>
          </motion.div>
          <div className="tree-connector-v" />
          <motion.div className="tree-node" whileHover={{ scale: 1.05 }}>
            <div className="user-avatar blind" style={{ width: 52, height: 52, fontSize: '1rem' }}>RA</div>
            <div className="tree-label">
              <div className="name">Ravi Kumar</div>
              <div className="role blind">Blind User</div>
            </div>
          </motion.div>
          <div className="tree-connector-v" />
          <div className="tree-row">
            {[
              ['SU', 'Suresh', 'Father'],
              ['KA', 'Karthik', 'Brother'],
              ['PR', 'Priya', 'Sister'],
            ].map(([init, name, role]) => (
              <motion.div key={init} className="tree-node" whileHover={{ scale: 1.05 }}>
                <div className="user-avatar family" style={{ width: 46, height: 46, fontSize: '0.88rem' }}>{init}</div>
                <div className="tree-label">
                  <div className="name">{name}</div>
                  <div className="role">{role}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: 'rgba(255,107,26,0.04)', border: '0.5px solid rgba(255,107,26,0.12)', fontSize: '0.82rem', color: 'var(--muted)', maxWidth: 400, textAlign: 'center' }}>
            As <strong style={{ color: 'var(--green)' }}>Family Head</strong>, you can add/remove members, manage the device, and give viewing instructions. Each member gets their own separate dashboard with their relation shown.
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================ MEMBERS ============================ */
function Members() {
  const rows = [
    { init: 'LA', cls: 'head', name: 'Lakshmi (You)', email: 'lakshmi@email.com', rel: 'Mother', role: <span className="badge green">Family Head</span>, dash: 'This dashboard', status: <span className="badge green"><span className="dot" />Active</span>, actions: <span style={{ fontSize: '0.72rem', color: 'var(--muted-2)' }}>—</span> },
    { init: 'RA', cls: 'blind', name: 'Ravi Kumar', email: 'Blind user', rel: 'Son', role: <span className="badge orange">Blind User</span>, dash: 'On glasses', status: <span className="badge green"><span className="dot" />Wearing</span>, actions: <button className="btn btn-ghost btn-sm">Manage</button> },
    { init: 'SU', cls: 'family', name: 'Suresh Kumar', email: 'suresh@email.com', rel: 'Father', role: <span className="badge gray">Member</span>, dash: 'member.html →', status: <span className="badge green"><span className="dot" />Active</span>, actions: <span><button className="btn btn-ghost btn-sm">Edit</button> <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>Remove</button></span> },
    { init: 'KA', cls: 'family', name: 'Karthik', email: 'karthik@email.com', rel: 'Brother', role: <span className="badge gray">Member</span>, dash: 'member.html →', status: <span className="badge green"><span className="dot" />Active</span>, actions: <span><button className="btn btn-ghost btn-sm">Edit</button> <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>Remove</button></span> },
    { init: 'PR', cls: 'family', name: 'Priya', email: 'priya@email.com', rel: 'Sister', role: <span className="badge gray">Member</span>, dash: 'member.html →', status: <span className="badge yellow"><span className="dot" />Pending Setup</span>, actions: <span><button className="btn btn-ghost btn-sm">Resend Invite</button> <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>Remove</button></span> },
  ];
  return (
    <div>
      <Topbar title="Family Members" subtitle="Each member has their own dashboard · Manage access here">
        <button className="btn">+ Add Member</button>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">All Members</div>
            <div className="panel-sub">5 members in your family tree</div>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Member</th><th>Relation</th><th>Role</th><th>Dashboard</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.init}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className={`user-avatar ${r.cls}`}>{r.init}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{r.email}</div>
                    </div>
                  </div>
                </td>
                <td>{r.rel}</td>
                <td>{r.role}</td>
                <td><span style={{ fontSize: '0.78rem', color: r.dash.includes('member') ? 'var(--blue)' : 'var(--muted)', cursor: r.dash.includes('member') ? 'pointer' : 'default' }}>{r.dash}</span></td>
                <td>{r.status}</td>
                <td>{r.actions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

/* ============================ DEVICE ============================ */
function DeviceView() {
  const stats = [
    { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01', color: 'green', value: 'Online', label: 'Connection Status' },
    { icon: 'M2 3h20v14H2z M8 21h8', color: 'orange', value: '87%', label: 'Battery · 4h remaining' },
    { icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2', color: 'blue', value: '2h 14m', label: 'Uptime Today' },
    { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', color: 'purple', value: 'v2.1.3', label: 'Firmware · Latest' },
  ];
  const controls = [
    { title: 'Request Video Access', sub: 'Ravi must accept via voice before you can see' },
    { title: 'View Location (Always)', sub: 'No consent needed for GPS' },
    { title: 'Push Firmware Update', sub: 'Check for and install updates' },
    { title: 'Lock Device (Remote)', sub: 'Disable all features until unlocked', danger: true },
  ];
  return (
    <div>
      <Topbar title="ARGES Device" subtitle="Manage Ravi's glasses · Full control as Family Head" />
      <motion.div className="stats-grid" {...stagger}>
        {stats.map((s, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className={`stat-icon ${s.color}`}>
                <svg viewBox="0 0 24 24"><path d={s.icon} /></svg>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div className="panel" {...item}>
        <div className="panel-header">
          <div>
            <div className="panel-title">Device Controls</div>
            <div className="panel-sub">As Family Head, you have full device management</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {controls.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              style={{
                padding: 18,
                borderRadius: 14,
                background: c.danger ? 'rgba(239,83,80,0.04)' : 'rgba(255,255,255,0.02)',
                border: `0.5px solid ${c.danger ? 'rgba(239,83,80,0.15)' : 'var(--glass-border)'}`,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 6, color: c.danger ? 'var(--red)' : 'inherit' }}>{c.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{c.sub}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ============================ LOCATION ============================ */
function LocationView() {
  return (
    <div>
      <Topbar title="Ravi's Location" subtitle="Live GPS · Always visible to family (no consent needed)">
        <span className="badge green"><span className="dot" />Updated 3m ago</span>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ position: 'relative', height: 400, borderRadius: 20, overflow: 'hidden', border: '0.5px solid var(--glass-border-hi)', marginBottom: 16, background: 'radial-gradient(ellipse at center, rgba(76,175,80,0.04), transparent 70%), #05050c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)', boxShadow: '0 0 60px rgba(76,175,80,0.15) inset' }} />
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#FF6B1A', boxShadow: '0 0 18px rgba(255,107,26,0.7)', border: '2px solid #fff', zIndex: 2, animation: 'pulse 2s infinite' }} />
          <div style={{ position: 'absolute', bottom: 20, left: 20, fontSize: '0.75rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>11.0°N 76.9°E · Coimbatore</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[
            ['Address', 'Home, Coimbatore'],
            ['Speed', '0 km/h'],
            ['Safe Zone', 'Inside Home'],
            ['Accuracy', '±8m'],
          ].map(([l, v], i) => (
            <div key={i} style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>{l}</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: l === 'Safe Zone' ? 'var(--green)' : 'inherit' }}>{v}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ============================ REQUESTS ============================ */
function Requests() {
  const reqs = [
    { init: 'SU', name: 'Suresh (Father) requests video access', meta: 'Duration: 15 min · Waiting for Ravi\'s response', tinted: true },
    { init: 'KA', name: 'Karthik (Brother) requests audio access', meta: 'Duration: 30 min · Waiting for Ravi\'s response', tinted: false },
  ];
  return (
    <div>
      <Topbar title="Consent Requests" subtitle="Viewing requests from family members" />
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">Pending Requests</div>
            <div className="panel-sub">As Family Head, you can approve/reject on Ravi's behalf</div>
          </div>
        </div>
        {reqs.map((r, i) => (
          <div
            key={i}
            className="request-row"
            style={{
              padding: 16,
              borderRadius: 14,
              background: r.tinted ? 'rgba(255,107,26,0.04)' : 'rgba(255,255,255,0.02)',
              border: `0.5px solid ${r.tinted ? 'rgba(255,107,26,0.12)' : 'var(--glass-border)'}`,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="user-avatar family">{r.init}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{r.meta}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-ghost" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>Cancel</button>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ============================ ALERTS ============================ */
function Alerts() {
  return (
    <div>
      <Topbar title="Alerts" subtitle="SOS, falls, and safety events for Ravi" />
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-title">No alerts. Ravi is safe.</div>
      </motion.div>
    </div>
  );
}

/* ============================ SECURITY ============================ */
function Security() {
  return (
    <div>
      <Topbar title="Security Center" subtitle="Protect your account and family access">
        <span className="badge green"><span className="dot" />Secured</span>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'conic-gradient(var(--green) 0% 90%, rgba(255,255,255,0.06) 90% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const }}>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: 'var(--green)' }}>90%</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Secure</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>Your security score is excellent</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>4 of 5 protections enabled. Add a backup passkey to reach 100%.</div>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div>
              <div className="panel-title">Passkeys</div>
              <div className="panel-sub">Passwordless biometric login</div>
            </div>
            <button className="btn btn-ghost btn-sm">+ Add</button>
          </div>
          <div className="passkey-card">
            <div className="sec-icon key"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><circle cx="12" cy="16" r="1" /></svg></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Windows Hello</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>This laptop · Aug 1, 2026</div></div>
            <span className="badge green">Active</span>
          </div>
          <div className="passkey-card">
            <div className="sec-icon phone"><svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" /></svg></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: '0.88rem' }}>iPhone 15 Pro (Face ID)</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Mobile · Jul 15, 2026</div></div>
            <span className="badge green">Active</span>
          </div>
        </motion.div>

        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div><div className="panel-title">Two-Factor Auth</div></div>
            <span className="badge green">Enabled</span>
          </div>
          <div className="sec-device">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="sec-icon shield"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
              <div><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Authenticator App</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Google Authenticator · 30s codes</div></div>
            </div>
            <button className="btn btn-ghost btn-sm">Reset</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================ SETTINGS ============================ */
function Settings() {
  return (
    <div>
      <Topbar title="Settings" subtitle="Family and account preferences" />
      <ChangePasswordCard />
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header"><div><div className="panel-title">Notifications</div></div></div>
        {[
          ['SOS Alerts', 'Instant push + SMS', true],
          ['Fall Detection', 'Push notification', true],
          ['Low Battery', 'When device below 20%', true],
          ['Face Verify Alerts', 'Unverified wearer detected', true],
        ].map(([title, sub, on]) => (
          <div className="sec-device" key={title as string}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{sub}</div>
            </div>
            <button type="button" role="switch" aria-checked={!!on} aria-label={`Toggle ${title}`} className={`toggle${on ? ' on' : ''}`} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default FamilyDashboard;
