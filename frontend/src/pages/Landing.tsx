import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, stagger, createScope, utils, type Scope } from 'animejs';
import '../styles/landing.css';

/* ═══════════════════════════════════════════════════════════════════════════
   ARGES narrates the world to people who cannot see it, so this page narrates
   itself. Every section carries a `describe` string written the way the
   glasses would describe a scene — not alt text, not a summary. When narration
   is on, entering a section speaks that string and prints it in the rail, so
   the feature works with the sound off too.

   The two assembly films are never played. They are scroll-scrubbed: the block
   is pinned and scroll position drives video currentTime, like the ring on
   animejs.com. Both are encoded all-intra (-g 1) so seeking is frame-accurate.
   ═══════════════════════════════════════════════════════════════════════════ */

const CAPABILITIES = [
  ['01', 'Real-time scene understanding', 'The 8MP wide-FOV camera narrates what is in front of you, continuously and out loud.'],
  ['02', 'Obstacle & overhead detection', 'Low branches, open cabinet doors, kerbs and steps — flagged before you reach them.'],
  ['03', 'Voice assistant & navigation', 'Turn-by-turn guidance through bone conduction, ears left completely open.'],
  ['04', 'Reading & object recognition', 'Signs, labels, menus, medicine boxes and currency, read back on demand.'],
  ['05', 'Offline AI processing', 'The K210 accelerator runs core vision on-device. No signal is not the same as no sight.'],
  ['06', 'Family guardian connectivity', 'A consented live link family can open — and the wearer can end at any moment.'],
  ['07', 'Community & volunteer network', 'The Echo Network routes a request to a nearby trained volunteer within seconds.'],
  ['08', 'Haptic feedback support', 'The wrist band turns direction and alerts into vibration patterns you can feel.'],
];

const GLASSES_SPECS = [
  ['Weight', '85', 'g'], ['Battery', '6000', 'mAh'],
  ['Camera', '8', 'MP'], ['Frame width', '160', 'mm'],
];

const BAND_SPECS = [
  ['Weight', '30', 'g'], ['Battery life', '7', 'days'],
  ['Battery', '200', 'mAh'], ['Resistance', 'IP67', ''],
];

const STORIES = [
  { id: 'morning', tag: 'Scene 01', title: 'Morning', body: 'Waking, dressing, and crossing a familiar room without counting steps.' },
  { id: 'signal', tag: 'Scene 02', title: 'Signal', body: 'A crossing read in real time — traffic, kerb, and the moment it is safe to go.' },
  { id: 'network', tag: 'Scene 03', title: 'Network', body: 'One tap opens the Echo Network and a volunteer is already looking.' },
  { id: 'contact', tag: 'Scene 04', title: 'Contact', body: 'Family checks in, sees what is needed, and steps back out again.' },
];

const ROLES = [
  ['/family', '01', 'Family head', 'Pairs the device, manages the circle, and answers guardian requests.'],
  ['/member', '02', 'Family member', 'Sees status and location when the wearer has granted consent.'],
  ['/helper', '03', 'Echo Network helper', 'A trained volunteer who takes live assistance requests nearby.'],
  ['/admin', '04', 'Administrator', 'Fleet health, firmware, alerts and the full audit trail.'],
];

const HERO_WORDS: { w: string; accent?: boolean }[] = [
  { w: 'FORGING' }, { w: 'LIGHT.' }, { w: 'EMPOWERING' }, { w: 'SIGHT.', accent: true },
];

/* ── Narration ─────────────────────────────────────────────────────────────
   Web Speech API — no dependency, no key, no network. Absent in some browsers,
   so every path degrades to the printed rail, which is the real deliverable.  */
function useNarration() {
  const [on, setOn] = useState(false);
  const [text, setText] = useState('');
  const supported = useRef(typeof window !== 'undefined' && 'speechSynthesis' in window);

  const say = useCallback((t: string) => {
    setText(t);
    if (!supported.current) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.rate = 0.98;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch {
      /* printed rail still carries it */
    }
  }, []);

  const toggle = useCallback(() => {
    setOn((was) => {
      if (was && supported.current) {
        try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
      }
      return !was;
    });
  }, []);

  useEffect(() => () => {
    if (supported.current) {
      try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    }
  }, []);

  return { on, text, say, toggle, setText };
}

/* ── Scroll-scrubbed assembly film ─────────────────────────────────────────
   The wrapper is tall; the inner is sticky. Progress through the wrapper maps
   to video currentTime. A rAF loop eases the actual currentTime toward the
   scroll target so fast flicks stay smooth instead of stepping.              */
function ScrubFilm({
  src, vh = 320, children,
}: {
  src: string; vh?: number; children?: React.ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLElement>(null);
  const pct = useRef<HTMLElement>(null);

  useEffect(() => {
    const w = wrap.current, v = vid.current;
    if (!w || !v) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show the finished product rather than scrubbing anything.
      const settle = () => { try { v.currentTime = v.duration || 0; } catch { /* ignore */ } };
      if (v.readyState >= 1) settle();
      else v.addEventListener('loadedmetadata', settle, { once: true });
      return;
    }

    let raf = 0, target = 0, current = 0, live = false;

    const progress = () => {
      const r = w.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    };

    const tick = () => {
      raf = live ? requestAnimationFrame(tick) : 0;
      const d = v.duration;
      if (!d || !isFinite(d)) return;
      current += (target - current) * 0.16;              // ease toward the scroll target
      if (Math.abs(target - current) < 0.004) current = target;
      try { v.currentTime = current * d; } catch { /* seek not ready yet */ }
      const p = progress();
      if (bar.current) bar.current.style.width = `${p * 100}%`;
      // written straight to the DOM: this updates every frame and must not
      // re-render the whole page while scrolling
      if (pct.current) pct.current.textContent = String(Math.round(p * 100));
    };

    const onScroll = () => { target = progress(); };

    // Only run the loop while the block is actually on screen.
    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting;
      if (live && !raf) raf = requestAnimationFrame(tick);
    }, { threshold: 0 });
    io.observe(w);

    onScroll();
    current = target;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="lp-scrub" ref={wrap} style={{ height: `${vh}vh` }}>
      <div className="lp-scrub-sticky">
        <video ref={vid} src={src} muted playsInline preload="auto" aria-hidden="true" />
        <div className="lp-scrub-head">{children}</div>
        <p className="lp-scrub-count" aria-hidden="true">
          <b ref={pct as React.RefObject<HTMLElement>}>0</b> % assembled
        </p>
        <div className="lp-scrub-progress"><i ref={bar as React.RefObject<HTMLElement>} /></div>
      </div>
    </div>
  );
}

export function Landing() {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope | null>(null);
  const { on, text, say, toggle, setText } = useNarration();
  const onRef = useRef(on);
  onRef.current = on;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    scope.current = createScope({ root: el }).add(() => {
      if (!reduced) {
        animate('.lp-hero-title .lp-char', {
          opacity: [0, 1], y: ['1.05em', '0em'], rotate: [7, 0],
          duration: 1050, delay: stagger(24, { start: 160 }), ease: 'out(3)',
        });
        animate('.lp-hero-fade', {
          opacity: [0, 1], y: [18, 0],
          duration: 850, delay: stagger(85, { start: 620 }), ease: 'out(3)',
        });
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const s = entry.target as HTMLElement;

          const items = s.querySelectorAll<HTMLElement>('.lp-rv');
          if (items.length) {
            io.unobserve(s);
            if (reduced) utils.set(items, { opacity: 1, y: 0 });
            else animate(items, {
              opacity: [0, 1], y: [22, 0],
              duration: 820, delay: stagger(65), ease: 'out(3)',
            });

            s.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
              const to = Number(node.dataset.count);
              if (Number.isNaN(to)) return;
              if (reduced) { node.textContent = String(to); return; }
              const box = { n: 0 };
              animate(box, {
                n: to, duration: 1400, ease: 'out(4)',
                onUpdate: () => { node.textContent = String(Math.round(box.n)); },
              });
            });
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
      el.querySelectorAll<HTMLElement>('[data-observe]').forEach((s) => io.observe(s));

      /* Narration: a separate observer, because it must keep firing every time
         a section is re-entered, not once like the reveal animations. */
      const speakIo = new IntersectionObserver((entries) => {
        if (!onRef.current) return;
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const line = hit && (hit.target as HTMLElement).dataset.describe;
        if (line) say(line);
      }, { threshold: 0.55 });
      el.querySelectorAll<HTMLElement>('[data-describe]').forEach((s) => speakIo.observe(s));

      const nav = el.querySelector<HTMLElement>('.lp-nav');
      const onScrollY = () => nav?.classList.toggle('lp-stuck', window.scrollY > 80);
      onScrollY();
      window.addEventListener('scroll', onScrollY, { passive: true });

      return () => {
        io.disconnect();
        speakIo.disconnect();
        window.removeEventListener('scroll', onScrollY);
      };
    });

    return () => scope.current?.revert();
  }, [say]);

  // Turning narration on should say something immediately, not wait for a scroll.
  useEffect(() => {
    if (on) say('Narration on. As you move down the page, ARGES will describe each section aloud, the way the glasses describe a room.');
    else setText('');
  }, [on, say, setText]);

  return (
    <div className={`lp${on && text ? ' lp-railed' : ''}`} ref={root}>
      <a href="#main" className="skip-link">Skip to content</a>

      <header className="lp-nav">
        <div className="lp-nav-in">
          <Link to="/" className="lp-brand">ARGES <em>VISION</em></Link>
          <div className="lp-nav-right">
            <button
              type="button"
              className="lp-speak-toggle"
              aria-pressed={on}
              onClick={toggle}
            >
              <span className="lp-speak-dot" aria-hidden="true" />
              {on ? 'Narrating' : 'Describe this page'}
            </button>
            <Link to="/signup" className="lp-btn lp-btn-primary">Get ARGES</Link>
          </div>
        </div>
      </header>

      <main id="main">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section
          className="lp-hero"
          data-describe="A pair of ARGES Vision smart glasses turns slowly inside a ring of instrument markings. Amber lenses, blue status lights along the brow. The headline reads: forging light, empowering sight."
        >
          <div className="lp-hero-media">
            <video src="/media/hero.mp4" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
          </div>
          <div className="lp-hero-scrim" />
          <div className="lp-hero-in">
            <p className="lp-eyebrow lp-hero-fade">AI vision ecosystem for the visually impaired</p>
            <h1 className="lp-d1 lp-hero-title">
              <span aria-hidden="true">
                {HERO_WORDS.map((p, i) => (
                  <span key={i} className={`lp-word${p.accent ? ' lp-accent' : ''}`}>
                    {Array.from(p.w).map((c, j) => <span key={j} className="lp-char">{c}</span>)}
                  </span>
                ))}
              </span>
              <span className="sr-only">Forging light. Empowering sight.</span>
            </h1>
            <p className="lp-lede lp-hero-lede lp-hero-fade">
              Smart glasses that read the world aloud, feel the way forward on your wrist,
              and keep the people who love you one consented tap away.
            </p>
            <div className="lp-hero-cta lp-hero-fade">
              <Link to="/signup" className="lp-btn lp-btn-primary">Get ARGES</Link>
              <Link to="/3d" className="lp-btn lp-btn-ghost">See it in 3D</Link>
            </div>
            <p className="lp-hero-invite lp-hero-fade">
              This page can describe itself — <b>press “Describe this page”</b> and ARGES will
              narrate it aloud, the way it narrates a room.
            </p>
          </div>
        </section>

        {/* ── Scrub 1 · the glasses assembling ──────────────────────────── */}
        <section
          data-describe="Fourteen components drift together and assemble into a finished pair of glasses: the front frame, an eight megapixel camera module, an amber polarised lens, a circuit board, a battery, and two temple arms. Scrolling drives the assembly."
        >
          <ScrubFilm src="/media/scrub-glasses.mp4" vh={340}>
            <div className="lp-shell">
              <p className="lp-eyebrow">Anatomy · scroll to assemble</p>
              <h2 className="lp-d2">Fourteen parts.<br />Eighty-five grams.</h2>
            </div>
          </ScrubFilm>
        </section>

        <section className="lp-band" data-observe>
          <div className="lp-shell">
            <dl className="lp-specs lp-rv">
              {GLASSES_SPECS.map(([k, v, u]) => (
                <div className="lp-spec" key={k}>
                  <dt>{k}</dt>
                  <dd><span data-count={v}>0</span><small>{u}</small></dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Capabilities ──────────────────────────────────────────────── */}
        <section
          className="lp-band" data-observe
          data-describe="Eight capabilities, listed. Scene understanding. Obstacle and overhead detection. Voice navigation. Reading and object recognition. Offline processing. Family connectivity. A volunteer network. And haptic feedback on the wrist."
        >
          <div className="lp-shell">
            <p className="lp-eyebrow lp-rv">Capabilities</p>
            <h2 className="lp-d2 lp-rv" style={{ marginBottom: 'var(--s5)' }}>
              Eight things it does the moment you put it on.
            </h2>
            <div className="lp-caps">
              {CAPABILITIES.map(([no, title, body]) => (
                <div className="lp-cap lp-rv" key={no}>
                  <span className="lp-cap-no">{no}</span>
                  <h3 className="lp-d3">{title}</h3>
                  <p className="lp-small">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Scrub 2 · the band assembling ─────────────────────────────── */}
        <section
          data-describe="Ten components assemble into the haptic wrist band: a front cover carrying the phoenix emblem, a vibration motor, a circuit board, a battery, and a silicone strap. Thirty grams, seven days of battery."
        >
          <ScrubFilm src="/media/scrub-band.mp4" vh={300}>
            <div className="lp-shell">
              <p className="lp-eyebrow">Haptic band · scroll to assemble</p>
              <h2 className="lp-d2">Real-time alerts.<br />Silent guidance.</h2>
            </div>
          </ScrubFilm>
        </section>

        <section className="lp-band" data-observe>
          <div className="lp-shell">
            <dl className="lp-specs lp-rv">
              {BAND_SPECS.map(([k, v, u]) => (
                <div className="lp-spec" key={k}>
                  <dt>{k}</dt>
                  <dd>{u ? <><span data-count={v}>0</span><small>{u}</small></> : <span>{v}</span>}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Stories ───────────────────────────────────────────────────── */}
        <section
          className="lp-band" data-observe
          data-describe="Four short films play. A woman puts on the glasses at a sunlit window. A man waits at a crossing and steps off the kerb. A volunteer answers a request from a city street. A daughter arrives at her father's kitchen table."
        >
          <div className="lp-shell">
            <p className="lp-eyebrow lp-rv">In the field</p>
            <h2 className="lp-d2 lp-rv" style={{ marginBottom: 'var(--s5)' }}>A day, as ARGES sees it.</h2>
            <div className="lp-stories">
              {STORIES.map((s) => (
                <figure className="lp-story lp-rv" key={s.id} style={{ margin: 0 }}>
                  <span className="lp-story-tag">{s.tag}</span>
                  <video src={`/media/story-${s.id}.mp4`} autoPlay muted loop playsInline preload="none"
                    aria-label={`${s.title}. ${s.body}`} />
                  <figcaption className="lp-story-body">
                    <h3 className="lp-d3">{s.title}</h3>
                    <p className="lp-small">{s.body}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ecosystem ─────────────────────────────────────────────────── */}
        <section
          className="lp-band" data-observe
          data-describe="The glasses are one seat of four. A family head, a family member, a volunteer helper, and an administrator. Every link is consented by the wearer, and the wearer can end it at any time."
        >
          <div className="lp-shell">
            <p className="lp-eyebrow lp-rv">Ecosystem</p>
            <h2 className="lp-d2 lp-rv">The glasses are one seat of four.</h2>
            <p className="lp-lede lp-rv" style={{ margin: 'var(--s3) 0 var(--s5)' }}>
              Every link is consented by the wearer and can be ended by the wearer — at any
              time, without asking anyone.
            </p>
            <div className="lp-roles">
              {ROLES.map(([to, no, name, body]) => (
                <Link to={to} className="lp-role lp-rv" key={to}>
                  <span className="lp-role-no">{no}</span>
                  <span>
                    <h3 className="lp-d3">{name}</h3>
                    <p className="lp-small">{body}</p>
                  </span>
                  <span className="lp-role-go">Open →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Close ─────────────────────────────────────────────────────── */}
        <section
          className="lp-close lp-band" data-observe
          data-describe="Forging light, empowering sight. Built by students at Thiagarajar Polytechnic College, Salem."
        >
          <div className="lp-shell">
            <h2 className="lp-d2 lp-rv">Forging light. Empowering sight.</h2>
            <p className="lp-lede lp-rv">
              Built by students at Thiagarajar Polytechnic College, Salem — for the people
              the technology industry keeps forgetting to build for.
            </p>
            <div className="lp-close-cta lp-rv">
              <Link to="/signup" className="lp-btn lp-btn-primary">Get ARGES</Link>
              <Link to="/login" className="lp-btn lp-btn-ghost">Sign in</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-foot">
        <div className="lp-shell lp-foot-in">
          <p>ARGES Vision · Thiagarajar Polytechnic College, Salem</p>
          <p>Forging Light. Empowering Sight.</p>
        </div>
      </footer>

      {/* The narration rail — the printed half of the feature. */}
      <div className={`lp-rail${on && text ? ' lp-open' : ''}`} aria-live="polite">
        <div className="lp-rail-in">
          <span className="lp-rail-tag">ARGES</span>
          <p className="lp-rail-text">{text}</p>
          <button type="button" className="lp-rail-close" onClick={toggle}>Stop</button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
