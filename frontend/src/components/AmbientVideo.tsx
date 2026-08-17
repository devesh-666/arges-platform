import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

/**
 * A looping, muted, decorative clip.
 *
 * The counterpart to ScrubVideo: that one is seeked by scroll, this one just
 * plays. Both share the same contract — the file is user-supplied and may not
 * exist, so nothing here throws and nothing renders broken. Until a clip
 * lands, `variant="background"` paints a soft ambient wash and
 * `variant="inline"` shows a hairline frame, both of which read as intentional
 * rather than as a missing asset.
 *
 * Under `prefers-reduced-motion` the video never plays. An autoplaying loop is
 * precisely the kind of unrequested motion that setting exists to stop, so we
 * hold the poster instead.
 */
export function AmbientVideo({
  src,
  poster,
  variant = 'background',
  vignette = true,
  className = '',
  style,
}: {
  src: string;
  poster?: string;
  variant?: 'background' | 'inline';
  vignette?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playable, setPlayable] = useState(false);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!playable || reduced) return;
    const v = ref.current;
    if (!v) return;
    // Autoplay can still be refused (power saving, background tab). It is
    // decorative, so a rejection is not an error — the poster simply stays.
    void v.play().catch(() => {});
  }, [playable, reduced]);

  const visible = playable && !reduced;

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: variant === 'background' ? 'absolute' : 'relative',
        inset: variant === 'background' ? 0 : undefined,
        width: '100%',
        height: variant === 'background' ? '100%' : undefined,
        aspectRatio: variant === 'inline' ? '2.39 / 1' : undefined,
        overflow: 'hidden',
        borderRadius: variant === 'inline' ? 'var(--radius)' : undefined,
        border: variant === 'inline' ? '1px solid var(--hairline)' : undefined,
        // The stand-in. A faint off-centre amber wash over the canvas, which
        // matches the palette the finished clips are graded to.
        background:
          'radial-gradient(120% 100% at 70% 30%, rgba(255,107,26,0.10), transparent 60%), var(--canvas-soft)',
        ...style,
      }}
    >
      {poster && (
        <img
          src={poster}
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: visible ? 0 : 1,
            transition: 'opacity 600ms var(--ease)',
            filter: 'saturate(0.7) contrast(1.1)',
          }}
        />
      )}

      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
        onLoadedData={() => setPlayable(true)}
        onError={() => setPlayable(false)}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: visible ? 1 : 0,
          transition: 'opacity 800ms var(--ease)',
        }}
      />

      {vignette && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              variant === 'background'
                ? 'radial-gradient(110% 80% at 50% 50%, transparent 25%, rgba(8,8,12,0.72) 72%, var(--canvas) 100%)'
                : 'linear-gradient(180deg, transparent 55%, rgba(8,8,12,0.55) 100%)',
          }}
        />
      )}
    </div>
  );
}
