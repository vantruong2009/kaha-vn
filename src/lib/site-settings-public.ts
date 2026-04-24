/**
 * Dữ liệu mặc định + kiểu cài đặt site — an toàn cho client bundle (không import mã server DB).
 */

export interface NavSubItem { label: string; href: string; }
export interface NavItem { label: string; href: string; accent?: boolean; image?: string; imageAlt?: string; sub?: NavSubItem[]; }
export interface LinkItem { label: string; href: string; }
export interface ValueItem { icon: string; title: string; desc: string; link: string; }
export interface ReviewItem { stars: number; text: string; avatar: string; name: string; meta: string; borderColor: string; }
export interface ShopByGroup { title: string; links: [string, string][]; }
export interface TagItem { label: string; href: string; }
export interface FaqItem { q: string; a: string; }
export interface ArtisanItem { emoji: string; name: string; region: string; specialty: string; experience: string; story: string; }
export interface AboutValueItem { emoji: string; title: string; desc: string; }
export interface TimelineItem { year: string; event: string; }
export interface MegaMenuItemSetting { label: string; href: string; image: string; tag?: string; }
export interface CategoryBarItemSetting { label: string; href: string; sub: string; img: string; tag?: string; }
export interface SecondaryNavItemSetting { label: string; href: string; categoryId: string | null; isTet?: boolean; }
export interface FooterNavRow { cat: string; links: [string, string][]; }
export interface MobileBottomNavItem { label: string; href: string; icon: 'home' | 'search' | 'cart' | 'account' | 'wishlist' | 'category'; }
export interface CategoryShowcaseItem { href: string; img: string; label: string; sub: string; tag?: string; }
export interface ArtisanValueItem { icon: string; title: string; desc: string; }
export interface AdvisorQuestion { label: string; options: string[]; }
export interface B2bFullFeature { icon: string; title: string; desc: string; }
export interface BundleItem { name: string; desc: string; price: string; save: string; count: string; img: string; }
export interface FlashSaleProduct { name: string; price: string; old: string; remaining: number; bar: string; viewers: number; img: string; }
export interface CongTrinhProject { file: string; label: string; tag: string; }
export interface UseCaseCard { img: string; tag: string; title: string; desc: string; cta: string; href: string; }

export function parseJSON<T>(str: string, fallback: T): T {
  try { return JSON.parse(str) as T; } catch { return fallback; }
}

// ─── SiteSettings interface ───────────────────────────────────────────────────

export interface SiteSettings {
  store_name: string;
  store_logo: string;
  store_logo_alt: string;
  store_phone: string;
  store_email: string;
  store_address: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  pinterest_url: string;
  x_url: string;
  medium_url: string;
  zalo_phone: string;
  topbar_enabled: string;
  topbar_msg_1: string; topbar_url_1: string;
  topbar_msg_2: string; topbar_url_2: string;
  topbar_msg_3: string; topbar_url_3: string;
  topbar_msg_4: string; topbar_url_4: string;
  // Global SEO
  seo_site_name: string;
  seo_title_separator: string;
  seo_default_og_image: string;
  seo_google_verification: string;
  seo_fb_app_id: string;
  seo_noindex_global: string;
  // Homepage SEO
  seo_home_title: string;
  seo_home_desc: string;
  seo_home_og_title: string;
  seo_home_og_desc: string;
  seo_home_og_image: string;
  seo_home_keywords: string;
  seo_home_canonical: string;
  seo_home_schema_type: string;
  free_shipping_threshold: string;
  default_shipping_fee: string;
  hero_subtitle: string;
  hero_title: string;
  hero_desc: string;
  hero_cta_text: string;
  hero_cta_url: string;
  hero_img_1: string;
  hero_img_2: string;
  hero_img_3: string;
  hero_url_1: string;
  hero_url_2: string;
  hero_url_3: string;
  // Editorial section (homepage)
  editorial_label: string;
  editorial_title: string;
  editorial_desc: string;
  editorial_cta: string;
  editorial_cta_url: string;
  editorial_img_1: string;
  editorial_img_2: string;
  editorial_img_3: string;
  // Navigation
  nav_items: string; // JSON: NavItem[]
  // Footer
  footer_col2_links: string; // JSON: LinkItem[]
  footer_col3_links: string; // JSON: LinkItem[]
  footer_bottom_links: string; // JSON: LinkItem[]
  footer_copyright: string;
  // Homepage sections
  home_values: string;    // JSON: ValueItem[]
  home_reviews: string;   // JSON: ReviewItem[]
  home_shopby: string;    // JSON: ShopByGroup[]
  home_tags: string;      // JSON: [string, string][] (label + href pairs)
  home_b2b_1_title: string; home_b2b_1_desc: string; home_b2b_1_cta: string; home_b2b_1_url: string; home_b2b_1_img: string; home_b2b_1_img_alt: string; home_b2b_1_bg: string;
  home_b2b_2_title: string; home_b2b_2_desc: string; home_b2b_2_cta: string; home_b2b_2_url: string; home_b2b_2_img: string; home_b2b_2_img_alt: string; home_b2b_2_bg: string;
  home_b2b_store_bg: string;
  home_trust_bg: string;
  home_artisan_left_bg: string;
  home_artisan_right_bg: string;
  home_maker_title: string; home_maker_desc: string;
  home_showcase_label: string;
  home_showcase_heading: string;
  home_showcase_desc: string;
  home_bestsellers_label: string;
  home_bestsellers_heading: string;
  home_bestsellers_categories: string;   // JSON: string[] — category keys, empty = auto bestseller
  home_bestsellers_product_slugs: string; // comma-separated slugs to pin specific products
  home_spaces_label: string;
  home_spaces_heading: string;
  home_spaces_desc: string;
  home_b2b_label: string;
  home_b2b_heading: string;
  home_b2b_1_label: string;
  home_b2b_2_label: string;
  home_artisan_label: string;
  home_artisan_cta_text: string;
  home_artisan_cta_url: string;
  // About page
  about_artisans: string;   // JSON: ArtisanItem[]
  about_values: string;     // JSON: AboutValueItem[]
  about_timeline: string;   // JSON: TimelineItem[]
  // Static pages
  faq_items: string;        // JSON: FaqItem[]
  contact_faq: string;      // JSON: FaqItem[]
  about_hero_title: string;
  about_hero_subtitle: string;
  about_story: string;
  about_stat_1_number: string; about_stat_1_label: string;
  about_stat_2_number: string; about_stat_2_label: string;
  about_stat_3_number: string; about_stat_3_label: string;
  about_stat_4_number: string; about_stat_4_label: string;
  contact_phone: string;
  contact_hours: string;
  contact_email: string;
  contact_address: string;
  contact_zalo: string;
  contact_b2b_min: string;
  contact_b2b_desc: string;
  // Chi nhánh Hội An
  cn_hoian_phone: string;
  cn_hoian_address: string;
  cn_hoian_mapurl: string;
  cn_hoian_mapembed: string;
  cn_hoian_hours: string;     // JSON: {day: string, time: string}[]
  cn_hoian_features: string;  // JSON: string[]
  // Chi nhánh Hà Nội
  cn_hanoi_phone: string;
  cn_hanoi_address: string;
  cn_hanoi_mapurl: string;
  cn_hanoi_mapembed: string;
  cn_hanoi_hours: string;
  cn_hanoi_features: string;
  // Homepage — Trust Strip (5 stats, configurable)
  home_trust_s1_num: string; home_trust_s1_label: string;
  home_trust_s2_num: string; home_trust_s2_label: string;
  home_trust_s3_num: string; home_trust_s3_label: string;
  home_trust_s4_num: string; home_trust_s4_label: string;
  home_trust_s5_num: string; home_trust_s5_label: string;
  // Homepage — Spaces section (4 lifestyle photos)
  home_space_img_1: string; home_space_label_1: string; home_space_desc_1: string;
  home_space_img_2: string; home_space_label_2: string; home_space_desc_2: string;
  home_space_img_3: string; home_space_label_3: string; home_space_desc_3: string;
  home_space_img_4: string; home_space_label_4: string; home_space_desc_4: string;
  // Homepage — International trust (4 photos + captions)
  home_intl_img_1: string; home_intl_cap_1: string;
  home_intl_img_2: string; home_intl_cap_2: string;
  home_intl_img_3: string; home_intl_cap_3: string;
  home_intl_img_4: string; home_intl_cap_4: string;
  // Mega menus
  menu_products: string;  // JSON: MegaMenuItemSetting[]
  menu_rooms: string;     // JSON: MegaMenuItemSetting[]
  // Category bar
  category_bar: string;   // JSON: CategoryBarItemSetting[]
  // Secondary nav
  secondary_nav: string;  // JSON: SecondaryNavItemSetting[]
  // Search
  search_placeholder: string;
  search_quick_categories: string; // JSON: { label: string; href: string; badge?: string | null }[]
  search_total_label: string;      // e.g. "800+" or "1000+"
  // Footer nav
  footer_nav_rows: string;  // JSON: FooterNavRow[]
  footer_ticker: string;    // JSON: string[]
  footer_maps_url: string;
  // Mobile bottom nav
  mobile_bottom_nav: string;  // JSON: MobileBottomNavItem[]
  // Homepage — hardcoded sections now configurable
  home_showcase: string;       // JSON: CategoryShowcaseItem[]
  home_artisan_values: string; // JSON: ArtisanValueItem[]
  // Homepage — Flash Sale widget
  home_flash_heading: string;
  home_flash_cta_text: string;
  home_flash_cta_url: string;
  home_flash_products: string; // JSON: FlashSaleProduct[]
  // Homepage — Reviews guarantee card
  home_guarantee_title: string;
  home_guarantee_1_title: string; home_guarantee_1_sub: string;
  home_guarantee_2_title: string; home_guarantee_2_sub: string;
  home_guarantee_3_title: string; home_guarantee_3_sub: string;
  // Homepage — Artisan Story section (dark section)
  home_artisan_heading: string;
  home_artisan_body: string;
  home_artisan_stat1_num: string; home_artisan_stat1_label: string;
  home_artisan_stat2_num: string; home_artisan_stat2_label: string;
  home_artisan_stat3_num: string; home_artisan_stat3_label: string;
  home_artisan_img: string;
  // Homepage — B2B Visit Store card (card 1, dark bg)
  home_b2b_store_label: string;
  home_b2b_store_title: string;
  home_b2b_store_address: string;
  home_b2b_store_hours: string;
  home_b2b_store_display: string;
  home_b2b_store_maps_url: string;
  home_b2b_store_phone: string;
  // Reviews section
  home_reviews_rating: string;
  home_reviews_count: string;
  home_reviews_label: string;
  home_reviews_heading: string;
  home_reviews_cta_text: string;
  home_reviews_cta_url: string;
  home_showcase_cta_text: string;
  home_showcase_cta_url: string;
  home_bestsellers_cta_text: string;
  home_bestsellers_cta_url: string;
  home_artisan_stats_label: string;
  home_b2b_badge_city: string;
  home_b2b_badge_count: string;
  home_b2b_badge_ship: string;
  home_space_href_1: string;
  home_space_href_2: string;
  home_space_href_3: string;
  home_space_href_4: string;
  // Typography color system
  typo_heading_from: string;  // heading gradient start
  typo_heading_to: string;    // heading gradient end
  typo_body: string;          // primary body text
  typo_body_md: string;       // secondary body text
  typo_body_lt: string;       // muted text
  typo_link: string;          // link / button primary color
  // Legal
  legal_company_name: string;
  legal_tax_id: string;
  legal_registered_address: string;
  // Menu category images (16 images — admin-uploadable)
  menu_img_hoian: string;
  menu_img_tet: string;
  menu_img_tre: string;
  menu_img_vai: string;
  menu_img_go: string;
  menu_img_ve_tranh: string;
  menu_img_nhat: string;
  menu_img_san: string;
  menu_img_bedroom: string;
  menu_img_dining: string;
  menu_img_cafe: string;
  menu_img_resort: string;
  menu_img_tuong: string;
  menu_img_ngoai_troi: string;
  menu_img_nha_hang: string;
  menu_img_tha_tran: string;
  // Contact popup
  popup_enabled: string;
  popup_title: string;
  popup_subtitle: string;
  popup_response_time: string;
  popup_delay_ms: string;
  popup_zalo_url: string;
  popup_messenger_url: string;
  popup_whatsapp_url: string;
  popup_email: string;
  popup_maps_url: string;
  popup_ai_cta_text: string;
  // ZaloQRFloat — nút QR Zalo bên trái
  zalo_qr_enabled: string;
  zalo_qr_label: string;
  zalo_qr_label_color: string;
  zalo_qr_label_weight: string;
  zalo_qr_btn_color_1: string;
  zalo_qr_btn_color_2: string;
  zalo_qr_btn_shadow: string;
  zalo_qr_btn_effect: string;
  zalo_qr_phone: string;
  zalo_qr_img: string;
  zalo_qr_size: string;
  zalo_qr_border_effect: string;
  zalo_qr_header_label: string;
  zalo_qr_header_sub: string;
  zalo_qr_call_phone: string;
  zalo_qr_viber_phone: string;
  zalo_qr_fb_url: string;
  zalo_qr_whatsapp_phone: string;
  zalo_qr_wechat_phone: string;
  zalo_qr_wechat_img: string;
  // FloatingButtons — nút Chat xanh bên phải
  float_enabled: string;
  float_label: string;
  float_label_color: string;
  float_label_weight: string;
  float_btn_color_1: string;
  float_btn_color_2: string;
  float_btn_effect: string;
  float_zalo_url: string;
  float_zalo_label: string;
  float_whatsapp_url: string;
  float_whatsapp_label: string;
  float_viber_url: string;
  float_viber_label: string;
  float_messenger_url: string;
  float_messenger_label: string;
  float_phone: string;
  float_phone_label: string;
  float_phone_effect: string;
  // LanternAdvisorTrigger — nút đỏ "Tư vấn chọn đèn"
  advisor_enabled: string;
  advisor_label: string;
  advisor_label_color: string;
  advisor_label_weight: string;
  advisor_btn_color_1: string;
  advisor_btn_color_2: string;
  advisor_btn_shadow: string;
  advisor_btn_effect: string;
  advisor_maps_url: string;
  advisor_hotline: string;
  advisor_call_phone: string;
  advisor_sub_label: string;
  // AI Chat personas
  advisor_chat_sales_name: string;
  advisor_chat_sales_role: string;
  advisor_chat_tech_name: string;
  advisor_chat_tech_role: string;
  advisor_chat_team_label: string;
  advisor_chat_proactive_delay: string;
  advisor_chat_welcome_title: string;
  advisor_chat_welcome_sub: string;
  advisor_multilang_enabled: string;
  advisor_multilang_messages: string;
  advisor_multilang_interval_ms: string;
  advisor_multilang_mode: string;
  // Homepage — Nhà thiết kế ảo (Room Advisor quiz)
  home_advisor_label: string;
  home_advisor_heading: string;
  home_advisor_desc: string;
  home_advisor_questions: string;  // JSON: AdvisorQuestion[]
  // Homepage — Blog nổi bật (3 latest posts)
  home_blog_label: string;
  home_blog_heading: string;
  home_blog_cta_text: string;
  home_blog_cta_url: string;
  home_blog_slug_1: string;
  home_blog_slug_2: string;
  home_blog_slug_3: string;
  home_blog_slug_4: string;
  home_blog_slug_5: string;
  home_blog_slug_6: string;
  // Homepage — B2B Full Section 2-col (replaces 3-card layout)
  home_b2b_full_label: string;
  home_b2b_full_heading: string;
  home_b2b_full_desc: string;
  home_b2b_full_img: string;        // 800×600px recommended
  home_b2b_full_img_alt: string;
  home_b2b_full_cta: string;
  home_b2b_full_cta_url: string;
  home_b2b_full_features: string;   // JSON: B2bFullFeature[]
  home_b2b_full_discount_pct: string;
  home_b2b_full_discount_label: string;
  // Homepage — Use Cases section
  home_use_cases_label: string;
  home_use_cases_heading: string;
  home_use_cases_desc: string;
  home_use_cases_cta_text: string;
  home_use_cases_cta_url: string;
  home_use_cases: string;           // JSON: UseCaseCard[]
  // Homepage — Newsletter section
  home_newsletter_label: string;
  home_newsletter_heading: string;
  home_newsletter_desc: string;
  home_newsletter_footnote: string;
  // Hiệu ứng giao diện (FX)
  fx_cursor_enabled: string;        // 'true' | 'false'
  fx_cursor_color: string;          // hex color
  fx_cursor_style: string;          // 'ring' | 'dot' | 'crosshair'
  fx_scroll_progress: string;       // 'true' | 'false'
  fx_scroll_color: string;          // hex color
  fx_card_glow: string;             // 'true' | 'false'
  fx_card_glow_color: string;       // rgba color
  // Homepage — Bundle section "Bộ đôi hoàn hảo"
  home_bundles: string;             // JSON: BundleItem[]
  // Homepage — Bundle section heading/CTA
  home_bundles_label: string;
  home_bundles_heading: string;
  home_bundles_desc: string;
  home_bundles_cta_text: string;
  home_bundles_cta_url: string;
  // Homepage — Hero brand promise badges (4 badges)
  home_hero_badge_1_title: string; home_hero_badge_1_sub: string;
  home_hero_badge_2_title: string; home_hero_badge_2_sub: string;
  home_hero_badge_3_title: string; home_hero_badge_3_sub: string;
  home_hero_badge_4_title: string; home_hero_badge_4_sub: string;
  // Footer — Newsletter
  footer_newsletter_title: string;
  footer_newsletter_subtitle: string;
  footer_newsletter_desc: string;
  // Footer — Location label (card "Xem bản đồ")
  footer_location_label: string;
  // Footer — Legal links (legal bar)
  footer_legal_links: string;       // JSON: [string, string][]
  // Announcement bar
  announcement_bg: string;
  announcement_interval: string;
  announcement_effect: string;
  announcement_shimmer: string;
  // Product card add button style
  product_card_add_style: string;
  // Homepage — Section visibility manager
  home_sections_config: string;     // JSON: Record<string, boolean>
  // Homepage — Logo Marquee (brands strip)
  home_marquee_label: string;
  home_marquee_brands: string;      // JSON: string[]
  // Homepage — Công trình thực tế (portfolio gallery)
  home_congtrinh_label: string;
  home_congtrinh_heading: string;
  home_congtrinh_desc: string;
  home_congtrinh_stat1_num: string; home_congtrinh_stat1_label: string;
  home_congtrinh_stat2_num: string; home_congtrinh_stat2_label: string;
  home_congtrinh_cta_text: string;
  home_congtrinh_cta_phone: string;
  home_congtrinh_projects: string;  // JSON: CongTrinhProject[]
}

// ─── Default values ───────────────────────────────────────────────────────────

export const SETTINGS_DEFAULTS: SiteSettings = {
  store_name: 'KAHA®',
  store_logo: '/logo.webp',
  store_logo_alt: 'KAHA — Đèn Vải Trang Trí & Chụp Đèn Khách Sạn Cao Cấp',
  store_phone: '09368.766.79',
  store_email: 'hi@kaha.vn',
  store_address: '262/1/93 Phan Anh, Phường Phú Thạnh, TP.HCM',
  facebook_url: '',
  instagram_url: '',
  tiktok_url: '',
  youtube_url: '',
  pinterest_url: '',
  x_url: '',
  medium_url: '',
  zalo_phone: '0936876679',
  topbar_enabled: 'true',
  topbar_msg_1: 'KAHA · Xưởng gia công đèn vải cao cấp theo bản vẽ dự án',
  topbar_url_1: '/showroom',
  topbar_msg_2: 'Phản hồi RFQ trong 48h · Mẫu thử 7–10 ngày làm việc',
  topbar_url_2: '/showroom',
  topbar_msg_3: 'Nhận gia công từ 20 chiếc trở lên · Giao theo tiến độ công trình',
  topbar_url_3: '/shop',
  topbar_msg_4: 'Bảo hành khung 12 tháng · Hỗ trợ kỹ thuật lắp đặt',
  topbar_url_4: '/showroom',
  // Global SEO
  seo_site_name: 'KAHA® — Đèn Vải Trang Trí & Chụp Đèn Khách Sạn Cao Cấp',
  seo_title_separator: ' | ',
  seo_default_og_image: '',
  seo_google_verification: '',
  seo_fb_app_id: '',
  seo_noindex_global: 'false',
  // Homepage SEO
  seo_home_title: 'Đèn Vải Trang Trí & Chụp Đèn Khách Sạn Cao Cấp | KAHA®',
  seo_home_desc: 'Xưởng gia công đèn vải cao cấp, chụp đèn khách sạn — đặt theo yêu cầu từ 20 chiếc, in logo thương hiệu. Gần 500 mẫu, giao toàn quốc. Hotline 09368.766.79.',
  seo_home_og_title: 'KAHA® — Đèn Vải Trang Trí & Chụp Đèn Khách Sạn Cao Cấp',
  seo_home_og_desc: 'Thương hiệu luxury của đèn vải trang trí nội thất và chụp đèn cho khách sạn, nhà hàng, resort. Đặt làm theo yêu cầu tại TP.HCM, giao 63 tỉnh.',
  seo_home_og_image: '',
  seo_home_keywords: 'đèn vải cao cấp, chụp đèn khách sạn',
  seo_home_canonical: '',
  seo_home_schema_type: 'WebSite',
  free_shipping_threshold: '500000',
  default_shipping_fee: '30000',
  hero_subtitle: 'Xưởng gia công đèn vải & lồng đèn Hội An',
  hero_title: 'Đặt theo yêu cầu — giao toàn quốc',
  hero_desc: 'Ánh sáng thủ công được tinh chỉnh theo từng chất liệu và tông màu nội thất, giúp không gian ấm hơn, có chiều sâu hơn, lên ảnh cũng đẹp hơn. Nhận làm theo kích thước riêng và in nhận diện thương hiệu từ 20 chiếc.',
  hero_cta_text: 'Xem mẫu đèn vải & lồng đèn',
  hero_cta_url: '/c/hoi-an-lantern',
  hero_img_1: 'https://pub-7dd4b253eab247ec8796a6d6eb72dce7.r2.dev/1773667037587_den-hoi-an-2121.webp',
  hero_img_2: 'https://pub-7dd4b253eab247ec8796a6d6eb72dce7.r2.dev/1773742259200_den-vai-9912.webp',
  hero_img_3: 'https://pub-7dd4b253eab247ec8796a6d6eb72dce7.r2.dev/1773760092221_den-nhat-ban-home1.webp',
  hero_url_1: '/c/hoi-an-lantern',
  hero_url_2: '/c/gia-cong-den-trang-tri',
  hero_url_3: '/c/den-nhat-ban',
  // Editorial section (homepage)
  editorial_label: 'Gia công đèn vải theo yêu cầu',
  editorial_title: 'Đèn lồng in ấn theo yêu cầu - Tạo dấu ấn riêng của bạn',
  editorial_desc: 'Nâng tầm không gian với dịch vụ thiết kế và in ấn đèn lồng theo yêu cầu. Chúng tôi giúp bạn khắc họa logo, hoa văn riêng lên nền chất liệu truyền thống cao cấp, tạo nên điểm nhấn độc đáo và chuyên nghiệp cho mọi công trình.',
  editorial_cta: 'Khám phá đèn in theo yêu cầu',
  editorial_cta_url: '/c/gia-cong-den-trang-tri',
  editorial_img_1: '/images/editorial/img1.jpg',
  editorial_img_2: '/images/editorial/img2.jpg',
  editorial_img_3: '/images/editorial/img3.jpg',
  // Navigation
  nav_items: JSON.stringify([
    {"label":"Shop","href":"/shop"},
    {"label":"Journal","href":"/journal"},
    {"label":"Showroom","href":"/showroom"},
    {"label":"Lookbook","href":"/lookbook"},
    {"label":"Moodboard","href":"/moodboard"}
  ]),
  // Footer
  footer_col2_links: JSON.stringify([
    {"label":"Câu chuyện thương hiệu","href":"/ve-chung-toi"},
    {"label":"Xưởng sản xuất","href":"/cn-hoi-an"},
    {"label":"Đặt hàng sỉ","href":"/lien-he"},
    {"label":"Blog & tin tức","href":"/blog"}
  ]),
  footer_col3_links: JSON.stringify([
    {"label":"Theo dõi đơn hàng","href":"/theo-doi-don-hang"},
    {"label":"Chính sách đổi trả","href":"/chinh-sach-doi-tra"},
    {"label":"Chính sách vận chuyển","href":"/chinh-sach-van-chuyen"},
    {"label":"Câu hỏi thường gặp","href":"/hoi-dap"},
    {"label":"Hỗ trợ khách hàng","href":"/ho-tro"}
  ]),
  footer_bottom_links: JSON.stringify([
    {"label":"Điều khoản sử dụng","href":"/dieu-khoan"},
    {"label":"Chính sách bảo mật","href":"/chinh-sach-bao-mat"},
    {"label":"Chính sách vận chuyển","href":"/chinh-sach-van-chuyen"},
    {"label":"Chính sách đổi trả","href":"/chinh-sach-doi-tra"}
  ]),
  footer_copyright: '© 2026 KAHA®. Bảo lưu mọi quyền.',
  // Homepage sections
  home_values: JSON.stringify([
    {"icon":"handcraft","title":"Nghệ nhân độc lập","desc":"Hợp tác trực tiếp với 15+ nghệ nhân làng nghề","link":"/ve-chung-toi"},
    {"icon":"lantern","title":"200+ mẫu độc quyền","desc":"Thiết kế không nơi nào khác có","link":"/san-pham"},
    {"icon":"flag","title":"Made in Vietnam","desc":"Sản xuất 100% tại Việt Nam từ vật liệu bản địa","link":"/ve-chung-toi"},
    {"icon":"truck","title":"Giao toàn quốc","desc":"Miễn phí đơn từ 500k · Đóng gói cẩn thận","link":"/chinh-sach-van-chuyen"},
    {"icon":"return","title":"Đổi trả dễ dàng","desc":"Đổi trả trong 7 ngày nếu không hài lòng","link":"/chinh-sach-doi-tra"},
    {"icon":"chat","title":"Hỗ trợ tận tâm","desc":"8:00–21:00 mỗi ngày qua Zalo, Messenger","link":"/lien-he"}
  ]),
  home_reviews: JSON.stringify([
    {"stars":5,"text":"Mình mở quán được hơn 1 năm, hồi đầu treo đèn mua ở chợ Bình Tây nhìn cũng tạm. Đến khi đổi sang bên này thì khách bắt đầu chụp hình nhiều hơn hẳn, có mấy bạn còn hỏi mua riêng nữa. Lần này vừa đặt thêm 15 cái cho khu vực ngoài sân, chờ về xem sao.","avatar":"","name":"Ngọc Trâm","meta":"Chủ quán Mây Tre Café · Bình Dương"},
    {"stars":5,"text":"Thật ra ban đầu mình phân vân lắm vì giá cao hơn mấy chỗ khác một chút. Nhắn hỏi bên shop khá lâu, bạn tư vấn cũng kiên nhẫn chứ không hối. Cuối cùng chọn 2 cái vải lụa đỏ tặng anh chị đang ở bên Đức. Anh chị nhắn lại bảo đẹp hơn mong đợi nhiều, giờ treo phòng khách luôn không cất.","avatar":"","name":"Bảo Châu","meta":"Khách hàng · Hà Nội"},
    {"stars":4,"text":"Đây là lần thứ 3 mình mua rồi. Lần này lấy mấy cái nhỏ để bàn làm việc ở nhà. Chất lượng đều, không bị kiểu lần sau kém hơn lần đầu như nhiều nơi hay vậy. Giao hàng lần này hơi trễ hơn dự kiến 1 ngày nhưng đóng gói cẩn thận, không bị móp hay gì cả.","avatar":"","name":"Hoàng Minh","meta":"Mua lần 3 · TP.HCM"},
    {"stars":5,"text":"Resort mình vừa refurbish khu sảnh đón khách, order 40 cái đèn lồng Hội An các size. Team tư vấn nhiệt tình, gửi mẫu thực tế trước khi chốt đơn. Khi hàng về lắp lên rất đúng tone với nội thất, khách check-in liên tục. Sẽ tiếp tục hợp tác cho các dự án sau.","avatar":"","name":"Minh Khôi","meta":"Quản lý Resort · Phú Quốc"},
    {"stars":5,"text":"Mua về trang trí Tết, chọn bộ đèn lồng đỏ vải gấm. Màu đỏ rất thuần, không bị loè hay nhạt sau khi treo ngoài nắng cả tuần. Năm ngoái mua chỗ khác phai màu từ ngày mùng 3, năm nay hài lòng hơn hẳn. Chắc chắn lần sau vẫn quay lại.","avatar":"","name":"Thu Hương","meta":"Nội trợ · Cần Thơ"},
    {"stars":5,"text":"Lần đầu mua thử 5 cái đèn tre, thấy ổn nên lần 2 đặt thêm 30 cái cho toàn bộ chuỗi 3 quán. Giá sỉ hợp lý, chị bên sales báo giá nhanh và không ép. Đèn chắc chắn, không bị lỏng khung sau vài tháng dùng như hàng chợ. Đang tính lấy thêm cho cơ sở mới.","avatar":"","name":"Thanh Tùng","meta":"Chủ chuỗi F&B · Đà Nẵng"},
    {"stars":4,"text":"Mua làm quà sinh nhật bạn thân đang sống ở Nhật, chọn đèn lụa hoa sen size vừa. Đóng gói kỹ, hộp giấy cứng bên ngoài nên qua bưu điện quốc tế vẫn nguyên vẹn. Bạn mình thích lắm, bảo nhìn rất Việt Nam mà tinh tế. Trừ 1 sao vì giao hơi trễ so với dự kiến.","avatar":"","name":"Lan Anh","meta":"Khách hàng · Hà Nội"},
    {"stars":5,"text":"Bên mình tổ chức hội nghị khách hàng theo chủ đề văn hoá Việt, cần 60 đèn lồng trang trí sân khấu và bàn tiệc. Liên hệ được tư vấn ngay trong ngày, có bảng báo giá chi tiết và ảnh tham khảo cụ thể. Hàng giao đúng hẹn, nhân viên setup cũng hỗ trợ tận tình. Rất chuyên nghiệp.","avatar":"","name":"Phương Linh","meta":"Event Manager · TP.HCM"},
    {"stars":5,"text":"Mình ở Đà Lạt, quán cà phê sân vườn. Treo thử 8 cái đèn lồng Hội An ngoài hiên, tối bật đèn lên khách khen liên tục. Có bạn còn hỏi mình mua ở đâu để họ mua về nhà. Chất vải dày, không bị mưa thấm qua dù Đà Lạt hay mưa. Đúng là hàng thủ công xịn.","avatar":"","name":"Gia Bảo","meta":"Chủ quán cà phê · Đà Lạt"},
    {"stars":5,"text":"Lần thứ 2 mình quay lại mua, lần này cho đám cưới em gái. Đặt 25 cái đèn lồng hồng và trắng kết hợp. Shop tư vấn phối màu rất ổn, gửi ảnh thực tế cho xem trước. Ngày cưới ai cũng khen phần trang trí, nhiều bạn bè hỏi địa chỉ shop để mua.","avatar":"","name":"Khánh Vy","meta":"Mua lần 2 · Vũng Tàu"},
    {"stars":4,"text":"Mua lần đầu về thử, lấy 3 cái đèn tre mây treo ban công. Nhìn thực tế đẹp hơn ảnh, màu tự nhiên của tre rất ấm. Lần sau chắc lấy thêm vài cái cho phòng khách. Chỉ tiếc phần hướng dẫn treo không có kèm theo nhưng hỏi shop thì được giải thích nhanh.","avatar":"","name":"Văn Đức","meta":"Khách hàng · Huế"},
    {"stars":5,"text":"Khách sạn boutique của mình cần thay mới toàn bộ đèn trang trí hành lang. Sau khi so sánh vài nơi, chọn LongDenViet vì catalogue đa dạng và nhân viên tư vấn hiểu rõ về chất liệu. Lắp xong nhìn rất sang, khách hay chụp ảnh check-in ở đây. Đã giới thiệu thêm cho 2 khách sạn bạn bè.","avatar":"","name":"Hải Yến","meta":"Chủ khách sạn boutique · Hội An"},
    {"stars":5,"text":"Mua cho spa mới khai trương, chọn bộ đèn lụa màu vàng đất và xanh rêu treo dọc lối vào. Khách bước vào ai cũng dừng lại ngắm, mấy bạn còn xin số shop để mua về nhà. Ánh sáng xuyên qua vải lụa ấm và dịu, đúng cảm giác mình muốn tạo ra cho không gian thư giãn.","avatar":"","name":"Quỳnh Như","meta":"Chủ Spa · Nha Trang"},
    {"stars":5,"text":"Đặt 8 cái đèn lồng đỏ về treo Tết, giao nhanh hơn dự kiến 2 ngày. Hàng đóng gói cẩn thận từng cái riêng, không sợ móp hay sờn. Ba mẹ mình khen lắm, bảo nhìn đúng không khí Tết xưa hơn mấy cái nhựa mua ngoài chợ.","avatar":"","name":"Minh Trang","meta":"Nội trợ · Quảng Nam"},
    {"stars":5,"text":"Công ty mình tổ chức tiệc tất niên chủ đề Việt Nam xưa, cần đèn lồng trang trí hội trường. Liên hệ sáng, chiều đã có báo giá và ảnh mẫu. Đặt 50 cái, giao đúng deadline dù chỉ có 4 ngày. Sếp khen phần decor đẹp nhất trong các năm tổ chức.","avatar":"","name":"Trúc Linh","meta":"HR Manager · Hà Nội"},
    {"stars":5,"text":"Mua tặng sinh nhật mẹ, chọn đèn lồng hoa sen size lớn. Shop tư vấn tận tình, hỏi sở thích màu sắc của người nhận để gợi ý. Mẹ mình thích lắm, cứ bảo đẹp hơn kỳ vọng. Đóng gói có hộp quà riêng, không cần bọc thêm gì. Điểm này mình rất thích.","avatar":"","name":"Thanh Mai","meta":"Khách hàng · TP.HCM"},
    {"stars":5,"text":"Mình là nhiếp ảnh gia, mua 6 cái đèn lồng các màu để dùng làm props chụp hình. Chất lượng tốt, không bị lồi lõm hay méo khung sau nhiều lần tháo ra lắp vào. Màu sắc đa dạng, ảnh ra rất đẹp. Khách hàng của mình hay hỏi mua đèn ở đâu sau khi thấy ảnh.","avatar":"","name":"Hoàng Long","meta":"Nhiếp ảnh gia · TP.HCM"},
    {"stars":5,"text":"Thiết kế nội thất cho một penthouse ở quận 2, gia chủ yêu cầu góc Đông Dương. Đặt 12 đèn lồng vải lụa các tone trung tính, treo ở khu dining và terrace. Gia chủ hài lòng 100%, còn giới thiệu thêm 2 khách hàng khác. Shop tư vấn cũng hiểu về không gian và màu sắc, không chỉ bán theo catalog.","avatar":"","name":"Nguyên Khang","meta":"Interior Designer · TP.HCM"},
    {"stars":5,"text":"Homestay ở Đà Lạt, mình treo đèn lồng ở mọi góc từ phòng khách đến ban công. Du khách đặt phòng nhiều hơn hẳn sau khi mình đăng ảnh lên Airbnb, nhiều người nói chọn vì nhìn ấm cúng và đặc biệt. Đây là lần mua thứ 2 rồi, lần này mua thêm cho 2 phòng mới.","avatar":"","name":"Bích Ngọc","meta":"Chủ Homestay · Đà Lạt"},
    {"stars":4,"text":"Mình order từ Sài Gòn về Hải Phòng, giao 3 ngày. Đèn đẹp, đúng mô tả. Chỉ có 1 cái bị lỏng thanh tre ở đáy, nhắn shop thì được hướng dẫn cách cố định lại, không cần đổi hàng. Dịch vụ sau bán hàng tốt, không bỏ mặc khách sau khi thu tiền như nhiều nơi.","avatar":"","name":"Công Thành","meta":"Khách hàng · Hải Phòng"},
    {"stars":5,"text":"Quán mình ở Hội An, cạnh tranh cao lắm vì xung quanh toàn đèn lồng. Nhưng đèn của LongDenViet màu đẹp hơn hàng địa phương mình hay mua, vải dày và không bị nhạt sau mưa. Khách Tây hay dừng lại chụp ảnh trước quán. Đã mua 3 lần rồi, lần nào cũng ổn.","avatar":"","name":"Quốc Hùng","meta":"Mua lần 3 · Hội An"},
    {"stars":5,"text":"Ba mình năm nay 70 tuổi, tổ chức tiệc mừng thọ theo phong cách truyền thống. Đặt 30 cái đèn lồng đỏ vàng trang trí sân nhà. Hàng giao đúng hẹn, đèn đẹp, cả nhà ai cũng khen. Khách khứa hỏi mua nhiều, mình phải xin danh thiếp shop để phát cho họ.","avatar":"","name":"Xuân Lộc","meta":"Khách hàng · Tiền Giang"},
    {"stars":5,"text":"Văn phòng mình làm theo phong cách Indochine, cần đèn lồng cho khu lounge và phòng họp nhỏ. Tư vấn rất am hiểu về không gian làm việc, gợi ý size và màu phù hợp với ánh đèn nền. Treo lên đúng như hình dung. Đối tác nước ngoài sang thăm hay khen không gian đẹp và đặc trưng Việt Nam.","avatar":"","name":"Bảo An","meta":"Office Manager · Hà Nội"},
    {"stars":5,"text":"Lần này mua cho nhà mới, đây là lần thứ 4 mình đặt hàng rồi. Chất lượng nhất quán, không bao giờ bị thất vọng. Lần này lấy bộ đèn lồng tre tự nhiên treo ban công, tone trung tính hợp với nội thất gỗ sáng. Nhìn rất ổn, bạn bè sang chơi ai cũng khen.","avatar":"","name":"Tuấn Anh","meta":"Mua lần 4 · Hà Nội"},
    {"stars":5,"text":"Mở nhà hàng mới thiết kế theo phong cách phố cổ. Đặt 25 đèn lồng Hội An các màu ấm treo dọc trần. Khi khai trương, nhiều khách chụp ảnh check-in chia sẻ lên mạng, trang Instagram của nhà hàng tăng follow đáng kể nhờ những bức ảnh đó.","avatar":"","name":"Lê Thị Hoa","meta":"Chủ nhà hàng · Hà Nội"},
    {"stars":5,"text":"Mua làm quà cưới cho bạn thân, chọn bộ đôi đèn lồng đỏ thêu hoa. Đóng gói như hộp quà tặng, trông rất sang. Bạn mình thích lắm, treo ngay phòng ngủ. Giá cũng hợp lý cho một món quà có ý nghĩa và khác biệt.","avatar":"","name":"Mỹ Duyên","meta":"Khách hàng · Đà Nẵng"},
    {"stars":4,"text":"Quán bar mình cần đèn tạo không khí, mua thử 10 cái đèn lồng nhỏ treo khu ngoài trời. Khách thích lắm, nhiều bạn chụp ảnh. Chỉ tiếc 2 cái màu hơi khác nhau dù cùng mã. Shop giải thích do vải tự nhiên nên có sai số màu nhỏ. Cũng chấp nhận được vì là hàng thủ công.","avatar":"","name":"Tuấn Kiệt","meta":"Chủ bar · TP.HCM"},
    {"stars":5,"text":"Phòng khám đông y mình muốn tạo không gian truyền thống nhẹ nhàng. Mua 4 cái đèn lồng trắng ngà size vừa treo phòng chờ. Bệnh nhân hay khen không gian ấm cúng, bớt cảm giác lo lắng khi chờ đợi. Đây là điều mình cần nhất.","avatar":"","name":"BS Hà Thanh","meta":"Phòng khám · Hà Nội"},
    {"stars":5,"text":"Trường mầm non tổ chức Tết Trung Thu, cần 60 đèn lồng nhỏ cho các bé. Mua loại giấy truyền thống, an toàn cho trẻ. Shop tư vấn chọn loại phù hợp với độ tuổi, giao đủ số lượng đúng hẹn. Các bé thích lắm, phụ huynh chụp ảnh nhiều.","avatar":"","name":"Lan Hương","meta":"Hiệu trưởng MN · TP.HCM"},
    {"stars":5,"text":"Gia đình mình sống ở Mỹ về thăm quê, muốn mang đèn lồng thủ công về làm quà cho bạn bè bên đó. Mua 15 cái các loại. Shop đóng gói đặc biệt cho hàng air travel, gọn và chắc. Bạn bè bên Mỹ thích lắm, hỏi mua thêm nên mình đặt thêm 1 đơn giao thẳng sang.","avatar":"","name":"Kim Liên","meta":"Việt kiều Mỹ · California"},
    {"stars":5,"text":"Trung tâm văn hoá tỉnh tổ chức triển lãm nghề thủ công truyền thống, mua 40 cái đèn lồng Hội An các kích cỡ trưng bày. Chất lượng xứng đáng với tên gọi nghệ nhân, từng đường nét đều tỉ mỉ. Khách tham quan đánh giá cao, nhiều người hỏi mua mang về.","avatar":"","name":"Nguyễn Văn Minh","meta":"Trung tâm Văn hoá · Huế"},
    {"stars":5,"text":"Mình làm wedding planner, đã dùng đèn của shop cho hơn 10 đám cưới. Khách hàng của mình rất hài lòng với phần trang trí, nhiều cặp đặc biệt yêu cầu phong cách Hội An nhờ mình. Shop luôn có hàng sẵn và hỗ trợ số lượng lớn dễ dàng. Đối tác tin cậy của mình rồi.","avatar":"","name":"Trâm Anh","meta":"Wedding Planner · Đà Nẵng"},
    {"stars":5,"text":"Mua trang trí nhà mới, chọn bộ 5 cái đèn lồng lụa tone trắng sữa và vàng nhạt. Nhìn hợp với nội thất hiện đại hơn mình tưởng. Vợ mình ban đầu không thích ý tưởng này nhưng khi treo lên thì thừa nhận đẹp hơn đèn hiện đại. Đây là điều thuyết phục nhất.","avatar":"","name":"Đức Huy","meta":"Kỹ sư · TP.HCM"},
    {"stars":4,"text":"Mình ở Lâm Đồng, nông trại du lịch sinh thái. Mua 20 cái đèn lồng tre treo dọc đường vào và khu picnic. Khách chụp ảnh nhiều, đặc biệt buổi tối khi bật đèn. Chỉ tiếc mưa nhiều nên 2 cái bị ẩm phần đáy. Lần sau sẽ hỏi shop loại chống thấm tốt hơn.","avatar":"","name":"Đình Nam","meta":"Chủ nông trại · Lâm Đồng"},
    {"stars":5,"text":"Cửa hàng quà lưu niệm của mình ở phố cổ Hội An. Mua đèn lồng về bán lại, chất lượng tốt hơn nguồn mình đang lấy, giá sỉ cạnh tranh. Khách du lịch thích mua vì thấy sang hơn hàng chợ. Doanh số tháng này tăng gần 30% từ khi đổi sang hàng bên này.","avatar":"","name":"Thúy Nga","meta":"Chủ cửa hàng lưu niệm · Hội An"},
    {"stars":5,"text":"Chuỗi cà phê mình vừa mở thêm 2 chi nhánh mới, đặt tổng 60 cái đèn lồng cho cả 2 cơ sở. Shop có chính sách giá sỉ rõ ràng, không phải mặc cả nhiều. Giao đúng hẹn, hàng đồng đều chất lượng giữa các kiện. Điều này quan trọng khi mua số lượng lớn.","avatar":"","name":"Vũ Hà My","meta":"Chủ chuỗi cà phê · Hà Nội"},
    {"stars":3,"text":"Đèn nhìn đẹp nhưng giao hàng chậm hơn dự kiến 3 ngày, không kịp cho sự kiện. Phải mượn đèn nhựa để dùng tạm. Shop có xin lỗi và hoàn một phần phí vận chuyển. Đèn chất lượng tốt, nếu giao đúng hẹn thì chắc chắn 5 sao.","avatar":"","name":"Minh Châu","meta":"Khách hàng · TP.HCM"},
    {"stars":5,"text":"Khu resort sinh thái của mình cần đèn trang trí bungalow ven sông. Đặt 45 cái đèn lồng tre mây tone tự nhiên. Treo lên hòa vào cảnh quan cây cối rất ăn ý. Khách nước ngoài đặc biệt thích, nhiều người nói đây là chi tiết nhỏ làm cho trải nghiệm thêm authentic.","avatar":"","name":"Thanh Bình","meta":"Quản lý Resort · Cần Thơ"},
    {"stars":5,"text":"Khách sạn mình phụ trách procurement, cần 80 cái đèn lồng cho dự án refurbish hành lang tầng 2 và 3. Báo giá nhanh trong 30 phút, có chiết khấu tốt cho đơn lớn. Giao hàng 2 chuyến đúng tiến độ thi công. Chất lượng đồng đều, team thi công không phàn nàn gì.","avatar":"","name":"Hoàng Việt","meta":"Procurement Manager · Hạ Long"},
    {"stars":5,"text":"Lần đầu mua 10 cái cho nhà, thấy ổn nên lần 2 này mua thêm 15 cái vì cưới em gái. Chất lượng như lần trước, không bị thất vọng. Shop còn nhớ đơn lần trước và gợi ý thêm loại phù hợp với không gian ngoài trời.","avatar":"","name":"Ngọc Lan","meta":"Mua lần 2 · Bình Dương"},
    {"stars":5,"text":"Studio yoga của mình muốn tạo không gian tĩnh lặng và ấm áp. Treo 6 cái đèn lồng lụa trắng ngà ở các góc phòng tập. Học viên hay nói không gian làm họ thư giãn hơn các studio khác. Ánh sáng qua vải lụa rất dịu mắt, đúng cảm giác cần thiết cho không gian thiền.","avatar":"","name":"Phú Quỳnh","meta":"Chủ Studio Yoga · TP.HCM"},
    {"stars":4,"text":"Mua về dùng cho phòng ngủ, chọn 2 cái đèn lồng nhỏ treo hai bên đầu giường. Nhìn thực tế đẹp hơn ảnh chụp trên web, màu vàng nhạt tạo không gian rất lãng mạn. Chỉ hơi tiếc dây điện hơi ngắn so với nhu cầu của mình, phải nối thêm. Nhưng đèn thì hoàn toàn ổn.","avatar":"","name":"Hồng Nhung","meta":"Khách hàng · Cần Thơ"},
    {"stars":5,"text":"Chợ đêm khu du lịch mình cần decor phong cách phố cổ, đặt 100 cái đèn lồng đỏ vàng các size. Shop xử lý đơn lớn rất chuyên nghiệp, có kế hoạch giao theo từng đợt. Lắp xong khu chợ hẳn lên, khách du lịch chụp ảnh suốt, review trên Google cũng được nhắc đến.","avatar":"","name":"Thành Nhân","meta":"Quản lý khu du lịch · Hội An"},
    {"stars":5,"text":"Đây là lần thứ 3 mua rồi. Lần đầu thử 3 cái, thích quá mua thêm 10, giờ lại mua thêm cho nhà mới. Treo đèn lồng xong nhà có hồn hẳn, bạn bè sang chơi ai cũng hỏi mua. Đã thành thương hiệu quen thuộc của gia đình mình rồi.","avatar":"","name":"Thiên Kim","meta":"Mua lần 3 · Hà Nội"},
    {"stars":5,"text":"Mua tặng đồng nghiệp chuyển sang văn phòng mới, chọn 1 cái đèn lồng lụa nhỏ treo bàn làm việc. Trông xinh và ý nghĩa hơn mấy món quà tặng thông thường. Bạn đó rất thích, cả văn phòng hỏi mua theo.","avatar":"","name":"Phương Chi","meta":"Khách hàng · Hà Nội"},
    {"stars":5,"text":"Nhà mình ở Huế, không gian vườn rộng. Treo 12 cái đèn lồng dọc hàng hiên, buổi tối bật lên nhìn như cảnh phim. Mưa miền Trung nhiều nhưng đèn không bị ẩm hay phai màu. Chất lượng đúng như quảng cáo.","avatar":"","name":"Nguyệt Hà","meta":"Nội trợ · Huế"},
    {"stars":4,"text":"Mua 5 cái đèn lồng treo ban công chung cư. Đẹp, hàng xóm ai cũng khen. Nhưng bộ dây điện đi kèm hơi yếu, 1 cái bị lỏng sau 2 tuần. Nhắn shop thì được gửi bộ dây thay thế free. Thái độ xử lý tốt, sẽ tiếp tục ủng hộ.","avatar":"","name":"Hữu Lộc","meta":"Khách hàng · TP.HCM"},
    {"stars":5,"text":"Boutique thời trang của mình muốn tạo không gian mua sắm độc đáo, treo 8 cái đèn lồng lụa tím và hồng nhạt ở khu thử đồ. Khách nữ rất thích, nhiều bạn chụp ảnh trong khu thử đồ và đăng lên mạng. Tạo được wow moment tự nhiên mà không tốn thêm chi phí marketing.","avatar":"","name":"Thư Hoàng","meta":"Chủ boutique · TP.HCM"},
    {"stars":5,"text":"Nhà hàng hải sản mình thiết kế theo phong cách làng chài. Đặt 30 cái đèn lồng lưới tre treo trần. Khách hay khen không gian đúng chất, không bị fake hay theatrical. Điều này quan trọng với mình vì mình không thích decor giả tạo.","avatar":"","name":"Văn Thắng","meta":"Chủ nhà hàng · Nha Trang"},
    {"stars":5,"text":"Studio chụp hình của mình cần props đa dạng. Mua 15 cái đèn lồng các màu để thay đổi theo concept chụp. Sau 6 tháng dùng liên tục vẫn ổn, không bị phai màu hay sờn vải. Điều này quan trọng nhất khi dùng làm props nghề nghiệp.","avatar":"","name":"Anh Kiệt","meta":"Photographer · Đà Nẵng"},
    {"stars":3,"text":"Màu đèn nhận được hơi khác với ảnh web, tông đỏ của mình nhận được thiên về cam hơn. Nhắn shop thì được giải thích do màn hình hiển thị khác nhau. Chất lượng đèn thì ổn, chỉ màu không hoàn toàn như kỳ vọng.","avatar":"","name":"Thu Phương","meta":"Khách hàng · Hà Nội"},
    {"stars":5,"text":"Mua về tặng vợ nhân dịp kỷ niệm ngày cưới, chọn bộ đôi đèn lồng đỏ thêu hoa đôi. Vợ mình thích lắm, nói ý nghĩa và đặc biệt hơn quà tặng thông thường nhiều. Giờ treo ở phòng ngủ nhìn rất romantic.","avatar":"","name":"Minh Quân","meta":"Khách hàng · TP.HCM"},
    {"stars":5,"text":"Chuỗi spa 4 cơ sở, đặt tổng 32 cái đèn lồng lụa trắng ngà. Shop hỗ trợ giao hàng riêng từng địa điểm không tính phí thêm. Điều này rất tiện khi quản lý nhiều chi nhánh. Chất lượng đồng đều, khách không phân biệt được cơ sở nào mới mua.","avatar":"","name":"Mỹ Hằng","meta":"Chủ chuỗi spa · Hà Nội"},
    {"stars":5,"text":"Mua lần 2 rồi, lần đầu 5 cái thấy ổn nên lần này mua thêm 10 cái cho khu vực mới xây thêm. Chất lượng như lần trước. Shop còn nhớ đơn lần trước và gợi ý thêm loại phù hợp với không gian ngoài trời.","avatar":"","name":"Bảo Ngọc","meta":"Mua lần 2 · Cần Thơ"},
    {"stars":5,"text":"Mua về treo khu bếp và phòng ăn, chọn 4 cái đèn lồng tre mây nhỏ. Bếp nhà mình từ khi treo đèn vào trông ấm cúng và có phong cách hẳn lên. Cả nhà thích ăn cơm ở nhà hơn vì không gian đẹp. Điều nhỏ nhưng tác động lớn.","avatar":"","name":"Kim Phụng","meta":"Nội trợ · Đà Nẵng"},
    {"stars":5,"text":"Ở Pháp về thăm quê, mua 20 cái đèn lồng gửi sang lại làm quà. Shop có kinh nghiệm đóng gói hàng xuất khẩu, tư vấn kích thước phù hợp với quy định hàng hóa quốc tế. Bạn bè bên Pháp nhận được nguyên vẹn, thích lắm.","avatar":"","name":"Ánh Tuyết","meta":"Việt kiều Pháp · Paris"},
    {"stars":5,"text":"Dùng đèn lồng trang trí cho booth triển lãm tại hội chợ du lịch quốc tế. Khách nước ngoài đặc biệt ấn tượng, dừng lại chụp ảnh và hỏi thông tin. Tạo được điểm nhấn giữa hàng trăm booth khác. Hiệu quả hơn nhiều so với banner và roll-up thông thường.","avatar":"","name":"Quang Minh","meta":"Marketing Manager · TP.HCM"},
    {"stars":5,"text":"Mua về cho tiệm tóc mới khai trương, không gian kiểu Indochine nhẹ nhàng. Treo 6 cái đèn lồng lụa vàng đất và hồng nude. Khách hay ngồi check-in trước khi ra về. Chủ nhân ai cũng khen trang trí đẹp mà không rối. Đó là điều mình muốn.","avatar":"","name":"Hoa Anh","meta":"Chủ tiệm tóc · TP.HCM"},
    {"stars":5,"text":"Homestay mới của mình ở Hội An. Sau khi treo đèn lồng, ảnh Airbnb đẹp hơn rõ rệt, tỷ lệ đặt phòng tăng. Khách quốc tế đặc biệt thích, nói đây là lý do họ chọn homestay mình thay vì nơi khác. Đèn lồng là vũ khí bí mật của mình.","avatar":"","name":"Ngọc Trinh","meta":"Chủ Homestay · Hội An"},
    {"stars":5,"text":"Mua tặng gia đình đi định cư Canada, muốn họ có chút gì đó của Việt Nam bên đó. Shop tư vấn chọn loại vải dày để giữ màu lâu trong điều kiện khí hậu lạnh. Gia đình nhận được rất xúc động, nói treo lên nhìn ấm lòng.","avatar":"","name":"Hoài Thương","meta":"Khách hàng · TP.HCM"},
    {"stars":5,"text":"Đây là đơn thứ 5 của mình trong 2 năm qua. Lần đầu mua thử 3 cái, thích rồi mua thêm dần. Giờ nhà mình treo đèn lồng khắp nơi, từ phòng khách đến ban công sau. Bạn bè sang chơi đều nói nhà có không khí rất đặc biệt.","avatar":"","name":"Phú Thịnh","meta":"Mua lần 5 · Hà Nội"},
    {"stars":5,"text":"Visited Hoi An last spring and fell completely in love with the lanterns everywhere. Bought 4 pieces to bring back to Sydney — the silk quality is genuinely beautiful, nothing like the cheap tourist stuff at street stalls. My living room now has a little corner of Vietnam and every guest comments on it. Already planning to order more online.","avatar":"","name":"Sarah Mitchell","meta":"Customer · Sydney, Australia"},
    {"stars":5,"text":"Been living in Ho Chi Minh City for 3 years now and finally decorated my apartment properly with Vietnamese lanterns. Ordered 8 pieces in warm amber and green tones. The craftsmanship is incredible for the price — you can tell these are handmade with real care. Delivery was fast and everything arrived perfectly packed.","avatar":"","name":"James O'Brien","meta":"Expat · Ho Chi Minh City"},
    {"stars":4,"text":"Ordered online from London, shipping took about 2 weeks which was reasonable. The lanterns look exactly as described — good quality silk and sturdy bamboo frame. Lost one star because one tassel came slightly loose, easy enough to fix. Would order again, probably double the quantity next time.","avatar":"","name":"Tom Wilson","meta":"Customer · London, UK"},
    {"stars":5,"text":"We run a Vietnamese-themed event space in Singapore and have been sourcing lanterns from various suppliers. LongDenViet consistently delivers the best quality at competitive wholesale prices. Colors are vibrant and hold up well under event lighting. Will continue ordering for all our events.","avatar":"","name":"Christine Lim","meta":"Event Space Owner · Singapore"},
    {"stars":5,"text":"My parents came to the US from Vietnam in the 80s and always talked about Hoi An lanterns. Ordered a set of 3 traditional silk lanterns for their anniversary. When they opened the package my mom cried a little. Said it reminded her of home. That is more than I could have asked for from any gift.","avatar":"","name":"Kevin Nguyen","meta":"Customer · San Jose, California"},
    {"stars":5,"text":"As an interior designer specializing in Asian-inspired spaces I am very particular about quality. These lanterns exceeded my expectations — the silk is genuine, the bamboo frame is well-constructed, and the colors photograph beautifully. Used them in a project for a client's dining room and she was thrilled.","avatar":"","name":"Klaus Schneider","meta":"Interior Designer · Munich, Germany"},
    {"stars":4,"text":"Bought 5 lanterns as souvenirs during my trip to Vietnam. Carried them back to Canada in my luggage — they survived surprisingly well. The quality is clearly better than airport shops. Minus one star only because I wish there was more variety in the smaller sizes. Will definitely order online next time.","avatar":"","name":"Michelle Tremblay","meta":"Customer · Montreal, Canada"},
    {"stars":5,"text":"I ordered lanterns to decorate a Japanese-Vietnamese fusion restaurant I consult for. The silk texture and muted color palette paired beautifully with the minimalist Japanese aesthetic. Several customers have asked about the lanterns specifically. The team was helpful in recommending colors that would complement our interior.","avatar":"","name":"Yuki Tanaka","meta":"Restaurant Consultant · Tokyo, Japan"},
    {"stars":5,"text":"Been living in Hanoi for 5 years. Finally decorated my apartment properly with a set of 6 silk lanterns. The difference between these and market lanterns is immediately obvious — the silk is thicker, the frames are straight, the colors consistent. Worth every dong. My Vietnamese colleagues were impressed I knew where to get quality ones.","avatar":"","name":"Emma Rodriguez","meta":"Expat · Hanoi"},
    {"stars":5,"text":"Ordered from the Netherlands as gifts for family who love Vietnamese culture. Communication was smooth, they even helped me choose appropriate sizes for gifting. Everything arrived in excellent condition. The packaging itself looks like a gift — no extra wrapping needed. My sister-in-law immediately put hers up and sent me a photo.","avatar":"","name":"Annet van der Berg","meta":"Customer · Amsterdam, Netherlands"},
    {"stars":5,"text":"Third-generation Vietnamese-Australian. Bought 10 lanterns for my family's Tet celebration — first time we have properly decorated in years. My grandparents were moved seeing proper Vietnamese lanterns in the house again. The quality is as good as anything you would find in Vietnam. Will be ordering every year from now on.","avatar":"","name":"Lisa Pham","meta":"Customer · Melbourne, Australia"},
    {"stars":5,"text":"I'm a lifestyle blogger based in Stockholm and ordered these for a Southeast Asia-themed shoot. The lanterns are genuinely photogenic — the texture of the silk, the way light passes through, the little details on the bamboo frames. Several followers asked where to buy after the post went up. Happy to recommend.","avatar":"","name":"Linnea Eriksson","meta":"Lifestyle Blogger · Stockholm, Sweden"},
    {"stars":5,"text":"I grew up in Saigon and moved to the US 20 years ago. Every few years I order Vietnamese lanterns to keep a piece of home around. This is my second order from LongDenViet and the quality has stayed consistent. My American friends always ask if they can buy one when they visit.","avatar":"","name":"Trang Hoang","meta":"Repeat customer · Houston, Texas"},
    {"stars":4,"text":"Expat living in Saigon for 2 years. Ordered 6 lanterns to make my flat feel more like home. They look great and the quality is solid. Only issue was a slight delay in the initial response but once we got going everything was smooth. Would recommend to other expats looking to decorate authentically.","avatar":"","name":"Richard Blake","meta":"Expat · Ho Chi Minh City"},
    {"stars":5,"text":"I own an Italian restaurant in Da Nang and wanted to add some local character to a private dining room. Ordered 8 silk lanterns in warm tones — the effect is exactly what I hoped for. My Vietnamese guests especially appreciate the authenticity. Will be back for more when we open our second location.","avatar":"","name":"Marco Ferri","meta":"Restaurant Owner · Da Nang"},
    {"stars":5,"text":"Visiting from Taiwan and bought 6 lanterns to bring back as gifts. The staff helped me choose pieces that would travel well and pack compactly. Everything arrived home without a scratch. My friends in Taipei were very impressed — the quality is much higher than typical tourist souvenir lanterns.","avatar":"","name":"Chen Wei Ling","meta":"Customer · Taipei, Taiwan"},
    {"stars":5,"text":"Planned a destination wedding in Hoi An and needed 50 lanterns for the reception decor. The team was professional and patient through multiple revisions to the color palette. Delivery to the venue was on time and the lanterns looked stunning in photos. My wedding photographer said they were the best backdrop she had worked with all year.","avatar":"","name":"Ashley Morgan","meta":"Wedding Client · Los Angeles, USA"},
    {"stars":5,"text":"I bought these for a Korean-Vietnamese fusion cafe I help design. Communication was smooth and the final product was exactly what we needed. The lanterns add warmth to the space and photograph very well for social media. My client is happy, which is all that matters. Would work with them again.","avatar":"","name":"Ji-Young Park","meta":"Designer · Seoul, Korea"},
    {"stars":5,"text":"Ordered a set of 4 lanterns for my home office — wanted something calming and culturally interesting. These are exactly that. The silk glows beautifully when lit and the bamboo frame is solid. They have become the most commented-on thing in my video call background. Genuinely high quality at a very fair price.","avatar":"","name":"David Clarke","meta":"Customer · Auckland, New Zealand"}
  ]),
  home_shopby: JSON.stringify([
    {"title":"theo đối tượng","links":[["Gia đình","/san-pham"],["Cặp đôi","/san-pham"],["Doanh nghiệp","/lien-he"],["Du khách","/san-pham"],["Bạn bè","/san-pham"]]},
    {"title":"theo dịp","links":[["Tết Nguyên Đán","/c/den-long-tet"],["Khai trương","/lien-he"],["Đám cưới","/san-pham"],["Trung Thu","/c/den-trung-thu"],["Sinh nhật","/san-pham"]]},
    {"title":"theo danh mục","links":[["Đèn Lồng Hội An","/c/hoi-an-lantern"],["Đèn Tre & Mây","/c/den-may-tre"],["Đèn Vải Lụa","/c/den-vai-cao-cap"],["Lồng Đèn Gỗ","/c/den-long-go"],["Đèn Kiểu Nhật","/c/den-kieu-nhat"]]},
    {"title":"theo không gian","links":[["Phòng khách","/san-pham"],["Quán cà phê","/c/den-quan-cafe"],["Nhà hàng","/c/den-nha-hang"],["Sân vườn","/san-pham"],["Sự kiện","/san-pham"]]}
  ]),
  home_tags: JSON.stringify([
    ["Đèn trang trí nhà","/san-pham"],
    ["Quà tặng dịp Tết","/c/den-long-tet"],
    ["Đèn quán cafe & nhà hàng","/c/den-quan-cafe"],
    ["Đèn cưới & sự kiện","/san-pham"],
    ["Đèn tre thủ công","/c/den-may-tre"],
    ["Đặt hàng số lượng lớn","/lien-he"],
    ["Quà lưu niệm Việt Nam","/san-pham"],
    ["Thiết kế theo yêu cầu","/lien-he"]
  ]),
  home_b2b_1_title: 'Đèn Vải Trang Trí Quán Cafe & Nhà Hàng',
  home_b2b_1_desc: 'Đèn vải thả trần, chụp đèn vải giá sỉ từ 10 sản phẩm — chiết khấu đến 30%. Giao hàng tận nơi.',
  home_b2b_1_cta: 'Liên hệ đặt sỉ',
  home_b2b_1_url: '/lien-he',
  home_b2b_1_img: '',
  home_b2b_1_img_alt: 'Đặt sỉ đèn lồng cho quán cafe nhà hàng',
  home_b2b_2_title: 'Gia Công Chụp Đèn Vải Theo Yêu Cầu',
  home_b2b_2_desc: 'Gia công chụp đèn vải, đèn thả trần theo yêu cầu — in logo, chọn màu vải, kích thước riêng từ 20 chiếc.',
  home_b2b_2_cta: 'Tư vấn ngay',
  home_b2b_2_url: '/lien-he',
  home_b2b_2_img: '',
  home_b2b_2_img_alt: 'Thiết kế đèn lồng theo yêu cầu in logo',
  home_b2b_1_bg: '#D8EDD8',
  home_b2b_2_bg: '#EDE4D4',
  home_b2b_store_bg: '#FDF0DC',
  home_trust_bg: '#1a6b3c',
  home_artisan_left_bg: '#F5EDE0',
  home_artisan_right_bg: '#F5EDE0',
  home_maker_title: 'Làng nghề Hội An — nơi ánh đèn không bao giờ tắt',
  home_maker_desc: 'Từ những con hẻm nhỏ của phố cổ Hội An, những nghệ nhân lành nghề vẫn ngày ngày tạo ra những chiếc đèn lồng bằng đôi tay của mình — không máy móc, không dây chuyền công nghiệp.',
  home_showcase_label: 'Đèn vải & lồng đèn',
  home_showcase_heading: 'Đèn Vải & Lồng Đèn Theo Phong Cách',
  home_showcase_desc: 'Từ đèn lồng Hội An truyền thống đến phong cách tối giản Nhật Bản — mỗi chiếc đèn kể một câu chuyện khác nhau.',
  home_bestsellers_label: 'Đèn vải bán chạy nhất',
  home_bestsellers_heading: 'Đèn Vải Bán Chạy Nhất',
  home_bestsellers_categories: '[]',
  home_bestsellers_product_slugs: '',
  home_spaces_label: 'Trang trí không gian',
  home_spaces_heading: 'Đèn Vải Trang Trí Nội Thất — Không Gian Nào?',
  home_spaces_desc: 'Mỗi không gian cần một ngôn ngữ ánh sáng riêng. Chúng tôi có giải pháp cho từng nhu cầu.',
  home_b2b_label: 'Đặt sỉ & gia công đèn vải',
  home_b2b_heading: 'Gia Công Đèn Vải & Đặt Sỉ Lồng Đèn',
  home_b2b_1_label: 'Dành cho doanh nghiệp',
  home_b2b_2_label: 'Độc quyền',
  home_artisan_label: 'Xưởng Đèn Vải Thủ Công Uy Tín',
  home_artisan_cta_text: 'Đọc câu chuyện đầy đủ',
  home_artisan_cta_url: '/ve-chung-toi',
  // About page
  about_artisans: JSON.stringify([
    {"emoji":"🏮","name":"Trần Thị Lan","region":"Hội An, Quảng Nam","specialty":"Đèn lồng lụa truyền thống","experience":"30 năm","story":"Nghệ nhân Lan học nghề từ mẹ từ năm 8 tuổi. Đôi tay bà có thể cảm nhận được độ dày của từng sợi vải, điều chỉnh màu sắc theo ánh nắng và cảm xúc của khách."},
    {"emoji":"🌿","name":"Nguyễn Văn Hùng","region":"Bà Rịa-Vũng Tàu","specialty":"Đan tre & mây thủ công","experience":"22 năm","story":"Anh Hùng lớn lên trong gia đình có 3 đời làm nghề đan lát. Mỗi chiếc đèn tre của anh là sự kết hợp giữa kỹ thuật truyền thống và thẩm mỹ hiện đại."},
    {"emoji":"🎨","name":"Phạm Thị Thu","region":"Huế, Thừa Thiên Huế","specialty":"Đèn giấy & thêu tay","experience":"25 năm","story":"Cô Thu là người kế thừa nghề làm đèn giấy cung đình Huế. Mỗi chiếc đèn của cô mang đậm phong cách hoàng gia với những đường thêu tỉ mỉ."}
  ]),
  about_values: JSON.stringify([
    {"emoji":"🤝","title":"Hỗ trợ nghệ nhân","desc":"Mỗi đơn hàng góp phần duy trì sinh kế cho các nghệ nhân làng nghề truyền thống"},
    {"emoji":"🌱","title":"Bền vững","desc":"Vật liệu tự nhiên, quy trình thủ công, không tạo ra phế thải công nghiệp"},
    {"emoji":"📚","title":"Giữ gìn văn hóa","desc":"Kỹ thuật làm đèn lồng Hội An được UNESCO công nhận là di sản văn hóa phi vật thể"},
    {"emoji":"💡","title":"Đổi mới sáng tạo","desc":"Kết hợp kỹ thuật truyền thống với thiết kế hiện đại, tạo ra sản phẩm độc đáo"}
  ]),
  about_timeline: JSON.stringify([
    {"year":"2016","event":"Thành lập LongDenViet, bắt đầu hợp tác với 3 nghệ nhân đầu tiên tại Hội An"},
    {"year":"2017","event":"Mở rộng sang đèn tre mây, hợp tác với nghệ nhân tại Bà Rịa-Vũng Tàu"},
    {"year":"2019","event":"Ra mắt dòng Kaha Living — đèn lồng phong cách hiện đại cho không gian nội thất"},
    {"year":"2021","event":"Xuất khẩu sang thị trường Nhật Bản, Hàn Quốc, Úc với hơn 500 đơn hàng quốc tế"},
    {"year":"2023","event":"Mở xưởng sản xuất tại TP.HCM, rút ngắn thời gian giao hàng toàn quốc"},
    {"year":"2026","event":"Ra mắt website thương mại điện tử, kết nối trực tiếp nghệ nhân và khách hàng toàn cầu"}
  ]),
  // FAQ
  faq_items: JSON.stringify([
    {"q":"Làm thế nào để đặt hàng?","a":"Bạn có thể đặt hàng trực tiếp trên website, qua Zalo hoặc gọi hotline 0989.778.247. Chúng tôi sẽ xác nhận đơn trong vòng 2 giờ."},
    {"q":"Phí vận chuyển như thế nào?","a":"Miễn phí vận chuyển cho đơn từ 500.000₫. Đơn dưới 500.000₫ phí ship 30.000₫ (nội thành) hoặc theo GHN (liên tỉnh)."},
    {"q":"Thời gian giao hàng bao lâu?","a":"Nội thành TP.HCM: 1-2 ngày. Các tỉnh thành khác: 2-5 ngày làm việc."},
    {"q":"Có thể đổi trả không?","a":"Có. Đổi trả miễn phí trong 7 ngày nếu sản phẩm lỗi do sản xuất. Vui lòng giữ nguyên bao bì và chụp ảnh trước khi gửi lại."},
    {"q":"Có đặt theo yêu cầu không?","a":"Có. Chúng tôi nhận đặt in logo, tùy chỉnh màu sắc, kích thước và thiết kế riêng. Liên hệ để được tư vấn chi tiết."},
    {"q":"Thanh toán bằng gì?","a":"Chấp nhận COD (tiền mặt khi nhận hàng), chuyển khoản ngân hàng, MoMo, VNPay và thẻ tín dụng."}
  ]),
  contact_faq: JSON.stringify([
    {"q":"Giao hàng mất bao lâu?","a":"Nội thành TP.HCM 1-2 ngày · Tỉnh thành 2-5 ngày làm việc qua GHN/GHTK"},
    {"q":"Có đặt sỉ được không?","a":"Có, từ 10 sản phẩm trở lên. Liên hệ để nhận báo giá sỉ và ưu đãi đặc biệt."},
    {"q":"In logo lên đèn được không?","a":"Được, tối thiểu 20 chiếc. Giao trong 7-10 ngày làm việc sau khi xác nhận mẫu."},
    {"q":"Đổi trả như thế nào?","a":"Đổi trả miễn phí trong 7 ngày nếu lỗi sản xuất. Giữ nguyên bao bì khi gửi trả."},
    {"q":"Thanh toán bằng gì?","a":"COD, chuyển khoản, MoMo, VNPay. Không thu thêm phí cổng thanh toán."},
    {"q":"Có cửa hàng vật lý không?","a":"Có. Hội An (xưởng sản xuất), Hà Nội và TP.HCM. Xem địa chỉ chi tiết tại trang Chi nhánh."}
  ]),
  about_hero_title: 'Câu Chuyện LongDenViet',
  about_hero_subtitle: 'Từ tình yêu đèn lồng Hội An đến thương hiệu đèn trang trí thủ công hàng đầu Việt Nam',
  about_story: '',
  about_stat_1_number: '15+', about_stat_1_label: 'Nghệ nhân',
  about_stat_2_number: '500+', about_stat_2_label: 'Mẫu đèn',
  about_stat_3_number: '8 Năm', about_stat_3_label: 'Kinh nghiệm',
  about_stat_4_number: '10,000+', about_stat_4_label: 'Đơn hàng',
  contact_phone: '09368.766.79',
  contact_hours: '8:00 – 21:00, tất cả các ngày',
  contact_email: 'hi@kaha.vn',
  contact_address: '262/1/93 Phan Anh, Phường Phú Thạnh, TP.HCM',
  contact_zalo: '0936876679',
  contact_b2b_min: '10 sản phẩm',
  contact_b2b_desc: 'Chúng tôi nhận đơn sỉ từ 10 sản phẩm trở lên. Có thể in logo, tùy chỉnh màu sắc và kích thước theo yêu cầu.',
  // Trust Strip
  home_trust_s1_num: 'Free Ship', home_trust_s1_label: 'Đơn trên 2,000K',
  home_trust_s2_num: '12 tháng', home_trust_s2_label: 'Bảo hành',
  home_trust_s3_num: '100%', home_trust_s3_label: 'Thủ công — không máy móc',
  home_trust_s4_num: '7 ngày', home_trust_s4_label: 'Đổi trả dễ dàng',
  home_trust_s5_num: '', home_trust_s5_label: '',
  // Spaces
  home_space_img_1: '/images/cong-trinh/ct-11-longdenviet.webp',
  home_space_label_1: 'Quán Cafe',
  home_space_desc_1: 'Đèn thả, đèn ngoài trời, đèn tre',
  home_space_img_2: '/images/cong-trinh/ct-19-longdenviet.webp',
  home_space_label_2: 'Nhà ở & Showroom',
  home_space_desc_2: 'Đèn nội thất, phong cách riêng',
  home_space_img_3: '/images/cong-trinh/ct-07-longdenviet.webp',
  home_space_label_3: 'Nhà hàng & Resort',
  home_space_desc_3: 'Đèn lồng Nhật, vải lụa, cao cấp',
  home_space_img_4: '/images/cong-trinh/ct-26-longdenviet.webp',
  home_space_label_4: 'Cưới & Sự kiện',
  home_space_desc_4: 'Trang trí sân khấu, lễ hội, hội chợ',
  // International
  home_intl_img_1: '/images/menu/den-hoi-an-600x450.webp',
  home_intl_cap_1: 'Khách du lịch Nhật Bản · Hội An',
  home_intl_img_2: '/images/menu/khong-gian-nha-hang-600x450.webp',
  home_intl_cap_2: 'Đêm phố cổ Hội An · UNESCO',
  home_intl_img_3: '/images/menu/khong-gian-resort-600x450.webp',
  home_intl_cap_3: 'Khách Hàn Quốc · TP.HCM',
  home_intl_img_4: '/images/menu/den-kieu-nhat-600x450.webp',
  home_intl_cap_4: 'Đơn xuất khẩu · Úc & Mỹ',
  menu_products: JSON.stringify([
    { label: 'Đèn Hội An',    href: '/c/hoi-an-lantern', image: '/images/menu/hoian.webp',    tag: 'Bestseller' },
    { label: 'Đèn Kiểu Nhật', href: '/c/den-kieu-nhat',  image: '/images/menu/nhat.webp' },
    { label: 'Đèn Tre & Mây', href: '/c/den-may-tre',    image: '/images/menu/tre.webp' },
    { label: 'Đèn Vải Lụa',   href: '/c/den-vai-cao-cap',image: '/images/menu/vai.webp',      tag: 'Mới' },
    { label: 'Đèn Lồng Gỗ',  href: '/c/den-long-go',    image: '/images/menu/go.webp' },
    { label: 'Đèn Thả Trần',  href: '/c/den-tha-tran',   image: '/images/menu/tha-tran.webp' },
    { label: 'Đèn Sàn',       href: '/c/den-san',        image: '/images/menu/san.webp' },
    { label: 'Đèn Áp Tường',  href: '/c/den-ap-tuong',   image: '/images/menu/tuong.webp' },
    { label: 'Đèn Vẽ Tranh',  href: '/c/den-ve-tranh',   image: '/images/menu/ve-tranh.webp' },
    { label: 'Đèn Tết',       href: '/c/den-long-tet',   image: '/images/menu/tet.webp',       tag: 'Hot' },
  ]),
  menu_rooms: JSON.stringify([
    { label: 'Phòng Khách',   href: '/c/phong-khach',   image: '/images/menu/san.webp' },
    { label: 'Phòng Ngủ',     href: '/c/phong-ngu',     image: '/images/menu/bedroom.webp' },
    { label: 'Phòng Bếp',     href: '/c/phong-bep',     image: '/images/menu/dining.webp' },
    { label: 'Quán Cafe',     href: '/c/den-quan-cafe',  image: '/images/menu/cafe.webp' },
    { label: 'Nhà Hàng',      href: '/c/den-nha-hang',  image: '/images/menu/nha-hang.webp' },
    { label: 'Đèn Khách Sạn', href: '/c/den-khach-san', image: '/images/menu/resort.webp' },
    { label: 'Ngoài Trời',    href: '/c/ngoai-troi',    image: '/images/menu/ngoai-troi.webp' },
    { label: 'Đèn Nội Thất',  href: '/c/den-noi-that',  image: '/images/menu/san.webp' },
  ]),
  category_bar: JSON.stringify([
    { label: 'Đèn Tết',   href: '/c/den-long-tet',    sub: 'Lồng đèn truyền thống', img: '/images/menu/tet.webp' },
    { label: 'Hội An',    href: '/c/hoi-an-lantern',  sub: 'Đèn vải thủ công',      img: '/images/menu/hoian.webp' },
    { label: 'Tre & Mây', href: '/c/den-may-tre',     sub: 'Đèn tre đan tự nhiên',  img: '/images/menu/den-tre-may-longdenviet.webp' },
    { label: 'Vải Lụa',   href: '/c/den-vai-cao-cap', sub: 'Cao cấp & tinh tế',     img: '/images/menu/den-vai-lua-longdenviet.webp' },
    { label: 'Quà Tặng',  href: '/san-pham',          sub: 'Ý nghĩa & độc đáo',     img: '/images/menu/den-hoi-an-ve-tranh-longdenviet.webp' },
    { label: 'Bán Chạy',  href: '/san-pham',          sub: 'Được yêu thích nhất',   img: '/images/menu/nhat.webp' },
  ]),
  secondary_nav: JSON.stringify([
    { label: 'Đèn Tết',                 href: '/c/den-long-tet',    categoryId: 'den-long-tet',   isTet: true },
    { label: 'Đèn Lồng',                href: '/c/hoi-an-lantern',  categoryId: 'hoi-an-lantern' },
    { label: 'Đèn Tre & Mây',           href: '/c/den-may-tre',     categoryId: 'den-may-tre' },
    { label: 'Đèn Vải Lụa',             href: '/c/den-vai-cao-cap', categoryId: 'den-vai-cao-cap' },
    { label: 'Đèn Gỗ',                  href: '/c/den-long-go',     categoryId: 'den-long-go' },
    { label: 'Sản Phẩm Hot',            href: '/c/san-pham-hot',    categoryId: 'san-pham-hot' },
    { label: 'Cho Cà Phê & Nhà Hàng',   href: '/c/den-quan-cafe',   categoryId: 'den-quan-cafe' },
    { label: 'Câu Chuyện Nghệ Nhân',    href: '/ve-chung-toi',      categoryId: null },
    { label: 'Blog',                    href: '/blog',              categoryId: null },
  ]),
  search_placeholder: 'đèn lồng hội an, đèn tre, quà tặng...',
  search_quick_categories: JSON.stringify([
    { label: 'Đèn Lồng Hội An', href: '/c/hoi-an-lantern', badge: 'Bestseller' },
    { label: 'Đèn Vải & Lụa', href: '/c/den-vai-cao-cap', badge: null },
    { label: 'Đèn Tết & Lễ Hội', href: '/c/den-long-tet', badge: 'Hot' },
    { label: 'Đèn Tre & Mây', href: '/c/den-may-tre', badge: null },
    { label: 'Phong Cách Nhật', href: '/c/den-kieu-nhat', badge: null },
    { label: 'Quà Tặng & B2B', href: '/san-pham', badge: null },
  ]),
  search_total_label: '800+',
  footer_nav_rows: JSON.stringify([
    { cat: 'Sản phẩm', links: [['Đèn Vải Treo Trần','/shop'],['Đèn Khung Kim Loại','/shop'],['Lồng Đèn Dân Gian','/shop'],['Gia Công Theo Yêu Cầu','/showroom'],['Tất cả →','/shop']] },
    { cat: 'Dự án', links: [['Khách Sạn & Resort','/shop'],['Nhà Hàng & F&B','/shop'],['Spa & Wellness','/shop'],['Retail & Showroom','/shop'],['Gửi Brief →','/showroom']] },
    { cat: 'KAHA', links: [['Về xưởng','/showroom'],['Journal kỹ thuật','/journal'],['Lookbook','/lookbook'],['Moodboard','/moodboard'],['Liên hệ','/showroom']] },
  ]),
  footer_ticker: JSON.stringify(['KAHA · XƯỞNG TP.HCM','GIA CÔNG ĐÈN VẢI CAO CẤP','THEO BẢN VẼ DỰ ÁN','B2B · KHÁCH SẠN · F&B','PHẢN HỒI RFQ 48H','BẢO HÀNH KHUNG 12T','MADE IN VIETNAM','EST. 2016']),
  footer_maps_url: 'https://maps.app.goo.gl/5htfAhQgfXvCFmhK9',
  home_showcase: JSON.stringify([
    {"href":"/shop","img":"","label":"Đèn Vải Treo Trần","sub":"Chụp vải, khung kim loại, nhiều kích thước","tag":""},
    {"href":"/shop","img":"","label":"Đèn Lồng Dân Gian","sub":"Lồng tre, mây đan, vải thủ công","tag":""},
    {"href":"/shop","img":"","label":"Đèn Khung Sắt","sub":"Sơn tĩnh điện, bề mặt matte & brass","tag":""},
    {"href":"/showroom","img":"","label":"Gia Công Theo Yêu Cầu","sub":"Theo bản vẽ kiến trúc, số lượng lớn","tag":"B2B"}
  ]),
  home_artisan_values: JSON.stringify([
    {"icon":"handcraft","title":"Từ brief đến sản phẩm — một đầu mối","desc":"Nhận bản vẽ kiến trúc, tư vấn spec, làm mẫu thử và giao hàng loạt trong một quy trình xuyên suốt."},
    {"icon":"leaf","title":"Vật liệu chất lượng cao — nguồn gốc rõ ràng","desc":"Vải cao cấp, khung kim loại sơn tĩnh điện, phụ kiện đèn tiêu chuẩn xuất khẩu — không dùng vật liệu kém chất lượng."},
    {"icon":"truck","title":"Giao theo tiến độ công trình","desc":"Đóng gói chuyên nghiệp từng kiện, giao đúng hạn theo lịch thi công của dự án."}
  ]),
  // Flash Sale widget
  home_flash_heading: 'Flash Sale hôm nay',
  home_flash_cta_text: 'Mua Ngay — Sale Kết Thúc Sớm',
  home_flash_cta_url: '/san-pham',
  home_flash_products: JSON.stringify([
    {"name":"Đèn Lồng Hội An Tròn","price":"199.000đ","old":"350.000đ","remaining":3,"bar":"82%","viewers":18,"img":"/images/hero/hero-2.webp"},
    {"name":"Đèn Vải Lụa Hoa Sen","price":"499.000đ","old":"850.000đ","remaining":5,"bar":"60%","viewers":11,"img":"/images/hero/hero-3.webp"},
    {"name":"Đèn Tre Mây Dáng Cầu","price":"299.000đ","old":"420.000đ","remaining":7,"bar":"45%","viewers":7,"img":"/images/hero/hero-1.webp"}
  ]),
  // Reviews guarantee card
  home_guarantee_title: 'Cam Kết Của Chúng Tôi',
  home_guarantee_1_title: 'Bảo hành 12 tháng',   home_guarantee_1_sub: 'Đổi trả trong 30 ngày',
  home_guarantee_2_title: 'Giao hàng toàn quốc', home_guarantee_2_sub: 'Miễn phí đơn từ 500k',
  home_guarantee_3_title: 'Thủ công 100%',        home_guarantee_3_sub: 'Nghệ nhân làng nghề Hội An',
  // Artisan Story section
  home_artisan_heading: 'Đôi bàn tay nghệ nhân —\nnơi ánh sáng bắt đầu',
  home_artisan_body: 'Không có dây chuyền. Không có máy móc. Từng sợi tre được chẻ mỏng bằng tay, từng mảnh lụa được kéo căng cẩn thận. Mỗi chiếc đèn lồng của chúng tôi mang trong mình hàng giờ lao động tâm huyết — đó là điều không một xưởng công nghiệp nào có thể thay thế.',
  home_artisan_stat1_num: '15+',   home_artisan_stat1_label: 'Nghệ nhân\ntrực tiếp',
  home_artisan_stat2_num: '200+',  home_artisan_stat2_label: 'Mẫu đèn\nđộc quyền',
  home_artisan_stat3_num: '8 năm', home_artisan_stat3_label: 'Kinh nghiệm\nthủ công',
  home_artisan_img: 'https://pub-7dd4b253eab247ec8796a6d6eb72dce7.r2.dev/1773742259200_den-vai-9912.webp',
  // B2B Visit Store card
  home_b2b_store_label: 'Đến xưởng trực tiếp',
  home_b2b_store_title: 'Chạm Tay Trước Khi Mua',
  home_b2b_store_address: '262/1/93 Phan Anh, Phường Phú Thạnh, TP.HCM',
  home_b2b_store_hours: 'Mở 8:00–21:00 · mỗi ngày',
  home_b2b_store_display: '200+ mẫu đèn trưng bày',
  home_b2b_store_maps_url: 'https://maps.app.goo.gl/5htfAhQgfXvCFmhK9',
  home_b2b_store_phone: '0936876679',
  // Reviews section rating
  home_reviews_rating: '4.5',
  home_reviews_count: '1.247 đánh giá xác thực',
  home_reviews_label: 'Khách hàng nói gì',
  home_reviews_heading: 'Lồng Đèn Việt® — được tin chọn',
  home_reviews_cta_text: 'Xem tất cả đánh giá →',
  home_reviews_cta_url: '/san-pham',
  home_showcase_cta_text: 'Xem toàn bộ đèn vải & lồng đèn →',
  home_showcase_cta_url: '/san-pham',
  home_bestsellers_cta_text: 'Xem tất cả đèn vải & lồng đèn',
  home_bestsellers_cta_url: '/san-pham',
  home_artisan_stats_label: 'Bằng chứng từ số liệu',
  home_b2b_badge_city: 'TP.HCM',
  home_b2b_badge_count: '800+ mẫu đèn vải',
  home_b2b_badge_ship: 'Giao 2–4 ngày',
  home_space_href_1: '/c/den-quan-cafe',
  home_space_href_2: '/c/den-vai-cao-cap',
  home_space_href_3: '/c/den-nha-hang',
  home_space_href_4: '/c/hoi-an-lantern',
  mobile_bottom_nav: JSON.stringify([
    {"label":"Trang chủ","href":"/","icon":"home"},
    {"label":"Danh mục","href":"/san-pham","icon":"category"},
    {"label":"Tìm kiếm","href":"/san-pham","icon":"search"},
    {"label":"Giỏ hàng","href":"/gio-hang","icon":"cart"},
    {"label":"Yêu thích","href":"/yeu-thich","icon":"wishlist"},
    {"label":"Tài khoản","href":"/tai-khoan/dang-nhap","icon":"account"}
  ]),
  // Typography colors
  typo_heading_from: '#1a1a1a',
  typo_heading_to:   '#104e2e',
  typo_body:         '#1a1a1a',
  typo_body_md:      '#4a4a4a',
  typo_body_lt:      '#888888',
  typo_link:         '#104e2e',
  legal_company_name: 'HỘ KINH DOANH KAHA HOME',
  legal_tax_id: 'MST: 079192026914',
  legal_registered_address: '262/1/93 Phan Anh, Phường Phú Thạnh, Thành Phố Hồ Chí Minh, Việt Nam',
  // Contact popup
  menu_img_hoian:      '/images/menu/hoian.webp',
  menu_img_tet:        '/images/menu/tet.webp',
  menu_img_tre:        '/images/menu/tre.webp',
  menu_img_vai:        '/images/menu/vai.webp',
  menu_img_go:         '/images/menu/go.webp',
  menu_img_ve_tranh:   '/images/menu/ve-tranh.webp',
  menu_img_nhat:       '/images/menu/nhat.webp',
  menu_img_san:        '/images/menu/san.webp',
  menu_img_bedroom:    '/images/menu/bedroom.webp',
  menu_img_dining:     '/images/menu/dining.webp',
  menu_img_cafe:       '/images/menu/cafe.webp',
  menu_img_resort:     '/images/menu/resort.webp',
  menu_img_tuong:      '/images/menu/tuong.webp',
  menu_img_ngoai_troi: '/images/menu/ngoai-troi.webp',
  menu_img_nha_hang:   '/images/menu/nha-hang.webp',
  menu_img_tha_tran:   '/images/menu/tha-tran.webp',
  popup_enabled: 'true',
  popup_title: 'Tư vấn miễn phí',
  popup_subtitle: 'Đội ngũ sẵn sàng hỗ trợ bạn',
  popup_response_time: '15 phút',
  popup_delay_ms: '4000',
  popup_zalo_url: 'https://zalo.me/0989778247',
  popup_messenger_url: 'https://m.me/longdenviet',
  popup_whatsapp_url: 'https://wa.me/84905151701',
  popup_email: 'hi@kaha.vn',
  popup_maps_url: 'https://maps.app.goo.gl/5htfAhQgfXvCFmhK9',
  popup_ai_cta_text: 'Chat với Khánh Hạ ngay',
  // ZaloQRFloat
  zalo_qr_enabled: 'true',
  zalo_qr_label: 'Liên hệ',
  zalo_qr_label_color: '#1a1a1a',
  zalo_qr_label_weight: '500',
  zalo_qr_btn_color_1: '#1a6b3c',
  zalo_qr_btn_color_2: '#145530',
  zalo_qr_btn_shadow: 'rgba(212,175,55,0.35)',
  zalo_qr_btn_effect: 'pulse',
  zalo_qr_phone: '0936876679',
  zalo_qr_img: '/images/qr-zalo.png',
  zalo_qr_size: '180',
  zalo_qr_border_effect: 'goldDash',
  zalo_qr_header_label: 'Zalo · Chat ngay',
  zalo_qr_header_sub: 'Tư vấn miễn phí',
  zalo_qr_call_phone: '0936876679',
  zalo_qr_viber_phone: '0905151701',
  zalo_qr_fb_url: 'https://m.me/longdenviet',
  zalo_qr_whatsapp_phone: '0905151701',
  zalo_qr_wechat_phone: '0905151701',
  zalo_qr_wechat_img: '',
  // FloatingButtons
  float_enabled: 'true',
  float_label: 'Chat',
  float_label_color: '#ffffff',
  float_label_weight: '700',
  float_btn_color_1: '#1e8a4a',
  float_btn_color_2: '#104e2e',
  float_btn_effect: 'none',
  float_zalo_url: 'https://zalo.me/0989778247',
  float_zalo_label: 'Zalo · Gọi thoại',
  float_whatsapp_url: 'https://wa.me/84905151701',
  float_whatsapp_label: 'WhatsApp',
  float_viber_url: 'viber://chat?number=%2B84905151701',
  float_viber_label: 'Viber',
  float_messenger_url: 'https://m.me/longdenviet',
  float_messenger_label: 'Messenger',
  float_phone: '0936876679',
  float_phone_label: '0989.778.247',
  float_phone_effect: 'ripple',
  // LanternAdvisorTrigger
  advisor_enabled: 'true',
  advisor_label: 'Tư vấn Online',
  advisor_label_color: '#ffffff',
  advisor_label_weight: '700',
  advisor_btn_color_1: '#1a6b3c',
  advisor_btn_color_2: '#0d3d20',
  advisor_btn_shadow: 'rgba(16,78,46,0.55)',
  advisor_btn_effect: 'pulse',
  advisor_maps_url: 'https://maps.app.goo.gl/5htfAhQgfXvCFmhK9',
  advisor_hotline: '09368.766.79',
  advisor_call_phone: '0936876679',
  advisor_sub_label: 'Gợi ý đúng nhu cầu · Online 24/7',
  advisor_chat_sales_name: 'Khánh Hạ',
  advisor_chat_sales_role: 'Tư vấn bán hàng',
  advisor_chat_tech_name: 'Văn Trường',
  advisor_chat_tech_role: 'Kỹ thuật viên',
  advisor_chat_team_label: 'Team tư vấn · Trực tuyến 24/7',
  advisor_chat_proactive_delay: '40000',
  advisor_chat_welcome_title: 'Xin chào! Hỗ trợ đa ngôn ngữ 24/7',
  advisor_chat_welcome_sub: 'Tiếng Việt | English | 中文 | 日本語 | 한국어\nHoặc bạn có thể chat bằng ngôn ngữ bạn quen dùng.',
  advisor_multilang_enabled: 'true',
  advisor_multilang_messages: JSON.stringify([
    'Chat đa ngôn ngữ',
    'Multilingual chat',
    '多语言咨询',
    '多言語チャット',
  ]),
  advisor_multilang_interval_ms: '3000',
  advisor_multilang_mode: 'fade',
  // Homepage — Nhà thiết kế ảo
  home_advisor_label: 'Nhà thiết kế ảo',
  home_advisor_heading: 'Không gian của bạn cần đèn nào?',
  home_advisor_desc: 'Tải ảnh phòng của bạn lên, hệ thống AI sẽ gợi ý những chiếc đèn phù hợp nhất.',
  home_advisor_questions: JSON.stringify([
    { label: 'Phòng của bạn là loại nào?', options: ['Phòng khách', 'Phòng ngủ', 'Quán cafe / nhà hàng', 'Sân vườn'] },
    { label: 'Phong cách bạn yêu thích?', options: ['Truyền thống', 'Hiện đại', 'Bohemian', 'Tối giản'] },
    { label: 'Ngân sách dự kiến?', options: ['Dưới 200k', '200k–500k', '500k–1 triệu', 'Trên 1 triệu'] },
    { label: 'Kích thước không gian?', options: ['Nhỏ (< 20m²)', 'Vừa (20–50m²)', 'Lớn (50–100m²)', 'Rất lớn (> 100m²)'] },
  ]),
  // Homepage — Blog nổi bật
  home_blog_label: 'Cảm hứng & Kiến thức',
  home_blog_heading: 'Kiến Thức Về Đèn Vải & Lồng Đèn',
  home_blog_cta_text: 'Xem tất cả bài viết',
  home_blog_cta_url: '/blog',
  home_blog_slug_1: 'long-den-hoi-an',
  home_blog_slug_2: 'long-den-nhat-ban',
  home_blog_slug_3: 'den-long-trang-tri-quan-cafe',
  home_blog_slug_4: '',
  home_blog_slug_5: '',
  home_blog_slug_6: '',
  // Homepage — B2B Full Section
  home_b2b_full_label: 'Gia công đèn vải số lượng lớn',
  home_b2b_full_heading: 'Gia Công Chụp Đèn Vải & Lồng Đèn Số Lượng Lớn',
  home_b2b_full_desc: 'Gia công chụp đèn vải, đèn vải thả trần, lồng đèn Hội An cho khách sạn, resort, nhà hàng. Chiết khấu đến 25%, thiết kế riêng theo yêu cầu.',
  home_b2b_full_img: '/images/homepage/b2b-khach-san-den-tron-longdenviet.webp',
  home_b2b_full_img_alt: 'Đèn tròn vải lụa trắng treo trần khách sạn — dự án lắp đặt đèn lồng sỉ LongDenViet TP.HCM',
  home_b2b_full_cta: 'Liên hệ tư vấn B2B',
  home_b2b_full_cta_url: '/lien-he',
  home_b2b_full_features: JSON.stringify([
    { icon: 'discount', title: 'Chiết khấu 5–25%', desc: 'Theo số lượng đặt hàng, từ 20 chiếc trở lên' },
    { icon: 'custom', title: 'Thiết kế riêng', desc: 'Logo, màu sắc, kích thước theo yêu cầu' },
    { icon: 'ship', title: 'Giao trong 7–14 ngày', desc: 'Đơn lớn có lịch sản xuất ưu tiên' },
    { icon: 'support', title: 'Hỗ trợ 1-1', desc: 'Account manager riêng cho đối tác lớn' },
  ]),
  home_b2b_full_discount_pct: '25%',
  home_b2b_full_discount_label: 'Chiết khấu tối đa',
  // Homepage — Use Cases
  home_use_cases_label: 'Ứng dụng thực tế',
  home_use_cases_heading: 'Phù Hợp Với Mọi Không Gian',
  home_use_cases_desc: 'Từ quán cafe đến khách sạn, từ trang trí gia đình đến sự kiện lớn — LongDenViet có mẫu phù hợp.',
  home_use_cases_cta_text: 'Xem tất cả sản phẩm',
  home_use_cases_cta_url: '/san-pham',
  home_use_cases: JSON.stringify([
    { img: '/images/menu/hoian.webp', tag: 'Quán Cafe & Nhà Hàng', title: 'Không Gian Ẩm Thực', desc: 'Đèn Hội An, đèn tre, đèn vải lụa — tạo điểm nhấn cho từng góc quán. Đặt lô 10–500 chiếc, giao đúng hẹn.', cta: 'Xem đèn quán cafe', href: '/c/den-quan-cafe' },
    { img: '/images/menu/tet.webp', tag: 'Sự Kiện & Tiệc Cưới', title: 'Trang Trí Sự Kiện', desc: 'In logo, hoa văn riêng theo yêu cầu. Phục vụ sự kiện từ 50 đến hàng nghìn chiếc — tư vấn thiết kế miễn phí.', cta: 'Tư vấn trang trí sự kiện', href: '/lien-he?ref=su-kien' },
    { img: '/images/menu/nhat.webp', tag: 'Gia Đình & Nội Thất', title: 'Trang Trí Nhà Ở', desc: 'Đèn kiểu Nhật, đèn lồng gỗ, đèn vải cao cấp — nâng tầm từng góc nhà. Giao toàn quốc, lắp đặt dễ dàng.', cta: 'Xem đèn trang trí nhà', href: '/c/den-phong-ngu' },
  ]),
  // Homepage — Newsletter
  home_newsletter_label: 'ĐỘC QUYỀN CHO KHÁCH MỚI',
  home_newsletter_heading: 'Nhận Voucher 50.000đ',
  home_newsletter_desc: 'Đăng ký nhận tin — nhận ngay voucher 50K cho đơn đầu tiên và cập nhật mẫu đèn mới mỗi tuần.',
  home_newsletter_footnote: 'Không spam. Hủy đăng ký bất kỳ lúc nào.',
  // FX defaults
  fx_cursor_enabled:    'true',
  fx_cursor_color:      '#1a6b3c',
  fx_cursor_style:      'ring',
  fx_scroll_progress:   'true',
  fx_scroll_color:      '#c9822a',
  fx_card_glow:         'true',
  fx_card_glow_color:   'rgba(26,107,60,0.18)',
  // Homepage — Section visibility manager
  home_sections_config: JSON.stringify({
    hero: true,
    marquee: true,
    congtrinh: true,
    showcase: true,
    bestsellers: true,
    bundles: true,
    editorial: true,
    artisan: true,
    spaces: true,
    reviews: true,
    blog: true,
    b2b: true,
  }),
  // Homepage — Bundle section heading/CTA
  home_bundles_label: 'COMBO TIẾT KIỆM',
  home_bundles_heading: 'Bộ Đôi Hoàn Hảo',
  home_bundles_desc: 'Mua theo bộ — tiết kiệm hơn, phối hợp tốt hơn, không phải chọn lẻ mất thời gian.',
  home_bundles_cta_text: 'Xem tất cả',
  home_bundles_cta_url: '/san-pham',
  // Homepage — Hero brand promise badges
  home_hero_badge_1_title: 'Handmade 100%',
  home_hero_badge_1_sub: 'Từ làng nghề truyền thống',
  home_hero_badge_2_title: 'Gia công theo yêu cầu',
  home_hero_badge_2_sub: 'In logo, chọn màu, kích thước riêng',
  home_hero_badge_3_title: 'Tư vấn miễn phí',
  home_hero_badge_3_sub: 'Chọn đúng đèn cho không gian',
  home_hero_badge_4_title: 'Giao nhanh toàn quốc',
  home_hero_badge_4_sub: 'Đóng gói kỹ, an toàn tuyệt đối',
  // Footer — Newsletter
  footer_newsletter_title: 'Nhận ưu đãi',
  footer_newsletter_subtitle: 'Voucher 50K cho đơn đầu tiên',
  footer_newsletter_desc: 'Bộ sưu tập mới · ưu đãi thành viên',
  footer_location_label: 'Hội An & TP.HCM',
  // Footer — Legal links
  footer_legal_links: JSON.stringify([
    ['Vận chuyển', '/chinh-sach-van-chuyen'],
    ['Đổi trả', '/chinh-sach-doi-tra'],
    ['Bảo mật', '/chinh-sach-bao-mat'],
    ['Điều khoản', '/dieu-khoan'],
    ['Sơ đồ website', '/so-do-website'],
  ]),
  // Announcement bar
  announcement_bg: '#145530',
  announcement_interval: '4000',
  announcement_effect: 'fade',
  announcement_shimmer: 'true',
  // Product card add button style
  product_card_add_style: 'soft-glass',
  // Homepage — Logo Marquee
  home_marquee_label: 'Tin dùng bởi',
  home_marquee_brands: JSON.stringify(['AEON Mall', 'Vincom', 'Hùng Vương Plaza', 'Paragon Saigon Hotel', 'Beer Station', 'Kaha Living', 'JICA Japan', 'Asiana Plaza']),
  // Homepage — Công trình thực tế
  home_congtrinh_label: 'Công trình thực tế',
  home_congtrinh_heading: 'Đã trang trí hàng trăm không gian trên cả nước',
  home_congtrinh_desc: 'Nhà hàng, quán cafe, khách sạn, trung tâm thương mại, sự kiện — mỗi công trình là một câu chuyện ánh sáng riêng.',
  home_congtrinh_stat1_num: '500+',
  home_congtrinh_stat1_label: 'Công trình',
  home_congtrinh_stat2_num: '8',
  home_congtrinh_stat2_label: 'Năm kinh nghiệm',
  home_congtrinh_cta_text: 'Tư vấn dự án',
  home_congtrinh_cta_phone: '0989778247',
  home_congtrinh_projects: JSON.stringify([
    { file: 'ct-01-longdenviet.webp', label: 'Asiana Plaza TP.HCM', tag: 'Sự kiện' },
    { file: 'ct-02-longdenviet.webp', label: 'Paragon Saigon Hotel', tag: 'Khách sạn' },
    { file: 'ct-03-longdenviet.webp', label: 'Trung tâm thương mại', tag: 'TTTM' },
    { file: 'ct-04-longdenviet.webp', label: 'Nhà hàng phố cổ Hội An', tag: 'Nhà hàng' },
    { file: 'ct-05-longdenviet.webp', label: 'Nhà hàng Nhật Bản', tag: 'Nhà hàng' },
    { file: 'ct-06-longdenviet.webp', label: 'Khu vui chơi trẻ em', tag: 'Showroom' },
    { file: 'ct-07-longdenviet.webp', label: 'Beer Station Nhật Bản', tag: 'Nhà hàng' },
    { file: 'ct-08-longdenviet.webp', label: 'Trung tâm thương mại', tag: 'TTTM' },
    { file: 'ct-09-longdenviet.webp', label: 'Cây thông Noel đèn lồng', tag: 'Sự kiện' },
    { file: 'ct-10-longdenviet.webp', label: 'Sự kiện Nhật Bản — JICA', tag: 'Sự kiện' },
    { file: 'ct-11-longdenviet.webp', label: 'Phố café Hoàng Hôn', tag: 'Quán cafe' },
    { file: 'ct-12-longdenviet.webp', label: 'Sân bay / Nhà ga lớn', tag: 'Sự kiện' },
    { file: 'ct-13-longdenviet.webp', label: 'Nhà hàng Nhật — kệ đèn', tag: 'Nhà hàng' },
    { file: 'ct-14-longdenviet.webp', label: 'Nhà hàng Tatsu', tag: 'Nhà hàng' },
    { file: 'ct-15-longdenviet.webp', label: 'Trung tâm thương mại', tag: 'TTTM' },
    { file: 'ct-16-longdenviet.webp', label: 'Trang trí sự kiện', tag: 'Sự kiện' },
    { file: 'ct-17-longdenviet.webp', label: 'Cổng chùa — đèn hoa sen', tag: 'Tâm linh' },
    { file: 'ct-18-longdenviet.webp', label: 'AEON Mall — sự kiện lớn', tag: 'TTTM' },
    { file: 'ct-19-longdenviet.webp', label: 'Kaha Living Showroom', tag: 'Showroom' },
    { file: 'ct-20-longdenviet.webp', label: 'Kaha Living — phòng khách', tag: 'Showroom' },
    { file: 'ct-21-longdenviet.webp', label: 'Nhà hàng đang thi công', tag: 'Nhà hàng' },
    { file: 'ct-22-longdenviet.webp', label: 'Quán café đèn thả vải', tag: 'Quán cafe' },
    { file: 'ct-23-longdenviet.webp', label: 'Trang trí đường phố', tag: 'Sự kiện' },
    { file: 'ct-24-longdenviet.webp', label: 'Cổng vào trung tâm', tag: 'TTTM' },
    { file: 'ct-25-longdenviet.webp', label: 'Hùng Vương Plaza — dù nghệ thuật', tag: 'TTTM' },
    { file: 'ct-26-longdenviet.webp', label: 'Sự kiện Vincom — Tết Trung Thu', tag: 'Sự kiện' },
  ]),
  // Homepage — Bundle section
  // Chi nhánh Hội An
  cn_hoian_phone: '090.5151.701',
  cn_hoian_address: '90 Hùng Vương, Cẩm Phổ, TP. Hội An, Quảng Nam',
  cn_hoian_mapurl: 'https://maps.google.com/?q=90+Hung+Vuong+Cam+Pho+Hoi+An+Quang+Nam',
  cn_hoian_mapembed: 'https://maps.google.com/maps?q=90+Hung+Vuong+Cam+Pho+Hoi+An+Quang+Nam&output=embed&z=16',
  cn_hoian_hours: JSON.stringify([{ day: 'Thứ 2 – Chủ nhật', time: '8:00 – 21:00' }]),
  cn_hoian_features: JSON.stringify([
    'Đèn lồng thủ công chính gốc Hội An — trực tiếp từ nghệ nhân',
    'Tham quan xưởng sản xuất đèn truyền thống',
    'Đặt làm đèn lồng theo yêu cầu riêng',
    'Hướng dẫn lắp ghép và bảo quản đèn lồng',
  ]),
  // Chi nhánh Hà Nội
  cn_hanoi_phone: '090.5151.701',
  cn_hanoi_address: '314 Đông Hội, Đông Anh, Hà Nội',
  cn_hanoi_mapurl: 'https://maps.google.com/?q=314+Dong+Hoi+Dong+Anh+Ha+Noi',
  cn_hanoi_mapembed: 'https://maps.google.com/maps?q=314+Dong+Hoi+Dong+Anh+Ha+Noi&output=embed&z=16',
  cn_hanoi_hours: JSON.stringify([
    { day: 'Thứ 2 – Thứ 7', time: '8:00 – 18:00' },
    { day: 'Chủ nhật', time: 'Nghỉ' },
  ]),
  cn_hanoi_features: JSON.stringify([
    'Gia công đèn vải theo đơn hàng sỉ lẻ toàn miền Bắc',
    'Tư vấn chọn đèn phù hợp cho nhà hàng, khách sạn, resort',
    'Giao hàng nhanh trong nội thành Hà Nội',
    'Nhận thiết kế đèn theo yêu cầu riêng',
  ]),
  home_bundles: JSON.stringify([
    { "name": "Bộ Đèn Hội An Quán Cafe", "desc": "10 đèn Hội An nhiều màu, phù hợp cafe vintage, giao đầy đủ dây và bóng LED.", "price": "1.890.000đ", "save": "Tiết kiệm 310k", "count": "10 chiếc", "img": "/images/bundle/bundle-cafe-longdenviet.webp" },
    { "name": "Bộ Đèn Cưới Lụa Trắng & Vàng", "desc": "15 đèn lụa size mix, phù hợp tiệc cưới ngoài trời, nhà hàng, ballroom.", "price": "3.200.000đ", "save": "Tiết kiệm 580k", "count": "Set cưới", "img": "/images/bundle/bundle-couoi-longdenviet.webp" },
    { "name": "Bộ Đèn Phòng Khách Boho", "desc": "3 đèn tre boho size lớn + 2 đèn mây nhỏ, tạo điểm nhấn phòng khách tối giản.", "price": "1.450.000đ", "save": "Tiết kiệm 240k", "count": "Combo nhà", "img": "/images/bundle/bundle-boho-longdenviet.webp" },
  ]),
};
