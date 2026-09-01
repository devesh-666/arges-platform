import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '../animations/obsidian';

/**
 * The logo intro, played once per browser session over a black veil.
 *
 * The clip (public/media/arges-intro.mp4) is 10s of the ARGES emblem
 * assembling on black, so the veil it fades out from is the same near-black
 * as the canvas — the reveal reads as one continuous surface, not a modal
 * being dismissed.
 *
 * Escape, click, or the end of the clip dismisses it. It never shows under
 * `prefers-reduced-motion`, and sessionStorage keeps it from replaying on
 * every route change or refresh inside the same tab.
 */
export function IntroSplash() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem('arges-intro-seen');
    } catch {
      return false;
    }
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!show) return;

    const dismiss = () => {
      try {
        sessionStorage.setItem('arges-intro-seen', '1');
      } catch {
        /* private mode — it will just replay next session */
      }
      setShow(false);
    };

    // Mark it seen immediately: a refresh mid-intro should not restart it.
    try {
      sessionStorage.setItem('arges-intro-seen', '1');
    } catch {
      /* ignore */
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dismiss();
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);

    const v = videoRef.current;
    v?.addEventListener('ended', dismiss);

    // React renders `muted` as an attribute but never sets the DOM property,
    // so autoplay is rejected as "not muted" in Chromium. Set it properly and
    // start playback ourselves.
    const kick = () => {
      if (!v) return;
      v.muted = true;
      v.play().catch(() => {});
    };
    kick();
    const watchdog = window.setTimeout(() => {
      if (v && v.paused) v.play().catch(() => dismiss());
    }, 1200);

    // If the video can never play (file missing, codec), don't hold the
    // site hostage behind a black screen.
    const failTimer = window.setTimeout(() => {
      if (!v || v.readyState < 2) dismiss();
    }, 4000);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      v?.removeEventListener('ended', dismiss);
      window.clearTimeout(watchdog);
      window.clearTimeout(failTimer);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-label="ARGES introduction"
          onClick={() => setShow(false)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: '#050508',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <video
            ref={videoRef}
            src="/media/arges-intro.mp4"
            autoPlay
            muted
            playsInline
            onError={() => setShow(false)}
            onEnded={() => setShow(false)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShow(false);
            }}
            className="mono"
            aria-label="Skip introduction"
            style={{
              position: 'absolute',
              right: 'var(--s5)',
              bottom: 'var(--s5)',
              background: 'none',
              border: '1px solid var(--hairline)',
              borderRadius: 999,
              color: 'var(--mute)',
              padding: '8px 18px',
              fontSize: '0.75rem',
              letterSpacing: '+0.14em',
              cursor: 'pointer',
            }}
          >
            SKIP →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
