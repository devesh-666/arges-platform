import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animate, stagger, createScope, utils, type Scope } from 'animejs';
import '../styles/landing-v2.css';

/* ───────────────────────────────────────────────────────────────────────────
   The page carries no static imagery — every visual is footage out of
   public/media/, watermark-stripped. The numbers below are still sourced from
   the product sheets in assets/, they are just no longer displayed as sheets.
   ─────────────────────────────────────────────────────────────────────────── */

/* Split by word, not by line — each word is a nowrap box so the per-character
   spans can never break mid-word, while the line still wraps between words. */
const HERO_LINES: { w: string; accent?: boolean }[][] = [
  [{ w: 'FORGING' }, { w: 'LIGHT.' }],
  [{ w: 'EMPOWERING' }, { w: 'SIGHT.', accent: true }],
];

const TICKER = [
  ['Camera', '8MP Wide FOV'],
  ['Processor', 'ESP32-S3 + K210'],
  ['Battery', '6000mAh Li-Po'],
  ['Weight', '85 g'],
  ['Connectivity', 'Wi-Fi 6 · BT 5.3'],
  ['Audio', 'Bone Conduction'],
  ['Mics', 'Dual MEMS'],
  ['Charging', 'USB-C Fast'],
  ['Resistance', 'IP54'],
  ['Frame', 'TR90'],
  ['Lens', 'UV400 Polarized'],
];

/** Clay's rule: never the same colour twice in a row. */
const CAPABILITIES = [
  { tone: 'ember', title: 'Real-time scene understanding', body: 'The 8MP wide-FOV camera narrates what is in front of you, continuously and out loud.' },
  { tone: 'cream', title: 'Obstacle & overhead hazard detection', body: 'Low branches, open cabinet doors, kerbs and steps — flagged before you reach them.' },
  { tone: 'teal', title: 'Voice assistant & navigation', body: 'Turn-by-turn guidance spoken through bone conduction, ears left completely open.' },
  { tone: 'peach', title: 'Reading & object recognition', body: 'Signs, labels, menus, medicine boxes and currency, read back on demand.' },
  { tone: 'deep', title: 'Offline AI processing', body: 'The K210 accelerator runs core vision on-device. No signal is not the same as no sight.' },
  { tone: 'ochre', title: 'Family guardian connectivity', body: 'A consented live link that family can open — and the wearer can end at any moment.' },
  { tone: 'lavender', title: 'Community & volunteer network', body: 'The Echo Network routes a request to a nearby trained volunteer within seconds.' },
  { tone: 'slate', title: 'Haptic feedback support', body: 'The wrist band converts direction and alerts into vibration patterns you can feel.' },
];

const STORIES = [
  { id: 'morning', tag: 'Scene 01', title: 'Morning', body: 'Waking, dressing, and crossing a familiar room without counting steps.' },
  { id: 'signal', tag: 'Scene 02', title: 'Signal', body: 'A crossing read in real time — traffic, kerb, and the moment it is safe to go.' },
  { id: 'network', tag: 'Scene 03', title: 'Network', body: 'One tap opens the Echo Network and a volunteer is already looking.' },
  { id: 'contact', tag: 'Scene 04', title: 'Contact', body: 'Family checks in, sees what is needed, and steps back out again.' },
];

/** The three macro part films shown under the anatomy plate. */
const PARTS = [
  { id: 'part-camera', no: '02', name: '8MP camera module', alt: 'Macro shot of the ARGES camera module and lens barrel' },
  { id: 'part-core', no: '07', name: 'Core module (AI PCB)', alt: 'Macro shot of the ARGES core PCB and AI accelerator' },
  // this clip travels across three subjects, so the label names all of them
  { id: 'part-audio', no: '—', name: 'Battery, driver, board', alt: 'Macro shot travelling across the ARGES battery cell, bone conduction driver and main board' },
];

const GLASSES_SPECS = [
  { k: 'Weight', v: '85', u: 'g' },
  { k: 'Battery', v: '6000', u: 'mAh' },
  { k: 'Camera', v: '8', u: 'MP' },
  { k: 'Frame width', v: '160', u: 'mm' },
];

const BAND_SPECS = [
  { k: 'Weight', v: '30', u: 'g' },
  { k: 'Battery life', v: '7', u: 'days' },
  { k: 'Battery', v: '200', u: 'mAh' },
  { k: 'Resistance', v: '67', u: 'IP' },
];

const IN_BOX = [
  'ARGES Vision glasses', 'Magnetic protective case', 'Haptic band',
  'USB-C charging cable', 'Cleaning cloth', 'User guide',
  'Quick start card', 'Warranty card',
];

const ROLES = [
  { to: '/family', idx: '01', name: 'Family head', body: 'Pairs the device, manages the circle, and answers guardian requests.' },
  { to: '/member', idx: '02', name: 'Family member', body: 'Sees status and location when the wearer has granted consent.' },
  { to: '/helper', idx: '03', name: 'Echo Network helper', body: 'A trained volunteer who takes live assistance requests nearby.' },
  { to: '/admin', idx: '04', name: 'Administrator', body: 'Fleet health, firmware, alerts and the full audit trail.' },
];

const GRID_COLS = 30;
const GRID_ROWS = 14;

export function LandingV2() {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    scope.current = createScope({ root: el }).add(() => {
      /* ── Hero: per-character stagger, the animejs.com signature ───────── */
      if (!reduced) {
        animate('.lv-hero-title .char', {
          opacity: [0, 1],
          y: ['1.1em', '0em'],
          rotate: [8, 0],
          duration: 1100,
          delay: stagger(26, { start: 180 }),
          ease: 'out(3)',
        });

        animate('.lv-hero-fade', {
          opacity: [0, 1],
          y: [20, 0],
          duration: 900,
          delay: stagger(90, { start: 700 }),
          ease: 'out(3)',
        });

        /* The dot matrix breathing out from the centre — anime.js grid stagger. */
        animate('.lv-dot', {
          opacity: [0, 0.55],
          scale: [0, 1],
          duration: 1400,
          delay: stagger(28, { grid: [GRID_COLS, GRID_ROWS], from: 'center' }),
          ease: 'out(4)',
        });
      }

      /* ── Scroll-entry choreography ─────────────────────────────────────── */
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const section = entry.target as HTMLElement;
            io.unobserve(section);

            const items = section.querySelectorAll<HTMLElement>('.lv-reveal');
            if (reduced) {
              utils.set(items, { opacity: 1, y: 0 });
            } else if (items.length) {
              animate(items, {
                opacity: [0, 1],
                y: [24, 0],
                duration: 850,
                delay: stagger(70),
                ease: 'out(3)',
              });
            }

            /* Ferrari's number-display cells count up as they arrive. */
            section.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
              const target = Number(node.dataset.count);
              if (Number.isNaN(target)) return;
              if (reduced) {
                node.textContent = String(target);
                return;
              }
              const box = { n: 0 };
              animate(box, {
                n: target,
                duration: 1500,
                ease: 'out(4)',
                onUpdate: () => {
                  node.textContent = String(Math.round(box.n));
                },
              });
            });
          });
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
      );

      el.querySelectorAll<HTMLElement>('[data-observe]').forEach((s) => io.observe(s));

      /* ── Nav hairline appears once the hero photograph is behind you ──── */
      const nav = el.querySelector<HTMLElement>('.lv-nav');
      const onScrollY = () => nav?.classList.toggle('is-stuck', window.scrollY > 80);
      onScrollY();
      window.addEventListener('scroll', onScrollY, { passive: true });

      return () => {
        io.disconnect();
        window.removeEventListener('scroll', onScrollY);
      };
    });

    return () => scope.current?.revert();
  }, []);

  return (
    <div className="lv2" ref={root}>
      <a href="#lv-main" className="skip-link">Skip to content</a>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="lv-nav">
        <div className="lv-nav-inner">
          <Link to="/" className="lv-brand">
            ARGES <em>VISION</em>
          </Link>
          <nav className="lv-nav-links" aria-label="Primary">
            <a href="#capabilities">Capabilities</a>
            <a href="#anatomy">Anatomy</a>
            <a href="#field">In the field</a>
            <a href="#band">Haptic band</a>
            <a href="#ecosystem">Ecosystem</a>
          </nav>
          <Link to="/signup" className="lv-btn lv-btn-primary">Get ARGES</Link>
        </div>
      </header>

      <main id="lv-main">
        {/* ── Hero: Ferrari full-bleed cinema ───────────────────────────── */}
        <section className="lv-hero">
          <div className="lv-hero-media">
            <video
              src="/media/hero-glasses.mp4"
              autoPlay muted loop playsInline preload="auto"
              aria-label="ARGES Vision smart glasses rotating inside a heads-up display ring"
            />
          </div>
          <div className="lv-hero-scrim" />
          <div className="lv-hero-grid" aria-hidden="true">
            <DotMatrix />
          </div>

          <div className="lv-hero-inner">
            <p className="lv-eyebrow lv-hero-fade">AI vision ecosystem for the visually impaired</p>

            <h1 className="lv-display-mega lv-hero-title">
              {HERO_LINES.map((line, li) => (
                <span key={li} style={{ display: 'block' }} aria-hidden="true">
                  {line.map((part, pi) => (
                    <span key={pi} className={`lv-word${part.accent ? ' lv-accent' : ''}`}>
                      {Array.from(part.w).map((c, ci) => (
                        <span key={ci} className="char">{c}</span>
                      ))}
                    </span>
                  ))}
                </span>
              ))}
              <span className="sr-only">Forging light. Empowering sight.</span>
            </h1>

            <p className="lv-lede lv-hero-lede lv-hero-fade">
              Smart glasses that read the world aloud, feel the way forward on your wrist,
              and keep the people who love you one consented tap away.
            </p>

            <div className="lv-hero-cta lv-hero-fade">
              <Link to="/signup" className="lv-btn lv-btn-primary">Get ARGES</Link>
              <Link to="/3d" className="lv-btn lv-btn-outline">See it in 3D</Link>
            </div>

            <dl className="lv-hero-meta lv-hero-fade">
              <div><dt>Weight</dt><dd>85 g</dd></div>
              <div><dt>All-day battery</dt><dd>6000 mAh</dd></div>
              <div><dt>On-device AI</dt><dd>Offline</dd></div>
              <div><dt>Built at</dt><dd>TPC Salem</dd></div>
            </dl>
          </div>
        </section>

        {/* ── Spec ticker ───────────────────────────────────────────────── */}
        <div className="lv-ticker" aria-hidden="true">
          <div className="lv-ticker-row">
            {TICKER.map(([k, v]) => <span key={k}>{k} <b>{v}</b></span>)}
          </div>
          <div className="lv-ticker-row">
            {TICKER.map(([k, v]) => <span key={`${k}-2`}>{k} <b>{v}</b></span>)}
          </div>
        </div>

        {/* ── Clay: capability cards ────────────────────────────────────── */}
        <section id="capabilities" className="lv-band" data-observe>
          <div className="lv-shell">
            <div className="lv-head">
              <p className="lv-eyebrow lv-reveal">Capabilities</p>
              <h2 className="lv-display-xl lv-reveal">Eight things it does the moment you put it on.</h2>
            </div>
            <div className="lv-cards">
              {CAPABILITIES.map((c, i) => (
                <article key={c.title} className={`lv-card lv-card-${c.tone} lv-reveal`}>
                  <p className="lv-card-idx">{String(i + 1).padStart(2, '0')}</p>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Anatomy plate ─────────────────────────────────────────────── */}
        <section id="anatomy" className="lv-band" data-observe>
          <div className="lv-shell">
            <div className="lv-head">
              <p className="lv-eyebrow lv-reveal">Anatomy</p>
              <h2 className="lv-display-xl lv-reveal">Fourteen parts. Eighty-five grams.</h2>
              <p className="lv-lede lv-reveal">
                A TR90 frame on stainless hinges, carrying an 8MP wide-FOV camera, the
                ESP32-S3 and K210 core, and a 6000mAh cell — balanced to sit all day.
              </p>
            </div>

            <div className="lv-plate lv-reveal">
              <video
                src="/media/product-macro.mp4"
                autoPlay muted loop playsInline preload="none"
                aria-label="Macro shot travelling along the temple arm of the ARGES glasses"
              />
              <div className="lv-plate-cap">
                <span>Temple arm · TR90 on stainless hinges</span>
                <span>160 × 55 × 145 mm</span>
              </div>
            </div>

            <div className="lv-parts lv-reveal">
              {PARTS.map((part) => (
                <figure className="lv-part" key={part.id} style={{ margin: 0 }}>
                  <video
                    src={`/media/${part.id}.mp4`}
                    autoPlay muted loop playsInline preload="none"
                    aria-label={part.alt}
                  />
                  <figcaption>
                    <span className="lv-part-no">{part.no}</span>
                    <span>{part.name}</span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <dl className="lv-specs lv-reveal">
              {GLASSES_SPECS.map((s) => (
                <div className="lv-spec" key={s.k}>
                  <dt>{s.k}</dt>
                  <dd><span data-count={s.v}>0</span><small>{s.u}</small></dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Story videos ──────────────────────────────────────────────── */}
        <section id="field" className="lv-band" data-observe>
          <div className="lv-shell">
            <div className="lv-head">
              <p className="lv-eyebrow lv-reveal">In the field</p>
              <h2 className="lv-display-xl lv-reveal">A day, as ARGES sees it.</h2>
            </div>
            <div className="lv-stories">
              {STORIES.map((s) => (
                <figure className="lv-story lv-reveal" key={s.id} style={{ margin: 0 }}>
                  <span className="lv-story-tag">{s.tag}</span>
                  <video
                    src={`/media/story-${s.id}.mp4`}
                    autoPlay muted loop playsInline preload="none"
                    aria-label={`${s.title} — ${s.body}`}
                  />
                  <figcaption className="lv-story-body">
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── Haptic band ───────────────────────────────────────────────── */}
        <section id="band" className="lv-band" data-observe>
          <div className="lv-shell">
            <div className="lv-head">
              <p className="lv-eyebrow lv-reveal">Haptic band</p>
              <h2 className="lv-display-xl lv-reveal">Real-time alerts. Silent guidance.</h2>
              <p className="lv-lede lv-reveal">
                A 30-gram wrist band with a linear resonant actuator, turning direction,
                hazards and SOS confirmation into patterns you feel rather than hear.
              </p>
            </div>

            <div className="lv-plate lv-reveal">
              <video
                src="/media/band-hand.mp4"
                autoPlay muted loop playsInline preload="none"
                aria-label="A hand resting on the ARGES haptic band as it lights and pulses"
              />
              <div className="lv-plate-cap">
                <span>Linear resonant actuator · 10 components</span>
                <span>45 × 25 × 12 mm</span>
              </div>
            </div>

            <dl className="lv-specs lv-reveal">
              {BAND_SPECS.map((s) => (
                <div className="lv-spec" key={s.k}>
                  <dt>{s.k}</dt>
                  <dd>
                    {s.u === 'IP' ? <><small style={{ marginLeft: 0, marginRight: 4 }}>IP</small><span data-count={s.v}>0</span></>
                      : <><span data-count={s.v}>0</span><small>{s.u}</small></>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Clay's single warm band ───────────────────────────────────── */}
        <section className="lv-warm lv-band" data-observe>
          <div className="lv-shell">
            <div className="lv-head">
              <p className="lv-eyebrow lv-reveal">In the box</p>
              <h2 className="lv-display-xl lv-reveal">Everything, ready to wear.</h2>
            </div>

            <ul className="lv-boxlist lv-reveal" style={{ listStyle: 'none', padding: 0 }}>
              {IN_BOX.map((i) => <li className="lv-chip" key={i}>{i}</li>)}
            </ul>

            <div style={{ marginTop: 'var(--s-md)' }} className="lv-reveal">
              <Link to="/signup" className="lv-btn lv-btn-on-light">Start a pairing</Link>
            </div>
          </div>
        </section>

        {/* ── Ecosystem ─────────────────────────────────────────────────── */}
        <section id="ecosystem" className="lv-band" data-observe>
          <div className="lv-shell">
            <div className="lv-head">
              <p className="lv-eyebrow lv-reveal">Ecosystem</p>
              <h2 className="lv-display-xl lv-reveal">The glasses are one seat of four.</h2>
              <p className="lv-lede lv-reveal">
                Every link is consented by the wearer and can be ended by the wearer —
                at any time, without asking anyone.
              </p>
            </div>
            <div className="lv-roles">
              {ROLES.map((r) => (
                <Link to={r.to} className="lv-role lv-reveal" key={r.to}>
                  <span className="lv-role-idx">{r.idx}</span>
                  <span>
                    <h3>{r.name}</h3>
                    <p>{r.body}</p>
                  </span>
                  <span className="lv-role-go">Open →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing ───────────────────────────────────────────────────── */}
        <section className="lv-cta-band lv-band-deep" data-observe>
          <video
            className="lv-cta-bg"
            src="/media/forge.mp4"
            autoPlay muted loop playsInline preload="none"
            aria-hidden="true"
          />
          <div className="lv-shell">
            <h2 className="lv-display-xl lv-reveal">Forging light. Empowering sight.</h2>
            <p className="lv-lede lv-reveal">
              Built by students at Thiagarajar Polytechnic College, Salem — for the
              people the technology industry keeps forgetting to build for.
            </p>
            <div className="lv-cta-actions lv-reveal">
              <Link to="/signup" className="lv-btn lv-btn-primary">Get ARGES</Link>
              <Link to="/login" className="lv-btn lv-btn-outline">Sign in</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="lv-footer">
        <div className="lv-shell lv-footer-inner">
          <p>ARGES Vision · Thiagarajar Polytechnic College, Salem</p>
          <p>Forging Light. Empowering Sight.</p>
        </div>
      </footer>
    </div>
  );
}

/** The animejs.com dot matrix — staggered out of the centre on load. */
function DotMatrix() {
  const cells = GRID_COLS * GRID_ROWS;
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        placeItems: 'center',
        opacity: 0.5,
        maskImage: 'radial-gradient(120% 90% at 30% 60%, #000 15%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(120% 90% at 30% 60%, #000 15%, transparent 72%)',
      }}
    >
      {Array.from({ length: cells }, (_, i) => (
        <span
          key={i}
          className="lv-dot"
          style={{
            width: 2, height: 2, borderRadius: '50%',
            background: 'rgba(255,255,255,.5)', opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export default LandingV2;
