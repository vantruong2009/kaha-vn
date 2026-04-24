'use client';

import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={[
              'rounded-xl border overflow-hidden transition-colors duration-200',
              isOpen ? 'border-brand-green bg-white shadow-[0_2px_8px_rgba(16,78,46,0.08)]' : 'border-[#ede8e0] bg-white',
            ].join(' ')}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className={[
                'text-sm font-semibold leading-snug transition-colors',
                isOpen ? 'text-brand-green' : 'text-[#1a1a1a]',
              ].join(' ')}>
                {item.q}
              </span>
              <span className={[
                'shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200',
                isOpen ? 'bg-brand-green text-white rotate-45' : 'bg-[#f0ece6] text-[#888]',
              ].join(' ')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5">
                <div className="text-sm text-[#444] leading-[1.85] border-t border-[#f0ece6] pt-4">
                  {item.a}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
