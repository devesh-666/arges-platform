import { Variants } from 'framer-motion';

/** Standard ease curve used across all ARGES animations */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Fade up on scroll reveal */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

/** Stagger container — children reveal in sequence */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/** Blur text — words start blurred + slide up, then sharpen */
export const blurText: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 30 },
  visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Scale in — for badges, pills, small elements */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

/** Slide in from left (sidebar, drawers) */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Slide in from right (modals, panels) */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Page transition between routes */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

/** Modal entrance (spring bounce) */
export const modalSpring: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
};

/** Hero line reveal (each line rises from behind a mask) */
export const heroLine: Variants = {
  hidden: { y: '110%' },
  visible: { y: 0, transition: { duration: 1.2, ease: EASE } },
};

/** Splash letter (staggered) */
export const splashLetter: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12 } },
};

/** Bar chart grow */
export const barGrow: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.8, ease: EASE } },
};

/** While hovering — magnetic button lift */
export const magneticHover = {
  whileHover: { scale: 1.03, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

/** While hovering — card lift */
export const cardHover = {
  whileHover: { y: -8, transition: { duration: 0.4, ease: EASE } },
};
