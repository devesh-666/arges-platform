import { motion } from 'framer-motion';

/**
 * The teardown, drawn from blueprints/blueprint_05_internal.png.
 *
 * Every part, dimension and position here is taken from that blueprint —
 * it is a real bill of materials, not decoration. If the hardware changes,
 * this file changes with it. The layout mirrors the blueprint's own flat
 * "temples extended" projection (~174mm across) rather than inventing a
 * perspective view, so the two can be compared side by side.
 *
 * Obsidian is single-voltage, so parts are NOT colour-coded by category the
 * way the blueprint is. An illuminated part is orange; a dormant one is a
 * hairline. Category lives in the label instead.
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
  category: string;
  x: number; y: number; w: number; h: number;
};

export const PARTS: Part[] = [
  // Left temple — power and audio
  { zone: 'left',  name: 'USB-C',        spec: 'Charge port',            category: 'Power',   x: 36,  y: 138, w: 20,  h: 28 },
  { zone: 'left',  name: 'LiPo battery', spec: '3000mAh · 3.7V · 50×30×8mm', category: 'Power', x: 64, y: 104, w: 112, h: 62 },
  { zone: 'left',  name: 'Speaker',      spec: '3W · 28×28mm',           category: 'Audio',   x: 186, y: 110, w: 52,  h: 52 },
  { zone: 'left',  name: 'MAX98357',     spec: 'Class-D amplifier',      category: 'Audio',   x: 64,  y: 172, w: 64,  h: 28 },
  { zone: 'left',  name: 'TP4056',       spec: 'Charge controller',      category: 'Power',   x: 138, y: 172, w: 76,  h: 28 },

  // Front frame — capture
  { zone: 'front', name: 'SPH0645',      spec: 'I²S MEMS microphone',    category: 'Sensing', x: 322, y: 132, w: 44,  h: 42 },
  { zone: 'front', name: 'Camera',       spec: 'Snap-fit pocket · 25×24×9mm', category: 'Capture', x: 390, y: 112, w: 110, h: 80 },
  { zone: 'front', name: 'Wire channel', spec: 'Loose-loop silicone across hinges', category: 'Wiring', x: 520, y: 140, w: 62, h: 26 },

  // Right temple — compute and sensing
  { zone: 'right', name: 'Pi Zero 2 W',  spec: 'The brain · 65×30×5mm',  category: 'Compute', x: 622, y: 104, w: 140, h: 62 },
  { zone: 'right', name: 'NEO-6M',       spec: 'GPS · antenna faces up', category: 'Sensing', x: 776, y: 104, w: 80,  h: 62 },
  { zone: 'right', name: 'ADXL345',      spec: 'Fall detection',         category: 'Sensing', x: 622, y: 172, w: 64,  h: 28 },
  { zone: 'right', name: 'Switch',       spec: 'Power',                  category: 'Power',   x: 696, y: 172, w: 56,  h: 28 },
];

const SHELL = [
  { id: 'left'  as Zone, x: 30,  y: 92, w: 262, h: 120, rx: 12 },
  { id: 'front' as Zone, x: 300, y: 74, w: 300, h: 156, rx: 16 },
  { id: 'right' as Zone, x: 610, y: 92, w: 262, h: 120, rx: 12 },
];

/** The loose-loop wire run described in the blueprint's assembly notes. */
const TRACE = 'M 796 208 H 620 c -10 0 -12 6 -20 6 H 320 c -8 0 -10 -6 -20 -6 H 96';

export function XRayTeardown({ active, showAll = false }: { active: Zone | null; showAll?: boolean }) {
  const isLit = (z: Zone) => showAll || active === z;

  return (
    <svg
      viewBox="0 0 900 300"
      role="img"
      aria-label="Cutaway of the ARGES glasses showing internal components across the left temple, front frame and right temple."
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
    >
      <defs>
        <filter id="xray-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Shell. Dims once anything inside is lit, so the housing reads as
          transparent rather than simply disappearing. */}
      {SHELL.map((s) => (
        <motion.rect
          key={s.id}
          x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx}
          fill="none"
          stroke="var(--hairline-hi)"
          strokeWidth={1.25}
          animate={{ opacity: active || showAll ? (isLit(s.id) ? 0.75 : 0.15) : 0.55 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      {/* Lens apertures — orientation cue so the flat projection still reads
          as a pair of glasses. */}
      {[372, 528].map((cx) => (
        <circle key={cx} cx={cx} cy={152} r={34} fill="none" stroke="var(--hairline)" strokeWidth={1} opacity={0.5} />
      ))}

      {/* Hinges */}
      {[296, 604].map((x) => (
        <g key={x} opacity={0.6}>
          <line x1={x} y1={138} x2={x} y2={166} stroke="var(--hairline-hi)" strokeWidth={1.25} />
          <circle cx={x} cy={152} r={3} fill="var(--hairline-hi)" />
        </g>
      ))}

      {/* Signal trace along the real wire channel. Dashes travel from the
          brain outward once every zone is lit. */}
      <path d={TRACE} fill="none" stroke="var(--hairline)" strokeWidth={1} opacity={0.5} />
      <motion.path
        d={TRACE}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="14 210"
        filter="url(#xray-glow)"
        initial={{ strokeDashoffset: 0, opacity: 0 }}
        animate={
          showAll || active
            ? { strokeDashoffset: [0, -672], opacity: 0.9 }
            : { opacity: 0 }
        }
        transition={{
          strokeDashoffset: { duration: 3.2, ease: 'linear', repeat: Infinity },
          opacity: { duration: 0.5 },
        }}
      />

      {/* Components */}
      {PARTS.map((p) => {
        const lit = isLit(p.zone);
        return (
          <g key={p.name}>
            <motion.rect
              x={p.x} y={p.y} width={p.w} height={p.h} rx={3}
              animate={{
                stroke: lit ? 'var(--accent)' : 'var(--hairline-hi)',
                fill: lit ? 'rgba(255,107,26,0.10)' : 'rgba(255,255,255,0.015)',
                opacity: lit ? 1 : 0.4,
              }}
              strokeWidth={1.25}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.text
              x={p.x + p.w / 2}
              y={p.y + p.h / 2 + 3}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize={p.w < 60 ? 7 : 9}
              letterSpacing="0.06em"
              animate={{ fill: lit ? 'var(--accent-soft)' : 'var(--faint)', opacity: lit ? 1 : 0.55 }}
              transition={{ duration: 0.5 }}
            >
              {p.name.toUpperCase()}
            </motion.text>
          </g>
        );
      })}

      {/* Overall dimension, straight off the blueprint */}
      <g opacity={0.5}>
        <line x1={30} y1={258} x2={872} y2={258} stroke="var(--hairline-hi)" strokeWidth={1} />
        <line x1={30} y1={252} x2={30} y2={264} stroke="var(--hairline-hi)" strokeWidth={1} />
        <line x1={872} y1={252} x2={872} y2={264} stroke="var(--hairline-hi)" strokeWidth={1} />
        <text x={451} y={276} textAnchor="middle" fontFamily="var(--mono)" fontSize={9} letterSpacing="0.14em" fill="var(--mute)">
          ~174 MM · TEMPLES EXTENDED
        </text>
      </g>
    </svg>
  );
}
