import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { Reveal, Rule, SectionHead, CharCascade } from '../components/Primitives';
import { XRayTeardown, PARTS, ZONES, type Zone } from '../components/XRayTeardown';
import { ScrubVideo } from '../components/ScrubVideo';
import { AmbientVideo } from '../components/AmbientVideo';
import { inView, rise } from '../animations/obsidian';
import { MEDIA } from '../lib/media';
import poster from '../assets/hero.png';

/**
 * How it works.
 *
 * Acts I and II share ONE sticky container, and that is the whole trick. They
 * were originally two sections with two sticky containers, which meant Act I
 * unstuck and scrolled the film off screen before Act II entered — leaving
 * nothing on screen to cut from. The handoff can only read as a match cut if
 * the film is still there when the diagram arrives.
 *
 * So the film holds its final frame and stays, dimmed, for the entire teardown,
 * while the x-ray resolves out of it: the diagram enters over-scaled, matching
 * the film's pushed-in framing, and settles back to rest. The result reads as
 * the shell turning transparent rather than as one section replacing another.
 *
 * Timeline across the shared container:
 *
 *   0.00 – 0.30   film scrubs; title fades out by 0.16
 *   0.28 – 0.42   THE CUT — x-ray 1.32 → 1.0 scale + fade in, film dims to 0.22
 *   0.42 – 0.60   left temple lit
 *   0.60 – 0.76   front frame
 *   0.76 – 0.90   right temple
 *   0.90 – 1.00   everything lit, signal trace running
 */

const PIPELINE = [
  { step: '01', title: '"ARGES, read this sign."', where: 'On device', detail: 'The SPH0645 microphone array picks up the wake word. Porcupine matches it locally in under 3.5% CPU — no audio leaves the frame to do it.' },
  { step: '02', title: 'The camera takes one frame.', where: 'On device', detail: 'Intent routes to OCR, and the snap-fit front camera captures a single frame of whatever the wearer is facing.' },
  { step: '03', title: 'Text is read on the glasses.', where: 'On device', detail: 'Tesseract and PaddleOCR run on the Pi Zero 2 W itself. The sign is read without an internet connection.' },
  { step: '04', title: 'Translated, if it needs to be.', where: 'Encrypted cloud', detail: 'Only this step leaves the device. Text — never the image — crosses to Bhashini for 32+ Indian languages, AES-256 end to end.' },
  { step: '05', title: 'Spoken into the ear.', where: 'On device', detail: 'The 3W bone-conduction speaker delivers the answer and the HapticBand confirms it. Ambient hearing is never blocked.' },
];

export function HowItWorks3D() {
  const seqRef = useRef<HTMLDivElement>(null);
  const [zone, setZone] = useState<Zone | null>(null);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { scrollYProgress } = useScroll({
    target: seqRef,
    offset: ['start start', 'end end'],
  });

  /**
   * Smoothing, not easing.
   *
   * An ease CURVE on a scroll-driven value is still wrong — it remaps the
   * position so the element races then crawls against the thumb. A spring is a
   * different animal: a filter that removes wheel-step jitter while keeping the
   * mapping monotonic. It costs a few milliseconds of lag and is what makes the
   * whole sequence feel continuous rather than notched.
   */
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 34, mass: 0.35 });

  // The film occupies the first third of the sequence, then holds its last frame.
  const filmProgress = useTransform(p, [0, 0.3], [0, 1], { clamp: true });

  const titleOpacity = useTransform(p, [0, 0.16], [1, 0]);
  const titleScale = useTransform(p, [0, 0.3], [1, 1.06]);

  // The film hands off and leaves. It dims through the cut so the diagram
  // resolves out of moving footage, then exits completely — no ghost layer
  // behind the teardown.
  const filmOpacity = useTransform(p, [0.26, 0.5], [1, 0]);
  const filmScale = useTransform(p, [0.26, 0.5], [1, 1.14]);
  const filmBlur = useTransform(p, [0.26, 0.5], [0, 6]);
  const filmFilter = useTransform(filmBlur, (b) => `blur(${b}px)`);

  // The cut itself: the x-ray arrives over-scaled and settles.
  const xrayOpacity = useTransform(p, [0.28, 0.42], [0, 1]);
  const xrayScale = useTransform(p, [0.28, 0.46], [1.32, 1]);

  const scrollHint = useTransform(p, [0, 0.08], [1, 0]);

  useEffect(() => {
    if (reduced) return;
    const unsubscribe = p.on('change', (v) => {
      if (v < 0.42) setZone(null);
      else if (v < 0.6) setZone('left');
      else if (v < 0.76) setZone('front');
      else if (v < 0.9) setZone('right');
      else setZone(null); // past the walk — everything lights
    });
    return () => unsubscribe();
  }, [p, reduced]);

  const [allLit, setAllLit] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const unsubscribe = p.on('change', (v) => setAllLit(v >= 0.9));
    return () => unsubscribe();
  }, [p, reduced]);

  const showAll = reduced || allLit;
  const activeZone = reduced ? null : zone;
  const listZone: Zone = activeZone ?? 'left';
  const activeParts = PARTS.filter((pt) => pt.zone === listZone);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteNav />

      <main id="main">
        {/* ── ACTS I + II — one container, one continuous move ── */}
        <section
          ref={seqRef}
          style={{ height: reduced ? 'auto' : '620vh', position: 'relative' }}
          aria-label="Inside the ARGES frame"
        >
          <div
            style={{
              position: reduced ? 'relative' : 'sticky',
              top: 0,
              height: reduced ? 'auto' : '100vh',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Layer 1 — the film. Present for the whole sequence. */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: reduced ? 0.25 : filmOpacity,
                scale: reduced ? 1 : filmScale,
                filter: reduced ? 'blur(6px)' : filmFilter,
              }}
            >
              <ScrubVideo src={MEDIA.hero} poster={poster} progress={filmProgress} />
            </motion.div>

            {/* Layer 2 — the title, over the film only */}
            {!reduced && (
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center', padding: '0 var(--s5)',
                  opacity: titleOpacity, scale: titleScale,
                }}
              >
                <span className="eyebrow" style={{ marginBottom: 'var(--s5)' }}>/ How it works</span>
                <h1 className="display-xl" style={{ maxWidth: '14ch' }}>
                  <CharCascade text="Look inside." />
                </h1>
                <p className="lead body-mute" style={{ marginTop: 'var(--s5)', maxWidth: '46ch' }}>
                  Twelve components across 174 millimetres. Here is every one of them,
                  and the path a question takes through them.
                </p>
              </motion.div>
            )}

            {/* Layer 3 — the teardown, resolving out of the film */}
            <motion.div
              className="shell"
              style={{
                position: 'relative',
                width: '100%',
                zIndex: 2,
                opacity: reduced ? 1 : xrayOpacity,
                scale: reduced ? 1 : xrayScale,
              }}
            >
              {reduced && (
                <div style={{ marginBottom: 'var(--s5)' }}>
                  <span className="eyebrow">/ How it works</span>
                  <h1 className="display-md" style={{ marginTop: 'var(--s3)' }}>Look inside.</h1>
                </div>
              )}

              <XRayTeardown active={activeZone} showAll={showAll} />

              {/* Zone rail + parts list — also the accessible rendering of the
                  diagram, since every part here is real text. */}
              <div className="teardown-cols">
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                  {ZONES.map((z) => {
                    const on = reduced || showAll || activeZone === z.id;
                    return (
                      <li key={z.id} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s3)' }}>
                        <span className="mono" style={{ color: on ? 'var(--accent)' : 'var(--faint)', minWidth: 18, transition: 'color 600ms var(--ease)' }}>
                          {on ? '●' : '○'}
                        </span>
                        <span>
                          <span style={{ color: on ? 'var(--ink)' : 'var(--mute)', transition: 'color 600ms var(--ease)', fontSize: '0.9375rem' }}>{z.label}</span>
                          <span className="mono" style={{ color: 'var(--faint)', display: 'block', marginTop: 2 }}>{z.note.toUpperCase()}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div style={{ minWidth: 0 }}>
                  <ul style={{ listStyle: 'none', display: 'grid', gap: 1, background: 'var(--hairline)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    {(reduced || showAll ? PARTS : activeParts).map((pt) => (
                      <motion.li
                        key={pt.name}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{ background: 'var(--canvas-card)', padding: '10px var(--s4)', display: 'flex', justifyContent: 'space-between', gap: 'var(--s4)', flexWrap: 'wrap' }}
                      >
                        <span style={{ color: 'var(--ink)', fontSize: '0.875rem' }}>{pt.name}</span>
                        <span className="mono" style={{ color: 'var(--mute)' }}>{pt.spec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {!reduced && (
              <motion.div
                aria-hidden="true"
                style={{
                  position: 'absolute', bottom: 'var(--s6)', left: '50%', x: '-50%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s3)',
                  opacity: scrollHint, zIndex: 3,
                }}
              >
                <span className="mono tracked-center" style={{ color: 'var(--mute)' }}>SCROLL</span>
                <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
              </motion.div>
            )}
          </div>
        </section>

        <div className="shell"><Rule /></div>

        {/* ── INTERLUDE — Signal ────────────────────────────── */}
        <section style={{ position: 'relative', height: '62vh', minHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} aria-label="Signal moving through the frame">
          <AmbientVideo src={MEDIA.signal} />
          <Reveal className="shell">
            <p className="display-md" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '20ch', margin: '0 auto' }}>
              Then something moves through them.
            </p>
          </Reveal>
        </section>

        {/* ── ACT III — Pipeline ────────────────────────────── */}
        <section className="band" aria-label="From voice to answer">
          <div className="shell">
            <SectionHead
              eyebrow="/ The path"
              title="From voice to answer, in under 1.5 seconds."
              lead="Four of these five steps never touch the internet. Only translated text leaves the frame — the image never does."
            />

            <motion.ol
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              style={{ listStyle: 'none', marginTop: 'var(--s8)', display: 'grid', gap: 1, background: 'var(--hairline)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius)', overflow: 'hidden' }}
            >
              {PIPELINE.map((s) => {
                const cloud = s.where === 'Encrypted cloud';
                return (
                  <motion.li key={s.step} variants={rise} className="pipeline-row">
                    <span className="mono" style={{ color: 'var(--accent)' }}>{s.step}</span>
                    <div style={{ minWidth: 0 }}>
                      <h3 className="display-sm" style={{ marginBottom: 'var(--s2)' }}>{s.title}</h3>
                      <p className="body-mute" style={{ fontSize: '0.9375rem', maxWidth: '62ch' }}>{s.detail}</p>
                    </div>
                    <span className={`tag pipeline-tag ${cloud ? 'tag-warn' : 'tag-ok'}`} style={{ whiteSpace: 'nowrap' }}>
                      <span className="dot" />{s.where}
                    </span>
                  </motion.li>
                );
              })}
            </motion.ol>

            <Reveal delay={0.1}>
              <p className="mono" style={{ color: 'var(--faint)', marginTop: 'var(--s5)', textAlign: 'center' }}>
                AES-256 END TO END · ZERO-KNOWLEDGE SERVER · DPDP ACT COMPLIANT
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── ACT IV — Close ────────────────────────────────── */}
        <section className="band">
          <div className="shell" style={{ textAlign: 'center' }}>
            <Reveal>
              <h2 className="display-lg" style={{ margin: '0 auto', maxWidth: '16ch' }}>That is ARGES.</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="lead body-mute" style={{ margin: 'var(--s5) auto 0', maxWidth: '48ch' }}>
                Voice in, answer out. The core intelligence runs on the frame itself,
                so it works where the network does not.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div style={{ display: 'flex', gap: 'var(--s3)', justifyContent: 'center', marginTop: 'var(--s7)', flexWrap: 'wrap' }}>
                <Link to="/signup" className="btn btn-accent btn-lg">Get ARGES</Link>
                <Link to="/" className="btn btn-outline btn-lg">Back to home</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
