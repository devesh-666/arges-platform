import { useEffect, useRef } from 'react';

/**
 * Spatial Cursor — the visionOS-style dot + ring cursor.
 * Renders the `.cursor-dot` / `.cursor-ring` elements defined in arges.css so
 * the prototype's exact sizing (32px ring, 80px hover) and tint are honored.
 * Ring lerps toward the mouse with easing; grows + tints orange on hover.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch / small screens (matches the CSS @media hide rule)
    if (window.matchMedia('(max-width: 768px)').matches) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }
    };

    const animate = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
      }
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => ringRef.current?.classList.add('hover');
    const onLeave = () => ringRef.current?.classList.remove('hover');

    // Attach hover listeners to interactive elements
    const attachHover = () => {
      document.querySelectorAll('a, button, .faq-item, .layer-card, .feature, .price-card, [data-hover]').forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    window.addEventListener('mousemove', onMove);
    animate();
    attachHover();

    // Re-attach when DOM changes (simple MutationObserver)
    const observer = new MutationObserver(() => attachHover());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
