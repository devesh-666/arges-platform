import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { Reveal, Rule, SectionHead, CharCascade } from '../components/Primitives';
import { XRayTeardown, PARTS, ZONES, type Zone } from '../components/XRayTeardown';
import { ScrubVideo } from '../components/ScrubVideo';
import { inView, rise } from '../animations/obsidian';
import poster from '../assets/hero.png';

/**
 * How it works, in four acts.
 *
 * Act I is a scroll-scrubbed film that ends pushing into the temple arm;
 * Act II picks the frame up from exactly there and dissolves the shell. The
 * match cut is what makes the generated footage and the built diagram read
 * as one continuous move rather than two sections stacked together.
 */

/** Drop the Flow render here and Act I upgrades itself — no code change. */
const HERO_VIDEO = '/media/arges-hero.mp4';

const PIPELINE = [
  { step: '01', title: '"ARGES, read this sign."', where: 'On device', detail: 'The SPH0645 microphone array picks up the wake word. Porcupine matches it locally in under 3.5% CPU — no audio leaves the frame to do it.' },
  { step: '02', title: 'The camera takes one frame.', where: 'On device', detail: 'Intent routes to OCR, and the snap-fit front camera captures a single frame of whatever the wearer is facing.' },
  { step: '03', title: 'Text is read on the glasses.', where: 'On device', detail: 'Tesseract and PaddleOCR run on the Pi Zero 2 W itself. The sign is read without an internet connection.' },
  { step: '04', title: 'Translated, if it needs to be.', where: 'Encrypted cloud', detail: 'Only this step leaves the device. Text — never the image — crosses to Bhashini for 32+ Indian languages, AES-256 end to end.' },
  { step: '05', title: 'Spoken into the ear.', where: 'On device', detail: 'The 3W bone-conduction speaker delivers the answer and the HapticBand confirms it. Ambient hearing is never blocked.' },
];

export function HowItWorks3D() {
  const filmRef = useRef<HTMLDivElement>(null);
  const xrayRef = useRef<HTMLDivElement>(null);
  const [zone, setZone] = useState<Zone | null>(null);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { scrollYProgress: filmProgress } = useScroll({
    target: filmRef,
    offset: ['start start', 'end end'],
  });

  const { scrollYProgress: xrayProgress } = useScroll({
    target: xrayRef,
    offset: ['start start', 'end end'],
  });

  const titleFade = useTransform(filmProgress, [0, 0.55], [1, 0]);

  // Walk the three zones across the sticky range, then light everything.
  useEffect(() => {
    if (reduced) return;
    const unsubscribe = xrayProgress.on('change', (v) => {
      if (v < 0.14) setZone(null);
      else if (v < 0.42) setZone('left');
      else if (v < 0.68) setZone('front');
      else setZone('right');
    });
    return () => unsubscribe();
  }, [xrayProgress, reduced]);

  // With reduced motion the scroll carries no meaning, so show the finished state.
  const showAll = reduced || zone === null ? reduced : false;
  const activeZone = reduced ? null : zone;
  const activeParts = PARTS.filter((p) => p.zone === (activeZone ?? 'left'));

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteNav />

      <main id="main">
        {/* ── ACT I — Arrival ───────────────────────────────── */}
        <section ref={filmRef} style={{ height: reduced ? 'auto' : '150vh', position: 'relative' }} aria-label="The ARGES frame">
          <div style={{ position: reduced ? 'relative' : 'sticky', top: 0, height: reduced ? '70vh' : '100vh', overflow: 'hidden' }}>
            <ScrubVideo src={HERO_VIDEO} poster={poster} progress={filmProgress} />

            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 var(--s5)',
                opacity: reduced ? 1 : titleFade,
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

            {!reduced && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', bottom: 'var(--s7)', left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s3)',
                }}
              >
                <span className="mono" style={{ color: 'var(--mute)', letterSpacing: '0.24em' }}>SCROLL</span>
                <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
              </div>
            )}
          </div>
        </section>

        {/* ── ACT II — Teardown ─────────────────────────────── */}
        <section ref={xrayRef} style={{ height: reduced ? 'auto' : '400vh', position: 'relative' }} aria-label="Inside the frame">
          <div style={{ position: reduced ? 'relative' : 'sticky', top: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: 'var(--s8) 0' }}>
            <div className="shell" style={{ width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 'var(--s6)' }}>

                <div>
                  <span className="eyebrow">/ The teardown</span>
                  <h2 className="display-md" style={{ marginTop: 'var(--s3)', maxWidth: '20ch' }}>
                    Nothing here is decorative.
                  </h2>
                </div>

                <XRayTeardown active={activeZone} showAll={showAll} />

                {/* Zone rail + parts list. This is also the accessible
                    rendering of the diagram — every part is real text. */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'var(--s5)', alignItems: 'start' }}>
                  <div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                      {ZONES.map((z) => {
                        const on = reduced || activeZone === z.id;
                        return (
                          <li key={z.id} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s3)' }}>
                            <span
                              className="mono"
                              style={{
                                color: on ? 'var(--accent)' : 'var(--faint)',
                                transition: 'color var(--t-element) var(--ease)',
                                minWidth: 24,
                              }}
                            >
                              {on ? '●' : '○'}
                            </span>
                            <span>
                              <span style={{ color: on ? 'var(--ink)' : 'var(--mute)', transition: 'color var(--t-element) var(--ease)' }}>
                                {z.label}
                              </span>
                              <span className="mono" style={{ color: 'var(--faint)', display: 'block', marginTop: 2 }}>
                                {z.note.toUpperCase()}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
                    {(reduced ? ZONES.map((z) => z.id) : [activeZone ?? 'left']).map((zid) => (
                      <div key={zid} style={{ marginBottom: reduced ? 'var(--s5)' : 0 }}>
                        {reduced && (
                          <div className="eyebrow eyebrow-mute" style={{ marginBottom: 'var(--s3)' }}>
                            {ZONES.find((z) => z.id === zid)?.label}
                          </div>
                        )}
                        <ul style={{ listStyle: 'none', display: 'grid', gap: 1, background: 'var(--hairline)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                          {(reduced ? PARTS.filter((p) => p.zone === zid) : activeParts).map((p) => (
                            <motion.li
                              key={p.name}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                              style={{ background: 'var(--canvas-card)', padding: 'var(--s3) var(--s4)', display: 'flex', justifyContent: 'space-between', gap: 'var(--s4)', flexWrap: 'wrap' }}
                            >
                              <span style={{ color: 'var(--ink)', fontSize: '0.875rem' }}>{p.name}</span>
                              <span className="mono" style={{ color: 'var(--mute)' }}>{p.spec}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="shell"><Rule /></div>

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
              {PIPELINE.map((p) => {
                const cloud = p.where === 'Encrypted cloud';
                return (
                  <motion.li
                    key={p.step}
                    variants={rise}
                    style={{ background: 'var(--canvas-card)', padding: 'var(--s5)', display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto', gap: 'var(--s5)', alignItems: 'start' }}
                  >
                    <span className="mono" style={{ color: 'var(--accent)' }}>{p.step}</span>
                    <div>
                      <h3 className="display-sm" style={{ marginBottom: 'var(--s2)' }}>{p.title}</h3>
                      <p className="body-mute" style={{ fontSize: '0.9375rem', maxWidth: '62ch' }}>{p.detail}</p>
                    </div>
                    <span className={`tag ${cloud ? 'tag-warn' : 'tag-ok'}`} style={{ whiteSpace: 'nowrap' }}>
                      <span className="dot" />{p.where}
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
