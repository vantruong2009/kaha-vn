'use client';

import { useEffect } from 'react';

interface Props {
  cardGlow: boolean;
  cardGlowColor: string;
}

export default function FxInit({ cardGlow, cardGlowColor }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--fx-card-glow-color', cardGlowColor);
    if (cardGlow) {
      document.body.classList.add('fx-card-glow');
    } else {
      document.body.classList.remove('fx-card-glow');
    }
  }, [cardGlow, cardGlowColor]);

  return null;
}
