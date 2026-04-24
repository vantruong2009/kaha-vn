'use client';

import { useEffect } from 'react';

export default function ScrollRevealInit() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<Element>('.reveal'));

    // Immediately reveal elements already in or near viewport
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('visible');
      }
    });

    const remaining = els.filter((el) => !el.classList.contains('visible'));

    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    );

    remaining.forEach((el) => obs.observe(el));

    // Safety net: force-reveal anything still hidden after 1s
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) =>
        el.classList.add('visible')
      );
    }, 1000);

    return () => {
      obs.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return null;
}
