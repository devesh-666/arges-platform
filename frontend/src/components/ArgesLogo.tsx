export function ArgesLogo({ size = 26, color = 'var(--accent)' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ flexShrink: 0, filter: `drop-shadow(0 0 8px ${color}66)` }}>
      <path
        d="M50 28 C28 28 14 50 14 50 C14 50 28 72 50 72 C72 72 86 50 86 50 C86 50 72 28 50 28 Z"
        stroke={color} strokeWidth="3" fill="none"
      />
      <circle cx="50" cy="50" r="9" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="3.5" fill={color} />
    </svg>
  );
}
