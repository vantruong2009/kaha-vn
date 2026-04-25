'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[KAHA Error]', error);
  }, [error]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden relative">

      {/* Decorative rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[560, 380, 200].map(size => (
          <div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              border: `1px solid rgba(201,130,42,${size === 200 ? 0.1 : size === 380 ? 0.07 : 0.04})`,
            }}
          />
        ))}
      </div>

      {/* Dim lantern SVG — cracked/broken feel */}
      <div className="relative mb-10" style={{ opacity: 0.85 }}>
        <svg width="90" height="130" viewBox="0 0 90 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* String */}
          <line x1="45" y1="0" x2="45" y2="16" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/>
          {/* Top cap */}
          <rect x="28" y="14" width="34" height="7" rx="2" fill="#999"/>
          {/* Dim glow */}
          <ellipse cx="45" cy="72" rx="20" ry="28" fill="#EEE8D8" opacity="0.5"/>
          {/* Body fill */}
          <path d="M28 24 C20 34 16 52 16 72 C16 92 20 110 28 118 L62 118 C70 110 74 92 74 72 C74 52 70 34 62 24 Z"
            fill="#C9822A" opacity="0.06"/>
          {/* Body stroke — muted */}
          <path d="M28 24 C20 34 16 52 16 72 C16 92 20 110 28 118 L62 118 C70 110 74 92 74 72 C74 52 70 34 62 24 Z"
            stroke="#AAA" strokeWidth="1.5" fill="none"/>
          {/* Vertical ribs */}
          {[34, 45, 56].map(x => (
            <line key={x} x1={x} y1="24" x2={x} y2="118" stroke="#BBB" strokeWidth="0.8" opacity="0.5"/>
          ))}
          {/* Horizontal rings */}
          {[42, 57, 72, 87, 102].map(y => (
            <ellipse key={y} cx="45" cy={y} rx={18 + Math.abs(72 - y) * 0.18} ry="3.5"
              stroke="#BBB" strokeWidth="0.8" fill="none" opacity="0.4"/>
          ))}
          {/* Crack lines */}
          <path d="M42 38 L47 52 L43 60" stroke="#C9822A" strokeWidth="1" opacity="0.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M52 75 L48 84" stroke="#C9822A" strokeWidth="1" opacity="0.35" strokeLinecap="round"/>
          {/* Bottom cap */}
          <rect x="28" y="116" width="34" height="7" rx="2" fill="#999"/>
          {/* No tassel — broken */}
        </svg>
      </div>

      {/* Label */}
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: '#C9822A' }}>
        Có lỗi xảy ra
      </p>

      {/* Headline */}
      <h1
        className="text-center font-bold text-[#1a1a1a] mb-4"
        style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.025em', lineHeight: 1.25 }}
      >
        Chiếc đèn tạm thời bị tắt
      </h1>
      <p className="text-center text-[15px] leading-[1.8] text-[#666] max-w-sm mb-10">
        Trang này gặp sự cố tạm thời. Thử lại hoặc quay về trang chủ trong khi chúng tôi khắc phục.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-brand-green text-white text-[13px] font-semibold px-6 py-3 rounded-full hover:bg-[#0a3320] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-3"/>
          </svg>
          Thử lại
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-semibold px-6 py-3 rounded-full transition-colors"
          style={{ border: '1.5px solid #104e2e', color: '#104e2e' }}
        >
          Về trang chủ
        </Link>
      </div>

      {error.digest && (
        <p className="text-[10px] text-[#ccc] tracking-wider">
          Mã lỗi: {error.digest}
        </p>
      )}

      <p className="mt-12 text-[11px] text-[#ccc] tracking-wider uppercase">
        KAHA® — Đèn Lồng Thủ Công Hội An
      </p>
    </div>
  );
}
