'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import type { NavItem } from '@/lib/site-settings';

interface SubItem {
  label: string;
  href: string;
  image?: string;
}

interface MenuItem {
  label: string;
  href: string;
  isTet?: boolean;
  image?: string;
  sub?: SubItem[];
}

const M = {
  hoian:    '/images/menu/den-hoi-an-longdenviet.webp',
  tet:      '/images/menu/den-tet-trung-thu-longdenviet.webp',
  bamboo:   '/images/menu/den-tre-may-longdenviet.webp',
  fabric:   '/images/menu/den-vai-lua-longdenviet.webp',
  go:       '/images/menu/den-long-go-longdenviet.webp',
  giay:     '/images/menu/den-hoi-an-ve-tranh-longdenviet.webp',
  living:   '/images/menu/khong-gian-phong-khach-longdenviet.webp',
  bedroom:  '/images/menu/khong-gian-phong-ngu-longdenviet.webp',
  dining:   '/images/menu/khong-gian-phong-bep-longdenviet.webp',
  cafe:     '/images/menu/khong-gian-quan-cafe-longdenviet.webp',
  resort:   '/images/menu/khong-gian-resort-longdenviet.webp',
  workspace:'/images/menu/den-ap-tuong-longdenviet.webp',
  outdoor:  '/images/menu/khong-gian-ngoai-troi-longdenviet.webp',
  nhat:     '/images/menu/den-kieu-nhat-longdenviet.webp',
  nha_hang: '/images/menu/khong-gian-nha-hang-longdenviet.webp',
  tha_tran: '/images/menu/den-tha-tran-longdenviet.webp',
};

const IMG_MAP: Record<string, string> = {
  '/images/products/long-den-hoi-an-kieu-kim-cuong5.webp': M.tet,
  '/images/products/bo-10-den-hoi-an-40cm.webp':           M.hoian,
  '/images/products/shop-kaha-den-may-tre39.webp':         M.bamboo,
  '/images/products/den-vai-kaha-01.webp':                 M.fabric,
  '/images/products/longdenviet79139.webp':                M.tet,
  '/images/products/den-nhat-ban-in-chu-19.webp':          M.cafe,
  '/images/products/kaha-living-den-tha-vai78.webp':       M.living,
  '/images/products/kaha-living-den-tha-vai274.webp':      M.bedroom,
  '/images/products/shop-kaha-den-may-tre42.webp':         M.dining,
  '/images/products/shop-kaha-den-may-tre11.webp':         M.resort,
  '/images/products/kaha-living-den-tha-vai13.webp':       M.workspace,
  '/images/products/bo-10-den-hoi-an-60cm.webp':           M.outdoor,
  '/images/products/longdenviet79140.webp':                M.go,
  '/images/products/den-giay-12-con-giap1.webp':           M.giay,
  '/images/products/den-nhat-ban-84963.webp':              M.nhat,
  '/images/products/long-den-hoi-an-du-mau.webp':          M.hoian,
};
function fixExt(path: string): string {
  // DB đôi khi lưu .jpg thay vì .webp cho menu images — tự động sửa
  return path.startsWith('/images/menu/') ? path.replace(/\.jpe?g$/i, '.webp') : path;
}
function normalizeImg(path?: string): string | undefined {
  if (!path) return undefined;
  const p = fixExt(path);
  return IMG_MAP[p] ?? (p.startsWith('/images/products/') ? M.hoian : p);
}

const SUB_IMG: Record<string, string> = {
  '/c/hoi-an-lantern':    M.hoian,
  '/c/den-trung-thu':     M.tet,
  '/c/den-vai-cao-cap':   M.fabric,
  '/c/den-may-tre':       M.bamboo,
  '/c/den-long-go':       M.go,
  '/c/den-kieu-nhat':     M.nhat,
  '/c/den-nhat-ban':      M.nhat,
  '/c/den-tha-tran':      M.tha_tran,
  '/c/den-ve-tranh':      M.giay,
  '/c/den-ban':           M.cafe,
  '/c/den-trai-tim':      M.tet,
  '/c/den-tron-10-mau':   M.tet,
  '/c/qua-tang-den-long': M.tet,
  '/c/phu-kien-den':      M.hoian,
  '/c/phu-kien':          M.hoian,
  '/c/long-den-khung-sat':M.hoian,
  '/san-pham':            M.hoian,
};
function getSubImg(href: string, existing?: string): string {
  return existing ?? SUB_IMG[href] ?? M.hoian;
}

const ITEM_IMG: Record<string, string> = {
  '/san-pham':       M.hoian,
  '/blog':           M.tet,
  '/ve-chung-toi':   '/images/hero/artisan.webp',
  '/lien-he':        M.cafe,
  '/c/den-trung-thu': M.tet,
  '/c/hoi-an-lantern': M.nhat,
};

// Danh mục 12 ô — dùng ảnh thực /images/danh-muc/ (cùng nguồn với MobileBottomNav)
const DANH_MUC = [
  { label: 'Đèn Hội An',      href: '/c/hoi-an-lantern',  img: '/images/danh-muc/den-hoi-an.jpg'    },
  { label: 'Đèn Tre & Mây',   href: '/c/den-may-tre',     img: '/images/danh-muc/den-may-tre.jpg'   },
  { label: 'Chụp Đèn Vải',    href: '/c/chup-den-vai',    img: '/images/danh-muc/chup-den-vai.jpg'  },
  { label: 'Đèn Lồng Gỗ',     href: '/c/den-long-go',     img: '/images/danh-muc/den-long-go.jpg'   },
  { label: 'Đèn Kiểu Nhật',   href: '/c/den-kieu-nhat',   img: '/images/danh-muc/den-nhat-ban.jpg'  },
  { label: 'Đèn Thả Trần',    href: '/c/den-tha-tran',    img: '/images/danh-muc/den-tha-tran.jpg'  },
  { label: 'Đèn Trái Tim',    href: '/c/den-trai-tim',    img: '/images/danh-muc/den-trai-tim.jpg'  },
  { label: 'Đèn Tròn 10 Màu', href: '/c/den-tron-10-mau', img: '/images/danh-muc/den-tron-mau.jpg'  },
  { label: 'Đèn Trung Thu',   href: '/c/den-trung-thu',   img: '/images/danh-muc/den-trung-thu.jpg' },
  { label: 'Đèn Vẽ Tranh',    href: '/c/den-ve-tranh',    img: '/images/danh-muc/den-ve-tranh.jpg'  },
  { label: 'Gia Công Theo YC', href: '/c/gia-cong-den-trang-tri', img: '/images/danh-muc/den-hoi-an.jpg' },
  { label: 'Phụ Kiện Đèn',    href: '/c/phu-kien-den',    img: '/images/danh-muc/phu-kien-den.jpg'  },
];

const menuItems: MenuItem[] = [
  {
    label: 'Sản phẩm',
    href: '/san-pham',
    image: M.hoian,
    sub: [
      { label: 'Đèn Hội An',    href: '/c/hoi-an-lantern', image: M.hoian    },
      { label: 'Đèn Kiểu Nhật', href: '/c/den-kieu-nhat', image: M.nhat     },
      { label: 'Đèn Tre & Mây', href: '/c/den-may-tre',    image: M.bamboo   },
      { label: 'Đèn Vải Lụa',   href: '/c/den-vai-cao-cap',image: M.fabric   },
      { label: 'Đèn Lồng Gỗ',  href: '/c/den-long-go',    image: M.go       },
      { label: 'Đèn Thả Trần',  href: '/c/den-tha-tran',   image: M.tha_tran },
      { label: 'Đèn Áp Tường',  href: '/c/den-ban',   image: M.workspace},
      { label: 'Đèn Vẽ Tranh',  href: '/c/den-ve-tranh',   image: M.giay     },
    ],
  },
  {
    label: 'Không gian',
    href: '/san-pham',
    image: M.living,
    sub: [
      { label: 'Phòng Khách',   href: '/c/phong-khach',     image: M.living    },
      { label: 'Phòng Ngủ',     href: '/c/phong-ngu',       image: M.bedroom   },
      { label: 'Phòng Bếp',     href: '/c/phong-bep',       image: M.dining    },
      { label: 'Quán Cafe',     href: '/c/den-quan-cafe',   image: M.cafe      },
      { label: 'Nhà Hàng',      href: '/c/den-nha-hang',    image: M.nha_hang  },
      { label: 'Khách Sạn',     href: '/c/den-khach-san',   image: M.workspace },
      { label: 'Ngoài Trời',    href: '/c/ngoai-troi',      image: M.outdoor   },
    ],
  },
  {
    label: 'Đèn Tết',
    href: '/c/den-trung-thu',
    isTet: true,
    image: M.tet,
    sub: [
      { label: 'Lồng đèn Tết truyền thống', href: '/c/den-trung-thu' },
      { label: 'Đèn Trung Thu', href: '/c/den-trung-thu' },
      { label: 'Hoa đăng thả sông', href: '/c/den-trung-thu' },
      { label: 'Lồng đèn giá rẻ', href: '/c/den-trung-thu' },
    ],
  },
  {
    label: 'Đèn Lồng Hội An',
    href: '/c/hoi-an-lantern',
    image: M.hoian,
    sub: [
      { label: 'Đèn vải lụa', href: '/c/den-vai-cao-cap' },
      { label: 'Đèn vải hoa', href: '/c/den-vai-cao-cap' },
      { label: 'Đèn lồng cao cấp', href: '/c/hoi-an-lantern' },
      { label: 'Đèn lồng gỗ', href: '/c/den-long-go' },
      { label: 'Xem tất cả →', href: '/c/hoi-an-lantern' },
    ],
  },
  {
    label: 'Đèn Tre & Mây',
    href: '/c/den-may-tre',
    image: M.bamboo,
    sub: [
      { label: 'Đèn tre đan thủ công', href: '/c/den-may-tre' },
      { label: 'Đèn mây tre', href: '/c/den-may-tre' },
      { label: 'Đèn nón lá', href: '/c/den-may-tre' },
    ],
  },
  {
    label: 'Đèn Vải & Lụa',
    href: '/c/den-vai-cao-cap',
    image: M.fabric,
    sub: [
      { label: 'Đèn vải cao cấp', href: '/c/den-vai-cao-cap' },
      { label: 'Đèn vải nhăn', href: '/c/den-vai-cao-cap' },
      { label: 'Kaha Living', href: '/c/den-tha-tran' },
    ],
  },
  { label: 'Câu Chuyện Nghệ Nhân', href: '/ve-chung-toi' },
  { label: 'Blog & Tin Tức', href: '/blog' },
];

interface Props {
  onClose: () => void;
  onSearchOpen: () => void;
  navItems?: NavItem[];
  menuImages?: Record<string, string>;
}

export default function MobileMenuDrawer({ onClose, onSearchOpen, navItems, menuImages }: Props) {
  // Dynamic image map — admin uploads override hardcoded defaults
  const I = {
    hoian:     fixExt(menuImages?.hoian      || M.hoian),
    tet:       fixExt(menuImages?.tet        || M.tet),
    bamboo:    fixExt(menuImages?.tre        || M.bamboo),
    fabric:    fixExt(menuImages?.vai        || M.fabric),
    go:        fixExt(menuImages?.go         || M.go),
    giay:      fixExt(menuImages?.ve_tranh   || M.giay),
    nhat:      fixExt(menuImages?.nhat       || M.nhat),
    living:    fixExt(menuImages?.san        || M.living),
    bedroom:   fixExt(menuImages?.bedroom    || M.bedroom),
    dining:    fixExt(menuImages?.dining     || M.dining),
    cafe:      fixExt(menuImages?.cafe       || M.cafe),
    resort:    fixExt(menuImages?.resort     || M.resort),
    workspace: fixExt(menuImages?.tuong      || M.workspace),
    outdoor:   fixExt(menuImages?.ngoai_troi || M.outdoor),
    nha_hang:  fixExt(menuImages?.nha_hang   || M.nha_hang),
    tha_tran:  fixExt(menuImages?.tha_tran   || M.tha_tran),
  };
  function dynSubImg(href: string, existing?: string): string {
    if (existing) return existing;
    const map: Record<string, string> = {
      '/c/hoi-an-lantern':    I.hoian,
      '/c/den-trung-thu':     I.tet,
      '/c/den-long-tet':      I.tet,
      '/c/den-vai-cao-cap':   I.fabric,
      '/c/den-may-tre':       I.bamboo,
      '/c/den-long-go':       I.go,
      '/c/den-kieu-nhat':     I.nhat,
      '/c/den-nhat-ban':      I.nhat,
      '/c/den-tha-tran':      I.tha_tran,
      '/c/den-ve-tranh':      I.giay,
      '/c/den-ban':           I.cafe,
      '/c/den-trai-tim':      I.tet,
      '/c/den-tron-10-mau':   I.tet,
      '/c/qua-tang-den-long': I.tet,
      '/c/phu-kien-den':      I.hoian,
      '/c/phu-kien':          I.hoian,
      '/c/long-den-khung-sat':I.hoian,
      '/san-pham':            I.hoian,
      '/c/khong-gian':        I.living,
      '/c/qua-tang':          I.tet,
    };
    return map[href] ?? I.hoian;
  }
  function dynItemImg(href: string): string {
    const map: Record<string, string> = {
      '/san-pham': I.hoian, '/blog': I.tet, '/lien-he': I.cafe,
      '/c/den-trung-thu': I.tet, '/c/hoi-an-lantern': I.nhat,
      '/ve-chung-toi': '/images/hero/artisan.webp',
    };
    return map[href] ?? '';
  }
  const resolvedMenuItems: MenuItem[] = navItems && navItems.length > 0
    ? navItems.map(item => ({
        label: item.label,
        href: item.href,
        isTet: item.accent,
        image: normalizeImg(item.image) ?? item.image,
        sub: item.sub,
      }))
    : menuItems;

  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [visible, setVisible] = useState(false);
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // trigger slide-in
    const t = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(t);
      document.body.style.overflow = '';
    };
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex"
      style={{
        background: visible ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0)',
        transition: 'background 0.28s ease',
      }}
      onClick={handleClose}
    >
      {/* Drawer panel — slide from left */}
      <div
        className="relative flex flex-col h-full overflow-hidden"
        style={{
          width: 'min(88vw, 360px)',
          background: '#FAF7F2',
          transform: visible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.32, 0, 0.12, 1)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.16)',
        }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Top bar ── */}
        <div
          className="flex items-center justify-between px-4 shrink-0"
          style={{ height: '56px', borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#FAF7F2' }}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center transition-all duration-200 active:scale-95"
            style={{
              background: 'rgba(246,242,236,0.92)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.85)',
              borderRadius: '11px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.98), 0 2px 8px rgba(0,0,0,0.06)',
              color: '#104e2e',
            }}
            aria-label="Đóng menu"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13"/>
              <line x1="13" y1="1" x2="1" y2="13"/>
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" onClick={handleClose}>
            <Image src="/logo.webp" alt="LongDenViet" width={120} height={44} className="h-9 w-auto" />
          </Link>

          {/* Search + Cart */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { handleClose(); onSearchOpen(); }}
              className="w-9 h-9 flex items-center justify-center transition-all duration-200 active:scale-95"
              style={{
                background: 'rgba(246,242,236,0.92)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.85)',
                borderRadius: '11px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.98), 0 2px 8px rgba(0,0,0,0.06)',
                color: '#104e2e',
              }}
              aria-label="Tìm kiếm"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7.5"/><line x1="17" y1="17" x2="21" y2="21"/>
              </svg>
            </button>
            <Link href="/gio-hang" onClick={handleClose}
              className="relative w-9 h-9 flex items-center justify-center transition-all duration-200 active:scale-95"
              style={{
                background: 'rgba(232,245,238,0.95)',
                backdropFilter: 'blur(20px) saturate(200%)',
                WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                border: '1px solid rgba(26,107,60,0.22)',
                borderRadius: '11px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 10px rgba(16,78,46,0.12)',
                color: '#104e2e',
              }}
              aria-label="Giỏ hàng"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c9822a] text-white text-[11px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-[4px]" style={{ border: '1.5px solid white' }}>{totalItems}</span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex-1 overflow-y-auto">
          {!activeItem ? (
            /* Level 1 */
            <div>
              {/* Quick links — 4-col icon + label */}
              <div className="grid grid-cols-4 gap-1.5 px-3 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                {/* Tài khoản */}
                <Link href="/tai-khoan/dang-nhap" onClick={handleClose}
                  className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all active:scale-95"
                  style={{ background: 'rgba(246,242,236,0.88)', border: '1px solid rgba(255,255,255,0.8)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span className="text-[12px] font-semibold text-[#104e2e]">Tài khoản</span>
                </Link>
                {/* Yêu thích */}
                <Link href="/yeu-thich" onClick={handleClose}
                  className="relative flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all active:scale-95"
                  style={{ background: 'rgba(246,242,236,0.88)', border: '1px solid rgba(255,255,255,0.8)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  <span className="text-[12px] font-semibold text-[#104e2e]">Yêu thích</span>
                  {totalWishlist > 0 && (
                    <span className="absolute top-1 right-1.5 bg-[#c9822a] text-white text-[11px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-[4px]">{totalWishlist}</span>
                  )}
                </Link>
                {/* Đơn hàng */}
                <Link href="/theo-doi-don-hang" onClick={handleClose}
                  className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all active:scale-95"
                  style={{ background: 'rgba(246,242,236,0.88)', border: '1px solid rgba(255,255,255,0.8)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 17H5a2 2 0 00-2 2v0a2 2 0 002 2h14a2 2 0 002-2v0a2 2 0 00-2-2h-4"/>
                    <path d="M12 2v13M8 9l4 4 4-4"/>
                  </svg>
                  <span className="text-[12px] font-semibold text-[#104e2e]">Đơn hàng</span>
                </Link>
                {/* Đặt lịch */}
                <button
                  onClick={() => { handleClose(); setTimeout(() => window.dispatchEvent(new CustomEvent('ldv:open-appointment')), 300); }}
                  className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all active:scale-95"
                  style={{ background: 'rgba(232,245,238,0.9)', border: '1px solid rgba(26,107,60,0.18)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span className="text-[12px] font-semibold text-[#104e2e]">Đặt lịch</span>
                </button>
              </div>

              {/* Danh mục — 2-col grid, ảnh thực /images/danh-muc/ */}
              <div className="px-3 pt-3 pb-1">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] px-1 mb-2.5" style={{ color: '#8a7a6a' }}>Danh mục</p>
                <div className="grid grid-cols-2 gap-2">
                  {DANH_MUC.map(({ label, href, img }) => (
                    <Link
                      key={href + label}
                      href={href}
                      onClick={handleClose}
                      className="group relative rounded-xl overflow-hidden"
                      style={{ aspectRatio: '4/3', background: '#1a1a1a', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                    >
                      <img
                        src={img}
                        alt={label}
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-active:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)' }} />
                      <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2">
                        <span className="text-white text-[12px] font-bold leading-snug" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                          {label}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/san-pham"
                  onClick={handleClose}
                  className="flex items-center justify-center gap-1.5 mt-2.5 py-2.5 rounded-xl text-[12px] font-semibold"
                  style={{ border: '1px solid rgba(16,78,46,0.25)', color: '#1a6b3c' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  Xem tất cả sản phẩm
                </Link>
              </div>

              {/* ── Editorial lantern card ── */}
              <div className="mx-4 mt-5 mb-1 rounded-2xl overflow-hidden relative" style={{ aspectRatio: '16/7' }}>
                <img
                  src="/images/hero/hero-2.webp"
                  alt="Đèn lồng Hội An thủ công truyền thống — LongDenViet"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.1) 100%)' }}
                />
                <div className="relative p-4 h-full flex flex-col justify-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-amber mb-1">LongDenViet®</p>
                  <p className="text-[16px] font-bold text-white leading-snug" style={{ letterSpacing: '-0.02em' }}>
                    Đèn thủ công<br/>Hội An chính gốc
                  </p>
                  <a
                    href="tel:0989778247"
                    className="inline-flex items-center gap-1.5 mt-2.5 text-[13px] font-bold text-white/90 w-fit"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                    0989.778.247
                  </a>
                </div>
              </div>

              {/* ── Support 2×2 grid ── */}
              <div className="px-4 pt-4 pb-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a7a6a] mb-3">Hỗ trợ</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Liên hệ & Tư vấn',       href: '/lien-he',                  img: I.cafe,     desc: 'Chat hoặc gọi ngay' },
                    { label: 'Câu hỏi thường gặp',      href: '/hoi-dap',                  img: I.hoian,    desc: 'Giải đáp thắc mắc' },
                    { label: 'Chính sách vận chuyển',   href: '/chinh-sach-van-chuyen',    img: I.outdoor,  desc: 'Giao hàng toàn quốc' },
                    { label: 'Chi nhánh & Cửa hàng',    href: '/cn-hcm',                   img: I.nha_hang, desc: 'HCM · Hội An' },
                  ].map(card => (
                    <Link
                      key={card.href}
                      href={card.href}
                      onClick={handleClose}
                      className="group relative rounded-xl overflow-hidden"
                      style={{ aspectRatio: '5/3' }}
                    >
                      <img
                        src={card.img}
                        alt={`${card.label} — đèn lồng thủ công LongDenViet`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-active:scale-[1.03]"
                        loading="lazy"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <p className="text-white text-[12px] font-bold leading-snug">{card.label}</p>
                        <p className="text-white/60 text-[10px] mt-0.5">{card.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Level 2 — Sub-menu */
            <div className="flex flex-col h-full">
              {/* Sub-menu header */}
              <div
                className="flex items-center px-5 py-3 shrink-0"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#F5F0E8' }}
              >
                <button
                  onClick={() => setActiveItem(null)}
                  className="flex items-center gap-2 text-[15px] font-semibold text-[#555] mr-auto"
                >
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6,1 1,6 6,11"/>
                  </svg>
                  Quay lại
                </button>
                <span className={`text-[17px] font-bold absolute left-1/2 -translate-x-1/2 ${activeItem.isTet ? 'text-red-600' : 'text-[#1a1a1a]'}`}>
                  {activeItem.label}
                </span>
                <Link href={activeItem.href} onClick={handleClose}
                  className="text-[14px] text-brand-amber font-bold ml-auto">
                  Tất cả
                </Link>
              </div>

              {/* Sub items — 3-col portrait grid, golden ratio */}
              <div className="px-4 pt-4 pb-6 grid grid-cols-3 gap-3">
                {activeItem.sub!.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={handleClose}
                    className="group flex flex-col"
                  >
                    <div
                      className="w-full rounded-xl overflow-hidden mb-1.5 bg-[#e8e1d8]"
                      style={{ aspectRatio: '5/8' }}
                    >
                      <img
                        src={dynSubImg(sub.href, normalizeImg(sub.image))}
                        alt={sub.label}
                        className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = M.hoian; }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-[#1a1a1a] leading-snug text-center">
                      {sub.label.replace(' →', '')}
                    </span>
                  </Link>
                ))}
                {/* "See all" charcoal tile */}
                <Link
                  href={activeItem.href}
                  onClick={handleClose}
                  className="flex flex-col items-center justify-center rounded-xl bg-[#1a1a1a]"
                  style={{ aspectRatio: '5/8' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  <span className="text-white text-[12px] font-bold mt-1.5 leading-tight text-center">Xem<br/>tất cả</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
