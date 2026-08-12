import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Page = 'overview' | 'requests' | 'history' | 'map' | 'reputation' | 'security' | 'settings';

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
      <path d="M50 28 C28 28 14 50 14 50 C14 50 28 72 50 72 C72 72 86 50 86 50 C86 50 72 28 50 28 Z" stroke="#AB47BC" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="9" stroke="#AB47BC" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="3.5" fill="#AB47BC" />
    </svg>
  );
}

export function HelperDashboard() {
  const [page, setPage] = useState<Page>('overview');

  return (
    <div className="theme-helper min-h-screen">
      <div className="cursor-dot" />
      <div className="cursor-ring" />
      <div className="app">
        <Sidebar page={page} setPage={setPage} />
        <main className="main">
          <AnimatePresence mode="wait">
            <motion.div key={page} {...fadeUp}>
              {page === 'overview' && <Overview setPage={setPage} />}
              {page === 'requests' && <Requests />}
              {page === 'history' && <History />}
              {page === 'map' && <RequestMap />}
              {page === 'reputation' && <Reputation />}
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
        { page: 'overview', label: 'Dashboard', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
        { page: 'requests', label: 'Help Requests', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', badge: '3', badgeColor: 'red' },
        { page: 'history', label: 'Session History', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2' },
        { page: 'map', label: 'Request Map', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
      ],
    },
    {
      section: 'Your Profile',
      items: [
        { page: 'reputation', label: 'Reputation', icon: 'M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' },
        { page: 'security', label: 'Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', badge: '2FA', badgeColor: 'green' },
        { page: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <a href="#" className="sidebar-logo">
        <ArgLogo />
        ARGES
      </a>
      <div className="sidebar-role">Echo Helper · Verified</div>

      {nav.map((sec, i) => (
        <div key={i}>
          {sec.section && <div className="nav-section-title">{sec.section}</div>}
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
          <div className="avatar">VS</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Vikram Singh</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Helper · Pune · ★4.9</div>
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

/* ============================ REQUEST CARDS DATA ============================ */
const REQUESTS = [
  { init: 'AN', name: 'Anjali Rao · Mysuru, KA', meta: 'Requesting for 2 minutes · Urgent', msg: '"I\'m at a bus stop and can\'t read the bus number. Can someone help me?"', urgent: true },
  { init: 'MK', name: 'Mohammed K. · Hyderabad, TS', meta: 'Requesting for 45 seconds', msg: '"I need help finding the right platform at the train station."', urgent: false },
  { init: 'SR', name: 'Sneha R. · Chennai, TN', meta: 'Requesting for 30 seconds', msg: '"There\'s a sign here I can\'t read. Can you tell me what it says?"', urgent: false },
];

function RequestCard({ r }: { r: typeof REQUESTS[number] }) {
  return (
    <motion.div
      className={`request-card${r.urgent ? ' urgent' : ''}`}
      whileHover={{ y: -4 }}
      style={{
        padding: 20,
        borderRadius: 18,
        background: r.urgent ? 'rgba(239,83,80,0.04)' : 'rgba(171,71,188,0.04)',
        border: `0.5px solid ${r.urgent ? 'rgba(239,83,80,0.3)' : 'rgba(171,71,188,0.15)'}`,
        marginBottom: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="req-avatar" style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--orange),var(--orange-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem', color: '#000' }}>{r.init}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{r.meta}</div>
          </div>
        </div>
        <span className={`badge ${r.urgent ? 'red' : 'yellow'}`}><span className="dot" />{r.urgent ? 'Urgent' : 'Waiting'}</span>
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 14, lineHeight: 1.5 }}>{r.msg}</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn" style={{ background: 'var(--green)', color: '#000' }}>Accept &amp; Help →</button>
        <button className="btn btn-ghost btn-sm">Decline</button>
      </div>
    </motion.div>
  );
}

/* ============================ OVERVIEW ============================ */
function Overview(_: { setPage: (p: Page) => void }) {
  const stats = [
    { icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', color: 'purple', value: '284', label: 'People Helped', valColor: 'var(--purple)' },
    { icon: 'M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2', color: 'yellow', value: '4.9', label: 'Avg Rating', valColor: 'var(--yellow)' },
    { icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2', color: 'green', value: '2.4s', label: 'Avg Response Time', valColor: 'var(--green)' },
    { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01', color: 'orange', value: 'Rank #1', label: 'Top Helper (Monthly)', valColor: 'var(--orange)' },
  ];

  return (
    <div>
      <Topbar title="Helper Dashboard" subtitle={<span>You're <strong style={{ color: 'var(--purple)' }}>online</strong> · Available to help blind users via Echo Network</span>}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="toggle on" style={{ width: 44, height: 24 }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Available</span>
        </div>
      </Topbar>

      <motion.div className="stats-grid" {...stagger}>
        {stats.map((s, i) => (
          <motion.div key={i} {...item}>
            <motion.div className="stat-card" whileHover={{ y: -8 }}>
              <div className={`stat-icon ${s.color}`}>
                <svg viewBox="0 0 24 24"><path d={s.icon} /></svg>
              </div>
              <div className="stat-value" style={{ color: s.valColor }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="panel" {...item}>
        <div className="panel-header">
          <div>
            <div className="panel-title">Active Help Requests</div>
            <div className="panel-sub">Blind users requesting vision assistance right now</div>
          </div>
          <span className="badge red"><span className="dot" />3 waiting</span>
        </div>
        {REQUESTS.map((r) => (
          <RequestCard key={r.init} r={r} />
        ))}
      </motion.div>
    </div>
  );
}

/* ============================ REQUESTS ============================ */
function Requests() {
  return (
    <div>
      <Topbar title="Help Requests" subtitle="Real-time requests from blind users" />
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header">
          <div><div className="panel-title">Active Requests</div></div>
        </div>
        {REQUESTS.map((r) => (
          <RequestCard key={r.init} r={r} />
        ))}
      </motion.div>
    </div>
  );
}

/* ============================ HISTORY ============================ */
function History() {
  const rows = [
    { user: 'Sneha R.', topic: 'Read signboard', dur: '3 min', rating: '5.0', date: '2h ago' },
    { user: 'Ravi K.', topic: 'Find keys', dur: '5 min', rating: '5.0', date: '5h ago' },
    { user: 'Arjun N.', topic: 'Bus number', dur: '2 min', rating: '4.8', date: '1d ago' },
    { user: 'Priya D.', topic: 'Navigate station', dur: '8 min', rating: '5.0', date: '2d ago' },
    { user: 'Meena K.', topic: 'Read medicine label', dur: '4 min', rating: '5.0', date: '3d ago' },
  ];
  return (
    <div>
      <Topbar title="Session History" subtitle="Your past help sessions" />
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header">
          <div><div className="panel-title">Last 30 Days</div></div>
        </div>
        <table>
          <thead>
            <tr><th>User</th><th>Topic</th><th>Duration</th><th>Rating</th><th>Date</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.user}</td>
                <td>{r.topic}</td>
                <td>{r.dur}</td>
                <td><span style={{ color: 'var(--yellow)' }}>★</span> {r.rating}</td>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: 'var(--muted)' }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

/* ============================ REQUEST MAP ============================ */
function RequestMap() {
  return (
    <div>
      <Topbar title="Request Map" subtitle="Nearby blind users needing help">
        <span className="badge red"><span className="dot" />3 active nearby</span>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ position: 'relative', height: 450, borderRadius: 20, overflow: 'hidden', border: '0.5px solid var(--glass-border-hi)', background: 'radial-gradient(ellipse at 50% 50%, rgba(171,71,188,0.06), transparent 60%), #05050c' }}>
          {/* Helper center marker */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: '50%', background: '#AB47BC', boxShadow: '0 0 14px rgba(171,71,188,0.7)', border: '2px solid #fff', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 200, height: 200, borderRadius: '50%', background: 'rgba(171,71,188,0.06)', border: '1px dashed rgba(171,71,188,0.2)' }} />
          {/* Request markers */}
          <div style={{ position: 'absolute', top: '32%', left: '38%', width: 14, height: 14, borderRadius: '50%', background: '#EF5350', boxShadow: '0 0 12px rgba(239,83,80,0.7)', border: '2px solid #fff', animation: 'pulse 1.5s infinite' }} />
          <div style={{ position: 'absolute', top: '58%', left: '64%', width: 14, height: 14, borderRadius: '50%', background: '#F9A825', boxShadow: '0 0 12px rgba(249,168,37,0.7)', border: '2px solid #fff', animation: 'pulse 2s infinite' }} />
          <div style={{ position: 'absolute', top: '70%', left: '30%', width: 14, height: 14, borderRadius: '50%', background: '#F9A825', boxShadow: '0 0 12px rgba(249,168,37,0.7)', border: '2px solid #fff', animation: 'pulse 2s infinite' }} />
          <div style={{ position: 'absolute', bottom: 16, left: 16, fontSize: '0.72rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>Pune · 18.5°N 73.8°E</div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================ REPUTATION ============================ */
function Reputation() {
  const badges = [
    { color: 'var(--yellow)', bg: 'rgba(249,168,37,0.15)', icon: 'M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2', title: 'Top Helper', sub: 'Rank #1 monthly' },
    { color: 'var(--purple)', bg: 'rgba(171,71,188,0.15)', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', title: '250+ Club', sub: '284 helped' },
    { color: 'var(--green)', bg: 'rgba(76,175,80,0.15)', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01', title: 'Verified', sub: 'ID confirmed' },
    { color: 'var(--blue)', bg: 'rgba(66,165,245,0.15)', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2', title: 'Fast Responder', sub: 'Avg 2.4s' },
  ];
  return (
    <div>
      <Topbar title="Reputation" subtitle="Your impact and badges" />
      <motion.div className="stats-grid" {...stagger}>
        <motion.div {...item}>
          <motion.div className="stat-card" whileHover={{ y: -8 }}>
            <div className="stat-icon purple"><svg viewBox="0 0 24 24"><path d="M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg></div>
            <div className="stat-value" style={{ color: 'var(--purple)' }}>284</div>
            <div className="stat-label">Total Sessions</div>
          </motion.div>
        </motion.div>
        <motion.div {...item}>
          <motion.div className="stat-card" whileHover={{ y: -8 }}>
            <div className="stat-icon yellow"><svg viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2" /></svg></div>
            <div className="stat-value" style={{ color: 'var(--yellow)' }}>47h</div>
            <div className="stat-label">Hours Volunteered</div>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header"><div><div className="panel-title">Badges Earned</div></div></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {badges.map((b) => (
            <motion.div key={b.title} whileHover={{ y: -6 }} style={{ textAlign: 'center', padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--glass-border)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `radial-gradient(circle,${b.bg},transparent)`, border: `2px solid ${b.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={b.color} strokeWidth="1.5"><path d={b.icon} /></svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{b.title}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{b.sub}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ============================ SECURITY ============================ */
function Security() {
  return (
    <div>
      <Topbar title="Security" subtitle="Your account is protected">
        <span className="badge green"><span className="dot" />Verified + Secured</span>
      </Topbar>
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'conic-gradient(var(--green) 0% 100%, rgba(255,255,255,0.06) 100% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const }}>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: 'var(--green)' }}>100%</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Secure</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>Perfect security score</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Identity verified · Passkey · 2FA · All protections enabled.</div>
          </div>
        </div>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <motion.div className="panel" {...item}>
          <div className="panel-header">
            <div><div className="panel-title">Identity Verified</div></div>
            <span className="badge green"><span className="dot" />Confirmed</span>
          </div>
          <div style={{ padding: 14, borderRadius: 14, background: 'rgba(76,175,80,0.04)', border: '0.5px solid rgba(76,175,80,0.12)', fontSize: '0.82rem', color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--green)' }}>Aadhaar verified</strong> on Aug 1, 2026 · Phone confirmed · Background check passed. Required for all Echo Network helpers.
          </div>
        </motion.div>
        <motion.div className="panel" {...item}>
          <div className="panel-header"><div><div className="panel-title">Authentication</div></div></div>
          <div style={{ padding: '14px 0' }}>
            <div style={{ fontSize: '0.85rem', marginBottom: 6 }}>Passkey: <span style={{ color: 'var(--green)' }}>iPhone Face ID ✓</span></div>
            <div style={{ fontSize: '0.85rem', marginBottom: 6 }}>2FA: <span style={{ color: 'var(--green)' }}>TOTP Active ✓</span></div>
            <div style={{ fontSize: '0.85rem' }}>Biometric Lock: <span style={{ color: 'var(--green)' }}>On ✓</span></div>
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
      <Topbar title="Settings" subtitle="Helper preferences" />
      <motion.div className="panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="panel-header"><div><div className="panel-title">Availability</div></div></div>
        <div style={{ padding: '12px 0', borderBottom: '0.5px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Auto-accept urgent requests</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Skip queue for emergencies</div>
          </div>
          <div className="toggle" />
        </div>
        <div style={{ padding: '12px 0', borderBottom: '0.5px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Languages I can help in</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>English, Hindi, Marathi</div>
          </div>
          <button className="btn btn-ghost btn-sm">Edit</button>
        </div>
        <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Max distance from me</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>50 km (remote OK)</div>
          </div>
          <button className="btn btn-ghost btn-sm">Edit</button>
        </div>
      </motion.div>
    </div>
  );
}

export default HelperDashboard;
