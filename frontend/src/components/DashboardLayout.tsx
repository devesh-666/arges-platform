import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArgesLogo } from './ArgesLogo';
import { UserAvatar } from './UserAvatar';
import { cn } from '../lib/utils';
import { slideInLeft, EASE } from '../animations';

export interface NavItem {
  page: string;
  label: string;
  icon: string;
  badge?: string;
  badgeColor?: 'green' | 'red' | 'orange' | 'blue' | 'purple';
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export function DashboardLayout({
  themeClass,
  roleLabel,
  userName,
  userInitials,
  userRole,
  avatarType,
  sections,
  children,
}: {
  themeClass: string;
  roleLabel: string;
  userName: string;
  userInitials: string;
  userRole: string;
  avatarType: 'blind' | 'family' | 'head' | 'helper' | 'admin';
  sections: NavSection[];
  children: (currentPage: string) => React.ReactNode;
}) {
  const [currentPage, setCurrentPage] = useState(sections[0]?.items[0]?.page || 'overview');

  const badgeColors: Record<string, string> = {
    green: 'bg-[#4CAF50] text-black',
    red: 'bg-[#EF5350] text-white',
    orange: 'bg-[#FF6B1A] text-black',
    blue: 'bg-[#42A5F5] text-black',
    purple: 'bg-[#AB47BC] text-white',
  };

  return (
    <div className={cn(themeClass, 'min-h-screen')}>
      <div className="grid grid-cols-[240px_1fr] min-h-screen">
        {/* SIDEBAR */}
        <motion.aside
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
          className="sticky top-0 h-screen overflow-y-auto p-6"
          style={{ background: 'rgba(5,5,12,0.6)', backdropFilter: 'blur(40px)', borderRight: '0.5px solid rgba(255,255,255,0.06)' }}
        >
          <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg mb-1.5 px-2">
            <ArgesLogo size={26} color="var(--accent)" /> ARGES
          </Link>
          <div className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-[var(--accent)] px-2 mb-7">{roleLabel}</div>

          {sections.map((section, si) => (
            <div key={si} className="mb-7">
              {section.title && <div className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-[#555566] px-2 mb-2 mt-5">{section.title}</div>}
              {section.items.map(item => (
                <button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  data-hover
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5',
                    currentPage === item.page ? 'text-[var(--accent)] border' : 'text-[#8B8B9A] hover:bg-[rgba(255,255,255,0.05)] hover:text-white border border-transparent',
                    currentPage === item.page && 'bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] border-[color-mix(in_srgb,var(--accent)_15%,transparent)]'
                  )}
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth="1.5"><path d={item.icon} /></svg>
                  {item.label}
                  {item.badge && (
                    <span className={cn('ml-auto text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full', badgeColors[item.badgeColor || 'orange'])}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}

          <div className="mt-auto pt-5 border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2.5 p-2 rounded-xl">
              <UserAvatar name={userName} type={avatarType} size={36} />
              <div>
                <div className="text-sm font-semibold">{userName}</div>
                <div className="text-[0.7rem] text-[#8B8B9A]">{userRole}</div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* MAIN */}
        <main className="p-8 overflow-y-auto">
          <motion.div key={currentPage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            {children(currentPage)}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
