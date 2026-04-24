'use client';

import Link from 'next/link';
import { useState } from 'react';

/** URL ảnh legacy (host cũ) — nếu khớp thì dùng endpoint render có resize. */
function legacyStorageRenderImageUrl(url: string, w: number, h: number): string {
  if (!url) return url;
  const m = url.match(/^(https:\/\/[^/]+\.supabase\.co)\/storage\/v1\/object\/public\/(.+)$/);
  if (!m) return url;
  return `${m[1]}/storage/v1/render/image/public/${m[2]}?width=${w}&height=${h}&resize=cover&quality=90`;
}

export interface MegaMenuItem {
  label: string;
  href: string;
  image: string;
  tag?: string;
}

interface Props {
  title: string;
  items: MegaMenuItem[];
  editorialImage: string;
  editorialTitle?: string;
  editorialDesc?: string;
  editorialCta?: string;
  editorialCtaUrl?: string;
  secondaryTitle?: string;
  secondaryItems?: MegaMenuItem[];
  secondaryEditorialImage?: string;
  onClose: () => void;
  onMouseEnter: () => void;
}

export default function NavMegaMenu({
  title,
  items,
  editorialImage,
  editorialTitle = 'Xưởng Đèn Lồng\nThủ Công Hội An',
  editorialDesc = 'Từng chiếc đèn được tạo ra bởi đôi tay nghệ nhân — truyền đi hơi ấm và ký ức.',
  editorialCta = 'Khám phá bộ sưu tập',
  editorialCtaUrl = '/san-pham',
  secondaryTitle,
  secondaryItems = [],
  secondaryEditorialImage,
  onClose,
  onMouseEnter,
}: Props) {
  const [activeTab, setActiveTab] = useState<'primary' | 'secondary'>('primary');

  const displayItems = activeTab === 'primary' ? items : secondaryItems;
  const rawSideItems = activeTab === 'primary' ? secondaryItems : items;
  const sideItems    = rawSideItems.length ? rawSideItems : items.slice(1);
  const displayLabel = activeTab === 'primary' ? title : (secondaryTitle ?? title);
  const promoImg     = activeTab === 'primary' ? editorialImage : (secondaryEditorialImage ?? editorialImage);

  // Featured = first item; grid = next 5 (6th slot = "Xem tất cả" tile)
  const featured  = displayItems[0];
  const gridItems = displayItems.slice(1, 6);

  return (
    <div
      className="absolute top-full left-0 right-0 z-[150]"
      style={{
        background: '#FDFAF5',
        boxShadow: '0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.06)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto flex" style={{ minHeight: '370px' }}>

        {/* ── LEFT: content ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tab bar — only when 2 tabs */}
          {secondaryTitle && (
            <div
              className="flex items-center shrink-0 px-8"
              style={{ background: '#F7F3EC', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
            >
              {[
                { id: 'primary' as const,   label: title },
                { id: 'secondary' as const, label: secondaryTitle },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    'py-3 px-1 mr-6 text-[12px] font-bold border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'text-[#104e2e] border-[#104e2e]'
                      : 'text-[#999] border-transparent hover:text-[#333]',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Topbar: category label + see-all ── */}
          <div
            className="flex items-center justify-between shrink-0 px-6"
            style={{ padding: '12px 24px 10px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: '#c9822a' }}>
              {displayLabel === title
                ? (title === 'Sản phẩm' ? 'Bộ sưu tập đèn lồng' : 'Theo không gian sống')
                : displayLabel}
            </p>
            <Link
              href={editorialCtaUrl}
              onClick={onClose}
              className="flex items-center gap-1 text-[11px] font-bold text-[#104e2e] hover:underline underline-offset-4"
            >
              Xem tất cả
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* ── Grid ── */}
          <div className="px-6 py-4 flex-1">
            <div
              className="grid gap-[9px]"
              style={{
                gridTemplateColumns: '2.1fr 1fr 1fr 1fr',
                gridAutoRows: '156px',
                height: '100%',
              }}
            >
              {/* Featured card */}
              {featured && (
                <Link
                  href={featured.href}
                  onClick={onClose}
                  className="group relative rounded-2xl overflow-hidden bg-[#3a5040]"
                  style={{ gridColumn: 'span 1', gridRow: 'span 2' }}
                >
                  {featured.image && (
                    <img
                      src={legacyStorageRenderImageUrl(featured.image, 600, 600)}
                      alt={featured.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(155deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 38%, rgba(10,51,32,0.92) 100%)' }} />
                  {featured.tag && (
                    <span className="absolute top-3 left-3 text-[8px] font-bold uppercase tracking-wider bg-[#c9822a] text-white px-2.5 py-[3px] rounded-full">
                      {featured.tag}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c9822a] mb-2">Nổi bật</p>
                    <h3 className="text-[19px] font-bold text-white leading-tight mb-2" style={{ letterSpacing: '-0.025em' }}>
                      {featured.label}
                    </h3>
                    <p className="text-[10px] text-white/80 leading-relaxed mb-4">
                      {title === 'Sản phẩm'
                        ? 'Thủ công nghệ nhân làng nghề Hội An'
                        : 'Không gian sống được thắp sáng bởi đèn lồng thủ công'}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-white bg-white/[0.13] border border-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      Khám phá ngay
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                  </div>
                </Link>
              )}

              {/* 5 small tiles */}
              {gridItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="group relative rounded-[13px] overflow-hidden bg-[#c8c0b0]"
                >
                  {item.image && (
                    <img
                      src={legacyStorageRenderImageUrl(item.image, 400, 300)}
                      alt={item.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.0) 52%, transparent 100%)' }} />
                  {item.tag && (
                    <span
                      className="absolute top-2 left-2 text-[8px] font-bold uppercase tracking-wider text-white px-2 py-[3px] rounded-full"
                      style={{ background: item.tag === 'Hot' ? '#d04a2e' : '#1a6b3c' }}
                    >
                      {item.tag}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5">
                    <span className="text-[11.5px] font-bold text-white leading-tight block">{item.label}</span>
                  </div>
                </Link>
              ))}

              {/* "Xem tất cả" tile — always shown as 6th slot */}
              <Link
                href={editorialCtaUrl}
                onClick={onClose}
                className="relative rounded-[13px] overflow-hidden flex flex-col items-center justify-center gap-2 group"
                style={{ background: 'linear-gradient(145deg, #104e2e, #0a3320)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.2" strokeLinecap="round" className="group-hover:stroke-white transition-colors"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                <span className="text-[10px] font-bold text-white/65 group-hover:text-white/90 text-center leading-tight transition-colors">
                  Xem<br />tất cả
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT: side panel ── */}
        <div
          className="shrink-0 flex flex-col"
          style={{ width: '230px', borderLeft: '1px solid rgba(0,0,0,0.06)', background: '#FDFAF5' }}
        >
          {/* Text-only links — no thumbnails (Shopify/Nike pattern) */}
          <div className="flex-1 px-5 pt-5 pb-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#c9822a' }}>
              {activeTab === 'primary' ? (secondaryTitle ?? 'Khám phá') : title}
            </p>
            <div className="flex flex-col">
              {sideItems.slice(0, 6).map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center gap-2.5 py-[7px] border-b last:border-b-0 transition-colors"
                  style={{ borderColor: 'rgba(0,0,0,0.05)' }}
                >
                  <span
                    className="w-[5px] h-[5px] rounded-full flex-shrink-0 transition-all duration-200 group-hover:scale-150"
                    style={{ background: '#c9822a', opacity: 0.55 }}
                  />
                  <span className="text-[12.5px] font-semibold flex-1 leading-snug transition-colors group-hover:text-[#104e2e]" style={{ color: '#1a1a1a' }}>
                    {item.label}
                  </span>
                  <svg width="5" height="9" viewBox="0 0 5 9" fill="none" stroke="#ccc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 group-hover:stroke-[#104e2e] transition-colors">
                    <polyline points="1,1 4.5,4.5 1,8"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Editorial card — taller (120px vs 80px before) */}
          <div className="mx-4 mb-3 rounded-[14px] overflow-hidden relative" style={{ height: '120px', flexShrink: 0 }}>
            <img
              src={legacyStorageRenderImageUrl(promoImg, 460, 240)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, rgba(10,40,24,0.95) 0%, rgba(10,40,24,0.55) 100%)' }}
            />
            <div className="relative p-4">
              <p className="text-[7.5px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color: '#c9822a' }}>LongDenViet®</p>
              <p className="text-[13px] font-bold text-white leading-snug" style={{ letterSpacing: '-0.02em' }}>
                {editorialTitle.split('\n')[0]}<br />
                <span className="text-white/60 text-[10px] font-normal">{editorialTitle.split('\n')[1] ?? ''}</span>
              </p>
              <p className="text-[9px] text-white/45 mt-1 leading-relaxed">{editorialDesc.slice(0, 42)}…</p>
            </div>
          </div>

          {/* CTA */}
          <div className="px-4 pb-5">
            <Link
              href={editorialCtaUrl}
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#104e2e] bg-[#e6f2eb] hover:bg-[#d0e8d8] transition-colors py-2.5 rounded-xl"
            >
              {editorialCta}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
