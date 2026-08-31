import { useCallback, useEffect, useRef, useState } from 'react';

/** Cut the intro here — the phoenix is fully formed and lit by ~4s, then just holds. */
const CUT_AT_MS = 5000;
const FADE_MS = 700;
const SESSION_KEY = 'arges-splash';

/**
 * Fullscreen video splash built on `public/media/logo-intro.mp4` — the phoenix
 * logo forming out of a binary field. The published asset has already had the
 * Gemini sparkle watermark erased (ffmpeg `delogo` over the 72x72 mark at
 * 1704,864); the `.splash-video` overscan below is belt-and-braces so the frame
 * edge never shows on odd aspect ratios.
 *
 * Plays once per browser session, auto-cuts at CUT_AT_MS, and is skippable by
 * click, Escape, or the focusable Skip control. Reduced-motion and load
 * failures bypass it entirely rather than trapping anyone behind a video.
 */
export function Splash() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return false;
    } catch {
      /* private mode — just play it */
    }
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);

  const dismiss = useCallback(() => {
    setLeaving((already) => {
      if (already) return already;
      timers.current.push(window.setTimeout(() => setShow(false), FADE_MS));
      return true;
    });
  }, []);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }

    document.body.style.overflow = 'hidden';
    timers.current.push(window.setTimeout(dismiss, CUT_AT_MS));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') dismiss();
    };
    window.addEventListener('keydown', onKey);

    // Some browsers reject muted autoplay in low-power mode — don't strand the user.
    videoRef.current?.play().catch(() => dismiss());

    const captured = timers.current;
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      captured.forEach(clearTimeout);
    };
  }, [show, dismiss]);

  if (!show) return null;

  return (
    <div
      className={`splash${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-label="ARGES intro"
      onClick={dismiss}
    >
      <video
        ref={videoRef}
        className="splash-video"
        src="/media/logo-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onEnded={dismiss}
        onError={dismiss}
      />
      <button type="button" className="splash-skip" onClick={dismiss}>
        Skip intro
      </button>
    </div>
  );
}
