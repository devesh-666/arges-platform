import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../components/DashboardLayout';
import type { NavSection } from '../components/DashboardLayout';
import { StatCard } from '../components/GlassPanel';
import { Badge } from '../components/Badge';
import { UserAvatar } from '../components/UserAvatar';
import { ArgesLogo } from '../components/ArgesLogo';
import { fadeUp, stagger, scaleIn, slideInRight, EASE } from '../animations';

const ADMIN_PASSWORD = 'arges-admin-2026';

const SECTIONS: NavSection[] = [
  {
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
      { page: 'users', label: 'Users', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', badge: '923', badgeColor: 'blue' },
      { page: 'devices', label: 'Devices', icon: 'M2 3h20v14H2z M8 21h8', badge: '1924', badgeColor: 'green' },
      { page: 'families', label: 'Families', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87' },
      { page: 'helpers', label: 'Helpers', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', badge: '486', badgeColor: 'purple' },
    ],
  },
  {
    title: 'System',
    items: [
      { page: 'security', label: 'Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', badge: '2FA', badgeColor: 'green' },
      { page: 'faceverify', label: 'Face Verify', icon: 'M23 7l-7 5 7 5V7z M1 5h15v14H1z' },
      { page: 'audit', label: 'Audit Logs', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
      { page: 'alerts', label: 'Alerts', icon: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', badge: '5', badgeColor: 'red' },
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      { page: 'server', label: 'Server', icon: 'M2 2h20v8H2z M2 14h20v8H2z M6 6h.01 M6 18h.01', badge: 'Up', badgeColor: 'green' },
      { page: 'updates', label: 'Updates', icon: 'M21 2v6h-6 M3 12a9 9 0 0 1 15-6.7L21 8 M3 22v-6h6 M21 12a9 9 0 0 1-15 6.7L3 16' },
      { page: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' },
    ],
  },
];

export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [preview, setPreview] = useState(false);

  if (!authed && !preview) {
    return <PasswordGate onSuccess={() => setAuthed(true)} onSkip={() => setPreview(true)} />;
  }

  return (
    <>
      {preview && (
        <div className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-[rgba(249,168,37,0.12)] border border-[rgba(249,168,37,0.3)] text-[#F9A825] text-xs font-mono">
          Preview Mode · Unauthenticated
        </div>
      )}
      <DashboardLayout
        themeClass="theme-admin"
        roleLabel="Admin Control Panel"
        userName="Admin"
        userInitials="AD"
        userRole={authed ? 'Administrator' : 'Preview Mode'}
        avatarType="admin"
        sections={SECTIONS}
      >
        {(page) => {
          if (page === 'dashboard') return <Dashboard />;
          if (page === 'analytics') return <Analytics />;
          if (page === 'usermap') return <UserMap />;
          if (page === 'financial') return <Financial />;
          if (page === 'users') return <Users />;
          if (page === 'devices') return <Devices />;
          if (page === 'families') return <Families />;
          if (page === 'helpers') return <Helpers />;
          if (page === 'security') return <SecurityPage />;
          if (page === 'faceverify') return <FaceVerify />;
          if (page === 'audit') return <AuditLogs />;
          if (page === 'alerts') return <Alerts />;
          if (page === 'server') return <Server />;
          if (page === 'updates') return <Updates />;
          if (page === 'settings') return <Settings />;
          return <div className="p-6 glass rounded-3xl"><p className="text-[#8B8B9A]">Coming in full build</p></div>;
        }}
      </DashboardLayout>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                               PASSWORD GATE                                */
/* -------------------------------------------------------------------------- */

function PasswordGate({ onSuccess, onSkip }: { onSuccess: () => void; onSkip: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div
      className="theme-admin min-h-screen flex items-center justify-center p-6"
      style={{ background: 'radial-gradient(ellipse at center, #14142B, #05050C)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: shake ? [0, -10, 10, -10, 10, 0] : 0,
        }}
        transition={{ duration: shake ? 0.4 : 0.6, ease: EASE }}
        className="glass specular p-8 rounded-3xl w-full max-w-md"
        style={{ boxShadow: '0 30px 80px rgba(255,107,26,0.15)' }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: EASE }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,107,26,0.1)', border: '1px solid rgba(255,107,26,0.25)' }}
          >
            <ArgesLogo size={32} color="#FF6B1A" />
          </motion.div>
          <h1 className="font-display font-bold text-2xl">Admin Access</h1>
          <p className="text-sm text-[#8B8B9A] mt-1">Enter your administrator password to continue</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <svg viewBox="0 0 24 24" width="18" height="18" className="stroke-[#8B8B9A] fill-none absolute left-4 top-1/2 -translate-y-1/2" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Password"
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-[rgba(255,255,255,0.03)] border text-sm outline-none transition-all ${
                error
                  ? 'border-[rgba(239,83,80,0.5)] text-[#EF5350]'
                  : 'border-[rgba(255,255,255,0.10)] focus:border-[rgba(255,107,26,0.4)]'
              }`}
            />
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-[#EF5350] font-mono"
              >
                Incorrect password. Try again.
              </motion.p>
            )}
          </AnimatePresence>
          <button
            type="submit"
            data-hover
            className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#FF6B1A] text-black hover:opacity-90 transition-opacity"
          >
            Unlock Admin Panel
          </button>
        </form>

        <button
          onClick={onSkip}
          data-hover
          className="w-full mt-3 py-3 rounded-xl text-xs font-mono text-[#8B8B9A] hover:text-white transition-colors"
        >
          Skip (Preview Mode)
        </button>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               SHARED HELPERS                               */
/* -------------------------------------------------------------------------- */

function PageHeader({ title, subtitle, right }: { title: string; subtitle: string; right?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="font-display font-bold text-2xl">{title}</h1>
        <p className="text-sm text-[#8B8B9A] mt-0.5">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 DASHBOARD                                  */
/* -------------------------------------------------------------------------- */

interface MockUser {
  initials: string;
  name: string;
  email: string;
  role: 'Blind User' | 'Helper' | 'Family';
  status: 'Active' | 'Pending' | 'Suspended';
  joined: string;
}

const RECENT_USERS: MockUser[] = [
  { initials: 'RK', name: 'Ravi Kumar', email: 'ravi.k@mail.com', role: 'Blind User', status: 'Active', joined: '2m ago' },
  { initials: 'VS', name: 'Vikram Singh', email: 'vikram.s@mail.com', role: 'Helper', status: 'Active', joined: '14m ago' },
  { initials: 'AR', name: 'Anjali Rao', email: 'anjali.r@mail.com', role: 'Blind User', status: 'Active', joined: '38m ago' },
  { initials: 'LA', name: 'Lakshmi Ammal', email: 'lakshmi.a@mail.com', role: 'Family', status: 'Active', joined: '1h ago' },
  { initials: 'MK', name: 'Mohammed K', email: 'mohammed.k@mail.com', role: 'Blind User', status: 'Pending', joined: '2h ago' },
];

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="System Overview"
        subtitle="Full platform control · Real-time metrics"
        right={<Badge variant="green" dot>All Systems Operational</Badge>}
      />

      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>}
          value="923"
          label="Blind Users"
          accent="orange"
          trend="↑ 12 this week"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /></svg>}
          value="1,924"
          label="Paired Devices"
          accent="green"
          trend="↑ 47 today"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
          value="486"
          label="Helpers"
          accent="purple"
          trend="↑ 8 this week"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M9 11H5a2 2 0 0 0-2 2v7h6V11z M15 11h-6v9h6V11z M21 13a2 2 0 0 0-2-2h-4v9h6v-7z" /></svg>}
          value="1,203"
          label="Family Trees"
          accent="blue"
          trend="↑ 23 today"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 mb-5">
        {/* RECENT USERS TABLE */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass specular p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-5">
            <div>
              <div className="font-display font-semibold text-lg">Recent Users</div>
              <div className="text-xs text-[#8B8B9A]">Latest 5 signups</div>
            </div>
            <Badge variant="orange">+23 today</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['User', 'Role', 'Status', 'Joined'].map((h) => (
                    <th key={h} className="text-left font-mono text-[0.68rem] uppercase tracking-wider text-[#8B8B9A] font-normal pb-3 border-b border-[rgba(255,255,255,0.06)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_USERS.map((u) => (
                  <tr key={u.email} className="hover:bg-[rgba(255,255,255,0.02)] transition-all">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={u.name} type={u.role === 'Helper' ? 'helper' : u.role === 'Blind User' ? 'blind' : 'family'} size={32} />
                        <div>
                          <div className="text-sm font-semibold">{u.name}</div>
                          <div className="text-[0.7rem] text-[#8B8B9A]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><Badge variant={u.role === 'Helper' ? 'purple' : u.role === 'Blind User' ? 'orange' : 'blue'}>{u.role}</Badge></td>
                    <td><Badge variant={u.status === 'Active' ? 'green' : u.status === 'Pending' ? 'yellow' : 'red'} dot>{u.status}</Badge></td>
                    <td className="text-xs text-[#8B8B9A] font-mono">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* LIVE ACTIVITY FEED */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass specular p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-5">
            <div className="font-display font-semibold text-lg">Live Activity</div>
            <Badge variant="green" dot>Streaming</Badge>
          </div>
          <div className="space-y-3">
            {[
              ['RK', 'Ravi Kumar connected device #ARG-04821', 'blue', 'now'],
              ['VS', 'Vikram S. accepted a help request', 'purple', '12s'],
              ['LA', 'Lakshmi approved family consent request', 'green', '1m'],
              ['AR', 'Anjali R. triggered SOS — auto-resolved', 'red', '3m'],
            ].map(([ini, msg, color, time]) => (
              <motion.div
                key={msg}
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-all"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[0.7rem] font-bold flex-shrink-0"
                  style={{
                    background: `rgba(${color === 'green' ? '76,175,80' : color === 'purple' ? '171,71,188' : color === 'red' ? '239,83,80' : '66,165,245'},0.12)`,
                    color: color === 'green' ? '#4CAF50' : color === 'purple' ? '#AB47BC' : color === 'red' ? '#EF5350' : '#42A5F5',
                  }}
                >
                  {ini}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{msg}</div>
                  <div className="text-[0.68rem] font-mono text-[#555566] mt-0.5">{time} ago</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SERVER HEALTH */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass specular p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="font-display font-semibold text-lg">Server Health</div>
            <div className="text-xs text-[#8B8B9A]">All 5 core services</div>
          </div>
          <Badge variant="green" dot>99.98% uptime</Badge>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            ['API Gateway', '12ms', 'green', 18],
            ['Database', '4ms', 'green', 32],
            ['AI Inference', '240ms', 'orange', 68],
            ['Face Verify', '89ms', 'green', 45],
            ['Streaming', '15ms', 'green', 22],
          ].map(([name, latency, color, load]) => (
            <motion.div
              key={name}
              variants={scaleIn}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="p-4 rounded-2xl glass"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-[#4CAF50]' : 'bg-[#FF6B1A]'}`} style={{ animation: 'pulse 2s infinite' }} />
                <span className="text-[0.65rem] font-mono text-[#8B8B9A]">{latency}</span>
              </div>
              <div className="font-semibold text-sm mb-2">{name}</div>
              <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${load}%` }}
                  transition={{ duration: 1, ease: EASE, delay: 0.2 }}
                  className={`h-full rounded-full ${color === 'green' ? 'bg-[#4CAF50]' : 'bg-[#FF6B1A]'}`}
                />
              </div>
              <div className="text-[0.65rem] font-mono text-[#8B8B9A] mt-1">{load}% load</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SECONDARY PAGES                               */
/* -------------------------------------------------------------------------- */

function Analytics() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Platform-wide usage and growth metrics" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M18 20V10 M12 20V4 M6 20v-6" /></svg>} value="48.2k" label="Sessions Today" accent="orange" trend="↑ 18%" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /></svg>} value="92.4%" label="Retention (30d)" accent="green" trend="↑ 2.1%" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>} value="1.4M" label="AI Queries (Month)" accent="blue" trend="↑ 24%" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>} value="2.1s" label="Avg Response" accent="purple" />
      </div>
      <div className="glass specular p-6 rounded-3xl">
        <div className="font-display font-semibold text-lg mb-5">Daily Active Users · Last 14 Days</div>
        <div className="flex items-end justify-between gap-2 h-48">
          {[42, 48, 55, 50, 62, 70, 68, 75, 82, 78, 88, 92, 85, 96].map((h, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
              className="flex-1 rounded-t-md origin-bottom"
              style={{ height: `${h}%`, background: 'linear-gradient(180deg, #FF6B1A, rgba(255,107,26,0.3))' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserMap() {
  return (
    <div>
      <PageHeader title="User Map" subtitle="Geographic distribution across India" right={<Badge variant="orange">923 users</Badge>} />
      <div className="glass specular p-6 rounded-3xl">
        <div
          className="h-[440px] rounded-[20px] overflow-hidden border border-[rgba(255,255,255,0.18)] relative flex items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, #1A1A2E, #0A0A18)' }}
        >
          {[
            ['Bengaluru', '40%', '52%', 312],
            ['Chennai', '55%', '62%', 187],
            ['Mumbai', '32%', '38%', 144],
            ['Hyderabad', '48%', '48%', 121],
            ['Coimbatore', '42%', '58%', 89],
          ].map(([city, top, left, count], i) => (
            <motion.div
              key={city}
              className="absolute flex flex-col items-center"
              style={{ top, left }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, ease: EASE }}
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: EASE }}
                className="absolute w-10 h-10 rounded-full bg-[#FF6B1A]"
              />
              <div className="w-3 h-3 rounded-full bg-[#FF6B1A]" style={{ boxShadow: '0 0 16px rgba(255,107,26,0.7)' }} />
              <div className="text-[0.7rem] font-mono text-white mt-1 whitespace-nowrap">{city} · {count}</div>
            </motion.div>
          ))}
          <div className="absolute bottom-4 left-4 font-mono text-[0.65rem] text-[#8B8B9A] uppercase tracking-wider">User Density · India</div>
        </div>
      </div>
    </div>
  );
}

function Financial() {
  return (
    <div>
      <PageHeader title="Financial" subtitle="Revenue, payouts, and platform economics" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>} value="₹4.2Cr" label="Revenue (Month)" accent="green" trend="↑ 22%" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>} value="₹1.8Cr" label="Helper Payouts" accent="orange" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>} value="₹2.4Cr" label="Net Profit" accent="blue" trend="↑ 18%" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg>} value="482" label="Active Subscriptions" accent="purple" />
      </div>
      <div className="glass specular p-6 rounded-3xl">
        <div className="font-display font-semibold text-lg mb-4">Recent Transactions</div>
        <div className="space-y-2">
          {[
            ['Helper Payout', 'Vikram Singh', '−₹4,200', 'red'],
            ['Subscription', 'Ravi Kumar', '+₹999', 'green'],
            ['Helper Payout', 'Anjali Rao', '−₹2,800', 'red'],
            ['Device Sale', 'ARG-04821', '+₹24,999', 'green'],
          ].map(([type, who, amount, color]) => (
            <div key={who as string} className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)]">
              <div className="flex items-center gap-3">
                <UserAvatar name={who} type="helper" size={32} />
                <div>
                  <div className="text-sm font-semibold">{type} · {who}</div>
                  <div className="text-xs text-[#8B8B9A]">Just now</div>
                </div>
              </div>
              <span className={`font-mono font-semibold text-sm ${color === 'green' ? 'text-[#4CAF50]' : 'text-[#EF5350]'}`}>{amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Users() {
  return (
    <div>
      <PageHeader title="Users" subtitle="All 923 registered users" right={<Badge variant="blue">923 total</Badge>} />
      <div className="glass specular p-6 rounded-3xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {['User', 'Email', 'Role', 'Status', 'Joined'].map((h) => (
                <th key={h} className="text-left font-mono text-[0.68rem] uppercase tracking-wider text-[#8B8B9A] font-normal pb-3 border-b border-[rgba(255,255,255,0.06)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_USERS.concat([
              { initials: 'SR', name: 'Sneha R', email: 'sneha.r@mail.com', role: 'Blind User' as const, status: 'Active' as const, joined: '3h ago' },
              { initials: 'PG', name: 'Priya G', email: 'priya.g@mail.com', role: 'Family' as const, status: 'Active' as const, joined: '4h ago' },
            ]).map((u) => (
              <tr key={u.email} className="hover:bg-[rgba(255,255,255,0.02)] transition-all">
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={u.name} type={u.role === 'Helper' ? 'helper' : u.role === 'Blind User' ? 'blind' : 'family'} size={32} />
                    <span className="text-sm font-semibold">{u.name}</span>
                  </div>
                </td>
                <td className="text-sm text-[#8B8B9A]">{u.email}</td>
                <td><Badge variant={u.role === 'Helper' ? 'purple' : u.role === 'Blind User' ? 'orange' : 'blue'}>{u.role}</Badge></td>
                <td><Badge variant={u.status === 'Active' ? 'green' : u.status === 'Pending' ? 'yellow' : 'red'} dot>{u.status}</Badge></td>
                <td className="text-xs text-[#8B8B9A] font-mono">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Devices() {
  return (
    <div>
      <PageHeader title="Devices" subtitle="1,924 paired ARGES units" right={<Badge variant="green" dot>1,901 online</Badge>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>} value="1,901" label="Online" accent="green" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /></svg>} value="1,924" label="Total Paired" accent="orange" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /></svg>} value="23" label="Offline" accent="purple" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>} value="47" label="Pending Updates" accent="blue" />
      </div>
      <div className="glass specular p-6 rounded-3xl">
        <div className="font-display font-semibold text-lg mb-4">Firmware Distribution</div>
        <div className="space-y-3">
          {[['v2.1.3', 'Latest', 1842, 'green'], ['v2.1.2', 'Stable', 58, 'blue'], ['v2.0.x', 'Legacy', 24, 'yellow']].map(([ver, label, count, color]) => (
            <div key={ver as string} className="flex items-center gap-4">
              <div className="w-20 font-mono text-sm">{ver}</div>
              <Badge variant={color as 'green'}>{label}</Badge>
              <div className="flex-1 h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(Number(count) / 1924) * 100}%` }} transition={{ duration: 1, ease: EASE }} className="h-full bg-[#FF6B1A] rounded-full" />
              </div>
              <span className="font-mono text-xs text-[#8B8B9A] w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Families() {
  return (
    <div>
      <PageHeader title="Families" subtitle="1,203 family trees · 3,891 members" right={<Badge variant="blue">1,203</Badge>} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          ['Kumar Family', '5 members', 'Coimbatore', 'active'],
          ['Rao Family', '4 members', 'Mysuru', 'active'],
          ['Singh Family', '6 members', 'Delhi', 'active'],
          ['Khan Family', '3 members', 'Hyderabad', 'pending'],
        ].map(([name, members, city, status]) => (
          <motion.div key={name} variants={fadeUp} initial="hidden" animate="visible" className="glass specular p-5 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <UserAvatar name={name} type="head" size={44} />
              <div>
                <div className="font-display font-semibold">{name}</div>
                <div className="text-xs text-[#8B8B9A]">{members} · {city}</div>
              </div>
            </div>
            <Badge variant={status === 'active' ? 'green' : 'yellow'} dot>{status === 'active' ? 'Active' : 'Pending'}</Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Helpers() {
  return (
    <div>
      <PageHeader title="Helpers" subtitle="486 verified Echo Helpers" right={<Badge variant="purple">486 verified</Badge>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>} value="486" label="Verified" accent="green" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /></svg>} value="42" label="Pending Review" accent="orange" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>} value="2.4s" label="Avg Response" accent="blue" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /></svg>} value="4.8" label="Avg Rating" accent="purple" />
      </div>
      <div className="glass specular p-6 rounded-3xl space-y-3">
        {[
          ['VS', 'Vikram Singh', 'Bengaluru', '284', '4.9', 'green'],
          ['AR', 'Arun Reddy', 'Hyderabad', '198', '4.8', 'green'],
          ['SM', 'Sara Menon', 'Chennai', '156', '4.9', 'green'],
        ].map(([, name, city, helped, rating, status]) => (
          <div key={name} className="flex items-center justify-between p-4 rounded-2xl glass">
            <div className="flex items-center gap-3.5">
              <UserAvatar name={name} type="helper" size={40} />
              <div>
                <div className="font-semibold text-sm">{name}</div>
                <div className="text-xs text-[#8B8B9A]">{city} · {helped} helped</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-[#F9A825]">★ {rating}</span>
              <Badge variant={status as 'green'} dot>Active</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityPage() {
  return (
    <div>
      <PageHeader title="Security" subtitle="Platform-wide security controls" right={<Badge variant="green" dot>Secure</Badge>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} value="0" label="Active Threats" accent="green" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>} value="100%" label="Encryption" accent="blue" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /></svg>} value="99.98%" label="Uptime" accent="purple" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>} value="3" label="Alerts (24h)" accent="orange" />
      </div>
      <div className="glass specular p-6 rounded-3xl">
        <div className="font-display font-semibold text-lg mb-4">Security Settings</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {([
            ['Force 2FA for all admins', 'Require two-factor on every admin login', true],
            ['IP Whitelist', 'Restrict admin access to known IPs', true],
            ['Session Timeout', 'Auto-logout after 30 minutes idle', true],
            ['Failed Login Lockout', 'Lock after 5 failed attempts', true],
          ] as [string, string, boolean][]).map(([label, desc, on]) => (
            <div key={label} className="flex items-center justify-between p-4 rounded-2xl glass">
              <div>
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-xs text-[#8B8B9A] mt-0.5">{desc}</div>
              </div>
              <div className={`w-10 h-6 rounded-full p-0.5 transition-all ${on ? 'bg-[#FF6B1A]' : 'bg-[rgba(255,255,255,0.10)]'}`}>
                <motion.div animate={{ x: on ? 16 : 0 }} transition={{ duration: 0.2 }} className="w-5 h-5 rounded-full bg-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaceVerify() {
  return (
    <div>
      <PageHeader title="Face Verification" subtitle="Biometric recognition engine" right={<Badge variant="green" dot>Active</Badge>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>} value="14.2k" label="Verifications Today" accent="orange" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>} value="99.6%" label="Accuracy" accent="green" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>} value="89ms" label="Avg Latency" accent="blue" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>} value="0.4%" label="False Reject" accent="purple" />
      </div>
      <div className="glass specular p-6 rounded-3xl">
        <div className="font-display font-semibold text-lg mb-4">Engine Status</div>
        <div className="space-y-3">
          {[
            ['Model v4.2', 'Production', 'green'],
            ['Training Queue', '0 jobs', 'blue'],
            ['Database', '2.4M faces indexed', 'green'],
          ].map(([name, val, color]) => (
            <div key={name} className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)]">
              <span className="text-sm font-semibold">{name}</span>
              <Badge variant={color as 'green'}>{val}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditLogs() {
  const logs: Array<[string, string, string, 'green' | 'orange' | 'red' | 'blue']> = [
    ['admin@arges', 'Updated user role: Mohammed K → Blind User', '2m ago', 'orange'],
    ['admin@arges', 'Resolved alert: SOS auto-trigger false positive', '14m ago', 'green'],
    ['system', 'Failed login attempt blocked · IP 103.21.x.x', '38m ago', 'red'],
    ['admin@arges', 'Deployed firmware v2.1.3 to 47 devices', '1h ago', 'blue'],
    ['admin@arges', 'Approved helper: Vikram Singh (verified)', '2h ago', 'green'],
  ];
  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Immutable record of all admin actions" />
      <div className="glass specular p-6 rounded-3xl">
        <div className="space-y-2">
          {logs.map(([who, action, when, color], i) => (
            <motion.div
              key={i}
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-all"
            >
              <div
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ background: color === 'green' ? '#4CAF50' : color === 'orange' ? '#FF6B1A' : color === 'red' ? '#EF5350' : '#42A5F5' }}
              />
              <div className="flex-1">
                <div className="text-sm">{action}</div>
                <div className="text-[0.7rem] font-mono text-[#555566] mt-0.5">{who} · {when}</div>
              </div>
              <Badge variant={color}>{color === 'green' ? 'OK' : color === 'red' ? 'Blocked' : color === 'orange' ? 'Change' : 'Deploy'}</Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Alerts() {
  return (
    <div>
      <PageHeader title="Alerts" subtitle="5 active alerts requiring attention" right={<Badge variant="red" dot>5 active</Badge>} />
      <div className="space-y-3">
        {[
          ['High latency on AI Inference', 'API response > 500ms for 8 users', 'red', '2m ago'],
          ['Device offline', 'ARG-04719 offline for 4 hours', 'orange', '14m ago'],
          ['Spike in failed logins', '23 failed attempts from IP 103.21.x.x', 'red', '38m ago'],
          ['Helper payout failed', 'Bank rejection for Vikram Singh', 'orange', '1h ago'],
          ['Storage at 78%', 'Database storage approaching threshold', 'orange', '2h ago'],
        ].map(([title, desc, color, when]) => (
          <motion.div
            key={title}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`glass specular p-4 rounded-2xl flex items-center justify-between border-l-4 ${
              color === 'red' ? 'border-l-[#EF5350]' : 'border-l-[#FF6B1A]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <svg viewBox="0 0 24 24" width="22" height="22" className={`stroke-current fill-none ${color === 'red' ? 'text-[#EF5350]' : 'text-[#FF6B1A]'}`} strokeWidth="1.5">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <div className="font-semibold text-sm">{title}</div>
                <div className="text-xs text-[#8B8B9A] mt-0.5">{desc}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[0.68rem] font-mono text-[#555566]">{when}</span>
              <button data-hover className="px-3 py-1.5 rounded-full text-xs font-semibold border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.06)] transition-all">Resolve</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Server() {
  return (
    <div>
      <PageHeader title="Server" subtitle="5 core services · All operational" right={<Badge variant="green" dot>All Up</Badge>} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          ['API Gateway', '12ms', 'green', 18, 'us-central-1'],
          ['Database (Postgres)', '4ms', 'green', 32, 'us-central-1'],
          ['AI Inference', '240ms', 'orange', 68, 'gpu-cluster-1'],
          ['Face Verify', '89ms', 'green', 45, 'us-central-1'],
          ['Streaming (WebRTC)', '15ms', 'green', 22, 'edge-cdn'],
        ].map(([name, latency, color, load, region]) => (
          <motion.div key={name} variants={fadeUp} initial="hidden" animate="visible" className="glass specular p-5 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-display font-semibold">{name}</div>
                <div className="text-xs font-mono text-[#555566] mt-0.5">{region}</div>
              </div>
              <Badge variant={color as 'green'} dot>Running</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><div className="font-mono text-sm font-semibold">{latency}</div><div className="text-[0.65rem] text-[#8B8B9A] mt-0.5">Latency</div></div>
              <div><div className="font-mono text-sm font-semibold">{load}%</div><div className="text-[0.65rem] text-[#8B8B9A] mt-0.5">CPU Load</div></div>
              <div><div className="font-mono text-sm font-semibold">99.9%</div><div className="text-[0.65rem] text-[#8B8B9A] mt-0.5">Uptime</div></div>
            </div>
            <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden mt-4">
              <motion.div initial={{ width: 0 }} animate={{ width: `${load}%` }} transition={{ duration: 1, ease: EASE }} className={`h-full rounded-full ${color === 'green' ? 'bg-[#4CAF50]' : 'bg-[#FF6B1A]'}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Updates() {
  return (
    <div>
      <PageHeader title="Updates" subtitle="Platform and firmware update management" right={<Badge variant="blue">v2.1.3 current</Badge>} />
      <div className="glass specular p-6 rounded-3xl mb-5">
        <div className="font-display font-semibold text-lg mb-1">Platform v2.2.0</div>
        <div className="text-xs text-[#8B8B9A] mb-4">Available · Release scheduled Aug 15, 2026</div>
        <div className="space-y-2 mb-4">
          {['Improved AI scene recognition (12% accuracy gain)', 'New offline mode for helper sessions', 'Battery optimization (+15% runtime)', 'Bug fixes and performance improvements'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm">
              <svg viewBox="0 0 24 24" width="16" height="16" className="stroke-[#4CAF50] fill-none" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              {item}
            </div>
          ))}
        </div>
        <button data-hover className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#FF6B1A] text-black hover:opacity-90 transition-opacity">Schedule Update</button>
      </div>
      <div className="glass specular p-6 rounded-3xl">
        <div className="font-display font-semibold text-lg mb-4">Update History</div>
        <div className="space-y-3">
          {[
            ['v2.1.3', 'Aug 1, 2026', 'Stable', 'green'],
            ['v2.1.2', 'Jul 18, 2026', 'Stable', 'green'],
            ['v2.1.1', 'Jul 5, 2026', 'Stable', 'green'],
            ['v2.1.0', 'Jun 20, 2026', 'Stable', 'green'],
          ].map(([ver, date, status, color]) => (
            <div key={ver} className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)]">
              <span className="font-mono text-sm">{ver}</span>
              <span className="text-xs text-[#8B8B9A]">{date}</span>
              <Badge variant={color as 'green'}>{status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Global platform configuration" />
      <div className="glass specular p-6 rounded-3xl space-y-3 max-w-2xl">
        {([
          ['Maintenance Mode', 'Take the platform offline for updates', false],
          ['New Signups', 'Allow new user registration', true],
          ['Auto-Approve Helpers', 'Skip manual review for verified IDs', false],
          ['Email Notifications', 'Send alerts to admin@arges.io', true],
          ['Data Export', 'Allow GDPR data export requests', true],
        ] as [string, string, boolean][]).map(([label, desc, on]) => (
          <div key={label} className="flex items-center justify-between p-4 rounded-2xl glass">
            <div>
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs text-[#8B8B9A] mt-0.5">{desc}</div>
            </div>
            <div className={`w-10 h-6 rounded-full p-0.5 transition-all ${on ? 'bg-[#FF6B1A]' : 'bg-[rgba(255,255,255,0.10)]'}`}>
              <motion.div animate={{ x: on ? 16 : 0 }} transition={{ duration: 0.2 }} className="w-5 h-5 rounded-full bg-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
