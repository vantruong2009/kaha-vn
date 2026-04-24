'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// ─── Trigger settings interface ───────────────────────────────────────────────

export interface AdvisorTriggerSettings {
  enabled: boolean;
  label: string;
  labelColor: string;
  labelWeight: string;
  btnColor1: string;
  btnColor2: string;
  btnShadow: string;
  btnEffect: 'none' | 'pulse' | 'bounce' | 'shake' | 'glow';
  mapsUrl: string;
  hotline: string;
  callPhone: string;
  subLabel: string;
  zaloPhone: string;
  viberPhone: string;
  facebookUrl: string;
  whatsappPhone: string;
  // AI Chat personas
  chatSalesName: string;
  chatSalesRole: string;
  chatTechName: string;
  chatTechRole: string;
  chatTeamLabel: string;
  chatProactiveDelay: number;
  chatWelcomeTitle: string;
  chatWelcomeSub: string;
  multilangEnabled: boolean;
  multilangMessages: string;
  multilangIntervalMs: number;
  multilangMode: 'fade' | 'slide' | 'none';
}

// ─── Category name lookup (context-aware welcome) ─────────────────────────────

const CAT_NAMES: Record<string, [string, string]> = {
  'hoi-an-lantern': ['đèn lồng Hội An', 'Hoi An lanterns'],
  'den-kieu-nhat':  ['đèn kiểu Nhật', 'Japanese-style lanterns'],
  'den-may-tre':    ['đèn mây tre', 'bamboo & rattan lanterns'],
  'den-vai-cao-cap':['đèn vải cao cấp', 'premium fabric lanterns'],
  'den-long-go':    ['đèn gỗ', 'wooden lanterns'],
  'den-tha-tran':   ['đèn thả trần', 'hanging ceiling lanterns'],
  'den-san':        ['đèn sàn', 'floor lanterns'],
  'den-ap-tuong':   ['đèn áp tường', 'wall lanterns'],
  'den-ve-tranh':   ['đèn vẽ tranh', 'hand-painted lanterns'],
  'den-long-tet':   ['đèn Tết & lễ hội', 'Tet & festival lanterns'],
  'phong-khach':    ['đèn phòng khách', 'living room lanterns'],
  'phong-ngu':      ['đèn phòng ngủ', 'bedroom lanterns'],
  'phong-bep':      ['đèn phòng bếp', 'kitchen lanterns'],
  'den-quan-cafe':  ['đèn quán cafe', 'cafe lanterns'],
  'den-nha-hang':   ['đèn nhà hàng', 'restaurant lanterns'],
  'den-khach-san':  ['đèn khách sạn & resort', 'hotel & resort lanterns'],
  'ngoai-troi':     ['đèn ngoài trời', 'outdoor lanterns'],
  'den-noi-that':   ['đèn nội thất', 'interior lanterns'],
};

// Smart quick-reply chips per category
const CHIPS_BY_CAT: Record<string, [string, string][]> = {
  'hoi-an-lantern': [['Giá đèn Hội An?', 'How much for Hoi An lanterns?'], ['Màu sắc nào?', 'What colours do you have?'], ['Có đèn trơn không?', 'Do you have plain ones?']],
  'den-quan-cafe': [['Giá đèn cafe?', 'How much for cafe lanterns?'], ['Loại nào bền?', 'Which type is most durable?'], ['Giao hỏa tốc không?', 'Can you ship fast?']],
  'den-nha-hang': [['Giá đèn nhà hàng?', 'How much for restaurant lanterns?'], ['Có gia công riêng không?', 'Can you customize?'], ['Bảo hành bao lâu?', 'What\s the warranty?']],
  'den-khach-san': [['Giá đèn khách sạn?', 'How much for hotel lanterns?'], ['Có gia công logo không?', 'Can you add logo?'], ['Số lượng bao nhiêu?', 'How many do you need?']],
  'phong-khach': [['Đèn nào cho phòng khách?', 'What style fits living room?'], ['Giá bao nhiêu?', 'How much?'], ['Có sao tứ giác không?', 'Any square lanterns?']],
  'ngoai-troi': [['Đèn ngoài trời loại nào?', 'Which outdoor lantern?'], ['Chịu mưa được không?', 'Waterproof?'], ['Sử dụng năng lượng nào?', 'What power source?']],
};

// Fallback chips (default if no category match)
const CHIPS_VI = [
  'Giá sản phẩm bao nhiêu?',
  'Có loại nào khác không?',
  'Giao hàng tới Hội An được không?',
  'Gia công riêng được không?',
  'Số lượng lớn có giảm giá?',
  'Bảo hành bao lâu?',
];
const CHIPS_EN = [
  'How much for this lantern?',
  'Do you have other styles?',
  'Can you ship to Hoi An?',
  'Can you customize it?',
  'Bulk order discount?',
  'What\s the warranty?',
];

function getChipsForPath(pathname: string, lang: 'vi' | 'en'): string[] {
  if (!pathname) return lang === 'en' ? CHIPS_EN : CHIPS_VI;

  const isEn = lang === 'en';

  // Match /c/[slug]
  const catMatch = pathname.match(/^\/c\/([a-z-]+)/);
  if (catMatch?.[1]) {
    const catChips = CHIPS_BY_CAT[catMatch[1]];
    if (catChips?.length) {
      return catChips.map(c => c[isEn ? 1 : 0]);
    }
  }

  // Match /p/[slug] (product page)
  if (pathname.match(/^\/p\//)) {
    return isEn ? ['Is this still in stock?', 'Can I customize it?', 'How soon can you ship?'] : ['Còn hàng không?', 'Có thể gia công không?', 'Khi nào giao?'];
  }

  // Default
  return isEn ? CHIPS_EN : CHIPS_VI;
}

function getContextMsg(pathname: string, lang: 'vi' | 'en', customTitle = '', customSub = ''): { title: string; sub: string } {
  if (customTitle.trim() || customSub.trim()) {
    return {
      title: customTitle.trim() || 'Xin chào!',
      sub: customSub.trim() || '',
    };
  }
  const isEn = lang === 'en';
  if (pathname.startsWith('/c/')) {
    const slug = pathname.slice(3).split('/')[0];
    const names = CAT_NAMES[slug];
    const name = names ? names[isEn ? 1 : 0] : (isEn ? 'this collection' : 'danh mục này');
    return isEn
      ? { title: `You're browsing ${name}`, sub: 'Ask me about styles, sizes, prices, or ordering.' }
      : { title: `Bạn đang xem ${name}`, sub: 'Hỏi tôi về phong cách, kích thước, giá cả hoặc đặt hàng nhé.' };
  }
  if (pathname.startsWith('/p/')) return isEn
    ? { title: 'You\'re viewing this product', sub: 'Ask about pricing, sizes, colours, or how to order.' }
    : { title: 'Bạn đang xem sản phẩm này', sub: 'Hỏi tôi về giá, kích thước, màu sắc hoặc cách đặt hàng.' };
  if (pathname === '/san-pham') return isEn
    ? { title: 'Looking for a lantern?', sub: 'Tell me your space, style and budget — I\'ll filter for you.' }
    : { title: 'Bạn đang tìm sản phẩm?', sub: 'Cho tôi biết không gian, phong cách và ngân sách — tôi sẽ lọc giúp bạn.' };
  return isEn
    ? { title: 'Hello! How can I help?', sub: 'Ask anything — prices, shipping, bulk orders, or styling ideas.' }
    : { title: 'Xin chào! Tôi có thể giúp gì?', sub: 'Hỏi bất cứ điều gì — giá, vận chuyển, đặt sỉ, hay ý tưởng trang trí.' };
}

type TriggerVariant = 'A' | 'B';

function trackTriggerEvent(eventName: 'impression' | 'click', payload: Record<string, string>) {
  const detail = { event: `advisor_trigger_${eventName}`, ...payload };
  try {
    window.dispatchEvent(new CustomEvent('ldv:analytics', { detail }));
  } catch { /* ignore */ }
  type GtagFn = (type: string, eventName: string, params?: Record<string, string>) => void;
  const gtagFn = (window as Window & { gtag?: GtagFn }).gtag;
  if (typeof gtagFn === 'function') {
    try { gtagFn('event', `advisor_trigger_${eventName}`, payload); } catch { /* ignore */ }
  }
}

// ─── Trigger button ────────────────────────────────────────────────────────────
export function LanternAdvisorTrigger({ settings }: { settings: AdvisorTriggerSettings }) {
  const [open, setOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [variant, setVariant] = useState<TriggerVariant>('A');
  const [subLabelIndex, setSubLabelIndex] = useState(0);
  const [subLabelVisible, setSubLabelVisible] = useState(true);
  const [subLabelPaused, setSubLabelPaused] = useState(false);
  const pathname = usePathname();
  const openRef = useRef(false);

  // Keep ref in sync with state (for proactive trigger closure)
  useEffect(() => { openRef.current = open; }, [open]);

  // Reset overlay states on route change — prevents button staying hidden after navigation
  useEffect(() => {
    setNavDrawerOpen(false);
    setSearchOpen(false);
    setAppointmentOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onDrawer = (e: Event) => setNavDrawerOpen((e as CustomEvent<boolean>).detail);
    const onSearch = (e: Event) => setSearchOpen((e as CustomEvent<boolean>).detail);
    const onAppt = (e: Event) => setAppointmentOpen((e as CustomEvent<boolean>).detail);
    const onOpenAdvisor = () => setOpen(true);
    window.addEventListener('ldv:nav-drawer', onDrawer);
    window.addEventListener('ldv:search-state', onSearch);
    window.addEventListener('ldv:appointment-state', onAppt);
    window.addEventListener('ldv:open-advisor', onOpenAdvisor);
    return () => {
      window.removeEventListener('ldv:nav-drawer', onDrawer);
      window.removeEventListener('ldv:search-state', onSearch);
      window.removeEventListener('ldv:appointment-state', onAppt);
      window.removeEventListener('ldv:open-advisor', onOpenAdvisor);
    };
  }, []);

  // Safety recovery: avoid stale hidden trigger state on mobile/tab restore.
  useEffect(() => {
    const resetOverlayState = () => {
      setNavDrawerOpen(false);
      setSearchOpen(false);
      setAppointmentOpen(false);
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') resetOverlayState();
    };
    window.addEventListener('focus', resetOverlayState);
    window.addEventListener('pageshow', resetOverlayState);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', resetOverlayState);
      window.removeEventListener('pageshow', resetOverlayState);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // A/B variant for trigger microcopy — sticky per session.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ldv-trigger-variant');
      if (stored === 'A' || stored === 'B') {
        setVariant(stored);
        return;
      }
      const picked: TriggerVariant = Math.random() < 0.5 ? 'A' : 'B';
      sessionStorage.setItem('ldv-trigger-variant', picked);
      setVariant(picked);
    } catch { /* ignore */ }
  }, []);

  // ── Proactive trigger: open after 40s if user hasn't opened yet this session ──
  useEffect(() => {
    if (!settings.enabled) return;
    try { if (sessionStorage.getItem('ldv-advisor-proactive')) return; } catch { /* ignore */ }
    const timer = setTimeout(() => {
      if (!openRef.current) {
        setOpen(true);
        try { sessionStorage.setItem('ldv-advisor-proactive', '1'); } catch { /* ignore */ }
      }
    }, 40000);
    return () => clearTimeout(timer);
  }, [settings.enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const advisorProps = {
    open,
    onClose: () => setOpen(false),
    mapsUrl: settings.mapsUrl,
    hotline: settings.hotline,
    callPhone: settings.callPhone,
    zaloPhone: settings.zaloPhone,
    viberPhone: settings.viberPhone,
    facebookUrl: settings.facebookUrl,
    whatsappPhone: settings.whatsappPhone,
    salesName: settings.chatSalesName,
    salesRole: settings.chatSalesRole,
    techName: settings.chatTechName,
    techRole: settings.chatTechRole,
    teamLabel: settings.chatTeamLabel,
    chatWelcomeTitle: settings.chatWelcomeTitle,
    chatWelcomeSub: settings.chatWelcomeSub,
  };

  const btnGrad = `linear-gradient(145deg,${settings.btnColor1},${settings.btnColor2})`;
  const greetingList = [
    'Chào bạn',
    'Hello',
    'こんにちは',
    '안녕하세요',
    'Bonjour',
    'Hallo',
    '你好',
  ];
  const displayLabel = greetingList[subLabelIndex % greetingList.length];
  const displayMobileLabel = displayLabel;
  const useFadeMode = true;
  const subLabelTransitionStyle: React.CSSProperties =
    useFadeMode
      ? {
          opacity: subLabelVisible ? 1 : 0,
          transform: subLabelVisible ? 'translateY(0px)' : 'translateY(2px)',
          transition: 'opacity 220ms ease, transform 220ms ease',
        }
      : {};

  useEffect(() => {
    setSubLabelIndex(0);
    setSubLabelVisible(true);
  }, [pathname]);

  useEffect(() => {
    if (subLabelPaused) return;
    const intervalMs = 3000;
    const timer = setTimeout(() => {
      setSubLabelVisible(false);
      setTimeout(() => {
        setSubLabelIndex((prev) => (prev + 1) % greetingList.length);
        setSubLabelVisible(true);
      }, 180);
    }, intervalMs);
    return () => clearTimeout(timer);
  }, [subLabelPaused, subLabelIndex, greetingList.length]);

  useEffect(() => {
    if (!settings.enabled || open || navDrawerOpen || searchOpen || appointmentOpen) return;
    const key = `ldv-trigger-impression:${pathname}:${variant}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch { /* ignore */ }
    trackTriggerEvent('impression', {
      route: pathname || '/',
      variant,
      label: displayLabel,
      placement: 'floating',
    });
  }, [settings.enabled, open, navDrawerOpen, searchOpen, appointmentOpen, pathname, variant, displayLabel]);

  const handleToggleAdvisor = () => {
    const nextOpen = !openRef.current;
    trackTriggerEvent('click', {
      route: pathname || '/',
      variant,
      action: nextOpen ? 'open' : 'close',
      placement: 'floating',
    });
    setOpen(nextOpen);
  };

  const btnEffectStyle: React.CSSProperties = (() => {
    if (open) return {};
    switch (settings.btnEffect) {
      case 'pulse':  return { animation: 'adv-pulse 2.5s ease-in-out infinite' };
      case 'bounce': return { animation: 'adv-bounce 2s ease-in-out infinite' };
      case 'shake':  return { animation: 'adv-shake 2.5s ease-in-out infinite' };
      case 'glow':   return { animation: 'adv-glow 2s ease-in-out infinite' };
      default:       return {};
    }
  })();
  void btnEffectStyle;

  if (!settings.enabled) return null;
  if (navDrawerOpen || searchOpen || appointmentOpen) return null;
  if (open) return <LanternAdvisor {...advisorProps} />;

  return (
    <>
      <style>{`
        @keyframes adv-ring {
          0%   { transform:scale(1);   opacity:0.7 }
          100% { transform:scale(1.9); opacity:0 }
        }
        @keyframes adv-shimmer {
          0%   { transform:translateX(-100%) }
          100% { transform:translateX(300%) }
        }
        @keyframes adv-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes adv-shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-3px)} 40%,80%{transform:translateX(3px)} }
      `}</style>

      {/* ── Back to top — floats above advisor pill ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Về đầu trang"
        style={{
          position: 'fixed',
          bottom: 'calc(148px + env(safe-area-inset-bottom, 0px))',
          right: 20,
          zIndex: 9999,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'rgba(246,242,236,0.98)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.75)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          touchAction: 'manipulation',
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.85)',
          pointerEvents: scrolled ? 'auto' : 'none',
          transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.3,0.64,1)',
        }}
        className="md:!bottom-[84px] hover:!opacity-100 active:scale-95"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>

      <div
        onClick={handleToggleAdvisor}
        onMouseEnter={() => setSubLabelPaused(true)}
        onMouseLeave={() => setSubLabelPaused(false)}
        onFocusCapture={() => setSubLabelPaused(true)}
        onBlurCapture={() => setSubLabelPaused(false)}
        style={{
          position: 'fixed',
          bottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
          right: 16,
          zIndex: 9999,
          cursor: 'pointer',
          touchAction: 'manipulation',
        }}
        className="md:!bottom-[24px] md:scale-110 md:origin-bottom-right"
      >
        {open ? (
          /* ── Close button ── */
          <div style={{
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'rgba(246,242,236,0.88)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.95), 0 4px 20px rgba(0,0,0,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.34,1.3,0.64,1)',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        ) : (
          /* ── Pill button ── */
          <div style={{
            position: 'relative',
            ...(settings.btnEffect === 'bounce' ? { animation: 'adv-bounce 2s ease-in-out infinite' } : {}),
            ...(settings.btnEffect === 'shake'  ? { animation: 'adv-shake 2.5s ease-in-out infinite' } : {}),
          }}>
            {/* Pulse ring */}
            {(settings.btnEffect === 'pulse' || settings.btnEffect === 'glow') && (
              <div style={{
                position: 'absolute', inset: -2,
                borderRadius: 22,
                background: settings.btnColor1,
                opacity: 0,
                animation: 'adv-ring 2.2s ease-out infinite',
                pointerEvents: 'none',
              }} />
            )}

            {/* Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              background: btnGrad,
              borderRadius: 22,
              padding: '8px 14px 8px 10px',
              boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.38), 0 8px 24px ${settings.btnShadow}, 0 2px 6px rgba(0,0,0,0.16)`,
              border: '1px solid rgba(255,255,255,0.28)',
              overflow: 'hidden',
              position: 'relative',
              transition: 'box-shadow 0.2s ease',
            }}>
              {/* Shimmer sweep */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0, width: '30%',
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)',
                animation: 'adv-shimmer 3s ease-in-out infinite',
                pointerEvents: 'none',
              }} />

              {/* Avatar + online dot */}
              <div style={{ position: 'relative', flexShrink: 0, pointerEvents: 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.5)', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }}>
                  <img src="/images/khanh-ha-1.jpg" alt="Khánh Hạ" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                </div>
                {/* Online dot */}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#4ade80', border: '1.5px solid rgba(255,255,255,0.9)', boxShadow: '0 0 4px rgba(74,222,128,0.6)' }} />
              </div>

              {/* Text — mobile: compact, desktop: full */}
              <div style={{ pointerEvents: 'none' }}>
                {/* Mobile: compact */}
                <div className="md:hidden" style={{ fontSize: 10.5, fontWeight: 800, color: 'white', lineHeight: 1.2, letterSpacing: '-0.01em', whiteSpace: 'nowrap', ...subLabelTransitionStyle }}>
                  {displayMobileLabel}
                </div>
                {/* Desktop: single-line multilingual greeting */}
                <div className="hidden md:block">
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'white', lineHeight: 1.2, letterSpacing: '-0.01em', whiteSpace: 'nowrap', ...subLabelTransitionStyle }}>
                    {displayLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <LanternAdvisor {...advisorProps} />
    </>
  );
}

// ─── SVG icon set ─────────────────────────────────────────────────────────────

const Icons = {
  cafe: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  restaurant: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
    </svg>
  ),
  home: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  hotel: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/><rect x="13" y="13" width="4" height="8"/>
    </svg>
  ),
  outdoor: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12"/><path d="M5 12H2a10 10 0 0018.29-7"/><path d="M12 12a10 10 0 0010-10"/><path d="M12 12C9 9 6.5 8 2 8"/>
    </svg>
  ),
  gift: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
    </svg>
  ),
  lantern: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="4"/><path d="M7 4h10l2 13H5L7 4z"/>
      <line x1="5" y1="9" x2="19" y2="9"/><line x1="6" y1="13" x2="18" y2="13"/>
      <path d="M9 17l1 4h4l1-4"/><line x1="12" y1="21" x2="12" y2="23"/>
    </svg>
  ),
  japan: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/>
      <path d="M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z"/>
    </svg>
  ),
  vintage: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  modern: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  oriental: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20"/><path d="M2 12C2 6.48 6.48 2 12 2"/><path d="M22 12c0 5.52-4.48 10-10 10"/>
      <path d="M12 2C9 6 8 9 8 12s1 6 4 10"/><path d="M12 2c3 4 4 7 4 10s-1 6-4 10"/>
    </svg>
  ),
  sun: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  neutral: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20V2z" fill={c} fillOpacity="0.25"/>
    </svg>
  ),
  moon: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  palette: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill={c}/><circle cx="17.5" cy="10.5" r=".5" fill={c}/>
      <circle cx="8.5" cy="7.5" r=".5" fill={c}/><circle cx="6.5" cy="12.5" r=".5" fill={c}/>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 1.1 0 2-.9 2-2v-1c0-.55-.22-1.05-.59-1.41a.996.996 0 01-.41-.79c0-.55.45-1 1-1h1.5c3.03 0 5.5-2.47 5.5-5.5C21 6.23 17 2 12 2z"/>
    </svg>
  ),
  tag: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  star: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  gem: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 3 2 9 12 22 22 9 18 3"/><line x1="2" y1="9" x2="22" y2="9"/>
      <polyline points="6 3 12 9 18 3"/>
    </svg>
  ),
  crown: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 19h20M2 19l3-10 5 5 2-8 2 8 5-5 3 10"/>
      <circle cx="12" cy="6" r="1" fill={c}/><circle cx="5" cy="9" r="1" fill={c}/><circle cx="19" cy="9" r="1" fill={c}/>
    </svg>
  ),
  candle: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c0 2-2 2-2 4s2 2 2 4 2 2 2 0-2-2-2-4 2-2 2-4"/><rect x="8" y="10" width="8" height="12" rx="1"/>
    </svg>
  ),
  box: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  truck: (c: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
};

// ─── Quiz data ────────────────────────────────────────────────────────────────

type IconKey = keyof typeof Icons;

interface Option {
  label: string;
  value: string;
  icon: IconKey;
  bg: string;
  color: string;
}

interface Step {
  q: string;
  options: Option[];
}

const STEPS: Step[] = [
  {
    q: 'Bạn cần đèn cho không gian nào?',
    options: [
      { label: 'Quán café / trà sữa',   value: 'cafe',       icon: 'cafe',       bg: '#fff5e6', color: '#c9822a' },
      { label: 'Nhà hàng / ẩm thực',    value: 'restaurant', icon: 'restaurant', bg: '#fef2f2', color: '#ef4444' },
      { label: 'Nhà ở / phòng khách',   value: 'home',       icon: 'home',       bg: '#f0faf4', color: '#1e8a4a' },
      { label: 'Khách sạn / resort',    value: 'hotel',      icon: 'hotel',      bg: '#eff6ff', color: '#2563eb' },
      { label: 'Sân vườn / ngoài trời', value: 'outdoor',    icon: 'outdoor',    bg: '#f0fdf4', color: '#16a34a' },
      { label: 'Quà tặng / sự kiện',    value: 'gift',       icon: 'gift',       bg: '#fdf4ff', color: '#9333ea' },
    ],
  },
  {
    q: 'Phong cách bạn yêu thích?',
    options: [
      { label: 'Hội An — ấm áp, rực rỡ',         value: 'hoian',    icon: 'lantern',  bg: '#fff5e6', color: '#c9822a' },
      { label: 'Nhật Bản — tối giản, thanh lịch', value: 'japan',   icon: 'japan',    bg: '#eff6ff', color: '#2563eb' },
      { label: 'Vintage / Rustic — hoài cổ',      value: 'vintage', icon: 'vintage',  bg: '#fdf8f0', color: '#92400e' },
      { label: 'Hiện đại / Bắc Âu',              value: 'modern',   icon: 'modern',   bg: '#f8fafc', color: '#475569' },
      { label: 'Á Đông — cổ điển',               value: 'oriental', icon: 'oriental', bg: '#fef2f2', color: '#b91c1c' },
    ],
  },
  {
    q: 'Màu sắc chủ đạo bạn thích?',
    options: [
      { label: 'Ấm — đỏ, cam, vàng',         value: 'warm',     icon: 'sun',     bg: '#fff7ed', color: '#ea580c' },
      { label: 'Trung tính — trắng, kem, be', value: 'neutral',  icon: 'neutral', bg: '#f8f8f8', color: '#6b7280' },
      { label: 'Đậm — nâu, xanh rêu, đen',   value: 'dark',     icon: 'moon',    bg: '#f1f5f9', color: '#334155' },
      { label: 'Đa sắc / nhiều màu',          value: 'colorful', icon: 'palette', bg: '#fdf4ff', color: '#9333ea' },
    ],
  },
  {
    q: 'Ngân sách cho mỗi chiếc?',
    options: [
      { label: 'Dưới 150.000đ',         value: 'budget',  icon: 'tag',   bg: '#f0faf4', color: '#16a34a' },
      { label: '150.000 – 400.000đ',    value: 'mid',     icon: 'star',  bg: '#fff7ed', color: '#ea580c' },
      { label: '400.000 – 1.000.000đ',  value: 'premium', icon: 'gem',   bg: '#eff6ff', color: '#2563eb' },
      { label: 'Trên 1.000.000đ',       value: 'luxury',  icon: 'crown', bg: '#fdf8e8', color: '#b45309' },
    ],
  },
  {
    q: 'Bạn cần bao nhiêu chiếc?',
    options: [
      { label: '1 – 5 chiếc',                   value: 'few',    icon: 'candle',  bg: '#fff5e6', color: '#c9822a' },
      { label: '5 – 30 chiếc',                  value: 'medium', icon: 'lantern', bg: '#fef2f2', color: '#ef4444' },
      { label: '30 – 100 chiếc',                value: 'many',   icon: 'box',     bg: '#eff6ff', color: '#2563eb' },
      { label: 'Số lượng lớn / gia công riêng', value: 'bulk',   icon: 'truck',   bg: '#f0faf4', color: '#1e8a4a' },
    ],
  },
];

// ─── Result ────────────────────────────────────────────────────────────────────

interface Result {
  title: string;
  desc: string;
  href: string;
  cta: string;
  color: string;
  bg: string;
  tag: string;
  icon: IconKey;
}

function getResult(answers: string[]): Result {
  const [space, style, , , qty] = answers;

  if (qty === 'bulk' || qty === 'many') {
    return {
      title: 'Gia công đèn trang trí',
      desc: 'Sản xuất theo yêu cầu — tùy chỉnh kích thước, màu sắc, chất liệu và in logo thương hiệu. Phục vụ khách sạn, resort, chuỗi nhà hàng và sự kiện lớn.',
      href: '/c/gia-cong-den-trang-tri',
      cta: 'Xem dịch vụ gia công',
      color: '#8b5e3c', bg: '#fdf8f0',
      tag: 'B2B · Số lượng lớn',
      icon: 'truck',
    };
  }
  if (style === 'japan' || style === 'modern') {
    return {
      title: 'Đèn lồng phong cách Nhật',
      desc: 'Thiết kế tối giản tinh tế, chất liệu tre mây và vải cao cấp. Mang ánh sáng ấm áp, yên bình vào không gian của bạn.',
      href: '/c/den-kieu-nhat',
      cta: 'Xem bộ sưu tập',
      color: '#2c5f8a', bg: '#eff6ff',
      tag: 'Phong cách Nhật Bản',
      icon: 'japan',
    };
  }
  if (space === 'outdoor') {
    return {
      title: 'Đèn trang trí ngoài trời',
      desc: 'Chất liệu bền với thời tiết, thiết kế phù hợp sân vườn, hành lang và không gian ngoài trời. Tạo bầu không khí ấm cúng sau hoàng hôn.',
      href: '/c/ngoai-troi',
      cta: 'Xem bộ sưu tập',
      color: '#145530', bg: '#f0faf4',
      tag: 'Ngoài trời · Bền thời tiết',
      icon: 'outdoor',
    };
  }
  return {
    title: 'Đèn lồng Hội An',
    desc: 'Đèn thủ công truyền thống từ làng nghề Hội An. Màu sắc phong phú, ấm áp — lựa chọn số 1 cho quán café, nhà hàng và trang trí gia đình.',
    href: '/c/hoi-an-lantern',
    cta: 'Xem bộ sưu tập',
    color: '#c9822a', bg: '#fff5e6',
    tag: 'Bán chạy nhất',
    icon: 'lantern',
  };
}

// ─── Link renderer — parse [text](/path) into clickable <a> tags ─────────────

function renderMessage(text: string): React.ReactNode {
  const tokenRegex = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s,，。！？）\)]+)/g;
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts: React.ReactNode[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    tokenRegex.lastIndex = 0;
    while ((m = tokenRegex.exec(line)) !== null) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      if (m[1] !== undefined && m[2] !== undefined) {
        const href = m[2];
        const isExternal = href.startsWith('http');
        parts.push(
          <a key={m.index} href={href}
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={{ color: '#104e2e', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}
          >{m[1]}</a>
        );
      } else if (m[3]) {
        parts.push(
          <a key={m.index} href={m[3]} target="_blank" rel="noopener noreferrer"
            style={{ color: '#104e2e', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}
          >{m[3]}</a>
        );
      }
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return (
      <span key={lineIdx}>
        {parts.length ? parts : line}
        {lineIdx < lines.length - 1 ? <br /> : null}
      </span>
    );
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  open: boolean; onClose: () => void;
  mapsUrl: string; hotline: string; callPhone: string;
  zaloPhone: string; viberPhone: string; facebookUrl: string; whatsappPhone: string;
  salesName: string; salesRole: string;
  techName: string; techRole: string;
  teamLabel: string;
  chatWelcomeTitle?: string;
  chatWelcomeSub?: string;
}

export default function LanternAdvisor({ open, onClose, mapsUrl, hotline, callPhone, zaloPhone, viberPhone, facebookUrl, whatsappPhone, salesName, salesRole, techName, techRole, teamLabel, chatWelcomeTitle, chatWelcomeSub }: Props) {
  const viberIntl = '%2B84' + viberPhone.replace(/\D/g, '').replace(/^0/, '');
  const waPhone = '84' + whatsappPhone.replace(/\D/g, '').replace(/^0/, '');
  const callIntl = callPhone.replace(/\D/g, '').replace(/^0/, '');
  const pathname = usePathname();

  // ── Quiz state ──
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // ── Chat state ──
  const [tab, setTab] = useState<'quiz' | 'chat'>('chat');
  type ChatMsg = { role: 'user' | 'assistant'; content: string; agent?: 'kh' | 'vt' };
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [activeAgent, setActiveAgent] = useState<'kh' | 'vt'>('kh');
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // ── Chat lead capture state ──
  const [chatLeadShown, setChatLeadShown] = useState(false);
  const [chatLeadDismissed, setChatLeadDismissed] = useState(false);
  const [chatLeadName, setChatLeadName] = useState('');
  const [chatLeadPhone, setChatLeadPhone] = useState('');
  const [chatLeadNote, setChatLeadNote] = useState('');
  const [chatLeadStatus, setChatLeadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [chatLeadError, setChatLeadError] = useState('');
  const [checkoutIntentDetected, setCheckoutIntentDetected] = useState(false);

  // ── Idle proactive trigger state ──
  const [idleProactiveFired, setIdleProactiveFired] = useState(false);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const [chatErrorCount, setChatErrorCount] = useState(0);

  // ── Quick reply chips state ──
  const [chatChips, setChatChips] = useState<string[]>([]);

  // ── UX state ──
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [msgFeedback, setMsgFeedback] = useState<Record<number, 'up' | 'down'>>({});
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const [copiedMsg, setCopiedMsg] = useState<number | null>(null);
  const [composerOffset, setComposerOffset] = useState(6);
  const [chatInputFocused, setChatInputFocused] = useState(false);
  const lastAutoLeadKeyRef = useRef<string>('');
  // ── Typewriter placeholder — run only when popup opens ──
  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % 2), 3500);
    return () => clearInterval(t);
  }, [open]);

  // Keep composer above mobile keyboard (iOS/Android visual viewport)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      const keyboardHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setComposerOffset(keyboardHeight > 0 ? keyboardHeight + 6 : 6);
    };
    onResize();
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
    };
  }, []);

  // ── SessionStorage: restore chat on mount ──
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('ldv-chat-v1');
      if (saved) {
        const { msgs } = JSON.parse(saved);
        if (Array.isArray(msgs) && msgs.length > 0) setChatMessages(msgs);
      }
    } catch { /* ignore */ }
  }, []);

  // ── SessionStorage: save chat on every message change ──
  useEffect(() => {
    if (chatMessages.length === 0) return;
    try {
      sessionStorage.setItem('ldv-chat-v1', JSON.stringify({ msgs: chatMessages }));
    } catch { /* ignore */ }
  }, [chatMessages]);


  // ── Track visited pages for context memory ──
  useEffect(() => {
    try {
      let visited = [];
      const saved = sessionStorage.getItem('ldv-visited-pages');
      if (saved) {
        visited = JSON.parse(saved);
        if (!Array.isArray(visited)) visited = [];
      }
      // Add current pathname if not already there (max 5 recent)
      if (pathname && !visited.includes(pathname)) {
        visited = [pathname, ...visited].slice(0, 5);
        sessionStorage.setItem('ldv-visited-pages', JSON.stringify(visited));
      }
    } catch { /* ignore */ }
  }, [pathname]);


  // ── Esc key to close ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // ── Scroll to bottom on new messages ──
  useEffect(() => {
    if (tab !== 'chat') return;
    // During streaming, avoid repeated smooth animation to reduce CPU usage.
    chatEndRef.current?.scrollIntoView({ behavior: chatLoading ? 'auto' : 'smooth' });
  }, [chatMessages, tab, chatLoading]);

  // ── Show lead card 8s after first user message ──
  useEffect(() => {
    const userMessageCount = chatMessages.filter(m => m.role === 'user').length;
    if (chatLeadShown || chatLeadDismissed || userMessageCount < 1) return;
    const timer = setTimeout(() => setChatLeadShown(true), 8000);
    return () => clearTimeout(timer);
  }, [chatMessages, chatLeadShown, chatLeadDismissed]);

  // ── Idle proactive trigger after 15s of inactivity ──
  useEffect(() => {
    const userMessageCount = chatMessages.filter(m => m.role === 'user').length;
    if (!open || userMessageCount < 2 || chatLoading || idleProactiveFired) return;

    // Clear existing timer
    if (idleTimer) clearTimeout(idleTimer);

    // Set new timer for idle proactive
    const timer = setTimeout(() => {
      const catSlug = pathname.match(/^\/c\/([a-z-]+)/)?.[1];
      const catName = catSlug && CAT_NAMES[catSlug] ? CAT_NAMES[catSlug][0] : '';

      let proactiveMsg = 'Anh/chị cần thêm thông tin gì không ạ?';
      if (checkoutIntentDetected) {
        proactiveMsg = 'Anh/chị cần mình hỗ trợ thêm gì không ạ?';
      } else if (catName) {
        proactiveMsg = `Anh/chị đang quan tâm đến ${catName}? Mình có thể gợi ý cụ thể hơn ạ.`;
      }

      sendChat(proactiveMsg);
      setIdleProactiveFired(true);
    }, 28000);

    setIdleTimer(timer);
    return () => clearTimeout(timer);
  }, [open, chatMessages, chatLoading, idleProactiveFired, checkoutIntentDetected, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Detect "báo chốt" keywords ──
  const isCheckoutIntent = (text: string): boolean => {
    const checkoutKeywords = [
      'báo chốt', 'chốt đơn', 'đã chốt', 'confirm', 'xác nhận', 'định mua', 'sẽ mua', 'muốn mua',
      'báo giá được không', 'bao nhiêu tiền', 'giá bao nhiêu', 'tính tiền', 'thanh toán',
      'giao tới', 'ship đi', 'giao đi', 'vận chuyển', 'đặt hàng', 'order',
      'confirmed', 'let me buy', 'how much', 'price', 'ship to', 'delivery',
      '确认', '下单', '多少钱', '运费', '送货',
      '確認', '注文', 'いくら', '価格',
      '주문', '확인', '가격', '배송',
    ];
    const lowerText = text.toLowerCase();
    return checkoutKeywords.some(kw => lowerText.includes(kw));
  };

  const normalizeLeadText = (text: string): string =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const hasUrgentCallbackIntent = (text: string): boolean => {
    const t = normalizeLeadText(text);
    const callbackSignals = [
      'goi lai', 'goi gap', 'goi ngay', 'goi cho toi', 'goi cho minh',
      'lien he lai', 'lien he gap', 'tu van gap', 'tu van ngay',
      'can tu van', 'can ho tro', 'ho tro gap', 'call me', 'call back',
      'urgent', 'asap',
    ];
    return callbackSignals.some((kw) => t.includes(kw));
  };

  const sendChat = useCallback(async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const userMsg: ChatMsg = { role: 'user', content: text.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    setChatChips([]); // Clear chips khi user gửi tin

    // ── Detect checkout intent (báo chốt đơn) ──
    const hasCheckoutIntent = isCheckoutIntent(text);
    if (hasCheckoutIntent) {
      setCheckoutIntentDetected(true);
    }

    // ── Auto phone detect → lưu lead ──
    const phoneMatch = text.match(/(?:0|\+84)(?:3[2-9]|5[689]|7[06789]|8[0-9]|9[0-9])\d{7}/);
    if (phoneMatch) {
      const isUrgentLead = hasUrgentCallbackIntent(text);
      const phone = phoneMatch[0];
      const leadKey = `${phone}|${isUrgentLead ? 'urgent' : 'normal'}`;
      if (lastAutoLeadKeyRef.current === leadKey) {
        // Avoid duplicate fire for same phone+intent within current open session.
      } else {
        lastAutoLeadKeyRef.current = leadKey;
      fetch('/api/advisor-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: isUrgentLead ? 'Khách cần gọi lại gấp' : 'Khách chat tư vấn',
          phone,
          source: isUrgentLead ? 'chat-urgent-callback' : 'chat-auto-detect',
          context: pathname,
          customer_note: text.trim().slice(0, 1000),
        }),
      }).catch(() => {/* non-blocking */});
      }
    }

    // ── Show lead capture modal if checkout intent detected ──
    if (hasCheckoutIntent && !chatLeadDismissed) {
      setChatLeadShown(true);
    }

    const allMessages = [...chatMessages, userMsg];
    const assistantMsg: ChatMsg = { role: 'assistant', content: '', agent: activeAgent };
    setChatMessages(prev => [...prev, assistantMsg]);

    try {
      // Get visited pages from sessionStorage for context memory
      let visitedPages = [];
      try {
        const saved = sessionStorage.getItem('ldv-visited-pages');
        if (saved) visitedPages = JSON.parse(saved);
      } catch { /* ignore */ }
      const contextStr = visitedPages.length > 0
        ? `${pathname} | visited: ${visitedPages.join(', ')}`
        : pathname;

      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          context: contextStr,
          salesName, techName,
        }),
      });

      if (!res.ok || !res.body) throw new Error('Network error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let agentDetected: 'kh' | 'vt' | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        // Parse agent tag from start of response ([KH] or [VT])
        if (agentDetected === null && accumulated.length >= 4) {
          if (accumulated.startsWith('[KH]')) { agentDetected = 'kh'; setActiveAgent('kh'); }
          else if (accumulated.startsWith('[VT]')) { agentDetected = 'vt'; setActiveAgent('vt'); }
          else { agentDetected = 'kh'; } // fallback
        }

        // Strip agent tag + chips marker from displayed content
        const chipsMatch = accumulated.match(/<<<CHIPS:([^>]+)>>>/);
        const chips = chipsMatch ? chipsMatch[1].split('|').map(c => c.trim()).filter(Boolean) : [];
        const displayContent = accumulated
          .replace(/^\[KH\]\s*/, '')
          .replace(/^\[VT\]\s*/, '')
          .replace(/\n?<<<CHIPS:[^>]+>>>\s*$/, '')
          .trim();

        const msgAgent = agentDetected ?? 'kh';
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: displayContent, agent: msgAgent };
          return updated;
        });
        if (chips.length > 0) setChatChips(chips);
      }
    } catch {
      setChatErrorCount(prev => prev + 1);
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại hoặc gọi 0989.778.247.', agent: 'kh' };
        return updated;
      });
    } finally {
      setChatLoading(false);
    }
  }, [chatLoading, chatMessages, pathname, activeAgent]);

  // ── Copy message to clipboard ──
  const copyMsg = useCallback(async (idx: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg(idx);
      setTimeout(() => setCopiedMsg(null), 1500);
    } catch { /* ignore */ }
  }, []);

  function handleOption(value: string) {
    const next = [...answers, value];
    if (step < STEPS.length - 1) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      setAnswers(next);
      setResult(getResult(next));
    }
  }

  function reset() {
    setStep(0); setAnswers([]); setResult(null);
    setLeadName(''); setLeadPhone(''); setLeadStatus('idle');
    setChatMessages([]); setChatInput(''); setTab('quiz'); setActiveAgent('kh'); setChatChips([]);
    setChatLeadShown(false); setChatLeadDismissed(false);
    setChatLeadName(''); setChatLeadPhone(''); setChatLeadNote(''); setChatLeadStatus('idle');
    setCheckoutIntentDetected(false);
    setMsgFeedback({});
    try { sessionStorage.removeItem('ldv-chat-v1'); } catch { /* ignore */ }
  }

  function handleClose() { onClose(); }

  if (!open) return null;

  const defaultWelcomeTitle = 'Xin chào! Hỗ trợ đa ngôn ngữ 24/7';
  const defaultWelcomeSub = 'Tiếng Việt | English | 中文 | 日本語 | 한국어\nHoặc bạn có thể chat bằng ngôn ngữ bạn quen dùng.';
  const ctxMsg = getContextMsg(pathname, 'vi', chatWelcomeTitle || defaultWelcomeTitle, chatWelcomeSub || defaultWelcomeSub);
  const currentPlaceholder = placeholderIdx % 2 === 0 ? 'Nhập câu hỏi...' : 'Type in English...';

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0, zIndex: 55,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        animation: 'ldvFadeIn 0.2s ease',
      }} />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 56,
        background: 'linear-gradient(160deg, #0c3f25 0%, #135132 100%)',
        borderRadius: '24px 24px 0 0',
        maxWidth: '480px', margin: '0 auto',
        boxShadow: '0 -6px 28px rgba(0,0,0,0.14)',
        animation: 'ldvSlideUp 0.32s cubic-bezier(0.34,1.3,0.64,1)',
        maxHeight: '92vh', overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        <style>{`
          @keyframes ldvFadeIn { from{opacity:0} to{opacity:1} }
          @keyframes ldvSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        `}</style>

        {/* ── Premium header — dark green ── */}
        <div style={{
          background: 'linear-gradient(160deg, #0c3f25 0%, #135132 100%)',
          borderRadius: '24px 24px 0 0',
          padding: '0 20px',
          margin: 0,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Handle */}
          <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.16)', borderRadius: 99, margin: '10px auto 0' }} />

          {/* Team avatars + title + close */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0 0', gap: 12 }}>
            {/* 2 avatars side by side — click to switch persona */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {/* Khánh Hạ — click to switch to sales */}
              <button
                onClick={() => setActiveAgent('kh')}
                title={`Chuyển sang ${salesName} — ${salesRole}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', border: activeAgent === 'kh' ? '2px solid #4ade80' : '2px solid rgba(255,255,255,0.2)', boxShadow: activeAgent === 'kh' ? '0 0 8px rgba(74,222,128,0.5)' : 'none', opacity: activeAgent === 'kh' ? 1 : 0.45, transition: 'all 0.3s ease', transform: activeAgent !== 'kh' ? 'scale(0.92)' : 'scale(1)' }}>
                    <img src="/images/khanh-ha-1.jpg" alt={salesName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#4ade80', border: '1.5px solid #0a3320' }} />
                </div>
                <div style={{ fontSize: 8, fontWeight: 600, color: activeAgent === 'kh' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', letterSpacing: '0.01em', transition: 'color 0.3s' }}>{salesName}</div>
              </button>
              {/* Văn Trường — click to switch to tech */}
              <button
                onClick={() => setActiveAgent('vt')}
                title={`Chuyển sang ${techName} — ${techRole}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', border: activeAgent === 'vt' ? '2px solid #60a5fa' : '2px solid rgba(255,255,255,0.2)', boxShadow: activeAgent === 'vt' ? '0 0 8px rgba(96,165,250,0.5)' : 'none', opacity: activeAgent === 'vt' ? 1 : 0.45, transition: 'all 0.3s ease', transform: activeAgent !== 'vt' ? 'scale(0.92)' : 'scale(1)' }}>
                    <img src="/images/advisor-avatar-tech.jpg" alt={techName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#4ade80', border: '1.5px solid #0a3320' }} />
                </div>
                <div style={{ fontSize: 8, fontWeight: 600, color: activeAgent === 'vt' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', letterSpacing: '0.01em', transition: 'color 0.3s' }}>{techName}</div>
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,210,120,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>{teamLabel}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.4, marginTop: 2 }}>
                {activeAgent === 'kh' ? `${salesName} — ${salesRole}` : `${techName} — ${techRole}`}
              </div>
            </div>
            <button onClick={handleClose} aria-label="Đóng" style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2, marginTop: 14 }}>
            {([['chat', true], ['quiz', false]] as const).map(([id, isAI]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  padding: '9px 16px 11px',
                  borderRadius: '10px 10px 0 0',
                  border: isAI ? '1px solid rgba(201,130,42,0.55)' : 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700,
                  transition: 'all 0.2s ease',
                  background: tab === id
                    ? '#fff'
                    : (isAI ? 'linear-gradient(180deg, rgba(201,130,42,0.28), rgba(201,130,42,0.16))' : 'transparent'),
                  color: tab === id ? '#104e2e' : (isAI ? 'rgba(255,240,210,0.95)' : 'rgba(255,255,255,0.5)'),
                  boxShadow: isAI ? (tab === id
                    ? '0 6px 18px rgba(201,130,42,0.25), inset 0 1px 0 rgba(255,255,255,0.65)'
                    : '0 4px 14px rgba(201,130,42,0.18), inset 0 1px 0 rgba(255,255,255,0.35)') : 'none',
                  display: 'flex', alignItems: 'center', gap: 5,
                  position: 'relative',
                }}
              >
                {isAI ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                )}
                {isAI ? (
                  <>
                    <span className="md:hidden">Tư vấn</span>
                    <span className="hidden md:inline">Tư vấn nhanh</span>
                  </>
                ) : 'Gợi ý nhanh'}
                {isAI && tab !== 'chat' && (
                  <span style={{
                    background: 'rgba(255,200,80,0.25)', color: 'rgba(255,210,120,0.95)',
                    fontSize: 7.5, fontWeight: 800, letterSpacing: '0.06em',
                    padding: '1.5px 5px', borderRadius: 99, textTransform: 'uppercase', lineHeight: 1.6,
                  }}>NEW</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px 40px', background: 'linear-gradient(180deg,#f7faf8 0%, #ffffff 70%)', borderTop: '1px solid rgba(16,78,46,0.08)' }}>

          {/* ── Chat tab ── */}
          {tab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Messages */}
              <div style={{ height: chatLeadShown && !chatLeadDismissed ? 240 : 380, overflowY: 'auto', marginBottom: 12, paddingRight: 2 }}>
                {chatMessages.length === 0 && (
                  <div>
                    {/* Context-aware welcome */}
                    <div style={{ background: 'linear-gradient(135deg, #f0f7f3, #e8f2ec)', borderRadius: 14, padding: '14px 16px', marginBottom: 14, border: '1px solid rgba(16,78,46,0.1)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#104e2e', marginBottom: 5 }}>{ctxMsg.title}</div>
                      <div style={{ fontSize: 12, color: '#5a4a3a', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{ctxMsg.sub}</div>
                    </div>
                    {/* Bilingual chips — 2 columns: VI left, EN right */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 4 }}>
                      {/* Column headers */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 2 }}>
                        <svg width="14" height="10" viewBox="0 0 14 10"><rect width="14" height="10" fill="#DA251D"/><polygon points="7,1.2 8.2,4.8 11.8,4.8 9,6.8 10,10 7,8 4,10 5,6.8 2.2,4.8 5.8,4.8" fill="#FFCD00"/></svg>
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a7a6a', letterSpacing: '0.04em' }}>Tiếng Việt</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 2 }}>
                        <svg width="14" height="10" viewBox="0 0 60 40"><rect width="60" height="40" fill="#012169"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="white" strokeWidth="8"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5"/><path d="M30,0 V40 M0,20 H60" stroke="white" strokeWidth="12"/><path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8"/></svg>
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: '#8a7a6a', letterSpacing: '0.04em' }}>English</span>
                      </div>
                    </div>
                    {(() => {
                      const chipsVi = getChipsForPath(pathname, 'vi');
                      const chipsEn = getChipsForPath(pathname, 'en');
                      const pairCount = Math.min(chipsVi.length, chipsEn.length);

                      // Always show 2 columns on first-open suggestions: VI left | EN right
                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                          {Array.from({ length: pairCount }).map((_, i) => (
                            [
                              <button key={`vi-${i}`} onClick={() => sendChat(chipsVi[i])}
                                style={{ background: '#fff', border: '1px solid #e8e0d5', borderRadius: 10, padding: '7px 10px', fontSize: 10.5, color: '#5a4a3a', cursor: 'pointer', transition: 'all 0.15s ease', fontWeight: 500, textAlign: 'left', lineHeight: 1.4 }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f0f7f3'; (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#e8e0d5'; }}
                              >{chipsVi[i]}</button>,
                              <button key={`en-${i}`} onClick={() => sendChat(chipsEn[i])}
                                style={{ background: '#f8f8fc', border: '1px solid #e0dce8', borderRadius: 10, padding: '7px 10px', fontSize: 10.5, color: '#5a4a6a', cursor: 'pointer', transition: 'all 0.15s ease', fontWeight: 500, textAlign: 'left', lineHeight: 1.4 }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#eef0f8'; (e.currentTarget as HTMLElement).style.borderColor = '#6366f1'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8f8fc'; (e.currentTarget as HTMLElement).style.borderColor = '#e0dce8'; }}
                              >{chipsEn[i]}</button>,
                            ]
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Handoff banner — show when error count >= 2 */}
                {chatErrorCount >= 2 && (
                  <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#856404', marginBottom: 6 }}>Có sự cố kỹ thuật</div>
                    <div style={{ fontSize: 12, color: '#856404', marginBottom: 8 }}>Hãy liên hệ trực tiếp với chúng tôi để được hỗ trợ tốt hơn:</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a href="tel:0989778247" style={{ flex: 1, background: '#c9822a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 700, textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                          </svg>
                          Gọi
                        </span>
                      </a>
                      <a href="https://zalo.me/0989778247" target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: '#104e2e', color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 700, textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                          </svg>
                          Zalo
                        </span>
                      </a>
                    </div>
                  </div>
                )}

                {chatMessages.map((msg, i) => (
                  <div key={i}>
                    <div style={{ marginBottom: 4, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      {msg.role === 'assistant' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0, marginRight: 8, marginTop: 2 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', border: msg.agent === 'vt' ? '2px solid #bfdbfe' : '2px solid #e6d8c0', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                            <img
                              src={msg.agent === 'vt' ? '/images/advisor-avatar-tech.jpg' : '/images/khanh-ha-1.jpg'}
                              alt={msg.agent === 'vt' ? techName : salesName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                            />
                          </div>
                          <div style={{ fontSize: 7.5, fontWeight: 600, color: msg.agent === 'vt' ? '#3b82f6' : '#8b5e3c', whiteSpace: 'nowrap', lineHeight: 1 }}>
                            {msg.agent === 'vt' ? techName : salesName}
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          maxWidth: '80%', position: 'relative',
                          background: msg.role === 'user'
                            ? 'linear-gradient(135deg, #104e2e, #1a6b3c)'
                            : '#f8f5f0',
                          color: msg.role === 'user' ? 'white' : '#1a1a1a',
                          borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                          padding: '10px 14px',
                          fontSize: 13, lineHeight: 1.6,
                          border: msg.role === 'assistant' ? '1px solid #ede8e0' : 'none',
                        }}
                        onMouseEnter={() => msg.role === 'assistant' && setHoveredMsg(i)}
                        onMouseLeave={() => setHoveredMsg(null)}
                      >
                        {msg.content ? renderMessage(msg.content) : (chatLoading && i === chatMessages.length - 1 ? (
                          <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            {[0,1,2].map(d => (
                              <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8a7a6a', animation: `ldvDot 1.2s ease-in-out ${d * 0.2}s infinite` }} />
                            ))}
                          </span>
                        ) : '')}

                        {/* Copy button — visible on hover for assistant messages */}
                        {msg.role === 'assistant' && msg.content && hoveredMsg === i && (
                          <button
                            onClick={() => copyMsg(i, msg.content)}
                            title="Sao chép / Copy"
                            style={{
                              position: 'absolute', top: 6, right: 6,
                              width: 22, height: 22, borderRadius: 6,
                              background: copiedMsg === i ? '#dcfce7' : 'rgba(255,255,255,0.9)',
                              border: '1px solid #e0d8d0',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', transition: 'all 0.15s ease',
                            }}
                          >
                            {copiedMsg === i ? (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            ) : (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8a7a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Thumbs up/down — only after complete assistant messages */}
                    {msg.role === 'assistant' && msg.content && !(chatLoading && i === chatMessages.length - 1) && (
                      <div style={{ display: 'flex', gap: 3, marginBottom: 8, marginLeft: 34 }}>
                        {(['up', 'down'] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => setMsgFeedback(prev => ({ ...prev, [i]: prev[i] === type ? undefined as unknown as 'up' | 'down' : type }))}
                            title={type === 'up' ? 'Hữu ích / Helpful' : 'Chưa hữu ích / Not helpful'}
                            style={{
                              width: 22, height: 22, borderRadius: 6, border: 'none', cursor: 'pointer',
                              background: msgFeedback[i] === type
                                ? (type === 'up' ? '#dcfce7' : '#fee2e2')
                                : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.15s ease',
                              padding: 0,
                            }}
                          >
                            {type === 'up' ? (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                                stroke={msgFeedback[i] === 'up' ? '#16a34a' : '#ccc'}
                                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
                                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                              </svg>
                            ) : (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                                stroke={msgFeedback[i] === 'down' ? '#dc2626' : '#ccc'}
                                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/>
                                <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {/* ── Quick reply chips ── */}
                {chatChips.length > 0 && !chatLoading && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, padding: '4px 16px 12px 16px' }}>
                    {chatChips.map((chip, ci) => (
                      <button
                        key={ci}
                        onClick={() => { sendChat(chip); setChatChips([]); }}
                        style={{
                          padding: '7px 13px', borderRadius: 99,
                          background: '#f0f7f2', border: '1.5px solid #c8e6d4',
                          color: '#104e2e', fontSize: 12.5, fontWeight: 600,
                          cursor: 'pointer', transition: 'all 0.15s ease',
                          letterSpacing: '-0.01em', lineHeight: 1.3,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e6f2eb'; (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f0f7f2'; (e.currentTarget as HTMLElement).style.borderColor = '#c8e6d4'; }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* ── Chat lead capture card ── */}
              {chatLeadShown && !chatLeadDismissed && (
                <div style={{ marginBottom: 8 }}>
                  {chatLeadStatus === 'success' ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#f0faf4', border: '1.5px solid #c3e6ce',
                      borderRadius: 12, padding: '10px 14px',
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#1e8a4a,#104e2e)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#104e2e', lineHeight: 1.3 }}>Đã nhận! Chuyên viên sẽ gọi lại sớm.</div>
                    </div>
                  ) : (
                    <div style={{
                      background: 'linear-gradient(135deg,#fffbf5,#fff8ee)',
                      border: '1.5px solid #f0d9b0',
                      borderRadius: 12, padding: '8px 10px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#8b5e3c' }}>
                          {checkoutIntentDetected ? 'Để chúng tôi xác nhận đơn hàng?' : 'Để chuyên viên gọi lại tư vấn thêm?'}
                        </div>
                        <button
                          onClick={() => setChatLeadDismissed(true)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#ccc', flexShrink: 0, lineHeight: 1 }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                        <input type="text" placeholder="Họ tên" value={chatLeadName} onChange={e => setChatLeadName(e.target.value)}
                          style={{ flex: 1, fontSize: 12, padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e8d8c0', outline: 'none', background: '#fff', color: '#111', fontFamily: 'inherit' }}
                        />
                        <input type="tel" placeholder="Số điện thoại" value={chatLeadPhone} onChange={e => setChatLeadPhone(e.target.value)}
                          style={{ flex: 1, fontSize: 12, padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e8d8c0', outline: 'none', background: '#fff', color: '#111', fontFamily: 'inherit' }}
                        />
                      </div>
                      <div style={{ marginBottom: 6 }}>
                        <textarea
                          placeholder="Nội dung yêu cầu (không gian, số lượng, deadline...)"
                          value={chatLeadNote}
                          onChange={e => setChatLeadNote(e.target.value)}
                          rows={2}
                          style={{ width: '100%', resize: 'vertical', fontSize: 12, padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e8d8c0', outline: 'none', background: '#fff', color: '#111', fontFamily: 'inherit', lineHeight: 1.45 }}
                        />
                      </div>
                      {chatLeadStatus === 'error' && (
                        <div style={{ marginBottom: 6, fontSize: 11, color: '#b91c1c', fontWeight: 600 }}>
                          {chatLeadError || 'Gửi thất bại, vui lòng thử lại hoặc gọi 0989.778.247.'}
                        </div>
                      )}
                      <button
                        disabled={chatLeadStatus === 'loading' || !chatLeadName.trim() || !chatLeadPhone.trim()}
                        onClick={async () => {
                          if (!chatLeadName.trim() || !chatLeadPhone.trim()) return;
                          const normalizedPhone = chatLeadPhone.replace(/[^\d+]/g, '').trim();
                          if (normalizedPhone.length < 8) {
                            setChatLeadStatus('error');
                            setChatLeadError('Số điện thoại chưa hợp lệ. Vui lòng kiểm tra lại.');
                            return;
                          }
                          setChatLeadError('');
                          setChatLeadStatus('loading');
                          try {
                            const leadRes = await fetch('/api/advisor-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                name: chatLeadName.trim(),
                                phone: normalizedPhone,
                                result_title: 'Chat tư vấn',
                                is_checkout: true,
                                customer_note: chatLeadNote.trim(),
                              }),
                            });
                            if (!leadRes.ok) {
                              const errText = await leadRes.text().catch(() => '');
                              throw new Error(errText || 'Lead send failed');
                            }
                            setChatLeadStatus('success');
                          } catch (err) {
                            setChatLeadStatus('error');
                            setChatLeadError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.');
                          }
                        }}
                        style={{
                          width: '100%',
                          background: chatLeadStatus === 'loading' || !chatLeadName.trim() || !chatLeadPhone.trim() ? '#e0e0e0' : 'linear-gradient(135deg,#c9822a,#a06020)',
                          color: chatLeadStatus === 'loading' || !chatLeadName.trim() || !chatLeadPhone.trim() ? '#aaa' : '#fff',
                          border: 'none', borderRadius: 8, padding: '8px',
                          fontSize: 12, fontWeight: 700, cursor: chatLeadStatus === 'loading' ? 'wait' : 'pointer',
                          transition: 'all 0.2s ease', fontFamily: 'inherit',
                        }}
                      >
                        {chatLeadStatus === 'loading' ? 'Đang gửi...' : 'Gửi thông tin'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Input */}
              <div
                style={{
                  position: 'sticky',
                  bottom: `calc(env(safe-area-inset-bottom, 0px) + ${composerOffset}px)`,
                  borderTop: '1px solid #ede8e0',
                  paddingTop: 10,
                  paddingBottom: 4,
                  background: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  zIndex: 3,
                }}
              >
                <div style={{ position: 'relative' }}>
                  <input
                    ref={chatInputRef}
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(chatInput); } }}
                    placeholder={currentPlaceholder}
                    disabled={chatLoading}
                    style={{
                      width: '100%', border: '1.5px solid #e8e0d5', borderRadius: 12,
                      padding: '10px 56px 10px 14px', fontSize: 14, outline: 'none',
                      background: chatLoading ? '#f8f5f0' : '#fff',
                      color: '#1a1a1a', transition: 'border-color 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                    onFocus={e => {
                      (e.target as HTMLInputElement).style.borderColor = '#104e2e';
                      setChatInputFocused(true);
                      setTimeout(() => chatInputRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120);
                    }}
                    onBlur={e => {
                      (e.target as HTMLInputElement).style.borderColor = '#e8e0d5';
                      setChatInputFocused(false);
                    }}
                  />
                  <button
                    onClick={() => sendChat(chatInput)}
                    disabled={chatLoading || !chatInput.trim()}
                    aria-label="Gửi tin nhắn"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: 4,
                      transform: 'translateY(-50%)',
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      border: 'none',
                      cursor: chatLoading || !chatInput.trim() ? 'not-allowed' : 'pointer',
                      background: chatLoading || !chatInput.trim() ? '#e8e0d5' : 'linear-gradient(135deg, #104e2e, #1a6b3c)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s ease',
                      boxShadow: chatLoading || !chatInput.trim() ? 'none' : '0 2px 8px rgba(16,78,46,0.32)',
                      zIndex: 5,
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>
                <div style={{ display: chatInputFocused ? 'none' : 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => { setChatLeadShown(true); setChatLeadDismissed(false); }}
                    style={{
                      border: '1px solid #d8c29c',
                      background: '#fff9ef',
                      color: '#8b5e3c',
                      borderRadius: 999,
                      padding: '5px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Gửi yêu cầu
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <span style={{ fontSize: 10, color: '#b0a899', lineHeight: 1.5 }}>
                  Thông tin mang tính tham khảo — gọi 0989.778.247 để xác nhận.
                </span>
              </div>
            </div>
          )}

          {/* ── Quiz tab ── */}
          {tab === 'quiz' && (<>

          {/* ── Contact card ── */}
          <div style={{
            marginBottom: 20,
            background: 'linear-gradient(135deg,#0d4225 0%,#1a6640 100%)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            <style>{`
              @keyframes adv-call-ripple {
                0%   { box-shadow: 0 2px 8px rgba(239,68,68,0.5), 0 0 0 0 rgba(239,68,68,0.45) }
                70%  { box-shadow: 0 2px 8px rgba(239,68,68,0.5), 0 0 0 10px rgba(239,68,68,0) }
                100% { box-shadow: 0 2px 8px rgba(239,68,68,0.5), 0 0 0 0 rgba(239,68,68,0) }
              }
            `}</style>

            {/* Header: logo + hotline + maps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px 10px' }}>
              <div style={{ background: 'white', borderRadius: 8, padding: '4px 8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34 }}>
                <img src="/logo.webp" alt="Long Đèn Việt" style={{ height: 24, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1 }}>Hotline</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '0.02em', lineHeight: 1.3 }}>{hotline}</div>
              </div>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 20, padding: '5px 10px', textDecoration: 'none', flexShrink: 0,
                  transition: 'background 0.15s ease',
                }}
                className="hover:!bg-white/25"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 9.5l3.5 1.5L12 6l5.5 5 3.5-1.5z" fill="#34A853"/>
                  <path d="M12 6l-5.5 5L12 22l5.5-11z" fill="#4285F4"/>
                  <path d="M6.5 11L3 9.5 12 22z" fill="#1A73E8"/>
                  <path d="M17.5 11L21 9.5 12 22z" fill="#0F9D58"/>
                </svg>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>Đường đi</span>
              </a>
            </div>

            {/* 6 contact buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 4, padding: '4px 10px 14px' }}>
              {([
                {
                  label: 'Gọi điện',
                  href: `tel:+84${callIntl}`, target: '_self',
                  bg: 'linear-gradient(145deg,#b91c1c,#ef4444)', shadow: 'rgba(239,68,68,0.55)',
                  ripple: true,
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.56 21 3 13.44 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.58.11.35.03.74-.23 1.01L6.6 10.8z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Zalo',
                  href: `https://zalo.me/${zaloPhone.replace(/\D/g,'')}`, target: '_blank',
                  bg: 'linear-gradient(145deg,#0055d4,#0068FF)', shadow: 'rgba(0,104,255,0.45)',
                  icon: (
                    <svg width="26" height="9" viewBox="0 0 25 9" fill="white">
                      <path d="M12.6808693,2.52045104 L12.6808693,2.06398482 L14.048117,2.06398482 L14.048117,8.48239004 L13.2659151,8.48239004 C12.9439124,8.48239004 12.6825323,8.22236344 12.6808772,7.90080374 C12.6806605,7.90096172 12.6804438,7.90111968 12.6802271,7.90127761 C12.129539,8.30399226 11.448805,8.54305395 10.7134839,8.54305395 C8.87197018,8.54305395 7.37885092,7.05092395 7.37885092,5.21063028 C7.37885092,3.37033661 8.87197018,1.87820661 10.7134839,1.87820661 C11.448805,1.87820661 12.129539,2.1172683 12.6802271,2.51998295 C12.6804412,2.52013896 12.6806552,2.520295 12.6808693,2.52045106 Z M7.02456422,0 L7.02456422,0.20809598 C7.02456422,0.596210225 6.97270642,0.913087295 6.72048165,1.28483624 L6.68997706,1.31965261 C6.63490826,1.38206536 6.50566514,1.52871125 6.44417431,1.60829152 L2.05488532,7.11746011 L7.02456422,7.11746011 L7.02456422,7.89737882 C7.02456422,8.22051321 6.76238532,8.48235796 6.4390367,8.48235796 L0,8.48235796 L0,8.11462011 C0,7.66425356 0.11190367,7.46337756 0.253348624,7.25399803 L4.93243119,1.46244785 L0.195068807,1.46244785 L0.195068807,0 L7.02456422,0 Z M15.7064427,8.48239004 C15.4375206,8.48239004 15.2188509,8.2638652 15.2188509,7.9952818 L15.2188509,3.20888173e-05 L16.6824289,3.20888173e-05 L16.6824289,8.48239004 L15.7064427,8.48239004 Z M21.0096009,1.83801536 C22.8639587,1.83801536 24.366711,3.34137645 24.366711,5.19290121 C24.366711,7.04603041 22.8639587,8.54939149 21.0096009,8.54939149 C19.1552431,8.54939149 17.6524908,7.04603041 17.6524908,5.19290121 C17.6524908,3.34137645 19.1552431,1.83801536 21.0096009,1.83801536 Z M10.7134839,7.17125701 C11.7971995,7.17125701 12.6754106,6.29362786 12.6754106,5.21063028 C12.6754106,4.12923714 11.7971995,3.25160799 10.7134839,3.25160799 C9.62976835,3.25160799 8.75155734,4.12923714 8.75155734,5.21063028 C8.75155734,6.29362786 9.62976835,7.17125701 10.7134839,7.17125701 Z M21.0096009,7.16796791 C22.0997385,7.16796791 22.9843716,6.283921 22.9843716,5.19290121 C22.9843716,4.10348586 22.0997385,3.21959939 21.0096009,3.21959939 C19.9178578,3.21959939 19.0348303,4.10348586 19.0348303,5.19290121 C19.0348303,6.283921 19.9178578,7.16796791 21.0096009,7.16796791 Z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Viber',
                  href: `viber://call?number=${viberIntl}`, target: '_self',
                  bg: 'linear-gradient(145deg,#5B4DD4,#7360F2)', shadow: 'rgba(115,96,242,0.45)',
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                      <path d="M11.4 1C6.64 1.05 2.27 4.9 2.01 9.65c-.14 2.55.64 4.94 2.07 6.8L2.05 22l5.81-1.94c1.54.8 3.27 1.23 5.1 1.2 5.23-.1 9.44-4.38 9.44-9.63C22.4 6.02 17.42.96 11.4 1zm5.26 13.26c-.26.69-1.52 1.35-2.07 1.39-.53.04-1.04.23-3.5-.73-2.96-1.16-4.86-4.17-5.01-4.36-.14-.19-1.19-1.58-1.19-3.02S5.61 5.6 6.07 5.1c.45-.5.98-.63 1.31-.64.33 0 .65 0 .93.01.3.01.7-.11 1.09.84.4.97 1.36 3.35 1.48 3.59.12.24.2.52.04.84-.16.32-.24.52-.48.8-.24.28-.5.62-.72.83-.24.23-.49.48-.21.94.28.46 1.24 2.05 2.67 3.32 1.83 1.63 3.38 2.14 3.86 2.38.47.24.75.2 1.03-.12.28-.32 1.19-1.39 1.51-1.87.32-.47.64-.39 1.08-.24.44.16 2.79 1.32 3.27 1.56.47.24.79.36.91.56.11.2.11 1.14-.15 1.83z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Facebook',
                  href: facebookUrl, target: '_blank',
                  bg: 'linear-gradient(145deg,#0057E0,#0084FF)', shadow: 'rgba(0,132,255,0.45)',
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1.007 12.463l-2.55-2.719-4.97 2.719 5.467-5.79 2.612 2.719 4.907-2.719-5.466 5.79z"/>
                    </svg>
                  ),
                },
                {
                  label: 'WhatsApp',
                  href: `https://wa.me/${waPhone}`, target: '_blank',
                  bg: 'linear-gradient(145deg,#128C7E,#25D366)', shadow: 'rgba(37,211,102,0.45)',
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                      <path d="M12.004 2a9.997 9.997 0 00-8.329 15.528L2 22l4.588-1.471A9.971 9.971 0 0012.004 22C17.527 22 22 17.523 22 12S17.527 2 12.004 2zm0 18a7.995 7.995 0 01-4.33-1.27l-.31-.189-3.206.84.853-3.118-.202-.319A7.995 7.995 0 014 12c0-4.41 3.594-8 8.004-8C16.41 4 20 7.59 20 12s-3.59 8-7.996 8zm4.386-5.618c-.22-.11-1.321-.65-1.526-.725-.205-.075-.354-.112-.503.112-.149.224-.577.724-.707.873-.13.15-.26.168-.48.056-.22-.112-.93-.344-1.771-1.095-.654-.585-1.096-1.308-1.225-1.528-.129-.22-.014-.339.097-.448.1-.099.22-.26.33-.39.11-.13.147-.224.22-.373.074-.15.037-.281-.018-.39-.056-.112-.503-1.213-.69-1.661-.181-.436-.366-.377-.503-.384h-.43c-.148 0-.39.056-.595.28-.205.224-.782.765-.782 1.865s.801 2.164.913 2.314c.112.149 1.578 2.41 3.824 3.38.534.23.951.368 1.276.472.536.17 1.024.146 1.41.089.43-.064 1.321-.54 1.508-1.06.187-.52.187-.967.13-1.06-.055-.094-.204-.15-.43-.262z"/>
                    </svg>
                  ),
                },
                {
                  label: 'WeChat',
                  href: 'weixin://', target: '_self',
                  bg: 'linear-gradient(145deg,#07A859,#1AAD19)', shadow: 'rgba(26,173,25,0.45)',
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                      <path d="M9.5 3C5.91 3 3 5.69 3 9c0 1.89.97 3.56 2.5 4.68V16l2.5-1.27c.63.17 1.3.27 2 .27.16 0 .32-.01.47-.02A5.98 5.98 0 009.5 13c0-3.31 2.91-6 6.5-6 .1 0 .19 0 .28.01C15.4 4.62 12.62 3 9.5 3zM8 6.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 3.5c-2.76 0-5 2.01-5 4.5S13.24 19 16 19c.69 0 1.36-.14 1.96-.38L21 20v-2.31A4.49 4.49 0 0021 14.5C21 12.01 18.76 10 16 10zm-1.5 3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                    </svg>
                  ),
                },
              ] as { label: string; href: string; target: string; bg: string; shadow: string; ripple?: boolean; icon: React.ReactNode }[]).map(({ label, href, target, bg, shadow, ripple, icon }) => (
                <a key={label} href={href} target={target} rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, touchAction: 'manipulation' }}
                  className="active:scale-95"
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: bg,
                    boxShadow: `0 3px 10px ${shadow}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'filter 0.15s ease',
                    animation: ripple ? 'adv-call-ripple 1.8s ease-out infinite' : undefined,
                  }}
                    className="hover:brightness-110"
                  >{icon}</div>
                  <span style={{ fontSize: 8.5, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1, whiteSpace: 'nowrap', textAlign: 'center' }}>{label}</span>
                </a>
              ))}
            </div>
          </div>

          {!result ? (
            <>
              {/* Progress */}
              <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 99,
                    background: i <= step ? '#ef4444' : '#ebebeb',
                    opacity: i < step ? 0.3 : 1,
                    transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>

              <div style={{ fontSize: 10.5, color: '#bbb', marginBottom: 8, fontWeight: 600, letterSpacing: '0.06em' }}>
                CÂU {step + 1} / {STEPS.length}
              </div>

              <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 13, lineHeight: 1.5 }}>
                {STEPS[step].q}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {STEPS[step].options.map(opt => {
                  const IconFn = Icons[opt.icon];
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleOption(opt.value)}
                      style={{
                        padding: '11px 10px', background: '#fff',
                        border: '1.5px solid #eee', borderRadius: 12, cursor: 'pointer',
                        textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#1a1a1a',
                        transition: 'border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
                        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 7,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = opt.color;
                        e.currentTarget.style.background = opt.bg;
                        e.currentTarget.style.boxShadow = `0 2px 10px ${opt.color}20`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#eee';
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span style={{
                        width: 30, height: 30, borderRadius: 8, background: opt.bg,
                        border: `1px solid ${opt.color}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {IconFn(opt.color)}
                      </span>
                      <span style={{ lineHeight: 1.4 }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {step > 0 && (
                <button
                  onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}
                  style={{
                    marginTop: 14, background: 'none', border: 'none',
                    color: '#bbb', fontSize: 12.5, cursor: 'pointer', padding: '6px 0',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Quay lại
                </button>
              )}
            </>
          ) : (
            <div style={{ animation: 'ldvFadeIn 0.3s ease' }}>
              {/* Result card */}
              <div style={{
                background: result.bg, border: `1.5px solid ${result.color}22`,
                borderRadius: 18, padding: '18px 18px 20px', marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 13 }}>
                  <span style={{
                    width: 46, height: 46, borderRadius: 13, background: '#fff',
                    border: `1px solid ${result.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: `0 2px 10px ${result.color}18`,
                  }}>
                    {Icons[result.icon](result.color)}
                  </span>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', background: result.color, color: '#fff',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                    padding: '4px 11px', borderRadius: 99, textTransform: 'uppercase',
                  }}>
                    {result.tag}
                  </div>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.3 }}>
                  {result.title}
                </div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
                  {result.desc}
                </div>
              </div>

              <a href={result.href} onClick={handleClose} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'linear-gradient(135deg, #1e8a4a, #104e2e)',
                color: '#fff', fontWeight: 700, fontSize: 14,
                padding: '14px', borderRadius: 14, textDecoration: 'none', marginBottom: 10,
                boxShadow: '0 4px 18px rgba(16,78,46,0.3)',
              }}>
                {result.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>

              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <a href="tel:0989778247" style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: '#f0faf4', border: '1.5px solid #d1ead9',
                  color: '#104e2e', fontWeight: 600, fontSize: 13,
                  padding: '11px 8px', borderRadius: 12, textDecoration: 'none',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                  Gọi ngay
                </a>
                <a href="https://maps.app.goo.gl/DruEuHKSSHgmW8kk7" target="_blank" rel="noopener noreferrer" style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: '#f5f5f5', border: '1.5px solid #e8e8e8',
                  color: '#444', fontWeight: 600, fontSize: 13,
                  padding: '11px 8px', borderRadius: 12, textDecoration: 'none',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Đường đi
                </a>
              </div>

              {/* Lead capture form */}
              {leadStatus === 'success' ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#f0faf4', border: '1.5px solid #c3e6ce',
                  borderRadius: 14, padding: '13px 16px', marginBottom: 10,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#1e8a4a,#104e2e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#104e2e', lineHeight: 1.3 }}>Đã nhận thông tin!</div>
                    <div style={{ fontSize: 11.5, color: '#4a7c5e', marginTop: 2, lineHeight: 1.4 }}>Chuyên viên sẽ liên hệ bạn sớm nhất.</div>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 14, padding: '13px 14px', marginBottom: 10 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: '#555', marginBottom: 10, lineHeight: 1.4 }}>
                    Để chuyên viên gọi lại tư vấn thêm:
                  </div>
                  <div style={{ display: 'flex', gap: 7, marginBottom: 8 }}>
                    <input
                      type="text" placeholder="Họ tên" value={leadName} onChange={e => setLeadName(e.target.value)}
                      style={{ flex: 1, fontSize: 13, padding: '9px 11px', borderRadius: 10, border: '1.5px solid #e0e0e0', outline: 'none', background: '#fff', color: '#111', fontFamily: 'inherit' }}
                    />
                    <input
                      type="tel" placeholder="Số điện thoại" value={leadPhone} onChange={e => setLeadPhone(e.target.value)}
                      style={{ flex: 1, fontSize: 13, padding: '9px 11px', borderRadius: 10, border: '1.5px solid #e0e0e0', outline: 'none', background: '#fff', color: '#111', fontFamily: 'inherit' }}
                    />
                  </div>
                  <button
                    disabled={leadStatus === 'loading' || !leadName.trim() || !leadPhone.trim()}
                    onClick={async () => {
                      if (!leadName.trim() || !leadPhone.trim()) return;
                      setLeadStatus('loading');
                      try {
                        await fetch('/api/advisor-lead', {
                          method: 'POST', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: leadName.trim(), phone: leadPhone.trim(), answers, result_title: result?.title ?? '' }),
                        });
                        setLeadStatus('success');
                      } catch { setLeadStatus('idle'); }
                    }}
                    style={{
                      width: '100%',
                      background: leadStatus === 'loading' || !leadName.trim() || !leadPhone.trim() ? '#e0e0e0' : 'linear-gradient(135deg,#1e8a4a,#104e2e)',
                      color: leadStatus === 'loading' || !leadName.trim() || !leadPhone.trim() ? '#aaa' : '#fff',
                      border: 'none', borderRadius: 10, padding: '10px',
                      fontSize: 13, fontWeight: 700, cursor: leadStatus === 'loading' ? 'wait' : 'pointer',
                      transition: 'all 0.2s ease', fontFamily: 'inherit',
                    }}
                  >
                    {leadStatus === 'loading' ? 'Đang gửi...' : 'Gửi thông tin'}
                  </button>
                </div>
              )}

              <button onClick={reset} style={{
                display: 'flex', width: '100%', background: 'transparent', border: 'none',
                color: '#bbb', fontSize: 12.5, cursor: 'pointer', padding: '6px',
                justifyContent: 'center', alignItems: 'center', gap: 4,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Làm lại từ đầu
              </button>
            </div>
          )}
          </>)}
          {/* end quiz tab */}

        </div>
      </div>

      <style>{`
        @keyframes ldvDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
