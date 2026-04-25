'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { formatPrice } from '@/data/products';
import type { Product } from '@/data/products';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'newest' | 'bestseller';

/**
 * Image quality score — kết hợp 4 tín hiệu:
 *  1. Nguồn ảnh chính (R2/CDN > URL legacy storage > local > null/emoji)
 *  2. gallery.length — nhiều ảnh = đầu tư chụp kỹ
 *  3. price tier     — giá cao → ngân sách ảnh tốt hơn
 *  4. inStock        — sp active được maintain tốt hơn
 */
function getImageSourceScore(url: string | null | undefined): number {
  if (!url) return -10;
  if (url.includes('cdn.kaha.vn')) return 22;    // Custom CDN domain (studio processed)
  if (url.startsWith('https://pub-')) return 20;          // Cloudflare R2 legacy
  if (url.includes('.supabase.co/storage')) return 18;    // URL ảnh legacy (host cũ trong DB)
  if (url.startsWith('https://')) return 10;              // CDN khác
  if (url.startsWith('/images/')) return 3;               // Local git image
  if (url.startsWith('/')) return 1;                      // Other local
  return -10;                                             // Emoji / invalid
}

function imageQualityScore(p: Product): number {
  let score = 0;
  // Signal 1: Nguồn ảnh chính (trọng số cao nhất — phân biệt CDN vs broken)
  score += getImageSourceScore(p.image);
  // Signal 2: Gallery depth
  const n = p.images?.length ?? 1;
  score += n >= 8 ? 12 : n >= 5 ? 9 : n >= 4 ? 7 : n >= 3 ? 5 : n >= 2 ? 2 : 0;
  // Signal 3: Studio-processed photos (nền trắng/xám)
  // Dạng 1: den-hoa-14-longdenviet.webp  (suffix)
  // Dạng 2: longdenviet79179.webp         (prefix numeric ID)
  const fname = p.image?.split('/').pop() ?? '';
  if (fname.startsWith('longdenviet') || fname.includes('-longdenviet.')) score += 15;
  // Signal 4: Price tier
  if (p.price >= 1_500_000)    score += 3;
  else if (p.price >= 800_000) score += 2;
  else if (p.price >= 300_000) score += 1;
  else if (p.contactForPrice)  score += 1;
  // Signal 5: In-stock
  if (p.stock > 0) score += 1;
  // Penalty: ảnh kaha = chất lượng thấp, xuất hiện sau
  if (p.image?.toLowerCase().includes('kaha')) score -= 30;
  return score;
}

const DEFAULT_PRICE_MAX = 2_000_000;

const COLOR_SWATCHES: { value: string; label: string; hex: string; border?: string }[] = [
  { value: 'den',           label: 'Đen',        hex: '#1a1a1a' },
  { value: 'trang',         label: 'Trắng',      hex: '#f0ede8', border: '#d0c8bc' },
  { value: 'xam',           label: 'Xám',        hex: '#8a8a8a' },
  { value: 'nau',           label: 'Nâu',        hex: '#7B4F32' },
  { value: 'vang',          label: 'Vàng',       hex: '#c9a227' },
  { value: 'cam',           label: 'Cam',        hex: '#c9662a' },
  { value: 'hong',          label: 'Hồng',       hex: '#e0728a' },
  { value: 'tim',           label: 'Tím',        hex: '#7B5EA7' },
  { value: 'xanh-la',       label: 'Xanh Lá',   hex: '#3a7d44' },
  { value: 'xanh-duong',    label: 'Xanh Dương', hex: '#2980b9' },
  { value: 'xanh-hoc-sinh', label: 'Xanh Navy',  hex: '#2c4a8f' },
];

const COLOR_TAG_MAP: Record<string, string> = {
  'mau-den': 'den', 'den': 'den',
  'mau-trang': 'trang', 'trang': 'trang',
  'mau-xam': 'xam', 'xam': 'xam',
  'mau-nau': 'nau', 'nau': 'nau',
  'mau-vang': 'vang', 'vang': 'vang',
  'mau-cam': 'cam', 'cam': 'cam',
  'mau-hong': 'hong', 'hong': 'hong',
  'mau-tim': 'tim', 'tim': 'tim',
  'mau-xanh-la': 'xanh-la',
  'mau-xanh-duong': 'xanh-duong',
  'mau-xanh-hoc-sinh': 'xanh-hoc-sinh',
};

function getProductColor(product: Product): string {
  for (const tag of product.tags) {
    if (COLOR_TAG_MAP[tag]) return COLOR_TAG_MAP[tag];
  }
  const n = product.name.toLowerCase();
  if (n.includes('xanh học sinh') || n.includes('xanh hoc sinh') || n.includes('navy')) return 'xanh-hoc-sinh';
  if (n.includes('xanh lá') || n.includes('xanh la')) return 'xanh-la';
  if (n.includes('xanh dương') || n.includes('xanh duong') || n.includes('teal')) return 'xanh-duong';
  if (n.includes('màu đen') || n.includes('mau den')) return 'den';
  if (n.includes('màu trắng') || n.includes('mau trang')) return 'trang';
  if (n.includes('màu xám') || n.includes('mau xam')) return 'xam';
  if (n.includes('màu nâu') || n.includes('mau nau')) return 'nau';
  if (n.includes('màu vàng') || n.includes('mau vang') || n.includes('gold')) return 'vang';
  if (n.includes('màu cam') || n.includes('mau cam')) return 'cam';
  if (n.includes('màu hồng') || n.includes('mau hong') || n.includes('pink')) return 'hong';
  if (n.includes('màu tím') || n.includes('mau tim') || n.includes('purple')) return 'tim';
  return '';
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

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default',    label: 'Mặc định'  },
  { value: 'newest',     label: 'Mới nhất'  },
  { value: 'bestseller', label: 'Bán chạy'  },
  { value: 'price-asc',  label: 'Giá tăng'  },
  { value: 'price-desc', label: 'Giá giảm'  },
];

function Tick() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FilterRow({ label, count, selected, onClick, accent }: {
  label: string; count: number; selected: boolean; onClick: () => void; accent?: string;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group"
      style={{ background: selected ? 'rgba(16,78,46,0.06)' : 'transparent' }}
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
      <span className="text-[11px] tabular-nums font-medium" style={{ color: selected ? '#1a6b3c' : '#C8BAA8' }}>
        {count}
      </span>
    </div>
  );
}

function SectionHeader({ title, open, onClick, count }: {
  title: string; open: boolean; onClick: () => void; count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-3.5 transition-colors duration-150"
      style={{ background: 'transparent' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(250,247,242,0.7)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: '#9a8878' }}>
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

const VIEW_ICONS: Record<number, React.ReactNode> = {
  2: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="0" y="0" width="6" height="16" rx="1.5" fill="currentColor"/><rect x="10" y="0" width="6" height="16" rx="1.5" fill="currentColor"/></svg>,
  3: <svg width="13" height="13" viewBox="0 0 18 16" fill="none"><rect x="0" y="0" width="4.5" height="16" rx="1.2" fill="currentColor"/><rect x="6.75" y="0" width="4.5" height="16" rx="1.2" fill="currentColor"/><rect x="13.5" y="0" width="4.5" height="16" rx="1.2" fill="currentColor"/></svg>,
  4: <svg width="13" height="13" viewBox="0 0 20 16" fill="none"><rect x="0"  y="0" width="3.5" height="16" rx="1" fill="currentColor"/><rect x="5.5" y="0" width="3.5" height="16" rx="1" fill="currentColor"/><rect x="11" y="0" width="3.5" height="16" rx="1" fill="currentColor"/><rect x="16.5" y="0" width="3.5" height="16" rx="1" fill="currentColor"/></svg>,
};

interface Props { products: Product[]; defaultSort?: SortKey; categorySlug?: string }

export default function CategoryProductGrid({ products, defaultSort = 'default', categorySlug }: Props) {
  const [sort, setSort]           = useState<SortKey>(defaultSort);
  const [color, setColor]         = useState('');
  const [space, setSpace]         = useState('');
  const [badge, setBadge]         = useState('');
  const [region, setRegion]       = useState('');
  const [priceMax, setPriceMax]   = useState(DEFAULT_PRICE_MAX);
  const [inStockOnly, setInStock] = useState(false);
  const [page, setPage]           = useState(1);
  const [open, setOpen]           = useState({ color: true, space: true, badge: true, region: true, price: true });
  const [cols, setCols]           = useState<2 | 3 | 4>(4);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggle = (k: keyof typeof open) => setOpen(p => ({ ...p, [k]: !p[k] }));
  const resetPage = () => setPage(1);

  const colorCounts = useMemo(() => {
    const c: Record<string, number> = {};
    products.forEach(p => {
      const col = getProductColor(p);
      if (col) c[col] = (c[col] || 0) + 1;
    });
    return c;
  }, [products]);

  const hasColorFilter = Object.keys(colorCounts).length > 0;

  const spaceCounts = useMemo(() => {
    const c: Record<string, number> = {};
    products.forEach(p => p.space.forEach(s => { c[s] = (c[s] || 0) + 1; }));
    return c;
  }, [products]);

  const badgeCounts = useMemo(() => {
    const c: Record<string, number> = {};
    products.forEach(p => { if (p.badge) c[p.badge] = (c[p.badge] || 0) + 1; });
    return c;
  }, [products]);

  const regionCounts = useMemo(() => {
    const c: Record<string, number> = {};
    products.forEach(p => { if (p.makerRegion) c[p.makerRegion] = (c[p.makerRegion] || 0) + 1; });
    return c;
  }, [products]);

  const filtered = useMemo(() => {
    let r = [...products];
    if (color)  r = r.filter(p => getProductColor(p) === color);
    if (space)  r = r.filter(p => p.space.includes(space));
    if (badge)  r = r.filter(p => p.badge === badge);
    if (region) r = r.filter(p => p.makerRegion === region);
    if (priceMax < DEFAULT_PRICE_MAX) r = r.filter(p => p.price <= priceMax);
    if (inStockOnly) r = r.filter(p => p.stock > 0);
    switch (sort) {
      case 'default': r.sort((a, b) =>
        imageQualityScore(b) - imageQualityScore(a)
      ); break;
      case 'price-asc':  r.sort((a, b) => a.price - b.price); break;
      case 'price-desc': r.sort((a, b) => b.price - a.price); break;
      case 'newest':     r.sort((a, b) => Number(b.id) - Number(a.id)); break;
      case 'bestseller': r.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)); break;
    }
    return r;
  }, [products, color, space, badge, region, priceMax, inStockOnly, sort]);

  const PAGE_SIZE = 24;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage   = Math.min(page, Math.max(1, totalPages));
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const hasFilters = !!(color || space || badge || region || priceMax < DEFAULT_PRICE_MAX || inStockOnly);
  const activeCount = [color, space, badge, region, priceMax < DEFAULT_PRICE_MAX ? '1' : '', inStockOnly ? '1' : ''].filter(Boolean).length;

  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (color) activeChips.push({ label: COLOR_SWATCHES.find(c => c.value === color)?.label ?? color, onRemove: () => { setColor(''); resetPage(); } });
  if (space) activeChips.push({ label: SPACE_LABELS[space] ?? space, onRemove: () => { setSpace(''); resetPage(); } });
  if (badge) activeChips.push({ label: BADGE_META[badge]?.label ?? badge, onRemove: () => { setBadge(''); resetPage(); } });
  if (region) activeChips.push({ label: region, onRemove: () => { setRegion(''); resetPage(); } });
  if (priceMax < DEFAULT_PRICE_MAX) activeChips.push({ label: `≤ ${formatPrice(priceMax)}`, onRemove: () => { setPriceMax(DEFAULT_PRICE_MAX); resetPage(); } });
  if (inStockOnly) activeChips.push({ label: 'Còn hàng', onRemove: () => { setInStock(false); resetPage(); } });

  const clearAll = () => { setColor(''); setSpace(''); setBadge(''); setRegion(''); setPriceMax(DEFAULT_PRICE_MAX); setInStock(false); resetPage(); };

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (safePage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages];
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)' }}
        >
          <svg width="32" height="46" viewBox="0 0 60 86" fill="none" opacity="0.35">
            <line x1="30" y1="0" x2="30" y2="10" stroke="#104e2e" strokeWidth="2" strokeLinecap="round"/>
            <rect x="18" y="8" width="24" height="5" rx="1.5" fill="#104e2e"/>
            <path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#104e2e" strokeWidth="1.5" fill="rgba(16,78,46,0.08)"/>
            <rect x="18" y="74" width="24" height="5" rx="1.5" fill="#104e2e"/>
          </svg>
        </div>
        <p className="text-base font-semibold mb-2" style={{ color: '#4a4a4a' }}>Chưa có sản phẩm trong danh mục này</p>
        <p className="text-sm mb-6" style={{ color: '#9a8878' }}>Thử xem tất cả sản phẩm của chúng tôi</p>
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-white transition-all duration-200"
          style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', borderRadius: '12px', padding: '10px 22px', boxShadow: '0 3px 10px rgba(16,78,46,.28)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Xem tất cả sản phẩm
        </Link>
      </div>
    );
  }

  /* ── Shared sidebar content ── */
  const sidebarContent = (
    <>
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid #EDE5D8', background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)' }}
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2.2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
          <span className="text-[13px] font-bold" style={{ color: '#1a1a1a' }}>Bộ lọc</span>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center leading-none" style={{ background: '#1a6b3c' }}>
              {activeCount}
            </span>
          )}
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] font-semibold transition-colors"
            style={{ color: '#9a8878' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1a6b3c'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9a8878'; }}
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {activeChips.length > 0 && (
        <div className="px-4 py-3 flex flex-wrap gap-1.5" style={{ borderBottom: '1px solid #EDE5D8' }}>
          {activeChips.map((chip, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-[11px] font-semibold pl-2.5 pr-1.5 py-1 rounded-full" style={{ background: '#145530', color: '#F2B950' }}>
              {chip.label}
              <button
                onClick={chip.onRemove}
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.2)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'; }}
              >
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="7" y2="7"/><line x1="7" y1="1" x2="1" y2="7"/>
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Còn hàng toggle */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #EDE5D8' }}>
        <button
          onClick={() => { setInStock(v => !v); resetPage(); }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150"
          style={{ background: inStockOnly ? 'rgba(16,78,46,0.06)' : 'transparent' }}
          onMouseEnter={e => { if (!inStockOnly) (e.currentTarget as HTMLElement).style.background = 'rgba(250,247,242,0.9)'; }}
          onMouseLeave={e => { if (!inStockOnly) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center flex-shrink-0 transition-all duration-150"
              style={{
                background: inStockOnly ? '#1a6b3c' : 'transparent',
                border: inStockOnly ? '2px solid #1a6b3c' : '1.5px solid #D4C8B8',
              }}
            >
              {inStockOnly && <Tick />}
            </span>
            <span className="text-[13px]" style={{ color: inStockOnly ? '#145530' : '#4a4a4a', fontWeight: inStockOnly ? 600 : 400 }}>
              Còn hàng
            </span>
          </div>
          <span className="text-[11px] tabular-nums font-medium" style={{ color: inStockOnly ? '#1a6b3c' : '#C8BAA8' }}>
            {products.filter(p => p.stock > 0).length}
          </span>
        </button>
      </div>

      {hasColorFilter && (
        <div style={{ borderBottom: '1px solid #EDE5D8' }}>
          <SectionHeader title="Màu sắc" open={open.color} onClick={() => toggle('color')} count={color ? 1 : 0} />
          {open.color && (
            <div className="px-4 pb-4 pt-1">
              <div className="flex flex-wrap gap-2">
                {COLOR_SWATCHES.filter(sw => colorCounts[sw.value] > 0).map(sw => {
                  const isSelected = color === sw.value;
                  return (
                    <button
                      key={sw.value}
                      title={`${sw.label} (${colorCounts[sw.value]})`}
                      onClick={() => { setColor(isSelected ? '' : sw.value); resetPage(); }}
                      className="relative flex flex-col items-center gap-1 group"
                      style={{ outline: 'none' }}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150"
                        style={{
                          background: sw.hex,
                          border: isSelected
                            ? '2.5px solid #1a6b3c'
                            : `1.5px solid ${sw.border ?? 'rgba(0,0,0,0.15)'}`,
                          boxShadow: isSelected
                            ? '0 0 0 2px white, 0 0 0 4px #1a6b3c'
                            : '0 1px 3px rgba(0,0,0,0.12)',
                          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        }}
                      >
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <polyline
                              points="1.5,5 4,7.5 8.5,2.5"
                              stroke={['trang', 'vang', 'cam'].includes(sw.value) ? '#1a6b3c' : 'white'}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className="text-[10px] leading-tight text-center"
                        style={{ color: isSelected ? '#1a6b3c' : '#9a8878', fontWeight: isSelected ? 600 : 400, maxWidth: '36px' }}
                      >
                        {sw.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ borderBottom: '1px solid #EDE5D8' }}>
        <SectionHeader title="Không gian" open={open.space} onClick={() => toggle('space')} count={space ? 1 : 0} />
        {open.space && (
          <div className="px-3 pb-3">
            {Object.entries(SPACE_LABELS).map(([id, label]) => {
              const count = spaceCounts[id] ?? 0;
              if (!count) return null;
              return <FilterRow key={id} label={label} count={count} selected={space === id} onClick={() => { setSpace(space === id ? '' : id); resetPage(); }} />;
            })}
          </div>
        )}
      </div>

      <div style={{ borderBottom: '1px solid #EDE5D8' }}>
        <SectionHeader title="Nhãn sản phẩm" open={open.badge} onClick={() => toggle('badge')} count={badge ? 1 : 0} />
        {open.badge && (
          <div className="px-3 pb-3">
            {Object.entries(BADGE_META).map(([id, meta]) => {
              const count = badgeCounts[id] ?? 0;
              if (!count) return null;
              return <FilterRow key={id} label={meta.label} count={count} selected={badge === id} onClick={() => { setBadge(badge === id ? '' : id); resetPage(); }} accent={meta.color} />;
            })}
          </div>
        )}
      </div>

      <div style={{ borderBottom: '1px solid #EDE5D8' }}>
        <SectionHeader title="Khu vực nghệ nhân" open={open.region} onClick={() => toggle('region')} count={region ? 1 : 0} />
        {open.region && (
          <div className="px-3 pb-3">
            {Object.entries(regionCounts)
              .filter(([, c]) => c > 0)
              .sort(([a], [b]) => a.localeCompare(b, 'vi'))
              .map(([r, count]) => (
                <FilterRow key={r} label={r} count={count} selected={region === r} onClick={() => { setRegion(region === r ? '' : r); resetPage(); }} />
              ))}
          </div>
        )}
      </div>

      <div>
        <SectionHeader title="Khoảng giá" open={open.price} onClick={() => toggle('price')} />
        {open.price && (
          <div className="px-5 pb-5 pt-1">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-[11px]" style={{ color: '#C8BAA8' }}>100k</span>
              <span className="text-sm font-bold" style={{ color: '#1a6b3c' }}>{formatPrice(priceMax)}</span>
            </div>
            <input
              type="range" min={100000} max={2000000} step={50000} defaultValue={priceMax}
              onMouseUp={e => { setPriceMax(Number((e.target as HTMLInputElement).value)); resetPage(); }}
              onTouchEnd={e => { setPriceMax(Number((e.target as HTMLInputElement).value)); resetPage(); }}
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
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[cols];

  return (
    <div>
      {/* ── Toolbar — sticky on scroll ── */}
      <div className="sticky top-0 z-20 -mx-4 px-4 md:-mx-0 md:px-0 pb-3 pt-2" style={{ background: '#FAF7F2' }}>
      <div className="flex flex-wrap items-center gap-2.5">

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

        {/* Sort chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setSort(opt.value); resetPage(); }}
              className="text-[12px] font-semibold px-3 py-2 rounded-lg transition-all duration-150"
              style={{
                background: sort === opt.value ? 'linear-gradient(to bottom, #1a6b3c, #104e2e)' : 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
                border: sort === opt.value ? 'none' : '1px solid #E8DDD0',
                color: sort === opt.value ? 'white' : '#6a5840',
                boxShadow: sort === opt.value ? '0 2px 8px rgba(16,78,46,.25)' : 'none',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="hidden md:flex items-center gap-0.5 rounded-lg overflow-hidden ml-auto" style={{ border: '1px solid #E8DDD0' }}>
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

        <span className="text-[12px] md:ml-4" style={{ color: '#9a8878' }}>
          <span className="font-semibold" style={{ color: '#1a1a1a' }}>{filtered.length}</span> sản phẩm
          {totalPages > 1 && <span className="ml-1">· Trang {safePage}/{totalPages}</span>}
        </span>
      </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">

        {/* ── Desktop sidebar ── */}
        <aside
          className="hidden md:block md:sticky md:top-24 rounded-2xl overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          {sidebarContent}
        </aside>

        {/* ── Mobile filter drawer ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(26,15,5,0.4)', backdropFilter: 'blur(2px)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <div
              className="absolute bottom-0 left-0 right-0 overflow-y-auto"
              style={{ background: '#FFFFFF', borderRadius: '20px 20px 0 0', maxHeight: '85vh', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
            >
              <div className="flex items-center justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: '#EDE5D8' }} />
              </div>
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
              <div className="p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full text-[13px] font-bold text-white py-3.5 rounded-xl"
                  style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', boxShadow: '0 3px 10px rgba(16,78,46,.3)' }}
                >
                  Xem {filtered.length} sản phẩm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Product grid ── */}
        <div>
          {paginated.length === 0 ? (
            <div className="text-center py-24">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8b8a0" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p className="text-[15px] font-semibold mb-2" style={{ color: '#4a4a4a' }}>Không tìm thấy sản phẩm phù hợp</p>
              <button
                onClick={clearAll}
                className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold text-white transition-all"
                style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', borderRadius: '12px', padding: '10px 22px', boxShadow: '0 3px 10px rgba(16,78,46,.28)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className={`grid ${gridClass} gap-4 md:gap-5`}>
                {paginated.map((product, idx) => <ProductCard key={product.id} product={product} priority={idx < 4} />)}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)', border: '1px solid #E8DDD0', color: '#6a5840' }}
                    onMouseEnter={e => { if (safePage !== 1) (e.currentTarget as HTMLElement).style.borderColor = '#1a6b3c'; }}
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
                        style={pg === safePage ? {
                          background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)',
                          color: 'white',
                          boxShadow: '0 2px 8px rgba(16,78,46,.3)',
                        } : {
                          background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
                          border: '1px solid #E8DDD0',
                          color: '#6a5840',
                        }}
                        onMouseEnter={e => { if (pg !== safePage) (e.currentTarget as HTMLElement).style.borderColor = '#1a6b3c'; }}
                        onMouseLeave={e => { if (pg !== safePage) (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }}
                      >
                        {pg}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)', border: '1px solid #E8DDD0', color: '#6a5840' }}
                    onMouseEnter={e => { if (safePage !== totalPages) (e.currentTarget as HTMLElement).style.borderColor = '#1a6b3c'; }}
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
    </div>
  );
}
