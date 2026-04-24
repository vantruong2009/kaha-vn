# KAHA.VN — state (handoff)

## Tiến độ (ước lượng)

| Phạm vi | % |
|--------|---|
| **Đến live + cutover (P0–P6, không tính P7 monitoring)** | **~88%** |
| P0 bootstrap + SEO prep | ~82% |
| P1 WP export + R2 | ~32% |
| P2 Obsidian đủ catalog/UI | ~58% |
| P3 tính năng lõi (variants, quote, …) | ~78% |
| P4 import DB + redirect map | ~74% |
| P5 perf budgets | ~52% |
| P6 staging + cutover | ~58% |

P7 (30 ngày giám sát) không tính vào % “tới live”.

- **Phase:** P1 → P2 — Docker `standalone` + compose **`network_mode: host`**, bind `127.0.0.1:3102`, `env_file: .env.local`, `/api/health` **`db: ok`**. **SEO sitemap baseline:** `npm run seo:slug-diff` → **missing 0** (wildcard redirect `danh-muc`/`key`/`p` + script khớp `:path*`); slug archive `product_cat`/`product_tag` (vd. `/gia-cong-den-trang-tri`) → **`/shop?category=`** / **`?tag=`** (308). **R2:** rewrite + `normalizeMediaBase` env; ảnh qua `/_next/image`. Còn: GSC, logo, mockup homepage, DNS.
- **Stack:** Next 16 / React 19 / Tailwind 4; `loading`/`error`/`not-found` Obsidian; skip link `#main-content`; `/feed.xml` (RSS + plain excerpt), `/manifest.webmanifest`, phân trang `/journal` + **ItemList** JSON-LD; trang **`/shop`** (search/filter/pagination/sort), **`/lookbook`** (shop-the-look hotspots), **quote request** (`/api/quote`), **showroom booking** (`/showroom`, `/api/showroom-booking`), **moodboard localStorage** (`/moodboard`), **spec sheet** (`/spec/[slug]` in/lưu PDF); anti-spam leads (honeypot + rate-limit nhẹ); import XML chuẩn hóa excerpt/meta plain text; SQL leads `scripts/sql/003_leads_tables.sql`; one-shot pipeline `npm run migrate:run-all` / `migrate:run-all:dry`; SEO slug diff + redirect candidate merge (`npm run seo:slug-diff`, `npm run seo:merge-redirect-candidates`); `docs/ROLLBACK.md`; `docs/PRELAUNCH-CHECKLIST.md`; `docs/STAGING-RUNBOOK.md`; `npm run prelaunch:check` + `npm run perf:budget` + `npm run staging:smoke`; security headers + CSP trong `next.config`.
- **Build Oracle:** `node >=20.9` (tránh `/usr/bin/node` v16 — làm optional `@tailwindcss/oxide-*` fail). **`npm run dev` / `build` / `lint` / `migrate:*`** gọi `scripts/with-node20.sh` (ưu tiên Node trong `~/.cursor-server/.../linux-arm64/*/node`, hoặc `KAHA_NODE20=/path/node`). `npm install` vẫn có thể cảnh báo EBADENGINE nếu npm dùng Node 16 — có thể bỏ qua nếu đã cài đủ `node_modules`.
- **Safety:** §1c master plan — không đụng site live / ERP; chỉ boundary KAHA.
- **Next (thứ tự):** (1) **R2:** xác nhận sync đủ object (nếu chưa) — `docs/STAGING-RUNBOOK.md` §4c. (2) **Nội dung:** nhiều product vẫn thiếu `body_html` (tuỳ chính sách). (3) **Homepage / UI** theo brand (mockup; hiện `src/app/page.tsx` là hero tối giản). (4) **GSC + logo** `public/images/logo.png`. (5) **DNS cutover.** **Đã xong:** import **933** node (477 product); redirect map + slug diff; `lint` / `prelaunch:check` / `staging:smoke` / `perf:budget` PASS trên build gần nhất.
