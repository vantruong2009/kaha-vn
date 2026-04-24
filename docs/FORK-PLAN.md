# FORK-PLAN — KAHA kế thừa longdenviet với luxury overlay

> Tạo: 2026-04-24 · Branch: `redesign/fork-longdenviet` · Archive: `archive/pre-fork-v1`

## Bối cảnh

Theo user confirm: **KAHA.VN chung brand với longdenviet.com**, kế thừa ĐẦY ĐỦ tính năng e-commerce (cart / checkout / auth / wishlist / admin / payment), nhưng UI sang trọng hơn theo Obsidian design system.

KAHA hiện tại mới ~15% so với longdenviet:
- 10 pages vs 71
- 4 APIs vs 74
- 19 components vs 58

Strategy: **Fork + Rebrand + Luxury Overlay** (4-6 ngày liên tục).

## Nguồn

- Longdenviet source (Oracle): `/home/opc/cursor-workspace/projects/longdenviet/`
- Git: `https://github.com/vantruong2009/longdenviet.git`
- CLAUDE.md / RUNBOOK / SAFE_RUNBOOK trong repo đó

## Phát hiện kiến trúc quan trọng

- Longdenviet có **DUAL backend**: Supabase (Vercel prod) HOẶC VPS Postgres (self-host)
- `src/lib/postgres/commerce.ts` (1,070 dòng) đã handle VPS Postgres cho cart/checkout
- KAHA dùng VPS Postgres (Oracle) → dùng path VPS của longdenviet, không đụng Supabase
- Migration `deploy/vps/migrations/002-customer-auth.sql` — auth tự host không cần Supabase Auth
- Schema tables chính (products, orders, customers, ...) nằm trong `supabase/migration.sql` (254 dòng) — apply thẳng lên Postgres raw được

## Conflict matrix — KAHA hiện tại vs Longdenviet

| KAHA | Longdenviet | Quyết định |
|---|---|---|
| `src/app/page.tsx` (mockup đơn giản 103 dòng) | `(main)/page.tsx` (1,181 dòng, nhiều section đặc thù đèn lồng) | KHÔNG copy homepage. Dùng `/home-mockup v2` vừa ship làm homepage KAHA |
| `src/app/[...slug]/page.tsx` (catch-all WP 301) | `(main)/[slug]/page.tsx` + `(main)/[slug]/feed/` | Giữ catch-all KAHA để handle 301 từ WP cũ |
| `src/app/shop/page.tsx` | `(main)/san-pham/page.tsx` | Redirect `/shop → /san-pham` (KAHA đổi sang slug chuẩn longdenviet) |
| `src/app/journal/page.tsx` | `(main)/blog/page.tsx` + `[slug]` | Redirect `/journal → /blog` |
| `src/app/moodboard`, `lookbook`, `showroom`, `spec`, `home-mockup` | (không có) | Giữ — KAHA-exclusive luxury extras |
| `src/app/admin/settings/page.tsx` | `admin/*` (23 trang) | Phase 4-5, chưa copy |
| `src/app/layout.tsx` đơn giản | Route group `(main)/layout.tsx` với 4 providers (Cart/Wishlist/QuickView/Toast) | Dùng route group pattern, Phase 1 bỏ providers |
| `next.config.ts` đọc redirects từ JSON | `next.config.ts` có 300+ redirects inline + Sentry wrapper + CSP chi tiết | Merge — giữ JSON pattern, thêm security headers, bỏ Sentry |
| (chưa có) `middleware.ts` | `middleware.ts` noindex admin subdomain + strip WooCommerce query | Copy, thay `longdenviet.com → kaha.vn` |
| (chưa có) `src/context/*` | CartContext, WishlistContext, QuickViewContext, ToastContext | Phase 4 (khi port cart) |

## Scope Phase 1 đã chỉnh

**KHÔNG copy:**
- Homepage 1,181 dòng (dùng `/home-mockup v2`)
- Cart/Wishlist/QuickView providers + drawers
- AuthButton, AddToCartButton, MiniCartDrawer, WishlistDrawer, QuickViewSheet
- LanternAdvisor, CustomCursor, ScrollProgress, FxInit, ContactPopup, ZaloQRFloat
- Admin panel 23 trang
- Auth flow pages + OAuth routes
- Payment VNPay/MoMo routes
- AI advisor-chat / seo-ai / dwt-watermark / ai-generate

**COPY:**
- Route group `(main)/` + `layout.tsx` (rút gọn — chỉ Header + Footer + ScrollReveal)
- Shell components: `Header`, `HeaderSpacer`, `Footer`, `NavMegaMenu`, `MobileMenuDrawer`, `MobileBottomNav`, `SearchModal`, `AnnouncementBar`, `TopBar`, `ScrollRevealInit`, `ScrollToTopOnNav`, `Breadcrumb`, `FloatingButtons`, `FallbackImage`, `LogoMarquee`
- Product components: `ProductCard`, `ProductCardSimple`, `ProductCarousel`, `ProductDetailClient`, `CategoryBar`, `HomeBestsellersSection`
- Page components: `DeliverySection`, `PolicyContactBox`, `NewsletterForm`, `ReviewsSection`, `ReviewCard`
- Pages P1: `(main)/san-pham/`, `(main)/p/[slug]/`, `(main)/c/[slug]/`, `(main)/blog/`, `(main)/blog/[slug]/`, `(main)/lien-he/`, `(main)/[slug]/` (WP pages catch-all)
- APIs P1: `api/search/`, `api/public/site-settings/`, `api/public/redirects/`, `api/public/products-by-slugs/`, `api/contact/`, `api/coupon/validate/`, `api/popup-config/`, `api/revalidate/`, `api/indexnow/`
- Lib core: `src/lib/postgres/server.ts`, `commerce.ts` (hàm đọc-only Phase 1), `products-db.ts`, `getPosts.ts`, `get-page.ts`, `format-price.ts`, `sanitize.ts`, `rateLimit.ts`, `csrf.ts`, `env.ts`, `public-site-url.ts`, `r2-public-url.ts`, `site-settings.ts`, `site-settings-server.ts`, `site-settings-public.ts`, `slug-map.ts` (sẽ regenerate từ schema KAHA Phase 3)
- `middleware.ts` adapt cho `kaha.vn`
- Package deps thêm: `pg` (đã có), `sharp`, `zod`, `resend` (phase 4), `jose` (phase 4), `bcryptjs` (phase 4), `@upstash/ratelimit` + `@upstash/redis` (rate-limit)

## Schema DB — Phase 3

Sau Phase 1-2 build pass + luxury OK:

1. `pg_dump` DB kaha_vn hiện tại → backup
2. Apply `supabase/migration.sql` + `deploy/vps/migrations/002-customer-auth.sql` lên kaha_vn
3. ETL script: map data hiện tại (schema migration WP) → schema longdenviet
   - products: 477 SKU → `products` table với columns longdenviet
   - posts/pages: → `posts`, `pages`
   - categories: → `categories`
   - media: → `media`
4. Regenerate `slug-map.ts` từ DB mới

## Timeline ước lượng

| Phase | Session # | Nội dung |
|---|---|---|
| 0 | 1 (session này) | Archive branch, fork branch, audit, FORK-PLAN.md — DONE |
| 1a | 2 | Deps + lib utilities (format-price, sanitize, pg/server, csrf, rateLimit, env, r2, sanitize) + site-settings fallback tĩnh |
| 1b | 3 | Shell components (Header/Footer/Nav/Mobile/Search/Reveal/Breadcrumb/FloatingButtons/Fallback) |
| 1c | 4 | Pages core (san-pham, p/[slug], c/[slug], blog, blog/[slug], lien-he) + APIs P1 |
| 1d | 5 | middleware.ts + next.config merge + route group layout adapt + build pass + smoke test |
| 2 | 6-7 | Luxury overlay: globals.css override + Header/Footer/Nav luxury + ProductCard plate + homepage KAHA |
| 3 | 8 | DB backup + apply schema + ETL + regenerate slug-map |
| 4 | 9-10 | Cart providers + MiniCartDrawer + AddToCart + checkout + order tracking + wishlist + customer auth (không OAuth) |
| 5 (optional) | 11+ | Admin panel + Payment + OAuth + AI advisor |

## Quy tắc an toàn khi fork

1. KHÔNG đụng `archive/pre-fork-v1` — chỉ làm trên `redesign/fork-longdenviet`
2. KHÔNG apply schema longdenviet lên kaha_vn cho tới Phase 3 (sau khi luxury UI pass)
3. KHÔNG wipe data 477 SKU hiện có — backup pg_dump trước Phase 3
4. KHÔNG push tự động — push khi user approve mỗi phase hoặc cuối buổi
5. Mỗi session: commit ít nhất 1 lần với scope rõ, build + tsc pass
6. Giữ `/home-mockup v2` làm reference luxury
7. Giữ `docs/STATE.md` update sau mỗi session

## Files phải KHÔNG XOÁ khi copy

- `src/app/home-mockup/` — reference luxury design
- `src/app/moodboard`, `lookbook`, `showroom`, `spec` — KAHA-exclusive
- `src/app/api/showroom-booking/`, `api/quote/` — KAHA-exclusive APIs
- `src/app/api/health/` — Docker healthcheck
- `src/server/*` — KAHA current data layer (sẽ retire sau Phase 3)
- `src/app/globals.css` — KAHA Obsidian tokens (sẽ merge với longdenviet base + override)
- `docs/`, `scripts/`, `supabase/`, `public/images/` — migration & asset artifacts
- `docker-compose.yml`, `Dockerfile` — deploy config Oracle VPS

## Risk register

| Rủi ro | Mitigation |
|---|---|
| Token budget cạn giữa Phase | Chia mỗi session 1 batch, docs/FORK-PLAN.md là handoff |
| Build fail sau bulk copy do deps thiếu | Copy theo batch, install deps từng batch |
| Supabase client calls còn trong code sau copy | Replace `@/lib/supabase/*` → stub hoặc pg equivalent |
| Schema conflict khi ETL | pg_dump + test apply trên 1 schema tạm trước |
| Homepage longdenviet không fit luxury | Không copy — dùng home-mockup v2 |
| Design token conflict (green vs ink) | globals.css override sau copy, không sửa từng file |
| Translation effort lớn (longdenviet → kaha content) | Giữ kỹ thuật longdenviet, chỉ thay brand/text surface |

## Ghi chú quan trọng

- Cùng hộ kinh doanh (Kaha Home, 262/1/93 Phan Anh, Phú Thạnh, Tân Phú, TP.HCM, MST 079192026914)
- Hotline: 0989.778.247 / Zalo 0905.151.701 / Email sales@longdenviet.com — KAHA cần hotline + email riêng hay dùng chung? (chờ user confirm)
- Domain: kaha.vn — cần sub-domain staging? staging.kaha.vn hay kaha-staging.local?
- Font direction ngược nhau: longdenviet = Be Vietnam Pro no-italic; KAHA Obsidian = Playfair + Inter có italic. GIỮ Obsidian direction cho KAHA.

## Current deliverable Phase 0

- [x] Branch `archive/pre-fork-v1` tạo từ main + push GitHub
- [x] Branch `redesign/fork-longdenviet` tạo + push GitHub
- [x] Audit conflict + FORK-PLAN.md (file này)
- [ ] (Session sau) Bắt đầu Phase 1a
