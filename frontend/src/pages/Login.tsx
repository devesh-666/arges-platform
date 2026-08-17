import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { Logo } from '../components/Primitives';
import { EASE } from '../animations/obsidian';

const ROUTES: Record<string, string> = {
  family_head: '/family',
  family_member: '/member',
  helper: '/helper',
  admin: '/admin',
  blind: '/family',
};

/** The seeded family head — the demo shortcut, unchanged. */
const DEMO_EMAIL = 'lakshmi@arges.app';

export function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<'demo' | 'email' | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /**
   * The backend supports a passkey-style path: a user with no password set
   * authenticates on email alone. Both buttons therefore go through the same
   * endpoint — the only difference is whose address is submitted.
   */
  const signIn = async (address: string, which: 'demo' | 'email') => {
    setError('');
    setLoading(which);
    try {
      const res = await api.auth.login(address);
      if (res.success && res.data) {
        localStorage.setItem('arges_token', res.data.token);
        const role = (res.data.user as { role?: string }).role ?? '';
        navigate(ROUTES[role] ?? '/family');
        return;
      }
      setError('That did not work. Check the address and try again.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed. Try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--s6) var(--s5)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--s7)' }}>
          <Link to="/" style={{ display: 'inline-flex', justifyContent: 'center' }} aria-label="ARGES home">
            <Logo size={40} />
          </Link>
          <h1 className="display-sm" style={{ marginTop: 'var(--s4)' }}>Welcome back</h1>
          <p className="eyebrow eyebrow-mute" style={{ marginTop: 'var(--s3)' }}>/ Sign in</p>
        </div>

        <form
          className="panel"
          style={{ padding: 'var(--s5)', display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim()) { setError('Enter your email address first.'); return; }
            signIn(email.trim(), 'email');
          }}
        >
          <div className="field">
            <label className="field-label" htmlFor="email">Email address</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@email.com"
            />
          </div>

          <button type="submit" className="btn btn-accent" disabled={loading !== null} style={{ width: '100%' }}>
            {loading === 'email' ? 'Signing in…' : 'Continue'}
          </button>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }} aria-hidden="true">
            <span className="rule" style={{ flex: 1 }} />
            <span className="mono" style={{ color: 'var(--faint)' }}>OR</span>
            <span className="rule" style={{ flex: 1 }} />
          </div>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => signIn(DEMO_EMAIL, 'demo')}
            disabled={loading !== null}
            style={{ width: '100%' }}
          >
            {loading === 'demo' ? 'Signing in…' : 'Continue with passkey'}
          </button>

          <p className="form-note" style={{ textAlign: 'center' }}>
            Protected by passkey and 2FA. Biometric data never leaves the device.
          </p>
        </form>

        <p className="body-mute" style={{ textAlign: 'center', marginTop: 'var(--s5)', fontSize: '0.875rem' }}>
          New to ARGES? <Link to="/signup" style={{ color: 'var(--accent)' }}>Create a family account</Link>
        </p>
      </motion.div>
    </main>
  );
}
