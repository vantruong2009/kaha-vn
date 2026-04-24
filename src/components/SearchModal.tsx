'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/data/products';
import { trackSearch } from '@/lib/analytics';
import { productAlt } from '@/lib/image-seo';

// ── Search history ────────────────────────────────────────────────────────────
const HISTORY_KEY = 'ldv_search_history';
function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]'); } catch { return []; }
}
function pushHistory(q: string) {
  const prev = getHistory().filter(h => h.toLowerCase() !== q.toLowerCase());
  localStorage.setItem(HISTORY_KEY, JSON.stringify([q, ...prev].slice(0, 6)));
}

interface Props {
  onClose: () => void;
  storePhone?: string;
  storeEmail?: string;
  storeAddress?: string;
  mapsUrl?: string;
}

interface SearchProduct {
  id: string;
  slug: string;
  name: string;
  nameShort: string;
  image: string;
  category: string;
  price: number;
  priceOriginal?: number;
}

interface SearchPost {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  thumbnail: string | null;
}

interface SearchCategory {
  label: string;
  href: string;
  catSlug: string;
  sub: string;
  badge: string | null;
  iconType: string;
}

interface SearchResults {
  products: SearchProduct[];
  categories: SearchCategory[];
  posts: SearchPost[];
}

type Tab = 'all' | 'products' | 'categories' | 'posts';

// ── Category definitions ──────────────────────────────────────────────────────
const QUICK_CATS = [
  { label: 'Đèn Lồng Hội An',   sub: 'Thủ công truyền thống', href: '/c/hoi-an-lantern',  catSlug: 'hoi-an-lantern',  from: '#FEF3E0', to: '#F5C97C', iconColor: '#B06A0A', badge: 'Bestseller', iconType: 'hoian' },
  { label: 'Đèn Vải & Lụa',     sub: 'Cao cấp, tinh tế',      href: '/c/den-vai-cao-cap', catSlug: 'den-vai-cao-cap', from: '#F2ECF8', to: '#D5B0F0', iconColor: '#7B2FA0', badge: null,         iconType: 'vai' },
  { label: 'Đèn Tết & Lễ Hội',  sub: 'Mùa lễ hội 2026',       href: '/c/den-long-tet',    catSlug: 'den-long-tet',    from: '#FFF0EC', to: '#F8A080', iconColor: '#C0380A', badge: 'Hot',        iconType: 'tet' },
  { label: 'Đèn Tre & Mây',     sub: 'Nguyên liệu bản địa',   href: '/c/den-may-tre',     catSlug: 'den-may-tre',     from: '#E8F5E0', to: '#A8DC88', iconColor: '#2A7040', badge: null,         iconType: 'tre' },
  { label: 'Phong Cách Nhật',   sub: 'Zen & minimalist',       href: '/c/den-kieu-nhat',   catSlug: 'den-kieu-nhat',   from: '#E8F2FF', to: '#A8C8F8', iconColor: '#1848A0', badge: null,         iconType: 'nhat' },
  { label: 'Quà Tặng & B2B',    sub: 'Set quà doanh nghiệp',  href: '/san-pham',          catSlug: 'qua-tang',        from: '#FFF8E0', to: '#F5D060', iconColor: '#9A6800', badge: null,         iconType: 'qua' },
];

const CAT_PHOTOS: Record<string, string> = {
  'hoi-an-lantern':  '/images/cat/cat-hoian-longdenviet.webp',
  'den-vai-cao-cap': '/images/cat/cat-vai-longdenviet.webp',
  'den-long-tet':    '/images/cat/cat-tet-longdenviet.webp',
  'den-may-tre':     '/images/cat/cat-tre-longdenviet.webp',
  'den-kieu-nhat':   '/images/cat/cat-nhat-longdenviet.webp',
  'qua-tang':        '/images/cat/cat-qua-longdenviet.webp',
};

const TRENDING = [
  { label: 'Đèn Hội An',     href: '/c/hoi-an-lantern' },
  { label: 'Đèn Tết 2026',   href: '/c/den-long-tet' },
  { label: 'Bán chạy nhất',  href: '/san-pham' },
  { label: 'Đặt sỉ B2B',    href: '/lien-he' },
  { label: 'Quà tặng',       href: '/san-pham' },
];

// ── Category SVG icons ─────────────────────────────────────────────────────
function CatIcon({ type, color }: { type: string; color: string }) {
  const s = { stroke: color, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (type === 'hoian') return (
    <svg width="26" height="26" viewBox="0 0 26 26" {...s} strokeWidth="1.35">
      <path d="M13 2v2.5" strokeWidth="1.5"/>
      <path d="M10.5 4.5h5"/>
      <path d="M8 7Q8 4.5 13 4.5Q18 4.5 18 7L20 18Q20 23 13 23Q6 23 6 18Z" fill={color} fillOpacity="0.14"/>
      <path d="M8 7Q8 4.5 13 4.5Q18 4.5 18 7L20 18Q20 23 13 23Q6 23 6 18Z"/>
      <line x1="6" y1="11" x2="20" y2="11" strokeWidth="1"/>
      <line x1="6" y1="15.5" x2="20" y2="15.5" strokeWidth="1"/>
      <path d="M11.5 23v3.5M14.5 23v3.5" strokeWidth="1.1"/>
      <path d="M10 26.5h6" strokeWidth="1.2"/>
    </svg>
  );
  if (type === 'vai') return (
    <svg width="26" height="26" viewBox="0 0 26 26" {...s} strokeWidth="1.35">
      <path d="M13 3C9 3 7.5 6.5 7.5 10v10c0 2 2 3 5.5 3s5.5-1 5.5-3V10C18.5 6.5 17 3 13 3Z" fill={color} fillOpacity="0.12"/>
      <path d="M13 3C9 3 7.5 6.5 7.5 10v10c0 2 2 3 5.5 3s5.5-1 5.5-3V10C18.5 6.5 17 3 13 3Z"/>
      <path d="M9 9Q13 7 17 9" strokeWidth="1"/>
      <path d="M9 13Q13 11 17 13" strokeWidth="1"/>
      <path d="M9 17Q13 15 17 17" strokeWidth="1"/>
    </svg>
  );
  if (type === 'tet') return (
    <svg width="26" height="26" viewBox="0 0 26 26" {...s} strokeWidth="1.35">
      <path d="M13 2v2.5" strokeWidth="1.5"/>
      <path d="M10.5 4.5h5"/>
      <path d="M7.5 7.5Q7.5 4.5 13 4.5Q18.5 4.5 18.5 7.5L21 19Q21 24 13 24Q5 24 5 19Z" fill={color} fillOpacity="0.14"/>
      <path d="M7.5 7.5Q7.5 4.5 13 4.5Q18.5 4.5 18.5 7.5L21 19Q21 24 13 24Q5 24 5 19Z"/>
      <line x1="5" y1="11" x2="21" y2="11" strokeWidth="1"/>
      <line x1="5" y1="15" x2="21" y2="15" strokeWidth="1"/>
      <circle cx="13" cy="19" r="1.5" fill={color} fillOpacity="0.7" strokeWidth="0"/>
    </svg>
  );
  if (type === 'tre') return (
    <svg width="26" height="26" viewBox="0 0 26 26" {...s} strokeWidth="1.35">
      <ellipse cx="13" cy="14" rx="6" ry="9.5" fill={color} fillOpacity="0.13"/>
      <ellipse cx="13" cy="14" rx="6" ry="9.5"/>
      <line x1="7" y1="10.5" x2="19" y2="10.5" strokeWidth="1"/>
      <line x1="7" y1="14" x2="19" y2="14" strokeWidth="1"/>
      <line x1="7" y1="17.5" x2="19" y2="17.5" strokeWidth="1"/>
      <path d="M13 4.5v-2.5" strokeWidth="1.4"/>
      <path d="M11 2h4" strokeWidth="1.2"/>
    </svg>
  );
  if (type === 'nhat') return (
    <svg width="26" height="26" viewBox="0 0 26 26" {...s} strokeWidth="1.35">
      <rect x="7" y="5" width="12" height="16" rx="2" fill={color} fillOpacity="0.13"/>
      <rect x="7" y="5" width="12" height="16" rx="2"/>
      <line x1="7" y1="11" x2="19" y2="11" strokeWidth="1"/>
      <line x1="7" y1="16" x2="19" y2="16" strokeWidth="1"/>
      <path d="M13 2v3" strokeWidth="1.4"/>
      <path d="M13 21v3" strokeWidth="1.4"/>
      <circle cx="13" cy="13.5" r="1.8" fill={color} fillOpacity="0.4" strokeWidth="0"/>
    </svg>
  );
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" {...s} strokeWidth="1.35">
      <rect x="4" y="12" width="18" height="12" rx="1.5" fill={color} fillOpacity="0.12"/>
      <rect x="4" y="12" width="18" height="12" rx="1.5"/>
      <rect x="3.5" y="8" width="19" height="5" rx="1.2" fill={color} fillOpacity="0.1"/>
      <rect x="3.5" y="8" width="19" height="5" rx="1.2"/>
      <line x1="13" y1="8" x2="13" y2="24" strokeWidth="1"/>
      <path d="M13 8 Q11 5 9 6Q7 7 9 9Q11 10 13 8Q15 6 17 7Q19 8 17 10Q15 11 13 8" strokeWidth="1.1" fill="none"/>
    </svg>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function highlight(text: string, q: string): React.ReactNode {
  if (!q.trim()) return text;
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} style={{ background: '#FEF9E7', color: '#104e2e', borderRadius: 2, padding: '0 1px', fontStyle: 'normal' }}>{part}</mark>
      : part
  );
}

function isValidUrl(s: string) {
  return s && (s.startsWith('http') || s.startsWith('/'));
}

function formatPostDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return ''; }
}

const CAT_LABEL_MAP: Record<string, string> = {
  'hoi-an-lantern':  'Đèn Lồng Hội An',
  'den-vai-cao-cap': 'Đèn Vải & Lụa',
  'den-long-tet':    'Đèn Tết & Lễ Hội',
  'den-may-tre':     'Đèn Tre & Mây',
  'den-kieu-nhat':   'Phong Cách Nhật',
  'den-long-go':     'Đèn Gỗ',
  'den-san':         'Đèn Sàn',
  'den-tha-tran':    'Đèn Thả Trần',
  'ngoai-troi':      'Ngoài Trời',
  'phong-khach':     'Phòng Khách',
  'den-quan-cafe':   'Quán Cafe',
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function SearchModal({ onClose, storePhone, storeEmail, storeAddress, mapsUrl }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({ products: [], categories: [], posts: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [history, setHistory] = useState<string[]>([]);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Category sample images — no longer preloaded from static data
  const catImages: Record<string, string[]> = {};

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch search results from API
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
      setSearchResults({ products: [], categories: [], posts: [] });
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })
      .then(r => r.json())
      .then((data: SearchResults) => { setSearchResults(data); setSearchLoading(false); })
      .catch(err => { if (err.name !== 'AbortError') setSearchLoading(false); });
    return () => controller.abort();
  }, [debouncedQuery]);

  // Track search
  useEffect(() => {
    if (debouncedQuery.trim().length > 2) trackSearch(debouncedQuery);
  }, [debouncedQuery]);

  // Reset tab + focused khi query thay đổi
  useEffect(() => { setActiveTab('all'); setFocusedIdx(-1); }, [debouncedQuery]);

  // Load history khi mở
  useEffect(() => { setHistory(getHistory()); }, []);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    // Chỉ lock scroll trên desktop; mobile giữ bottom nav hiển thị
    if (window.innerWidth >= 768) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const isSearching = debouncedQuery.trim().length >= 2 || query.trim().length >= 2;
  const totalProducts = searchResults.products.length;
  const totalCategories = searchResults.categories.length;
  const totalPosts = searchResults.posts.length;
  const totalAll = totalProducts + totalCategories + totalPosts;
  const hasResults = totalAll > 0;

  // Visible items per tab
  const visibleProducts   = activeTab === 'products'   ? searchResults.products   : searchResults.products.slice(0, 5);
  const visibleCategories = activeTab === 'categories' ? searchResults.categories : searchResults.categories.slice(0, 4);
  const visiblePosts      = activeTab === 'posts'      ? searchResults.posts      : searchResults.posts.slice(0, 3);

  // Flat list cho keyboard navigation
  const flatItems = useMemo(() => {
    if (!hasResults) return [];
    return [
      ...visibleProducts.map(p => ({ href: `/p/${p.slug}`, label: p.name })),
      ...visibleCategories.map(c => ({ href: c.href, label: c.label })),
      ...visiblePosts.map(p => ({ href: `/blog/${p.slug}`, label: p.title })),
    ];
  }, [visibleProducts, visibleCategories, visiblePosts, hasResults]);

  // Navigate đến kết quả + lưu history
  const navigateTo = useCallback((href: string, q: string) => {
    if (q.trim().length >= 2) { pushHistory(q.trim()); setHistory(getHistory()); }
    router.push(href);
    onClose();
  }, [router, onClose]);

  // Keyboard: ArrowDown/Up/Enter
  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx(i => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (focusedIdx >= 0 && flatItems[focusedIdx]) {
        e.preventDefault();
        navigateTo(flatItems[focusedIdx].href, query);
      } else if (query.trim().length >= 2) {
        navigateTo(`/san-pham?q=${encodeURIComponent(query.trim())}`, query);
      }
    }
  }, [flatItems, focusedIdx, query, navigateTo]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/50 md:bg-black/60 md:backdrop-blur-[4px] md:items-center md:justify-center md:px-4"
      onClick={handleBackdropClick}
    >
      {/* Panel */}
      <div
        className="w-full flex flex-col rounded-t-2xl overflow-hidden md:max-w-[600px] md:rounded-2xl md:shadow-2xl"
        style={{ background: '#FFFDF8', maxHeight: '78vh', maxWidth: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="md:hidden flex justify-center pt-2.5 pb-1 shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ background: '#D8CFC4' }} />
        </div>
        {/* ── Search bar ──────────────────────────────────────── */}
        <div
          className="flex items-center gap-2.5 px-3.5 shrink-0"
          style={{
            borderBottom: '1px solid #EDE7DA',
            paddingTop: 'calc(max(10px, env(safe-area-inset-top, 0px)) + 6px)',
            paddingBottom: '10px',
          }}
        >
          <div className="shrink-0 relative w-7 h-7" style={{ color: '#104e2e' }}>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" className="absolute top-0 left-0 z-10" style={{ opacity: 0.9 }}>
              <path d="M5 0L5.9 3.5L9.5 5L5.9 6.5L5 10L4.1 6.5L0.5 5L4.1 3.5Z"/>
            </svg>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-0 right-0">
              <circle cx="11" cy="11" r="7.5"/>
              <line x1="17" y1="17" x2="21" y2="21"/>
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Tìm sản phẩm, danh mục, bài viết..."
            className="flex-1 min-w-0 text-[15px] text-[#1a1a1a] placeholder:text-[#ccc] bg-transparent outline-none font-medium"
            onKeyDown={handleInputKeyDown}
          />

          {query ? (
            <button
              onClick={() => { setQuery(''); setDebouncedQuery(''); }}
              aria-label="Xóa"
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-opacity active:opacity-60"
              style={{ background: '#EDE7DA', color: '#888' }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          ) : null}

          <button
            onClick={onClose}
            className="shrink-0 hidden md:flex items-center text-[11px] font-semibold px-2 py-1 rounded-lg transition-all active:scale-95"
            style={{ border: '1px solid rgba(16,78,46,0.15)', color: '#1a6b3c', background: 'rgba(246,242,236,0.92)' }}
          >
            ESC
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto md:max-h-[calc(100vh-160px)]"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >

          {/* ════ EMPTY STATE ══════════════════════════════════ */}
          {!isSearching && (
            <>
              {/* Promo banner */}
              <div
                className="mx-3 mt-3 mb-0 rounded-xl overflow-hidden flex items-center gap-3 px-4 py-3"
                style={{ background: 'linear-gradient(110deg, #C9822A 0%, #A0601A 100%)' }}
              >
                <svg width="28" height="36" viewBox="0 0 28 38" fill="none" className="shrink-0">
                  <path d="M14 1v3" stroke="#FFF8E8" strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M11 4h6" stroke="#FFF8E8" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M6 8Q6 4 14 4Q22 4 22 8L25 24Q25 30 14 30Q3 30 3 24Z" fill="#FFF8E8" fillOpacity="0.18" stroke="#FFF8E8" strokeWidth="1.4"/>
                  <line x1="3" y1="13" x2="25" y2="13" stroke="#FFF8E8" strokeWidth="1" strokeOpacity="0.7"/>
                  <line x1="3" y1="19" x2="25" y2="19" stroke="#FFF8E8" strokeWidth="1" strokeOpacity="0.7"/>
                  <path d="M12 30v4M16 30v4" stroke="#FFF8E8" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M10 34h8" stroke="#FFF8E8" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-white leading-tight">Miễn phí giao hàng đơn từ 500k</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>Đặt sỉ & B2B giảm 15–30% · Hỗ trợ 24/7</div>
                </div>
                <Link href="/lien-he" onClick={onClose} className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 whitespace-nowrap" style={{ background: 'rgba(255,255,255,0.88)', color: '#8a4e10', border: '1px solid rgba(255,255,255,0.6)' }}>
                  Liên hệ
                </Link>
              </div>

              {/* Recent searches */}
              {history.length > 0 && (
                <div className="px-3.5 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#C5B08A' }}>Tìm kiếm gần đây</span>
                    <button onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]); }} className="text-[10px] font-medium" style={{ color: '#BBA888' }}>Xoá</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {history.map(h => (
                      <button key={h} onClick={() => setQuery(h)}
                        className="flex items-center gap-1 text-[12px] font-medium px-3 py-1.5 rounded-full transition-colors"
                        style={{ background: '#F2EDE5', color: '#5A4A35', border: '1px solid #E5DDD0' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending searches */}
              <div className="flex items-center gap-1.5 px-3.5 pt-3 pb-1 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#BBA888' }}>Xu hướng:</span>
                {TRENDING.map((t, i) => (
                  <span key={t.href + t.label} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-[#DDD] text-[10px]">·</span>}
                    <Link href={t.href} onClick={onClose} className="text-[12px] font-medium transition-colors hover:text-brand-green" style={{ color: '#7A6A55' }}>
                      {t.label}
                    </Link>
                  </span>
                ))}
              </div>

              {/* Danh mục */}
              <div className="px-3.5 pt-3 pb-2 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#C5B08A' }}>Danh mục chính</span>
                <div className="flex-1 h-px" style={{ background: '#EDE7DA' }}/>
              </div>
              <div className="px-3 grid grid-cols-2 gap-2">
                {QUICK_CATS.map(cat => {
                  const count = 0;
                  return (
                    <Link key={cat.catSlug} href={cat.href} onClick={onClose} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all active:scale-[0.97] group" style={{ background: 'white', border: '1.5px solid #EDE8DF' }}>
                      <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${cat.from} 0%, ${cat.to} 100%)` }}>
                        {CAT_PHOTOS[cat.catSlug] ? (
                          <img src={CAT_PHOTOS[cat.catSlug]} alt={cat.label} className="w-full h-full object-cover" loading="lazy"/>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CatIcon type={cat.iconType} color={cat.iconColor} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-bold leading-tight truncate group-hover:text-brand-green transition-colors" style={{ color: '#1a1a1a' }}>{cat.label}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px]" style={{ color: '#BBAA90' }}>{count > 0 ? `${count} sp` : cat.sub}</span>
                          {cat.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={cat.badge === 'Hot' ? { background: '#FFF0F0', color: '#D03030', border: '1px solid #FFD0D0' } : { background: '#FEF8E8', color: '#B06A0A', border: '1px solid #F5D888' }}>
                              {cat.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8B898" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 -mr-0.5 group-hover:stroke-brand-green transition-colors">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </Link>
                  );
                })}
              </div>

              {/* View all */}
              <div className="px-3 mt-2">
                <Link href="/san-pham" onClick={onClose} className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all active:scale-[0.98] group" style={{ background: 'linear-gradient(110deg, #EAF5EE 0%, #D8EDDF 100%)', border: '1.5px solid #B8D8C4' }}>
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: '#104e2e' }}>Xem tất cả 800+ sản phẩm</div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#5A9A70' }}>Đèn gỗ · Ngoài trời · Nhà hàng · Resort · Sự kiện</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>

            </>
          )}

          {/* ════ LOADING ══════════════════════════════════════ */}
          {isSearching && searchLoading && (
            <div className="flex items-center justify-center gap-2 py-10 text-[13px]" style={{ color: '#BBA888' }}>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Đang tìm kiếm...
            </div>
          )}

          {/* ════ NO RESULTS ════════════════════════════════════ */}
          {isSearching && !searchLoading && !hasResults && (
            <div className="py-10 text-center px-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#F5EFE4' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C0A870" strokeWidth="1.7" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div className="text-[14px] font-bold mb-1" style={{ color: '#1a1a1a' }}>Không tìm thấy kết quả</div>
              <div className="text-[12px] mb-4" style={{ color: '#AAA' }}>Thử từ khoá khác hoặc xem danh mục</div>
              <div className="flex justify-center gap-2 flex-wrap mb-4">
                {['đèn lồng', 'hội an', 'đèn tre', 'quà tặng'].map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="text-[12px] font-semibold px-3 py-1.5 rounded-full transition-colors" style={{ background: '#F0F8F3', border: '1px solid #C8E0D0', color: '#104e2e' }}>
                    {s}
                  </button>
                ))}
              </div>
              <Link href="/lien-he" onClick={onClose} className="inline-flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: '#C9822A' }}>
                Tư vấn trực tiếp
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          )}

          {/* ════ RESULTS ════════════════════════════════════════ */}
          {isSearching && !searchLoading && hasResults && (() => {
            const pOffset = 0;
            const cOffset = visibleProducts.length;
            const bOffset = cOffset + visibleCategories.length;
            return (
            <div>
              {/* ── Tab bar ── */}
              <div className="flex gap-1.5 px-3 pt-3 pb-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {([
                  { id: 'all' as Tab,        label: `Tất cả`,              count: totalAll },
                  totalProducts > 0  && { id: 'products' as Tab,   label: `Sản phẩm`,  count: totalProducts },
                  totalCategories > 0 && { id: 'categories' as Tab, label: `Danh mục`, count: totalCategories },
                  totalPosts > 0     && { id: 'posts' as Tab,       label: `Bài viết`,  count: totalPosts },
                ] as const).filter(Boolean).map(tab => {
                  if (!tab) return null;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="shrink-0 text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all"
                      style={isActive
                        ? { background: '#104e2e', color: 'white' }
                        : { background: '#F2EDE5', color: '#7A6A55', border: '1px solid #E5DDD0' }
                      }
                    >
                      {tab.label} <span style={{ opacity: 0.7 }}>({tab.count})</span>
                    </button>
                  );
                })}
              </div>

              {/* ── Categories section ── */}
              {(activeTab === 'all' || activeTab === 'categories') && visibleCategories.length > 0 && (
                <div className="mt-3">
                  <SectionHeader label="Danh mục" />
                  <div className="px-3 grid grid-cols-2 gap-2">
                    {visibleCategories.map((cat, ci) => (
                      <Link key={cat.catSlug} href={cat.href} onClick={() => navigateTo(cat.href, query)} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all active:scale-[0.97] group" style={{ background: focusedIdx === cOffset + ci ? '#F0F8F3' : 'white', border: focusedIdx === cOffset + ci ? '1.5px solid #104e2e' : '1.5px solid #EDE8DF' }}>
                        <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden relative" style={{ background: '#F5EFE4' }}>
                          {CAT_PHOTOS[cat.catSlug] ? (
                            <img src={CAT_PHOTOS[cat.catSlug]} alt={cat.label} className="w-full h-full object-cover" loading="lazy"/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C0A870" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M4 6h16M4 12h16M4 18h16"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[12px] font-bold leading-tight truncate group-hover:text-brand-green transition-colors" style={{ color: '#1a1a1a' }}>
                            {highlight(cat.label, debouncedQuery)}
                          </div>
                          <div className="text-[10px] truncate mt-0.5" style={{ color: '#BBAA90' }}>{cat.sub}</div>
                        </div>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C8B898" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 group-hover:stroke-brand-green transition-colors">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Products section ── */}
              {(activeTab === 'all' || activeTab === 'products') && visibleProducts.length > 0 && (
                <div className="mt-3">
                  <SectionHeader label="Sản phẩm" />
                  {visibleProducts.map((product, i) => (
                    <Link
                      key={product.id}
                      href={`/p/${product.slug}`}
                      onClick={() => navigateTo(`/p/${product.slug}`, query)}
                      className="flex items-center gap-3 px-3.5 py-2.5 transition-colors group"
                      style={{ borderTop: i === 0 ? 'none' : '1px solid #F5EFE4', background: focusedIdx === pOffset + i ? '#F0F8F3' : undefined }}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ background: '#F5F0E8', border: '1px solid #EDE8DF' }}>
                        {isValidUrl(product.image) ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy"/>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CatIcon type="hoian" color="#C0A870" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold leading-tight line-clamp-1 group-hover:text-brand-green transition-colors" style={{ color: '#1a1a1a' }}>
                          {highlight(product.name, debouncedQuery)}
                        </div>
                        <div className="text-[10px] mt-0.5 truncate" style={{ color: '#BBA888' }}>
                          {CAT_LABEL_MAP[product.category] ?? product.category}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[13px] font-bold" style={{ color: '#104e2e' }}>{formatPrice(product.price)}</div>
                        {product.priceOriginal && product.priceOriginal > product.price && (
                          <div className="text-[10px] line-through" style={{ color: '#CCC' }}>{formatPrice(product.priceOriginal)}</div>
                        )}
                      </div>
                    </Link>
                  ))}
                  {activeTab === 'all' && totalProducts > 5 && (
                    <button onClick={() => setActiveTab('products')} className="w-full text-[11px] font-semibold py-2 text-center transition-colors hover:text-brand-green" style={{ color: '#C0A870', borderTop: '1px solid #F5EFE4' }}>
                      Xem thêm {totalProducts - 5} sản phẩm nữa
                    </button>
                  )}
                </div>
              )}

              {/* ── Posts section ── */}
              {(activeTab === 'all' || activeTab === 'posts') && visiblePosts.length > 0 && (
                <div className="mt-3">
                  <SectionHeader label="Bài viết" />
                  {visiblePosts.map((post, i) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      onClick={() => navigateTo(`/blog/${post.slug}`, query)}
                      className="flex items-center gap-3 px-3.5 py-2.5 transition-colors group"
                      style={{ borderTop: i === 0 ? 'none' : '1px solid #F5EFE4', background: focusedIdx === bOffset + i ? '#F0F8F3' : undefined }}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#F5EFE4] flex-shrink-0" style={{ border: '1px solid #EDE8DF' }}>
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" loading="lazy"/>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C0A870" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                              <line x1="16" y1="13" x2="8" y2="13"/>
                              <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold leading-tight line-clamp-2 group-hover:text-brand-green transition-colors" style={{ color: '#1a1a1a' }}>
                          {highlight(post.title, debouncedQuery)}
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: '#BBA888' }}>{formatPostDate(post.date)}</div>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8B898" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 group-hover:stroke-brand-green transition-colors">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </Link>
                  ))}
                  {activeTab === 'all' && totalPosts > 3 && (
                    <button onClick={() => setActiveTab('posts')} className="w-full text-[11px] font-semibold py-2 text-center transition-colors hover:text-brand-green" style={{ color: '#C0A870', borderTop: '1px solid #F5EFE4' }}>
                      Xem thêm {totalPosts - 3} bài viết nữa
                    </button>
                  )}
                </div>
              )}

              {/* ── View all results ── */}
              {(activeTab === 'all' || activeTab === 'products') && (
                <Link
                  href={`/san-pham?q=${encodeURIComponent(query)}`}
                  onClick={() => navigateTo(`/san-pham?q=${encodeURIComponent(query)}`, query)}
                  className="flex items-center justify-between px-3.5 py-3.5 mt-2 transition-colors group hover:bg-[#FAF7F2]"
                  style={{ borderTop: '1.5px solid #EDE7DA' }}
                >
                  <span className="text-[13px] font-semibold group-hover:underline" style={{ color: '#104e2e' }}>
                    Xem tất cả kết quả cho &ldquo;{query}&rdquo;
                  </span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              )}
            </div>
            );
          })()}
        </div>

        {/* Close button — bottom, mobile only */}
        <div className="md:hidden shrink-0 px-4 py-3" style={{ borderTop: '1px solid #EDE7DA', background: '#FFFDF8' }}>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(to bottom, #f5efe5, #ede5d8)', color: '#104e2e', border: '1px solid #E0D4C4' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Đóng tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-3.5 pt-1 pb-2 flex items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#C5B08A' }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: '#EDE7DA' }}/>
    </div>
  );
}

// ── Contact Section (unchanged from original) ────────────────────────────────
function ContactSection({ storePhone, storeEmail, storeAddress, mapsUrl, onClose }: {
  storePhone?: string; storeEmail?: string; storeAddress?: string; mapsUrl?: string; onClose: () => void;
}) {
  return (
    <div className="px-3 pt-4 pb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#C5B08A' }}>Liên hệ nhanh</span>
        <div className="flex-1 h-px" style={{ background: '#EDE7DA' }}/>
      </div>
      <div className="rounded-2xl overflow-hidden mb-3" style={{ border: '1.5px solid #EDE8DF', background: 'white' }}>
        {storePhone && (
          <a href={`tel:${storePhone.replace(/\D/g, '')}`} className="flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-[#FAF7F2] group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#E8F5EE' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#104e2e" stroke="none">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.19 2.2z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#BBAA90' }}>Hotline</div>
              <div className="text-[14px] font-bold tracking-wide group-hover:text-brand-green transition-colors" style={{ color: '#1a1a1a' }}>{storePhone}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8B898" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        )}
        {storePhone && storeEmail && <div style={{ height: 1, background: '#F2EDE5', margin: '0 12px' }}/>}
        {storeEmail && (
          <a href={`mailto:${storeEmail}`} className="flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-[#FAF7F2] group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#FFF4E8' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9822A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#BBAA90' }}>Email</div>
              <div className="text-[13px] font-semibold truncate group-hover:text-brand-green transition-colors" style={{ color: '#1a1a1a' }}>{storeEmail}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8B898" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        )}
        {storeAddress && (storePhone || storeEmail) && <div style={{ height: 1, background: '#F2EDE5', margin: '0 12px' }}/>}
        {storeAddress && (
          <div className="flex items-start gap-3 px-3.5 py-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#F0ECFF' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B4FBB" stroke="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#BBAA90' }}>Địa chỉ</div>
              <div className="text-[12px] leading-[1.5]" style={{ color: '#5A5040' }}>{storeAddress}</div>
            </div>
          </div>
        )}
      </div>
      {mapsUrl && (() => {
        const coords = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (!coords) return (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full px-3.5 py-3 rounded-2xl transition-colors hover:bg-[#FAF7F2]" style={{ border: '1.5px solid #EDE8DF', background: 'white' }}>
            <span className="text-[12px] font-semibold" style={{ color: '#104e2e' }}>Xem vị trí trên bản đồ</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </a>
        );
        const lat = parseFloat(coords[1]);
        const lng = parseFloat(coords[2]);
        const d = 0.004;
        const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-d},${lat-d},${lng+d},${lat+d}&layer=mapnik&marker=${lat},${lng}`;
        return (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #EDE8DF' }}>
            <iframe src={osmEmbed} width="100%" height="150" style={{ border: 0, display: 'block' }} loading="lazy" title="Vị trí cửa hàng"/>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3.5 py-2.5 transition-colors hover:bg-[#FAF7F2]" style={{ borderTop: '1px solid #EDE8DF' }}>
              <span className="text-[12px] font-semibold" style={{ color: '#104e2e' }}>Xem vị trí trên Google Maps</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
          </div>
        );
      })()}
    </div>
  );
}
