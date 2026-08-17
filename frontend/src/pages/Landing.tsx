import { lazy, Suspense, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { Reveal, RevealGroup, Rule, SectionHead, CharCascade } from '../components/Primitives';
import { XRayTeardown } from '../components/XRayTeardown';
import { AmbientVideo } from '../components/AmbientVideo';
import { rise, inView, EASE, SCROLL_SPRING } from '../animations/obsidian';
import { MEDIA } from '../lib/media';

// Three.js only downloads when the hero actually mounts.
const GlassesViewer3D = lazy(() => import('../components/GlassesViewer3D').then((m) => ({ default: m.GlassesViewer3D })));

const STATS = [
  { value: '15M+', label: 'Blind in India' },
  { value: '₹9,999', label: 'Starting price' },
  { value: '8', label: 'Industry firsts' },
  { value: '5', label: 'Layer ecosystem' },
];

const ECOSYSTEM = [
  { num: '01', title: 'Smart Vision', desc: 'Obstacle detection, scene description, navigation — including overhead hazards the cane misses.' },
  { num: '02', title: 'Reading Intelligence', desc: 'OCR, currency recognition, product scanning, colour detection. Reads the world aloud.' },
  { num: '03', title: 'Family Guardian', desc: 'Live encrypted video, audio and GPS streamed to family. Talk back. SOS in one touch.' },
  { num: '04', title: 'OmniAccess', desc: 'Operate phone, laptop or tablet exactly like a sighted person. True equality.' },
  { num: '05', title: 'Echo Network', desc: 'Community mesh shares hazards. Volunteer vision connects help in five seconds.' },
];

const FEATURES = [
  { name: 'Family Connect', desc: 'Live encrypted video, audio and GPS from the glasses, streamed to family.' },
  { name: 'OmniAccess', desc: 'Operate phone, laptop or tablet exactly like a sighted person.' },
  { name: 'Echo Network', desc: 'Community mesh shares hazards; volunteers help in five seconds.' },
  { name: 'Spatial Sound', desc: '3D binaural beeps guide direction — just follow the sound.' },
  { name: 'Companion AI', desc: 'Detects stress and sadness; supports mental wellness.' },
  { name: 'HapticBand', desc: 'Directional vibration zones encode object and distance.' },
  { name: 'MediScan', desc: 'Reads labels, checks drug interactions, dosage reminders.' },
  { name: 'Zero-Knowledge', desc: 'AES-256 end-to-end encryption — even ARGES cannot decrypt your data.' },
];

const PRICING = [
  { tier: 'ARGES One', price: '₹9,999', suffix: '', per: 'one-time · glasses only', feats: ['All standalone AI features', 'Lifetime offline AI', 'OCR · currency · faces', 'Wake-word voice assistant'], featured: false },
  { tier: 'ARGES Family', price: '₹12,999', suffix: '', per: 'one-time · glasses + band + cloud', feats: ['Everything in ARGES One', 'HapticBand included', '1-year cloud streaming', 'Family Guardian Dashboard', 'Echo Network access'], featured: true },
  { tier: 'ARGES Care', price: '₹49', suffix: '/mo', per: 'subscription · after year 1', feats: ['Live streaming continuation', 'Echo Network', 'Software updates', 'Companion AI premium'], featured: false },
];

const FAQS = [
  { q: 'Do I need internet for ARGES to work?', a: 'No — core AI (obstacle detection, OCR, currency, face recognition) runs on-device. The cloud is only used for language translation, family streaming, and the Echo Network.' },
  { q: 'Is the family video stream private?', a: 'Yes — AES-256 end-to-end encryption via LiveKit SFrame. Even ARGES itself cannot decrypt your stream.' },
  { q: 'How long does the battery last?', a: '8+ hours with the 6000mAh battery. The solar charging strap trickle-charges during outdoor use.' },
  { q: 'Can the user operate a phone or laptop?', a: 'Yes — ARGES OmniAccess provides sight-equivalent control via spoken and haptic feedback.' },
  { q: 'Does it work in Indian languages?', a: 'Yes — 32+ Indian languages via Bhashini, including Hindi, Tamil, Telugu, Marathi, Bengali.' },
  { q: 'What if the user falls?', a: 'The ADXL345 detects the fall (99.4% accuracy) and triggers Guardian SOS — sending live GPS, audio, and video to family.' },
];

export function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax on the opening. The render drifts and dissolves slightly faster
  // than the type it sits behind, so the hero recedes instead of simply
  // scrolling away. Spring-smoothed — see SCROLL_SPRING on why not an ease.
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const hp = useSpring(heroScroll, SCROLL_SPRING);
  const renderY = useTransform(hp, [0, 1], ['0%', '18%']);
  const renderScale = useTransform(hp, [0, 1], [1, 1.12]);
  const renderFade = useTransform(hp, [0, 0.8], [0.75, 0]);
  const copyY = useTransform(hp, [0, 1], ['0%', '-6%']);
  const copyFade = useTransform(hp, [0, 0.7], [1, 0]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteNav />

      <main id="main">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          {/* The render sits behind the type and carries the page — Bugatti's
              rule. It is decorative, so it is hidden from assistive tech. */}
          <motion.div
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, opacity: renderFade, y: renderY, scale: renderScale }}
          >
            <Suspense fallback={null}>
              <GlassesViewer3D />
            </Suspense>
          </motion.div>
          <div
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: 'radial-gradient(90% 70% at 50% 50%, transparent 20%, rgba(8,8,12,0.7) 70%, var(--canvas) 100%)' }}
          />

          <motion.div className="shell" style={{ position: 'relative', zIndex: 2, paddingTop: 96, paddingBottom: 64, y: copyY, opacity: copyFade }}>
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              / Spatial AI vision ecosystem
            </motion.span>

            <h1 className="display-xl" style={{ marginTop: 'var(--s5)', maxWidth: '11ch' }}>
              <CharCascade text="Forging light." />
              <br />
              <span style={{ color: 'var(--accent)' }}><CharCascade text="Empowering sight." /></span>
            </h1>

            <motion.p
              className="mono"
              style={{ color: 'var(--mute)', marginTop: 'var(--s5)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
            >
              Ἄργης · “THE BRIGHT ONE”
            </motion.p>

            <motion.p
              className="lead body-mute"
              style={{ marginTop: 'var(--s4)', maxWidth: '54ch' }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
            >
              A five-layer AI vision ecosystem that restores independence, safety and
              dignity to the visually impaired — designed like a spatial computing
              platform, not a medical device.
            </motion.p>

            <motion.div
              style={{ display: 'flex', gap: 'var(--s3)', marginTop: 'var(--s7)', flexWrap: 'wrap' }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6, ease: EASE }}
            >
              <Link to="/3d" className="btn btn-accent btn-lg">See how it works</Link>
              <a href="#ecosystem" className="btn btn-outline btn-lg">Explore the ecosystem</a>
            </motion.div>

            <motion.dl
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 'var(--s5)', marginTop: 'var(--s9)', maxWidth: 680 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd style={{ fontSize: '2rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</dd>
                  <p className="mono" style={{ color: 'var(--faint)', marginTop: 'var(--s2)' }}>{s.label.toUpperCase()}</p>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </section>

        {/* ── Morning (scene 3) ─────────────────────────────── */}
        {/* Straight after the hero: the product has been named, now show who
            it is for. Full-bleed and quiet — the claim sits over the footage
            rather than next to it. */}
        <section style={{ position: 'relative', minHeight: '78vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }} aria-label="Someone walking, unaided">
          <AmbientVideo src={MEDIA.morning} />
          <div className="shell" style={{ position: 'relative', zIndex: 1, paddingBottom: 'var(--s8)' }}>
            <Reveal><span className="eyebrow">/ Why it exists</span></Reveal>
            <Reveal delay={0.08}>
              <p className="display-md" style={{ marginTop: 'var(--s4)', maxWidth: '17ch' }}>
                Independence, not assistance.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="lead body-mute" style={{ marginTop: 'var(--s4)', maxWidth: '46ch' }}>
                Fifteen million people in India live without sight. ARGES is built so
                that the walk to the shop needs nobody's permission.
              </p>
            </Reveal>
          </div>
        </section>

        <div className="shell"><Rule /></div>

        {/* ── 01 · Ecosystem ────────────────────────────────── */}
        <section className="band" id="ecosystem">
          <div className="shell">
            <SectionHead
              eyebrow="/ 01 — The solution"
              title={<>Not a gadget. <span style={{ color: 'var(--accent)' }}>An ecosystem.</span></>}
              lead="Five layers, each building on the one below — hardware, AI, family, devices, community."
            />
            <RevealGroup>
              <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 'var(--s3)', marginTop: 'var(--s8)' }}>
                {ECOSYSTEM.map((l) => (
                  <motion.li key={l.num} variants={rise} className="card">
                    <span className="mono" style={{ color: 'var(--accent)' }}>/ {l.num}</span>
                    <h3 className="display-sm" style={{ marginTop: 'var(--s4)' }}>{l.title}</h3>
                    <p className="body-mute" style={{ marginTop: 'var(--s3)', fontSize: '0.9375rem' }}>{l.desc}</p>
                  </motion.li>
                ))}
              </ul>
            </RevealGroup>
          </div>
        </section>

        {/* ── 02 · Inside teaser ────────────────────────────── */}
        <section className="band" style={{ background: 'var(--canvas-soft)', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
          <div className="shell">
            <SectionHead
              eyebrow="/ 02 — Inside"
              title="Twelve components. One hundred and seventy-four millimetres."
              lead="A 3000mAh cell and the audio chain in the left temple, capture in the front frame, and a Raspberry Pi Zero 2 W doing the thinking in the right."
            />
            {/* The film sits behind the schematic here for the same reason it
                does on /3d — the diagram alone reads as boxes on a page. Dimmed
                and blurred so it gives the parts something to sit inside
                without competing with them. */}
            <Reveal delay={0.1}>
              <div style={{ position: 'relative', marginTop: 'var(--s7)' }}>
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute', inset: '-8% -4%',
                    opacity: 0.3, filter: 'blur(3px)',
                    maskImage: 'radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%)',
                  }}
                >
                  <AmbientVideo src={MEDIA.hero} vignette={false} />
                </div>
                <div style={{ position: 'relative' }}>
                  <XRayTeardown active={null} showAll />
                </div>
              </div>
            </Reveal>
            {/* Contact (scene 4). The schematic explains the parts; this is
                what one of them feels like. Inline rather than full-bleed so
                it reads as evidence attached to the diagram, not a new topic. */}
            <Reveal delay={0.14}>
              <figure style={{ marginTop: 'var(--s7)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'var(--s5)', alignItems: 'center' }}>
                <AmbientVideo src={MEDIA.contact} variant="inline" />
                <figcaption>
                  <span className="eyebrow eyebrow-mute">/ HapticBand</span>
                  <p className="body-mute" style={{ marginTop: 'var(--s3)', fontSize: '0.9375rem', maxWidth: '38ch' }}>
                    Directional vibration zones encode object and distance, so a
                    confirmation arrives through the wrist without a word being spoken
                    or a sound being blocked.
                  </p>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={0.2}>
              <div style={{ marginTop: 'var(--s6)' }}>
                <Link to="/3d" className="btn btn-outline btn-lg">Take the frame apart</Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 03 · Features ─────────────────────────────────── */}
        <section className="band" id="features">
          <div className="shell">
            <SectionHead eyebrow="/ 03 — Capability" title="Eight things it does that nothing else does." />
            <RevealGroup>
              <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 1, marginTop: 'var(--s8)', background: 'var(--hairline)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {FEATURES.map((f, i) => (
                  <motion.li key={f.name} variants={rise} style={{ background: 'var(--canvas-card)', padding: 'var(--s5)' }}>
                    <span className="mono" style={{ color: 'var(--faint)' }}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 style={{ marginTop: 'var(--s3)', fontSize: '1.0625rem', letterSpacing: '-0.01em' }}>{f.name}</h3>
                    <p className="body-mute" style={{ marginTop: 'var(--s2)', fontSize: '0.875rem' }}>{f.desc}</p>
                  </motion.li>
                ))}
              </ul>
            </RevealGroup>
          </div>
        </section>

        {/* ── 04 · Pricing ──────────────────────────────────── */}
        <section className="band" id="pricing">
          <div className="shell">
            <SectionHead eyebrow="/ 04 — Pricing" title="Priced for the people who need it." />
            <RevealGroup>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 'var(--s3)', marginTop: 'var(--s8)', alignItems: 'start' }}>
                {PRICING.map((p) => (
                  <motion.div key={p.tier} variants={rise} className={`card ${p.featured ? 'card-live' : ''}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--s3)' }}>
                      <span className="mono" style={{ color: p.featured ? 'var(--accent)' : 'var(--mute)' }}>{p.tier.toUpperCase()}</span>
                      {p.featured && <span className="tag tag-accent">Most chosen</span>}
                    </div>
                    <div style={{ marginTop: 'var(--s5)', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: '2.5rem', letterSpacing: '-0.04em', lineHeight: 1 }}>{p.price}</span>
                      <span className="body-mute">{p.suffix}</span>
                    </div>
                    <p className="mono" style={{ color: 'var(--faint)', marginTop: 'var(--s2)' }}>{p.per.toUpperCase()}</p>
                    <ul style={{ listStyle: 'none', marginTop: 'var(--s5)', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                      {p.feats.map((f) => (
                        <li key={f} style={{ display: 'flex', gap: 'var(--s3)', alignItems: 'flex-start', fontSize: '0.875rem', color: 'var(--body)' }}>
                          <span aria-hidden="true" style={{ color: 'var(--accent)', lineHeight: 1.5 }}>—</span>{f}
                        </li>
                      ))}
                    </ul>
                    <Link to="/signup" className={`btn ${p.featured ? 'btn-accent' : 'btn-outline'}`} style={{ marginTop: 'var(--s6)', width: '100%' }}>
                      Choose {p.tier}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </RevealGroup>
          </div>
        </section>

        {/* ── 05 · FAQ ──────────────────────────────────────── */}
        <section className="band" id="faq">
          <div className="shell" style={{ maxWidth: 860 }}>
            <SectionHead eyebrow="/ 05 — Questions" title="Answers." />
            <div style={{ marginTop: 'var(--s8)', borderTop: '1px solid var(--hairline)' }}>
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} style={{ borderBottom: '1px solid var(--hairline)' }}>
                    <h3>
                      <button
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                        style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          gap: 'var(--s4)', padding: 'var(--s5) 0', background: 'none', border: 0, cursor: 'pointer',
                          color: open ? 'var(--ink)' : 'var(--body)', fontFamily: 'var(--font)', fontSize: '1rem',
                          textAlign: 'left', transition: 'color var(--t-micro) var(--ease)',
                        }}
                      >
                        {f.q}
                        <span aria-hidden="true" className="mono" style={{ color: 'var(--accent)', flex: 'none', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform var(--t-element) var(--ease)' }}>+</span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.34, ease: EASE }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p className="body-mute" style={{ paddingBottom: 'var(--s5)', maxWidth: '68ch', fontSize: '0.9375rem' }}>{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Close ─────────────────────────────────────────── */}
        {/* Network (scene 5) sits behind the final CTA — the Echo Network as a
            city rather than a diagram. The vignette in AmbientVideo is what
            keeps the type legible over it. */}
        <section className="band" style={{ position: 'relative', overflow: 'hidden', minHeight: '72vh', display: 'flex', alignItems: 'center' }}>
          <AmbientVideo src={MEDIA.network} />
          <div className="shell" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <motion.h2 className="display-lg" variants={rise} initial="hidden" whileInView="visible" viewport={inView} style={{ margin: '0 auto', maxWidth: '18ch' }}>
              Sight is not the only way to see.
            </motion.h2>
            <Reveal delay={0.1}>
              <div style={{ display: 'flex', gap: 'var(--s3)', justifyContent: 'center', marginTop: 'var(--s7)', flexWrap: 'wrap' }}>
                <Link to="/signup" className="btn btn-accent btn-lg">Get ARGES</Link>
                <Link to="/3d" className="btn btn-outline btn-lg">See how it works</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
