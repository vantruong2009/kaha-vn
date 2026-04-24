'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/data/products';

const TABS = [
  { label: 'Tất cả',        key: 'all',       img: null,                                  href: '/san-pham'          },
  { label: 'Đèn Hội An',    key: 'hoi-an',    img: '/images/danh-muc/den-hoi-an.jpg',    href: '/c/hoi-an-lantern'  },
  { label: 'Đèn Tre & Mây', key: 'tre-may',   img: '/images/danh-muc/den-may-tre.jpg',   href: '/c/den-may-tre'     },
  { label: 'Chụp Đèn Vải',  key: 'vai',       img: '/images/danh-muc/chup-den-vai.jpg',  href: '/c/chup-den-vai'    },
  { label: 'Đèn Lồng Gỗ',   key: 'go',        img: '/images/danh-muc/den-long-go.jpg',   href: '/c/den-long-go'     },
  { label: 'Đèn Kiểu Nhật', key: 'nhat',      img: '/images/danh-muc/den-nhat-ban.jpg',  href: '/c/den-kieu-nhat'   },
  { label: 'Đèn Thả Trần',  key: 'tha-tran',  img: '/images/danh-muc/den-tha-tran.jpg',  href: '/c/den-tha-tran'    },
  { label: 'Đèn Trái Tim',  key: 'trai-tim',  img: '/images/danh-muc/den-trai-tim.jpg',  href: '/c/den-trai-tim'    },
  { label: 'Đèn Tròn Màu',  key: 'tron-mau',  img: '/images/danh-muc/den-tron-mau.jpg',  href: '/c/den-tron-10-mau' },
  { label: 'Đèn Trung Thu',  key: 'trung-thu', img: '/images/danh-muc/den-trung-thu.jpg', href: '/c/den-trung-thu'   },
  { label: 'Đèn Vẽ Tranh',  key: 've-tranh',  img: '/images/danh-muc/den-ve-tranh.jpg',  href: '/c/den-ve-tranh'    },
  { label: 'Gia Công Theo YC', key: 'gia-cong', img: '/images/danh-muc/den-hoi-an.jpg',  href: '/lien-he'           },
  { label: 'Phụ Kiện Đèn',  key: 'phu-kien',  img: '/images/danh-muc/phu-kien-den.jpg',  href: '/c/phu-kien-den'    },
];

const TAG_MAP: Record<string, string[]> = {
  'hoi-an':   ['hoi-an-lantern', 'den-hoi-an', 'long-den-hoi-an'],
  'tre-may':  ['den-may-tre', 'den-tre', 'den-may'],
  'vai':      ['chup-den-vai', 'den-vai-cao-cap', 'long-den-vai-lua', 'long-den-vai-hoa'],
  'go':       ['den-long-go', 'long-den-go'],
  'nhat':     ['den-nhat-ban', 'den-kieu-nhat'],
  'tha-tran': ['den-tha-tran'],
  'trai-tim': ['den-trai-tim'],
  'tron-mau': ['den-tron-10-mau'],
  'trung-thu':['den-trung-thu'],
  've-tranh': ['den-ve-tranh'],
  'gia-cong': ['gia-cong-den-trang-tri', 'gia-cong-theo-yeu-cau'],
  'phu-kien': ['phu-kien-den', 'phu-kien'],
};

interface Props {
  products: Product[];
  label: string;
  heading: string;
  ctaText: string;
  ctaUrl: string;
}

export default function HomeBestsellersSection({ products, label, heading, ctaText, ctaUrl }: Props) {
  const [tab, setTab] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = tab === 'all'
    ? products
    : products.filter(p =>
        (TAG_MAP[tab] || []).some(t => p.tags.includes(t) || p.category === t)
      );

  const display = filtered.length >= 3 ? filtered : products;

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  }

  return (
    <section style={{ background: 'linear-gradient(to bottom, #FFFFFF, #FAF7F2)', borderTop: '1px solid #EDE5D8' }} className="py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="max-w-[520px]">
            <div className="inline-flex items-center gap-2 mb-2 rounded-full px-2.5 py-1" style={{ background: 'rgba(201,130,42,0.08)', border: '1px solid rgba(201,130,42,0.18)' }}>
              <span className="inline-flex w-4 h-4 rounded-full items-center justify-center" style={{ background: 'rgba(201,130,42,0.12)' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: '#c9822a' }} />
              </span>
              <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.16em] md:tracking-[0.22em]" style={{ color: '#c9822a' }}>{label}</p>
            </div>
            <h2
              className="text-[1.5rem] leading-[1.16] md:text-h2"
              style={{ letterSpacing: '-0.032em', color: '#0a3320', fontWeight: 700 }}
            >
              {heading}
            </h2>

            {/* CTA — mobile (right aligned, compact) */}
            <div className="mt-3 md:hidden flex justify-end">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-1.5 text-[12px] font-bold underline underline-offset-2 decoration-[1.2px]"
                style={{
                  color: '#104e2e',
                }}
              >
                {ctaText}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><path d="M7 12h10M12 7l5 5-5 5"/></svg>
              </Link>
            </div>
          </div>

          {/* CTA — desktop */}
          <Link
            href={ctaUrl}
            className="hidden md:inline-flex items-center gap-2 text-[13px] font-bold transition-all duration-200 shrink-0"
            style={{
              color: '#104e2e',
              background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
              border: '1px solid #DDD5C0',
              borderRadius: '10px',
              padding: '9px 18px',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(to bottom, #1a6b3c, #104e2e)'; (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)'; (e.currentTarget as HTMLElement).style.color = '#104e2e'; (e.currentTarget as HTMLElement).style.borderColor = '#DDD5C0'; }}
          >
            {ctaText}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* ── Segmented control (premium) ── */}
        <div className="mb-6">
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {TABS.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className="shrink-0 inline-flex items-center gap-2 rounded-full px-3.5 py-2 transition-all duration-200"
                style={{
                  background: tab === t.key ? 'linear-gradient(145deg,#1a6b3c,#104e2e)' : 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
                  color: tab === t.key ? 'white' : '#5a4a38',
                  border: tab === t.key ? '1px solid transparent' : '1px solid #E6DECF',
                  boxShadow: tab === t.key ? '0 3px 12px rgba(16,78,46,0.22)' : '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: tab === t.key ? 'rgba(255,255,255,0.85)' : '#c9822a' }}
                />
                <span className="text-[12px] md:text-[12.5px] font-bold whitespace-nowrap">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Product list (mobile stable grid + desktop grid) ── */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="grid grid-cols-2 gap-3 pb-2 md:grid-cols-5 md:gap-4"
          >
            {display.slice(0, 10).map((product, idx) => (
              <div
                key={product.id}
                className="w-full md:w-auto"
              >
                <ProductCard product={product} priority={idx < 5} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
