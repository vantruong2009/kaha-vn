'use client';

import React, { useState } from 'react';

/* ─── Contacts ──────────────────────────────────────────────────────────────── */
const C = {
  zaloPhone:   '0989778247',
  callPhone1:  '0989778247',
  callPhone2:  '0905151701',
  viberIntl:   '%2B84905151701',
  waPhone:     '84905151701',
  iMsgPhone:   '+84905151701',
  facebookUrl: 'https://m.me/longdenviet',
  salesEmail:  'hi@kaha.vn',
  googleMap:   'https://maps.app.goo.gl/longdenviet',
};

type Mode = 'chat' | 'call' | 'email';
interface Props { open: boolean; onClose: () => void; }

/* ─── UI Icons ───────────────────────────────────────────────────────────────── */
const I = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...p} />
);
const IcoPhoneUI = () => <I><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></I>;
const IcoChatUI  = () => <I><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></I>;
const IcoMailUI  = () => <I><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></I>;
const IcoX       = () => <I width="14" height="14" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></I>;
const IcoArrow   = () => <I strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></I>;
const IcoMap     = () => <I width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></I>;

/* ─── iMessage white icon ────────────────────────────────────────────────────── */
const IcoIMessageW = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
);

/* ─── Brand icons — inline SVG (không dùng external CDN) ───────────────────── */
const IcoZalo = () => (
  <svg width="28" height="10" viewBox="0 0 25 9" aria-hidden="true">
    <path fill="white" d="M12.6808693,2.52045104 L12.6808693,2.06398482 L14.048117,2.06398482 L14.048117,8.48239004 L13.2659151,8.48239004 C12.9439124,8.48239004 12.6825323,8.22236344 12.6808772,7.90080374 C12.6806605,7.90096172 12.6804438,7.90111968 12.6802271,7.90127761 C12.129539,8.30399226 11.448805,8.54305395 10.7134839,8.54305395 C8.87197018,8.54305395 7.37885092,7.05092395 7.37885092,5.21063028 C7.37885092,3.37033661 8.87197018,1.87820661 10.7134839,1.87820661 C11.448805,1.87820661 12.129539,2.1172683 12.6802271,2.51998295 C12.6804412,2.52013896 12.6806552,2.520295 12.6808693,2.52045106 Z M7.02456422,0 L7.02456422,0.20809598 C7.02456422,0.596210225 6.97270642,0.913087295 6.72048165,1.28483624 L6.68997706,1.31965261 C6.63490826,1.38206536 6.50566514,1.52871125 6.44417431,1.60829152 L2.05488532,7.11746011 L7.02456422,7.11746011 L7.02456422,7.89737882 C7.02456422,8.22051321 6.76238532,8.48235796 6.4390367,8.48235796 L0,8.48235796 L0,8.11462011 C0,7.66425356 0.11190367,7.46337756 0.253348624,7.25399803 L4.93243119,1.46244785 L0.195068807,1.46244785 L0.195068807,0 L7.02456422,0 Z M15.7064427,8.48239004 C15.4375206,8.48239004 15.2188509,8.2638652 15.2188509,7.9952818 L15.2188509,3.20888173e-05 L16.6824289,3.20888173e-05 L16.6824289,8.48239004 L15.7064427,8.48239004 Z M21.0096009,1.83801536 C22.8639587,1.83801536 24.366711,3.34137645 24.366711,5.19290121 C24.366711,7.04603041 22.8639587,8.54939149 21.0096009,8.54939149 C19.1552431,8.54939149 17.6524908,7.04603041 17.6524908,5.19290121 C17.6524908,3.34137645 19.1552431,1.83801536 21.0096009,1.83801536 Z M10.7134839,7.17125701 C11.7971995,7.17125701 12.6754106,6.29362786 12.6754106,5.21063028 C12.6754106,4.12923714 11.7971995,3.25160799 10.7134839,3.25160799 C9.62976835,3.25160799 8.75155734,4.12923714 8.75155734,5.21063028 C8.75155734,6.29362786 9.62976835,7.17125701 10.7134839,7.17125701 Z M21.0096009,7.16796791 C22.0997385,7.16796791 22.9843716,6.283921 22.9843716,5.19290121 C22.9843716,4.10348586 22.0997385,3.21959939 21.0096009,3.21959939 C19.9178578,3.21959939 19.0348303,4.10348586 19.0348303,5.19290121 C19.0348303,6.283921 19.9178578,7.16796791 21.0096009,7.16796791 Z"/>
  </svg>
);
const IcoWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);
const IcoMessenger = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
  </svg>
);
const IcoViber = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M11.4 1C6.64 1.05 2.27 4.9 2.01 9.65c-.14 2.55.64 4.94 2.07 6.8L2.05 22l5.81-1.94c1.54.8 3.27 1.23 5.1 1.2 5.23-.1 9.44-4.38 9.44-9.63C22.4 6.02 17.42.96 11.4 1zm5.26 13.26c-.26.69-1.52 1.35-2.07 1.39-.53.04-1.04.23-3.5-.73-2.96-1.16-4.86-4.17-5.01-4.36-.14-.19-1.19-1.58-1.19-3.02S5.61 5.6 6.07 5.1c.45-.5.98-.63 1.31-.64.33 0 .65 0 .93.01.3.01.7-.11 1.09.84.4.97 1.36 3.35 1.48 3.59.12.24.2.52.04.84-.16.32-.24.52-.48.8-.24.28-.5.62-.72.83-.24.23-.49.48-.21.94.28.46 1.24 2.05 2.67 3.32 1.83 1.63 3.38 2.14 3.86 2.38.47.24.75.2 1.03-.12.28-.32 1.19-1.39 1.51-1.87.32-.47.64-.39 1.08-.24.44.16 2.79 1.32 3.27 1.56.47.24.79.36.91.56.11.2.11 1.14-.15 1.83z"/>
  </svg>
);
const IcoWeChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-3.898-6.348-7.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 01.177-.554C23.102 18.117 24 16.61 24 14.999c0-3.249-2.981-5.977-7.063-6.141zm-2.456 3.728c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982zm4.943 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
  </svg>
);

/* ─── Glass design tokens ────────────────────────────────────────────────────── */
const G = {
  // Drawer surface — warm frosted glass
  drawer:     'rgba(246,242,236,0.94)',
  drawerBlur: 'blur(16px) saturate(140%)',
  // Card — glass tile
  card:       'rgba(255,255,255,0.72)',
  cardBorder: '1px solid rgba(255,255,255,0.88)',
  // Specular top-edge highlight (light reflection)
  specular:   'inset 0 1.5px 0 rgba(255,255,255,0.9)',
  // Segment tray
  segTray:    'rgba(0,0,0,0.075)',
  segPill:    'rgba(255,255,255,0.92)',
};

// Icon box shadow: specular top + colored glow
const iShadow = (r: number, g: number, b: number) =>
  `inset 0 1.5px 0 rgba(255,255,255,0.42), 0 6px 18px rgba(${r},${g},${b},0.38)`;

/* ─── Chat apps ──────────────────────────────────────────────────────────────── */
const APPS = [
  { id: 'zalo',      name: 'Zalo',      sub: 'zalo.me',   grad: 'linear-gradient(145deg,#0055d4,#1a7fff)', icon: <IcoZalo />,      href: `https://zalo.me/${C.zaloPhone}`,         badge: 'Phổ biến', glow: iShadow(0,85,255) },
  { id: 'whatsapp',  name: 'WhatsApp',  sub: 'Quốc tế',   grad: 'linear-gradient(145deg,#1aac4e,#2fd567)', icon: <IcoWhatsApp />,  href: `https://wa.me/${C.waPhone}`,             badge: 'Int\'l',   glow: iShadow(26,172,78) },
  { id: 'messenger', name: 'Messenger', sub: 'Facebook',  grad: 'linear-gradient(145deg,#5e3fff,#1877f2)', icon: <IcoMessenger />, href: C.facebookUrl,                            badge: null,       glow: iShadow(94,63,255) },
  { id: 'viber',     name: 'Viber',     sub: 'Miễn phí',  grad: 'linear-gradient(145deg,#4c3d9e,#8b7de8)', icon: <IcoViber />,     href: `viber://chat?number=${C.viberIntl}`,     badge: null,       glow: iShadow(76,61,158) },
  { id: 'wechat',    name: 'WeChat',    sub: '微信',        grad: 'linear-gradient(145deg,#06a152,#1dc760)', icon: <IcoWeChat />,    href: 'weixin://',                              badge: null,       glow: iShadow(6,161,82) },
  { id: 'imessage',  name: 'iMessage',  sub: 'iPhone',    grad: 'linear-gradient(145deg,#1aac4e,#30d158)', icon: <IcoIMessageW />,                               href: `sms:${C.iMsgPhone}`,                     badge: 'iOS',      glow: iShadow(26,172,78) },
];

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function AppointmentDrawer({ open, onClose }: Props) {
  const [mode, setMode] = useState<Mode>('chat');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  function handleClose() {
    onClose();
    setTimeout(() => { setName(''); setNote(''); }, 300);
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = encodeURIComponent([
      'Xin chào / Hello KAHA,', '',
      'Tôi muốn được tư vấn sản phẩm.',
      'I would like to request a product consultation.',
      ...(name.trim() ? [`\nTên / Name: ${name.trim()}`] : []),
      ...(note.trim() ? [`Nhu cầu / Message: ${note.trim()}`] : []),
      '\nCảm ơn / Thank you!',
    ].join('\n'));
    const subject = encodeURIComponent('Tư vấn sản phẩm / Consultation Request – KAHA');
    window.location.href = `mailto:${C.salesEmail}?subject=${subject}&body=${body}`;
    handleClose();
  }

  const MODES: { key: Mode; label: string; icon: React.ReactNode }[] = [
    { key: 'chat',  label: 'Chat',     icon: <IcoChatUI /> },
    { key: 'call',  label: 'Gọi điện', icon: <IcoPhoneUI /> },
    { key: 'email', label: 'Email',    icon: <IcoMailUI /> },
  ];
  const modeIdx = MODES.findIndex(m => m.key === mode);

  return (
    <>
      <style>{`
        .appt-app {
          transition: transform 0.14s ease, opacity 0.14s ease, box-shadow 0.14s ease;
        }
        .appt-app:active {
          opacity: 0.78;
          transform: scale(0.94);
        }
        .appt-call-card {
          transition: transform 0.14s ease, opacity 0.14s ease;
        }
        .appt-call-card:active {
          opacity: 0.82;
          transform: scale(0.96);
        }
        .appt-input:focus {
          border-color: rgba(16,78,46,0.5) !important;
          box-shadow: 0 0 0 3.5px rgba(16,78,46,0.1), inset 0 1px 0 rgba(255,255,255,0.8) !important;
          background: rgba(255,255,255,0.95) !important;
        }
        .appt-cta {
          transition: transform 0.14s ease, opacity 0.14s ease;
        }
        .appt-cta:active {
          opacity: 0.86;
          transform: scale(0.984);
        }
        .appt-seg-btn {
          transition: color 0.2s ease;
        }
        @keyframes appt-online-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5), 0 0 0 2px rgba(187,247,208,0.7); }
          50%       { box-shadow: 0 0 0 4px rgba(34,197,94,0.0), 0 0 0 2px rgba(187,247,208,0.7); }
        }
      `}</style>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(8,16,8,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          onClick={handleClose}
        />
      )}

      {/* ── Drawer ── */}
      <div style={{
        position: 'fixed', left: 0, right: 0, zIndex: 55,
        bottom: open ? 62 : '-110%',
        transition: 'bottom 0.34s cubic-bezier(0.32,0.72,0,1)',
        background: G.drawer,
        backdropFilter: G.drawerBlur,
        WebkitBackdropFilter: G.drawerBlur,
        borderRadius: '26px 26px 0 0',
        boxShadow: '0 -1px 0 rgba(255,255,255,0.75), 0 -24px 64px rgba(0,0,0,0.2), 0 -4px 16px rgba(0,0,0,0.08)',
        borderTop: '1px solid rgba(255,255,255,0.55)',
        // Flex column: header non-scroll + content scroll
        display: 'flex', flexDirection: 'column',
        maxHeight: 'calc(100dvh - 150px)',
      }}>

        {/* ── Fixed header (non-scrolling): Handle + Title + Tabs ── */}
        <div style={{
          flexShrink: 0,
          background: G.drawer,
          backdropFilter: G.drawerBlur,
          WebkitBackdropFilter: G.drawerBlur,
          borderRadius: '26px 26px 0 0',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          paddingBottom: 2,
        }}>
          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
            <div style={{
              width: 36, height: 5, borderRadius: 99,
              background: 'rgba(0,0,0,0.14)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
            }} />
          </div>

          {/* Header */}
          <div style={{ padding: '13px 18px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 19, fontWeight: 800, color: '#0a1a0a', letterSpacing: '-0.045em', lineHeight: 1.1 }}>
                Liên hệ tư vấn
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#22c55e',
                  animation: 'appt-online-pulse 2.4s ease infinite',
                  display: 'inline-block', flexShrink: 0,
                }} />
                <p style={{ fontSize: 11.5, color: '#888', letterSpacing: '-0.01em' }}>
                  Miễn phí · Phản hồi trong 15 phút
                </p>
              </div>
            </div>
            {/* Close button — 44px touch target, luôn hiển thị ở mọi tab */}
            <button type="button" onClick={handleClose} style={{
              width: 44, height: 44, borderRadius: 22,
              background: 'rgba(0,0,0,0.08)',
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#333', cursor: 'pointer', flexShrink: 0,
              WebkitTapHighlightColor: 'transparent',
            }} aria-label="Đóng">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="2" y1="2" x2="14" y2="14"/><line x1="14" y1="2" x2="2" y2="14"/>
              </svg>
            </button>
          </div>

          {/* Segmented control */}
          <div style={{ padding: '14px 18px 0' }}>
          <div style={{
            position: 'relative',
            background: G.segTray,
            borderRadius: 14,
            display: 'flex',
            padding: 3,
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
          }}>
            {/* Sliding pill */}
            <div style={{
              position: 'absolute', top: 3, bottom: 3,
              left: 3,
              width: 'calc((100% - 6px) / 3)',
              transform: `translateX(${modeIdx * 100}%)`,
              transition: 'transform 0.28s cubic-bezier(0.34,1.18,0.64,1)',
              borderRadius: 11,
              background: G.segPill,
              boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,1), 0 2px 10px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.07)',
              pointerEvents: 'none',
            }} />
            {MODES.map(({ key, label, icon }) => (
              <button key={key} type="button" onClick={() => setMode(key)}
                className="appt-seg-btn"
                style={{
                  flex: 1, position: 'relative', zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '10px 4px',
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  fontSize: 12.5,
                  fontWeight: mode === key ? 700 : 500,
                  color: mode === key ? '#0d3d20' : '#777',
                  letterSpacing: '-0.01em',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                {icon}{label}
              </button>
            ))}
          </div>
        </div>
        </div>{/* /fixed header */}

        {/* ── Scrollable content area ── */}
        <div style={{ overflowY: 'auto', flex: 1, overscrollBehavior: 'contain', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>

        {/* ────────────── CHAT ────────────── */}
        {mode === 'chat' && (
          <div style={{ padding: '13px 14px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
              {APPS.map(({ id, name: appName, sub, grad, icon, href, badge, glow }) => (
                <a key={id} href={href} target="_blank" rel="noopener noreferrer"
                  className="appt-app"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: '11px 12px',
                    background: G.card,
                    borderRadius: 18,
                    border: G.cardBorder,
                    // Glass card shadow: specular top + depth
                    boxShadow: `${G.specular}, 0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)`,
                    textDecoration: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    position: 'relative', overflow: 'hidden',
                  }}>
                  {/* Icon box */}
                  <span style={{
                    width: 44, height: 44,
                    borderRadius: 14, flexShrink: 0,
                    background: grad,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: glow,
                  }}>
                    {icon}
                  </span>
                  {/* Text */}
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0d1a0d', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                        {appName}
                      </span>
                      {badge && (
                        <span style={{
                          fontSize: 8.5, fontWeight: 700, letterSpacing: '0.02em',
                          padding: '1.5px 5.5px', borderRadius: 20,
                          // Tinted glass badge
                          background: id === 'zalo'
                            ? 'rgba(0,104,255,0.1)'
                            : id === 'imessage'
                            ? 'rgba(26,172,78,0.1)'
                            : id === 'whatsapp'
                            ? 'rgba(26,172,78,0.1)'
                            : 'rgba(94,63,255,0.1)',
                          color: id === 'zalo'
                            ? '#0055d4'
                            : id === 'imessage'
                            ? '#1aac4e'
                            : id === 'whatsapp'
                            ? '#15803d'
                            : '#5e3fff',
                          border: id === 'zalo'
                            ? '1px solid rgba(0,104,255,0.18)'
                            : id === 'imessage'
                            ? '1px solid rgba(26,172,78,0.18)'
                            : id === 'whatsapp'
                            ? '1px solid rgba(26,172,78,0.18)'
                            : '1px solid rgba(94,63,255,0.18)',
                          flexShrink: 0,
                        }}>{badge}</span>
                      )}
                    </span>
                    <span style={{ display: 'block', fontSize: 10.5, color: '#b0a898', marginTop: 1.5, letterSpacing: '-0.01em' }}>
                      {sub}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ────────────── CALL ────────────── */}
        {mode === 'call' && (
          <div style={{ padding: '13px 16px 24px' }}>

            {/* Hotline dark glass card */}
            <div style={{
              background: 'linear-gradient(145deg, #092b18 0%, #0e4226 50%, #135230 100%)',
              borderRadius: 22, padding: '18px 20px 16px',
              marginBottom: 11, position: 'relative', overflow: 'hidden',
              boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.12), 0 8px 28px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.16)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              {/* Decorative glow orb */}
              <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,200,80,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -20, left: 10, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,130,42,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <p style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 11 }}>
                Hotline hỗ trợ
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 7 }}>
                <a href={`tel:${C.callPhone1}`} style={{ fontSize: 25, fontWeight: 800, color: '#fff', letterSpacing: '-0.045em', textDecoration: 'none', lineHeight: 1 }}>
                  0989.778.247
                </a>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.04em' }}>Kinh doanh</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <a href={`tel:${C.callPhone2}`} style={{ fontSize: 25, fontWeight: 800, color: 'rgba(255,255,255,0.78)', letterSpacing: '-0.045em', textDecoration: 'none', lineHeight: 1 }}>
                  0905.151.701
                </a>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.04em' }}>Tư vấn</span>
              </div>
              <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.32)', marginTop: 10, letterSpacing: '-0.01em' }}>
                8:00–21:00 · Thứ 2 – Chủ nhật
              </p>
            </div>

            {/* 4 action buttons 2×2 glass */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
              {[
                { href: `tel:${C.callPhone1}`, grad: 'linear-gradient(145deg,#104e2e,#1e7a40)', shadow: iShadow(16,78,46), icon: <IcoPhoneUI />, label: 'Gọi 0989', sub: 'Kinh doanh' },
                { href: `tel:${C.callPhone2}`, grad: 'linear-gradient(145deg,#104e2e,#1e7a40)', shadow: iShadow(16,78,46), icon: <IcoPhoneUI />, label: 'Gọi 0905', sub: 'Tư vấn' },
                { href: `https://zalo.me/${C.zaloPhone}`, grad: 'linear-gradient(145deg,#0055d4,#1a7fff)', shadow: iShadow(0,85,255), icon: <IcoZalo />, label: 'Zalo Call', sub: 'Miễn phí', blank: true },
                { href: `sms:${C.iMsgPhone}`, grad: 'linear-gradient(145deg,#1aac4e,#30d158)', shadow: iShadow(26,172,78), icon: <IcoIMessageW />, label: 'iMessage', sub: 'iPhone' },
              ].map(({ href, grad, shadow, icon, label, sub, blank }) => (
                <a key={label} href={href}
                  {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="appt-call-card"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
                    padding: '15px 10px',
                    borderRadius: 18,
                    background: G.card,
                    border: G.cardBorder,
                    boxShadow: `${G.specular}, 0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)`,
                    color: '#0d1a0d',
                    textDecoration: 'none',
                    WebkitTapHighlightColor: 'transparent',
                  }}>
                  <span style={{
                    width: 46, height: 46, borderRadius: 15,
                    background: grad,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: shadow,
                    color: '#fff',
                  }}>
                    {icon}
                  </span>
                  <span style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '-0.025em', color: '#0d1a0d' }}>{label}</p>
                    <p style={{ fontSize: 10, color: '#b0a898', marginTop: 1 }}>{sub}</p>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ────────────── EMAIL ────────────── */}
        {mode === 'email' && (
          <form onSubmit={handleEmailSubmit} style={{ padding: '13px 16px 24px' }}>

            {/* Email card */}
            <div style={{
              background: G.card,
              border: G.cardBorder,
              borderRadius: 18, padding: '13px 15px', marginBottom: 13,
              display: 'flex', alignItems: 'center', gap: 13,
              boxShadow: `${G.specular}, 0 4px 16px rgba(0,0,0,0.06)`,
            }}>
              <span style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(145deg,#092b18,#1e7a40)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: iShadow(16,78,46),
                color: '#fff',
              }}>
                <IcoMailUI />
              </span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0d1a0d', letterSpacing: '-0.025em' }}>{C.salesEmail}</p>
                <p style={{ fontSize: 10.5, color: '#b0a898', marginTop: 2 }}>Phản hồi trong 24h · Reply within 24h</p>
              </div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 5, letterSpacing: '-0.01em' }}>
                Họ tên / Your name <span style={{ color: '#c0b8b0', fontWeight: 400 }}>(tuỳ chọn)</span>
              </label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Tên bạn / Your name..."
                className="appt-input"
                style={{
                  width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                  borderRadius: 13,
                  border: '1px solid rgba(0,0,0,0.09)',
                  background: 'rgba(255,255,255,0.75)',
                  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.04)',
                  fontSize: 14, color: '#111',
                  outline: 'none', fontFamily: 'inherit',
                  transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
                }} />
            </div>

            {/* Message */}
            <div style={{ marginBottom: 13 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 5, letterSpacing: '-0.01em' }}>
                Nhu cầu / Your message <span style={{ color: '#c0b8b0', fontWeight: 400 }}>(tuỳ chọn)</span>
              </label>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder={'VD: Cần đèn Hội An cho nhà hàng...\nE.g. I need lanterns for a restaurant...'}
                rows={3}
                className="appt-input"
                style={{
                  width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                  borderRadius: 13,
                  border: '1px solid rgba(0,0,0,0.09)',
                  background: 'rgba(255,255,255,0.75)',
                  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.04)',
                  fontSize: 14, color: '#111',
                  outline: 'none', fontFamily: 'inherit', resize: 'none', lineHeight: 1.65,
                  transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
                }} />
            </div>

            {/* Submit */}
            <button type="submit" className="appt-cta" style={{
              width: '100%', padding: '14px 0', borderRadius: 16,
              background: 'linear-gradient(145deg, #0a2e18 0%, #104e2e 55%, #1a6b3c 100%)',
              color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '-0.025em',
              border: 'none', cursor: 'pointer',
              boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.14), 0 8px 28px rgba(16,78,46,0.35), 0 2px 6px rgba(0,0,0,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              WebkitTapHighlightColor: 'transparent',
            }}>
              Gửi email · Send Email <IcoArrow />
            </button>

            {/* Business info */}
            <div style={{
              marginTop: 13, padding: '14px 15px',
              background: G.card,
              borderRadius: 16,
              border: G.cardBorder,
              boxShadow: `${G.specular}, 0 4px 16px rgba(0,0,0,0.05)`,
            }}>
              <p style={{ fontSize: 10.5, fontWeight: 800, color: '#333', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 9 }}>
                HỘ KINH DOANH KAHA HOME
              </p>
              {[
                ['Địa chỉ', '262/1/93 Phan Anh, P.Phú Thạnh, TP.HCM'],
                ['MST', '079192026914'],
                ['Điện thoại', '0989.778.247'],
                ['Email', 'hi@kaha.vn'],
                ['Website', 'kaha.vn'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: 7, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#b0a898', minWidth: 58, flexShrink: 0 }}>{label}:</span>
                  <span style={{ fontSize: 11, color: '#3a3a3a', fontWeight: 500, lineHeight: 1.4 }}>{value}</span>
                </div>
              ))}
              <a href="https://maps.app.goo.gl/longdenviet" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 7, fontSize: 11, fontWeight: 600, color: '#104e2e', textDecoration: 'none' }}>
                <IcoMap />
                KAHA® — Xưởng Đèn Lồng Trang Trí
              </a>
            </div>
          </form>
        )}

        </div>{/* /scrollable content */}
      </div>
    </>
  );
}
