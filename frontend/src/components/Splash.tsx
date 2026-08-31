import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Safety net only. The splash normally ends on the video's own `ended` event,
 * so the film always plays to its last frame. This just guarantees the overlay
 * can never strand someone if `ended` never fires (a decode stall, a browser
 * that refuses to start playback at all). Comfortably longer than the 10s clip.
 */
const FALLBACK_MS = 14000;
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
 * There is no skip control and no click-to-dismiss: the film is meant to play
 * through. Escape still works — a fullscreen overlay with no exit at all is a
 * trap for anyone who needs to get past it — but it is deliberately silent.
 *
 * Reduced-motion bypasses the splash entirely.
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
    timers.current.push(window.setTimeout(dismiss, FALLBACK_MS));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);

    // If the browser refuses muted autoplay, the fallback timer ends the splash
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
    <div className={`splash${leaving ? ' is-leaving' : ''}`} role="presentation">
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
    </div>
  );
}
