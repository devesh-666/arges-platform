import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

export function ChangePasswordCard() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setMsg('');
    if (!next || next.length < 6) {
      setMsg('New password must be at least 6 characters');
      setOk(false);
      return;
    }
    if (next !== confirm) {
      setMsg('New passwords do not match');
      setOk(false);
      return;
    }
    setBusy(true);
    try {
      const res = await api.auth.changePassword(current, next);
      setMsg(res.success ? 'Password changed successfully. Check your email for confirmation.' : 'Failed to change password');
      setOk(res.success);
      if (res.success) {
        setCurrent(''); setNext(''); setConfirm('');
      }
    } catch (e) {
      setMsg((e as Error).message || 'Failed to change password');
      setOk(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="panel"
      style={{ marginBottom: 20 }}
    >
      <div className="panel-header">
        <div>
          <div className="panel-title">Change Password</div>
          <div className="panel-sub">Set a password for email + password login</div>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 14 }}>
        <label className="form-label">Current Password (leave empty if none set)</label>
        <input
          className="form-input"
          type="password"
          value={current}
          onChange={e => setCurrent(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div className="form-group" style={{ marginBottom: 14 }}>
        <label className="form-label">New Password</label>
        <input
          className="form-input"
          type="password"
          value={next}
          onChange={e => setNext(e.target.value)}
          placeholder="Minimum 6 characters"
        />
      </div>

      <div className="form-group" style={{ marginBottom: 18 }}>
        <label className="form-label">Confirm New Password</label>
        <input
          className="form-input"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Repeat new password"
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
      </div>

      {msg && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 10,
          marginBottom: 14,
          fontSize: '0.82rem',
          background: ok ? 'rgba(76,175,80,0.08)' : 'rgba(239,83,80,0.08)',
          border: `0.5px solid ${ok ? 'rgba(76,175,80,0.25)' : 'rgba(239,83,80,0.25)'}`,
          color: ok ? '#4CAF50' : '#EF5350',
        }}>{msg}</div>
      )}

      <button
        className="btn"
        onClick={submit}
        disabled={busy}
        style={{ width: '100%' }}
      >
        {busy ? 'Changing...' : 'Change Password'}
      </button>

      <div style={{ marginTop: 14, fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6 }}>
        You will receive an automated email confirmation after changing your password.
        Until you set a password, you can sign in with just your email (passkey mode).
      </div>
    </motion.div>
  );
}
