'use client';

import { useEffect, useRef } from 'react';

/**
 * A soft radial glow that follows the cursor across every page.
 * Pointer-events-none and fixed, so it never interferes with clicks.
 * Ignored entirely on touch devices (no mouse to follow).
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          if (ref.current) {
            ref.current.style.transform = `translate(${x - 220}px, ${y - 220}px)`;
            ref.current.style.opacity = '1';
          }
          raf = 0;
        });
      }
    };
    const onLeave = () => {
      if (ref.current) ref.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[999] h-[440px] w-[440px] rounded-full opacity-0 transition-opacity duration-300"
      style={{
        background:
          'radial-gradient(circle, rgba(227,30,36,0.07) 0%, rgba(242,183,5,0.05) 40%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  );
}
