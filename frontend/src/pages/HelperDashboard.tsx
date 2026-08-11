import { motion } from 'framer-motion';
import { DashboardLayout } from '../components/DashboardLayout';
import type { NavSection } from '../components/DashboardLayout';
import { StatCard } from '../components/GlassPanel';
import { Badge } from '../components/Badge';
import { UserAvatar } from '../components/UserAvatar';
import { fadeUp, stagger, scaleIn, EASE } from '../animations';

const SECTIONS: NavSection[] = [
  {
    items: [
      { page: 'dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
      { page: 'requests', label: 'Help Requests', icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z', badge: '3', badgeColor: 'red' },
      { page: 'history', label: 'Session History', icon: 'M12 8v4l3 3 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
      { page: 'map', label: 'Request Map', icon: 'M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7 M9 20l6-3 M9 20V7 M15 17l5.553 2.776A1 1 0 0 0 22 18.882V8.118a1 1 0 0 0-.553-.894L15 4 M15 17V4' },
    ],
  },
  {
    title: 'Growth',
    items: [
      { page: 'reputation', label: 'Reputation', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
      { page: 'security', label: 'Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', badge: 'Verified', badgeColor: 'green' },
      { page: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' },
    ],
  },
];

interface HelpRequest {
  initials: string;
  name: string;
  city: string;
  message: string;
  urgent: boolean;
  time: string;
}

const REQUESTS: HelpRequest[] = [
  {
    initials: 'AR',
    name: 'Anjali Rao',
    city: 'Mysuru',
    message: "I'm at a bus stop and can't read the bus number",
    urgent: true,
    time: 'just now',
  },
  {
    initials: 'MK',
    name: 'Mohammed K',
    city: 'Hyderabad',
    message: 'I need help finding the right platform',
    urgent: false,
    time: '1 min ago',
  },
  {
    initials: 'SR',
    name: 'Sneha R',
    city: 'Chennai',
    message: "There's a sign here I can't read",
    urgent: false,
    time: '2 min ago',
  },
];

export function HelperDashboard() {
  return (
    <DashboardLayout
      themeClass="theme-helper"
      roleLabel="Echo Helper · Verified"
      userName="Vikram Singh"
      userInitials="VS"
      userRole="Echo Helper · Verified"
      avatarType="helper"
      sections={SECTIONS}
    >
      {(page) => {
        if (page === 'dashboard') return <Dashboard />;
        if (page === 'requests') return <Requests />;
        if (page === 'history') return <SessionHistory />;
        if (page === 'map') return <RequestMap />;
        if (page === 'reputation') return <Reputation />;
        if (page === 'security') return <Security />;
        if (page === 'settings') return <Settings />;
        return <div className="p-6 glass rounded-3xl"><p className="text-[#8B8B9A]">Coming in full build</p></div>;
      }}
    </DashboardLayout>
  );
}

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

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Helper Dashboard"
        subtitle="Welcome back, Vikram · You're ranked #1 this week"
        right={<Badge variant="purple" dot>Online</Badge>}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
          value="284"
          label="People Helped"
          accent="purple"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
          value="4.9"
          label="Avg Rating"
          accent="green"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
          value="2.4s"
          label="Avg Response"
          accent="blue"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>}
          value="#1"
          label="Top Helper"
          accent="orange"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="glass specular p-6 rounded-3xl"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <div className="font-display font-semibold text-lg">Incoming Requests</div>
              <div className="text-xs text-[#8B8B9A]">3 people need help right now</div>
            </div>
            <Badge variant="red" dot>3 waiting</Badge>
          </div>
          <div className="space-y-3">
            {REQUESTS.map((req) => (
              <RequestRow key={req.name} req={req} />
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="glass specular p-6 rounded-3xl"
        >
          <div className="font-display font-semibold text-lg mb-4">Today's Impact</div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              ['7', 'Sessions', 'purple'],
              ['42m', 'Time Given', 'blue'],
              ['5.0', 'Avg Score', 'green'],
              ['100%', 'Accept Rate', 'orange'],
            ].map(([val, lbl, color]) => (
              <div key={lbl} className="p-4 rounded-2xl glass">
                <div className="font-display font-bold text-xl" style={{ color: `#${color === 'green' ? '4CAF50' : color === 'purple' ? 'AB47BC' : color === 'blue' ? '42A5F5' : 'FF6B1A'}` }}>{val}</div>
                <div className="text-xs text-[#8B8B9A] mt-1">{lbl}</div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-[rgba(171,71,188,0.06)] border border-[rgba(171,71,188,0.18)]">
            <div className="text-xs text-[#8B8B9A] uppercase tracking-wider mb-1">Streak</div>
            <div className="font-semibold text-sm">14 days of helping · Keep it up!</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RequestRow({ req }: { req: HelpRequest }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={`p-4 rounded-2xl flex items-center gap-4 ${
        req.urgent
          ? 'bg-[rgba(239,83,80,0.06)] border border-[rgba(239,83,80,0.4)]'
          : 'glass border border-[rgba(171,71,188,0.25)]'
      }`}
    >
      <UserAvatar name={req.name} type="blind" size={44} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{req.name}</span>
          {req.urgent && <Badge variant="red" dot>Urgent</Badge>}
          <span className="text-xs text-[#8B8B9A]">· {req.city}</span>
        </div>
        <div className="text-xs text-[#8B8B9A] mt-0.5 truncate">"{req.message}"</div>
        <div className="text-[0.68rem] font-mono text-[#555566] mt-1">{req.time}</div>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button
          data-hover
          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#4CAF50] text-black hover:opacity-90 transition-opacity"
        >
          Accept
        </button>
        <button
          data-hover
          className="px-4 py-1.5 rounded-full text-xs font-semibold border border-[rgba(239,83,80,0.3)] text-[#EF5350] hover:bg-[rgba(239,83,80,0.08)] transition-all"
        >
          Decline
        </button>
      </div>
    </motion.div>
  );
}

function Requests() {
  return (
    <div>
      <PageHeader
        title="Help Requests"
        subtitle="Real-time requests from blind users nearby"
        right={<Badge variant="red" dot>3 active</Badge>}
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {REQUESTS.map((req) => (
          <motion.div
            key={req.name}
            variants={fadeUp}
            className={`glass specular p-5 rounded-3xl ${
              req.urgent ? 'border-l-4 border-l-[#EF5350]' : 'border-l-4 border-l-[#AB47BC]'
            }`}
          >
            <div className="flex items-center gap-4">
              <UserAvatar name={req.name} type="blind" size={52} />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-semibold">{req.name}</span>
                  {req.urgent ? <Badge variant="red" dot>Urgent</Badge> : <Badge variant="purple">Normal</Badge>}
                  <span className="text-xs text-[#8B8B9A]">· {req.city}</span>
                </div>
                <div className="text-sm text-[#8B8B9A] mt-1.5 italic">"{req.message}"</div>
                <div className="text-[0.7rem] font-mono text-[#555566] mt-1.5">{req.time} · 2.1 km away</div>
              </div>
              <div className="flex gap-2.5 flex-shrink-0">
                <button
                  data-hover
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#4CAF50] text-black hover:opacity-90 transition-opacity"
                >
                  Accept
                </button>
                <button
                  data-hover
                  className="px-5 py-2.5 rounded-full text-sm font-semibold border border-[rgba(239,83,80,0.3)] text-[#EF5350] hover:bg-[rgba(239,83,80,0.08)] transition-all"
                >
                  Decline
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function SessionHistory() {
  const sessions: Array<[string, string, string, string, 'green' | 'orange' | 'blue']> = [
    ['RR', 'Ramesh', 'Bengaluru', 'Reading medicine label · 3m 12s', 'green'],
    ['PG', 'Priya G', 'Mysuru', 'Bus route identification · 2m 04s', 'blue'],
    ['AV', 'Arun V', 'Coimbatore', 'Door sign reading · 4m 28s', 'purple' as 'blue'],
    ['SM', 'Sameer', 'Hyderabad', 'Platform announcement · 1m 45s', 'green'],
    ['LK', 'Lakshmi K', 'Chennai', 'Menu reading · 5m 02s', 'blue'],
  ];
  return (
    <div>
      <PageHeader title="Session History" subtitle="Your past 5 helper sessions" />
      <div className="glass specular p-6 rounded-3xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {['User', 'City', 'Task', 'Duration', 'Rating'].map((h) => (
                <th key={h} className="text-left font-mono text-[0.68rem] uppercase tracking-wider text-[#8B8B9A] font-normal pb-3 border-b border-[rgba(255,255,255,0.06)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map(([, name, city, task, color]) => (
              <tr key={name} className="hover:bg-[rgba(255,255,255,0.02)] transition-all">
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={name} type="blind" size={32} />
                    <span className="text-sm font-semibold">{name}</span>
                  </div>
                </td>
                <td className="text-sm text-[#8B8B9A]">{city}</td>
                <td className="text-sm text-[#8B8B9A]">{task}</td>
                <td className="text-sm font-mono text-[#8B8B9A]">★ 5.0</td>
                <td><Badge variant={color}>Completed</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RequestMap() {
  return (
    <div>
      <PageHeader title="Request Map" subtitle="Live requests across India" right={<Badge variant="red" dot>3 active</Badge>} />
      <div className="glass specular p-6 rounded-3xl">
        <div
          className="h-[420px] rounded-[20px] overflow-hidden border border-[rgba(255,255,255,0.18)] relative flex items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, #1A1A2E, #0A0A18)' }}
        >
          {REQUESTS.map((req, i) => {
            const positions: Array<[string, string]> = [['42%', '38%'], ['58%', '62%'], ['36%', '64%']];
            const [top, left] = positions[i];
            return (
              <motion.div
                key={req.name}
                className="absolute flex flex-col items-center"
                style={{ top, left }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.15, type: 'spring', damping: 12 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: EASE }}
                  className="absolute w-8 h-8 rounded-full"
                  style={{ background: req.urgent ? '#EF5350' : '#AB47BC' }}
                />
                <div
                  className="w-3 h-3 rounded-full relative"
                  style={{ background: req.urgent ? '#EF5350' : '#AB47BC', boxShadow: `0 0 16px ${req.urgent ? 'rgba(239,83,80,0.6)' : 'rgba(171,71,188,0.6)'}` }}
                />
                <div className="text-[0.65rem] font-mono text-[#8B8B9A] mt-1 whitespace-nowrap">{req.city}</div>
              </motion.div>
            );
          })}
          <div className="absolute bottom-4 left-4 font-mono text-[0.65rem] text-[#8B8B9A] uppercase tracking-wider">Live Request Map · India</div>
        </div>
      </div>
    </div>
  );
}

function Reputation() {
  const badges: Array<[string, string, string, 'orange' | 'purple' | 'green' | 'blue']> = [
    ['Top Helper', 'Ranked #1 nationwide · 3 months running', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', 'orange'],
    ['250+ Club', 'Helped over 250 people in your journey', 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', 'purple'],
    ['Verified', 'Identity and background confirmed', 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4', 'green'],
    ['Fast Responder', 'Average response under 3 seconds', 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', 'blue'],
  ];
  const colors: Record<string, string> = {
    orange: 'rgba(255,107,26,0.12)',
    purple: 'rgba(171,71,188,0.12)',
    green: 'rgba(76,175,80,0.12)',
    blue: 'rgba(66,165,245,0.12)',
  };
  const strokes: Record<string, string> = {
    orange: '#FF6B1A',
    purple: '#AB47BC',
    green: '#4CAF50',
    blue: '#42A5F5',
  };

  return (
    <div>
      <PageHeader title="Reputation" subtitle="Your earned badges and milestones" right={<Badge variant="purple">Level 7</Badge>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {badges.map(([name, desc, path, color]) => (
          <motion.div
            key={name}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="glass specular p-6 rounded-3xl text-center"
            style={{ borderColor: colors[color] }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: colors[color] }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" className="fill-none" strokeWidth="1.5" stroke={strokes[color]}>
                <path d={path} />
              </svg>
            </div>
            <div className="font-display font-semibold text-sm" style={{ color: strokes[color] }}>{name}</div>
            <div className="text-[0.72rem] text-[#8B8B9A] mt-1.5 leading-snug">{desc}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass specular p-6 rounded-3xl">
        <div className="font-display font-semibold text-lg mb-5">Progress to Next Level</div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              transition={{ duration: 1.2, ease: EASE }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #AB47BC, #CE93D8)' }}
            />
          </div>
          <span className="font-mono text-sm text-[#AB47BC]">284 / 400</span>
        </div>
        <div className="text-xs text-[#8B8B9A] mt-2">116 more sessions to reach Level 8 · Legend Helper</div>
      </div>
    </div>
  );
}

function Security() {
  return (
    <div>
      <PageHeader title="Security" subtitle="Account protection and verification" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>}
          value="Verified"
          label="Identity"
          accent="green"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
          value="On"
          label="Two-Factor"
          accent="purple"
        />
      </div>
      <div className="glass specular p-6 rounded-3xl">
        <div className="font-display font-semibold text-lg mb-4">Verification Status</div>
        <div className="space-y-3">
          {([
            ['Government ID', 'Aadhaar verified', true],
            ['Background Check', 'Clean · Updated Jan 2026', true],
            ['Phone Number', '+91 verified', true],
            ['Address Proof', 'Bengaluru, KA', true],
          ] as [string, string, boolean][]).map(([label, val, ok]) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)]">
              <div>
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-xs text-[#8B8B9A]">{val}</div>
              </div>
              {ok ? <Badge variant="green">Verified</Badge> : <Badge variant="yellow">Pending</Badge>}
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
      <PageHeader title="Settings" subtitle="Helper preferences and availability" />
      <div className="glass specular p-6 rounded-3xl space-y-3 max-w-2xl">
        {([
          ['Auto-Accept Urgent', 'Automatically accept requests marked urgent', false],
          ['Online Status', 'Show as available for new requests', true],
          ['Session Recording', 'Save transcripts of your sessions', true],
          ['Payout Notifications', 'Alert me when earnings are deposited', true],
        ] as [string, string, boolean][]).map(([label, desc, on]) => (
          <div key={label} className="flex items-center justify-between p-4 rounded-2xl glass">
            <div>
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs text-[#8B8B9A] mt-0.5">{desc}</div>
            </div>
            <div className={`w-10 h-6 rounded-full p-0.5 transition-all ${on ? 'bg-[#AB47BC]' : 'bg-[rgba(255,255,255,0.10)]'}`}>
              <motion.div animate={{ x: on ? 16 : 0 }} transition={{ duration: 0.2 }} className="w-5 h-5 rounded-full bg-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
