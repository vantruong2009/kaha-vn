'use client';

import { useState } from 'react';
import type { ReviewItem } from '@/lib/site-settings';

const FILTERS = [
  { id: 'all',    label: 'Tất cả'       },
  { id: '5',      label: '5 sao'        },
  { id: '4',      label: '4 sao'        },
  { id: 'repeat', label: 'Mua nhiều lần' },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i <= n ? '#c9822a' : 'none'}
          stroke={i <= n ? '#c9822a' : '#ddd'}
          strokeWidth="1.5" aria-hidden>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  ['#e6f2eb', '#104e2e'],
  ['#FBF0D0', '#a07800'],
  ['#EDE5D8', '#6a5840'],
  ['#e8f0fb', '#2a5298'],
  ['#fde8e8', '#9b2323'],
];

interface Props {
  reviews: ReviewItem[];
  rating: string;
  count: string;
  stacked?: boolean;
  limit?: number;
}

export default function ReviewsSection({ reviews, stacked, limit }: Props) {
  const [filter, setFilter] = useState('all');

  // Rating breakdown bars — computed from full reviews array
  const total = reviews.length;
  const starBreakdown = [5, 4, 3].map(star => {
    const cnt = reviews.filter(r => (r.stars ?? 5) === star).length;
    return { star, pct: total > 0 ? Math.round((cnt / total) * 100) : 0 };
  });

  const filtered = reviews.filter(r => {
    if (filter === '5')      return (r.stars ?? 5) >= 5;
    if (filter === '4')      return (r.stars ?? 5) === 4;
    if (filter === 'repeat') return r.meta?.toLowerCase().includes('lần');
    return true;
  });

  const visible = filtered.slice(0, limit ?? (stacked ? 3 : filtered.length));

  return (
    <div>
      {/* ── Rating breakdown bars ── */}
      {total >= 3 && (
        <div className="flex flex-col gap-1.5 mb-4">
          {starBreakdown.map(({ star, pct }) => (
            <div key={star} className="flex items-center gap-2.5">
              <span className="text-[11px] font-semibold shrink-0 w-5 text-right" style={{ color: '#bbb' }}>{star}★</span>
              <div className="flex-1 h-[5px] rounded-full" style={{ background: '#f0ebe3' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: star === 5 ? '#104e2e' : star === 4 ? '#1a6b3c' : '#c9822a',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <span className="text-[11px] shrink-0 w-8" style={{ color: '#bbb' }}>{pct}%</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Filter pills — underline style ── */}
      <div className="flex gap-3 flex-wrap mb-4" style={{ borderBottom: '1px solid #f0ebe3' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="pb-2.5 text-[12px] font-bold transition-all duration-200"
            style={{
              color:         filter === f.id ? '#104e2e' : '#aaa',
              background:    'none',
              border:        'none',
              borderBottom:  filter === f.id ? '2px solid #104e2e' : '2px solid transparent',
              marginBottom:  '-1px',
              paddingBottom: '10px',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Review list ── */}
      {visible.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 13, padding: '20px 0' }}>Không có đánh giá nào phù hợp.</p>
      ) : (
        <div className={stacked ? 'flex flex-col gap-2.5' : 'grid grid-cols-1 md:grid-cols-3 gap-3'}>
          {visible.map((r, i) => {
            const [bg, fg] = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const ini = initials(r.name || 'KH');
            const isRepeat = r.meta?.toLowerCase().includes('lần');
            return (
              <div key={i} className="rounded-xl border border-[#E2DAD0] bg-white p-3.5" style={{ boxShadow: '0 1px 5px rgba(0,0,0,0.045)' }}>
                {/* Stars + badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <Stars n={r.stars ?? 5} />
                  {isRepeat ? (
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                      color: '#a07800', background: '#FBF0D0', padding: '2px 8px', borderRadius: 50,
                    }}>
                      Mua nhiều lần
                    </span>
                  ) : (
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                      color: '#104e2e', background: '#e6f2eb', padding: '2px 8px', borderRadius: 50,
                    }}>
                      Đã mua hàng
                    </span>
                  )}
                </div>

                {/* Review text */}
                <p style={{ fontSize: 12.5, color: '#444', lineHeight: 1.68, marginBottom: 11 }}>
                  {r.text}
                </p>

                {/* Avatar + name */}
                <div className="flex items-center gap-2.5">
                  {r.avatar ? (
                    <img src={r.avatar} alt={r.name} width={32} height={32}
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(0,0,0,0.06)' }}
                    />
                  ) : (
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: bg, color: fg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800, flexShrink: 0, border: '1.5px solid rgba(0,0,0,0.06)',
                    }}>
                      {ini}
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>{r.name}</p>
                    <p style={{ fontSize: 10.5, color: '#8a7a6a', marginTop: 1 }}>{r.meta}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
