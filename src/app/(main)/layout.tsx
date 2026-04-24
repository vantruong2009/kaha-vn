import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import { QuickViewProvider } from '@/context/QuickViewContext';
import QuickViewSheet from '@/components/QuickViewSheet';
import Header from '@/components/Header';
import HeaderSpacer from '@/components/HeaderSpacer';
import Footer from '@/components/Footer';
import ZaloQRFloat from '@/components/ZaloQRFloat';
import type { ZaloQRSettings } from '@/components/ZaloQRFloat';
import { LanternAdvisorTrigger } from '@/components/LanternAdvisor';
import type { AdvisorTriggerSettings } from '@/components/LanternAdvisor';
import MobileBottomNav from '@/components/MobileBottomNav';
import ContactPopup from '@/components/ContactPopup';
import type { PopupSettings } from '@/components/ContactPopup';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import ScrollToTopOnNav from '@/components/ScrollToTopOnNav';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import FxInit from '@/components/FxInit';
import { parseJSON, SETTINGS_DEFAULTS } from '@/lib/site-settings';
import { getSettings } from '@/lib/site-settings-server';
import type { NavItem, LinkItem, MegaMenuItemSetting, SecondaryNavItemSetting, FooterNavRow, MobileBottomNavItem } from '@/lib/site-settings';
import type { ReactNode } from 'react';

export const revalidate = 86400;

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  const productCardAddStyle = settings.product_card_add_style || SETTINGS_DEFAULTS.product_card_add_style;
  const productCardVars = (() => {
    switch (productCardAddStyle) {
      case 'ivory-outline':
        return {
          '--pc-add-bg': '#FFF8EE',
          '--pc-add-border': '1px solid rgba(16,78,46,0.25)',
          '--pc-add-shadow': '0 1px 4px rgba(0,0,0,0.08)',
          '--pc-add-icon': '#104e2e',
        } as const;
      case 'pill-micro':
        return {
          '--pc-add-bg': '#104e2e',
          '--pc-add-border': '1px solid rgba(255,255,255,0.28)',
          '--pc-add-shadow': 'inset 0 1px 0 rgba(255,255,255,0.28), 0 1px 5px rgba(16,78,46,0.35)',
          '--pc-add-icon': '#ffffff',
        } as const;
      default:
        return {
          '--pc-add-bg': '#0f4b2c',
          '--pc-add-border': '1px solid rgba(255,255,255,0.32)',
          '--pc-add-shadow': 'inset 0 1px 0 rgba(255,255,255,0.26), 0 2px 7px rgba(16,78,46,0.3)',
          '--pc-add-icon': '#ffffff',
        } as const;
    }
  })();

  const topbarMessages = settings.topbar_enabled !== 'false' ? [
    { text: settings.topbar_msg_1, href: settings.topbar_url_1 },
    { text: settings.topbar_msg_2, href: settings.topbar_url_2 },
    { text: settings.topbar_msg_3, href: settings.topbar_url_3 },
    { text: settings.topbar_msg_4, href: settings.topbar_url_4 },
  ].filter(m => m.text) : [];

  const navItems = parseJSON<NavItem[]>(settings.nav_items, parseJSON<NavItem[]>(SETTINGS_DEFAULTS.nav_items, [])).filter((item: NavItem) => item.label?.trim());

  const megaProducts = parseJSON<MegaMenuItemSetting[]>(settings.menu_products, parseJSON<MegaMenuItemSetting[]>(SETTINGS_DEFAULTS.menu_products, []));
  const megaRooms = parseJSON<MegaMenuItemSetting[]>(settings.menu_rooms, parseJSON<MegaMenuItemSetting[]>(SETTINGS_DEFAULTS.menu_rooms, []));
  const secondaryNavItems = parseJSON<SecondaryNavItemSetting[]>(settings.secondary_nav, parseJSON<SecondaryNavItemSetting[]>(SETTINGS_DEFAULTS.secondary_nav, []));
  const searchPlaceholder = settings.search_placeholder || SETTINGS_DEFAULTS.search_placeholder;
  const searchQuickCats = parseJSON<{ label: string; href: string; badge?: string | null }[]>(settings.search_quick_categories, parseJSON<{ label: string; href: string; badge?: string | null }[]>(SETTINGS_DEFAULTS.search_quick_categories, []));
  const searchTotalLabel = settings.search_total_label || SETTINGS_DEFAULTS.search_total_label;
  const logoSrc = settings.store_logo || SETTINGS_DEFAULTS.store_logo;
  const logoAlt = settings.store_logo_alt || SETTINGS_DEFAULTS.store_logo_alt;
  const mobileBottomNav = parseJSON<MobileBottomNavItem[]>(settings.mobile_bottom_nav, parseJSON<MobileBottomNavItem[]>(SETTINGS_DEFAULTS.mobile_bottom_nav, []));

  const menuImages = {
    hoian:       settings.menu_img_hoian      || SETTINGS_DEFAULTS.menu_img_hoian,
    tet:         settings.menu_img_tet        || SETTINGS_DEFAULTS.menu_img_tet,
    tre:         settings.menu_img_tre        || SETTINGS_DEFAULTS.menu_img_tre,
    vai:         settings.menu_img_vai        || SETTINGS_DEFAULTS.menu_img_vai,
    go:          settings.menu_img_go         || SETTINGS_DEFAULTS.menu_img_go,
    ve_tranh:    settings.menu_img_ve_tranh   || SETTINGS_DEFAULTS.menu_img_ve_tranh,
    nhat:        settings.menu_img_nhat       || SETTINGS_DEFAULTS.menu_img_nhat,
    san:         settings.menu_img_san        || SETTINGS_DEFAULTS.menu_img_san,
    bedroom:     settings.menu_img_bedroom    || SETTINGS_DEFAULTS.menu_img_bedroom,
    dining:      settings.menu_img_dining     || SETTINGS_DEFAULTS.menu_img_dining,
    cafe:        settings.menu_img_cafe       || SETTINGS_DEFAULTS.menu_img_cafe,
    resort:      settings.menu_img_resort     || SETTINGS_DEFAULTS.menu_img_resort,
    tuong:       settings.menu_img_tuong      || SETTINGS_DEFAULTS.menu_img_tuong,
    ngoai_troi:  settings.menu_img_ngoai_troi || SETTINGS_DEFAULTS.menu_img_ngoai_troi,
    nha_hang:    settings.menu_img_nha_hang   || SETTINGS_DEFAULTS.menu_img_nha_hang,
    tha_tran:    settings.menu_img_tha_tran   || SETTINGS_DEFAULTS.menu_img_tha_tran,
  };

  const footerSettings = {
    phone: settings.store_phone,
    email: settings.store_email,
    address: settings.store_address,
    facebook_url: settings.facebook_url,
    instagram_url: settings.instagram_url,
    tiktok_url: settings.tiktok_url,
    youtube_url: settings.youtube_url,
    col2Links: parseJSON<LinkItem[]>(settings.footer_col2_links, parseJSON<LinkItem[]>(SETTINGS_DEFAULTS.footer_col2_links, [])),
    col3Links: parseJSON<LinkItem[]>(settings.footer_col3_links, parseJSON<LinkItem[]>(SETTINGS_DEFAULTS.footer_col3_links, [])),
    bottomLinks: parseJSON<LinkItem[]>(settings.footer_bottom_links, parseJSON<LinkItem[]>(SETTINGS_DEFAULTS.footer_bottom_links, [])),
    copyright: settings.footer_copyright || SETTINGS_DEFAULTS.footer_copyright,
    navRows: parseJSON<FooterNavRow[]>(settings.footer_nav_rows, parseJSON<FooterNavRow[]>(SETTINGS_DEFAULTS.footer_nav_rows, [])),
    ticker: parseJSON<string[]>(settings.footer_ticker, parseJSON<string[]>(SETTINGS_DEFAULTS.footer_ticker, [])),
    mapsUrl: settings.footer_maps_url || SETTINGS_DEFAULTS.footer_maps_url,
    legalCompanyName: settings.legal_company_name || SETTINGS_DEFAULTS.legal_company_name,
    legalTaxId: settings.legal_tax_id || SETTINGS_DEFAULTS.legal_tax_id,
    legalRegisteredAddress: settings.legal_registered_address || SETTINGS_DEFAULTS.legal_registered_address,
    newsletterTitle: settings.footer_newsletter_title || SETTINGS_DEFAULTS.footer_newsletter_title,
    newsletterSubtitle: settings.footer_newsletter_subtitle || SETTINGS_DEFAULTS.footer_newsletter_subtitle,
    newsletterDesc: settings.footer_newsletter_desc || SETTINGS_DEFAULTS.footer_newsletter_desc,
    legalLinks: parseJSON<[string, string][]>(settings.footer_legal_links || SETTINGS_DEFAULTS.footer_legal_links, parseJSON<[string, string][]>(SETTINGS_DEFAULTS.footer_legal_links, [])),
    locationLabel: settings.footer_location_label || SETTINGS_DEFAULTS.footer_location_label,
  };

  const zaloQRSettings: ZaloQRSettings = {
    enabled: settings.zalo_qr_enabled !== 'false',
    label: settings.zalo_qr_label || SETTINGS_DEFAULTS.zalo_qr_label,
    labelColor: settings.zalo_qr_label_color || SETTINGS_DEFAULTS.zalo_qr_label_color,
    labelWeight: settings.zalo_qr_label_weight || SETTINGS_DEFAULTS.zalo_qr_label_weight,
    btnColor1: settings.zalo_qr_btn_color_1 || SETTINGS_DEFAULTS.zalo_qr_btn_color_1,
    btnColor2: settings.zalo_qr_btn_color_2 || SETTINGS_DEFAULTS.zalo_qr_btn_color_2,
    btnShadow: settings.zalo_qr_btn_shadow || SETTINGS_DEFAULTS.zalo_qr_btn_shadow,
    btnEffect: (settings.zalo_qr_btn_effect || SETTINGS_DEFAULTS.zalo_qr_btn_effect) as ZaloQRSettings['btnEffect'],
    phone: settings.zalo_qr_phone || SETTINGS_DEFAULTS.zalo_qr_phone,
    img: settings.zalo_qr_img || SETTINGS_DEFAULTS.zalo_qr_img,
    size: parseInt(settings.zalo_qr_size || SETTINGS_DEFAULTS.zalo_qr_size) || 224,
    borderEffect: (settings.zalo_qr_border_effect || SETTINGS_DEFAULTS.zalo_qr_border_effect) as ZaloQRSettings['borderEffect'],
    headerLabel: settings.zalo_qr_header_label || SETTINGS_DEFAULTS.zalo_qr_header_label,
    headerSub: settings.zalo_qr_header_sub || SETTINGS_DEFAULTS.zalo_qr_header_sub,
    callPhone: settings.zalo_qr_call_phone || SETTINGS_DEFAULTS.zalo_qr_call_phone,
    viberPhone: settings.zalo_qr_viber_phone || SETTINGS_DEFAULTS.zalo_qr_viber_phone,
    facebookUrl: settings.zalo_qr_fb_url || SETTINGS_DEFAULTS.zalo_qr_fb_url,
    whatsappPhone: settings.zalo_qr_whatsapp_phone || SETTINGS_DEFAULTS.zalo_qr_whatsapp_phone,
    wechatPhone: settings.zalo_qr_wechat_phone || SETTINGS_DEFAULTS.zalo_qr_wechat_phone,
    wechatImg: settings.zalo_qr_wechat_img || SETTINGS_DEFAULTS.zalo_qr_wechat_img,
  };

  const advisorSettings: AdvisorTriggerSettings = {
    enabled: settings.advisor_enabled !== 'false',
    label: settings.advisor_label || SETTINGS_DEFAULTS.advisor_label,
    labelColor: settings.advisor_label_color || SETTINGS_DEFAULTS.advisor_label_color,
    labelWeight: settings.advisor_label_weight || SETTINGS_DEFAULTS.advisor_label_weight,
    btnColor1: settings.advisor_btn_color_1 || SETTINGS_DEFAULTS.advisor_btn_color_1,
    btnColor2: settings.advisor_btn_color_2 || SETTINGS_DEFAULTS.advisor_btn_color_2,
    btnShadow: settings.advisor_btn_shadow || SETTINGS_DEFAULTS.advisor_btn_shadow,
    btnEffect: (settings.advisor_btn_effect || SETTINGS_DEFAULTS.advisor_btn_effect) as AdvisorTriggerSettings['btnEffect'],
    mapsUrl: settings.advisor_maps_url || SETTINGS_DEFAULTS.advisor_maps_url,
    hotline: settings.advisor_hotline || SETTINGS_DEFAULTS.advisor_hotline,
    callPhone: settings.advisor_call_phone || SETTINGS_DEFAULTS.advisor_call_phone,
    subLabel: settings.advisor_sub_label || SETTINGS_DEFAULTS.advisor_sub_label,
    zaloPhone: settings.zalo_qr_phone || SETTINGS_DEFAULTS.zalo_qr_phone,
    viberPhone: settings.zalo_qr_viber_phone || SETTINGS_DEFAULTS.zalo_qr_viber_phone,
    facebookUrl: settings.zalo_qr_fb_url || SETTINGS_DEFAULTS.zalo_qr_fb_url,
    whatsappPhone: settings.zalo_qr_whatsapp_phone || SETTINGS_DEFAULTS.zalo_qr_whatsapp_phone,
    chatSalesName: settings.advisor_chat_sales_name || SETTINGS_DEFAULTS.advisor_chat_sales_name,
    chatSalesRole: settings.advisor_chat_sales_role || SETTINGS_DEFAULTS.advisor_chat_sales_role,
    chatTechName: settings.advisor_chat_tech_name || SETTINGS_DEFAULTS.advisor_chat_tech_name,
    chatTechRole: settings.advisor_chat_tech_role || SETTINGS_DEFAULTS.advisor_chat_tech_role,
    chatTeamLabel: settings.advisor_chat_team_label || SETTINGS_DEFAULTS.advisor_chat_team_label,
    chatProactiveDelay: parseInt(settings.advisor_chat_proactive_delay || SETTINGS_DEFAULTS.advisor_chat_proactive_delay) || 40000,
    chatWelcomeTitle: settings.advisor_chat_welcome_title || SETTINGS_DEFAULTS.advisor_chat_welcome_title,
    chatWelcomeSub: settings.advisor_chat_welcome_sub || SETTINGS_DEFAULTS.advisor_chat_welcome_sub,
    multilangEnabled: settings.advisor_multilang_enabled !== 'false',
    multilangMessages: settings.advisor_multilang_messages || SETTINGS_DEFAULTS.advisor_multilang_messages,
    multilangIntervalMs: parseInt(settings.advisor_multilang_interval_ms || SETTINGS_DEFAULTS.advisor_multilang_interval_ms) || 3000,
    multilangMode: (settings.advisor_multilang_mode || SETTINGS_DEFAULTS.advisor_multilang_mode) as AdvisorTriggerSettings['multilangMode'],
  };

  return (
    <CartProvider>
      <WishlistProvider>
      <ToastProvider>
      <QuickViewProvider>
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[99999] focus:bg-brand-green focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
        >
          Chuyển đến nội dung chính
        </a>
        <Header topbarMessages={topbarMessages} announcementBg={settings.announcement_bg || SETTINGS_DEFAULTS.announcement_bg} announcementInterval={parseInt(settings.announcement_interval || SETTINGS_DEFAULTS.announcement_interval) || 4000} announcementEffect={settings.announcement_effect || SETTINGS_DEFAULTS.announcement_effect} announcementShimmer={settings.announcement_shimmer !== 'false'} navItems={navItems} megaProducts={megaProducts} megaRooms={megaRooms} searchPlaceholder={searchPlaceholder} searchQuickCats={searchQuickCats} searchTotalLabel={searchTotalLabel} storePhone={settings.store_phone} storeEmail={settings.store_email} storeAddress={settings.store_address} mapsUrl={settings.footer_maps_url} menuImages={menuImages} logoSrc={logoSrc} logoAlt={logoAlt} />
        <HeaderSpacer />
        <ScrollRevealInit />
        <ScrollToTopOnNav />
        <FxInit
          cardGlow={settings.fx_card_glow !== 'false'}
          cardGlowColor={settings.fx_card_glow_color || 'rgba(26,107,60,0.18)'}
        />
        <CustomCursor
          enabled={settings.fx_cursor_enabled !== 'false'}
          color={settings.fx_cursor_color || '#1a6b3c'}
          style={(settings.fx_cursor_style as 'ring' | 'dot' | 'crosshair') || 'ring'}
        />
        {settings.fx_scroll_progress !== 'false' && (
          <ScrollProgress color={settings.fx_scroll_color || '#c9822a'} />
        )}
        <main id="main-content" className="pb-12 md:pb-0" style={productCardVars as Record<string, string>}>{children}</main>
        <Footer settings={footerSettings} />
        <ZaloQRFloat settings={zaloQRSettings} />
        <LanternAdvisorTrigger settings={advisorSettings} />
        <MobileBottomNav items={mobileBottomNav} />
        <ContactPopup settings={{
          enabled: settings.popup_enabled !== 'false',
          title: settings.popup_title || SETTINGS_DEFAULTS.popup_title,
          subtitle: settings.popup_subtitle || SETTINGS_DEFAULTS.popup_subtitle,
          responseTime: settings.popup_response_time || SETTINGS_DEFAULTS.popup_response_time,
          delayMs: parseInt(settings.popup_delay_ms || SETTINGS_DEFAULTS.popup_delay_ms) || 4000,
          zaloUrl: settings.popup_zalo_url || SETTINGS_DEFAULTS.popup_zalo_url,
          messengerUrl: settings.popup_messenger_url || SETTINGS_DEFAULTS.popup_messenger_url,
          whatsappUrl: settings.popup_whatsapp_url || SETTINGS_DEFAULTS.popup_whatsapp_url,
          email: settings.popup_email || SETTINGS_DEFAULTS.popup_email,
          mapsUrl: settings.popup_maps_url || SETTINGS_DEFAULTS.popup_maps_url,
          aiCtaText: settings.popup_ai_cta_text || SETTINGS_DEFAULTS.popup_ai_cta_text,
        } satisfies PopupSettings} />
        <QuickViewSheet />
      </QuickViewProvider>
      </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
