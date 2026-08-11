import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArgesLogo } from '../components/ArgesLogo';
import { api } from '../lib/api';
import { EASE, pageTransition } from '../animations';

const STEPS = ['Account', 'Verify Device', 'Blind User', 'Done'];
const VALID_CODE = 'ARG-7K3M9-P2Q8R-4X';

export function Signup() {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<'nfc' | 'manual' | 'qr'>('nfc');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [verified, setVerified] = useState(false);
  const [nfcScanning, setNfcScanning] = useState(false);
  const navigate = useNavigate();

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
    <div className="theme-admin min-h-screen p-6 pt-16 flex flex-col items-center">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] z-50 transition-all duration-700" style={{ width: `${(step + 1) * 25}%`, boxShadow: '0 0 12px var(--accent-glow)' }} />

      {/* Steps */}
      <div className="flex justify-center w-full max-w-[560px] mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1 max-w-[140px] flex flex-col items-center gap-2 relative">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-400 border-2 ${i < step ? 'bg-[var(--accent)] border-[var(--accent)] text-black' : i === step ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[rgba(255,255,255,0.18)] text-[#8B8B9A]'}`}
              style={i === step ? { boxShadow: '0 0 16px var(--accent-glow)' } : {}}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-[0.7rem] ${i === step ? 'text-white' : 'text-[#8B8B9A]'}`}>{label}</span>
            {i < 3 && <div className={`absolute top-[18px] right-[-50%] w-full h-0.5 ${i < step ? 'bg-[var(--accent)]' : 'bg-[rgba(255,255,255,0.10)]'}`} />}
          </div>
        ))}
      </div>

      <motion.div key={step} variants={pageTransition} initial="initial" animate="animate" exit="exit"
        className="glass specular max-w-[520px] w-full p-12 rounded-[32px]" style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.6)' }}>
        <div className="flex justify-center mb-8"><ArgesLogo size={48} /></div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" variants={pageTransition} initial="initial" animate="animate" exit="exit">
              <h2 className="font-display font-semibold text-xl mb-2">Create your account</h2>
              <p className="text-sm text-[#8B8B9A] mb-7">You'll be the <strong className="text-[var(--accent)]">Family Head</strong> — you manage the family tree, add members, and control device access.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input className="glass border border-[rgba(255,255,255,0.10)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none" placeholder="Full Name" />
                <input className="glass border border-[rgba(255,255,255,0.10)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none" placeholder="+91 ..." />
              </div>
              <input className="w-full glass border border-[rgba(255,255,255,0.10)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none mb-4" type="email" placeholder="Email Address" />
              <div className="grid grid-cols-2 gap-3 mb-7">
                <select className="glass border border-[rgba(255,255,255,0.10)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"><option>Mother</option><option>Father</option><option>Spouse</option><option>Sibling</option><option>Guardian</option></select>
                <select className="glass border border-[rgba(255,255,255,0.10)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"><option>English</option><option>हिन्दी</option><option>தமிழ்</option><option>తెలుగు</option></select>
              </div>
              <button onClick={() => setStep(1)} className="w-full py-3.5 rounded-xl font-semibold bg-[var(--accent)] text-black" style={{ boxShadow: '0 4px 20px var(--accent-glow)' }}>Continue →</button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" variants={pageTransition} initial="initial" animate="animate" exit="exit">
              <h2 className="font-display font-semibold text-xl mb-2">Pair your ARGES glasses</h2>
              <p className="text-sm text-[#8B8B9A] mb-6">Choose your preferred method.</p>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {([['nfc', 'NFC Tap', 'Easiest'], ['manual', 'Manual Code', '15-digit'], ['qr', 'QR Scan', 'Camera']] as const).map(([m, name, desc]) => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={`p-4 rounded-xl text-center text-xs transition-all border ${method === m ? 'border-[var(--accent)] bg-[rgba(255,107,26,0.06)] text-[var(--accent)]' : 'glass border-[rgba(255,255,255,0.10)] text-[#8B8B9A] hover:border-[rgba(255,255,255,0.22)]'}`}>
                    <div className="font-semibold mb-0.5">{name}</div><div className="text-[0.65rem] opacity-70">{desc}</div>
                  </button>
                ))}
              </div>

              {verified ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
                    style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.15), rgba(76,175,80,0.03))', border: '2px solid rgba(76,175,80,0.3)' }}>
                    <svg viewBox="0 0 24 24" width="36" height="36" className="stroke-[#4CAF50] fill-none" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  </div>
                  <p className="text-[#4CAF50] font-semibold text-sm">✓ Device Paired!</p>
                  <p className="text-xs text-[#8B8B9A] mt-1">Device: ARG-7K3M9-P2Q8R-4X · v2.1.3</p>
                  <button onClick={() => setStep(2)} className="mt-4 w-full py-3.5 rounded-xl font-semibold bg-[var(--accent)] text-black" style={{ boxShadow: '0 4px 20px var(--accent-glow)' }}>Continue →</button>
                </div>
              ) : method === 'nfc' ? (
                <div className="text-center py-4">
                  <div className="w-32 h-32 mx-auto relative flex items-center justify-center mb-5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="absolute w-16 h-16 rounded-full border-2 border-[var(--accent)]"
                        style={{ animation: `pulse 2s ${i * 0.4}s infinite`, opacity: nfcScanning ? 1 : 0.3 }} />
                    ))}
                    <div className="w-14 h-14 rounded-full flex items-center justify-center z-10" style={{ background: 'radial-gradient(circle, rgba(255,107,26,0.15), rgba(255,107,26,0.03))', border: '2px solid rgba(255,107,26,0.2)' }}>
                      <svg viewBox="0 0 24 24" width="28" height="28" className="stroke-[var(--accent)] fill-none" strokeWidth="1.5"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /></svg>
                    </div>
                  </div>
                  <p className="text-sm text-[#8B8B9A] mb-5">{nfcScanning ? 'Scanning... detecting NFC tag...' : 'Hold your phone near the glasses to pair'}</p>
                  <button onClick={handleNFC} disabled={nfcScanning} className="w-full py-3.5 rounded-xl font-semibold bg-[var(--accent)] text-black" style={{ boxShadow: '0 4px 20px var(--accent-glow)' }}>
                    {nfcScanning ? 'Scanning...' : 'Simulate NFC Tap'}
                  </button>
                </div>
              ) : method === 'manual' ? (
                <div>
                  <div className="font-mono text-xs text-[#555566] text-center mb-3">Format: <span className="text-[var(--accent)]">ARG-XXXXX-XXXXX-XX</span></div>
                  <input value={code} onChange={e => setCode(formatCode(e.target.value))} maxLength={17} placeholder="ARG-XXXXX-XXXXX-XX"
                    className={`w-full glass border rounded-xl px-4 py-3 text-center font-mono text-lg tracking-wider uppercase ${codeError ? 'border-[#EF5350]' : 'border-[rgba(255,255,255,0.10)]'} focus:outline-none focus:border-[var(--accent)]`} />
                  {codeError && <p className="text-[#EF5350] text-xs text-center mt-2">Invalid code. Demo code: ARG-7K3M9-P2Q8R-4X</p>}
                  <p className="text-xs text-[#8B8B9A] mt-3 mb-4 p-3 rounded-xl bg-[rgba(255,107,26,0.04)] border border-[rgba(255,107,26,0.12)]">
                    Found inside the left temple + retail box. Demo code: <strong className="text-[var(--accent)]">ARG-7K3M9-P2Q8R-4X</strong>
                  </p>
                  <button onClick={verifyManual} className="w-full py-3.5 rounded-xl font-semibold bg-[var(--accent)] text-black" style={{ boxShadow: '0 4px 20px var(--accent-glow)' }}>Verify Code</button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-44 h-44 mx-auto rounded-2xl border-2 border-[rgba(255,255,255,0.18)] relative overflow-hidden bg-[rgba(0,0,0,0.3)] mb-5">
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" style={{ animation: 'pulse 2s infinite', top: '10%' }} />
                  </div>
                  <button onClick={() => setVerified(true)} className="w-full py-3.5 rounded-xl font-semibold bg-[var(--accent)] text-black" style={{ boxShadow: '0 4px 20px var(--accent-glow)' }}>Simulate QR Scan</button>
                </div>
              )}

              <button onClick={() => setStep(0)} className="w-full mt-3 py-2.5 text-xs text-[#8B8B9A] hover:text-white">← Back</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={pageTransition} initial="initial" animate="animate" exit="exit">
              <h2 className="font-display font-semibold text-xl mb-2">Add the blind user</h2>
              <p className="text-sm text-[#8B8B9A] mb-7">Who will wear the ARGES glasses?</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input className="glass border border-[rgba(255,255,255,0.10)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none" placeholder="Blind User's Name" />
                <input className="glass border border-[rgba(255,255,255,0.10)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none" type="number" placeholder="Age" />
              </div>
              <input className="w-full glass border border-[rgba(255,255,255,0.10)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none mb-7" placeholder="Their Phone" />
              <button onClick={handleSubmit} className="w-full py-3.5 rounded-xl font-semibold bg-[var(--accent)] text-black" style={{ boxShadow: '0 4px 20px var(--accent-glow)' }}>Create Family →</button>
              <button onClick={() => setStep(1)} className="w-full mt-3 py-2.5 text-xs text-[#8B8B9A] hover:text-white">← Back</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" variants={pageTransition} initial="initial" animate="animate" exit="exit" className="text-center py-8">
              <div className="flex justify-center mb-5">
                <svg viewBox="0 0 24 24" width="72" height="72" className="stroke-[#4CAF50] fill-none" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 20px rgba(76,175,80,0.3))' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="font-display font-semibold text-xl mb-2">Family Created!</h2>
              <p className="text-sm text-[#8B8B9A] mb-7 leading-relaxed">Your family tree is set up. You're the Family Head with full management access.</p>
              <Link to="/family"><button className="w-full py-3.5 rounded-xl font-semibold bg-[var(--accent)] text-black mb-3" style={{ boxShadow: '0 4px 20px var(--accent-glow)' }}>Go to Family Dashboard →</button></Link>
              <Link to="/"><button className="w-full py-2.5 text-xs text-[#8B8B9A]">Back to Home</button></Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
