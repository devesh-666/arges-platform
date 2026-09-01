import { useEffect, useRef, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/** The drifting light behind everything. Pure CSS animation — see aurora.css. */
export function AuroraField() {
  return (
    <div className="au-field" aria-hidden="true">
      <div className="au-blob au-blob-1" />
      <div className="au-blob au-blob-2" />
      <div className="au-blob au-blob-3" />
    </div>
  );
}

/**
 * Pointer position normalised to -0.5…0.5 from the viewport centre, spring
 * smoothed.
 *
 * One listener on the window feeding shared motion values, rather than a
 * listener per parallax layer. With a dozen layers the per-layer approach
 * costs a dozen handlers and a dozen re-renders on every mouse move.
 */
export function usePointer() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // touch: no parallax
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y]);

  return { px: sx, py: sy };
}

/**
 * A layer that drifts with the pointer.
 *
 * `depth` is how far it moves in pixels at the edge of the screen. Keep
 * foreground layers small (8–20) and background layers larger (30–60): the
 * illusion comes from the DIFFERENCE between layers, and pushing any single
 * one too far just reads as a wobble.
 */
export function ParallaxLayer({
  children, depth = 20, px, py, className = '', style,
}: {
  children: ReactNode;
  depth?: number;
  px: ReturnType<typeof usePointer>['px'];
  py: ReturnType<typeof usePointer>['py'];
  className?: string;
  style?: CSSProperties;
}) {
  const tx = useTransform(px, (v) => v * depth * -2);
  const ty = useTransform(py, (v) => v * depth * -2);
  return (
    <motion.div className={className} style={{ x: tx, y: ty, ...style }}>
      {children}
    </motion.div>
  );
}

/**
 * A clay tile that tilts toward the pointer in real 3D.
 *
 * Rotation is capped at 9 degrees. Past roughly 12 the perspective distortion
 * becomes obvious and the surface stops reading as a solid object.
 */
export function ClayTile({
  children, className = '', style, glowColor = 'rgba(255,107,26,0.35)',
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    ry.set(dx * 18);
    rx.set(-dy * 18);
    // Feed the pointer position to the CSS spotlight.
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const reset = () => { rx.set(0); ry.set(0); setHover(false); };

  return (
    <motion.div
      ref={ref}
      className={`au-clay ${className}`}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={reset}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        boxShadow: hover
          ? `22px 22px 54px rgba(0,0,0,0.7), -12px -12px 40px rgba(255,255,255,0.028), 0 0 60px ${glowColor}, inset 1.5px 1.5px 2px rgba(255,255,255,0.07), inset -1.5px -1.5px 2px rgba(0,0,0,0.55)`
          : undefined,
        ...style,
      }}
    >
      {/* Spotlight following the cursor across the surface. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: hover ? 1 : 0,
          transition: 'opacity 500ms var(--au-ease)',
          background: 'radial-gradient(340px circle at var(--mx) var(--my), rgba(255,255,255,0.055), transparent 70%)',
        }}
      />
      <div style={{ position: 'relative', transform: 'translateZ(28px)' }}>{children}</div>
    </motion.div>
  );
}

/** A glass panel. Same tilt treatment, lighter touch. */
export function GlassCard({
  children, className = '', style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 20 });
  const sry = useSpring(ry, { stiffness: 160, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };

  return (
    <motion.div
      ref={ref}
      className={`au-glass ${className}`}
      onMouseMove={onMove}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000, ...style }}
    >
      {children}
    </motion.div>
  );
}
