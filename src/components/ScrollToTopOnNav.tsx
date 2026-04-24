'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Fix: scroll-behavior: smooth on <html> conflicts with Next.js App Router
 * scroll-to-top on client navigation. Temporarily override to 'auto' to force
 * instant jump to top, then restore smooth for anchor links.
 */
export default function ScrollToTopOnNav() {
  const pathname = usePathname();
  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    // Restore smooth after frame — anchor links still work smoothly
    const raf = requestAnimationFrame(() => {
      html.style.scrollBehavior = '';
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);
  return null;
}
