import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const STEPS = [
  { num: '/ STEP 01', title: '"ARGES, read this sign."', desc: 'The user says the wake word. The microphone array detects "ARGES" locally using Porcupine — completely offline, using less than 3.5% CPU.', tech: 'Porcupine · Offline · <3.5% CPU' },
  { num: '/ STEP 02', title: 'Intent parsed.', desc: 'The word "read" triggers OCR mode. The 1080p camera captures a frame of whatever is in front of the user.', tech: '1080p Sony Sensor · 30fps' },
  { num: '/ STEP 03', title: 'Text extracted on-device.', desc: 'Tesseract OCR runs directly on the glasses — no internet needed. It reads the sign and extracts the text in milliseconds.', tech: 'Tesseract · PaddleOCR · Edge AI' },
  { num: '/ STEP 04', title: 'Translated to your language.', desc: 'If needed, the text is sent to Bhashini cloud for translation into one of 32+ Indian languages.', tech: 'Bhashini · 32+ Languages' },
  { num: '/ STEP 05', title: 'Spoken aloud.', desc: 'The bone-conduction speaker delivers the answer directly into the user\'s ear. The HapticBand vibrates to confirm.', tech: 'Bone Conduction · Haptic Confirm' },
];

export function HowItWorks3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [0, 15, 0]);
  const lift = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.2, 0]);

  // Update active step based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', v => {
      const step = Math.min(4, Math.floor(v * 5));
      setActiveStep(step);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div className="theme-admin">
      {/* Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[calc(100%-60px)] max-w-[1100px] px-6 py-2.5 rounded-full glass">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg">
          <svg viewBox="0 0 100 100" width="26" height="26"><path d="M50 28 C28 28 14 50 14 50 C14 50 28 72 50 72 C72 72 86 50 86 50 C86 50 72 28 50 28 Z" stroke="#FF6B1A" strokeWidth="3" fill="none" /><circle cx="50" cy="50" r="9" stroke="#FF6B1A" strokeWidth="3" fill="none" /><circle cx="50" cy="50" r="3.5" fill="#FF6B1A" /></svg>
          ARGES
        </Link>
        <Link to="/" className="text-sm text-[#8B8B9A] hover:text-white">← Back to Home</Link>
        <Link to="/signup" className="px-5 py-2 text-sm font-semibold bg-[#FF6B1A] text-black rounded-full">Get ARGES</Link>
      </nav>

      {/* Intro */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-10 relative z-10">
        <div className="font-mono text-xs tracking-[0.3em] uppercase text-[#FF6B1A] mb-6">/ How It Works</div>
        <h1 className="font-display font-extrabold text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-tight">
          From voice to answer<br />in <span className="gradient-text">under 1.5 seconds.</span>
        </h1>
        <p className="max-w-[560px] text-[#9999AA] text-base mt-5 leading-relaxed">
          Scroll to watch the ARGES glasses come alive. Each step shows exactly what happens inside the device.
        </p>
        <div className="mt-12 flex flex-col items-center gap-2.5 text-[#555566] text-[0.62rem] tracking-[0.25em]">
          <span>SCROLL TO EXPLORE</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#FF6B1A]" style={{ animation: 'pulse 2s infinite' }} />
        </div>
      </section>

      {/* Scroll 3D Section */}
      <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
        <div className="sticky top-0 h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* LEFT: 3D Model placeholder (rotates with scroll) */}
          <div className="relative h-full flex items-center justify-center">
            <motion.div
              style={{ rotateY: rotation, rotateX: tilt, y: lift }}
              className="w-[300px] h-[300px] flex items-center justify-center"
            >
              <div className="w-48 h-32 relative" style={{ transformStyle: 'preserve-3d', perspective: 800 }}>
                {/* Glasses mock */}
                <svg viewBox="0 0 300 120" className="w-full h-auto">
                  <defs><linearGradient id="og3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FF6B1A" /><stop offset="1" stopColor="#E55100" /></linearGradient></defs>
                  <path d="M120 55 Q150 35 180 55" stroke="url(#og3)" strokeWidth="2.5" fill="none" />
                  <ellipse cx="80" cy="60" rx="48" ry="38" stroke="url(#og3)" strokeWidth="2.5" fill="rgba(255,107,26,0.04)" />
                  <ellipse cx="220" cy="60" rx="48" ry="38" stroke="url(#og3)" strokeWidth="2.5" fill="rgba(255,107,26,0.04)" />
                  <path d="M32 50 L8 42" stroke="url(#og3)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M268 50 L292 42" stroke="url(#og3)" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="150" cy="42" r="4" fill="url(#og3)" />
                  <circle cx="150" cy="42" r="7" stroke="url(#og3)" strokeWidth="1" fill="none" opacity="0.5" />
                </svg>
              </div>
            </motion.div>

            {/* Floating badges */}
            {['Wake Word', 'Camera', 'AI Engine', 'Translation', 'Speaker'].map((label, i) => (
              <motion.div
                key={label}
                className="absolute glass border border-[rgba(255,255,255,0.18)] rounded-2xl px-5 py-3 flex items-center gap-2.5"
                style={{ opacity: activeStep === i ? 1 : 0, transition: 'opacity 0.6s',
                  top: `${[20, 30, 50, 30, 20][i]}%`, left: `${[15, 70, 10, 72, 18][i]}%` }}
              >
                <span className="w-2 h-2 rounded-full bg-[#FF6B1A]" style={{ boxShadow: '0 0 8px rgba(255,107,26,0.4)' }} />
                <div><div className="text-[0.65rem] text-[#8B8B9A] uppercase tracking-wider">{label}</div><div className="font-semibold text-sm">{['Active', 'Capturing', 'Processing', 'Bhashini', 'Speaking'][i]}</div></div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: Steps */}
          <div className="p-0 8vw 0 4vw relative flex items-center">
            <div className="w-full max-w-[460px]">
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{ opacity: activeStep === i ? 1 : 0, transform: activeStep === i ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                >
                  <div className="font-mono text-xs text-[#FF6B1A] tracking-widest mb-5">{step.num}</div>
                  <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight leading-tight mb-4">{step.title}</h2>
                  <p className="text-[#9999AA] text-base leading-relaxed mb-5">{step.desc}</p>
                  <span className="inline-flex items-center gap-2 glass border border-[rgba(255,255,255,0.10)] px-4 py-2 rounded-full text-xs font-mono text-[#FF8533]">
                    {step.tech}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="fixed left-10 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <div className="w-[3px] h-60 bg-[rgba(255,255,255,0.08)] rounded-full relative">
          <motion.div className="w-full bg-gradient-to-b from-[#FF6B1A] to-[#FF8533] rounded-full" style={{ height: scrollYProgress.get() * 100 + '%', boxShadow: '0 0 12px rgba(255,107,26,0.4)' }} />
          {[0, 25, 50, 75, 100].map((pos, i) => (
            <div key={i} className={`absolute -left-[7px] w-[17px] h-[17px] rounded-full border-2 transition-all ${activeStep >= i ? 'border-[#FF6B1A] bg-[#FF6B1A]' : 'border-[rgba(255,255,255,0.15)] bg-[var(--bg)]'}`} style={{ top: `${pos}%` }} />
          ))}
        </div>
      </div>

      {/* Outro */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-32 relative z-10">
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-[700px] p-20 rounded-[40px] glass text-center"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,26,0.12), transparent 60%), var(--glass)' }}>
          <h2 className="font-display font-bold text-[clamp(2rem,4vw,3.2rem)] tracking-tight mb-5">That's <span className="gradient-text">ARGES.</span></h2>
          <p className="text-[#9999AA] mb-9 text-lg">Voice in. Answer out. Under 1.5 seconds. Fully offline core AI. Built for India.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/signup" className="px-9 py-4 rounded-full font-semibold bg-[#FF6B1A] text-black" style={{ boxShadow: '0 8px 32px rgba(255,107,26,0.4)' }}>Get ARGES →</Link>
            <Link to="/" className="px-9 py-4 rounded-full font-medium text-white border border-[rgba(255,255,255,0.22)] glass">Back to Home</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
