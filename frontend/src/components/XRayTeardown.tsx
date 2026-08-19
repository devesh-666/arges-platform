import { motion } from 'framer-motion';

/**
 * The teardown, drawn from blueprints/blueprint_05_internal.png.
 *
 * Every part, dimension and position here is taken from that blueprint — it is
 * a real bill of materials, not decoration. If the hardware changes, this file
 * changes with it. The layout mirrors the blueprint's own flat
 * "temples-extended" projection (~174mm) rather than inventing a perspective
 * view, so the two can be compared side by side.
 *
 * Obsidian is single-voltage, so parts are NOT colour-coded by category the way
 * the blueprint is. A live part is orange, a dormant one is a hairline, and
 * category lives in the label instead.
 *
 * The diagram is deliberately layered rather than flat — glow on live parts,
 * inline specs, a slow scan sweep and dimension ticks — because an outline of
 * rectangles on its own reads as a wireframe rather than as a product.
 */

export type Zone = 'left' | 'front' | 'right';

export const ZONES: { id: Zone; label: string; note: string }[] = [
  { id: 'left',  label: 'Left temple',  note: 'Power and audio' },
  { id: 'front', label: 'Front frame',  note: 'Capture' },
  { id: 'right', label: 'Right temple', note: 'Compute and sensing' },
];

type Part = {
  zone: Zone;
  name: string;
  spec: string;
  short: string;
  category: string;
  x: number; y: number; w: number; h: number;
};

export const PARTS: Part[] = [
  // Left temple — power and audio
  { zone: 'left',  name: 'USB-C',        spec: 'Charge port',                       short: '',            category: 'Power',   x: 36,  y: 138, w: 20,  h: 28 },
  { zone: 'left',  name: 'LiPo battery', spec: '3000mAh · 3.7V · 50×30×8mm',        short: '3000mAh',     category: 'Power',   x: 64,  y: 104, w: 112, h: 62 },
  { zone: 'left',  name: 'Speaker',      spec: '3W · 28×28mm',                      short: '3W',          category: 'Audio',   x: 186, y: 110, w: 52,  h: 52 },
  { zone: 'left',  name: 'MAX98357',     spec: 'Class-D amplifier',                 short: '',            category: 'Audio',   x: 64,  y: 172, w: 64,  h: 28 },
  { zone: 'left',  name: 'TP4056',       spec: 'Charge controller',                 short: '',            category: 'Power',   x: 138, y: 172, w: 76,  h: 28 },

  // Front frame — capture
  { zone: 'front', name: 'SPH0645',      spec: 'I²S MEMS microphone',               short: '',            category: 'Sensing', x: 322, y: 132, w: 44,  h: 42 },
  { zone: 'front', name: 'Camera',       spec: 'Snap-fit pocket · 25×24×9mm',       short: '25×24×9',     category: 'Capture', x: 390, y: 112, w: 110, h: 80 },
  { zone: 'front', name: 'Wire channel', spec: 'Loose-loop silicone across hinges', short: '',            category: 'Wiring',  x: 520, y: 140, w: 62,  h: 26 },

  // Right temple — compute and sensing
  { zone: 'right', name: 'Pi Zero 2 W',  spec: 'The brain · 65×30×5mm',             short: '65×30×5',     category: 'Compute', x: 622, y: 104, w: 140, h: 62 },
  { zone: 'right', name: 'NEO-6M',       spec: 'GPS · antenna faces up',            short: 'GPS',         category: 'Sensing', x: 776, y: 104, w: 80,  h: 62 },
  { zone: 'right', name: 'ADXL345',      spec: 'Fall detection',                    short: '',            category: 'Sensing', x: 622, y: 172, w: 64,  h: 28 },
  { zone: 'right', name: 'Switch',       spec: 'Power',                             short: '',            category: 'Power',   x: 696, y: 172, w: 56,  h: 28 },
];

const SHELL = [
  { id: 'left'  as Zone, x: 30,  y: 92, w: 262, h: 120, rx: 12 },
  { id: 'front' as Zone, x: 300, y: 74, w: 300, h: 156, rx: 16 },
  { id: 'right' as Zone, x: 610, y: 92, w: 262, h: 120, rx: 12 },
];

/** The loose-loop wire run described in the blueprint's assembly notes. */
const TRACE = 'M 796 208 H 620 c -10 0 -12 6 -20 6 H 320 c -8 0 -10 -6 -20 -6 H 96';

const EASE = [0.16, 1, 0.3, 1] as const;

export function XRayTeardown({ active, showAll = false }: { active: Zone | null; showAll?: boolean }) {
  const isLit = (z: Zone) => showAll || active === z;
  const anyLit = showAll || active !== null;

  return (
    <svg
      viewBox="0 0 900 300"
      role="img"
      aria-label="Cutaway of the ARGES glasses showing internal components across the left temple, front frame and right temple."
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
    >
      <defs>
        <filter id="xray-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="scan" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Shell. Dims once anything inside is live, so the housing reads as
          transparent rather than simply gone. */}
      {SHELL.map((s) => (
        <motion.rect
          key={s.id}
          x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx}
          fill="none"
          stroke="var(--hairline-hi)"
          strokeWidth={1.25}
          animate={{ opacity: anyLit ? (isLit(s.id) ? 0.8 : 0.14) : 0.55 }}
          transition={{ duration: 0.75, ease: EASE }}
        />
      ))}

      {/* Lens apertures and bridge — orientation cues, so the flat projection
          still reads as a pair of glasses rather than three boxes. */}
      {[372, 528].map((cx) => (
        <circle key={cx} cx={cx} cy={152} r={34} fill="none" stroke="var(--hairline)" strokeWidth={1} opacity={0.45} />
      ))}
      <path d="M 406 148 q 44 -14 88 0" fill="none" stroke="var(--hairline)" strokeWidth={1} opacity={0.4} />

      {/* Hinges */}
      {[296, 604].map((x) => (
        <g key={x} opacity={0.55}>
          <line x1={x} y1={136} x2={x} y2={168} stroke="var(--hairline-hi)" strokeWidth={1.25} />
          <circle cx={x} cy={152} r={3} fill="var(--hairline-hi)" />
        </g>
      ))}

      {/* Signal trace along the real wire channel */}
      <path d={TRACE} fill="none" stroke="var(--hairline)" strokeWidth={1} opacity={0.45} />
      <motion.path
        d={TRACE}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="14 210"
        filter="url(#xray-glow)"
        initial={{ strokeDashoffset: 0, opacity: 0 }}
        animate={anyLit ? { strokeDashoffset: [0, -672], opacity: 0.9 } : { opacity: 0 }}
        transition={{
          strokeDashoffset: { duration: 3.6, ease: 'linear', repeat: Infinity },
          opacity: { duration: 0.7, ease: EASE },
        }}
      />

      {/* A slow sweep across the whole assembly. Gives the diagram a sense of
          being actively read rather than printed. */}
      <motion.rect
        y={70} width={110} height={160} fill="url(#scan)"
        initial={{ x: -110, opacity: 0 }}
        animate={anyLit ? { x: [-110, 900], opacity: 0.75 } : { opacity: 0 }}
        transition={{
          x: { duration: 6.5, ease: 'linear', repeat: Infinity, repeatDelay: 1.2 },
          opacity: { duration: 0.9, ease: EASE },
        }}
      />

      {/* Components */}
      {PARTS.map((part) => {
        const lit = isLit(part.zone);
        const roomy = part.w >= 76 && part.h >= 50;
        return (
          <g key={part.name}>
            <motion.rect
              x={part.x} y={part.y} width={part.w} height={part.h} rx={3}
              strokeWidth={1.25}
              animate={{
                stroke: lit ? 'var(--accent)' : 'var(--hairline-hi)',
                // No fill when lit — the accent stroke + label carry the
                // highlight. Filled boxes read as unwanted amber panels.
                fill: 'none',
                opacity: lit ? 1 : 0.35,
              }}
              transition={{ duration: 0.7, ease: EASE }}
              filter={lit ? 'url(#xray-glow)' : undefined}
            />

            <motion.text
              x={part.x + part.w / 2}
              y={part.y + part.h / 2 + (roomy && part.short ? -1 : 3)}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize={part.w < 60 ? 7 : 9}
              letterSpacing="0.06em"
              animate={{ fill: lit ? 'var(--accent-soft)' : 'var(--faint)', opacity: lit ? 1 : 0.5 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {part.name.toUpperCase()}
            </motion.text>

            {/* The measurement, revealed only while the zone is live. This is
                what turns a labelled box into a spec. */}
            {roomy && part.short && (
              <motion.text
                x={part.x + part.w / 2}
                y={part.y + part.h / 2 + 12}
                textAnchor="middle"
                fontFamily="var(--mono)"
                fontSize={7}
                letterSpacing="0.1em"
                fill="var(--accent)"
                animate={{ opacity: lit ? 0.85 : 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: lit ? 0.12 : 0 }}
              >
                {part.short.toUpperCase()}
              </motion.text>
            )}
          </g>
        );
      })}

      {/* Zone brackets — appear under the live zone only */}
      {SHELL.map((s) => (
        <motion.g key={`b-${s.id}`} animate={{ opacity: isLit(s.id) && !showAll ? 0.9 : 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <line x1={s.x} y1={s.y + s.h + 10} x2={s.x + s.w} y2={s.y + s.h + 10} stroke="var(--accent)" strokeWidth={1} />
          <line x1={s.x} y1={s.y + s.h + 6} x2={s.x} y2={s.y + s.h + 14} stroke="var(--accent)" strokeWidth={1} />
          <line x1={s.x + s.w} y1={s.y + s.h + 6} x2={s.x + s.w} y2={s.y + s.h + 14} stroke="var(--accent)" strokeWidth={1} />
        </motion.g>
      ))}

      {/* Overall dimension, straight off the blueprint */}
      <g opacity={0.45}>
        <line x1={30} y1={262} x2={872} y2={262} stroke="var(--hairline-hi)" strokeWidth={1} />
        <line x1={30} y1={256} x2={30} y2={268} stroke="var(--hairline-hi)" strokeWidth={1} />
        <line x1={872} y1={256} x2={872} y2={268} stroke="var(--hairline-hi)" strokeWidth={1} />
        <text x={451} y={280} textAnchor="middle" fontFamily="var(--mono)" fontSize={9} letterSpacing="0.14em" fill="var(--mute)">
          ~174 MM · TEMPLES EXTENDED
        </text>
      </g>
    </svg>
  );
}
