import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from './Primitives';
import { EASE } from '../animations/obsidian';

export type NavSection = { title: string; items: { id: string; label: string; badge?: string }[] };

/**
 * The shared dashboard chrome for all four roles.
 *
 * Obsidian is single-voltage, so roles are NOT distinguished by hue the way
 * they were before — `role` prints as a mono label under the wordmark and the
 * accent stays orange everywhere. Colour is reserved for state (ok / warn /
 * danger), which is the only thing on these screens worth interrupting for.
 */
export function DashShell({
  role, sections, active, onNavigate, title, subtitle, actions, children,
}: {
  role: string;
  sections: NavSection[];
  active: string;
  onNavigate: (id: string) => void;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="dash">
      <a href="#dash-main" className="skip-link">Skip to content</a>

      <aside className="sidebar">
        <Link to="/" className="sidebar-brand" style={{ color: 'var(--ink)', textDecoration: 'none' }}>
          <Logo size={22} />
          <span>
            <span style={{ letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>ARGES</span>
            <span className="mono" style={{ color: 'var(--accent)', fontSize: '0.5625rem', letterSpacing: '0.2em' }}>
              {role.toUpperCase()}
            </span>
          </span>
        </Link>

        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 'var(--s4)' }}>
            <div className="eyebrow eyebrow-mute" style={{ padding: '0 var(--s3)', marginBottom: 'var(--s2)', fontSize: '0.5625rem' }}>
              {section.title}
            </div>
            <nav aria-label={section.title} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className="nav-item"
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                  {item.badge && (
                    <span className="mono" style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '0.625rem' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        ))}

        <Link to="/" className="nav-item" style={{ marginTop: 'auto' }}>← Back to site</Link>
      </aside>

      <main className="dash-main" id="dash-main">
        <div className="dash-head">
          <div>
            <span className="eyebrow">/ {role}</span>
            <h1 className="display-sm" style={{ marginTop: 'var(--s3)' }}>{title}</h1>
            {subtitle && <p className="body-mute" style={{ marginTop: 'var(--s2)', fontSize: '0.9375rem' }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display: 'flex', gap: 'var(--s2)', flexWrap: 'wrap' }}>{actions}</div>}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, ease: EASE }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

/** A labelled metric. `tone` marks state, never decoration. */
export function Stat({ label, value, note, tone }: {
  label: string; value: ReactNode; note?: string; tone?: 'ok' | 'warn' | 'danger';
}) {
  const color = tone ? `var(--${tone})` : 'var(--ink)';
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
      {note && <div className="stat-delta">{note}</div>}
    </div>
  );
}

/** Section container with a hairline heading. */
export function Panel({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section style={{ marginTop: 'var(--s6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--s4)', marginBottom: 'var(--s4)', flexWrap: 'wrap' }}>
        <h2 className="eyebrow eyebrow-mute">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

/** Consistent empty / loading / error state for every data panel. */
export function DataState({ loading, error, empty, children }: {
  loading: boolean; error: string | null; empty: boolean; children: ReactNode;
}) {
  if (loading) {
    return <p className="mono" style={{ color: 'var(--faint)', padding: 'var(--s5)' }}>LOADING…</p>;
  }
  if (error) {
    return (
      <p className="mono" style={{ color: 'var(--warn)', padding: 'var(--s5)' }}>
        UNAVAILABLE — {error.toUpperCase()}
      </p>
    );
  }
  if (empty) {
    return <p className="mono" style={{ color: 'var(--faint)', padding: 'var(--s5)' }}>NOTHING HERE YET</p>;
  }
  return <>{children}</>;
}
