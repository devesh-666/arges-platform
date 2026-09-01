import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { rise, riseGroup, hairlineDraw, charGroup, charItem, inView, accentIgnite } from '../animations/obsidian';

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
  // Group by word, then animate characters INSIDE each word.
  //
  // Animating a flat list of characters is the obvious implementation and it
  // is broken: every character becomes its own inline-block, and a browser may
  // line-break between any two inline-blocks. So a heading wraps mid-word —
  // "insi" on one line, "de." on the next — with no word boundary protecting
  // it. Wrapping each word in a nowrap box makes the word atomic again, and
  // the plain space rendered between those boxes is what stays breakable.
  const words = text.split(' ');

  return (
    <motion.span
      className={className}
      variants={charGroup}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi}>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {/* Array.from, not split(''), so emoji and accented pairs are not
                torn in half into broken code units. */}
            {Array.from(word).map((c, ci) => (
              <motion.span
                key={ci}
                variants={charItem}
                aria-hidden="true"
                style={{ display: 'inline-block' }}
              >
                {c}
              </motion.span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </span>
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

/** The ARGES mark — the bolt+eye emblem from the official logo
 * (assets/Arges_logo.png, background-removed variant). Icon only; wordmarks
 * render as text next to it, so the mark stays legible at nav sizes.
 *
 * The emblem is wider than tall (512×358), so `size` is a HEIGHT — sizing
 * by width shrank it to ~17px beside 17px type and the mark read as an
 * afterthought instead of the brand. */
export function Logo({ size = 26 }: { size?: number; color?: string }) {
  return (
    <img
      src="/logo-mark.png"
      alt=""
      height={size}
      aria-hidden="true"
      style={{ height: size, width: 'auto', display: 'block' }}
    />
  );
}
