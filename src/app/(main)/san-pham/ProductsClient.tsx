'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { formatPrice } from '@/data/products';
import type { Product } from '@/data/products';

const DEFAULT_PRICE_MAX = 2_000_000;

interface Filters {
  cat: string;
  space: string;
  badge: string;
  region: string;
  priceMax: number;
  sortBy: string;
  search: string;
}

interface Props {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentFilters: Filters;
  catCounts: Record<string, number>;
  spaceCounts: Record<string, number>;
  badgeCounts: Record<string, number>;
  regionCounts: Record<string, number>;
}

const SPACE_LABELS: Record<string, string> = {
  'phong-khach': 'Phòng Khách',
  'ban-cong':    'Ban Công & Sân Thượng',
  'cafe':        'Quán Cafe & Trà',
  'nha-hang':    'Nhà Hàng',
  'resort':      'Resort & Spa',
  'tiec-cuoi':   'Tiệc Cưới',
  'su-kien':     'Sự Kiện',
  'ngoai-troi':  'Ngoài Trời',
};

const BADGE_META: Record<string, { label: string; color: string }> = {
  'new':        { label: 'Hàng Mới',       color: '#1a6b3c' },
  'sale':       { label: 'Đang Giảm Giá',  color: '#c9822a' },
  'tet':        { label: 'Đèn Tết',        color: '#c0392b' },
  'bestseller': { label: 'Bán Chạy',       color: '#104e2e' },
};

const SORT_OPTIONS = [
  { value: 'popular',    label: 'Phổ biến' },
  { value: 'rating',     label: 'Đánh giá' },
  { value: 'price-asc',  label: 'Giá tăng' },
  { value: 'price-desc', label: 'Giá giảm' },
];

/* ─── Tick checkmark ─────────────────────────────────────────────────────── */
function Tick() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── FilterRow ──────────────────────────────────────────────────────────── */
function FilterRow({ label, count, selected, onClick, accent }: {
  label: string; count: number; selected: boolean; onClick: () => void; accent?: string;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group"
      style={{
        background: selected ? 'rgba(16,78,46,0.06)' : 'transparent',
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'rgba(250,247,242,0.9)'; }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center flex-shrink-0 transition-all duration-150"
          style={{
            background: selected ? (accent || '#1a6b3c') : 'transparent',
            border: selected ? `2px solid ${accent || '#1a6b3c'}` : '1.5px solid #D4C8B8',
          }}
        >
          {selected && <Tick />}
        </span>
        <span
          className="text-[13px] leading-snug transition-colors duration-150"
          style={{ color: selected ? '#145530' : '#4a4a4a', fontWeight: selected ? 600 : 400 }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-[11px] tabular-nums font-medium transition-colors"
        style={{ color: selected ? '#1a6b3c' : '#C8BAA8' }}
      >
        {count}
      </span>
    </div>
  );
}

/* ─── SectionHeader ──────────────────────────────────────────────────────── */
function SectionHeader({ title, open, onClick, count }: {
  title: string; open: boolean; onClick: () => void; count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-3.5 transition-colors duration-150 group"
      style={{ background: 'transparent' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(250,247,242,0.7)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] transition-colors" style={{ color: '#9a8878' }}>
          {title}
        </span>
        {count !== undefined && count > 0 && (
          <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full leading-none" style={{ background: '#1a6b3c' }}>
            {count}
          </span>
        )}
      </div>
      <svg
        width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="#C8BAA8" strokeWidth="2.5" strokeLinecap="round"
        className="transition-all duration-200"
        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>
  );
}

/* ─── View toggle icons ──────────────────────────────────────────────────── */
const VIEW_ICONS: Record<number, React.ReactNode> = {
  2: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="0" y="0" width="6" height="16" rx="1.5" fill="currentColor"/><rect x="10" y="0" width="6" height="16" rx="1.5" fill="currentColor"/></svg>,
  3: <svg width="13" height="13" viewBox="0 0 18 16" fill="none"><rect x="0" y="0" width="4.5" height="16" rx="1.2" fill="currentColor"/><rect x="6.75" y="0" width="4.5" height="16" rx="1.2" fill="currentColor"/><rect x="13.5" y="0" width="4.5" height="16" rx="1.2" fill="currentColor"/></svg>,
  4: <svg width="13" height="13" viewBox="0 0 20 16" fill="none"><rect x="0"  y="0" width="3.5" height="16" rx="1" fill="currentColor"/><rect x="5.5" y="0" width="3.5" height="16" rx="1" fill="currentColor"/><rect x="11" y="0" width="3.5" height="16" rx="1" fill="currentColor"/><rect x="16.5" y="0" width="3.5" height="16" rx="1" fill="currentColor"/></svg>,
};

/* ─── Empty state ────────────────────────────────────────────────────────── */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-24">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
        style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)' }}
      >
        <svg width="32" height="46" viewBox="0 0 60 86" fill="none" opacity="0.35">
          <line x1="30" y1="0" x2="30" y2="10" stroke="#104e2e" strokeWidth="2" strokeLinecap="round"/>
          <rect x="18" y="8" width="24" height="5" rx="1.5" fill="#104e2e"/>
          <path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#104e2e" strokeWidth="1.5" fill="rgba(16,78,46,0.08)"/>
          <line x1="22" y1="14" x2="22" y2="76" stroke="#104e2e" strokeWidth="0.8" opacity="0.5"/>
          <line x1="30" y1="14" x2="30" y2="76" stroke="#104e2e" strokeWidth="0.8" opacity="0.5"/>
          <line x1="38" y1="14" x2="38" y2="76" stroke="#104e2e" strokeWidth="0.8" opacity="0.5"/>
          <rect x="18" y="74" width="24" height="5" rx="1.5" fill="#104e2e"/>
        </svg>
      </div>
      <p className="text-[15px] font-semibold mb-2" style={{ color: '#4a4a4a' }}>Không tìm thấy sản phẩm phù hợp</p>
      <p className="text-[13px] mb-6" style={{ color: '#9a8878' }}>Hãy thử điều chỉnh bộ lọc hoặc từ khoá tìm kiếm</p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-[13px] font-bold text-white transition-all duration-200"
        style={{
          background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)',
          borderRadius: '12px',
          padding: '10px 22px',
          boxShadow: '0 3px 10px rgba(16,78,46,.28)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
        Xóa tất cả bộ lọc
      </button>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function ProductsClient({
  products, totalCount, totalPages, currentPage, currentFilters,
  spaceCounts, badgeCounts, regionCounts,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { cat, space, badge, region, priceMax, sortBy, search } = currentFilters;

  const [open, setOpen] = useState({ space: true, badge: true, region: true, price: true });
  const [cols, setCols] = useState<2 | 3 | 4>(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggle = (k: keyof typeof open) => setOpen(p => ({ ...p, [k]: !p[k] }));

  const navigate = (overrides: Partial<Record<string, string | null>>) => {
    const params = new URLSearchParams();
    const merged = {
      cat, space, badge, region,
      price: priceMax < DEFAULT_PRICE_MAX ? String(priceMax) : null,
      sort: sortBy !== 'popular' ? sortBy : null,
      q: search || null,
      ...overrides,
    };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams();
    if (cat)    params.set('cat', cat);
    if (space)  params.set('space', space);
    if (badge)  params.set('badge', badge);
    if (region) params.set('region', region);
    if (priceMax < DEFAULT_PRICE_MAX) params.set('price', String(priceMax));
    if (sortBy !== 'popular') params.set('sort', sortBy);
    if (search) params.set('q', search);
    if (p > 1)  params.set('page', String(p));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const hasFilters = !!(cat || space || badge || region || priceMax < DEFAULT_PRICE_MAX || search);
  const startIdx = (currentPage - 1) * 24 + 1;
  const endIdx   = Math.min(startIdx + products.length - 1, totalCount);
  const activeCount = [cat, space, badge, region, priceMax < DEFAULT_PRICE_MAX ? '1' : '', search].filter(Boolean).length;

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (space)  activeChips.push({ label: SPACE_LABELS[space] ?? space, onRemove: () => navigate({ space: null }) });
  if (badge)  activeChips.push({ label: BADGE_META[badge]?.label ?? badge, onRemove: () => navigate({ badge: null }) });
  if (region) activeChips.push({ label: region, onRemove: () => navigate({ region: null }) });
  if (priceMax < DEFAULT_PRICE_MAX) activeChips.push({ label: `≤ ${formatPrice(priceMax)}`, onRemove: () => navigate({ price: null }) });
  if (search) activeChips.push({ label: `"${search}"`, onRemove: () => navigate({ q: null }) });

  /* ── Sidebar content (shared between desktop + mobile drawer) ── */
  const sidebarContent = (
    <>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid #EDE5D8', background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)' }}
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2.2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
          <span className="text-[13px] font-bold tracking-[-0.01em]" style={{ color: '#1a1a1a' }}>Bộ lọc</span>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center leading-none" style={{ background: '#1a6b3c' }}>
              {activeCount}
            </span>
          )}
        </div>
        {hasFilters && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-[11px] font-semibold tracking-wide transition-colors"
            style={{ color: '#9a8878' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1a6b3c'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9a8878'; }}
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Active chips */}
      {activeChips.length > 0 && (
        <div className="px-4 py-3 flex flex-wrap gap-1.5" style={{ borderBottom: '1px solid #EDE5D8' }}>
          {activeChips.map((chip, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-[11px] font-semibold pl-2.5 pr-1.5 py-1 rounded-full" style={{ background: '#145530', color: '#F2B950' }}>
              {chip.label}
              <button
                onClick={chip.onRemove}
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors leading-none flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.2)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'; }}
                aria-label="Xóa"
              >
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="7" y2="7"/><line x1="7" y1="1" x2="1" y2="7"/>
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Không gian */}
      <div style={{ borderBottom: '1px solid #EDE5D8' }}>
        <SectionHeader title="Không gian" open={open.space} onClick={() => toggle('space')} count={space ? 1 : 0} />
        {open.space && (
          <div className="px-3 pb-3">
            {Object.entries(SPACE_LABELS).map(([id, label]) => {
              const count = spaceCounts[id] ?? 0;
              if (!count) return null;
              return <FilterRow key={id} label={label} count={count} selected={space === id} onClick={() => navigate({ space: space === id ? null : id })} />;
            })}
          </div>
        )}
      </div>

      {/* Nhãn sản phẩm */}
      <div style={{ borderBottom: '1px solid #EDE5D8' }}>
        <SectionHeader title="Nhãn sản phẩm" open={open.badge} onClick={() => toggle('badge')} count={badge ? 1 : 0} />
        {open.badge && (
          <div className="px-3 pb-3">
            {Object.entries(BADGE_META).map(([id, meta]) => {
              const count = badgeCounts[id] ?? 0;
              if (!count) return null;
              return <FilterRow key={id} label={meta.label} count={count} selected={badge === id} onClick={() => navigate({ badge: badge === id ? null : id })} accent={meta.color} />;
            })}
          </div>
        )}
      </div>

      {/* Khu vực nghệ nhân */}
      <div style={{ borderBottom: '1px solid #EDE5D8' }}>
        <SectionHeader title="Khu vực nghệ nhân" open={open.region} onClick={() => toggle('region')} count={region ? 1 : 0} />
        {open.region && (
          <div className="px-3 pb-3">
            {Object.entries(regionCounts)
              .filter(([, c]) => c > 0)
              .sort(([a], [b]) => a.localeCompare(b, 'vi'))
              .map(([r, count]) => (
                <FilterRow key={r} label={r} count={count} selected={region === r} onClick={() => navigate({ region: region === r ? null : r })} />
              ))}
          </div>
        )}
      </div>

      {/* Khoảng giá */}
      <div>
        <SectionHeader title="Khoảng giá" open={open.price} onClick={() => toggle('price')} />
        {open.price && (
          <div className="px-5 pb-5 pt-1">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-[11px]" style={{ color: '#C8BAA8' }}>100k</span>
              <span className="text-sm font-bold" style={{ color: '#1a6b3c' }}>{formatPrice(priceMax)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={2000000}
              step={50000}
              defaultValue={priceMax}
              onMouseUp={e => navigate({ price: Number((e.target as HTMLInputElement).value) < DEFAULT_PRICE_MAX ? (e.target as HTMLInputElement).value : null })}
              onTouchEnd={e => navigate({ price: Number((e.target as HTMLInputElement).value) < DEFAULT_PRICE_MAX ? (e.target as HTMLInputElement).value : null })}
              className="w-full cursor-pointer"
              style={{ height: '4px', accentColor: '#1a6b3c' }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[11px]" style={{ color: '#C8BAA8' }}>Tối thiểu</span>
              <span className="text-[11px]" style={{ color: '#C8BAA8' }}>2.000.000₫</span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  }[cols];

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-2.5 items-center mb-7">

        {/* Mobile filter button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden flex items-center gap-2 text-[12px] font-bold transition-all duration-200"
          style={{
            background: activeCount > 0 ? 'linear-gradient(to bottom, #1a6b3c, #104e2e)' : 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
            border: activeCount > 0 ? 'none' : '1px solid #E8DDD0',
            borderRadius: '10px',
            padding: '9px 14px',
            color: activeCount > 0 ? 'white' : '#6a5840',
            boxShadow: activeCount > 0 ? '0 2px 8px rgba(16,78,46,.25)' : 'none',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
          Bộ lọc{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>

        {/* Search */}
        <div className="flex-1 min-w-[180px] relative">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8BAA8" strokeWidth="2" strokeLinecap="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            key={search}
            defaultValue={search}
            onKeyDown={e => { if (e.key === 'Enter') navigate({ q: (e.target as HTMLInputElement).value || null }); }}
            onBlur={e => { const v = e.target.value; if (v !== search) navigate({ q: v || null }); }}
            placeholder="Tìm tên, nghệ nhân..."
            className="w-full pl-10 pr-4 py-2.5 text-[13px] transition-all focus:outline-none"
            style={{
              background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
              border: `1px solid ${search ? '#1a6b3c' : '#E8DDD0'}`,
              borderRadius: '10px',
              color: '#1a1a1a',
            }}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#1a6b3c'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(16,78,46,0.08)'; }}
          />
        </div>

        {/* Sort chips */}
        <div className="hidden sm:flex items-center gap-1.5">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => navigate({ sort: opt.value !== 'popular' ? opt.value : null })}
              className="text-[12px] font-semibold px-3 py-2 rounded-lg transition-all duration-150"
              style={{
                background: sortBy === opt.value ? 'linear-gradient(to bottom, #1a6b3c, #104e2e)' : 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
                border: sortBy === opt.value ? 'none' : '1px solid #E8DDD0',
                color: sortBy === opt.value ? 'white' : '#6a5840',
                boxShadow: sortBy === opt.value ? '0 2px 8px rgba(16,78,46,.25)' : 'none',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Mobile sort select */}
        <select
          value={sortBy}
          onChange={e => navigate({ sort: e.target.value !== 'popular' ? e.target.value : null })}
          className="sm:hidden text-[12px] font-semibold py-2 px-3 cursor-pointer focus:outline-none"
          style={{
            background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
            border: '1px solid #E8DDD0',
            borderRadius: '10px',
            color: '#6a5840',
          }}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* View toggle */}
        <div className="hidden md:flex items-center gap-0.5 rounded-lg overflow-hidden" style={{ border: '1px solid #E8DDD0' }}>
          {([2, 3, 4] as const).map(n => (
            <button
              key={n}
              onClick={() => setCols(n)}
              className="w-8 h-8 flex items-center justify-center transition-all duration-150"
              style={{
                background: cols === n ? 'linear-gradient(to bottom, #1a6b3c, #104e2e)' : 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
                color: cols === n ? 'white' : '#9a8878',
              }}
              aria-label={`${n} cột`}
            >
              {VIEW_ICONS[n]}
            </button>
          ))}
        </div>

        {/* Count */}
        {totalCount > 0 && (
          <span className="text-[12px] ml-auto" style={{ color: '#9a8878' }}>
            <span className="font-bold" style={{ color: '#1a1a1a' }}>{startIdx}–{endIdx}</span>
            {' '}/{' '}{totalCount} sản phẩm
          </span>
        )}
      </div>

      {/* ── Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] gap-8 items-start">

        {/* ── Desktop sidebar ── */}
        <aside
          className="hidden md:block md:sticky md:top-24 rounded-2xl overflow-hidden"
          style={{
            background: '#FFFFFF',
            border: '1px solid #EDE5D8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)', zIndex: 1 }} />
          {sidebarContent}
        </aside>

        {/* ── Mobile filter drawer ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(26,15,5,0.4)', backdropFilter: 'blur(2px)' }}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <div
              className="absolute bottom-0 left-0 right-0 overflow-y-auto"
              style={{
                background: '#FFFFFF',
                borderRadius: '20px 20px 0 0',
                maxHeight: '85vh',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
              }}
            >
              {/* Handle */}
              <div className="flex items-center justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: '#EDE5D8' }} />
              </div>
              {/* Close button */}
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #EDE5D8' }}>
                <span className="text-[14px] font-bold" style={{ color: '#1a1a1a' }}>Bộ lọc</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: '#f5efe5', color: '#6a5840' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              {sidebarContent}
              {/* Apply button */}
              <div className="p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full text-[13px] font-bold text-white py-3.5 rounded-xl"
                  style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', boxShadow: '0 3px 10px rgba(16,78,46,.3)' }}
                >
                  Xem {totalCount} sản phẩm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Product grid ── */}
        <div>
          {products.length === 0 ? (
            <EmptyState onReset={() => router.push(pathname, { scroll: false })} />
          ) : (
            <>
              <div className={`grid ${gridClass} gap-4 md:gap-5`}>
                {products.map((product, idx) => <ProductCard key={product.id} product={product} priority={idx < 4} />)}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
                  <button
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)', border: '1px solid #E8DDD0', color: '#6a5840' }}
                    onMouseEnter={e => { if (currentPage !== 1) (e.currentTarget as HTMLElement).style.borderColor = '#1a6b3c'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>

                  {getPageNumbers().map((pg, idx) =>
                    pg === '...' ? (
                      <span key={`e-${idx}`} className="w-10 h-10 flex items-center justify-center text-sm select-none" style={{ color: '#C8BAA8' }}>…</span>
                    ) : (
                      <button
                        key={pg}
                        onClick={() => setPage(pg as number)}
                        className="w-10 h-10 flex items-center justify-center text-[13px] font-semibold rounded-xl transition-all duration-150"
                        style={pg === currentPage ? {
                          background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)',
                          color: 'white',
                          boxShadow: '0 2px 8px rgba(16,78,46,.3)',
                        } : {
                          background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
                          border: '1px solid #E8DDD0',
                          color: '#6a5840',
                        }}
                        onMouseEnter={e => { if (pg !== currentPage) (e.currentTarget as HTMLElement).style.borderColor = '#1a6b3c'; }}
                        onMouseLeave={e => { if (pg !== currentPage) (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }}
                      >
                        {pg}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)', border: '1px solid #E8DDD0', color: '#6a5840' }}
                    onMouseEnter={e => { if (currentPage !== totalPages) (e.currentTarget as HTMLElement).style.borderColor = '#1a6b3c'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
