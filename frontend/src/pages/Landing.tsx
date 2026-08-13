import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

// Lazy load 3D viewer so Three.js only downloads when needed
const GlassesViewer3D = lazy(() => import('../components/GlassesViewer3D').then(m => ({ default: m.GlassesViewer3D })));

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const ECOSYSTEM = [
  { num: '/ 01', icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', title: 'Smart Vision', desc: 'Obstacle detection, scene description, navigation — including overhead hazards the cane misses.' },
  { num: '/ 02', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', title: 'Reading Intelligence', desc: 'OCR, currency recognition, product scanning, color detection. Reads the world aloud.' },
  { num: '/ 03', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', title: 'Family Guardian', desc: 'Live encrypted video, audio & GPS streamed to family. Consent-based access. SOS in one touch.' },
  { num: '/ 04', icon: 'M2 3h20v14H2z M8 21h8 M12 17v4', title: 'OmniAccess', desc: 'Operate phone, laptop or tablet exactly like a sighted person. True equality.' },
  { num: '/ 05', icon: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z M2 12h20', title: 'Echo Network', desc: 'Community mesh shares hazards. Volunteer vision connects help in 5 seconds.' },
];

const FEATURES = [
  { num: '/ 01', icon: 'M23 7l-7 5 7 5V7z M1 5h15v14H1z', name: 'Family Connect', desc: 'Live encrypted video, audio & GPS from the glasses, streamed to family with consent.' },
  { num: '/ 02', icon: 'M5 2h14v20H5z', name: 'OmniAccess', desc: 'Operate phone, laptop or tablet exactly like a sighted person.' },
  { num: '/ 03', icon: 'M5 12.55a11 11 0 0 1 14.08 0 M1.42 9a16 16 0 0 1 21.16 0', name: 'Echo Network', desc: 'Community mesh shares hazards; volunteers help in 5 seconds.' },
  { num: '/ 04', icon: 'M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76z', name: 'Spatial Sound', desc: '3D binaural beeps guide direction — just follow the sound.' },
  { num: '/ 05', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', name: 'Companion AI', desc: 'Detects stress and sadness; supports mental wellness.' },
  { num: '/ 06', icon: 'M2 12h4 M18 12h4 M8 8v8 M16 8v8 M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', name: 'HapticBand', desc: 'Directional vibration zones encode object and distance.' },
  { num: '/ 07', icon: 'M10.5 20.5L3 12l3-3 7.5 7.5', name: 'MediScan', desc: 'Reads labels, checks drug interactions, dosage reminders.' },
  { num: '/ 08', icon: 'M3 11h18v11H3z M7 11V7a5 5 0 0 1 10 0v4', name: 'Zero-Knowledge', desc: 'AES-256 end-to-end encryption — even ARGES cannot decrypt your data.' },
];

const PRICING = [
  { tier: 'ARGES One', price: '₹9,999', per: 'one-time · glasses only', feats: ['All standalone AI features', 'Lifetime offline AI', 'OCR · currency · faces', 'Wake-word voice assistant'], featured: false },
  { tier: 'ARGES Family', price: '₹12,999', per: 'one-time · glasses + band + cloud', feats: ['Everything in ARGES One', 'HapticBand included', '1-year cloud streaming', 'Family Guardian Dashboard', 'Echo Network access'], featured: true },
  { tier: 'ARGES Care', price: '₹49/mo', per: 'subscription · after year 1', feats: ['Live streaming continuation', 'Echo Network', 'Software updates', 'Companion AI premium'], featured: false },
];

const FAQS = [
  { q: 'Do I need internet for ARGES to work?', a: 'No — core AI (obstacle detection, OCR, currency, face recognition) runs on-device. The cloud is only used for language translation, family streaming, and the Echo Network.' },
  { q: 'Is the family video stream private?', a: 'Yes — AES-256 end-to-end encryption via LiveKit SFrame. Even ARGES itself cannot decrypt your stream. Plus consent-based access: the blind user must approve every viewing request.' },
  { q: 'How long does the battery last?', a: '8+ hours with the 6000mAh battery. The optional solar charging strap trickle-charges during outdoor use.' },
  { q: 'Can the user operate a phone or laptop?', a: 'Yes — ARGES OmniAccess provides sight-equivalent control via spoken and haptic feedback.' },
  { q: 'Does it work in Indian languages?', a: 'Yes — 32+ Indian languages via Bhashini, including Hindi, Tamil, Telugu, Marathi, Bengali.' },
  { q: 'What if the user falls?', a: 'The ADXL345 detects the fall (99.4% accuracy) and triggers Guardian SOS with auto-grant emergency access.' },
];

export function Landing() {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true });
  const [navScrolled, setNavScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Scroll-driven 3D model movement — ONLY for CTA section
  const ctaRef = useRef(null);
  const ctaScroll = useScroll({ target: ctaRef, offset: ['start end', 'end start'] });
  const ctaModelX = useTransform(ctaScroll.scrollYProgress, [0, 0.5, 1], [-200, 0, 200]);
  const ctaModelRotate = useTransform(ctaScroll.scrollYProgress, [0, 0.5, 1], [-30, 0, 30]);

  // Blur reveal for headings
  const blurReveal = {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 30 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  // Cursor
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const dot = document.querySelector('.cursor-dot') as HTMLElement;
    const ring = document.querySelector('.cursor-ring') as HTMLElement;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    };
    const anim = () => {
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(anim);
    };
    const onEnter = () => ring.classList.add('hover');
    const onLeave = () => ring.classList.remove('hover');

    window.addEventListener('mousemove', onMove);
    anim();
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="theme-admin min-h-screen relative">
      {/* CURSOR */}
      <div className="cursor-dot" />
      <div className="cursor-ring" />

      {/* SPATIAL BG ORBS */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* NAVBAR */}
      <nav className={`nav${navScrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="nav-logo">
          <svg viewBox="0 0 100 100" width="26" height="26"><path d="M50 28 C28 28 14 50 14 50 C14 50 28 72 50 72 C72 72 86 50 86 50 C86 50 72 28 50 28 Z" stroke="#FF6B1A" strokeWidth="3" fill="none"/><circle cx="50" cy="50" r="9" stroke="#FF6B1A" strokeWidth="3" fill="none"/><circle cx="50" cy="50" r="3.5" fill="#FF6B1A"/></svg>
          ARGES
        </Link>
        <div className="nav-links">
          <a href="#ecosystem">Ecosystem</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <Link to="/3d" className="btn-primary nav-cta">Get ARGES</Link>
      </nav>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        {/* 3D MODEL — stays centered, auto-rotates */}
        <div className="hero-3d">
          <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,107,26,0.2)', borderTopColor: '#FF6B1A', animation: 'spin 0.8s linear infinite' }} /></div>}>
            <GlassesViewer3D />
          </Suspense>
        </div>

        {/* FLOATING CARDS */}
        <div className="hero-float-card float-1">
          <div className="icon"><svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="3" fill="none" stroke="#FF6B1A" strokeWidth="1.5"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke="#FF6B1A" strokeWidth="1.5"/></svg></div>
          <div><div className="lbl">AI Vision</div><div className="val">Active</div></div>
        </div>
        <div className="hero-float-card float-2">
          <div className="icon"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke="#FF6B1A" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" fill="none" stroke="#FF6B1A" strokeWidth="1.5"/></svg></div>
          <div><div className="lbl">Family</div><div className="val">Connected</div></div>
        </div>
        <div className="hero-float-card float-3">
          <div className="icon"><svg viewBox="0 0 24 24" width="18" height="18"><rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="#FF6B1A" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="#FF6B1A" strokeWidth="1.5"/></svg></div>
          <div><div className="lbl">Privacy</div><div className="val">E2EE Locked</div></div>
        </div>
        <div className="hero-float-card float-4">
          <div className="icon"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3" fill="none" stroke="#FF6B1A" strokeWidth="1.5"/></svg></div>
          <div><div className="lbl">Live GPS</div><div className="val">Streaming</div></div>
        </div>

        <div className="hero-text-wrap">
          <div className="hero-eyebrow" style={{ opacity: isInView ? undefined : 0 }}>Spatial AI Vision Ecosystem</div>
          <h1 className="hero-title">
            <span className="ln"><span>Forging</span></span>
            <span className="ln"><span className="grad-text">Light.</span></span>
            <span className="ln"><span>Empowering</span></span>
            <span className="ln"><span className="grad-text">Sight.</span></span>
          </h1>
          <div className="hero-greek" style={{ opacity: isInView ? undefined : 0 }}>Ἄργης · "The Bright One"</div>
          <p className="hero-sub" style={{ opacity: isInView ? undefined : 0 }}>A five-layer AI vision ecosystem that restores independence, safety, and dignity to the visually impaired — designed like a spatial computing platform, not a medical device.</p>
          <div className="hero-cta" style={{ opacity: isInView ? undefined : 0 }}>
            <Link to="/3d" className="btn-primary">Get ARGES →</Link>
            <a href="#ecosystem" className="btn-ghost">Explore Ecosystem</a>
          </div>
          <div className="hero-meta" style={{ opacity: isInView ? undefined : 0 }}>
            <div className="hero-meta-item"><div className="hero-meta-num">15M+</div><div className="hero-meta-lbl">Blind in India</div></div>
            <div className="hero-meta-item"><div className="hero-meta-num">₹9,999</div><div className="hero-meta-lbl">Starting price</div></div>
            <div className="hero-meta-item"><div className="hero-meta-num">8</div><div className="hero-meta-lbl">Industry firsts</div></div>
            <div className="hero-meta-item"><div className="hero-meta-num">5</div><div className="hero-meta-lbl">Layer ecosystem</div></div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section id="ecosystem">
        <div className="container">
          <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="section-head">
            <span className="label label-o">/ 01 — The Solution</span>
            <h2 className="section-title">Not a gadget. <span className="grad-text">An ecosystem.</span></h2>
            <p className="section-intro">Five spatial layers, floating in perfect harmony. Each builds on the one below.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="layers">
            {ECOSYSTEM.map((layer) => (
              <motion.div variants={fadeUp} whileHover={{ y: -16, scale: 1.03 }} className="layer-card" key={layer.title}>
                <div className="layer-num">{layer.num}</div>
                <div className="layer-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path d={layer.icon} fill="none" stroke="#FF6B1A" strokeWidth="1.5"/></svg></div>
                <div className="layer-title">{layer.title}</div>
                <div className="layer-desc">{layer.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="container">
          <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="section-head">
            <span className="label label-o">/ 02 — Differentiators</span>
            <h2 className="section-title">Eight things <span className="grad-text">no other glasses</span> can do.</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="features">
            {FEATURES.map(f => (
              <motion.div variants={fadeUp} whileHover={{ y: -12 }} className="feature" key={f.name}
                onMouseMove={(e) => {
                  const el = e.currentTarget;
                  const r = el.getBoundingClientRect();
                  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
                  el.style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
              >
                <div className="feature-num">{f.num}</div>
                <div className="feature-icon"><svg viewBox="0 0 24 24" width="100%" height="100%"><path d={f.icon} fill="none" stroke="#FF6B1A" strokeWidth="1.5"/></svg></div>
                <div className="feature-name">{f.name}</div>
                <div className="feature-desc">{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="container">
          <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="section-head">
            <span className="label label-o">/ 03 — Pricing</span>
            <h2 className="section-title">Independence shouldn't cost<br/><span className="grad-text">a fortune.</span></h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="pricing-grid">
            {PRICING.map(p => (
              <motion.div variants={fadeUp} whileHover={{ y: -16 }} className={`price-card${p.featured ? ' featured' : ''}`} key={p.tier}
                onMouseMove={(e) => {
                  const el = e.currentTarget;
                  const r = el.getBoundingClientRect();
                  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
                  el.style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
              >
                {p.featured && <div className="price-badge">Most Popular</div>}
                <div className="price-tier">{p.tier}</div>
                <div className={`price-amt${p.featured ? ' orange' : ''}`}>{p.price}</div>
                <div className="price-per">{p.per}</div>
                <ul className="price-feats">{p.feats.map(f => <li key={f}>{f}</li>)}</ul>
                <a href="#cta" className={`price-btn${p.featured ? ' solid' : ' outline'}`}>Get {p.tier}</a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="container">
          <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="section-head" style={{textAlign:'center',margin:'0 auto 70px'}}>
            <span className="label label-o" style={{display:'block'}}>/ 04 — Questions</span>
            <h2 className="section-title" style={{marginTop:'20px'}}>Frequently asked.</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="faq-list">
            {FAQS.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} className={`faq-item${openFaq === i ? ' open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-q">{faq.q}<span className="faq-icon"></span></div>
                <div className="faq-a">{faq.a}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA — with 3D glasses that move left/right on scroll */}
      <section id="cta" className="cta-section" ref={ctaRef}>
        <div className="cta-card">
          {/* 3D glasses that slide left → right as you scroll through this section */}
          <motion.div
            style={{ x: ctaModelX, rotateY: ctaModelRotate }}
            className="w-[300px] h-[200px] mx-auto mb-8"
          >
            <Suspense fallback={<div style={{ height: 200 }} />}>
              <GlassesViewer3D autoRotate={true} />
            </Suspense>
          </motion.div>

          <motion.h2 variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display font-bold text-[clamp(2.2rem,4.8vw,3.8rem)] tracking-tight leading-none mb-5">
            Ready to forge <span className="grad-text">light?</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-[#9999AA] mb-10 text-lg text-center">
            Give independence. Give safety. Give dignity. Give ARGES.
          </motion.p>
          <div className="hero-cta" style={{opacity:1,animation:'none',justifyContent:'center'}}>
            <Link to="/signup" className="btn-primary">Get ARGES →</Link>
            <Link to="/login" className="btn-ghost">Talk to us</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <h3><span className="dot"></span>ARGES Vision</h3>
            <p>Forging Light. Empowering Sight. — A spatial AI vision ecosystem for the visually impaired.</p>
          </div>
          <div className="footer-col"><h4>Product</h4><a href="#ecosystem">Ecosystem</a><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></div>
          <div className="footer-col"><h4>Family</h4><Link to="/family">Guardian Dashboard</Link><Link to="/login">Login</Link><a href="#">SOS Info</a></div>
          <div className="footer-col"><h4>Company</h4><a href="#">About</a><a href="#">Contact</a><a href="#">Privacy</a><a href="#">DPDP</a></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ARGES · <span style={{color:'var(--orange)'}}>Forging Light. Empowering Sight.</span></span>
          <span>Made in India</span>
        </div>
      </footer>
    </div>
  );
}
