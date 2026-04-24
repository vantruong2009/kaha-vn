'use client';

import { useEffect, useRef } from 'react';

interface Props {
  color?: string;
}

export default function ScrollProgress({ color = '#c9822a' }: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      bar.style.width = pct + '%';
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '3px', zIndex: 99998, pointerEvents: 'none',
        background: 'rgba(0,0,0,0.06)',
      }}
    >
      <div
        ref={barRef}
        style={{
          height: '100%', width: '0%',
          background: color,
          transition: 'width 0.1s linear',
          boxShadow: `0 0 8px ${color}80`,
        }}
      />
    </div>
  );
}
