import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handlePasskey = async () => {
    setLoading(true);
    try {
      const res = await api.auth.login('lakshmi@arges.app');
      if (res.success && res.data) {
        localStorage.setItem('arges_token', res.data.token);
        const role = (res.data.user as { role: string }).role;
        const routes: Record<string, string> = {
          family_head: '/family', family_member: '/member',
          helper: '/helper', admin: '/admin', blind: '/family'
        };
        navigate(routes[role] || '/family');
      }
    } catch {
      setMsg('Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = () => {
    if (!email) { setMsg('Enter your email first.'); return; }
    setMsg('Magic link sent! Check your email.');
  };

  return (
    <div className="theme-admin min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="card max-w-[420px] w-full"
        style={{ textAlign: 'center' }}
      >
        <div className="logo" style={{ marginBottom: '28px' }}>
          <svg viewBox="0 0 100 100" width="56" height="56" style={{ filter: 'drop-shadow(0 0 16px var(--orange-glow))', margin: '0 auto' }}>
            <path d="M50 28 C28 28 14 50 14 50 C14 50 28 72 50 72 C72 72 86 50 86 50 C86 50 72 28 50 28 Z" stroke="#FF6B1A" strokeWidth="3" fill="none"/>
            <circle cx="50" cy="50" r="9" stroke="#FF6B1A" strokeWidth="3" fill="none"/>
            <circle cx="50" cy="50" r="3.5" fill="#FF6B1A"/>
          </svg>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '1.6rem', marginTop: '10px' }}>ARGES Vision</h1>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: 'var(--orange)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '6px' }}>Welcome Back</div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handlePasskey} disabled={loading}
          className="passkey-btn"
        >
          <svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="var(--orange)" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="var(--orange)" strokeWidth="1.5"/></svg>
          Continue with Passkey
        </motion.button>

        <div className="divider">OR</div>

        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, fontSize: '1.3rem', margin: '28px 0 6px' }}>Sign in with email</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '28px' }}>We'll send a magic link to your inbox.</p>

        <div className="input-group">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="var(--muted)" strokeWidth="1.5"/><polyline points="22,6 12,13 2,6" fill="none" stroke="var(--muted)" strokeWidth="1.5"/></svg>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" style={{ paddingLeft: '46px' }} />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleMagicLink} disabled={loading}
          className="btn"
          style={{ width: '100%', marginBottom: '12px' }}
        >
          {loading ? 'Signing in...' : 'Send Magic Link'}
        </motion.button>

        {msg && <p style={{ fontSize: '0.82rem', color: msg.includes('sent') ? 'var(--orange)' : '#EF5350', marginTop: '8px' }}>{msg}</p>}

        <div style={{ marginTop: '24px', fontSize: '0.82rem', color: 'var(--muted)' }}>
          New to ARGES? <Link to="/signup" style={{ color: 'var(--orange)', fontWeight: 600 }}>Create a family account</Link>
        </div>

        <div style={{ marginTop: '20px', padding: '14px', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--muted-2)', border: '0.5px solid var(--glass-border)', background: 'var(--glass)' }}>
          All accounts protected by Passkey + 2FA. Your biometric data never leaves your device.
        </div>
      </motion.div>
    </div>
  );
}
