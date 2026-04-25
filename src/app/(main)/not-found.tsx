import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Trang Không Tồn Tại | KAHA',
  description: 'Trang bạn tìm kiếm không tồn tại. Hãy quay về trang chủ hoặc khám phá bộ sưu tập đèn lồng thủ công của KAHA.',
};

const POPULAR = [
  { label: 'Đèn Hội An', href: '/c/hoi-an-lantern' },
  { label: 'Đèn Tre & Mây', href: '/c/den-may-tre' },
  { label: 'Đèn Kiểu Nhật', href: '/c/den-kieu-nhat' },
  { label: 'Đèn Vải Lụa', href: '/c/den-vai-cao-cap' },
  { label: 'Đèn Tết', href: '/c/den-long-tet' },
  { label: 'Quà Tặng', href: '/c/qua-tang' },
];

export default function NotFound() {
  return (
    <div className="bg-[#FAF7F2] min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden relative">

      {/* ── Background decorative circles ─────────────────────── */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: 600, height: 600,
          borderRadius: '50%',
          border: '1px solid rgba(16,78,46,0.07)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: 400, height: 400,
          borderRadius: '50%',
          border: '1px solid rgba(16,78,46,0.06)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: 220, height: 220,
          borderRadius: '50%',
          border: '1px solid rgba(16,78,46,0.08)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      {/* ── CSS Lantern SVG ───────────────────────────────────── */}
      <div className="relative mb-10" style={{ animation: 'ldv-swing 4s ease-in-out infinite' }}>
        <style>{`
          @keyframes ldv-swing {
            0%,100% { transform: rotate(-4deg); }
            50%      { transform: rotate(4deg); }
          }
          @keyframes ldv-glow {
            0%,100% { opacity: 0.55; }
            50%      { opacity: 0.85; }
          }
        `}</style>

        <svg width="90" height="130" viewBox="0 0 90 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* String */}
          <line x1="45" y1="0" x2="45" y2="16" stroke="#104e2e" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Top cap */}
          <rect x="28" y="14" width="34" height="7" rx="2" fill="#104e2e"/>
          {/* Glow core */}
          <ellipse cx="45" cy="72" rx="22" ry="30" fill="#FBF0D0" style={{ animation: 'ldv-glow 4s ease-in-out infinite' }}/>
          {/* Body */}
          <path d="M28 24 C20 34 16 52 16 72 C16 92 20 110 28 118 L62 118 C70 110 74 92 74 72 C74 52 70 34 62 24 Z"
            fill="#C9822A" opacity="0.15" />
          <path d="M28 24 C20 34 16 52 16 72 C16 92 20 110 28 118 L62 118 C70 110 74 92 74 72 C74 52 70 34 62 24 Z"
            stroke="#C9822A" strokeWidth="1.8" fill="none"/>
          {/* Vertical ribs */}
          {[34, 45, 56].map(x => (
            <line key={x} x1={x} y1="24" x2={x} y2="118" stroke="#C9822A" strokeWidth="0.8" opacity="0.5"/>
          ))}
          {/* Horizontal rings */}
          {[42, 57, 72, 87, 102].map(y => (
            <ellipse key={y} cx="45" cy={y} rx={18 + Math.abs(72-y) * 0.18} ry="3.5"
              stroke="#C9822A" strokeWidth="0.8" fill="none" opacity="0.4"/>
          ))}
          {/* Bottom cap */}
          <rect x="28" y="116" width="34" height="7" rx="2" fill="#104e2e"/>
          {/* Tassel */}
          <line x1="45" y1="123" x2="45" y2="130" stroke="#C9822A" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* ── 404 number ───────────────────────────────────────── */}
      <div
        className="font-bold select-none leading-none mb-2"
        style={{
          fontSize: 'clamp(5rem, 18vw, 10rem)',
          letterSpacing: '-0.05em',
          background: 'linear-gradient(135deg, #104e2e 0%, #1a7a48 50%, #C9822A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        404
      </div>

      {/* ── Label ────────────────────────────────────────────── */}
      <p
        className="text-[10px] font-bold uppercase tracking-[0.25em] mb-6"
        style={{ color: '#C9822A' }}
      >
        Trang không tồn tại
      </p>

      {/* ── Headline ─────────────────────────────────────────── */}
      <h1
        className="text-center font-bold text-[#1a1a1a] mb-4"
        style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.025em', lineHeight: 1.25 }}
      >
        Chiếc đèn này đã được ai đó mang về rồi
      </h1>
      <p className="text-center text-[15px] leading-[1.8] text-[#666] max-w-md mb-10">
        Trang bạn tìm không còn ở đây nữa — có thể đường dẫn đã thay đổi hoặc sản phẩm không còn.
        Để chúng tôi dẫn bạn đến những chiếc đèn thủ công đang chờ đợi.
      </p>

      {/* ── CTAs ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-green text-white text-[13px] font-semibold px-6 py-3 rounded-full hover:bg-[#0a3320] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Về trang chủ
        </Link>
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 text-[13px] font-semibold px-6 py-3 rounded-full transition-colors"
          style={{ border: '1.5px solid #104e2e', color: '#104e2e' }}
        >
          Xem tất cả sản phẩm
        </Link>
      </div>

      {/* ── Popular categories ───────────────────────────────── */}
      <div className="w-full max-w-lg">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#bbb] mb-4">
          Danh mục phổ biến
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {POPULAR.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[12px] font-medium px-4 py-2 rounded-full transition-all hover:bg-brand-green hover:text-white"
              style={{
                background: '#fff',
                border: '1px solid #EDE8DF',
                color: '#4A4030',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Footer note ──────────────────────────────────────── */}
      <p className="mt-16 text-[11px] text-[#ccc] tracking-wider uppercase">
        KAHA® — Đèn Lồng Thủ Công Hội An
      </p>
    </div>
  );
}
