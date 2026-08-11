import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArgesLogo } from '../components/ArgesLogo';
import { Badge } from '../components/Badge';
import { GlassPanel, StatCard } from '../components/GlassPanel';
import { EASE, heroLine, fadeUp, stagger, blurText } from '../animations';

const NAV_LINKS = ['Ecosystem', 'Features', 'Pricing', 'FAQ'];

const ECOSYSTEM = [
  { num: '/ 01', icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', title: 'Smart Vision', desc: 'Obstacle detection, scene description, navigation — including overhead hazards the cane misses.' },
  { num: '/ 02', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', title: 'Reading Intelligence', desc: 'OCR, currency recognition, product scanning, color detection. Reads the world aloud.' },
  { num: '/ 03', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87', title: 'Family Guardian', desc: 'Live encrypted video, audio & GPS streamed to family. Consent-based access. SOS in one touch.' },
  { num: '/ 04', icon: 'M2 3h20v14H2z M8 21h8', title: 'OmniAccess', desc: 'Operate phone, laptop or tablet exactly like a sighted person. True equality.' },
  { num: '/ 05', icon: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z', title: 'Echo Network', desc: 'Community mesh shares hazards. Volunteer vision connects help in 5 seconds.' },
];

const FEATURES = [
  { num: '/ 01', icon: 'M23 7l-7 5 7 5V7z M1 5h15v14H1z', name: 'Family Connect', desc: 'Live encrypted video, audio & GPS from the glasses, streamed to family with consent.' },
  { num: '/ 02', icon: 'M5 2h14v20H5z', name: 'OmniAccess', desc: 'Operate phone, laptop or tablet exactly like a sighted person.' },
  { num: '/ 03', icon: 'M5 12.55a11 11 0 0 1 14.08 0', name: 'Echo Network', desc: 'Community mesh shares hazards; volunteers help in 5 seconds.' },
  { num: '/ 04', icon: 'M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76z', name: 'Spatial Sound', desc: '3D binaural beeps guide direction — just follow the sound.' },
  { num: '/ 05', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78', name: 'Companion AI', desc: 'Detects stress and sadness; supports mental wellness.' },
  { num: '/ 06', icon: 'M2 12h4 M18 12h4 M8 8v8 M16 8v8', name: 'HapticBand', desc: 'Directional vibration zones encode object and distance.' },
  { num: '/ 07', icon: 'M10.5 20.5L3 12l3-3 7.5 7.5', name: 'MediScan', desc: 'Reads labels, checks drug interactions, dosage reminders.' },
  { num: '/ 08', icon: 'M3 11h18v11H3z M7 11V7a5 5 0 0 1 10 0v4', name: 'Zero-Knowledge', desc: 'AES-256 E2EE — even ARGES cannot decrypt your data.' },
];

const PRICING = [
  { tier: 'ARGES One', price: '₹9,999', per: 'one-time · glasses only', feats: ['All standalone AI features', 'Lifetime offline AI', 'OCR · currency · faces', 'Wake-word voice assistant'], featured: false },
  { tier: 'ARGES Family', price: '₹12,999', per: 'one-time · glasses + band + cloud', feats: ['Everything in ARGES One', 'HapticBand included', '1-year cloud streaming', 'Family Guardian Dashboard', 'Echo Network access'], featured: true },
  { tier: 'ARGES Care', price: '₹49/mo', per: 'subscription · after year 1', feats: ['Live streaming continuation', 'Echo Network', 'Software updates', 'Companion AI premium'], featured: false },
];

const FAQS = [
  { q: 'Do I need internet for ARGES to work?', a: 'No — core AI (obstacle detection, OCR, currency, face recognition) runs on-device. The cloud is only used for language translation, family streaming, and the Echo Network.' },
  { q: 'Is the family video stream private?', a: 'Yes — AES-256 end-to-end encryption via LiveKit SFrame. Even ARGES itself cannot decrypt your stream. Plus consent-based access: the blind user must approve every viewing request.' },
  { q: 'How long does the battery last?', a: '8+ hours with the 6000mAh battery. The optional solar charging strap trickle-charges during outdoor use, extending it further.' },
  { q: 'Can the user operate a phone or laptop?', a: 'Yes — ARGES OmniAccess provides sight-equivalent control of connected devices via spoken and haptic feedback. This is true equality, not a limited accessibility mode.' },
  { q: 'Does it work in Indian languages?', a: 'Yes — 32+ Indian languages via Bhashini, including Hindi, Tamil, Telugu, Marathi, Bengali, and many more.' },
  { q: 'What if the user falls?', a: 'The ADXL345 detects the fall (99.4% accuracy) and triggers Guardian SOS — instantly sending live GPS, audio, and video to family with auto-grant emergency access.' },
];

export function Landing() {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true });

  return (
    <div className="theme-admin min-h-screen relative">
      {/* Floating BG Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(255,107,26,0.12), transparent 65%)', top: '-10%', left: '-5%', animation: 'pulse 8s ease-in-out infinite' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(80,40,200,0.08), transparent 65%)', top: '40%', right: '-5%' }} />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-8 w-[calc(100%-48px)] max-w-[1100px] px-6 py-2.5 rounded-full glass"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)' }}
      >
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg">
          <ArgesLogo size={28} /> ARGES
        </Link>
        <div className="hidden md:flex gap-7">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-[#8B8B9A] hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </div>
        <div className="flex gap-2">
          <Link to="/login" className="px-4 py-2 text-sm text-[#8B8B9A] hover:text-white border border-[rgba(255,255,255,0.22)] rounded-full transition-all">Login</Link>
          <Link to="/signup" className="px-5 py-2 text-sm font-semibold bg-[var(--accent)] text-black rounded-full transition-all hover:scale-105" style={{ boxShadow: '0 4px 16px var(--accent-glow)' }}>
            Get ARGES
          </Link>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-10 flex items-center gap-3">
          <span className="w-10 h-px bg-[var(--accent)] opacity-50" /> Spatial AI Vision Ecosystem <span className="w-10 h-px bg-[var(--accent)] opacity-50" />
        </motion.div>

        <h1 className="font-display font-extrabold text-[clamp(3rem,10vw,8.5rem)] leading-[0.88] tracking-tight">
          {['Forging', 'Light.', 'Empowering', 'Sight.'].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                variants={heroLine}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: 0.3 + i * 0.15, duration: 1.2, ease: EASE }}
                className={`inline-block ${i % 2 === 1 ? 'gradient-text' : ''}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
          className="font-serif-i text-[var(--accent)] text-xl mt-6"
        >
          Ἄργης · "The Bright One"
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8, ease: EASE }}
          className="max-w-[560px] text-[#9999AA] text-base leading-relaxed mt-7 mb-11"
        >
          A five-layer AI vision ecosystem that restores independence, safety, and dignity to the visually impaired — designed like a spatial computing platform, not a medical device.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link to="/3d" className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold bg-[var(--accent)] text-black" style={{ boxShadow: '0 8px 32px var(--accent-glow)' }}>
              See How It Works →
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <a href="#ecosystem" className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-medium text-white border border-[rgba(255,255,255,0.22)] glass">
              Explore Ecosystem
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          className="flex gap-14 mt-16"
        >
          {[['15M+', 'Blind in India'], ['₹9,999', 'Starting price'], ['8', 'Industry firsts'], ['5', 'Layer ecosystem']].map(([num, lbl]) => (
            <div key={lbl} className="text-center">
              <div className="font-serif-i text-2xl text-[var(--accent)]">{num}</div>
              <div className="text-[0.66rem] text-[#8B8B9A] tracking-widest uppercase mt-1">{lbl}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ECOSYSTEM */}
      <section id="ecosystem" className="px-[5vw] py-40 relative z-10">
        <div className="max-w-[1280px] mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20 max-w-[900px]">
            <span className="font-mono text-xs tracking-[0.24em] uppercase text-[var(--accent)] block mb-5">/ 01 — The Solution</span>
            <h2 className="font-display font-bold text-[clamp(2.2rem,4.8vw,4.2rem)] tracking-tight leading-none">
              Not a gadget. <span className="gradient-text">An ecosystem.</span>
            </h2>
            <p className="text-[#9999AA] text-base mt-7 max-w-[560px] leading-relaxed">
              Five spatial layers, floating in perfect harmony. Each builds on the one below — hardware, AI, family, devices, community.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" style={{ perspective: 1000 }}>
            {ECOSYSTEM.map((layer, i) => (
              <motion.div
                key={layer.title}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.03 }}
                className="glass specular p-9 min-h-[320px] flex flex-col"
                style={{ transform: `translateZ(${[-20, 0, 20, 0, -20][i]}px)` }}
              >
                <div className="font-mono text-xs text-[var(--accent)] mb-6">{layer.num}</div>
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,107,26,0.08)] border border-[rgba(255,107,26,0.2)] flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none" strokeWidth="1.5"><path d={layer.icon} /></svg>
                </div>
                <h3 className="font-display font-semibold text-lg mb-3">{layer.title}</h3>
                <p className="text-sm text-[#8B8B9A] leading-relaxed">{layer.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-[5vw] py-40 relative z-10">
        <div className="max-w-[1280px] mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20 max-w-[900px]">
            <span className="font-mono text-xs tracking-[0.24em] uppercase text-[var(--accent)] block mb-5">/ 02 — Differentiators</span>
            <h2 className="font-display font-bold text-[clamp(2.2rem,4.8vw,4.2rem)] tracking-tight leading-none">
              Eight things <span className="gradient-text">no other glasses</span> can do.
            </h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.07)] rounded-3xl overflow-hidden">
            {FEATURES.map(f => (
              <motion.div key={f.name} variants={fadeUp} whileHover={{ y: -8 }}
                className="glass p-12 min-h-[240px] relative overflow-hidden group">
                <span className="absolute top-6 right-7 font-mono text-[0.68rem] text-[#555566]">{f.num}</span>
                <div className="w-11 h-11 mb-6">
                  <svg viewBox="0 0 24 24" className="w-full h-full stroke-[var(--accent)] fill-none" strokeWidth="1.5"><path d={f.icon} /></svg>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2.5">{f.name}</h3>
                <p className="text-sm text-[#8B8B9A] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-[5vw] py-40 relative z-10">
        <div className="max-w-[1280px] mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20">
            <span className="font-mono text-xs tracking-[0.24em] uppercase text-[var(--accent)] block mb-5">/ 03 — Pricing</span>
            <h2 className="font-display font-bold text-[clamp(2.2rem,4.8vw,4.2rem)] tracking-tight leading-none">
              Independence shouldn't cost<br /><span className="gradient-text">a fortune.</span>
            </h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PRICING.map(p => (
              <motion.div
                key={p.tier}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className={`glass specular p-12 flex flex-col relative ${p.featured ? 'border-[rgba(255,107,26,0.32)]' : ''}`}
                style={p.featured ? { background: 'rgba(255,107,26,0.06)', boxShadow: '0 0 70px rgba(255,107,26,0.10)' } : {}}
              >
                {p.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-black text-[0.68rem] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider" style={{ boxShadow: '0 4px 16px var(--accent-glow)' }}>
                    Most Popular
                  </div>
                )}
                <div className="font-mono text-xs text-[#8B8B9A] uppercase tracking-widest mb-4">{p.tier}</div>
                <div className={`font-serif-i text-5xl mb-1.5 ${p.featured ? 'text-[var(--accent)]' : ''}`}>{p.price}</div>
                <div className="text-xs text-[#8B8B9A] mb-8">{p.per}</div>
                <ul className="flex-1 mb-8 list-none">
                  {p.feats.map(f => (
                    <li key={f} className="text-sm text-[rgba(255,255,255,0.82)] py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-3">
                      <span className="w-3.5 h-px bg-[var(--accent)] flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <a href="#cta" className={`block text-center py-3.5 rounded-full font-semibold text-sm transition-all ${p.featured ? 'bg-[var(--accent)] text-black hover:shadow-lg' : 'border border-[rgba(255,255,255,0.22)] text-white hover:bg-[rgba(255,255,255,0.06)]'}`}
                  style={p.featured ? { boxShadow: '0 4px 20px var(--accent-glow)' } : {}}>
                  Get {p.tier}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-[5vw] py-40 relative z-10">
        <div className="max-w-[860px] mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-18">
            <span className="font-mono text-xs tracking-[0.24em] uppercase text-[var(--accent)] block mb-5">/ 04 — Questions</span>
            <h2 className="font-display font-bold text-[clamp(2.2rem,4.8vw,4.2rem)] tracking-tight">Frequently asked.</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {FAQS.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} className="border-b border-[rgba(255,255,255,0.06)] py-7 cursor-pointer group">
                <div className="flex justify-between items-center text-lg font-display font-medium">
                  {faq.q}
                  <span className="w-7 h-7 rounded-full border border-[rgba(255,255,255,0.18)] flex items-center justify-center text-[var(--accent)] group-hover:bg-[rgba(255,107,26,0.1)] group-hover:border-[var(--accent)] transition-all">+</span>
                </div>
                <p className="text-[#8B8B9A] text-sm leading-relaxed max-h-0 overflow-hidden group-hover:max-h-40 mt-0 group-hover:mt-4 transition-all duration-500">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="text-center py-44 px-[5vw] relative z-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-[920px] mx-auto p-24 rounded-[40px] glass text-center relative overflow-hidden"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,26,0.12), transparent 60%), var(--glass)', boxShadow: '0 40px 120px rgba(0,0,0,0.6)' }}>
          <h2 className="font-display font-bold text-[clamp(2.2rem,4.8vw,3.8rem)] tracking-tight mb-5">
            Ready to forge <span className="gradient-text">light?</span>
          </h2>
          <p className="text-[#9999AA] mb-10 text-lg">Give independence. Give safety. Give dignity. Give ARGES.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="px-9 py-4 rounded-full font-semibold bg-[var(--accent)] text-black" style={{ boxShadow: '0 8px 32px var(--accent-glow)' }}>
              Get ARGES →
            </Link>
            <Link to="/login" className="px-9 py-4 rounded-full font-medium text-white border border-[rgba(255,255,255,0.22)] glass">Talk to us</Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[rgba(5,5,12,0.6)] backdrop-blur-xl border-t border-[rgba(255,255,255,0.06)] px-[5vw] py-20 relative z-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-14 mb-16">
          <div>
            <h3 className="font-display font-bold text-xl flex items-center gap-3 mb-3.5"><span className="w-2 h-2 rounded-full bg-[var(--accent)]" style={{ boxShadow: '0 0 12px var(--accent-glow)' }} />ARGES</h3>
            <p className="text-[#8B8B9A] text-sm max-w-[340px] leading-relaxed">Forging Light. Empowering Sight. — A spatial AI vision ecosystem for the visually impaired.</p>
          </div>
          {[['Product', ['Ecosystem', 'Features', 'Pricing', 'FAQ']], ['Family', ['Guardian Dashboard', 'Login', 'SOS Info']], ['Company', ['About', 'Contact', 'Privacy', 'DPDP']]].map(([title, links]) => (
            <div key={title as string}>
              <h4 className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-[var(--accent)] mb-5">{title}</h4>
              {(links as string[]).map(l => <a key={l} href="#" className="block text-[#8B8B9A] text-sm py-1.5 hover:text-white transition-all">{l}</a>)}
            </div>
          ))}
        </div>
        <div className="max-w-[1280px] mx-auto pt-8 border-t border-[rgba(255,255,255,0.06)] flex justify-between items-center text-xs text-[#555566]">
          <span>© 2026 ARGES · <span className="text-[var(--accent)]">Forging Light. Empowering Sight.</span></span>
          <span>Made in India</span>
        </div>
      </footer>
    </div>
  );
}
