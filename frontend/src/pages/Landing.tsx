import { useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuroraField, ClayTile, GlassCard, ParallaxLayer, usePointer } from '../components/Aurora';
import { FilmBlob, FilmGlow, FilmText, LiquidLens } from '../components/FilmSurfaces';
import { Logo } from '../components/Primitives';
import { MEDIA } from '../lib/media';

/**
 * AURORA — the landing page.
 *
 * A deliberately different surface from the rest of the app: /3d and the
 * dashboards stay on Obsidian's restraint, this one is a spectacle. All nine
 * clips appear here and not one is presented as a video player — each is a
 * lens, letterform fill, liquid blob or light source. See FilmSurfaces.tsx.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const STATS = [
  { v: '15M+', l: 'Blind in India' },
  { v: '₹9,999', l: 'Starting price' },
  { v: '<1.5s', l: 'Voice to answer' },
  { v: '32+', l: 'Indian languages' },
];

const ECOSYSTEM = [
  { n: '01', t: 'Smart Vision', d: 'Obstacle detection, scene description and navigation — including the overhead hazards a cane will never find.', c: 'rgba(124,58,237,0.35)' },
  { n: '02', t: 'Reading Intelligence', d: 'OCR, currency, product and colour recognition. It reads the world aloud, on the frame, offline.', c: 'rgba(255,107,26,0.35)' },
  { n: '03', t: 'Family Guardian', d: 'Encrypted video, audio and GPS streamed to family. Talk back. SOS in a single touch.', c: 'rgba(20,184,166,0.35)' },
  { n: '04', t: 'OmniAccess', d: 'Operate a phone, laptop or tablet exactly as a sighted person would. Equality, not assistance.', c: 'rgba(244,63,94,0.35)' },
  { n: '05', t: 'Echo Network', d: 'A community mesh sharing hazards, where volunteer vision arrives in five seconds.', c: 'rgba(124,58,237,0.35)' },
];

const ZONES = [
  { src: MEDIA.templeLeft,  t: 'Left temple',  d: '3000mAh cell, 3W driver, amplifier and charge controller.' },
  { src: MEDIA.templeFront, t: 'Front frame',  d: 'Snap-fit camera, MEMS microphone and the wire channel.' },
  { src: MEDIA.templeRight, t: 'Right temple', d: 'Pi Zero 2 W, GPS, accelerometer — the brain.' },
];

const PRICING = [
  { tier: 'ARGES One', price: '₹9,999', per: 'one-time · glasses only', feats: ['All standalone AI features', 'Lifetime offline AI', 'OCR · currency · faces', 'Wake-word assistant'], hero: false },
  { tier: 'ARGES Family', price: '₹12,999', per: 'one-time · glasses + band', feats: ['Everything in ARGES One', 'HapticBand included', '1-year cloud streaming', 'Guardian Dashboard', 'Echo Network access'], hero: true },
  { tier: 'ARGES Care', price: '₹49', per: 'per month · after year one', feats: ['Streaming continuation', 'Echo Network', 'Software updates', 'Companion AI premium'], hero: false },
];

const FAQS = [
  { q: 'Does it work without internet?', a: 'Yes. Obstacle detection, OCR, currency and face recognition all run on the frame itself. The cloud is only used for translation, family streaming and the Echo Network.' },
  { q: 'Is the family stream private?', a: 'AES-256 end-to-end encryption via LiveKit SFrame. The server is zero-knowledge — ARGES cannot decrypt your stream.' },
  { q: 'How long does the battery last?', a: 'Eight hours and more. The solar charging strap trickle-charges through outdoor use.' },
  { q: 'What happens if the wearer falls?', a: 'The ADXL345 detects it at 99.4% accuracy and triggers Guardian SOS — live GPS, audio and video to family immediately.' },
  { q: 'Which languages are supported?', a: 'Over 32 Indian languages through Bhashini, including Hindi, Tamil, Telugu, Marathi and Bengali.' },
];

const rise = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export function Landing() {
  const { px, py } = usePointer();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const heroFade = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <div className="aurora">
      <a href="#main" className="skip-link">Skip to content</a>
      <AuroraField />

      {/* Scroll progress — a thin filament of aurora across the top. */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 999,
          transformOrigin: '0% 50%', scaleX: bar,
          background: 'linear-gradient(90deg, var(--au-violet), var(--au-amber), var(--au-teal))',
        }}
      />

      {/* ── Nav ───────────────────────────────────────────── */}
      <header style={{ position: 'fixed', top: 18, left: 0, right: 0, zIndex: 900, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
        <nav
          className="au-glass"
          aria-label="Primary"
          style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '11px 14px 11px 20px', borderRadius: 999, width: '100%', maxWidth: 780 }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--au-ink)', textDecoration: 'none', fontWeight: 500, letterSpacing: '-0.02em' }}>
            <Logo size={20} color="var(--au-amber)" /> ARGES
          </Link>
          <div style={{ display: 'flex', gap: 20, marginLeft: 4 }} className="max-md:hidden">
            {[['/3d', 'How it works'], ['#inside', 'Inside'], ['#pricing', 'Pricing']].map(([to, label]) => (
              to.startsWith('#')
                ? <a key={to} href={to} style={{ color: 'var(--au-mute)', textDecoration: 'none', fontSize: '0.875rem' }}>{label}</a>
                : <Link key={to} to={to} style={{ color: 'var(--au-mute)', textDecoration: 'none', fontSize: '0.875rem' }}>{label}</Link>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link to="/login" style={{ color: 'var(--au-body)', textDecoration: 'none', fontSize: '0.875rem', padding: '0 8px' }}>Sign in</Link>
            <Link to="/signup" className="au-btn au-btn-primary" style={{ padding: '9px 18px', fontSize: '0.8125rem' }}>Get ARGES</Link>
          </div>
        </nav>
      </header>

      <main id="main" className="au-content">
        {/* ── Hero — the lens ───────────────────────────────── */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', paddingTop: 120, paddingBottom: 80 }}>
          <div className="au-shell" style={{ display: 'grid', gap: 56, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', alignItems: 'center' }}>

            <motion.div style={{ opacity: heroFade }}>
              <motion.p className="au-eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
                / Spatial AI vision ecosystem
              </motion.p>

              <motion.h1
                className="au-display"
                style={{ marginTop: 22, maxWidth: '11ch' }}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
              >
                See <span className="au-grad">without</span> seeing.
              </motion.h1>

              <motion.p
                className="au-lead"
                style={{ marginTop: 26, maxWidth: '46ch' }}
                initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.25 }}
              >
                A five-layer vision ecosystem that gives back independence, safety and
                dignity — engineered as a spatial computing platform, not a medical device.
              </motion.p>

              <motion.div
                style={{ display: 'flex', gap: 14, marginTop: 40, flexWrap: 'wrap' }}
                initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.38 }}
              >
                <Link to="/signup" className="au-btn au-btn-primary">Get ARGES</Link>
                <Link to="/3d" className="au-btn au-btn-glass">See how it works</Link>
              </motion.div>

              <motion.dl
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 24, marginTop: 64, maxWidth: 560 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
              >
                {STATS.map((s) => (
                  <div key={s.l}>
                    <dd style={{ fontSize: '1.85rem', fontWeight: 500, letterSpacing: '-0.035em', lineHeight: 1 }}>{s.v}</dd>
                    <dt className="au-eyebrow" style={{ marginTop: 8, fontSize: '0.5625rem' }}>{s.l}</dt>
                  </div>
                ))}
              </motion.dl>
            </motion.div>

            {/* The lens. Three layers drifting at different depths. */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 420 }}>
              <ParallaxLayer px={px} py={py} depth={46} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                <div style={{ width: 520, height: 520, maxWidth: '92vw', maxHeight: '92vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.30), transparent 62%)', filter: 'blur(46px)' }} />
              </ParallaxLayer>

              <ParallaxLayer px={px} py={py} depth={16}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
                >
                  <motion.div
                    animate={{ y: [0, -18, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <LiquidLens src={MEDIA.hero} size={440} />
                  </motion.div>
                </motion.div>
              </ParallaxLayer>

              {/* Floating glass chips orbiting the lens. */}
              {[
                { label: 'On-device AI', top: '4%', left: '-4%', d: 30 },
                { label: 'AES-256 E2EE', bottom: '10%', right: '-6%', d: 38 },
                { label: 'Fall detection', bottom: '-2%', left: '6%', d: 24 },
              ].map(({ label, d, ...pos }, i) => (
                // `label` and `d` are pulled out because the rest is spread
                // straight into `style` — leaving them in makes them invalid
                // CSS properties.
                <ParallaxLayer key={label} px={px} py={py} depth={d} style={{ position: 'absolute', ...pos, zIndex: 3 }}>
                  <motion.div
                    className="au-glass"
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.8 + i * 0.14 }}
                    style={{ padding: '9px 16px', borderRadius: 999, fontSize: '0.75rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--au-amber)', boxShadow: '0 0 10px var(--au-amber)' }} />
                    {label}
                  </motion.div>
                </ParallaxLayer>
              ))}
            </div>
          </div>
        </section>

        {/* ── Statement — film poured into the type ─────────── */}
        <section className="au-band" style={{ paddingTop: 0 }}>
          <div className="au-shell">
            <motion.div variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-15%' }}>
              <FilmText src={MEDIA.morning} text="INDEPENDENCE" />
            </motion.div>
            <motion.p
              className="au-lead"
              style={{ margin: '38px auto 0', maxWidth: '54ch', textAlign: 'center' }}
              variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Fifteen million people in India live without sight. ARGES exists so the walk
              to the shop needs nobody's permission, nobody's arm, and nobody's schedule.
            </motion.p>
          </div>
        </section>

        {/* ── Ecosystem — clay ──────────────────────────────── */}
        <section className="au-band" id="ecosystem" style={{ position: 'relative' }}>
          <FilmGlow src={MEDIA.signal} opacity={0.35} blur={90} />
          <div className="au-shell" style={{ position: 'relative' }}>
            <motion.div variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-12%' }} style={{ marginBottom: 62 }}>
              <p className="au-eyebrow">/ 01 — The solution</p>
              <h2 className="au-h2" style={{ marginTop: 18, maxWidth: '16ch' }}>
                Not a gadget. <span className="au-grad">An ecosystem.</span>
              </h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 26 }}>
              {ECOSYSTEM.map((item, i) => (
                <motion.div
                  key={item.n}
                  initial={{ opacity: 0, y: 54 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8%' }}
                  transition={{ duration: 0.9, ease: EASE, delay: (i % 3) * 0.1 }}
                >
                  <ClayTile glowColor={item.c} style={{ padding: 34, height: '100%' }}>
                    <span className="au-eyebrow" style={{ color: 'var(--au-amber)' }}>/ {item.n}</span>
                    <h3 className="au-h3" style={{ marginTop: 18 }}>{item.t}</h3>
                    <p className="au-body" style={{ marginTop: 12, fontSize: '0.9375rem' }}>{item.d}</p>
                  </ClayTile>
                </motion.div>
              ))}

              {/* The sixth cell is footage rather than a card — breaks the grid
                  rhythm so it does not read as a stock feature list. */}
              <motion.div
                initial={{ opacity: 0, y: 54 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                style={{ position: 'relative', minHeight: 260 }}
              >
                <FilmBlob src={MEDIA.contact} style={{ position: 'absolute', inset: 0 }} scale={1.25} />
                <div style={{ position: 'absolute', left: 30, bottom: 30, right: 30 }}>
                  <span className="au-eyebrow" style={{ color: 'var(--au-amber)' }}>/ 06</span>
                  <h3 className="au-h3" style={{ marginTop: 12 }}>HapticBand</h3>
                  <p className="au-body" style={{ marginTop: 8, fontSize: '0.875rem' }}>
                    Direction and distance, felt at the wrist.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Inside — three zones as liquid blobs ──────────── */}
        <section className="au-band" id="inside">
          <div className="au-shell">
            <motion.div variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-12%' }} style={{ marginBottom: 58, textAlign: 'center' }}>
              <p className="au-eyebrow">/ 02 — Inside</p>
              <h2 className="au-h2" style={{ marginTop: 18, marginInline: 'auto', maxWidth: '18ch' }}>
                Twelve components. <span className="au-grad">174 millimetres.</span>
              </h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
              {ZONES.map((z, i) => (
                <motion.div
                  key={z.t}
                  initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1, ease: EASE, delay: i * 0.14 }}
                  style={{ textAlign: 'center' }}
                >
                  <ParallaxLayer px={px} py={py} depth={12 + i * 6}>
                    <FilmBlob src={z.src} style={{ aspectRatio: '1', width: '100%', maxWidth: 300, margin: '0 auto' }} scale={1.3} />
                  </ParallaxLayer>
                  <h3 className="au-h3" style={{ marginTop: 26 }}>{z.t}</h3>
                  <p className="au-body" style={{ marginTop: 10, fontSize: '0.9375rem', maxWidth: '30ch', marginInline: 'auto' }}>{z.d}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginTop: 58 }}>
              <Link to="/3d" className="au-btn au-btn-glass">Take the frame apart</Link>
            </motion.div>
          </div>
        </section>

        {/* ── Pricing — glass ───────────────────────────────── */}
        <section className="au-band" id="pricing">
          <div className="au-shell">
            <motion.div variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-12%' }} style={{ marginBottom: 58, textAlign: 'center' }}>
              <p className="au-eyebrow">/ 03 — Pricing</p>
              <h2 className="au-h2" style={{ marginTop: 18 }}>Priced for the people who need it.</h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'stretch' }}>
              {PRICING.map((p, i) => (
                <motion.div
                  key={p.tier}
                  initial={{ opacity: 0, y: 54 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
                >
                  <GlassCard style={{ padding: 34, height: '100%', display: 'flex', flexDirection: 'column', ...(p.hero ? { border: '1px solid rgba(255,107,26,0.42)', boxShadow: '0 30px 90px rgba(255,107,26,0.16)' } : {}) }}>
                    {p.hero && (
                      <span className="au-eyebrow" style={{ color: 'var(--au-amber)', marginBottom: 14 }}>Most chosen</span>
                    )}
                    <h3 className="au-h3">{p.tier}</h3>
                    <div style={{ marginTop: 20, fontSize: '2.6rem', fontWeight: 500, letterSpacing: '-0.045em', lineHeight: 1 }}>{p.price}</div>
                    <p className="au-eyebrow" style={{ marginTop: 10, fontSize: '0.5625rem' }}>{p.per}</p>
                    <ul style={{ listStyle: 'none', marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                      {p.feats.map((f) => (
                        <li key={f} style={{ display: 'flex', gap: 11, fontSize: '0.875rem', color: 'var(--au-body)' }}>
                          <span aria-hidden="true" style={{ color: 'var(--au-amber)' }}>—</span>{f}
                        </li>
                      ))}
                    </ul>
                    <Link to="/signup" className={`au-btn ${p.hero ? 'au-btn-primary' : 'au-btn-glass'}`} style={{ marginTop: 30, width: '100%' }}>
                      Choose {p.tier}
                    </Link>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section className="au-band">
          <div className="au-shell" style={{ maxWidth: 880 }}>
            <motion.h2 className="au-h2" variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: 44 }}>
              Answers.
            </motion.h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <motion.div
                    key={f.q}
                    className="au-glass"
                    initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
                    style={{ borderRadius: 22 }}
                  >
                    <h3 style={{ margin: 0 }}>
                      <button
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                        style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20,
                          padding: '22px 26px', background: 'none', border: 0, cursor: 'pointer',
                          color: 'var(--au-ink)', fontSize: '1rem', fontWeight: 500, textAlign: 'left', fontFamily: 'inherit',
                        }}
                      >
                        {f.q}
                        <span aria-hidden="true" style={{ color: 'var(--au-amber)', flex: 'none', fontSize: '1.3rem', lineHeight: 1, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 500ms var(--au-ease)' }}>+</span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }} style={{ overflow: 'hidden' }}
                        >
                          <p className="au-body" style={{ padding: '0 26px 24px', fontSize: '0.9375rem', maxWidth: '66ch' }}>{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Close — the forge as light ────────────────────── */}
        <section className="au-band" style={{ position: 'relative', overflow: 'hidden' }}>
          <FilmGlow src={MEDIA.network} opacity={0.6} blur={54} />
          <div className="au-shell" style={{ position: 'relative', textAlign: 'center' }}>
            <motion.h2 className="au-h2" variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginInline: 'auto', maxWidth: '17ch' }}>
              Sight is not the only way to <span className="au-grad">see</span>.
            </motion.h2>
            <motion.div variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' }}>
              <Link to="/signup" className="au-btn au-btn-primary">Get ARGES</Link>
              <Link to="/3d" className="au-btn au-btn-glass">See how it works</Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '54px 0 40px', position: 'relative' }}>
        <div className="au-shell" style={{ display: 'flex', justifyContent: 'space-between', gap: 26, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={20} color="var(--au-amber)" />
            <span style={{ letterSpacing: '-0.02em' }}>ARGES</span>
          </div>
          <nav aria-label="Footer" style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            {[['/3d', 'How it works'], ['/family', 'Family'], ['/helper', 'Echo Network'], ['/admin', 'Admin'], ['/login', 'Sign in']].map(([to, l]) => (
              <Link key={to} to={to} style={{ color: 'var(--au-mute)', textDecoration: 'none', fontSize: '0.8125rem' }}>{l}</Link>
            ))}
          </nav>
          <span className="au-eyebrow" style={{ fontSize: '0.5625rem' }}>© 2026 · Thiagarajar Polytechnic, Salem</span>
        </div>
      </footer>
    </div>
  );
}
