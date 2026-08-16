import { useState } from 'react';
import { ChangePasswordCard } from '../components/ChangePasswordCard';
import { motion, AnimatePresence } from 'framer-motion';

type Page = 'overview' | 'ravi' | 'location' | 'history' | 'security' | 'settings';

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
      <path d="M50 28 C28 28 14 50 14 50 C14 50 28 72 50 72 C72 72 86 50 86 50 C86 50 72 28 50 28 Z" stroke="#42A5F5" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="9" stroke="#42A5F5" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="3.5" fill="#42A5F5" />
    </svg>
  );
}

export function MemberDashboard() {
  const [page, setPage] = useState<Page>('overview');

  return (
    <div className="theme-member min-h-screen">
      <div className="cursor-dot" />
      <div className="cursor-ring" />
      <div className="app">
        <Sidebar page={page} setPage={setPage} />
        <main className="main" id="main-content">
          <AnimatePresence mode="wait">
            <motion.div key={page} {...fadeUp}>
              {page === 'overview' && <Overview />}
              {page === 'ravi' && <RaviStatus />}
              {page === 'location' && <LocationView />}
              {page === 'history' && <History />}
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
        { page: 'ravi', label: "Ravi's Status", icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
        { page: 'location', label: 'Location', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
        { page: 'history', label: 'Viewing History', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2' },
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
      <div className="sidebar-role">Brother · Family Member</div>

      {nav.map((sec, i) => (
        <div key={i}>
          {sec.section && <div className="nav-section-title">{sec.section}</div>}
          {sec.items.map((n) => (
            <button type="button" key={n.page} className={`nav-item${page === n.page ? ' active' : ''}`} onClick={() => setPage(n.page)} aria-current={page === n.page ? 'page' : undefined}>
              <svg viewBox="0 0 24 24"><path d={n.icon} /></svg>
              {n.label}
              {n.badge && <span className={`nav-badge${n.badgeColor ? ' ' + n.badgeColor : ''}`}>{n.badge}</span>}
            </button>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">KA</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Karthik</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Ravi's Brother</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ============================ TOPBAR ============================ */
function Topbar({ title, subtitle, children }: { title: string; subtitle: React.ReactNode; children?: React.ReactNode }) {
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
    { icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', color: 'orange', value: 'Online', label: "Ravi's Status", valColor: 'var(--orange)' },
    { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', color: 'green', value: 'Home', label: 'Current Location' },
    { icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2', color: 'blue', value: '2h', label: 'Since Last Check' },
    { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01', color: 'purple', value: '87%', label: 'Device Battery' },
  ];

  return (
    <div>
      <Topbar title="Hi Karthik" subtitle={<span>You're viewing Ravi's dashboard · You are <strong style={{ color: 'var(--blue)' }}>Ravi's Brother</strong></span>}>
        <button className="btn">Request to View</button>
      </Topbar>

      <motion.div className="stats-grid" {...stagger}>
        {stats.map((s, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className={`stat-icon ${s.color}`}>
                <svg viewBox="0 0 24 24"><path d={s.icon} /></svg>
              </div>
              <div className="stat-value" style={s.valColor ? { color: s.valColor } : undefined}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div>
              <div className="panel-title">Ravi's Live Status</div>
              <div className="panel-sub">Real-time data from ARGES glasses</div>
            </div>
            <span className="badge green"><span className="dot" />Wearing</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Location', 'Home · Coimbatore', 'Updated 3m ago'],
              ['Activity', 'Reading', 'Last AI query: 8m ago'],
              ['Privacy Mode', 'Consent Active', 'Video needs permission'],
              ['Face Verify', 'Verified ✓', 'Confirmed: Ravi'],
            ].map(([label, val, meta]) => (
              <div key={label} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '0.5px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
                <div style={{ fontWeight: 600, color: label === 'Privacy Mode' || label === 'Face Verify' ? 'var(--green)' : 'inherit' }}>{val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>{meta}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: 'rgba(66,165,245,0.04)', border: '0.5px solid rgba(66,165,245,0.12)', fontSize: '0.82rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--blue)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <circle cx="12" cy="8" r="0.5" />
            </svg>
            As a Brother, you can see Ravi's location always. To see video/audio, you must request consent — Ravi will hear your name and relation.
          </div>
        </motion.div>

        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div><div className="panel-title">Quick Actions</div></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn" style={{ justifyContent: 'flex-start', padding: 14 }}>
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
              Call Ravi
            </button>
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 14 }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              View Location (Always Available)
            </button>
          </div>
          <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--glass-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 10, fontWeight: 600 }}>Recent Activity</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 6 }}>· Ravi read a sign · 8m ago</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 6 }}>· Ravi navigated to kitchen · 22m ago</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>· You viewed Ravi · yesterday (15 min)</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================ RAVI STATUS ============================ */
function RaviStatus() {
  const stats = [
    { label: 'Battery', val: '87%', color: 'var(--green)', sub: '~4h remaining' },
    { label: 'Temperature', val: '38°C', color: 'var(--green)', sub: 'Normal range' },
    { label: 'Uptime', val: '2h 14m', color: 'var(--blue)', sub: 'Since last charge' },
  ];
  return (
    <div>
      <Topbar title="Ravi's Status" subtitle="Live data from ARGES glasses">
        <span className="badge green"><span className="dot" />Online · Wearing</span>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div className="user-avatar blind" style={{ width: 64, height: 64, fontSize: '1.3rem' }}>RA</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.5rem' }}>Ravi Kumar</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Your Brother · ARGES Device: ARGES-0014 · v2.1.3</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ padding: 18, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '0.5px solid var(--glass-border)', textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '1.6rem', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 4 }}>{s.sub}</div>
            </div>
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
      <Topbar title="Ravi's Location" subtitle="GPS is always visible to family · No consent needed">
        <span className="badge green"><span className="dot" />Updated 3m ago</span>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ position: 'relative', height: 400, borderRadius: 20, overflow: 'hidden', border: '0.5px solid var(--glass-border-hi)', marginBottom: 16, background: 'radial-gradient(ellipse at center, rgba(66,165,245,0.05), transparent 70%), #05050c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(66,165,245,0.08)', border: '1px solid rgba(66,165,245,0.25)' }} />
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#FF6B1A', boxShadow: '0 0 18px rgba(255,107,26,0.7)', border: '2px solid #fff', zIndex: 2, animation: 'pulse 2s infinite' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            ['Speed', '0 km/h', 'inherit'],
            ['Safe Zone', 'Inside "Home"', 'var(--green)'],
            ['Accuracy', '±8m', 'inherit'],
          ].map(([l, v, c]) => (
            <div key={l} style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>{l}</div>
              <div style={{ fontWeight: 600, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ============================ HISTORY ============================ */
function History() {
  const rows = [
    { date: 'Aug 11, 6:30 PM', dur: '15 min', type: <span className="badge blue">Video + Audio</span>, result: <span className="badge green"><span className="dot" />Accepted</span>, notes: 'Ravi accepted immediately' },
    { date: 'Aug 10, 9:00 AM', dur: '—', type: <span className="badge gray">Video</span>, result: <span className="badge red"><span className="dot" />Declined</span>, notes: 'Ravi was busy' },
    { date: 'Aug 9, 7:15 PM', dur: '30 min', type: <span className="badge blue">Video + Audio</span>, result: <span className="badge green"><span className="dot" />Accepted</span>, notes: 'Ended by Ravi at 7:40' },
    { date: 'Aug 8, 3:00 PM', dur: '10 min', type: <span className="badge gray">Audio Only</span>, result: <span className="badge yellow"><span className="dot" />Auto-Declined</span>, notes: 'No response (30s timeout)' },
    { date: 'Aug 7, 8:00 PM', dur: '15 min', type: <span className="badge blue">Emergency</span>, result: <span className="badge green"><span className="dot" />Auto-Granted</span>, notes: 'Fall detected → instant access' },
  ];
  return (
    <div>
      <Topbar title="Viewing History" subtitle="Your consent-based access sessions" />
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">Your Sessions</div>
            <div className="panel-sub">Every time you viewed Ravi (with consent)</div>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Date</th><th>Duration</th><th>Type</th><th>Result</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem' }}>{r.date}</td>
                <td>{r.dur}</td>
                <td>{r.type}</td>
                <td>{r.result}</td>
                <td style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

/* ============================ SECURITY ============================ */
function Security() {
  return (
    <div>
      <Topbar title="Security" subtitle="Protect your account">
        <span className="badge green"><span className="dot" />Secured</span>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'conic-gradient(var(--green) 0% 85%, rgba(255,255,255,0.06) 85% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const }}>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: 'var(--green)' }}>85%</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Secure</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>Good security</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Add a backup passkey for maximum protection.</div>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div><div className="panel-title">Passkeys</div></div>
            <button className="btn btn-ghost btn-sm">+ Add</button>
          </div>
          <div className="passkey-card">
            <div className="sec-icon key"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><circle cx="12" cy="16" r="1" /></svg></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: '0.88rem' }}>iPhone 14 (Face ID)</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Mobile · Aug 5, 2026</div></div>
            <span className="badge green">Active</span>
          </div>
        </motion.div>
        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div><div className="panel-title">Two-Factor Auth</div></div>
            <span className="badge green">On</span>
          </div>
          <div className="sec-device">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="sec-icon shield"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
              <div><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Authenticator App</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>30s codes · 10 backup codes</div></div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div className="panel" {...item}>
        <div className="panel-header">
          <div><div className="panel-title">Active Sessions</div></div>
        </div>
        <div className="sec-device">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="sec-icon key"><svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" /></svg></div>
            <div><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Safari · iPhone 14</div><div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>Bengaluru · Now</div></div>
          </div>
          <span className="badge green">This device</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================ SETTINGS ============================ */
function Settings() {
  return (
    <div>
      <Topbar title="Settings" subtitle="Your preferences" />
      <ChangePasswordCard />
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header"><div><div className="panel-title">Notifications</div></div></div>
        {[
          ['SOS Alerts', "When Ravi triggers SOS", true],
          ['Fall Detection', "When Ravi's glasses detect a fall", true],
          ['Face Verify Alerts', 'Unverified wearer detected', true],
          ['Location Updates', 'Periodic location summaries', false],
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

export default MemberDashboard;
