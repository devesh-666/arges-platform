import { useCallback, useEffect, useRef, useState } from 'react';

/** Cut the intro here — the phoenix is fully formed and lit by ~4s, then holds. */
const CUT_AT_MS = 5000;
const FADE_MS = 700;

/** Set to false to replay the intro on every page load (useful when demoing). */
const ONCE_PER_SESSION = true;
const SESSION_KEY = 'arges-splash';

/**
 * Fullscreen video splash built on `public/media/logo-intro.mp4` — the phoenix
 * logo forming out of a binary field. The published asset has already had the
 * Gemini sparkle watermark erased (ffmpeg `delogo` over the 72x72 mark at
 * 1704,864), so the video needs no cropping to hide it.
 *
 * Skippable by click, Escape/Enter/Space, or the focusable Skip control.
 * Reduced-motion bypasses it entirely. A blocked autoplay does NOT bypass it —
 * the cut timer still runs, so a browser that refuses to start the video shows
 * a brief black hold rather than a splash that flickers out instantly.
 */
export function Splash() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (!ONCE_PER_SESSION) return true;
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true; // private mode — just play it
    }
  });
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dismissed = useRef(false);
  const timers = useRef<number[]>([]);

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    setLeaving(true);
    timers.current.push(window.setTimeout(() => setShow(false), FADE_MS));
  }, []);

  useEffect(() => {
    if (!show) return;
    if (ONCE_PER_SESSION) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
    }

    document.body.style.overflow = 'hidden';
    timers.current.push(window.setTimeout(dismiss, CUT_AT_MS));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') dismiss();
    };
    window.addEventListener('keydown', onKey);

    // If the browser refuses muted autoplay, let the cut timer end the splash
    // rather than tearing it down the instant the promise rejects.
    videoRef.current?.play().catch(() => {});

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
