/**
 * The ARGES mark — the bolt+eye emblem from the official logo
 * (assets/Arges_logo.png, background-removed variant). Icon only; wordmarks
 * render as text next to it so the mark stays legible at nav sizes.
 */
export function ArgesLogo({ size = 26 }: { size?: number; color?: string }) {
  return (
    <img
      src="/logo-mark.png"
      alt=""
      width={size}
      aria-hidden="true"
      style={{ width: size, height: 'auto', display: 'block', flexShrink: 0 }}
    />
  );
}
