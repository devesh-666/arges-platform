import { useSpatialCursor } from '../hooks/useSpatialCursor';

export function Cursor() {
  const { dotRef, ringRef } = useSpatialCursor();

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6, borderRadius: '50%',
          background: '#fff', pointerEvents: 'none',
          zIndex: 99999, transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 30, height: 30, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.4)',
          pointerEvents: 'none', zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          transition: 'width 0.25s, height 0.25s, border-color 0.25s, background 0.25s',
        }}
      />
      <style>{`
        .cursor-ring:hover, .hover {
          width: 60px !important; height: 60px !important;
          border-color: var(--accent) !important;
          background: color-mix(in srgb, var(--accent) 6%, transparent) !important;
        }
      `}</style>
    </>
  );
}
