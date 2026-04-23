# KAHA.VN — state (handoff)

- **Phase:** P0 → P1 prep — Docker `standalone` + compose `127.0.0.1:3102`; SEO có list URL từ sitemap (~1107); crawl CSV đầy đủ + GSC còn thiếu.
- **Stack:** Next 16 / React 19 / Tailwind 4 (`src/app`, Obsidian tokens + platinum trong `globals.css`).
- **Build Oracle:** `node >=20.9` (tránh `/usr/bin/node` v16 — làm optional `@tailwindcss/oxide-*` fail). Cursor bundle: `/home/opc/.cursor-server/bin/linux-arm64/.../node`.
- **Safety:** §1c master plan — không đụng site live / ERP; chỉ boundary KAHA.
- **Next:** `git remote add origin`; đặt WP XML vào `docs/migration-inputs/`; merge crawl → CSV; GSC; `public/images/logo.png`.
