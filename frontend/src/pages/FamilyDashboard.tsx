import { DashboardLayout, NavSection } from '../components/DashboardLayout';
import { StatCard } from '../components/GlassPanel';
import { Badge } from '../components/Badge';
import { UserAvatar } from '../components/UserAvatar';

const SECTIONS: NavSection[] = [
  { items: [
    { page: 'overview', label: 'Overview', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
    { page: 'tree', label: 'Family Tree', icon: 'M9 11H5a2 2 0 0 0-2 2v7h6V11z M15 11h-6v9h6V11z M21 13a2 2 0 0 0-2-2h-4v9h6v-7z M8 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M16 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' },
    { page: 'members', label: 'Members', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', badge: '5' },
    { page: 'device', label: 'Device', icon: 'M2 3h20v14H2z M8 21h8', badge: '1', badgeColor: 'green' },
    { page: 'location', label: 'Location', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  ]},
  { title: 'Access', items: [
    { page: 'requests', label: 'Consent Requests', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14z M22 4 12 14.01 9 11.01', badge: '2' },
    { page: 'alerts', label: 'Alerts', icon: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' },
  ]},
  { title: 'Account', items: [
    { page: 'security', label: 'Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', badge: '2FA', badgeColor: 'green' },
    { page: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' },
  ]},
];

export function FamilyDashboard() {
  return (
    <DashboardLayout
      themeClass="theme-head"
      roleLabel="Family Head · Lakshmi"
      userName="Lakshmi Ammal"
      userInitials="LA"
      userRole="Family Head · Mother"
      avatarType="head"
      sections={SECTIONS}
    >
      {(page) => {
        if (page === 'overview') return <Overview />;
        if (page === 'tree') return <FamilyTree />;
        if (page === 'members') return <Members />;
        if (page === 'device') return <DeviceView />;
        if (page === 'location') return <LocationView />;
        if (page === 'requests') return <Requests />;
        return <div className="p-6 glass rounded-3xl"><p className="text-[#8B8B9A]">Coming in full build</p></div>;
      }}
    </DashboardLayout>
  );
}

function Overview() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="font-display font-bold text-2xl">Family Overview</h1><p className="text-sm text-[#8B8B9A] mt-0.5">Welcome back, Lakshmi · You have full management access</p></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>} value="Ravi" label="Blind User · Online" accent="orange" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>} value="5" label="Family Members" accent="green" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /></svg>} value="87%" label="Device Battery" accent="blue" />
        <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>} value="2" label="Pending Requests" accent="purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
        <div className="glass specular p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-5"><div><div className="font-display font-semibold text-lg">Ravi's Status</div><div className="text-xs text-[#8B8B9A]">Live data from ARGES glasses</div></div><Badge variant="green" dot>Online</Badge></div>
          <div className="grid grid-cols-2 gap-3">
            {[['Location', 'Home · Coimbatore', '11.0°N 76.9°E'], ['Activity', 'Walking', 'Last AI query: 8m ago'], ['Face Verify', 'Verified ✓', 'Checked 3m ago'], ['Privacy', 'Consent Mode', 'Video requires permission']].map(([label, val, meta]) => (
              <div key={label} className="p-4 rounded-2xl glass">
                <div className="text-xs text-[#8B8B9A] uppercase tracking-wider mb-1.5">{label}</div>
                <div className="font-semibold text-sm">{val}</div>
                <div className="text-xs text-[#8B8B9A] mt-1">{meta}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass specular p-6 rounded-3xl">
          <div className="font-display font-semibold text-lg mb-4">Quick Actions</div>
          <div className="flex flex-col gap-2.5">
            <button data-hover className="flex items-center gap-3 px-4 py-3.5 rounded-xl glass border border-[rgba(255,255,255,0.10)] text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all text-left">
              <svg viewBox="0 0 24 24" width="18" height="18" className="stroke-[var(--accent)] fill-none" strokeWidth="1.5"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
              Request Video Access
            </button>
            <button data-hover className="flex items-center gap-3 px-4 py-3.5 rounded-xl glass border border-[rgba(255,255,255,0.10)] text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all text-left">
              <svg viewBox="0 0 24 24" width="18" height="18" className="stroke-[var(--accent)] fill-none" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" /></svg>
              Call Ravi (Two-Way Talk)
            </button>
            <button data-hover className="flex items-center gap-3 px-4 py-3.5 rounded-xl glass border border-[rgba(239,83,80,0.3)] text-sm text-[#EF5350] hover:bg-[rgba(239,83,80,0.06)] transition-all text-left">
              <svg viewBox="0 0 24 24" width="18" height="18" className="stroke-[#EF5350] fill-none" strokeWidth="1.5"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /></svg>
              Trigger Emergency SOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FamilyTree() {
  const members = [['RA', 'Ravi Kumar', 'Blind User', 'blind'], ['SU', 'Suresh', 'Father', 'family'], ['KA', 'Karthik', 'Brother', 'family'], ['PR', 'Priya', 'Sister', 'family']];
  return (
    <div><div className="flex justify-between items-center mb-8"><div><h1 className="font-display font-bold text-2xl">Family Tree</h1><p className="text-sm text-[#8B8B9A] mt-0.5">Your family structure · Click any member to manage</p></div></div>
      <div className="glass specular p-6 rounded-3xl flex flex-col items-center gap-5 py-12">
        <div className="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform"><UserAvatar name="Lakshmi Ammal" type="head" size={56} /><div className="text-center"><div className="font-semibold text-sm">Lakshmi (You)</div><div className="text-xs text-[#4CAF50]">Family Head · Mother</div></div></div>
        <div className="w-px h-5 bg-[rgba(255,255,255,0.18)]" />
        <div className="flex flex-col items-center gap-2"><UserAvatar name="Ravi Kumar" type="blind" size={52} /><div className="text-center"><div className="font-semibold text-sm">Ravi Kumar</div><div className="text-xs text-[#FF6B1A]">Blind User</div></div></div>
        <div className="w-px h-5 bg-[rgba(255,255,255,0.18)]" />
        <div className="flex gap-12">{members.slice(1).map(([ini, name, role]) => (
          <div key={name} className="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform"><UserAvatar name={name} type="family" size={46} /><div className="text-center"><div className="text-sm font-semibold">{name}</div><div className="text-xs text-[#8B8B9A]">{role}</div></div></div>
        ))}</div>
      </div>
    </div>
  );
}

function Members() {
  return <div><div className="flex justify-between items-center mb-8"><div><h1 className="font-display font-bold text-2xl">Family Members</h1><p className="text-sm text-[#8B8B9A] mt-0.5">Each member has their own dashboard</p></div></div>
    <div className="glass specular p-6 rounded-3xl overflow-x-auto">
      <table className="w-full"><thead><tr>{['Member','Relation','Role','Status'].map(h => <th key={h} className="text-left font-mono text-[0.68rem] uppercase tracking-wider text-[#8B8B9A] font-normal pb-3 border-b border-[rgba(255,255,255,0.06)]">{h}</th>)}</tr></thead>
        <tbody>
          {[['Lakshmi (You)','Mother','Family Head','green','Active'],['Ravi Kumar','Son','Blind User','orange','Wearing'],['Suresh Kumar','Father','Member','green','Active'],['Karthik','Brother','Member','green','Active'],['Priya','Sister','Member','yellow','Pending']].map(([name,rel,role,badge,status]) => (
            <tr key={name as string} className="hover:bg-[rgba(255,255,255,0.02)]">
              <td className="py-3.5"><div className="flex items-center gap-3"><UserAvatar name={name as string} type={role === 'Family Head' ? 'head' : role === 'Blind User' ? 'blind' : 'family'} size={32} /><span className="text-sm font-semibold">{name}</span></div></td>
              <td className="text-sm text-[#8B8B9A]">{rel}</td>
              <td><Badge variant={role === 'Blind User' ? 'orange' : role === 'Family Head' ? 'green' : 'gray'}>{role}</Badge></td>
              <td><Badge variant={badge as 'green'} dot>{status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>;
}

function DeviceView() {
  return <div><div className="flex justify-between items-center mb-8"><div><h1 className="font-display font-bold text-2xl">ARGES Device</h1><p className="text-sm text-[#8B8B9A] mt-0.5">Manage Ravi's glasses · Full control as Family Head</p></div></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>} value="Online" label="Connection" accent="green" />
      <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /></svg>} value="87%" label="Battery · 4h left" accent="orange" />
      <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>} value="2h 14m" label="Uptime Today" accent="blue" />
      <StatCard icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} value="v2.1.3" label="Firmware · Latest" accent="purple" />
    </div>
    <div className="glass specular p-6 rounded-3xl">
      <div className="font-display font-semibold text-lg mb-4">Device Controls</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {[['Request Video Access','Ravi must accept via voice'],['View Location (Always)','No consent needed for GPS'],['Push Firmware Update','Check for and install updates'],['Lock Device (Remote)','Disable all features','#EF5350']].map(([title,desc,color]) => (
          <div key={title as string} data-hover className={`p-4.5 rounded-2xl glass border cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.04)] ${color === '#EF5350' ? 'border-[rgba(239,83,80,0.15)] bg-[rgba(239,83,80,0.04)]' : 'border-[rgba(255,255,255,0.10)]'}`}>
            <div className={`font-semibold text-sm mb-1.5 ${color === '#EF5350' ? 'text-[#EF5350]' : ''}`}>{title}</div>
            <div className="text-xs text-[#8B8B9A]">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}

function LocationView() {
  return <div><div className="flex justify-between items-center mb-8"><div><h1 className="font-display font-bold text-2xl">Ravi's Location</h1><p className="text-sm text-[#8B8B9A] mt-0.5">Live GPS · Always visible to family</p></div><Badge variant="green" dot>Updated 3m ago</Badge></div>
    <div className="glass specular p-6 rounded-3xl">
      <div className="h-[400px] rounded-[20px] overflow-hidden border border-[rgba(255,255,255,0.18)] flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0A0A18, #14142B)' }}>
        <div className="text-center">
          <div className="w-5 h-5 rounded-full bg-[#FF6B1A] mx-auto mb-3" style={{ boxShadow: '0 0 24px rgba(255,107,26,0.6)', animation: 'pulse 2s infinite' }} />
          <div className="font-semibold">Home · Coimbatore, TN</div>
          <div className="font-mono text-xs text-[#8B8B9A] mt-1">11.0168°N 76.9558°E</div>
        </div>
      </div>
    </div>
  </div>;
}

function Requests() {
  return <div><div className="flex justify-between items-center mb-8"><div><h1 className="font-display font-bold text-2xl">Consent Requests</h1><p className="text-sm text-[#8B8B9A] mt-0.5">Viewing requests from family members</p></div></div>
    <div className="glass specular p-6 rounded-3xl space-y-3">
      {[['Suresh (Father)','video','15 min','Waiting for Ravi'],['Karthik (Brother)','audio','30 min','Waiting for Ravi']].map(([who,type,dur,status]) => (
        <div key={who as string} className="p-4 rounded-2xl bg-[rgba(255,107,26,0.04)] border border-[rgba(255,107,26,0.12)] flex items-center justify-between">
          <div className="flex items-center gap-3.5"><UserAvatar name={who as string} type="family" size={40} /><div><div className="font-semibold text-sm">{who} requests {type} access</div><div className="text-xs text-[#8B8B9A]">Duration: {dur} · {status}</div></div></div>
          <button className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[rgba(239,83,80,0.3)] text-[#EF5350]">Cancel</button>
        </div>
      ))}
    </div>
  </div>;
}
