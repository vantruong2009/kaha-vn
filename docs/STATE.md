# KAHA.VN — state (handoff)

## Tiến độ (ước lượng)

| Phạm vi | % |
|--------|---|
| **Đến live + cutover (P0–P6, không tính P7 monitoring)** | **~33%** |
| P0 bootstrap + SEO prep | ~74% |
| P1 WP export + R2 | ~24% |
| P2 Obsidian đủ catalog/UI | ~28% |
| P3 tính năng lõi (variants, quote, …) | ~2% |
| P4 import DB + redirect map | ~30% |
| P5 perf budgets | ~0% |
| P6 staging + cutover | ~0% |

P7 (30 ngày giám sát) không tính vào % “tới live”.

- **Phase:** P0 → P1 prep — Docker `standalone` + compose `127.0.0.1:3102`; SEO có list URL từ sitemap (~1107); crawl CSV đầy đủ + GSC còn thiếu.
- **Stack:** Next 16 / React 19 / Tailwind 4; `loading`/`error`/`not-found` Obsidian; security headers trong `next.config`.
- **Build Oracle:** `node >=20.9` (tránh `/usr/bin/node` v16 — làm optional `@tailwindcss/oxide-*` fail). Cursor bundle: `/home/opc/.cursor-server/bin/linux-arm64/.../node`.
- **Safety:** §1c master plan — không đụng site live / ERP; chỉ boundary KAHA.
- **Next:** sau import: `psql … -f scripts/sql/002_content_nodes.sql`; XML→bảng `content_nodes` (script import sau); `NEXT_PUBLIC_MEDIA_BASE` cho ảnh trong body; remote git + GSC + logo.
