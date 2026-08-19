import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';

/**
 * A video whose playhead is driven by scroll position rather than time.
 *
 * The file is user-supplied and arrives later, so this must degrade well:
 * if `src` is missing, 404s, or the codec will not decode, we fall back to
 * the poster and the section still reads correctly. Nothing here throws.
 *
 * Two details that matter:
 *
 * - Seeking is coalesced through requestAnimationFrame. Assigning
 *   `currentTime` on every scroll event queues seeks faster than the
 *   decoder retires them, which stutters badly on mobile Safari.
 * - `prefers-reduced-motion` disables scrubbing entirely and shows a
 *   still frame. Motion tied to scroll is exactly what that setting is
 *   meant to suppress.
 */
export function ScrubVideo({
  src,
  poster,
  progress,
  className = '',
}: {
  src: string;
  poster: string;
  progress: MotionValue<number>;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [usable, setUsable] = useState(false);
  const raf = useRef(0);
  const target = useRef(0);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The loadedmetadata event can beat React's handler to the punch (preload
  // satisfies from cache before the prop binds), leaving a ready element that
  // never flips `usable`. Recover by checking the element's current state on
  // mount — HAVE_METADATA means the event already fired.
  useEffect(() => {
    const v = videoRef.current;
    if (v && v.readyState >= 1 && v.duration && !Number.isNaN(v.duration)) {
      setUsable(true);
    }
  }, []);

  useEffect(() => {
    if (reduced || !usable) return;
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      raf.current = 0;
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;
      const next = Math.min(duration - 0.05, Math.max(0, target.current * duration));
      // Skip sub-frame seeks; they cost a decode and change nothing visible.
      if (Math.abs(video.currentTime - next) > 1 / 30) {
        try {
          video.currentTime = next;
        } catch {
          /* seek can throw while the element is still loading — ignore */
        }
      }
    };

    const unsubscribe = progress.on('change', (v) => {
      target.current = v;
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    });

    return () => {
      unsubscribe();
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [progress, usable, reduced]);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: usable && !reduced ? 0 : 1,
          transition: 'opacity 600ms var(--ease)',
          filter: 'saturate(0.7) contrast(1.1)',
        }}
      />
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          if (v.duration && !Number.isNaN(v.duration)) setUsable(true);
        }}
        onCanPlay={() => setUsable(true)}
        onError={() => setUsable(false)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: usable && !reduced ? 1 : 0,
          transition: 'opacity 600ms var(--ease)',
        }}
      />
      {/* Vignette — keeps overlaid type legible regardless of the frame beneath. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 45%, transparent 30%, rgba(8,8,12,0.55) 75%, var(--canvas) 100%)',
        }}
      />
    </div>
  );
}
