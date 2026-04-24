'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchModal from '@/components/SearchModal';
import MobileMenuDrawer from '@/components/MobileMenuDrawer';
import AuthButton from '@/components/AuthButton';
import AnnouncementBar from '@/components/AnnouncementBar';
import WishlistDrawer from '@/components/WishlistDrawer';
import AppointmentDrawer from '@/components/AppointmentDrawer';
import MiniCartDrawer from '@/components/MiniCartDrawer';
import NavMegaMenu, { type MegaMenuItem } from '@/components/NavMegaMenu';
import type { NavItem, MegaMenuItemSetting } from '@/lib/site-settings';

const FLAG_VN = (
  <svg width="22" height="15" viewBox="0 0 30 20" style={{ borderRadius: '2px', display: 'block', flexShrink: 0 }}>
    <rect width="30" height="20" fill="#DA251D"/>
    <polygon points="15,3.5 16.9,9.1 22.8,9.1 18,12.5 19.9,18.1 15,14.7 10.1,18.1 12,12.5 7.2,9.1 13.1,9.1" fill="#FFFF00"/>
  </svg>
);
const FLAG_EN = (
  <svg width="22" height="15" viewBox="0 0 60 40" style={{ borderRadius: '2px', display: 'block', flexShrink: 0 }}>
    <rect width="60" height="40" fill="#012169"/>
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="white" strokeWidth="13"/>
    <path d="M-4,0 L56,40 M64,0 L4,40" stroke="#C8102E" strokeWidth="7"/>
    <rect x="24" y="0" width="12" height="40" fill="white"/>
    <rect x="0" y="14" width="60" height="12" fill="white"/>
    <rect x="26" y="0" width="8" height="40" fill="#C8102E"/>
    <rect x="0" y="16" width="60" height="8" fill="#C8102E"/>
  </svg>
);

/** Nút toggle ngôn ngữ: hiện cờ + mã của ngôn ngữ KIA để switch sang */
function LanguageSwitcher() {
  const pathname = usePathname();
  const isEN = pathname?.startsWith('/en');
  const targetHref  = isEN ? '/' : '/en';
  const targetFlag  = isEN ? FLAG_VN : FLAG_EN;
  const targetCode  = isEN ? 'VI' : 'EN';
  const targetLabel = isEN ? 'Chuyển sang Tiếng Việt' : 'Switch to English';

  return (
    <Link
      href={targetHref}
      aria-label={targetLabel}
      className="flex items-center gap-1.5 active:scale-95 transition-all duration-200"
      style={{
        padding: '6px 10px 6px 8px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(0,0,0,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)'; e.currentTarget.style.background = 'rgba(243,238,229,0.95)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)'; e.currentTarget.style.background = 'rgba(255,255,255,0.92)'; }}
    >
      {targetFlag}
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#111111', letterSpacing: '0.045em' }}>
        {targetCode}
      </span>
    </Link>
  );
}

const IMG = {
  hoian:      '/images/menu/den-hoi-an-600x450.webp',
  tet:        '/images/menu/den-tet-600x450.webp',
  bamboo:     '/images/menu/den-tre-may-600x450.webp',
  fabric:     '/images/menu/den-vai-lua-600x450.webp',
  go:         '/images/menu/den-go-600x450.webp',
  giay:       '/images/menu/den-ve-tranh-600x450.webp',
  bestseller: '/images/menu/den-kieu-nhat-600x450.webp',
  living:     '/images/menu/khong-gian-phong-khach-600x450.webp',
  bedroom:    '/images/menu/khong-gian-phong-ngu-600x450.webp',
  dining:     '/images/menu/khong-gian-phong-bep-600x450.webp',
  cafe:       '/images/menu/khong-gian-cafe-600x450.webp',
  resort:     '/images/menu/khong-gian-resort-600x450.webp',
  nha_hang:   '/images/menu/khong-gian-nha-hang-600x450.webp',
  workspace:  '/images/menu/den-ap-tuong-600x450.webp',
  outdoor:    '/images/menu/khong-gian-ngoai-troi-600x450.webp',
  tha_tran:   '/images/menu/den-tha-tran-600x450.webp',
  editorial:  '/images/hero/hero-2.webp',
};

// NOTE: MEGA_PRODUCTS / MEGA_ROOMS are intentionally NOT made CMS-editable
// due to complexity. They use hardcoded image references from IMG map above.

const MEGA_PRODUCTS: MegaMenuItem[] = [
  { label: 'Đèn Hội An',    href: '/c/hoi-an-lantern',  image: IMG.hoian,     tag: 'Bestseller' },
  { label: 'Đèn Kiểu Nhật', href: '/c/den-kieu-nhat',   image: IMG.bestseller },
  { label: 'Đèn Tre & Mây', href: '/c/den-may-tre',     image: IMG.bamboo     },
  { label: 'Đèn Vải Lụa',   href: '/c/den-vai-cao-cap', image: IMG.fabric,    tag: 'Mới' },
  { label: 'Đèn Lồng Gỗ',  href: '/c/den-long-go',     image: IMG.go         },
  { label: 'Đèn Thả Trần',  href: '/c/den-tha-tran',    image: IMG.tha_tran   },
  { label: 'Đèn Sàn',       href: '/c/den-san',         image: IMG.outdoor    },
  { label: 'Đèn Áp Tường',  href: '/c/den-ap-tuong',    image: IMG.workspace  },
  { label: 'Đèn Vẽ Tranh',  href: '/c/den-ve-tranh',    image: IMG.giay       },
  { label: 'Đèn Tết',       href: '/c/den-long-tet',    image: IMG.tet,       tag: 'Hot' },
];

const MEGA_ROOMS: MegaMenuItem[] = [
  { label: 'Phòng Khách',   href: '/c/phong-khach',    image: IMG.living    },
  { label: 'Phòng Ngủ',     href: '/c/phong-ngu',      image: IMG.bedroom   },
  { label: 'Phòng Bếp',     href: '/c/phong-bep',      image: IMG.dining    },
  { label: 'Quán Cafe',     href: '/c/den-quan-cafe',  image: IMG.cafe      },
  { label: 'Nhà Hàng',      href: '/c/den-nha-hang',   image: IMG.nha_hang  },
  { label: 'Đèn Khách Sạn', href: '/c/den-khach-san',  image: IMG.resort    },
  { label: 'Ngoài Trời',    href: '/c/ngoai-troi',     image: IMG.outdoor   },
  { label: 'Đèn Nội Thất',  href: '/c/den-noi-that',   image: IMG.living    },
];

// Sub-item image lookup by href
const SUB_IMG: Record<string, string> = {
  '/c/hoi-an-lantern':   '/images/menu/hoian.webp',
  '/c/den-trung-thu':    '/images/menu/tet.webp',
  '/c/den-vai-cao-cap':  '/images/menu/vai.webp',
  '/c/den-may-tre':      '/images/menu/tre.webp',
  '/c/den-long-go':      '/images/menu/go.webp',
  '/c/den-nhat-ban':     '/images/menu/nhat.webp',
  '/c/den-tha-tran':     '/images/menu/tha-tran.webp',
  '/c/den-ve-tranh':     '/images/menu/ve-tranh.webp',
  '/c/den-ban':          '/images/menu/cafe.webp',
  '/c/den-trai-tim':     '/images/menu/tet.webp',
  '/c/den-tron-10-mau':  '/images/menu/tet.webp',
  '/c/qua-tang-den-long':'/images/menu/tet.webp',
  '/c/phu-kien':         '/images/menu/hoian.webp',
  '/c/long-den-khung-sat':'/images/menu/hoian.webp',
  '/san-pham':           '/images/menu/hoian.webp',
};
function subImg(href: string): string {
  return SUB_IMG[href] ?? '/images/menu/hoian.webp';
}

const iconBtnClass =
  'w-10 h-10 flex items-center justify-center text-[#4a4a4a] hover:text-[#333333] transition-colors focus-visible:outline-2 focus-visible:outline-[#333333] rounded-sm relative';


export default function Header({ topbarMessages, announcementBg, announcementInterval, announcementEffect, announcementShimmer, navItems = [], megaProducts: megaProductsProp, megaRooms: megaRoomsProp, searchPlaceholder, searchQuickCats, searchTotalLabel, storePhone, storeEmail, storeAddress, mapsUrl, menuImages, logoSrc, logoAlt }: {
  topbarMessages?: { text: string; href: string }[];
  announcementBg?: string;
  announcementInterval?: number;
  announcementEffect?: string;
  announcementShimmer?: boolean;
  navItems?: NavItem[];
  megaProducts?: MegaMenuItemSetting[];
  megaRooms?: MegaMenuItemSetting[];
  searchPlaceholder?: string;
  searchQuickCats?: { label: string; href: string; badge?: string | null }[];
  searchTotalLabel?: string;
  storePhone?: string;
  storeEmail?: string;
  storeAddress?: string;
  mapsUrl?: string;
  menuImages?: Record<string, string>;
  logoSrc?: string;
  logoAlt?: string;
}) {
  // Dynamic image map — admin uploads override hardcoded defaults
  const I = {
    hoian:      menuImages?.hoian      || IMG.hoian,
    tet:        menuImages?.tet        || IMG.tet,
    bamboo:     menuImages?.tre        || IMG.bamboo,
    fabric:     menuImages?.vai        || IMG.fabric,
    go:         menuImages?.go         || IMG.go,
    giay:       menuImages?.ve_tranh   || IMG.giay,
    nhat:       menuImages?.nhat       || IMG.bestseller,
    living:     menuImages?.san        || IMG.living,
    bedroom:    menuImages?.bedroom    || IMG.bedroom,
    dining:     menuImages?.dining     || IMG.dining,
    cafe:       menuImages?.cafe       || IMG.cafe,
    resort:     menuImages?.resort     || IMG.resort,
    workspace:  menuImages?.tuong      || IMG.workspace,
    outdoor:    menuImages?.ngoai_troi || IMG.outdoor,
    nha_hang:   menuImages?.nha_hang   || IMG.nha_hang,
    tha_tran:   menuImages?.tha_tran   || IMG.tha_tran,
  };
  function dynSubImg(href: string): string {
    const map: Record<string, string> = {
      '/c/hoi-an-lantern':    I.hoian,
      '/c/den-trung-thu':     I.tet,
      '/c/den-vai-cao-cap':   I.fabric,
      '/c/den-may-tre':       I.bamboo,
      '/c/den-long-go':       I.go,
      '/c/den-nhat-ban':      I.nhat,
      '/c/den-tha-tran':      I.tha_tran,
      '/c/den-ve-tranh':      I.giay,
      '/c/den-ban':           I.cafe,
      '/c/den-trai-tim':      I.tet,
      '/c/den-tron-10-mau':   I.tet,
      '/c/qua-tang-den-long': I.tet,
      '/c/phu-kien':          I.hoian,
      '/c/long-den-khung-sat':I.hoian,
      '/san-pham':            I.hoian,
    };
    return map[href] ?? I.hoian;
  }
  const effectiveMegaProducts = megaProductsProp?.length ? megaProductsProp : MEGA_PRODUCTS;
  const effectiveMegaRooms = megaRoomsProp?.length ? megaRoomsProp : MEGA_ROOMS;

  // ── Remap images theo href → dùng I.* (admin menuImages) làm nguồn chân lý
  // Tránh trường hợp admin upload menu_img_* đúng nhưng item JSON vẫn giữ URL cũ/sai
  const hrefImgMap: Record<string, string> = {
    '/c/hoi-an-lantern':  I.hoian,
    '/c/den-kieu-nhat':   I.nhat,
    '/c/den-may-tre':     I.bamboo,
    '/c/den-vai-cao-cap': I.fabric,
    '/c/den-long-go':     I.go,
    '/c/den-tha-tran':    I.tha_tran,
    '/c/den-san':         I.outdoor,
    '/c/den-ap-tuong':    I.workspace,
    '/c/den-ve-tranh':    I.giay,
    '/c/den-long-tet':    I.tet,
    '/c/den-trung-thu':   I.tet,
    '/c/phong-khach':     I.living,
    '/c/phong-ngu':       I.bedroom,
    '/c/phong-bep':       I.dining,
    '/c/den-quan-cafe':   I.cafe,
    '/c/den-nha-hang':    I.nha_hang,
    '/c/den-khach-san':   I.resort,
    '/c/ngoai-troi':      I.outdoor,
    '/c/den-noi-that':    I.living,
    '/san-pham':          I.hoian,
  };
  const finalMegaProducts = effectiveMegaProducts.map(item => ({
    ...item, image: hrefImgMap[item.href] ?? item.image,
  }));
  const finalMegaRooms = effectiveMegaRooms.map(item => ({
    ...item, image: hrefImgMap[item.href] ?? item.image,
  }));
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [megaOpen, setMegaOpen] = useState<'products' | 'rooms' | null>(null);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  function openMega(id: 'products' | 'rooms') {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    setActiveNav(null);
    setMegaOpen(id);
  }
  function delayCloseMega() {
    megaCloseTimer.current = setTimeout(() => setMegaOpen(null), 120);
  }
  function cancelCloseMega() {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
  }

  // Listen for search trigger from MobileBottomNav
  useEffect(() => {
    const open  = () => setSearchOpen(true);
    const close = () => setSearchOpen(false);
    window.addEventListener('ldv:open-search',  open);
    window.addEventListener('ldv:close-search', close);
    return () => {
      window.removeEventListener('ldv:open-search',  open);
      window.removeEventListener('ldv:close-search', close);
    };
  }, []);

  // Listen for ldv:open-appointment (từ ProductDetailClient "Liên hệ ngay", v.v.)
  useEffect(() => {
    const handler = () => setAppointmentOpen(true);
    window.addEventListener('ldv:open-appointment', handler);
    return () => window.removeEventListener('ldv:open-appointment', handler);
  }, []);

  // ── Desktop inline search ────────────────────────────────────────────────
  const [deskQuery, setDeskQuery] = useState('');
  const [deskOpen, setDeskOpen] = useState(false);
  const [deskResults, setDeskResults] = useState<{ products: { id: string; slug: string; name: string; image: string; price: number; contactForPrice?: boolean }[]; categories: { label: string; href: string; badge: string | null }[]; posts: { slug: string; title: string; thumbnail: string | null }[] } | null>(null);
  const deskSearchRef = useRef<HTMLDivElement>(null);
  const deskInputRef = useRef<HTMLInputElement>(null);
  const deskTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (deskSearchRef.current && !deskSearchRef.current.contains(e.target as Node)) {
        setDeskOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (deskTimer.current) clearTimeout(deskTimer.current);
    if (!deskQuery.trim()) { setDeskResults(null); return; }
    deskTimer.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(deskQuery)}&limit=6`);
        if (r.ok) setDeskResults(await r.json());
      } catch { /* ignore */ }
    }, 220);
  }, [deskQuery]);

  const handleDeskKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setDeskOpen(false); deskInputRef.current?.blur(); }
    if (e.key === 'Enter' && deskQuery.trim()) {
      setDeskOpen(false);
      deskInputRef.current?.blur();
      window.location.href = `/shop?q=${encodeURIComponent(deskQuery)}`;
    }
  }, [deskQuery]);

  // Broadcast search state → MobileBottomNav có thể sync
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('ldv:search-state', { detail: searchOpen }));
  }, [searchOpen]);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 4);
      if (y > lastY && y > 80) setHidden(true);   // scroll down → ẩn
      else setHidden(false);                        // scroll up → hiện
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200 transition-all duration-300 overflow-visible',
          scrolled ? 'shadow-md' : '',
          hidden ? '-translate-y-full' : 'translate-y-0',
        ].join(' ')}
      >
        <AnnouncementBar messages={topbarMessages} bg={announcementBg} interval={announcementInterval} effect={announcementEffect} shimmer={announcementShimmer} />
        {/* ── Mobile header row: [hamburger] [logo center] [search+cart] ── */}
        <div className="md:hidden relative flex items-center h-14 px-3">
          {/* Hamburger + EN flag badge — left */}
          <button
            className="relative flex flex-col items-center justify-center gap-0.5 w-[42px] h-[42px] transition-all duration-200 active:scale-95"
            style={{
              background: 'rgba(246,242,236,0.92)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.85)',
              borderRadius: '14px',
              boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.98), 0 2px 10px rgba(0,0,0,0.06)',
              color: '#111111',
            }}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Mở menu"
          >
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="2" y1="5" x2="20" y2="5"/>
              <line x1="2" y1="11" x2="20" y2="11"/>
              <line x1="2" y1="17" x2="20" y2="17"/>
            </svg>
          </button>

          {/* Logo — absolute center */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" aria-label="Trang chủ KAHA">
              <Image
                src={logoSrc || '/logo.webp'}
                alt={logoAlt || 'KAHA'}
                width={168}
                height={63}
                className="h-[52px] w-auto transition-transform duration-200 active:scale-95"
                style={{ filter: 'drop-shadow(0 1px 6px rgba(16,78,46,0.18))' }}
                priority
              />
            </Link>
          </div>

          {/* Right: lang + cart */}
          <div className="ml-auto flex items-center gap-1.5">
            {/* Language toggle */}
            <LanguageSwitcher />

            {/* Giỏ hàng — pill trên mobile */}
            <Link
              href="/gio-hang"
              className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95"
              style={{ background: '#111111', color: '#fff' }}
              aria-label={`Giỏ hàng${totalItems > 0 ? ` (${totalItems})` : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#555555] text-white text-[11px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-[4px]" style={{ border: '1.5px solid white' }}>{totalItems}</span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Desktop: Hàng 1 — logo | search bar | icons with text ── */}
        <div className="hidden md:flex max-w-7xl mx-auto px-6 items-center gap-5 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 group"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Image
              src={logoSrc || '/logo.webp'}
              alt={logoAlt || 'KAHA'}
              width={224}
              height={84}
              className="h-[70px] w-auto transition-all duration-300 ease-out group-hover:scale-[1.04]"
              style={{
                filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.18)) drop-shadow(0 1px 3px rgba(0,0,0,0.10))',
              }}
              priority
            />
          </Link>

          {/* Search bar — desktop inline input */}
          <div ref={deskSearchRef} className="flex-1 relative">
            <div
              className="flex items-center gap-2.5 rounded-full px-5 py-2.5 transition-all duration-200"
              style={{
                background: '#ffffff',
                border: deskOpen ? '1.5px solid rgba(0,0,0,0.35)' : '1.5px solid rgba(0,0,0,0.10)',
                boxShadow: deskOpen
                  ? '0 0 0 3px rgba(0,0,0,0.06)'
                  : '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <span className="shrink-0 relative w-6 h-6" style={{ color: '#111111' }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[2px] left-[2px]">
                  <circle cx="11" cy="11" r="7.5"/><line x1="17" y1="17" x2="21" y2="21"/>
                </svg>
              </span>
              <input
                ref={deskInputRef}
                type="text"
                value={deskQuery}
                onChange={e => setDeskQuery(e.target.value)}
                onFocus={() => setDeskOpen(true)}
                onKeyDown={handleDeskKeyDown}
                placeholder={searchPlaceholder || 'Tìm sản phẩm, danh mục, bài viết...'}
                className="flex-1 bg-transparent outline-none text-sm min-w-0"
                style={{ color: '#111111' }}
                autoComplete="off"
              />
              {deskQuery && (
                <button onClick={() => { setDeskQuery(''); deskInputRef.current?.focus(); }} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
              {!deskQuery && (
                <span className="ml-auto shrink-0 hidden xl:flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: '#F0EBE0', color: '#B0A080', border: '1px solid #E5DBC8' }}>⌘K</span>
              )}
            </div>

            {/* Dropdown results */}
            {deskOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-[300]"
                style={{ background: '#FFFDF8', border: '1px solid #EDE7DA', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '70vh', overflowY: 'auto' }}>

                {/* No query: show categories */}
                {!deskQuery.trim() && (
                  <div className="p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3.5" style={{ color: '#a89a83' }}>Danh mục chính</p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(searchQuickCats && searchQuickCats.length > 0 ? searchQuickCats : [
                        { label: 'Đèn Lồng Hội An', href: '/c/hoi-an-lantern', badge: 'Bestseller' },
                        { label: 'Đèn Vải & Lụa', href: '/c/den-vai-cao-cap', badge: null },
                        { label: 'Đèn Tết & Lễ Hội', href: '/c/den-long-tet', badge: 'Hot' },
                        { label: 'Đèn Tre & Mây', href: '/c/den-may-tre', badge: null },
                        { label: 'Phong Cách Nhật', href: '/c/den-kieu-nhat', badge: null },
                        { label: 'Quà Tặng & B2B', href: '/san-pham', badge: null },
                      ]).map(c => (
                        <Link key={c.href} href={c.href} onClick={() => setDeskOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-stone-50"
                          style={{ color: '#111111', border: '1px solid #e5e5e5', background: 'rgba(255,255,255,0.92)' }}>
                          {c.label}
                          {c.badge && (
                            <span
                              className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(0,0,0,0.06)', color: '#111111', border: '1px solid rgba(0,0,0,0.15)' }}
                            >
                              {c.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                    <Link href="/shop" onClick={() => setDeskOpen(false)}
                      className="flex items-center justify-between mt-4 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-[#f3f8f5]"
                      style={{ background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.15)', color: '#111111', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                      Xem tất cả {searchTotalLabel || '800+'} sản phẩm
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                  </div>
                )}

                {/* With query: show results */}
                {deskQuery.trim() && deskResults && (
                  <div className="divide-y" style={{ borderColor: '#EDE7DA' }}>
                    {/* Products */}
                    {deskResults.products?.length > 0 && (
                      <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: '#B0A080' }}>Sản phẩm</p>
                        <div className="space-y-1">
                          {deskResults.products.slice(0, 5).map((p: { id: string; slug: string; name: string; image: string; price: number; contactForPrice?: boolean }) => (
                            <Link key={p.id} href={`/p/${p.slug}`} onClick={() => { setDeskOpen(false); setDeskQuery(''); }}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors hover:bg-stone-100 group">
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ background: '#EDE5D8' }}>
                                {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                              </div>
                              <span className="flex-1 text-sm font-medium truncate" style={{ color: '#111111' }}>{p.name}</span>
                              <span className="text-xs font-bold shrink-0" style={{ color: '#111111' }}>
                                {p.contactForPrice ? 'Liên hệ' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Blog posts */}
                    {deskResults.posts?.length > 0 && (
                      <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: '#B0A080' }}>Bài viết</p>
                        <div className="space-y-1">
                          {deskResults.posts.slice(0, 3).map((p: { slug: string; title: string; thumbnail: string | null }) => (
                            <Link key={p.slug} href={`/journal/${p.slug}`} onClick={() => { setDeskOpen(false); setDeskQuery(''); }}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors hover:bg-stone-100">
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ background: '#EDE5D8' }}>
                                {p.thumbnail && <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />}
                              </div>
                              <span className="flex-1 text-sm font-medium line-clamp-2 leading-snug" style={{ color: '#111111' }}>{p.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* No results */}
                    {!deskResults.products?.length && !deskResults.posts?.length && (
                      <div className="p-8 text-center text-sm" style={{ color: '#B0A080' }}>Không tìm thấy kết quả cho "{deskQuery}"</div>
                    )}
                    {/* View all */}
                    <div className="p-3">
                      <Link href={`/shop?q=${encodeURIComponent(deskQuery)}`} onClick={() => { setDeskOpen(false); setDeskQuery(''); }}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-stone-100"
                        style={{ color: '#111111' }}>
                        Xem tất cả kết quả cho "{deskQuery}"
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Searching... */}
                {deskQuery.trim() && !deskResults && (
                  <div className="p-8 text-center text-sm" style={{ color: '#B0A080' }}>Đang tìm kiếm...</div>
                )}
              </div>
            )}
          </div>

          {/* Phone number — desktop xl+ */}
          {storePhone && (
            <a
              href={`tel:${(storePhone === '0905151701' ? '0989.778.247' : storePhone).replace(/\./g, '')}`}
              className="hidden xl:flex items-center gap-1.5 shrink-0 transition-colors"
              style={{
                color: '#2f5a45',
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.01em',
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px solid rgba(0,0,0,0.10)',
                background: 'rgba(255,255,255,0.92)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#333333')}
              onMouseLeave={e => (e.currentTarget.style.color = '#2f5a45')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              {storePhone === '0905151701' ? '0989.778.247' : storePhone}
            </a>
          )}

          {/* Desktop action buttons */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Đăng nhập — icon only, no box */}
            <Link
              href="/tai-khoan/dang-nhap"
              aria-label="Đăng nhập"
              className="w-[34px] h-[34px] flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-stone-100 active:scale-95"
              style={{ color: '#111111', border: '1px solid rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.92)' }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Yêu thích — icon only, no box */}
            <button
              onClick={() => setWishlistOpen(true)}
              aria-label="Yêu thích"
              className="relative w-[34px] h-[34px] flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-stone-100 active:scale-95"
              style={{ color: '#111111', border: '1px solid rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.92)' }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              {totalWishlist > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#555555] text-white text-[8px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-[3px]" style={{ border: '1.5px solid white' }}>{totalWishlist}</span>
              )}
            </button>

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Divider */}
            <span className="w-px h-5 mx-0.5" style={{ background: '#e9e2d7' }} />

            {/* Giỏ hàng — pill CTA (opens mini-cart drawer) */}
            <button
              onClick={() => setMiniCartOpen(true)}
              className="relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 active:scale-[0.97] hover:bg-[#222222]"
              style={{
                background: 'linear-gradient(145deg,#111111,#000000)',
                color: '#fff',
                width: 36,
                height: 36,
                padding: 0,
                border: '1px solid rgba(255,255,255,0.16)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.24), 0 6px 14px rgba(0,0,0,0.20)',
                cursor: 'pointer',
              }}
              aria-label="Mở giỏ hàng"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#555555] text-white text-[8px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-[3px]" style={{ border: '1.5px solid white' }}>{totalItems}</span>
              )}
            </button>

          </div>
        </div>

        {/* ── Desktop: Hàng 2 — nav links ── */}
        <div className="hidden md:block border-t border-gray-100">
          <nav className="max-w-7xl mx-auto px-6 flex items-center justify-center">

            {/* ── Mega menu triggers ── */}
            {([
              { id: 'products' as const, label: 'Sản phẩm' },
              { id: 'rooms'    as const, label: 'Phòng' },
            ]).map(({ id, label }) => (
              <div
                key={id}
                onMouseEnter={() => openMega(id)}
                onMouseLeave={delayCloseMega}
              >
                <button
                  className={[
                    'relative px-5 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-colors duration-200 text-[#2f2f2f] hover:text-brand-ink',
                    'after:absolute after:bottom-0 after:left-5 after:right-5 after:h-[1.5px] after:rounded-full after:bg-brand-ink/90',
                    megaOpen === id ? 'after:scale-x-100 text-[#1f2a24]' : 'after:scale-x-0 after:origin-left hover:after:scale-x-100',
                    'after:transition-transform after:duration-300',
                  ].join(' ')}
                >
                  {label}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`transition-transform duration-200 ${megaOpen === id ? 'rotate-180' : ''}`}>
                    <polyline points="1,3 5,7 9,3"/>
                  </svg>
                </button>
              </div>
            ))}

            {/* ── Divider ── */}
            <span className="h-4 w-px bg-gray-200 mx-1" />

            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.sub ? setActiveNav(item.label) : setActiveNav(null)}
                onMouseLeave={() => setActiveNav(null)}
              >
                <Link
                  href={item.href}
                  className={[
                    'relative px-5 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-colors duration-200',
                    'after:absolute after:bottom-0 after:left-5 after:right-5 after:h-[1.5px] after:rounded-full after:bg-brand-ink/90 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300',
                    item.accent
                      ? 'text-brand-ink hover:text-brand-ink/80 after:bg-brand-ink'
                      : (item.label === 'Blog' || item.label === 'Liên hệ'
                        ? 'text-[#4a4a4a] hover:text-brand-ink'
                        : 'text-[#2f2f2f] hover:text-brand-ink'),
                  ].join(' ')}
                >
                  {item.label}
                </Link>
                {item.sub && activeNav === item.label && (() => {
                  // Filter out "xem tất cả →" items — already in header
                  const subs = item.sub.filter(s => !s.label.includes('→'));
                  // +1 for branded "see all" tile; pick cols so grid fills evenly
                  const total = subs.length + 1;
                  const cols = total <= 4 ? total : total === 5 ? 3 : 4;
                  return (
                    <div
                      className="absolute top-full left-0 z-[200] rounded-2xl overflow-hidden"
                      style={{
                        background: '#FAF7F2',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.07)',
                        width: '680px',
                      }}
                    >
                      {/* Header row */}
                      <div
                        className="flex items-center justify-between px-5 py-3"
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#FAFAF8' }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7a6a]">{item.label}</p>
                        <Link
                          href={item.href}
                          className="text-[11px] font-bold text-[#111111] hover:underline underline-offset-4"
                        >
                          Xem tất cả →
                        </Link>
                      </div>

                      {/* Magazine card grid — full width, no right panel */}
                      <div className="p-4">
                        <div
                          className="grid gap-3"
                          style={{
                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                            gridAutoRows: '160px',
                          }}
                        >
                          {subs.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="group relative rounded-xl overflow-hidden bg-[#e8e0d4]"
                            >
                              <img
                                src={dynSubImg(sub.href)}
                                alt={sub.label}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                                loading="lazy"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                              />
                              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.04) 55%, transparent 100%)' }} />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl" />
                              <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5">
                                <span className="text-[12px] font-bold text-white leading-tight block" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                                  {sub.label}
                                </span>
                              </div>
                            </Link>
                          ))}

                          {/* Branded "Xem tất cả" tile */}
                          <Link
                            href={item.href}
                            className="relative rounded-xl overflow-hidden flex flex-col items-center justify-center gap-2.5"
                            style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)' }}
                          >
                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </div>
                            <span className="text-[11px] font-bold text-white/80 text-center leading-snug">Xem<br/>tất cả</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </nav>
        </div>

        {/* ── Mega menus ── */}
        {megaOpen === 'products' && (
          <NavMegaMenu
            title="Sản phẩm"
            items={finalMegaProducts as MegaMenuItem[]}
            editorialImage={I.hoian}
            onClose={() => setMegaOpen(null)}
            onMouseEnter={cancelCloseMega}
          />
        )}
        {megaOpen === 'rooms' && (
          <NavMegaMenu
            title="Không gian"
            items={finalMegaRooms as MegaMenuItem[]}
            editorialImage={I.living}
            onClose={() => setMegaOpen(null)}
            onMouseEnter={cancelCloseMega}
          />
        )}

      </header>

      {/* Search modal */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} storePhone={storePhone} storeEmail={storeEmail} storeAddress={storeAddress} mapsUrl={mapsUrl} />}

      {/* Wishlist drawer */}
      {wishlistOpen && <WishlistDrawer onClose={() => setWishlistOpen(false)} />}

      {/* Appointment drawer */}
      <AppointmentDrawer open={appointmentOpen} onClose={() => setAppointmentOpen(false)} />

      {/* Mini cart drawer */}
      {miniCartOpen && <MiniCartDrawer onClose={() => setMiniCartOpen(false)} />}

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <MobileMenuDrawer
          onClose={() => setMobileMenuOpen(false)}
          onSearchOpen={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
          navItems={navItems}
          menuImages={menuImages}
        />
      )}
    </>
  );
}
