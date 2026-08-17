import type { Variants, Transition } from 'framer-motion';

/**
 * OBSIDIAN MOTION
 *
 * None of the 74 specs in awesome-design-md define motion — they stop at
 * colour, type and surface. So this is designed for ARGES rather than
 * sourced, and it is deliberately small: five primitives that compose,
 * instead of a per-component menagerie.
 *
 * Two rules that are easy to break and expensive to debug:
 *
 * 1. Scroll-TIED motion must be linear. An ease curve on a value driven by
 *    scrollYProgress fights the scrollbar — the element lags the thumb and
 *    the page feels broken rather than smooth. EASE is for time-driven
 *    motion only.
 * 2. Orange arrives LATE. Accent elements animate in after the content they
 *    mark, which is what makes the colour read as voltage rather than
 *    decoration. See `accentIgnite`.
 */

/** The single curve. Time-driven motion only — never scroll-tied. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Duration ladder, in seconds. */
export const T = {
  micro: 0.12,
  element: 0.42,
  section: 0.72,
  cinematic: 1.2,
} as const;

const ease = EASE as unknown as Transition['ease'];

/** 1 — `rise`. The default entrance for essentially everything. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: T.element, ease } },
};

/** Stagger parent for `rise` children. */
export const riseGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/**
 * 2 — `maskWipe`. A clip-path reveal, so the headline appears to be printed
 * rather than faded in. Pair with an `overflow: hidden` wrapper.
 */
export const maskWipe: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
  visible: { clipPath: 'inset(0 0% 0 0)', transition: { duration: T.section, ease } },
};

/** Line variant — rises from behind its own mask. */
export const maskLine: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: T.cinematic, ease } },
};

/**
 * 3 — `charCascade`. Per-character reveal. Expensive to read and expensive
 * to render: one per page, on the hero display only.
 */
export const charGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.022, delayChildren: 0.08 } },
};

export const charItem: Variants = {
  hidden: { opacity: 0, y: '0.5em' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/** 4 — `hairlineDraw`. Every band divider draws itself left-to-right. */
export const hairlineDraw: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: T.section, ease } },
};

/**
 * 5 — `accentIgnite`. The orange arrives 200ms after its content. This delay
 * is the whole point of the primitive — remove it and the accent stops
 * reading as voltage.
 */
export const accentIgnite: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: T.element, ease, delay: 0.2 },
  },
};

/** Standard viewport config — reveal once, slightly before fully in view. */
export const inView = { once: true, margin: '-12% 0px -12% 0px' } as const;

/** Split a string into character spans for `charGroup` / `charItem`.
 *  Spaces become non-breaking so words do not collapse mid-cascade. */
export function chars(text: string): string[] {
  return text.split('').map((c) => (c === ' ' ? ' ' : c));
}
