'use client';

import { useState, useEffect, useRef } from 'react';

export interface ZaloQRSettings {
  enabled: boolean;
  label: string;
  labelColor: string;
  labelWeight: string;
  btnColor1: string;
  btnColor2: string;
  btnShadow: string;
  btnEffect: 'none' | 'pulse' | 'bounce' | 'shake' | 'glow';
  phone: string;
  img: string;
  size: number;
  borderEffect: 'goldDash' | 'none' | 'rainbow' | 'spin' | 'pulseBorder' | 'neon' | 'fire' | 'snake';
  headerLabel: string;
  headerSub: string;
  callPhone: string;
  viberPhone: string;
  facebookUrl: string;
  whatsappPhone: string;
  wechatPhone: string;
  wechatImg: string;
}

export default function ZaloQRFloat({ settings }: { settings: ZaloQRSettings }) {
  const [open, setOpen] = useState(false);
  const [iconIdx, setIconIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIconIdx(i => (i + 1) % 3), 2000);
    return () => clearInterval(id);
  }, []);

  // Snake border — RAF-based, avoids iOS Safari CSS filter + SMIL bug
  const [snakeOffset, setSnakeOffset] = useState(0);
  const snakeRef = useRef(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (settings.borderEffect !== 'snake') return;
    const SIZE_ = settings.size;
    const R_ = 14, STROKE_ = 3;
    const P = 4 * (SIZE_ - 2 * STROKE_ - 2 * R_) + 2 * Math.PI * R_;
    let last = 0;
    const step = (ts: number) => {
      const dt = last ? ts - last : 0;
      last = ts;
      snakeRef.current -= P * (dt / 2200);
      if (snakeRef.current <= -P) snakeRef.current += P;
      setSnakeOffset(snakeRef.current);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [settings.borderEffect, settings.size]);

  if (!settings.enabled) return null;

  const zaloPhone    = settings.phone.replace(/\D/g, '');
  const callPhone    = settings.callPhone.replace(/\D/g, '');
  const viberIntl    = '%2B84' + settings.viberPhone.replace(/\D/g, '').replace(/^0/, '');
  const waPhone      = '84' + settings.whatsappPhone.replace(/\D/g, '').replace(/^0/, '');

  const SIZE = Math.min(settings.size, 210);
  const R = 14;
  const STROKE = 3;
  const PERIM = 2 * (SIZE - 2 * STROKE - 2 * R) * 2 + 2 * Math.PI * R;
  const DASH_A = 48;
  const GAP_A  = (PERIM - DASH_A).toFixed(1);
  const DASH_B = 18;
  const GAP_B  = (PERIM - DASH_B).toFixed(1);

  // Build button animation style
  const btnEffectStyle: React.CSSProperties = (() => {
    if (open) return {};
    switch (settings.btnEffect) {
      case 'pulse':   return { animation: 'zqr-pulse 2.5s ease-in-out infinite' };
      case 'bounce':  return { animation: 'zqr-bounce 2s ease-in-out infinite' };
      case 'shake':   return { animation: 'zqr-shake 2.5s ease-in-out infinite' };
      case 'glow':    return { animation: 'zqr-glow 2s ease-in-out infinite' };
      default:        return {};
    }
  })();

  return (
    <>
      <style>{`
        @keyframes qr-cw  { from{stroke-dashoffset:0} to{stroke-dashoffset:-${PERIM.toFixed(1)}} }
        @keyframes qr-ccw { from{stroke-dashoffset:0} to{stroke-dashoffset:${PERIM.toFixed(1)}} }
        @keyframes qr-pop {
          0%  {opacity:0;transform:translateY(14px) scale(0.93)}
          60% {opacity:1;transform:translateY(-3px) scale(1.01)}
          100%{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes qr-shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .zqr-icon { position:absolute; inset:0; transition: opacity 0.35s ease, transform 0.35s ease; }
        .zqr-icon-on  { opacity:1; transform:scale(1); }
        .zqr-icon-off { opacity:0; transform:scale(0.6); pointer-events:none; }
        @keyframes qr-rainbow { 0%{stroke:#F2E05A} 25%{stroke:#25D366} 50%{stroke:#0068FF} 75%{stroke:#ef4444} 100%{stroke:#F2E05A} }
        @keyframes qr-pborder  { 0%,100%{opacity:0.3;stroke-width:2} 50%{opacity:1;stroke-width:4} }
        @keyframes zqr-pulse  {
          0%,100%{box-shadow:0 0 0 0 ${settings.btnShadow.replace('0.35', '0.55')}}
          50%    {box-shadow:0 0 0 8px rgba(212,175,55,0)}
        }
        @keyframes zqr-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes zqr-shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)} }
        @keyframes zqr-glow   { 0%,100%{filter:brightness(1) drop-shadow(0 0 0px transparent)} 50%{filter:brightness(1.25) drop-shadow(0 0 8px rgba(212,175,55,0.7))} }
        @keyframes qr-neon    {
          0%,100%{filter:drop-shadow(0 0 3px rgba(0,220,255,0.8)) drop-shadow(0 0 8px rgba(0,180,255,0.5));opacity:0.75}
          50%    {filter:drop-shadow(0 0 7px rgba(0,255,255,1)) drop-shadow(0 0 18px rgba(0,220,255,0.9)) drop-shadow(0 0 28px rgba(0,180,255,0.4));opacity:1}
        }
        @keyframes call-ripple {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.7), 0 0 0 0 rgba(239,68,68,0.4), 0 3px 10px rgba(185,28,28,0.5); }
          50%  { box-shadow: 0 0 0 7px rgba(239,68,68,0.15), 0 0 0 14px rgba(239,68,68,0), 0 3px 10px rgba(185,28,28,0.5); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0), 0 0 0 0 rgba(239,68,68,0), 0 3px 10px rgba(185,28,28,0.5); }
        }
        @keyframes call-ring {
          0%,100% { transform: rotate(0deg); }
          10%     { transform: rotate(-15deg); }
          20%     { transform: rotate(15deg); }
          30%     { transform: rotate(-10deg); }
          40%     { transform: rotate(10deg); }
          50%     { transform: rotate(0deg); }
        }
      `}</style>

      <div className="fixed bottom-[88px] md:bottom-6 left-4 z-50 flex flex-col items-start gap-3">

        {/* QR Panel */}
        {open && (
          <div style={{ animation: 'qr-pop 0.38s cubic-bezier(0.34,1.25,0.64,1) forwards' }}>
            <div style={{
              width: SIZE + 20,
              borderRadius: 22,
              background: 'linear-gradient(160deg, #fffdf7 0%, #fef8e7 50%, #fffbf0 100%)',
              boxShadow: '0 10px 28px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
              border: '1px solid rgba(212,175,55,0.25)',
              padding: '10px 10px 9px',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* shimmer line */}
              <div style={{ position:'absolute',top:0,left:'20%',right:'20%',height:1,background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.6),transparent)' }} />

              {/* Header */}
              <div className="flex items-center justify-between mb-2.5 px-0.5">
                <div>
                  <p style={{ fontSize:10,fontWeight:800,letterSpacing:'0.14em',color:'#B8860B',textTransform:'uppercase',lineHeight:1 }}>{settings.headerLabel}</p>
                  <p style={{ fontSize:8,color:'#aaa',marginTop:2,letterSpacing:'0.05em' }}>{settings.headerSub}</p>
                </div>
                <div style={{ width:8,height:8,borderRadius:'50%',background:'#0068FF',boxShadow:'0 0 6px rgba(0,104,255,0.6)',animation:'qr-shimmer 2s ease-in-out infinite' }} />
              </div>

              {/* QR image + animated border */}
              <div style={{ position:'relative',width:SIZE,height:SIZE }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={settings.img} alt="QR Chat Zalo KAHA" width={SIZE} height={SIZE}
                  style={{ display:'block',width:SIZE,height:SIZE,borderRadius:10 }} />

                {settings.borderEffect !== 'none' && (
                  <svg style={{ position:'absolute',inset:0,pointerEvents:'none' }} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none">
                    {/* defs FIRST — iOS Safari requires defs before any url() reference */}
                    <defs>
                      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stopColor="#F2E05A"/>
                        <stop offset="40%"  stopColor="#D4AF37"/>
                        <stop offset="100%" stopColor="#C9822A"/>
                      </linearGradient>
                      <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#FFD700"/>
                        <stop offset="40%"  stopColor="#FF6B00"/>
                        <stop offset="100%" stopColor="#FF1500"/>
                      </linearGradient>
                    </defs>
                    {/* dim track */}
                    <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                      stroke="rgba(212,175,55,0.18)" strokeWidth={STROKE} />

                    {settings.borderEffect === 'goldDash' && <>
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="url(#goldGrad)" strokeWidth={STROKE+0.5} strokeLinecap="round"
                        strokeDasharray={`${DASH_A} ${GAP_A}`}
                        style={{ filter:'drop-shadow(0 0 4px rgba(212,175,55,0.8))' }}>
                        <animate attributeName="stroke-dashoffset" from="0" to={`${-PERIM.toFixed(1)}`} dur="3s" repeatCount="indefinite" />
                      </rect>
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="rgba(255,255,255,0.75)" strokeWidth={STROKE-0.5} strokeLinecap="round"
                        strokeDasharray={`${DASH_B} ${GAP_B}`}
                        style={{ filter:'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }}>
                        <animate attributeName="stroke-dashoffset" from="0" to={`${PERIM.toFixed(1)}`} dur="4.5s" repeatCount="indefinite" />
                      </rect>
                    </>}

                    {settings.borderEffect === 'rainbow' && (
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="#F2E05A" strokeWidth={STROKE+1} strokeLinecap="round"
                        strokeDasharray={`${DASH_A} ${GAP_A}`}
                        style={{ filter:'drop-shadow(0 0 4px rgba(242,224,90,0.8))', animation:'qr-rainbow 4s linear infinite' }}>
                        <animate attributeName="stroke-dashoffset" from="0" to={`${-PERIM.toFixed(1)}`} dur="3s" repeatCount="indefinite" />
                      </rect>
                    )}

                    {settings.borderEffect === 'spin' && (
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="url(#goldGrad)" strokeWidth={STROKE+1} strokeLinecap="round"
                        strokeDasharray={`${(PERIM*0.25).toFixed(1)} ${(PERIM*0.75).toFixed(1)}`}
                        style={{ filter:'drop-shadow(0 0 5px rgba(212,175,55,0.9))' }}>
                        <animate attributeName="stroke-dashoffset" from="0" to={`${-PERIM.toFixed(1)}`} dur="1.8s" repeatCount="indefinite" />
                      </rect>
                    )}

                    {settings.borderEffect === 'pulseBorder' && (
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="rgba(212,175,55,0.8)" strokeWidth={STROKE} strokeLinecap="round"
                        style={{ animation:'qr-pborder 2s ease-in-out infinite' }} />
                    )}

                    {settings.borderEffect === 'neon' && <>
                      {/* Dim track */}
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="rgba(0,220,255,0.12)" strokeWidth={STROKE+1} />
                      {/* Outer glow layer */}
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="rgba(0,200,255,0.35)" strokeWidth={STROKE+3}
                        style={{ animation:'qr-neon 2.5s ease-in-out infinite', filter:'blur(2px)' }} />
                      {/* Core bright line */}
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="rgba(0,240,255,0.95)" strokeWidth={1.5}
                        style={{ animation:'qr-neon 2.5s ease-in-out infinite' }} />
                    </>}

                    {settings.borderEffect === 'fire' && <>
                      {/* Dim track */}
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="rgba(255,80,0,0.1)" strokeWidth={STROKE} />
                      {/* Fire glow halo */}
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="rgba(255,60,0,0.4)" strokeWidth={STROKE+4} strokeLinecap="round"
                        strokeDasharray={`${(PERIM*0.14).toFixed(1)} ${(PERIM*0.86).toFixed(1)}`}
                        style={{ filter:'blur(3px)' }}>
                        <animate attributeName="stroke-dashoffset" from="0" to={`${-PERIM.toFixed(1)}`} dur="1.3s" repeatCount="indefinite" />
                      </rect>
                      {/* Fire core */}
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="url(#fireGrad)" strokeWidth={STROKE+1} strokeLinecap="round"
                        strokeDasharray={`${(PERIM*0.12).toFixed(1)} ${(PERIM*0.88).toFixed(1)}`}
                        style={{ filter:'drop-shadow(0 0 5px rgba(255,100,0,1)) drop-shadow(0 0 10px rgba(255,40,0,0.7))' }}>
                        <animate attributeName="stroke-dashoffset" from="0" to={`${-PERIM.toFixed(1)}`} dur="1.3s" repeatCount="indefinite" />
                      </rect>
                    </>}

                    {settings.borderEffect === 'snake' && <>
                      {/* Dim track */}
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="rgba(212,175,55,0.12)" strokeWidth={STROKE} />
                      {/* Snake body — RAF-driven offset, no filter (filter + overflow:hidden = broken on iOS) */}
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="url(#goldGrad)" strokeWidth={STROKE+1} strokeLinecap="round"
                        strokeDasharray={`${(PERIM*0.22).toFixed(1)} ${(PERIM*0.78).toFixed(1)}`}
                        strokeDashoffset={snakeOffset} />
                      {/* Snake head — bright white tip */}
                      <rect x={STROKE} y={STROKE} width={SIZE-STROKE*2} height={SIZE-STROKE*2} rx={R}
                        stroke="rgba(255,255,220,0.95)" strokeWidth={STROKE+1} strokeLinecap="round"
                        strokeDasharray={`${(PERIM*0.04).toFixed(1)} ${(PERIM*0.96).toFixed(1)}`}
                        strokeDashoffset={snakeOffset - PERIM*0.18} />
                    </>}

                  </svg>
                )}
              </div>

              {/* 6 action buttons — 2×3 grid, horizontal layout */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, marginTop:8 }}>
                {([
                  {
                    label: 'Gọi điện', sub: callPhone.replace(/^84/, '0'),
                    href: `tel:+84${callPhone.replace(/^0/, '')}`, target: '_self',
                    bg: 'linear-gradient(135deg,#991b1b,#ef4444)', shadow: 'rgba(239,68,68,0.5)',
                    extraStyle: { animation: 'call-ripple 1.8s ease-out infinite' },
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ animation: 'call-ring 3s ease-in-out infinite', transformOrigin: 'center' }}>
                        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.56 21 3 13.44 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.58.11.35.03.74-.23 1.01L6.6 10.8z"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Nhắn Zalo', sub: 'zalo.me',
                    href: `https://zalo.me/${zaloPhone}`, target: '_blank',
                    bg: 'linear-gradient(135deg,#0055d4,#0068FF)', shadow: 'rgba(0,104,255,0.4)',
                    icon: (
                      <svg width="22" height="8" viewBox="0 0 25 9" fill="white">
                        <path d="M12.6808693,2.52045104 L12.6808693,2.06398482 L14.048117,2.06398482 L14.048117,8.48239004 L13.2659151,8.48239004 C12.9439124,8.48239004 12.6825323,8.22236344 12.6808772,7.90080374 C12.6806605,7.90096172 12.6804438,7.90111968 12.6802271,7.90127761 C12.129539,8.30399226 11.448805,8.54305395 10.7134839,8.54305395 C8.87197018,8.54305395 7.37885092,7.05092395 7.37885092,5.21063028 C7.37885092,3.37033661 8.87197018,1.87820661 10.7134839,1.87820661 C11.448805,1.87820661 12.129539,2.1172683 12.6802271,2.51998295 C12.6804412,2.52013896 12.6806552,2.520295 12.6808693,2.52045106 Z M7.02456422,0 L7.02456422,0.20809598 C7.02456422,0.596210225 6.97270642,0.913087295 6.72048165,1.28483624 L6.68997706,1.31965261 C6.63490826,1.38206536 6.50566514,1.52871125 6.44417431,1.60829152 L2.05488532,7.11746011 L7.02456422,7.11746011 L7.02456422,7.89737882 C7.02456422,8.22051321 6.76238532,8.48235796 6.4390367,8.48235796 L0,8.48235796 L0,8.11462011 C0,7.66425356 0.11190367,7.46337756 0.253348624,7.25399803 L4.93243119,1.46244785 L0.195068807,1.46244785 L0.195068807,0 L7.02456422,0 Z M15.7064427,8.48239004 C15.4375206,8.48239004 15.2188509,8.2638652 15.2188509,7.9952818 L15.2188509,3.20888173e-05 L16.6824289,3.20888173e-05 L16.6824289,8.48239004 L15.7064427,8.48239004 Z M21.0096009,1.83801536 C22.8639587,1.83801536 24.366711,3.34137645 24.366711,5.19290121 C24.366711,7.04603041 22.8639587,8.54939149 21.0096009,8.54939149 C19.1552431,8.54939149 17.6524908,7.04603041 17.6524908,5.19290121 C17.6524908,3.34137645 19.1552431,1.83801536 21.0096009,1.83801536 Z M10.7134839,7.17125701 C11.7971995,7.17125701 12.6754106,6.29362786 12.6754106,5.21063028 C12.6754106,4.12923714 11.7971995,3.25160799 10.7134839,3.25160799 C9.62976835,3.25160799 8.75155734,4.12923714 8.75155734,5.21063028 C8.75155734,6.29362786 9.62976835,7.17125701 10.7134839,7.17125701 Z M21.0096009,7.16796791 C22.0997385,7.16796791 22.9843716,6.283921 22.9843716,5.19290121 C22.9843716,4.10348586 22.0997385,3.21959939 21.0096009,3.21959939 C19.9178578,3.21959939 19.0348303,4.10348586 19.0348303,5.19290121 C19.0348303,6.283921 19.9178578,7.16796791 21.0096009,7.16796791 Z"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Gọi Viber', sub: 'miễn phí',
                    href: `viber://call?number=${viberIntl}`, target: '_self',
                    bg: 'linear-gradient(135deg,#5B4DD4,#7360F2)', shadow: 'rgba(115,96,242,0.4)',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M11.4 1C6.64 1.05 2.27 4.9 2.01 9.65c-.14 2.55.64 4.94 2.07 6.8L2.05 22l5.81-1.94c1.54.8 3.27 1.23 5.1 1.2 5.23-.1 9.44-4.38 9.44-9.63C22.4 6.02 17.42.96 11.4 1zm5.26 13.26c-.26.69-1.52 1.35-2.07 1.39-.53.04-1.04.23-3.5-.73-2.96-1.16-4.86-4.17-5.01-4.36-.14-.19-1.19-1.58-1.19-3.02S5.61 5.6 6.07 5.1c.45-.5.98-.63 1.31-.64.33 0 .65 0 .93.01.3.01.7-.11 1.09.84.4.97 1.36 3.35 1.48 3.59.12.24.2.52.04.84-.16.32-.24.52-.48.8-.24.28-.5.62-.72.83-.24.23-.49.48-.21.94.28.46 1.24 2.05 2.67 3.32 1.83 1.63 3.38 2.14 3.86 2.38.47.24.75.2 1.03-.12.28-.32 1.19-1.39 1.51-1.87.32-.47.64-.39 1.08-.24.44.16 2.79 1.32 3.27 1.56.47.24.79.36.91.56.11.2.11 1.14-.15 1.83z"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Nhắn FB', sub: 'Messenger',
                    href: settings.facebookUrl, target: '_blank',
                    bg: 'linear-gradient(135deg,#0057E0,#0084FF)', shadow: 'rgba(0,132,255,0.4)',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1.007 12.463l-2.55-2.719-4.97 2.719 5.467-5.79 2.612 2.719 4.907-2.719-5.466 5.79z"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'WhatsApp', sub: 'Nhắn tin',
                    href: `https://wa.me/${waPhone}`, target: '_blank',
                    bg: 'linear-gradient(135deg,#128C7E,#25D366)', shadow: 'rgba(37,211,102,0.4)',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M12.004 2a9.997 9.997 0 00-8.329 15.528L2 22l4.588-1.471A9.971 9.971 0 0012.004 22C17.527 22 22 17.523 22 12S17.527 2 12.004 2zm0 18a7.995 7.995 0 01-4.33-1.27l-.31-.189-3.206.84.853-3.118-.202-.319A7.995 7.995 0 014 12c0-4.41 3.594-8 8.004-8C16.41 4 20 7.59 20 12s-3.59 8-7.996 8zm4.386-5.618c-.22-.11-1.321-.65-1.526-.725-.205-.075-.354-.112-.503.112-.149.224-.577.724-.707.873-.13.15-.26.168-.48.056-.22-.112-.93-.344-1.771-1.095-.654-.585-1.096-1.308-1.225-1.528-.129-.22-.014-.339.097-.448.1-.099.22-.26.33-.39.11-.13.147-.224.22-.373.074-.15.037-.281-.018-.39-.056-.112-.503-1.213-.69-1.661-.181-.436-.366-.377-.503-.384h-.43c-.148 0-.39.056-.595.28-.205.224-.782.765-.782 1.865s.801 2.164.913 2.314c.112.149 1.578 2.41 3.824 3.38.534.23.951.368 1.276.472.536.17 1.024.146 1.41.089.43-.064 1.321-.54 1.508-1.06.187-.52.187-.967.13-1.06-.055-.094-.204-.15-.43-.262z"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'WeChat', sub: 'Mở app',
                    href: 'weixin://', target: '_self',
                    bg: 'linear-gradient(135deg,#07A859,#1AAD19)', shadow: 'rgba(26,173,25,0.4)',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M9.5 3C5.91 3 3 5.69 3 9c0 1.89.97 3.56 2.5 4.68V16l2.5-1.27c.63.17 1.3.27 2 .27.16 0 .32-.01.47-.02A5.98 5.98 0 009.5 13c0-3.31 2.91-6 6.5-6 .1 0 .19 0 .28.01C15.4 4.62 12.62 3 9.5 3zM8 6.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 3.5c-2.76 0-5 2.01-5 4.5S13.24 19 16 19c.69 0 1.36-.14 1.96-.38L21 20v-2.31A4.49 4.49 0 0021 14.5C21 12.01 18.76 10 16 10zm-1.5 3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                      </svg>
                    ),
                  },
                ] as { label: string; sub: string; href: string; target: string; bg: string; shadow: string; extraStyle?: React.CSSProperties; icon: React.ReactNode }[]).map(({ label, sub, href, target, bg, shadow, extraStyle, icon }) => (
                  <a key={label} href={href} target={target} rel="noopener noreferrer"
                    style={{
                      borderRadius: 9,
                      background: bg,
                      boxShadow: `0 2px 8px ${shadow}`,
                      padding: '6px 8px',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      touchAction: 'manipulation',
                      transition: 'filter 0.15s ease',
                      ...extraStyle,
                    }}
                    className="hover:brightness-110 active:scale-95"
                  >
                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: 'white', letterSpacing: '0.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>{label}</span>
                      <span style={{ fontSize: 7.5, fontWeight: 400, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.03em', lineHeight: 1, whiteSpace: 'nowrap' }}>{sub}</span>
                    </div>
                  </a>
                ))}
              </div>

              {/* WeChat QR — chỉ hiện nếu có ảnh upload */}
              {settings.wechatImg && (
                <div style={{ marginTop:8, paddingTop:8, borderTop:'1px solid rgba(26,173,25,0.2)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:7 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#1AAD19">
                      <path d="M9.5 3C5.91 3 3 5.69 3 9c0 1.89.97 3.56 2.5 4.68V16l2.5-1.27c.63.17 1.3.27 2 .27.16 0 .32-.01.47-.02A5.98 5.98 0 009.5 13c0-3.31 2.91-6 6.5-6 .1 0 .19 0 .28.01C15.4 4.62 12.62 3 9.5 3zM8 6.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 3.5c-2.76 0-5 2.01-5 4.5S13.24 19 16 19c.69 0 1.36-.14 1.96-.38L21 20v-2.31A4.49 4.49 0 0021 14.5C21 12.01 18.76 10 16 10zm-1.5 3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                    </svg>
                    <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.12em', color:'#1AAD19', textTransform:'uppercase', lineHeight:1 }}>WeChat QR</p>
                    <p style={{ fontSize:8, color:'#aaa', letterSpacing:'0.05em' }}>Quét để thêm bạn</p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={settings.wechatImg} alt="QR WeChat KAHA" width={SIZE} height={SIZE}
                    style={{ display:'block', width:SIZE, height:SIZE, borderRadius:8, border:'1.5px solid rgba(26,173,25,0.25)' }} />
                </div>
              )}

              {/* Footer brand */}
              <div style={{ marginTop:8,paddingTop:7,borderTop:'1px solid rgba(212,175,55,0.2)',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
                <div style={{ width:20,height:1.5,background:'linear-gradient(90deg,transparent,#D4AF37)' }} />
                <p style={{ fontSize:9,fontWeight:700,letterSpacing:'0.16em',color:'#C9922A',textTransform:'uppercase' }}>KAHA®</p>
                <div style={{ width:20,height:1.5,background:'linear-gradient(90deg,#D4AF37,transparent)' }} />
              </div>
            </div>
          </div>
        )}

        {/* Trigger button */}
        <div style={{ position:'relative' }}>
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="QR Chat Zalo"
            style={{
              width:46, height:46, borderRadius:13,
              background: open
                ? 'linear-gradient(145deg,#0a2e18,#1a6b3c)'
                : `linear-gradient(160deg,${settings.btnColor1},${settings.btnColor2})`,
              border: open ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.3)',
              boxShadow: open
                ? 'inset 0 1.5px 0 rgba(255,255,255,0.18), 0 6px 22px rgba(16,78,46,0.5)'
                : `inset 0 1.5px 0 rgba(255,255,255,0.45), 0 6px 22px ${settings.btnShadow}, 0 2px 6px rgba(0,0,0,0.12)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.28s cubic-bezier(0.34,1.3,0.64,1)',
              touchAction:'manipulation',
              ...(open ? {} : btnEffectStyle),
            }}
            className="hover:scale-105 active:scale-95 transition-transform duration-150"
          >
            {open ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              /* 3 icons cycling: headset → chat bubble → phone+chat */
              <div style={{ position:'relative', width:22, height:22 }}>

                {/* Icon 0 — Headset */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  className={`zqr-icon ${iconIdx === 0 ? 'zqr-icon-on' : 'zqr-icon-off'}`}>
                  <path d="M3 18v-6a9 9 0 0118 0v6"/>
                  <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/>
                  <path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
                </svg>

                {/* Icon 1 — Chat bubble + 3 dots */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  className={`zqr-icon ${iconIdx === 1 ? 'zqr-icon-on' : 'zqr-icon-off'}`}>
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  <circle cx="9" cy="10" r="1.1" fill="white" stroke="none"/>
                  <circle cx="12" cy="10" r="1.1" fill="white" stroke="none"/>
                  <circle cx="15" cy="10" r="1.1" fill="white" stroke="none"/>
                </svg>

                {/* Icon 2 — Phone + chat bubble */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                  className={`zqr-icon ${iconIdx === 2 ? 'zqr-icon-on' : 'zqr-icon-off'}`}>
                  <path d="M5.5 4.5h3.2l1.6 4-2 1.2a9 9 0 004 4l1.2-2 4 1.6v3.2a1.5 1.5 0 01-1.5 1.5A14.5 14.5 0 014 4a1.5 1.5 0 011.5-1.5z"/>
                  <rect x="14.5" y="1" width="8" height="6" rx="1.5" strokeWidth="1.5"/>
                  <circle cx="17" cy="4" r="0.85" fill="white" stroke="none"/>
                  <circle cx="19" cy="4" r="0.85" fill="white" stroke="none"/>
                  <circle cx="21" cy="4" r="0.85" fill="white" stroke="none"/>
                </svg>

              </div>
            )}
          </button>
          {/* Hidden by request: no text label below button */}
        </div>
      </div>
    </>
  );
}
