import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { EASE } from '../animations/obsidian';

export function ChangePasswordCard() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setMsg('');
    if (!next || next.length < 6) { setMsg('New password must be at least 6 characters.'); setOk(false); return; }
    if (next !== confirm) { setMsg('New passwords do not match.'); setOk(false); return; }

    setBusy(true);
    try {
      const res = await api.auth.changePassword(current, next);
      setMsg(res.success ? 'Password changed. A confirmation is on its way to your inbox.' : 'Could not change the password.');
      setOk(res.success);
      if (res.success) { setCurrent(''); setNext(''); setConfirm(''); }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Could not change the password.');
      setOk(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="panel"
      style={{ padding: 'var(--s5)' }}
      onSubmit={(e) => { e.preventDefault(); void submit(); }}
    >
      <h3 className="display-sm">Change password</h3>
      <p className="body-mute" style={{ marginTop: 'var(--s2)', fontSize: '0.875rem' }}>
        Set a password to sign in with email and password instead of passkey alone.
      </p>

      <div style={{ display: 'grid', gap: 'var(--s4)', marginTop: 'var(--s5)' }}>
        <div className="field">
          <label className="field-label" htmlFor="cp-current">Current password — leave empty if none set</label>
          <input id="cp-current" className="input" type="password" autoComplete="current-password"
            value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="cp-next">New password</label>
          <input id="cp-next" className="input" type="password" autoComplete="new-password"
            value={next} onChange={(e) => setNext(e.target.value)} placeholder="Minimum 6 characters" />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="cp-confirm">Confirm new password</label>
          <input id="cp-confirm" className="input" type="password" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat new password" />
        </div>
      </div>

      {msg && (
        <p role="status" className={ok ? '' : 'form-error'} style={{ marginTop: 'var(--s4)', fontSize: '0.8125rem', color: ok ? 'var(--ok)' : undefined }}>
          {msg}
        </p>
      )}

      <button type="submit" className="btn btn-accent" disabled={busy} style={{ width: '100%', marginTop: 'var(--s5)' }}>
        {busy ? 'Changing…' : 'Change password'}
      </button>

      <p className="form-note" style={{ marginTop: 'var(--s4)' }}>
        Until a password is set, you can sign in with your email alone.
      </p>
    </motion.form>
  );
}
