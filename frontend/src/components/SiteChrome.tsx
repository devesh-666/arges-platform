import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Primitives';

const LINKS = [
  { to: '/3d', label: 'How it works' },
  { to: '/#ecosystem', label: 'Ecosystem' },
  { to: '/#pricing', label: 'Pricing' },
];

/**
 * The sticky top nav — the single surface in Obsidian that keeps a
 * backdrop blur. Everywhere else, elevation is a hairline.
 *
 * It starts transparent over the hero and gains its surface on scroll, so
 * the full-bleed opening render is never boxed in by a bar.
 */
export function SiteNav() {
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 900,
        background: solid ? 'rgba(8,8,12,0.72)' : 'transparent',
        backdropFilter: solid ? 'saturate(160%) blur(16px)' : 'none',
        WebkitBackdropFilter: solid ? 'saturate(160%) blur(16px)' : 'none',
        borderBottom: `1px solid ${solid ? 'var(--hairline)' : 'transparent'}`,
        transition: 'background var(--t-element) var(--ease), border-color var(--t-element) var(--ease)',
      }}
    >
      <nav className="shell" aria-label="Primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s5)', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.02em', fontSize: '1.05rem' }}>
          <Logo size={24} />
          ARGES
        </Link>

        <div style={{ display: 'flex', gap: 'var(--s5)', marginLeft: 'var(--s5)' }} className="max-md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              aria-current={pathname === l.to ? 'page' : undefined}
              style={{
                color: pathname === l.to ? 'var(--ink)' : 'var(--mute)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color var(--t-micro) var(--ease)',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
          <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link to="/signup" className="btn btn-accent btn-sm">Get ARGES</Link>
        </div>
      </nav>
    </header>
  );
}

const FOOTER_COLS = [
  { title: 'Product', links: [['/3d', 'How it works'], ['/#ecosystem', 'Ecosystem'], ['/#pricing', 'Pricing'], ['/#specs', 'Specifications']] },
  { title: 'Dashboards', links: [['/family', 'Family Guardian'], ['/member', 'Family Member'], ['/helper', 'Echo Network'], ['/admin', 'Administration']] },
  { title: 'Account', links: [['/login', 'Sign in'], ['/signup', 'Create account']] },
] as const;

export function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--hairline)', paddingTop: 'var(--s8)', paddingBottom: 'var(--s7)' }}>
      <div className="shell">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--s7)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--s4)' }}>
              <Logo size={22} />
              <span style={{ letterSpacing: '-0.02em' }}>ARGES</span>
            </div>
            <p className="body-mute" style={{ fontSize: '0.8125rem', maxWidth: '26ch' }}>
              Forging light. Empowering sight.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <div className="eyebrow eyebrow-mute" style={{ marginBottom: 'var(--s4)' }}>{col.title}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                {col.links.map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} style={{ color: 'var(--mute)', textDecoration: 'none', fontSize: '0.875rem' }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div style={{ marginTop: 'var(--s8)', paddingTop: 'var(--s5)', borderTop: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between', gap: 'var(--s4)', flexWrap: 'wrap' }}>
          <span className="mono" style={{ color: 'var(--faint)' }}>© 2026 ARGES · THIAGARAJAR POLYTECHNIC COLLEGE, SALEM</span>
          <span className="mono" style={{ color: 'var(--faint)' }}>AES-256 E2EE · DPDP COMPLIANT</span>
        </div>
      </div>
    </footer>
  );
}
