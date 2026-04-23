# KAHA.VN — state (handoff)

- **Phase:** P0 — app Next bootstrapped; SEO baseline folder + home/sitemap/slug stub; full crawl CSV + GSC còn thiếu.
- **Stack:** Next 16 / React 19 / Tailwind 4 (`src/app`, Obsidian tokens + platinum trong `globals.css`).
- **Build Oracle:** `node >=20.9` (tránh `/usr/bin/node` v16 — làm optional `@tailwindcss/oxide-*` fail). Cursor bundle: `/home/opc/.cursor-server/bin/linux-arm64/.../node`.
- **Safety:** §1c master plan — không đụng site live / ERP; chỉ boundary KAHA.
- **Next:** `git remote add origin` (khi có URL); Screaming Frog / crawl → `docs/seo-baseline/kaha-YYYYMMDD.csv`; GSC export; copy `kaha-2025-R.png` → `public/images/logo.png`.
