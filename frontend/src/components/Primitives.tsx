import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { rise, riseGroup, hairlineDraw, charGroup, charItem, chars, inView, accentIgnite } from '../animations/obsidian';

/** Scroll-revealed block. The workhorse — wraps most content on the site. */
export function Reveal({ children, className = '', delay = 0, as = 'div' }: {
  children: ReactNode; className?: string; delay?: number; as?: 'div' | 'section' | 'li';
}) {
  const C = motion[as];
  return (
    <C
      className={className}
      variants={rise}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </C>
  );
}

/** Staggered group — children should be <Reveal> or motion elements using `rise`. */
export function RevealGroup({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={riseGroup} initial="hidden" whileInView="visible" viewport={inView}>
      {children}
    </motion.div>
  );
}

/** A hairline that draws itself. Separates every band. */
export function Rule({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`rule ${className}`}
      variants={hairlineDraw}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      role="presentation"
    />
  );
}

/**
 * Hero display type, revealed per character.
 * Deliberately limited to one per page — the effect stops reading as
 * craft and starts reading as noise when it repeats.
 *
 * The full string is exposed to assistive tech via aria-label while the
 * animated spans are hidden, so a screen reader hears one heading rather
 * than a stream of single letters.
 */
export function CharCascade({ text, className = '' }: { text: string; className?: string }) {
  return (
    <motion.span
      className={className}
      variants={charGroup}
      initial="hidden"
      animate="visible"
      aria-label={text}
      style={{ display: 'inline-block' }}
    >
      {chars(text).map((c, i) => (
        <motion.span key={i} variants={charItem} aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {c}
        </motion.span>
      ))}
    </motion.span>
  );
}

/** The accent arrives after its content — see `accentIgnite`. */
export function Ignite({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={accentIgnite} initial="hidden" whileInView="visible" viewport={inView}>
      {children}
    </motion.div>
  );
}

/** Mono eyebrow + display headline — the standard opening of every band. */
export function SectionHead({ eyebrow, title, lead, className = '' }: {
  eyebrow: string; title: ReactNode; lead?: string; className?: string;
}) {
  return (
    <div className={className}>
      <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
      <Reveal delay={0.06}>
        <h2 className="display-md" style={{ marginTop: 'var(--s4)', maxWidth: '18ch' }}>{title}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.12}>
          <p className="lead body-mute" style={{ marginTop: 'var(--s4)', maxWidth: '52ch' }}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/** The ARGES mark. Single path set, so it stays consistent everywhere. */
export function Logo({ size = 26, color = 'var(--accent)' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
      <path d="M50 28 C28 28 14 50 14 50 C14 50 28 72 50 72 C72 72 86 50 86 50 C86 50 72 28 50 28 Z"
        stroke={color} strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="9" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="3.5" fill={color} />
    </svg>
  );
}
