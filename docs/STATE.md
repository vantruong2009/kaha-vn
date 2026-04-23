# KAHA.VN — state (handoff)

## Tiến độ (ước lượng)

| Phạm vi | % |
|--------|---|
| **Đến live + cutover (P0–P6, không tính P7 monitoring)** | **~85%** |
| P0 bootstrap + SEO prep | ~82% |
| P1 WP export + R2 | ~32% |
| P2 Obsidian đủ catalog/UI | ~58% |
| P3 tính năng lõi (variants, quote, …) | ~78% |
| P4 import DB + redirect map | ~66% |
| P5 perf budgets | ~52% |
| P6 staging + cutover | ~47% |

P7 (30 ngày giám sát) không tính vào % “tới live”.

- **Phase:** P0 → P1 prep — Docker `standalone` + compose `127.0.0.1:3102`; SEO có list URL từ sitemap (~1107); crawl CSV đầy đủ + GSC còn thiếu.
- **Stack:** Next 16 / React 19 / Tailwind 4; `loading`/`error`/`not-found` Obsidian; skip link `#main-content`; `/feed.xml` (RSS + plain excerpt), `/manifest.webmanifest`, phân trang `/journal` + **ItemList** JSON-LD; trang **`/shop`** (search/filter/pagination/sort), **`/lookbook`** (shop-the-look hotspots), **quote request** (`/api/quote`), **showroom booking** (`/showroom`, `/api/showroom-booking`), **moodboard localStorage** (`/moodboard`), **spec sheet** (`/spec/[slug]` in/lưu PDF); anti-spam leads (honeypot + rate-limit nhẹ); import XML chuẩn hóa excerpt/meta plain text; SQL leads `scripts/sql/003_leads_tables.sql`; one-shot pipeline `npm run migrate:run-all` / `migrate:run-all:dry`; SEO slug diff + redirect candidate merge (`npm run seo:slug-diff`, `npm run seo:merge-redirect-candidates`); `docs/ROLLBACK.md`; `docs/PRELAUNCH-CHECKLIST.md`; `docs/STAGING-RUNBOOK.md`; `npm run prelaunch:check` + `npm run perf:budget` + `npm run staging:smoke`; security headers + CSP trong `next.config`.
- **Build Oracle:** `node >=20.9` (tránh `/usr/bin/node` v16 — làm optional `@tailwindcss/oxide-*` fail). **`npm run dev` / `build` / `lint` / `migrate:*`** gọi `scripts/with-node20.sh` (ưu tiên Node trong `~/.cursor-server/.../linux-arm64/*/node`, hoặc `KAHA_NODE20=/path/node`). `npm install` vẫn có thể cảnh báo EBADENGINE nếu npm dùng Node 16 — có thể bỏ qua nếu đã cài đủ `node_modules`.
- **Safety:** §1c master plan — không đụng site live / ERP; chỉ boundary KAHA.
- **Next:** R2 + `NEXT_PUBLIC_MEDIA_BASE` (ảnh body); rà 831 URL baseline (`docs/seo-baseline/seo-slug-diff-report.json`) + redirect; `sudo usermod -aG docker opc` rồi SSH lại (bỏ `sudo docker compose`); GSC + logo; DNS/cutover khi sẵn sàng. **Đã xong gần đây:** `pg_hba` scram + `.env.local`; import 240 nodes + merge redirect; `staging:smoke` + `prelaunch:check` + `perf:budget` PASS; commit `3558f8c` push `origin/main`.
