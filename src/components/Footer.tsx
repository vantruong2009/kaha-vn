'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { FooterNavRow } from '@/lib/site-settings';


interface FooterSettings {
  phone?: string; email?: string; address?: string;
  copyright?: string;
  navRows?: FooterNavRow[];
  ticker?: string[];
  mapsUrl?: string;
  locationLabel?: string;
  legalCompanyName?: string;
  legalTaxId?: string;
  legalRegisteredAddress?: string;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  newsletterDesc?: string;
  legalLinks?: [string, string][];
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
}

// Social SVG icons — monoline 20px
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none"/>
  </svg>
);
const IconTikTok = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/>
  </svg>
);
const IconYouTube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="4"/>
    <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none"/>
  </svg>
);

// Monoline SVG icons — premium, consistent stroke weight
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5.5A2.5 2.5 0 015.5 3h.5a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.23 1.02L6.4 9.38a11 11 0 005.22 5.22l1.38-1.42a1 1 0 011.02-.23l3.3 1.1A1 1 0 0118 15v.5A2.5 2.5 0 0115.5 18 12.5 12.5 0 013 5.5z"/>
  </svg>
);
const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.68 2 6 4.68 6 8c0 4.75 6 13 6 13s6-8.25 6-13c0-3.32-2.68-6-6-6z"/>
    <circle cx="12" cy="8" r="2.2"/>
  </svg>
);
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 8l10 6 10-6"/>
  </svg>
);

const MAPS_URL_DEFAULT = 'https://www.google.com/maps/place/LongDenViet%C2%AE+-+X%C6%B0%E1%BB%9Fng+%C4%90%C3%A8n+L%E1%BB%93ng+Trang+Tr%C3%AD+(Vietnam+Lanterns)/@10.7711243,106.6220421,911m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31752f2d324f4659:0xe6b0024a73e13b8f!8m2!3d10.771119!4d106.624617!16s%2Fg%2F11c1p6nxwm';

const DEFAULT_TICKER = ['KAHA · XƯỞNG TP.HCM','GIA CÔNG ĐÈN VẢI CAO CẤP','THEO BẢN VẼ DỰ ÁN','B2B · KHÁCH SẠN · F&B','PHẢN HỒI RFQ 48H','BẢO HÀNH KHUNG 12T','MADE IN VIETNAM','EST. 2016'];

const DEFAULT_NAV_ROWS: FooterNavRow[] = [
  {
    cat: 'Sản phẩm',
    links: [['Đèn Vải Treo Trần','/shop'],['Đèn Khung Kim Loại','/shop'],['Lồng Đèn Dân Gian','/shop'],['Gia Công Theo Yêu Cầu','/showroom'],['Tất cả →','/shop']],
  },
  {
    cat: 'Dự án',
    links: [['Khách Sạn & Resort','/shop'],['Nhà Hàng & F&B','/shop'],['Spa & Wellness','/shop'],['Retail & Showroom','/shop'],['Gửi Brief →','/showroom']],
  },
  {
    cat: 'KAHA',
    links: [['Về xưởng','/showroom'],['Journal kỹ thuật','/journal'],['Lookbook','/lookbook'],['Moodboard','/moodboard'],['Liên hệ','/showroom']],
  },
];

const CREAM = '#FFFFFF';
const CREAM_DARK = '#F5F5F5';  /* ticker + legal bar — slightly deeper */

export default function Footer({ settings }: { settings?: FooterSettings }) {
  const phone  = settings?.phone    || '090 515 1701';
  const email  = settings?.email    || 'hi@kaha.vn';
  const addr   = settings?.address  || '262/1/93 Phan Anh, Phường Phú Thạnh, Thành Phố Hồ Chí Minh, Việt Nam';
  const copy   = settings?.copyright    || '© 2026 KAHA®. Bảo lưu mọi quyền.';
  const navRows = settings?.navRows?.length ? settings.navRows : DEFAULT_NAV_ROWS;
  const ticker = settings?.ticker?.length ? settings.ticker : DEFAULT_TICKER;
  const mapsUrl = settings?.mapsUrl || MAPS_URL_DEFAULT;
  const locationLabel = settings?.locationLabel || 'Hội An & TP.HCM';
  const legalCompanyName = settings?.legalCompanyName || 'HỘ KINH DOANH KAHA HOME';
  const legalTaxId = settings?.legalTaxId || 'MST: 079192026914';
  const legalAddress = settings?.legalRegisteredAddress || '262/1/93 Phan Anh, Phường Phú Thạnh, Thành Phố Hồ Chí Minh, Việt Nam';
  const newsletterTitle    = settings?.newsletterTitle    || 'Nhận cập nhật';
  const newsletterSubtitle = settings?.newsletterSubtitle || 'Catalog & bảng giá mới nhất';
  const newsletterDesc     = settings?.newsletterDesc     || 'Sản phẩm mới · case B2B · tài liệu kỹ thuật';
  const DEFAULT_LEGAL_LINKS: [string, string][] = [
    ['Vận chuyển', '/chinh-sach-van-chuyen'],
    ['Đổi trả', '/chinh-sach-doi-tra'],
    ['Bảo mật', '/chinh-sach-bao-mat'],
    ['Điều khoản', '/dieu-khoan'],
    ['Sơ đồ website', '/so-do-website'],
  ];
  const legalLinks: [string, string][] = settings?.legalLinks?.length ? settings.legalLinks : DEFAULT_LEGAL_LINKS;

  const facebookUrl  = settings?.facebook_url  || 'https://www.facebook.com/longdenviet';
  const instagramUrl = settings?.instagram_url || '';
  const tiktokUrl    = settings?.tiktok_url    || '';
  const youtubeUrl   = settings?.youtube_url   || '';

  const socialLinks = [
    { href: facebookUrl,  label: 'Facebook',  Icon: IconFacebook  },
    { href: instagramUrl, label: 'Instagram', Icon: IconInstagram },
    { href: tiktokUrl,    label: 'TikTok',    Icon: IconTikTok    },
    { href: youtubeUrl,   label: 'YouTube',   Icon: IconYouTube   },
  ].filter(s => s.href);

  const [val, setVal] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <footer>

      {/* ══════════════════════════════════════════════
          TOP — Logo left + 3 contact cards right
      ══════════════════════════════════════════════ */}
      <div style={{ background: CREAM, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          <div className="flex flex-col md:flex-row items-center gap-6">

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image src="/logo.webp" alt="KAHA — Xưởng Gia Công Đèn Vải Cao Cấp" width={160} height={60} className="h-[60px] w-auto" />
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px self-stretch" style={{ background: 'rgba(0,0,0,0.1)' }} />

            {/* 3 contact cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">

              <a href="tel:+840905151701"
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#111111')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
              >
                <span className="shrink-0" style={{ color: '#111111' }}><IconPhone /></span>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.4)' }}>Gọi ngay</p>
                  <p style={{ color: '#111111', fontSize: '15px', fontWeight: 800 }}>0989.778.247</p>
                </div>
              </a>

              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#111111')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
              >
                <span className="shrink-0" style={{ color: '#111111' }}><IconPin /></span>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.4)' }}>Xem bản đồ</p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>{locationLabel}</p>
                </div>
              </a>

              <a href={`mailto:${email}`}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#111111')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
              >
                <span className="shrink-0" style={{ color: '#111111' }}><IconMail /></span>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.4)' }}>Email</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{email}</p>
                </div>
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          BOTTOM — Links ngang + Newsletter
      ══════════════════════════════════════════════ */}
      <div style={{ background: CREAM, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Link rows — horizontal */}
            <div className="flex-1 space-y-5">
              {navRows.map(({ cat, links }) => (
                <div key={cat} className="flex flex-wrap items-baseline gap-y-2">
                  <span
                    className="shrink-0 w-20 md:w-28 font-black uppercase"
                    style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#111111' }}
                  >
                    {cat}
                  </span>
                  <div className="flex flex-wrap items-center gap-y-2">
                    {links.map(([label, href], i, arr) => {
                      const isExternal = href.startsWith('http');
                      const linkStyle = { fontSize: '13px', color: 'rgba(0,0,0,0.55)' } as React.CSSProperties;
                      const cls = 'transition-colors';
                      return (
                        <span key={href} className="flex items-center">
                          {isExternal ? (
                            <a href={href} target="_blank" rel="noopener" className={cls} style={linkStyle}
                              onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.55)')}
                            >{label}</a>
                          ) : (
                            <Link href={href} className={cls} style={linkStyle}
                              onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.55)')}
                            >{label}</Link>
                          )}
                          {i < arr.length - 1 && (
                            <span className="mx-2.5" style={{ color: 'rgba(0,0,0,0.15)', fontSize: '11px' }}>/</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter — editorial style */}
            <div className="lg:w-[280px] shrink-0">
              <p style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#111111', marginBottom: '10px' }}>
                {newsletterTitle}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px', lineHeight: 1.4 }}>
                {newsletterSubtitle}
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginBottom: '18px' }}>
                {newsletterDesc}
              </p>
              {sent ? (
                <p style={{ color: '#111111', fontWeight: 600, fontSize: '13px' }}>Đã đăng ký ✓</p>
              ) : (
                <form onSubmit={e => { e.preventDefault(); if (val) { setSent(true); setVal(''); } }}>
                  <div className="flex items-center" style={{ borderBottom: '1.5px solid rgba(0,0,0,0.18)' }}>
                    <input
                      type="email" value={val} onChange={e => setVal(e.target.value)}
                      placeholder="địa chỉ email" required
                      className="flex-1 outline-none bg-transparent min-w-0 pb-2 placeholder:text-black/30"
                      style={{ fontSize: '13px', color: 'rgba(0,0,0,0.75)' }}
                    />
                    <button type="submit"
                      className="shrink-0 pb-2 transition-colors"
                      style={{ color: 'rgba(0,0,0,0.5)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.5)')}
                    >Đăng ký →</button>
                  </div>
                </form>
              )}

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3 mt-5">
                  {socialLinks.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex items-center justify-center rounded-lg transition-all"
                      style={{ width: 34, height: 34, background: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,0,0,0.08)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#111111'; e.currentTarget.style.borderColor = '#111111'; e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(0,0,0,0.45)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          TICKER — visual closure
      ══════════════════════════════════════════════ */}
      <div className="overflow-hidden py-3 select-none"
        style={{ background: CREAM_DARK, borderTop: '1px solid rgba(0,0,0,0.07)' }}
        aria-hidden
      >
        <div className="flex items-center gap-10 whitespace-nowrap"
          style={{ animation: 'ldv-tick 30s linear infinite', willChange: 'transform' }}
        >
          {[...ticker,...ticker,...ticker].map((t,i) => (
            <span key={i} className="flex items-center gap-10">
              <span style={{ fontSize:'10px', fontWeight:800, letterSpacing:'0.26em', color:'rgba(0,0,0,0.5)', textTransform:'uppercase' }}>{t}</span>
              <svg width="5" height="5" viewBox="0 0 6 6" fill="rgba(201,130,42,0.4)" aria-hidden="true"><circle cx="3" cy="3" r="3"/></svg>
            </span>
          ))}
        </div>
        <style>{`@keyframes ldv-tick { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }`}</style>
      </div>

      {/* ══════════════════════════════════════════════
          TRUST BADGES — payment & security
      ══════════════════════════════════════════════ */}
      <div style={{ background: CREAM_DARK, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex flex-wrap items-center justify-center gap-5">
          {[
            {
              label: 'COD — Thu hộ',
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20"/><path d="M6 14h2"/></svg>,
            },
            {
              label: 'Zalo Pay',
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8M12 8l4 4-4 4"/></svg>,
            },
            {
              label: 'MoMo',
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4"/></svg>,
            },
            {
              label: 'Chuyển khoản',
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
            },
            {
              label: 'SSL Bảo mật',
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
            },
          ].map(({ label, icon }) => (
            <span key={label} className="flex items-center gap-1.5" style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(0,0,0,0.4)' }}>
              <span style={{ color: 'rgba(0,0,0,0.3)' }}>{icon}</span>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          LEGAL BAR
      ══════════════════════════════════════════════ */}
      <div style={{ background: CREAM_DARK, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-left">
            <a href="https://kaha.vn" target="_blank" rel="noopener"
              style={{ fontSize:'11px', fontWeight:800, letterSpacing:'0.04em', color:'rgba(0,0,0,0.5)', textDecoration:'none' }}
              onMouseEnter={e=>(e.currentTarget.style.color='#111111')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(0,0,0,0.5)')}
            >{legalCompanyName}</a>
            <span style={{ color:'rgba(0,0,0,0.15)' }}>·</span>
            <span style={{ fontSize:'11px', color:'rgba(0,0,0,0.35)' }}>{legalTaxId}</span>
            <span style={{ color:'rgba(0,0,0,0.15)' }}>·</span>
            <span style={{ fontSize:'11px', color:'rgba(0,0,0,0.35)' }}>{legalAddress}</span>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1.5 text-left">
            {legalLinks.map(([l,h])=>(
              <Link key={h} href={h} style={{ fontSize:'11px', color:'rgba(0,0,0,0.4)' }}
                onMouseEnter={e=>(e.currentTarget.style.color='#333333')}
                onMouseLeave={e=>(e.currentTarget.style.color='rgba(0,0,0,0.4)')}
              >{l}</Link>
            ))}
            <span style={{ fontSize:'11px', color:'rgba(0,0,0,0.3)' }}>
              · {copy.includes('KAHA') ? (
                <>
                  {copy.split('KAHA')[0]}
                  <a
                    href="https://kaha.vn"
                    target="_blank"
                    rel="noopener"
                    style={{ color: 'rgba(0,0,0,0.45)', textDecoration: 'none', fontWeight: 700 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.45)')}
                  >
                    KAHA
                  </a>
                  {copy.split('KAHA').slice(1).join('KAHA')}
                </>
              ) : copy}
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
