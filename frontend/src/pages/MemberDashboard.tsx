import { motion } from 'framer-motion';
import { DashboardLayout } from '../components/DashboardLayout';
import type { NavSection } from '../components/DashboardLayout';
import { StatCard } from '../components/GlassPanel';
import { Badge } from '../components/Badge';
import { UserAvatar } from '../components/UserAvatar';
import { fadeUp, EASE } from '../animations';

const SECTIONS: NavSection[] = [
  {
    items: [
      { page: 'overview', label: 'Overview', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
      { page: 'status', label: "Ravi's Status", icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
      { page: 'location', label: 'Location', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', badge: 'Live', badgeColor: 'green' },
      { page: 'history', label: 'Viewing History', icon: 'M12 8v4l3 3 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
    ],
  },
  {
    title: 'Account',
    items: [
      { page: 'security', label: 'Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', badge: '2FA', badgeColor: 'blue' },
      { page: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' },
    ],
  },
];

export function MemberDashboard() {
  return (
    <DashboardLayout
      themeClass="theme-member"
      roleLabel="Brother · Family Member"
      userName="Karthik"
      userInitials="KA"
      userRole="Ravi's Brother"
      avatarType="family"
      sections={SECTIONS}
    >
      {(page) => {
        if (page === 'overview') return <Overview />;
        if (page === 'status') return <RaviStatus />;
        if (page === 'location') return <LocationView />;
        if (page === 'history') return <ViewingHistory />;
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

function ConsentCallout() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="p-4 rounded-2xl bg-[rgba(66,165,245,0.06)] border border-[rgba(66,165,245,0.2)] flex items-start gap-3.5"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" className="stroke-[#42A5F5] fill-none flex-shrink-0 mt-0.5" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <div className="text-sm">
        <span className="font-semibold text-[#42A5F5]">As a Brother, you can see Ravi's location always.</span>{' '}
        <span className="text-[#8B8B9A]">To see video/audio, you must request consent.</span>
      </div>
    </motion.div>
  );
}

function Overview() {
  const statusBoxes: Array<[string, string, string]> = [
    ['Location', 'Home · Coimbatore', '11.0168°N 76.9558°E'],
    ['Activity', 'Walking', 'Last AI query: 8m ago'],
    ['Privacy', 'Consent Mode', 'Video requires permission'],
    ['Face Verify', 'Verified', 'Checked 3m ago'],
  ];

  return (
    <div>
      <PageHeader title="Overview" subtitle="Welcome back, Karthik · Limited family access" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
          value="Online"
          label="Ravi's Status"
          accent="green"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
          value="Home"
          label="Current Location"
          accent="blue"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
          value="2h"
          label="Since Last Check"
          accent="purple"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /></svg>}
          value="87%"
          label="Device Battery"
          accent="orange"
        />
      </div>

      <ConsentCallout />

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 mt-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="glass specular p-6 rounded-3xl"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <div className="font-display font-semibold text-lg">Ravi's Live Status</div>
              <div className="text-xs text-[#8B8B9A]">Real-time data from ARGES glasses</div>
            </div>
            <Badge variant="green" dot>Live</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {statusBoxes.map(([label, val, meta]) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="p-4 rounded-2xl glass"
              >
                <div className="text-xs text-[#8B8B9A] uppercase tracking-wider mb-1.5">{label}</div>
                <div className="font-semibold text-sm">{val}</div>
                <div className="text-xs text-[#8B8B9A] mt-1">{meta}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="glass specular p-6 rounded-3xl"
        >
          <div className="font-display font-semibold text-lg mb-4">Quick Actions</div>
          <div className="flex flex-col gap-2.5">
            <button
              data-hover
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl glass border border-[rgba(66,165,245,0.3)] text-sm hover:bg-[rgba(66,165,245,0.06)] transition-all text-left"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" className="stroke-[#42A5F5] fill-none" strokeWidth="1.5"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
              <div className="flex-1">
                <div className="font-semibold">Request Video Access</div>
                <div className="text-[0.7rem] text-[#8B8B9A]">Ravi must approve via voice</div>
              </div>
            </button>
            <button
              data-hover
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl glass border border-[rgba(255,255,255,0.10)] text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all text-left"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" className="stroke-[var(--accent)] fill-none" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" /></svg>
              Call Ravi (Two-Way Talk)
            </button>
            <button
              data-hover
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl glass border border-[rgba(255,255,255,0.10)] text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all text-left"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" className="stroke-[var(--accent)] fill-none" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              View Location
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RaviStatus() {
  return (
    <div>
      <PageHeader
        title="Ravi's Status"
        subtitle="Live device and activity telemetry"
        right={<Badge variant="green" dot>Online</Badge>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
          value="2h 14m"
          label="Active Today"
          accent="blue"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>}
          value="14"
          label="AI Queries Today"
          accent="purple"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>}
          value="3"
          label="Helper Calls"
          accent="green"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
          value="Safe"
          label="Security Status"
          accent="orange"
        />
      </div>
      <div className="glass specular p-6 rounded-3xl">
        <div className="font-display font-semibold text-lg mb-4">Recent Activity</div>
        <div className="space-y-3">
          {[
            ['11:42 AM', 'AI identified a bus — Route 7B to Gandhipuram', 'blue'],
            ['11:38 AM', 'Face verified: Suresh (Father)', 'green'],
            ['11:30 AM', 'Helper session ended — duration 2m 14s', 'purple'],
            ['11:15 AM', 'Location update: arrived Home', 'blue'],
          ].map(([time, msg, color]) => (
            <div key={time} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-all">
              <div className={`w-2 h-2 rounded-full bg-[#${color === 'green' ? '4CAF50' : color === 'purple' ? 'AB47BC' : '42A5F5'}]`} />
              <span className="font-mono text-xs text-[#8B8B9A] w-24">{time}</span>
              <span className="text-sm">{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LocationView() {
  return (
    <div>
      <PageHeader
        title="Ravi's Location"
        subtitle="Live GPS · Always visible to family"
        right={<Badge variant="green" dot>Updated 3m ago</Badge>}
      />
      <div className="glass specular p-6 rounded-3xl">
        <div
          className="h-[400px] rounded-[20px] overflow-hidden border border-[rgba(255,255,255,0.18)] flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0A0A18, #14142B)' }}
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: EASE }}
              className="w-10 h-10 rounded-full bg-[#42A5F5] mx-auto absolute"
            />
            <div className="w-5 h-5 rounded-full bg-[#42A5F5] mx-auto mb-3 relative" style={{ boxShadow: '0 0 24px rgba(66,165,245,0.6)' }} />
            <div className="font-semibold">Home · Coimbatore, TN</div>
            <div className="font-mono text-xs text-[#8B8B9A] mt-1">11.0168°N 76.9558°E</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewingHistory() {
  return (
    <div>
      <PageHeader title="Viewing History" subtitle="Past consent-based viewing sessions" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
          value="12"
          label="Sessions This Month"
          accent="blue"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
          value="1h 42m"
          label="Total Watch Time"
          accent="purple"
        />
      </div>
      <div className="glass specular p-6 rounded-3xl space-y-3">
        {[
          ['Today · 9:15 AM', '10 min', 'Check-in before work'],
          ['Yesterday · 6:30 PM', '15 min', 'Evening catch-up'],
          ['Aug 8 · 8:00 PM', '8 min', 'Quick verification'],
        ].map(([when, dur, note]) => (
          <div key={when} className="p-4 rounded-2xl glass flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">{when}</div>
              <div className="text-xs text-[#8B8B9A] mt-0.5">{note}</div>
            </div>
            <Badge variant="blue">{dur}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function Security() {
  return (
    <div>
      <PageHeader title="Security" subtitle="Account protection and sessions" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
          value="Strong"
          label="Password"
          accent="green"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>}
          value="On"
          label="Two-Factor Auth"
          accent="blue"
        />
      </div>
      <div className="glass specular p-6 rounded-3xl">
        <div className="font-display font-semibold text-lg mb-4">Active Sessions</div>
        <div className="space-y-3">
          {[
            ['iPhone 14', 'Coimbatore, IN', 'Now', true],
            ['Chrome · Mac', 'Coimbatore, IN', '2h ago', false],
          ].map(([device, loc, when, current]) => (
            <div key={device as string} className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)]">
              <div className="flex items-center gap-3">
                <UserAvatar name="Karthik" type="family" size={32} />
                <div>
                  <div className="text-sm font-semibold">{device}</div>
                  <div className="text-xs text-[#8B8B9A]">{loc} · {when}</div>
                </div>
              </div>
              {current ? <Badge variant="green" dot>This device</Badge> : <button className="text-xs text-[#EF5350]">Revoke</button>}
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
      <PageHeader title="Settings" subtitle="Manage your member preferences" />
      <div className="glass specular p-6 rounded-3xl space-y-3 max-w-2xl">
        {[
          ['Location Notifications', 'Get pinged when Ravi arrives or leaves', true],
          ['Low Battery Alerts', "Notify when Ravi's device is below 20%", true],
          ['Quiet Hours', 'Mute non-urgent alerts 10 PM – 7 AM', false],
          ['Helper Session Reports', 'Email summary after each helper call', true],
        ].map(([label, desc, on]) => (
          <div key={label as string} className="flex items-center justify-between p-4 rounded-2xl glass">
            <div>
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs text-[#8B8B9A] mt-0.5">{desc}</div>
            </div>
            <div className={`w-10 h-6 rounded-full p-0.5 transition-all ${on ? 'bg-[#42A5F5]' : 'bg-[rgba(255,255,255,0.10)]'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-all ${on ? 'ml-auto' : ''}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
