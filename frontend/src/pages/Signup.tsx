import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const STEPS = ['Account', 'Verify Device', 'Blind User', 'Done'];
const VALID_CODE = 'ARG-7K3M9-P2Q8R-4X';

export function Signup() {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<'nfc' | 'manual' | 'qr'>('nfc');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [verified, setVerified] = useState(false);
  const [nfcScanning, setNfcScanning] = useState(false);

  const formatCode = (v: string) => {
    const clean = v.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 15);
    let f = 'ARG';
    const rest = clean.substring(3);
    if (rest.length > 0) f += '-' + rest.substring(0, 5);
    if (rest.length > 5) f += '-' + rest.substring(5, 10);
    if (rest.length > 10) f += '-' + rest.substring(10, 12);
    return f;
  };

  const handleNFC = () => {
    setNfcScanning(true);
    setTimeout(() => { setNfcScanning(false); setVerified(true); }, 2500);
  };

  const verifyManual = () => {
    if (code.replace(/[^A-Z0-9]/g, '') === VALID_CODE.replace(/[^A-Z0-9]/g, '')) {
      setVerified(true); setCodeError(false);
    } else {
      setCodeError(true); setTimeout(() => setCodeError(false), 3000);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.auth.signup({ name: 'Lakshmi', email: 'lakshmi@arges.app', deviceCode: VALID_CODE, relation: 'mother', language: 'ta', blindUserName: 'Ravi', blindUserAge: 24, blindUserPhone: '+919876543210', privacy: {} });
    } catch { /* mock mode OK */ }
    setStep(3);
  };

  return (
    // Padding is set inline, not via Tailwind: the `*{padding:0}` reset in arges.css is
    // unlayered, so it outranks Tailwind's layered utilities and `p-6 pt-16` was a no-op.
    // These values match the prototype's wrapper (60px 24px 40px).
    <div className="theme-admin min-h-screen flex flex-col items-center" style={{ cursor: 'none', padding: '60px 24px 40px' }}>
      <div className="cursor-dot" />
      <div className="cursor-ring" />

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, height: '3px', background: 'linear-gradient(90deg, var(--orange), var(--orange-bright))', zIndex: 50, transition: 'width 0.6s', boxShadow: '0 0 12px var(--orange-glow)', width: `${(step + 1) * 25}%` }} />

      {/* Steps */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '560px', marginBottom: '40px' }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: 'flex', flex: 1, maxWidth: '140px', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.85rem', zIndex: 1, transition: 'all 0.4s',
              border: `2px solid ${i < step ? 'var(--orange)' : i === step ? 'var(--orange)' : 'rgba(255,255,255,0.18)'}`,
              background: i < step ? 'var(--orange)' : 'transparent',
              color: i < step ? '#000' : i === step ? 'var(--orange)' : 'var(--muted)',
              boxShadow: i === step ? '0 0 16px var(--orange-glow)' : 'none',
            }}>{i < step ? 'OK' : i + 1}</div>
            <span style={{ fontSize: '0.7rem', color: i === step ? '#fff' : 'var(--muted)' }}>{label}</span>
            {i < 3 && <div style={{ position: 'absolute', top: '18px', right: '-50%', width: '100%', height: '2px', background: i < step ? 'var(--orange)' : 'rgba(255,255,255,0.1)' }} />}
          </div>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="card"
        style={{ maxWidth: '520px', width: '100%', position: 'relative' }}
      >
        <button className="modal-close" onClick={() => step > 0 ? setStep(step - 1) : null} style={{ position: 'absolute', top: '20px', right: '20px', opacity: step > 0 && step < 3 ? 1 : 0, pointerEvents: step > 0 && step < 3 ? 'auto' : 'none' }}>
          <svg viewBox="0 0 24 24" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/></svg>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <svg viewBox="0 0 100 100" width="48" height="48" style={{ filter: 'drop-shadow(0 0 12px var(--orange-glow))', margin: '0 auto' }}>
            <path d="M50 28 C28 28 14 50 14 50 C14 50 28 72 50 72 C72 72 86 50 86 50 C86 50 72 28 50 28 Z" stroke="#FF6B1A" strokeWidth="3" fill="none"/>
            <circle cx="50" cy="50" r="9" stroke="#FF6B1A" strokeWidth="3" fill="none"/>
            <circle cx="50" cy="50" r="3.5" fill="#FF6B1A"/>
          </svg>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '1.5rem', marginTop: '8px' }}>ARGES Vision</h1>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: 'var(--orange)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '4px' }}>Create Family Account</div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, fontSize: '1.4rem', marginBottom: '8px' }}>Create your account</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '28px', lineHeight: 1.5 }}>You'll be the <strong style={{ color: 'var(--orange-bright)' }}>Family Head</strong> — you manage the family tree, add members, and control device access.</p>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="e.g. Lakshmi Ammal" /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+91 ..." /></div>
              </div>
              <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="you@email.com" /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Your Relation to Blind User</label><select className="form-select"><option>Mother</option><option>Father</option><option>Spouse</option><option>Sibling</option><option>Child</option><option>Guardian</option><option>Grandparent</option><option>Other</option></select></div>
                <div className="form-group"><label className="form-label">Preferred Language</label><select className="form-select"><option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option><option>Marathi</option><option>Bengali</option><option>Kannada</option></select></div>
              </div>
              <button className="btn" onClick={() => setStep(1)} style={{ width: '100%' }}>Continue →</button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, fontSize: '1.4rem', marginBottom: '8px' }}>Pair your ARGES glasses</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '24px' }}>Verify your device to link it to your family. Choose your preferred method below.</p>

              <div className="method-tabs">
                {([['nfc', 'NFC Tap', 'Easiest'], ['manual', 'Manual Code', '15-digit'], ['qr', 'QR Scan', 'Camera']] as const).map(([m, name, desc]) => (
                  <div key={m} className={`method-tab${method === m ? ' active' : ''}`} onClick={() => setMethod(m)}>
                    <svg viewBox="0 0 24 24" width="28" height="28" style={{ stroke: method === m ? 'var(--orange)' : 'var(--muted)', fill: 'none', strokeWidth: 1.5, marginBottom: '8px' }}>
                      {m === 'nfc' && <><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12" y2="20"/></>}
                      {m === 'manual' && <><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="6.01" y2="8"/><line x1="10" y1="8" x2="10.01" y2="8"/><line x1="14" y1="8" x2="14.01" y2="8"/><line x1="18" y1="8" x2="18.01" y2="8"/><line x1="6" y1="12" x2="6.01" y2="12"/><line x1="10" y1="12" x2="10.01" y2="12"/><line x1="14" y1="12" x2="14.01" y2="12"/><line x1="18" y1="12" x2="18.01" y2="12"/><line x1="6" y1="16" x2="18" y2="16"/></>}
                      {m === 'qr' && <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="14" y1="14" x2="14" y2="14"/><line x1="18" y1="14" x2="18" y2="14"/><line x1="14" y1="18" x2="14" y2="18"/></>}
                    </svg>
                    <span className="name">{name}</span>
                    <span className="desc">{desc}</span>
                  </div>
                ))}
              </div>

              {verified ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px', background: 'radial-gradient(circle, rgba(76,175,80,0.15), rgba(76,175,80,0.03))', border: '2px solid rgba(76,175,80,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" width="36" height="36" style={{ stroke: '#4CAF50', fill: 'none', strokeWidth: 1.5 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <p style={{ color: '#4CAF50', fontWeight: 600, fontSize: '0.88rem' }}>Device Paired!</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '4px' }}>Device ID: ARG-7K3M9-P2Q8R-4X - Firmware: v2.1.3</p>
                  <button className="btn" onClick={() => setStep(2)} style={{ width: '100%', marginTop: '20px' }}>Continue →</button>
                </div>
              ) : method === 'nfc' ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div className="nfc-display">
                    <div className="nfc-icon-wrap" id="nfcIconWrap">
                      <div className="nfc-waves"><div className="nfc-wave"/><div className="nfc-wave"/><div className="nfc-wave"/></div>
                      <div className="ncc-icon-center" id="nfcCenter">
                        <svg viewBox="0 0 24 24" width="32" height="32" style={{ stroke: 'var(--orange)', fill: 'none', strokeWidth: 1.5 }}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12" y2="20"/></svg>
                      </div>
                    </div>
                    <div id="nfcStatus" style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '20px' }}>{nfcScanning ? 'Scanning... detecting NFC tag...' : 'Hold your phone near the ARGES glasses to pair'}</div>
                  </div>
                  <div className="info-box"><strong>NFC Pairing</strong><br/>The glasses have an NFC tag embedded in the right temple. Just tap your phone to the temple.</div>
                  <button className="btn" id="nfcBtn" onClick={handleNFC} disabled={nfcScanning} style={{ width: '100%', marginBottom: '12px' }}>{nfcScanning ? 'Scanning...' : 'Simulate NFC Tap'}</button>
                </div>
              ) : method === 'manual' ? (
                <div>
                  <div className="code-format">Format: <span style={{ color: 'var(--orange)' }}>ARG-XXXXX-XXXXX-XX</span></div>
                  <div className="form-group">
                    <input className="form-input code-input" value={code} onChange={e => setCode(formatCode(e.target.value))} maxLength={17} placeholder="ARG-XXXXX-XXXXX-XX" style={{ borderColor: codeError ? '#EF5350' : undefined }} />
                  </div>
                  {codeError && <div style={{ color: '#EF5350', fontSize: '0.78rem', marginBottom: '12px', textAlign: 'center' }}>Invalid code. Demo code: ARG-7K3M9-P2Q8R-4X</div>}
                  <div className="info-box">Found inside the left temple and on the retail box. Demo code: <strong style={{ color: 'var(--orange)' }}>ARG-7K3M9-P2Q8R-4X</strong></div>
                  <button className="btn" onClick={verifyManual} style={{ width: '100%', marginBottom: '12px' }}>Verify Code</button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div className="qr-display">
                    <div className="qr-frame"><div className="qr-scan-line"/></div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '20px' }}>Point your camera at the QR code on the box or inside the temple</div>
                  </div>
                  <div className="info-box"><strong>QR Pairing</strong><br/>A QR code is printed on the retail packaging and laser-etched inside the left temple.</div>
                  <button className="btn" onClick={() => setVerified(true)} style={{ width: '100%', marginBottom: '12px' }}>Simulate QR Scan</button>
                </div>
              )}

              <button onClick={() => setStep(0)} className="btn btn-ghost" style={{ width: '100%', fontSize: '0.82rem', padding: '10px' }}>← Back</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, fontSize: '1.4rem', marginBottom: '8px' }}>Add the blind user</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '28px' }}>Who will be wearing the ARGES glasses? You'll manage their device and can add more family members after setup.</p>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Blind User's Name</label><input className="form-input" placeholder="e.g. Ravi Kumar" /></div>
                <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" placeholder="e.g. 24" /></div>
              </div>
              <div className="form-group"><label className="form-label">Their Phone (for setup assistance)</label><input className="form-input" placeholder="+91 ..." /></div>
              <div className="form-group"><label className="form-label">Privacy Preferences</label></div>
              <div className="toggle-row"><div><div style={{ fontSize: '0.85rem' }}>GPS always visible to family</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Family can see location without asking</div></div><div className="toggle on" onClick={e => (e.target as HTMLElement).classList.toggle('on')} /></div>
              <div className="toggle-row"><div><div style={{ fontSize: '0.85rem' }}>Video/audio requires consent</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Blind user must accept each viewing request</div></div><div className="toggle on" onClick={e => (e.target as HTMLElement).classList.toggle('on')} /></div>
              <div className="toggle-row"><div><div style={{ fontSize: '0.85rem' }}>Emergency auto-access</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Family gets instant access on fall/SOS</div></div><div className="toggle on" onClick={e => (e.target as HTMLElement).classList.toggle('on')} /></div>
              <button className="btn" onClick={handleSubmit} style={{ width: '100%', marginTop: '20px' }}>Create Family →</button>
              <button onClick={() => setStep(1)} className="btn btn-ghost" style={{ width: '100%', fontSize: '0.82rem', padding: '10px', marginTop: '8px' }}>← Back</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <svg viewBox="0 0 24 24" width="80" height="80" style={{ stroke: '#4CAF50', fill: 'none', strokeWidth: 1.5, margin: '0 auto 20px', filter: 'drop-shadow(0 0 20px rgba(76,175,80,0.3))' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, fontSize: '1.4rem', marginBottom: '6px' }}>Family Created!</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '28px', lineHeight: 1.5 }}>Your family tree is set up. You're the Family Head with full management access.</p>
              <Link to="/family"><button className="btn" style={{ width: '100%', marginBottom: '12px' }}>Go to Family Dashboard →</button></Link>
              <Link to="/"><button className="btn btn-ghost" style={{ width: '100%', fontSize: '0.82rem', padding: '10px' }}>Back to Home</button></Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <footer className="auth-foot">
        © 2026 ARGES · Forging Light. Empowering Sight. · <Link to="/">Home</Link>
      </footer>
    </div>
  );
}
