# KAHA.VN — state (handoff)

- **Phase:** P0 — app Next đã bootstrap; SEO inventory artifact chưa có.
- **Stack:** Next 16 / React 19 / Tailwind 4 (`src/app`, Obsidian tokens + platinum trong `globals.css`).
- **Build Oracle:** `node >=20.9` (tránh `/usr/bin/node` v16 — làm optional `@tailwindcss/oxide-*` fail). Cursor bundle: `/home/opc/.cursor-server/bin/linux-arm64/.../node`.
- **Safety:** §1c master plan — không đụng site live / ERP; chỉ boundary KAHA.
- **Next:** `git init` + remote GitHub `kaha-vn`; SEO baseline inventory (URLs/title/canonical Yoast export); đặt logo PNG vào `public/` khi có file.
