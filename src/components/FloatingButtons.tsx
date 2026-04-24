'use client';

import { useState, useEffect } from 'react';
import { trackPhoneClick, trackZaloClick, trackContactClick } from '@/lib/analytics';

export interface FloatBtnSettings {
  enabled: boolean;
  label: string;
  labelColor: string;
  labelWeight: string;
  btnColor1: string;
  btnColor2: string;
  btnEffect: 'none' | 'pulse' | 'bounce' | 'shake' | 'glow';
  zaloUrl: string;
  zaloLabel: string;
  whatsappUrl: string;
  whatsappLabel: string;
  viberUrl: string;
  viberLabel: string;
  messengerUrl: string;
  messengerLabel: string;
  phone: string;
  phoneLabel: string;
  phoneEffect: 'ripple' | 'none' | 'pulse';
}

function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function getZaloHref(url: string): string {
  if (typeof window === 'undefined') return url;
  if (isMobileDevice()) {
    const phoneMatch = url.match(/zalo\.me\/(\d+)/);
    if (phoneMatch) return `zalo://call?phone=84${phoneMatch[1].replace(/^0/, '')}`;
  }
  const isProduct = window.location.pathname.startsWith('/p/');
  if (isProduct && !isMobileDevice()) {
    const name = document.title.split('|')[0].split('-')[0].trim();
    const pageUrl = window.location.href;
    const msg = `Xin chào, tôi quan tâm đến sản phẩm: ${name}\n${pageUrl}`;
    const base = url.split('?')[0];
    return `${base}?text=${encodeURIComponent(msg)}`;
  }
  return url;
}

export default function FloatingButtons({ settings }: { settings: FloatBtnSettings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!settings.enabled) return null;

  const btnGrad = `linear-gradient(145deg,${settings.btnColor1} 0%,${settings.btnColor2} 100%)`;

  const btnEffectStyle: React.CSSProperties = (() => {
    if (open) return {};
    switch (settings.btnEffect) {
      case 'pulse':  return { animation: 'fb-pulse 2.5s ease-in-out infinite' };
      case 'bounce': return { animation: 'fb-bounce 2s ease-in-out infinite' };
      case 'shake':  return { animation: 'fb-shake 2.5s ease-in-out infinite' };
      case 'glow':   return { animation: 'fb-glow 2s ease-in-out infinite' };
      default:       return {};
    }
  })();

  const ACTIONS = [
    { id: 'zalo',      label: settings.zaloLabel,      href: getZaloHref(settings.zaloUrl), color: '#0068FF', shadow: 'rgba(0,104,255,0.5)',
      icon: <svg width="28" height="10" viewBox="0 0 25 9" fill="white"><path d="M12.6808693,2.52045104 L12.6808693,2.06398482 L14.048117,2.06398482 L14.048117,8.48239004 L13.2659151,8.48239004 C12.9439124,8.48239004 12.6825323,8.22236344 12.6808772,7.90080374 C12.6806605,7.90096172 12.6804438,7.90111968 12.6802271,7.90127761 C12.129539,8.30399226 11.448805,8.54305395 10.7134839,8.54305395 C8.87197018,8.54305395 7.37885092,7.05092395 7.37885092,5.21063028 C7.37885092,3.37033661 8.87197018,1.87820661 10.7134839,1.87820661 C11.448805,1.87820661 12.129539,2.1172683 12.6802271,2.51998295 C12.6804412,2.52013896 12.6806552,2.520295 12.6808693,2.52045106 Z M7.02456422,0 L7.02456422,0.20809598 C7.02456422,0.596210225 6.97270642,0.913087295 6.72048165,1.28483624 L6.68997706,1.31965261 C6.63490826,1.38206536 6.50566514,1.52871125 6.44417431,1.60829152 L2.05488532,7.11746011 L7.02456422,7.11746011 L7.02456422,7.89737882 C7.02456422,8.22051321 6.76238532,8.48235796 6.4390367,8.48235796 L0,8.48235796 L0,8.11462011 C0,7.66425356 0.11190367,7.46337756 0.253348624,7.25399803 L4.93243119,1.46244785 L0.195068807,1.46244785 L0.195068807,0 L7.02456422,0 Z M15.7064427,8.48239004 C15.4375206,8.48239004 15.2188509,8.2638652 15.2188509,7.9952818 L15.2188509,3.20888173e-05 L16.6824289,3.20888173e-05 L16.6824289,8.48239004 L15.7064427,8.48239004 Z M21.0096009,1.83801536 C22.8639587,1.83801536 24.366711,3.34137645 24.366711,5.19290121 C24.366711,7.04603041 22.8639587,8.54939149 21.0096009,8.54939149 C19.1552431,8.54939149 17.6524908,7.04603041 17.6524908,5.19290121 C17.6524908,3.34137645 19.1552431,1.83801536 21.0096009,1.83801536 Z M10.7134839,7.17125701 C11.7971995,7.17125701 12.6754106,6.29362786 12.6754106,5.21063028 C12.6754106,4.12923714 11.7971995,3.25160799 10.7134839,3.25160799 C9.62976835,3.25160799 8.75155734,4.12923714 8.75155734,5.21063028 C8.75155734,6.29362786 9.62976835,7.17125701 10.7134839,7.17125701 Z M21.0096009,7.16796791 C22.0997385,7.16796791 22.9843716,6.283921 22.9843716,5.19290121 C22.9843716,4.10348586 22.0997385,3.21959939 21.0096009,3.21959939 C19.9178578,3.21959939 19.0348303,4.10348586 19.0348303,5.19290121 C19.0348303,6.283921 19.9178578,7.16796791 21.0096009,7.16796791 Z"/></svg>
    },
    { id: 'whatsapp', label: settings.whatsappLabel, href: settings.whatsappUrl, color: '#25D366', shadow: 'rgba(37,211,102,0.5)',
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    },
    { id: 'viber',    label: settings.viberLabel,    href: settings.viberUrl,    color: '#7360F2', shadow: 'rgba(115,96,242,0.5)',
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M11.4 2C6.63 2 2.9 5.74 2.9 10.5c0 2.77 1.34 5.24 3.43 6.83L6 21l3.8-1.36c.5.15 1.04.23 1.6.23 4.77 0 8.5-3.74 8.5-8.5S16.17 2 11.4 2zm3.28 11.58c-.18.5-.83.93-1.38 1.05-.37.08-.84.14-2.45-.53-2.06-.84-3.38-2.93-3.49-3.07-.1-.13-.83-1.1-.83-2.1 0-1 .53-1.5.72-1.7.18-.2.4-.25.53-.25h.38c.15 0 .35.06.54.5.2.45.67 1.64.73 1.76.06.11.1.25.02.4-.08.15-.12.25-.23.38-.1.13-.22.3-.32.4-.1.12-.22.25-.09.5.13.24.57.95 1.22 1.54.84.75 1.56.98 1.78 1.09.22.1.34.09.47-.05.13-.14.54-.63.68-.85.14-.22.28-.18.47-.11.19.07 1.2.57 1.41.67.2.1.34.15.39.23.05.1.05.55-.13 1.05z"/></svg>
    },
    { id: 'messenger',label: settings.messengerLabel,href: settings.messengerUrl,color: '#0084FF', shadow: 'rgba(0,132,255,0.5)',
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.955 1.44 5.59 3.7 7.329V22l3.37-1.85A10.27 10.27 0 0012 20.486c5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm.99 12.44l-2.55-2.72-4.97 2.72 5.47-5.81 2.61 2.72 4.91-2.72-5.47 5.81z"/></svg>
    },
  ];

  return (
    <>
      <style>{`
        @keyframes fb-callRipple { 0%{transform:scale(1);opacity:0.55} 100%{transform:scale(2.2);opacity:0} }
        @keyframes fb-pulse  { 0%,100%{box-shadow:0 6px 28px rgba(16,78,46,0.55)} 50%{box-shadow:0 6px 28px rgba(16,78,46,0.55),0 0 0 8px rgba(16,78,46,0)} }
        @keyframes fb-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes fb-shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)} }
        @keyframes fb-glow   { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.3)} }
      `}</style>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      <div className="fixed bottom-[165px] md:bottom-[89px] right-5 z-50 flex flex-col items-end gap-3">

        {/* Action buttons */}
        <div className="flex flex-col items-end gap-2" style={{ pointerEvents: open ? 'auto' : 'none' }}>
          {ACTIONS.map((action, i) => (
            <a key={action.id} href={action.href}
              target={action.href.startsWith('viber') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={action.label}
              style={{
                display:'flex',alignItems:'center',gap:10,
                background:'rgba(255,255,255,0.94)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
                border:'1px solid rgba(255,255,255,0.7)',
                boxShadow:'0 4px 24px rgba(0,0,0,0.13),0 1px 4px rgba(0,0,0,0.07)',
                borderRadius:99,padding:'7px 14px 7px 7px',textDecoration:'none',touchAction:'manipulation',
                opacity: open ? 1 : 0,
                transform: open ? 'translateX(0) scale(1)' : 'translateX(16px) scale(0.85)',
                pointerEvents: open ? 'auto' : 'none',
                transitionDelay: open ? `${i*45}ms` : `${(ACTIONS.length-1-i)*28}ms`,
                transition:'opacity 0.25s ease,transform 0.32s cubic-bezier(0.34,1.5,0.64,1),box-shadow 0.18s ease',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow=`0 6px 28px ${action.shadow},0 2px 8px rgba(0,0,0,0.1)`;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='0 4px 24px rgba(0,0,0,0.13),0 1px 4px rgba(0,0,0,0.07)';}}
              onClick={() => {
                if (action.id === 'zalo') trackZaloClick({ page: 'float_button' });
                else trackContactClick({ method: action.id, page: 'float_button' });
              }}
            >
              <span style={{ width:32,height:32,borderRadius:'50%',flexShrink:0,background:action.color,boxShadow:`0 3px 10px ${action.shadow}`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                {action.icon}
              </span>
              <span style={{ fontSize:13,fontWeight:700,color:'#1a1a1a',letterSpacing:'0.01em',lineHeight:1 }}>{action.label}</span>
            </a>
          ))}

          {/* Call button */}
          <div style={{
            position:'relative',
            opacity: open ? 1 : 0,
            transform: open ? 'translateX(0) scale(1)' : 'translateX(16px) scale(0.85)',
            pointerEvents: open ? 'auto' : 'none',
            transitionDelay: open ? `${ACTIONS.length*45}ms` : '0ms',
            transition:'opacity 0.25s ease,transform 0.32s cubic-bezier(0.34,1.5,0.64,1)',
          }}>
            {settings.phoneEffect === 'ripple' && [0, 0.75, 1.5].map(delay => (
              <span key={delay} style={{
                position:'absolute',right:7,top:'50%',width:32,height:32,marginTop:-16,
                borderRadius:'50%',background:'#ef4444',
                animation:`fb-callRipple 2.2s ${delay}s ease-out infinite`,zIndex:0,pointerEvents:'none',
              }} />
            ))}
            <a href={`tel:${settings.phone}`} aria-label="Gọi điện" onClick={() => trackPhoneClick({ phone: settings.phone, page: 'float_button' })}
              style={{
                position:'relative',zIndex:1,
                display:'flex',alignItems:'center',gap:10,
                background:'rgba(255,255,255,0.94)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
                border:'1px solid rgba(255,255,255,0.7)',
                boxShadow:'0 4px 24px rgba(0,0,0,0.13),0 1px 4px rgba(0,0,0,0.07)',
                borderRadius:99,padding:'7px 14px 7px 7px',textDecoration:'none',touchAction:'manipulation',
                ...(settings.phoneEffect === 'pulse' ? { animation:'fb-pulse 2.2s ease-out infinite' } : {}),
              }}
            >
              <span style={{ width:32,height:32,borderRadius:'50%',flexShrink:0,background:'linear-gradient(145deg,#f87171,#dc2626)',boxShadow:'0 3px 10px rgba(239,68,68,0.55)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                </svg>
              </span>
              <span style={{ fontSize:13,fontWeight:700,color:'#dc2626',letterSpacing:'0.01em',lineHeight:1 }}>{settings.phoneLabel}</span>
            </a>
          </div>

          {/* Back to top */}
          {scrolled && (
            <button onClick={() => { window.scrollTo({top:0,behavior:'smooth'}); setOpen(false); }}
              aria-label="Về đầu trang"
              style={{
                display:'flex',alignItems:'center',gap:10,
                background:'rgba(255,255,255,0.94)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
                border:'1px solid rgba(255,255,255,0.7)',
                boxShadow:'0 4px 24px rgba(0,0,0,0.13),0 1px 4px rgba(0,0,0,0.07)',
                borderRadius:99,padding:'7px 14px 7px 7px',touchAction:'manipulation',cursor:'pointer',
                opacity: open ? 1 : 0,
                transform: open ? 'translateX(0) scale(1)' : 'translateX(16px) scale(0.85)',
                pointerEvents: open ? 'auto' : 'none',
                transitionDelay: open ? `${(ACTIONS.length+1)*45}ms` : '0ms',
                transition:'opacity 0.25s ease,transform 0.32s cubic-bezier(0.34,1.5,0.64,1)',
              }}
            >
              <span style={{ width:32,height:32,borderRadius:'50%',flexShrink:0,background:'linear-gradient(145deg,#1e8a4a,#104e2e)',boxShadow:'0 3px 10px rgba(16,78,46,0.4)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              </span>
              <span style={{ fontSize:13,fontWeight:700,color:'#1a1a1a',letterSpacing:'0.01em',lineHeight:1 }}>Về đầu trang</span>
            </button>
          )}
        </div>

        {/* FAB trigger */}
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:5 }}>
          {!open && (
            <span style={{
              fontSize:10, fontWeight: parseInt(settings.labelWeight) || 700,
              color: settings.labelColor,
              whiteSpace:'nowrap', letterSpacing:'0.02em',
              textShadow:'0 0 3px rgba(0,0,0,1),0 0 3px rgba(0,0,0,1),0 0 6px rgba(0,0,0,0.9)',
            }}>{settings.label}</span>
          )}
          <button onClick={() => setOpen(o => !o)} aria-label={open ? 'Đóng' : 'Liên hệ'}
            style={{
              background: open ? 'rgba(255,255,255,0.95)' : btnGrad,
              border: open ? '1px solid rgba(0,0,0,0.08)' : '1.5px solid rgba(255,255,255,0.18)',
              boxShadow: open ? '0 4px 16px rgba(0,0,0,0.12)' : `0 6px 28px rgba(16,78,46,0.55),0 2px 8px rgba(0,0,0,0.12)`,
              transition:'all 0.3s cubic-bezier(0.34,1.3,0.64,1)',touchAction:'manipulation',
              ...(!open ? btnEffectStyle : {}),
            }}
            className="relative w-[46px] h-[46px] rounded-full flex items-center justify-center hover:scale-105 active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={open ? '#1a1a1a' : 'white'} strokeWidth="2.2" strokeLinecap="round"
              style={{ position:'absolute',opacity:open?1:0,transform:open?'rotate(0deg) scale(1)':'rotate(-45deg) scale(0.3)',transition:'all 0.28s cubic-bezier(0.34,1.3,0.64,1)' }}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"
              style={{ position:'absolute',opacity:open?0:1,transform:open?'scale(0.3) rotate(45deg)':'scale(1) rotate(0deg)',transition:'all 0.28s cubic-bezier(0.34,1.3,0.64,1)' }}>
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
