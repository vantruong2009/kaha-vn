'use client';

import { useEffect, useRef } from 'react';

interface Props {
  enabled?: boolean;
  color?: string;
  style?: 'ring' | 'dot' | 'crosshair';
}

export default function CustomCursor({ enabled = true, color = '#1a6b3c', style = 'ring' }: Props) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    // Enterprise-safe guards: desktop pointer only + honor reduced motion
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const lowPowerMode =
      (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) ||
      (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) ||
      Boolean(nav.connection?.saveData);
    if (lowPowerMode) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.style.opacity = '0';
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const render = () => {
      // Subtle smoothing for premium feel (no laggy trail)
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;
      raf = requestAnimationFrame(render);
    };

    const shouldSuppress = (node: EventTarget | null): boolean => {
      if (!(node instanceof Element)) return false;
      return Boolean(
        node.closest(
          'input,textarea,select,[contenteditable="true"],[data-cursor-ignore],.ProseMirror,.tiptap,[role="dialog"]'
        )
      );
    };

    let isRunning = true;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (shouldSuppress(e.target)) {
        cursor.style.opacity = '0';
        return;
      }
      cursor.style.opacity = '1';
    };
    const onEnter = () => cursor.classList.add('ldv-cursor-active');
    const onLeave = () => cursor.classList.remove('ldv-cursor-active');
    const onHide  = () => { cursor.style.opacity = '0'; };
    const onDown = () => cursor.classList.add('ldv-cursor-press');
    const onUp = () => cursor.classList.remove('ldv-cursor-press');
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        isRunning = false;
        cursor.style.opacity = '0';
        cancelAnimationFrame(raf);
      } else if (document.visibilityState === 'visible' && !isRunning) {
        isRunning = true;
        raf = requestAnimationFrame(render);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onHide);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(render);

    const addListeners = () => {
      document.querySelectorAll<HTMLElement>('a,button,[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    addListeners();

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onHide);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  const hex = color || '#1a6b3c';
  // Convert hex to rgb for rgba usage
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const baseStyle = style === 'dot'
    ? `background:rgba(${r},${g},${b},0.55); border:none; width:10px; height:10px;`
    : style === 'crosshair'
    ? `background:none; border:none; width:20px; height:20px;`
    : `background:rgba(${r},${g},${b},0.08); border:1.5px solid rgba(${r},${g},${b},0.32);`;

  const activeStyle = style === 'dot'
    ? `width:18px; height:18px; background:rgba(${r},${g},${b},0.35);`
    : style === 'crosshair'
    ? `width:28px; height:28px;`
    : `width:34px; height:34px; background:rgba(${r},${g},${b},0.04); border-color:rgba(${r},${g},${b},0.22);`;

  const crosshairLines = style === 'crosshair' ? `
    .ldv-cursor::before,.ldv-cursor::after {
      content:''; position:absolute; background:rgba(${r},${g},${b},0.55);
    }
    .ldv-cursor::before { width:1.5px; height:100%; left:50%; top:0; transform:translateX(-50%); }
    .ldv-cursor::after  { height:1.5px; width:100%;  top:50%; left:0; transform:translateY(-50%); }
  ` : '';

  return (
    <>
      <div ref={cursorRef} aria-hidden className="ldv-cursor" />
      <style>{`
        .ldv-cursor {
          pointer-events: none; position: fixed; top:0; left:0;
          border-radius: 50%; z-index: 99999;
          transform: translate(-50%, -50%);
          ${baseStyle}
          transition: width .18s cubic-bezier(.25,.46,.45,.94),
                      height .18s cubic-bezier(.25,.46,.45,.94),
                      background .2s ease, border-color .2s ease, opacity .2s ease,
                      transform .12s ease;
          will-change: left, top;
        }
        .ldv-cursor.ldv-cursor-active { ${activeStyle} }
        .ldv-cursor.ldv-cursor-press { transform: translate(-50%, -50%) scale(0.9); }
        ${crosshairLines}
        @media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) { .ldv-cursor { display: none; } }
      `}</style>
    </>
  );
}
