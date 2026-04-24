'use client';

import { useState, useEffect } from 'react';

const DEFAULT_MESSAGES = [
  { text: 'Miễn phí vận chuyển đơn từ 500k', href: '/chinh-sach-van-chuyen' },
  { text: 'Flash sale hôm nay — giảm đến 43%', href: '/san-pham' },
  { text: 'Đặt sỉ từ 20 chiếc — giảm 15–30%', href: '/lien-he' },
  { text: 'Giao toàn quốc 63 tỉnh · nhận trong 2–5 ngày', href: '/chinh-sach-van-chuyen' },
];

const DEFAULT_BG = '#145530';

export default function AnnouncementBar({
  messages,
  bg,
  interval,
  effect = 'fade',
  shimmer = true,
}: {
  messages?: { text: string; href: string }[];
  bg?: string;
  interval?: number;
  effect?: string;
  shimmer?: boolean;
}) {
  const items = messages?.length ? messages : DEFAULT_MESSAGES;
  const bgColor = bg || DEFAULT_BG;
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % items.length);
        setFading(false);
      }, 280);
    }, interval || 4000);
    return () => clearInterval(id);
  }, [items.length, interval]);

  if (dismissed) return null;

  const { text, href } = items[idx];

  return (
    <div
      className="relative flex items-center justify-center h-8 px-10 transition-opacity duration-300"
      style={{
        background: effect === 'gradient'
          ? `linear-gradient(90deg, ${bgColor} 0%, rgba(26,107,60,0.95) 55%, ${bgColor} 100%)`
          : bgColor,
        opacity: effect === 'fade' ? (fading ? 0 : 1) : 1,
        overflow: 'hidden',
      }}
    >
      {shimmer && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '18%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transform: 'translateX(-140%)',
            animation: 'ldv-ann-shimmer 7s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
      <style>{`
        @keyframes ldv-ann-shimmer {
          0%, 70% { transform: translateX(-140%); }
          100% { transform: translateX(620%); }
        }
      `}</style>
      <a
        href={href}
        className="text-[11px] font-semibold tracking-wide text-white/90 hover:text-white transition-colors"
      >
        {text}
        <span className="font-bold ml-1.5">→</span>
      </a>

      {/* Progress dots */}
      {items.length > 1 && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
          {items.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 12 : 4,
                height: 4,
                background: i === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setDismissed(true)}
        aria-label="Đóng thông báo"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}
