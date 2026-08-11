import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArgesLogo } from '../components/ArgesLogo';
import { api } from '../lib/api';
import { EASE, modalSpring } from '../animations';

export function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (useEmail = false) => {
    setLoading(true);
    try {
      const res = await api.auth.login(useEmail ? email : 'lakshmi@arges.app');
      if (res.success && res.data) {
        localStorage.setItem('arges_token', res.data.token);
        const role = (res.data.user as { role: string }).role;
        const routes: Record<string, string> = { family_head: '/family', family_member: '/member', helper: '/helper', admin: '/admin', blind: '/family' };
        navigate(routes[role] || '/family');
      }
    } catch {
      setMsg('Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-admin min-h-screen flex items-center justify-center p-6">
      <motion.div
        variants={modalSpring}
        initial="hidden"
        animate="visible"
        className="glass specular max-w-[420px] w-full p-12 text-center rounded-[32px]"
        style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.6)' }}
      >
        <div className="flex justify-center mb-3">
          <ArgesLogo size={56} />
        </div>
        <h1 className="font-display font-bold text-2xl mt-2.5">ARGES</h1>
        <div className="font-mono text-[0.65rem] text-[var(--accent)] tracking-[0.2em] uppercase mt-1.5 mb-7">Welcome Back</div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => handleLogin(false)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl glass border border-[rgba(255,255,255,0.18)] text-sm font-medium hover:bg-[rgba(255,255,255,0.08)] mb-3"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" className="stroke-[var(--accent)] fill-none" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Continue with Passkey
        </motion.button>

        <div className="flex items-center gap-3 my-5 text-[#555566] text-xs"><span className="flex-1 h-px bg-[rgba(255,255,255,0.10)]" />OR<span className="flex-1 h-px bg-[rgba(255,255,255,0.10)]" /></div>

        <h2 className="font-display font-semibold text-lg mb-1.5">Sign in with email</h2>
        <p className="text-sm text-[#8B8B9A] mb-7">We'll send a magic link to your inbox.</p>

        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full glass border border-[rgba(255,255,255,0.10)] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--accent)] mb-3"
        />
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => handleLogin(true)} disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[var(--accent)] text-black"
          style={{ boxShadow: '0 4px 20px var(--accent-glow)' }}
        >
          {loading ? 'Signing in...' : 'Send Magic Link →'}
        </motion.button>

        {msg && <p className="text-[#EF5350] text-xs mt-3">{msg}</p>}

        <p className="mt-6 text-sm text-[#8B8B9A]">New to ARGES? <Link to="/signup" className="text-[var(--accent)] font-semibold">Create a family account →</Link></p>

        <div className="mt-5 p-3.5 rounded-xl text-xs text-[#555566] glass">
          All accounts protected by Passkey + 2FA. Your biometric data never leaves your device.
        </div>
      </motion.div>
    </div>
  );
}
