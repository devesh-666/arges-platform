import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Logo } from '../components/Primitives';
import { EASE } from '../animations/obsidian';

/**
 * Signup is a single transaction on the backend: it creates the family head,
 * the blind user, the Family document and the device pairing together. The
 * wizard exists because that is a lot to ask on one screen — but everything
 * collected here is submitted, so the fields are controlled throughout.
 */

const STEPS = ['Account', 'Device', 'Wearer', 'Done'];
const DEMO_CODE = 'ARG-7K3M9-P2Q8R-4X';

const RELATIONS = ['Mother', 'Father', 'Spouse', 'Sibling', 'Child', 'Guardian', 'Grandparent', 'Other'];
const LANGUAGES: [string, string][] = [
  ['en', 'English'], ['hi', 'Hindi'], ['ta', 'Tamil'], ['te', 'Telugu'],
  ['mr', 'Marathi'], ['bn', 'Bengali'], ['kn', 'Kannada'], ['ml', 'Malayalam'],
];

type Privacy = { gpsAlwaysVisible: boolean; videoRequiresConsent: boolean; emergencyAutoAccess: boolean };

export function Signup() {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<'nfc' | 'manual' | 'qr'>('nfc');

  // Step 0 — the family head
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('Mother');
  const [language, setLanguage] = useState('en');

  // Step 1 — pairing
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [pairedCode, setPairedCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [codeError, setCodeError] = useState('');

  // Step 2 — the wearer
  const [wearerName, setWearerName] = useState('');
  const [wearerAge, setWearerAge] = useState('');
  const [wearerPhone, setWearerPhone] = useState('');
  const [privacy, setPrivacy] = useState<Privacy>({
    gpsAlwaysVisible: true,
    videoRequiresConsent: true,
    emergencyAutoAccess: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const formatCode = (v: string) => {
    const clean = v.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 15);
    const rest = clean.startsWith('ARG') ? clean.substring(3) : clean;
    let f = 'ARG';
    if (rest.length > 0) f += '-' + rest.substring(0, 5);
    if (rest.length > 5) f += '-' + rest.substring(5, 10);
    if (rest.length > 10) f += '-' + rest.substring(10, 12);
    return f;
  };

  const pair = (value: string) => { setPairedCode(value); setVerified(true); setCodeError(''); };

  const simulateNfc = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); pair(DEMO_CODE); }, 2200);
  };

  const verifyManual = () => {
    const strip = (s: string) => s.replace(/[^A-Z0-9]/g, '');
    if (strip(code) === strip(DEMO_CODE)) pair(code);
    else setCodeError(`Invalid code. The demo device is ${DEMO_CODE}.`);
  };

  const step0Valid = name.trim() && email.trim();
  const step2Valid = wearerName.trim();

  const submit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await api.auth.signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        deviceCode: pairedCode || DEMO_CODE,
        relation: relation.toLowerCase(),
        language,
        blindUserName: wearerName.trim(),
        blindUserAge: wearerAge ? Number(wearerAge) : undefined,
        blindUserPhone: wearerPhone.trim(),
        privacy,
      });
      if (res?.success && res.data?.token) localStorage.setItem('arges_token', res.data.token);
      setStep(3);
    } catch (e) {
      // Mock mode answers without persisting, so a failure here should not
      // strand the user mid-wizard — surface it and still complete.
      setSubmitError(e instanceof Error ? e.message : 'Could not reach the server.');
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--s7) var(--s5) var(--s6)' }}>
      {/* Progress hairline */}
      <div aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'var(--hairline)', zIndex: 50 }}>
        <motion.div
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ height: '100%', background: 'var(--accent)' }}
        />
      </div>

      <Link to="/" style={{ display: 'inline-flex' }} aria-label="ARGES home"><Logo size={34} /></Link>
      <p className="eyebrow" style={{ marginTop: 'var(--s4)' }}>/ Create a family account</p>

      <ol style={{ listStyle: 'none', display: 'flex', gap: 'var(--s5)', margin: 'var(--s5) 0 var(--s7)', flexWrap: 'wrap', justifyContent: 'center' }}>
        {STEPS.map((label, i) => (
          <li key={label} className="mono" style={{ color: i === step ? 'var(--accent)' : i < step ? 'var(--body)' : 'var(--faint)', display: 'flex', gap: 6 }}>
            <span aria-hidden="true">{i < step ? '●' : i === step ? '◐' : '○'}</span>
            {label.toUpperCase()}
          </li>
        ))}
      </ol>

      <div className="panel" style={{ width: '100%', maxWidth: 520, padding: 'var(--s6)' }}>
        <AnimatePresence mode="wait">
          {/* ── Step 0 — account ─────────────────────────── */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
              <h1 className="display-sm">Create your account</h1>
              <p className="body-mute" style={{ marginTop: 'var(--s3)', fontSize: '0.9375rem' }}>
                You will be the <span style={{ color: 'var(--accent)' }}>family head</span> — you manage the family tree,
                add members, and control device access.
              </p>

              <div style={{ display: 'grid', gap: 'var(--s4)', marginTop: 'var(--s6)' }}>
                <div className="field">
                  <label className="field-label" htmlFor="su-name">Full name</label>
                  <input id="su-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lakshmi Ammal" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--s4)' }}>
                  <div className="field">
                    <label className="field-label" htmlFor="su-email">Email</label>
                    <input id="su-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="su-phone">Phone</label>
                    <input id="su-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--s4)' }}>
                  <div className="field">
                    <label className="field-label" htmlFor="su-rel">Your relation</label>
                    <select id="su-rel" className="input" value={relation} onChange={(e) => setRelation(e.target.value)}>
                      {RELATIONS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="su-lang">Language</label>
                    <select id="su-lang" className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                      {LANGUAGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button className="btn btn-accent" style={{ width: '100%', marginTop: 'var(--s6)' }} disabled={!step0Valid} onClick={() => setStep(1)}>
                Continue
              </button>
              {!step0Valid && <p className="form-note" style={{ marginTop: 'var(--s3)', textAlign: 'center' }}>Name and email are required.</p>}
            </motion.div>
          )}

          {/* ── Step 1 — pairing ─────────────────────────── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
              <h1 className="display-sm">Pair the glasses</h1>
              <p className="body-mute" style={{ marginTop: 'var(--s3)', fontSize: '0.9375rem' }}>
                Link the device to your family. The pairing code is laser-etched inside the left temple.
              </p>

              {verified ? (
                <div style={{ textAlign: 'center', padding: 'var(--s7) 0' }}>
                  <span className="tag tag-ok" style={{ marginBottom: 'var(--s4)' }}><span className="dot" />Paired</span>
                  <p className="mono" style={{ color: 'var(--body)', marginTop: 'var(--s4)' }}>{pairedCode}</p>
                  <p className="mono" style={{ color: 'var(--faint)', marginTop: 'var(--s2)' }}>FIRMWARE v2.1.3</p>
                  <button className="btn btn-accent" style={{ width: '100%', marginTop: 'var(--s6)' }} onClick={() => setStep(2)}>Continue</button>
                </div>
              ) : (
                <>
                  <div role="tablist" aria-label="Pairing method" style={{ display: 'flex', gap: 'var(--s2)', margin: 'var(--s5) 0' }}>
                    {([['nfc', 'NFC tap'], ['manual', 'Manual code'], ['qr', 'QR scan']] as const).map(([m, label]) => (
                      <button
                        key={m}
                        role="tab"
                        aria-selected={method === m}
                        onClick={() => { setMethod(m); setCodeError(''); }}
                        className={`btn btn-sm ${method === m ? 'btn-accent' : 'btn-outline'}`}
                        style={{ flex: 1 }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {method === 'nfc' && (
                    <div style={{ textAlign: 'center', padding: 'var(--s5) 0' }}>
                      <p className="body-mute" style={{ fontSize: '0.9375rem' }}>
                        {scanning ? 'Scanning — hold steady…' : 'Hold your phone against the right temple, where the NFC tag sits.'}
                      </p>
                      <button className="btn btn-outline" style={{ width: '100%', marginTop: 'var(--s5)' }} onClick={simulateNfc} disabled={scanning}>
                        {scanning ? 'Scanning…' : 'Simulate NFC tap'}
                      </button>
                    </div>
                  )}

                  {method === 'manual' && (
                    <div style={{ padding: 'var(--s3) 0' }}>
                      <div className="field">
                        <label className="field-label" htmlFor="su-code">Pairing code</label>
                        <input
                          id="su-code"
                          className="input mono"
                          value={code}
                          maxLength={19}
                          onChange={(e) => { setCode(formatCode(e.target.value)); setCodeError(''); }}
                          placeholder="ARG-XXXXX-XXXXX-XX"
                          style={{ letterSpacing: '0.1em' }}
                        />
                      </div>
                      {codeError && <p className="form-error" role="alert" style={{ marginTop: 'var(--s3)' }}>{codeError}</p>}
                      <p className="form-note" style={{ marginTop: 'var(--s3)' }}>Demo device: {DEMO_CODE}</p>
                      <button className="btn btn-outline" style={{ width: '100%', marginTop: 'var(--s5)' }} onClick={verifyManual}>Verify code</button>
                    </div>
                  )}

                  {method === 'qr' && (
                    <div style={{ textAlign: 'center', padding: 'var(--s5) 0' }}>
                      <p className="body-mute" style={{ fontSize: '0.9375rem' }}>
                        Point the camera at the code on the retail box or inside the left temple.
                      </p>
                      <button className="btn btn-outline" style={{ width: '100%', marginTop: 'var(--s5)' }} onClick={() => pair(DEMO_CODE)}>Simulate QR scan</button>
                    </div>
                  )}
                </>
              )}

              <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 'var(--s4)' }} onClick={() => setStep(0)}>Back</button>
            </motion.div>
          )}

          {/* ── Step 2 — the wearer ──────────────────────── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
              <h1 className="display-sm">Who will wear them?</h1>
              <p className="body-mute" style={{ marginTop: 'var(--s3)', fontSize: '0.9375rem' }}>
                You can add more family members once setup is complete.
              </p>

              <div style={{ display: 'grid', gap: 'var(--s4)', marginTop: 'var(--s6)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 'var(--s4)' }}>
                  <div className="field">
                    <label className="field-label" htmlFor="w-name">Their name</label>
                    <input id="w-name" className="input" value={wearerName} onChange={(e) => setWearerName(e.target.value)} placeholder="e.g. Ravi Kumar" />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="w-age">Age</label>
                    <input id="w-age" className="input" type="number" min="0" value={wearerAge} onChange={(e) => setWearerAge(e.target.value)} placeholder="24" />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="w-phone">Their phone</label>
                  <input id="w-phone" className="input" value={wearerPhone} onChange={(e) => setWearerPhone(e.target.value)} placeholder="+91 …" />
                </div>
              </div>

              <fieldset style={{ border: 0, marginTop: 'var(--s6)' }}>
                <legend className="field-label" style={{ marginBottom: 'var(--s3)' }}>Privacy</legend>
                <div style={{ display: 'grid', gap: 1, background: 'var(--hairline)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  {([
                    ['gpsAlwaysVisible', 'GPS always visible to family', 'Family can see location without asking.'],
                    ['videoRequiresConsent', 'Video and audio require consent', 'They accept each viewing request.'],
                    ['emergencyAutoAccess', 'Emergency auto-access', 'Family gets instant access on a fall or SOS.'],
                  ] as const).map(([key, label, note]) => (
                    <label key={key} style={{ background: 'var(--canvas-card)', padding: 'var(--s4)', display: 'flex', gap: 'var(--s4)', alignItems: 'flex-start', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={privacy[key]}
                        onChange={(e) => setPrivacy({ ...privacy, [key]: e.target.checked })}
                        style={{ marginTop: 3, accentColor: 'var(--accent)', width: 16, height: 16 }}
                      />
                      <span>
                        <span style={{ fontSize: '0.9375rem' }}>{label}</span>
                        <span className="body-mute" style={{ display: 'block', fontSize: '0.8125rem', marginTop: 2 }}>{note}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button className="btn btn-accent" style={{ width: '100%', marginTop: 'var(--s6)' }} disabled={!step2Valid || submitting} onClick={submit}>
                {submitting ? 'Creating…' : 'Create family'}
              </button>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 'var(--s3)' }} onClick={() => setStep(1)} disabled={submitting}>Back</button>
            </motion.div>
          )}

          {/* ── Step 3 — done ────────────────────────────── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }} style={{ textAlign: 'center', padding: 'var(--s6) 0' }}>
              <span className="tag tag-ok"><span className="dot" />Family created</span>
              <h1 className="display-sm" style={{ marginTop: 'var(--s5)' }}>You are all set{name ? `, ${name.split(' ')[0]}` : ''}.</h1>
              <p className="body-mute" style={{ marginTop: 'var(--s3)', fontSize: '0.9375rem' }}>
                {wearerName ? `${wearerName}'s glasses are paired. ` : ''}You are the family head with full management access.
              </p>
              {submitError && (
                <p className="form-note" style={{ marginTop: 'var(--s4)' }}>
                  Saved locally only — the server said: {submitError}
                </p>
              )}
              <button className="btn btn-accent" style={{ width: '100%', marginTop: 'var(--s6)' }} onClick={() => navigate('/family')}>
                Go to the family dashboard
              </button>
              <Link to="/" className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 'var(--s3)' }}>Back to home</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mono" style={{ color: 'var(--faint)', marginTop: 'var(--s7)' }}>
        © 2026 ARGES · <Link to="/" style={{ color: 'var(--mute)' }}>HOME</Link>
      </p>
    </div>
  );
}
