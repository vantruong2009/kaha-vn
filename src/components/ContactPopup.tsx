'use client';

import { useState, useEffect, useRef } from 'react';
import { trackContactClick, trackZaloClick } from '@/lib/analytics';

const STORAGE_KEY = 'ldv_popup_ts';
const SUPPRESS_DAYS = 7;
const MAX_FILES = 3;
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB

export interface PopupSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  responseTime: string;
  delayMs: number;
  zaloUrl: string;
  messengerUrl: string;
  whatsappUrl: string;
  email: string;
  mapsUrl: string;
  aiCtaText: string;
}

interface Props { settings: PopupSettings; }


export default function ContactPopup({ settings }: Props) {
  const aiCtaText = settings.aiCtaText || 'Chat với Khánh Hạ ngay';
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!settings.enabled) return;

    const SESSION_KEY = 'ldv_popup_cfg';
    const schedulePopup = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const shouldShow = !stored || Date.now() - parseInt(stored) > SUPPRESS_DAYS * 86_400_000;
      if (shouldShow) {
        const t = setTimeout(() => setOpen(true), settings.delayMs);
        return () => clearTimeout(t);
      }
    };

    const cachedCfg = sessionStorage.getItem(SESSION_KEY);
    if (cachedCfg !== null) {
      if (cachedCfg === 'true') schedulePopup();
      return;
    }

    let cancelled = false;
    fetch('/api/popup-config')
      .then(r => r.json())
      .then(({ enabled }: { enabled: boolean }) => {
        if (cancelled) return;
        sessionStorage.setItem(SESSION_KEY, String(enabled));
        if (enabled) schedulePopup();
      })
      .catch(() => {
        if (!cancelled) schedulePopup();
      });

    return () => { cancelled = true; };
  }, [settings.enabled, settings.delayMs]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }, 260);
  };

  const handleOpenChat = () => {
    handleClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('ldv:open-advisor'));
    }, 320);
  };

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const arr = Array.from(selected);
    if (arr.some(f => f.size > MAX_FILE_BYTES)) {
      setFileError('Mỗi file tối đa 4 MB.');
      return;
    }
    if (arr.length + files.length > MAX_FILES) {
      setFileError(`Tối đa ${MAX_FILES} file.`);
      return;
    }
    setFileError('');
    setFiles(prev => [...prev, ...arr].slice(0, MAX_FILES));
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const fd = new FormData(e.currentTarget);
    files.forEach(f => fd.append('files', f));
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        localStorage.setItem(STORAGE_KEY, (Date.now() + 30 * 86_400_000).toString());
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Không thể kết nối. Kiểm tra mạng và thử lại.');
    }
  };

  if (!settings.enabled || !open) return null;

  return (
    <>
      <style>{`
        @keyframes ldv-cp-in {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ldv-cp-out {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.96) translateY(12px); }
        }
        @keyframes ldv-cp-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.7); }
          50%       { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
        }
        @keyframes ldv-cp-shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(250%); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: closing ? 'rgba(10,20,12,0)' : 'rgba(10,20,12,0.55)',
          backdropFilter: 'blur(4px)',
          transition: 'background 0.26s ease',
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tư vấn KAHA"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 420,
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.12)',
            pointerEvents: 'auto',
            animation: closing
              ? 'ldv-cp-out 0.26s ease forwards'
              : 'ldv-cp-in 0.34s cubic-bezier(0.34,1.15,0.64,1)',
          }}
        >

          {/* ── Header: brand green ── */}
          <div style={{
            background: 'linear-gradient(160deg, #0a3320 0%, #1a6b3c 55%, #104e2e 100%)',
            padding: '20px 20px 18px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Shimmer sweep */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, width: '35%',
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)',
              animation: 'ldv-cp-shimmer 5s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
            {/* Decorative circle */}
            <div style={{
              position: 'absolute', top: -32, right: -32, width: 120, height: 120,
              borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
              pointerEvents: 'none',
            }} />

            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Đóng"
              style={{
                position: 'absolute', top: 14, right: 14,
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Team avatars + info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Overlapping avatars */}
              <div style={{ display: 'flex', flexShrink: 0 }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2.5px solid rgba(255,255,255,0.5)', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                    <img src="/images/advisor-avatar.jpg" alt="Khánh Hạ" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#4ade80', border: '2px solid #0a3320', animation: 'ldv-cp-pulse 2s ease infinite' }} />
                </div>
                <div style={{ position: 'relative', zIndex: 1, marginLeft: -14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2.5px solid rgba(255,255,255,0.5)', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                    <img src="/images/advisor-avatar-tech.jpg" alt="Văn Trường" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#4ade80', border: '2px solid #0a3320', animation: 'ldv-cp-pulse 2s ease 0.6s infinite' }} />
                </div>
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(134,239,172,0.9)', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1, marginBottom: 5 }}>
                  Team tư vấn · Đang trực tuyến
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'white', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                  {settings.title || 'Tư vấn miễn phí'}
                </div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginTop: 3, lineHeight: 1.4 }}>
                  {settings.subtitle || 'Đội ngũ sẵn sàng hỗ trợ bạn'} · phản hồi trong{' '}
                  <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>{settings.responseTime || '15 phút'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ background: '#fffdf7', padding: '16px 18px 18px' }}>

            {status === 'success' ? (
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0f9f4', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Đã nhận thông tin!</p>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>Chúng tôi sẽ liên hệ lại sớm nhất có thể.</p>
                <button
                  onClick={handleClose}
                  style={{ marginTop: 16, padding: '8px 24px', borderRadius: 99, fontSize: 13, fontWeight: 700, color: 'white', background: '#104e2e', border: 'none', cursor: 'pointer' }}
                >
                  Đóng
                </button>
              </div>
            ) : (
              <>
                {/* ── PRIMARY: AI Chat CTA ── */}
                <button
                  onClick={handleOpenChat}
                  style={{
                    width: '100%', padding: '13px 16px',
                    background: 'linear-gradient(135deg, #104e2e, #1a6b3c)',
                    color: 'white', fontSize: 14.5, fontWeight: 800,
                    borderRadius: 13, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 4px 16px rgba(16,78,46,0.35)',
                    position: 'relative', overflow: 'hidden',
                    letterSpacing: '-0.01em', marginBottom: 14,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, bottom: 0, width: '30%',
                    background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',
                    animation: 'ldv-cp-shimmer 2.5s ease-in-out infinite',
                    pointerEvents: 'none',
                  }} />
                  {/* Avatar nhỏ trong nút */}
                  <div style={{ display: 'flex', marginRight: -2 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.5)', flexShrink: 0 }}>
                      <img src="/images/advisor-avatar.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.5)', flexShrink: 0, marginLeft: -6 }}>
                      <img src="/images/advisor-avatar-tech.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                    </div>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {aiCtaText}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>

                {/* Benefits row */}
                <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
                  {[
                    { label: '800+ mẫu' },
                    { label: 'Ship toàn quốc' },
                    { label: 'B2B / sỉ' },
                  ].map((b, i) => (
                    <div key={i} style={{ flex: 1, background: '#f0f7f2', border: '1px solid #c8e6d4', borderRadius: 8, padding: '5px 4px', textAlign: 'center' }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: '#104e2e' }}>{b.label}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1, height: 1, background: '#ede8e0' }} />
                  <span style={{ fontSize: 10.5, color: '#aaa', fontWeight: 500 }}>hoặc liên hệ nhanh qua</span>
                  <div style={{ flex: 1, height: 1, background: '#ede8e0' }} />
                </div>

                {/* ── Quick contact channels ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
                  <a
                    href={settings.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 4px', borderRadius: 12, background: '#edf3ff', border: '1px solid #c5d8ff', textDecoration: 'none' }}
                    onClick={() => trackZaloClick({ page: 'popup' })}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0068ff">
                      <path d="M4 5h16v3L9 16h11v3H4v-3l11-8H4V5z"/>
                    </svg>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#0068ff' }}>Zalo</span>
                  </a>
                  <a
                    href={settings.messengerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 4px', borderRadius: 12, background: '#edf3ff', border: '1px solid #c5d8ff', textDecoration: 'none' }}
                    onClick={() => trackContactClick({ method: 'messenger', page: 'popup' })}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0084ff">
                      <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.955 1.44 5.59 3.7 7.329V22l3.37-1.85a10.27 10.27 0 002.83.384c5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm.99 12.44l-2.55-2.72-4.97 2.72 5.47-5.81 2.61 2.72 4.91-2.72-5.47 5.81z"/>
                    </svg>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#0084ff' }}>Messenger</span>
                  </a>
                  <a
                    href={settings.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 4px', borderRadius: 12, background: '#eaf8f0', border: '1px solid #b3e8cc', textDecoration: 'none' }}
                    onClick={() => trackContactClick({ method: 'whatsapp', page: 'popup' })}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#25d366' }}>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${settings.email}`}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 4px', borderRadius: 12, background: '#fdf5e4', border: '1px solid #f2d88a', textDecoration: 'none' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a0691e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#a0691e' }}>Email</span>
                  </a>
                </div>

                {/* Divider + form */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1, height: 1, background: '#ede8e0' }} />
                  <span style={{ fontSize: 10.5, color: '#aaa', fontWeight: 500 }}>hoặc gửi yêu cầu tư vấn</span>
                  <div style={{ flex: 1, height: 1, background: '#ede8e0' }} />
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input
                      name="name"
                      required
                      placeholder="Họ và tên *"
                      maxLength={100}
                      style={{ padding: '9px 12px', borderRadius: 11, fontSize: 13, outline: 'none', width: '100%', border: '1.5px solid #ede8e0', background: '#fff', color: '#1a1a1a' }}
                      onFocus={e => (e.target.style.borderColor = '#104e2e')}
                      onBlur={e => (e.target.style.borderColor = '#ede8e0')}
                    />
                    <input
                      name="phone"
                      required
                      type="tel"
                      placeholder="Số điện thoại *"
                      maxLength={20}
                      style={{ padding: '9px 12px', borderRadius: 11, fontSize: 13, outline: 'none', width: '100%', border: '1.5px solid #ede8e0', background: '#fff', color: '#1a1a1a' }}
                      onFocus={e => (e.target.style.borderColor = '#104e2e')}
                      onBlur={e => (e.target.style.borderColor = '#ede8e0')}
                    />
                  </div>
                  <textarea
                    name="message"
                    required
                    placeholder="Mẫu đèn / yêu cầu cụ thể *"
                    maxLength={2000}
                    rows={3}
                    style={{ padding: '9px 12px', borderRadius: 11, fontSize: 13, outline: 'none', resize: 'none', width: '100%', border: '1.5px solid #ede8e0', background: '#fff', color: '#1a1a1a' }}
                    onFocus={e => (e.target.style.borderColor = '#104e2e')}
                    onBlur={e => (e.target.style.borderColor = '#ede8e0')}
                  />

                  {/* File upload */}
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      style={{ display: 'none' }}
                      onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 7, padding: '9px 12px', borderRadius: 11, fontSize: 12, fontWeight: 500, border: '1.5px dashed #d4c8b0', background: '#faf7f2', color: '#8b7355', cursor: 'pointer' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                      Đính kèm ảnh / file (tối đa {MAX_FILES} · 4 MB)
                    </button>
                    {fileError && <p style={{ fontSize: 11, marginTop: 4, color: '#e53e3e' }}>{fileError}</p>}
                    {files.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {files.map((f, i) => (
                          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 10px', borderRadius: 99, background: '#f0f7f2', border: '1px solid #c8e6d4', color: '#104e2e' }}>
                            {f.name.length > 20 ? f.name.slice(0, 17) + '…' : f.name}
                            <button type="button" onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', lineHeight: 1 }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <p style={{ fontSize: 12, padding: '8px 12px', borderRadius: 10, background: '#fff0f0', color: '#e53e3e', border: '1px solid #ffc9c9' }}>{errorMsg}</p>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      style={{ flex: 1, padding: '10px', borderRadius: 11, fontSize: 13, fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #104e2e, #1a6b3c)', border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}
                    >
                      {status === 'loading' ? 'Đang gửi…' : 'Gửi yêu cầu tư vấn'}
                    </button>
                    <a
                      href={settings.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 14px', borderRadius: 11, fontSize: 12, fontWeight: 700, color: 'white', background: '#8b5e3c', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Bản đồ
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
