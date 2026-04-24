'use client';

interface Props {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export default function FallbackImage({ src, alt, className, loading = 'lazy' }: Props) {
  return (
    <div className="w-full h-full relative">
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={className ?? 'w-full h-full object-cover'}
        onError={(e) => {
          const t = e.currentTarget;
          t.style.display = 'none';
          (t.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex');
        }}
      />
      {/* SVG fallback — no emoji */}
      <span
        style={{ display: 'none' }}
        className="absolute inset-0 bg-[#f5f0e8] flex items-center justify-center"
        aria-hidden
      >
        <svg width="40" height="58" viewBox="0 0 60 86" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 4 C30 4 18 14 18 32 C18 50 30 62 30 62 C30 62 42 50 42 32 C42 14 30 4 30 4Z" stroke="#c9822a" strokeWidth="2" fill="none"/>
          <line x1="30" y1="0" x2="30" y2="8" stroke="#c9822a" strokeWidth="2" strokeLinecap="round"/>
          <line x1="30" y1="62" x2="30" y2="72" stroke="#c9822a" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="30" cy="72" rx="8" ry="2.5" stroke="#c9822a" strokeWidth="1.5" fill="none"/>
          <line x1="18" y1="32" x2="6" y2="28" stroke="#c9822a" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="42" y1="32" x2="54" y2="28" stroke="#c9822a" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </span>
    </div>
  );
}
