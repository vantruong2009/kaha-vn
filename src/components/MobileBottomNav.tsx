'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import type { MobileBottomNavItem } from '@/lib/site-settings';
import AppointmentDrawer from '@/components/AppointmentDrawer';
import { useCart } from '@/context/CartContext';

/* ─── SVG Icons — stroke-only, không fill khi active ───────────────────────── */

const IconHome = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);
const IconCategory = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);
const IconSearch = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconAppointment = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.5"/>
    <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.5"/>
    <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.5"/>
    <line x1="8" y1="18" x2="8" y2="18" strokeWidth="2.5"/>
    <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5"/>
  </svg>
);
const IconCart = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="20" r="1.8"/>
    <circle cx="18" cy="20" r="1.8"/>
    <path d="M2 3h2l2.6 11.2a2 2 0 001.95 1.55h8.9a2 2 0 001.95-1.55L22 7H7"/>
  </svg>
);
const IconMore = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="8"  cy="12" r="1" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

/* ─── SVG Icons — drawers ───────────────────────────────────────────────────── */
const IconInfo = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
  </svg>
);
const IconBlog = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconPhone = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const IconShop = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);
const IconFaq = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5"/>
  </svg>
);
const IconTrackOrder = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l2-1.14"/>
    <path d="M16.5 9.4L7.55 4.24"/>
    <polyline points="3.29,7 12,12 20.71,7"/>
    <line x1="12" y1="22" x2="12" y2="12"/>
    <circle cx="18.5" cy="18.5" r="3.5"/>
    <polyline points="16.5,18.5 18,20 21,17"/>
  </svg>
);
/* ─── Danh mục ──────────────────────────────────────────────────────────────── */
const CATEGORY_ITEMS = [
  { label: 'Đèn Hội An',      href: '/c/hoi-an-lantern',  img: '/images/danh-muc/den-hoi-an.jpg' },
  { label: 'Đèn Tre & Mây',   href: '/c/den-may-tre',     img: '/images/danh-muc/den-may-tre.jpg' },
  { label: 'Chụp Đèn Vải',    href: '/c/chup-den-vai',    img: '/images/danh-muc/chup-den-vai.jpg' },
  { label: 'Đèn Lồng Gỗ',     href: '/c/den-long-go',     img: '/images/danh-muc/den-long-go.jpg' },
  { label: 'Đèn Kiểu Nhật',   href: '/c/den-nhat-ban',    img: '/images/danh-muc/den-nhat-ban.jpg' },
  { label: 'Đèn Thả Trần',    href: '/c/den-tha-tran',    img: '/images/danh-muc/den-tha-tran.jpg' },
  { label: 'Đèn Trái Tim',    href: '/c/den-trai-tim',    img: '/images/danh-muc/den-trai-tim.jpg' },
  { label: 'Đèn Tròn 10 Màu', href: '/c/den-tron-10-mau', img: '/images/danh-muc/den-tron-mau.jpg' },
  { label: 'Đèn Trung Thu',   href: '/c/den-trung-thu',   img: '/images/danh-muc/den-trung-thu.jpg' },
  { label: 'Đèn Vẽ Tranh',    href: '/c/den-ve-tranh',    img: '/images/danh-muc/den-ve-tranh.jpg' },
  { label: 'Gia Công Theo YC', href: '/c/gia-cong-den-trang-tri', img: '/images/danh-muc/den-hoi-an.jpg' },
  { label: 'Phụ Kiện Đèn',    href: '/c/phu-kien-den',    img: '/images/danh-muc/phu-kien-den.jpg' },
];

/* ─── Xem thêm ──────────────────────────────────────────────────────────────── */
const MORE_ITEMS = [
  { label: 'Giới Thiệu',   href: '/ve-chung-toi', icon: <IconInfo /> },
  { label: 'Blog',          href: '/blog',         icon: <IconBlog /> },
  { label: 'Liên Hệ',      href: '/lien-he',      icon: <IconPhone /> },
  { label: 'Xưởng Hội An', href: '/cn-hoi-an',    icon: <IconShop /> },
  { label: 'Xưởng HCM',    href: '/cn-hcm',       icon: <IconShop /> },
  { label: 'Xưởng HN',     href: '/cn-ha-noi',    icon: <IconShop /> },
  { label: 'Hỏi Đáp',        href: '/hoi-dap',        icon: <IconFaq /> },
  { label: 'Theo Dõi Đơn',   href: '/theo-doi-don-hang',   icon: <IconTrackOrder /> },
];

/* ─── Component ─────────────────────────────────────────────────────────────── */

interface Props { items?: MobileBottomNavItem[]; }

type DrawerType = null | 'category' | 'more';

const INACTIVE_COLOR = '#8aab95';
const ACTIVE_COLOR   = '#104e2e';

export default function MobileBottomNav({ items: _items }: Props) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [drawer, setDrawer] = useState<DrawerType>(null);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => setSearchOpen((e as CustomEvent<boolean>).detail);
    window.addEventListener('ldv:search-state', handler);
    return () => window.removeEventListener('ldv:search-state', handler);
  }, []);

  useEffect(() => {
    const handler = () => { setDrawer(null); setAppointmentOpen(true); };
    window.addEventListener('ldv:open-appointment', handler);
    return () => window.removeEventListener('ldv:open-appointment', handler);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('ldv:appointment-state', { detail: appointmentOpen }));
  }, [appointmentOpen]);

  function toggleDrawer(type: DrawerType) {
    setAppointmentOpen(false);
    setDrawer(v => {
      const next = v === type ? null : type;
      window.dispatchEvent(new CustomEvent('ldv:nav-drawer', { detail: next !== null }));
      return next;
    });
  }

  function isActive(key: string): boolean {
    if (key === 'home') return pathname === '/';
    if (key === 'cart') return pathname === '/gio-hang' || pathname.startsWith('/dat-hang');
    return false;
  }

  const tabs = [
    { key: 'home',        label: 'Trang chủ', href: '/' },
    { key: 'category',    label: 'Danh mục',  href: '#' },
    { key: 'search',      label: 'Tìm kiếm',  href: '#' },
    { key: 'cart',        label: 'Giỏ hàng',  href: '/gio-hang' },
    { key: 'more',        label: 'Xem thêm',  href: '#' },
  ];

  const iconEl = (key: string, active: boolean) => {
    if (key === 'home')        return <IconHome active={active} />;
    if (key === 'category')   return <IconCategory active={active} />;
    if (key === 'search')     return <IconSearch />;
    if (key === 'appointment') return <IconAppointment active={active} />;
    if (key === 'cart')       return <IconCart active={active} />;
    if (key === 'more')       return <IconMore active={active} />;
    return null;
  };

  /* Drawer shared style */
  const drawerStyle = (open: boolean): React.CSSProperties => ({
    position: 'fixed', left: 0, right: 0, zIndex: 50,
    bottom: open ? 62 : '-100%',
    maxHeight: '78vh',
    display: 'flex', flexDirection: 'column',
    transition: 'bottom 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
    background: 'rgba(246,242,236,0.97)',
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderTop: '1px solid rgba(255,255,255,0.6)',
    borderRadius: '20px 20px 0 0',
    boxShadow: '0 -1px 0 rgba(255,255,255,0.7), 0 -20px 60px rgba(0,0,0,0.18), 0 -4px 16px rgba(0,0,0,0.08)',
    paddingBottom: 'env(safe-area-inset-bottom, 8px)',
  });

  return (
    <>
      {/* ── Backdrop ── */}
      {drawer && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
          onClick={() => setDrawer(null)}
        />
      )}

      {/* ── Drawer Danh mục ── */}
      <div className="md:hidden" style={drawerStyle(drawer === 'category')}>
        {/* Header sticky với nút X lớn */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 14px 10px', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Danh mục</p>
          <button
            onClick={() => setDrawer(null)}
            style={{
              width: 44, height: 44, borderRadius: 22, flexShrink: 0,
              background: 'rgba(0,0,0,0.08)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              WebkitTapHighlightColor: 'transparent', cursor: 'pointer',
            }}
            aria-label="Đóng"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round">
              <line x1="2" y1="2" x2="14" y2="14"/><line x1="14" y1="2" x2="2" y2="14"/>
            </svg>
          </button>
        </div>
        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div className="grid grid-cols-3 px-3 pt-3" style={{ gap: 8 }}>
            {CATEGORY_ITEMS.map(({ label, href, img }) => (
              <Link
                key={href + label}
                href={href}
                onClick={() => setDrawer(null)}
                style={{ position: 'relative', display: 'block', height: 88, borderRadius: 14, overflow: 'hidden', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.18)', WebkitTapHighlightColor: 'transparent' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} loading="lazy" />
                <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
                <span style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '4px 6px 7px',
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  letterSpacing: '-0.01em', lineHeight: 1.25,
                  textAlign: 'center',
                  textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex justify-center pt-3 pb-4">
            <Link
              href="/san-pham"
              onClick={() => setDrawer(null)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '10px 20px', borderRadius: 22,
                background: '#104e2e',
                color: '#fff', fontSize: 13, fontWeight: 600,
                letterSpacing: '-0.01em',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Xem tất cả sản phẩm
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Drawer Xem thêm ── */}
      <div className="md:hidden" style={drawerStyle(drawer === 'more')}>
        {/* Header sticky với nút X lớn */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 14px 10px', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Xem thêm</p>
          <button
            onClick={() => setDrawer(null)}
            style={{
              width: 44, height: 44, borderRadius: 22, flexShrink: 0,
              background: 'rgba(0,0,0,0.08)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              WebkitTapHighlightColor: 'transparent', cursor: 'pointer',
            }}
            aria-label="Đóng"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round">
              <line x1="2" y1="2" x2="14" y2="14"/><line x1="14" y1="2" x2="2" y2="14"/>
            </svg>
          </button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div className="grid grid-cols-4 gap-y-5 px-4 pt-4 pb-5">
            {MORE_ITEMS.map(({ label, href, icon }) => (
              <Link
                key={href + label}
                href={href}
                onClick={() => setDrawer(null)}
                className="flex flex-col items-center gap-2"
              >
                <span className="flex items-center justify-center rounded-2xl" style={{ width: 54, height: 54, background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.88)', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.95), 0 4px 14px rgba(0,0,0,0.07)', color: '#104e2e' }}>
                  {icon}
                </span>
                <span className="text-center font-semibold text-[#333]" style={{ fontSize: 12, lineHeight: 1.3 }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Drawer Đặt lịch ── */}
      <AppointmentDrawer open={appointmentOpen} onClose={() => setAppointmentOpen(false)} />

      {/* ── Bottom nav bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div style={{
          background: 'rgba(246,242,236,0.9)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderTop: '1px solid rgba(255,255,255,0.65)',
          boxShadow: '0 -1px 0 rgba(255,255,255,0.85), 0 -12px 40px rgba(0,0,0,0.08)',
        }}>

          <div className="flex items-stretch" style={{ height: 62 }}>
            {tabs.map(({ key, label, href }) => {
              const active   = isActive(key);
              const isDrawerActive = (key === 'category' && drawer === 'category') || (key === 'more' && drawer === 'more');
              const isActiveFull   = active || isDrawerActive;
              const isSearch      = key === 'search';
              const isAppt        = key === 'appointment';
              const isApptActive  = isAppt && appointmentOpen;
              const finalActive   = isActiveFull || isApptActive;

              const inner = (
                <span className="flex flex-col items-center justify-center w-full h-full relative select-none" style={{ gap: 3 }}>
                  {/* Active dot */}
                  <span style={{
                    position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
                    width: 4, height: 4, borderRadius: '50%',
                    background: finalActive ? ACTIVE_COLOR : 'transparent',
                    transition: 'background 0.2s',
                  }} />
                  {/* Icon */}
                  <span className="relative flex items-center justify-center" style={{ color: finalActive ? ACTIVE_COLOR : INACTIVE_COLOR }}>
                    {iconEl(key, finalActive)}
                    {key === 'cart' && totalItems > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -10,
                          minWidth: 16,
                          height: 16,
                          borderRadius: 999,
                          background: '#c9822a',
                          color: '#fff',
                          fontSize: 9,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 3px',
                          border: '1.5px solid #fff',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                        }}
                      >
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
                  </span>
                  {/* Label */}
                  <span className="leading-none transition-all duration-200" style={{
                    fontSize: 10.5,
                    fontWeight: finalActive ? 700 : 500,
                    color: finalActive ? ACTIVE_COLOR : INACTIVE_COLOR,
                  }}>
                    {label}
                  </span>
                </span>
              );

              const wrapperStyle: React.CSSProperties = {
                flex: 1, display: 'flex', alignItems: 'stretch', justifyContent: 'center',
                WebkitTapHighlightColor: 'transparent', cursor: 'pointer',
              };

              if (isSearch) {
                return (
                  <button key={key} type="button"
                    onClick={() => {
                      setDrawer(null);
                      setAppointmentOpen(false);
                      window.dispatchEvent(new Event(searchOpen ? 'ldv:close-search' : 'ldv:open-search'));
                    }}
                    style={wrapperStyle}>
                    {inner}
                  </button>
                );
              }
              if (isAppt) {
                return (
                  <button key={key} type="button"
                    onClick={() => {
                      setDrawer(null);
                      setAppointmentOpen(v => !v);
                    }}
                    style={wrapperStyle}>
                    {inner}
                  </button>
                );
              }
              if (key === 'category') {
                return (
                  <button key={key} type="button" onClick={() => toggleDrawer('category')} style={wrapperStyle}>
                    {inner}
                  </button>
                );
              }
              if (key === 'more') {
                return (
                  <button key={key} type="button" onClick={() => toggleDrawer('more')} style={wrapperStyle}>
                    {inner}
                  </button>
                );
              }
              return (
                <Link key={key} href={href} onClick={() => setDrawer(null)} style={wrapperStyle}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
