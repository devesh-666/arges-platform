import { useEffect, useId, useRef } from 'react';
import type { CSSProperties } from 'react';

/**
 * Footage used as material, never as playback.
 *
 * Every component here takes a clip and turns it into something that is not a
 * video: light inside a lens, ink inside letterforms, a liquid shape. A visible
 * rectangular <video> would collapse the whole illusion into "a web page with a
 * video on it", so none of these ever expose one.
 *
 * These deliberately hold no ready-state: the element renders at full opacity
 * from the first frame and simply shows its dark container until the decoder
 * catches up. Gating visibility on a load event is what caused the earlier
 * race where a cache-satisfied preload fired before React bound its handler and
 * the clip stayed invisible forever. On a near-black ground there is nothing to
 * gate for.
 */

/** Shared bare video element. Autoplay is best-effort and never awaited. */
function Clip({ src, style, className }: { src: string; style?: CSSProperties; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Browsers refuse autoplay for reasons of their own (power saving,
    // background tab). These are decorative, so a rejection is not an error.
    void v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }}
    />
  );
}

/**
 * A glass lens with the footage magnified inside it.
 *
 * The magnification is the whole point. A blurred circle over a video reads as
 * frosted plastic; a circle showing the SAME scene at a larger scale reads as
 * an optic, because that is what lenses actually do to what is behind them.
 */
export function LiquidLens({
  src,
  size = 460,
  offsetX = 0,
  offsetY = 0,
  className = '',
  style,
}: {
  src: string;
  size?: number;
  offsetX?: number;
  offsetY?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`au-lens ${className}`}
      style={{
        width: size,
        height: size,
        maxWidth: '86vw',
        maxHeight: '86vw',
        transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
        ...style,
      }}
    >
      <Clip
        src={src}
        style={{
          position: 'absolute',
          inset: 0,
          // Magnified and slightly rotated so it never lines up with the
          // backdrop copy — near-registration reads as a rendering fault,
          // clear difference reads as optics.
          transform: 'scale(1.55) rotate(-4deg)',
          filter: 'saturate(1.25) contrast(1.08) brightness(1.12)',
        }}
      />
      {/* Inner shading, so the sphere has volume rather than being a hole. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.16), transparent 45%),' +
            'radial-gradient(circle at 50% 120%, rgba(0,0,0,0.72), transparent 55%)',
        }}
      />
    </div>
  );
}

/**
 * Footage poured into letterforms.
 *
 * Implemented as a knockout rather than `background-clip: text`, which cannot
 * take a video as its background. A solid rectangle in the page's ground colour
 * covers the clip, and the text is punched out of that rectangle via a mask —
 * so the only place the film shows is inside the glyphs.
 */
export function FilmText({
  src,
  text,
  ground = '#06060B',
  className = '',
}: {
  src: string;
  text: string;
  ground?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  // Rough advance width so the viewBox tracks the string length instead of
  // letterboxing short words into a huge box.
  const vw = Math.max(560, text.length * 108);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', lineHeight: 0 }} role="img" aria-label={text}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Clip src={src} style={{ transform: 'scale(1.2)', filter: 'saturate(1.5) contrast(1.15) brightness(1.3)' }} />
      </div>

      <svg viewBox={`0 0 ${vw} 210`} style={{ position: 'relative', width: '100%', height: 'auto', display: 'block' }} aria-hidden="true">
        <defs>
          <mask id={`knock-${id}`}>
            {/* White shows the covering rectangle; black punches the holes. */}
            <rect width="100%" height="100%" fill="#fff" />
            <text
              x="50%" y="53%"
              dominantBaseline="middle" textAnchor="middle"
              fill="#000"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="700"
              fontSize="150"
              letterSpacing="-6"
            >
              {text}
            </text>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill={ground} mask={`url(#knock-${id})`} />
      </svg>
    </div>
  );
}

/** Footage clipped to a slowly morphing organic shape — no straight edges. */
export function FilmBlob({
  src,
  className = '',
  style,
  scale = 1.1,
}: {
  src: string;
  className?: string;
  style?: CSSProperties;
  scale?: number;
}) {
  return (
    <div className={`au-blobmask ${className}`} style={{ position: 'relative', ...style }}>
      <Clip src={src} style={{ transform: `scale(${scale})`, filter: 'saturate(1.2) contrast(1.05)' }} />
      {/* Edge darkening so the blob sits in the page rather than on it. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(6,6,11,0.9) 100%)',
        }}
      />
    </div>
  );
}

/**
 * Footage as a light source behind a surface.
 *
 * Heavily blurred and screen-blended, so what reaches the page is the clip's
 * luminance rather than its content — the amber in the footage becomes the
 * glow lighting whatever sits on top.
 */
export function FilmGlow({
  src,
  opacity = 0.55,
  blur = 60,
  className = '',
  style,
}: {
  src: string;
  opacity?: number;
  blur?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', ...style }}
    >
      <Clip
        src={src}
        style={{
          transform: 'scale(1.3)',
          filter: `blur(${blur}px) saturate(2.2) brightness(1.35)`,
          opacity,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}
