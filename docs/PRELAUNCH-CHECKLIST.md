# KAHA.VN Pre-launch Checklist

Checklist ngắn trước cutover DNS.

## 1) Build & health

- `npm run lint`
- `npm run build`
- `npm run prelaunch:check`
- `npm run perf:budget`
- `curl -s http://127.0.0.1:3102/api/health`

## 2) Data integrity

- `npm run migrate:check-inputs -- --strict`
- `psql .../kaha_vn -f scripts/sql/002_content_nodes.sql`
- `psql .../kaha_vn -f scripts/sql/003_leads_tables.sql`
- `DATABASE_URL=.../kaha_vn npm run migrate:import-wp-xml:auto -- --dry-run`
- `DATABASE_URL=.../kaha_vn npm run migrate:import-wp-xml:auto --`
- `DATABASE_URL=.../kaha_vn npm run migrate:audit`
- One-shot option: `DATABASE_URL=.../kaha_vn npm run migrate:run-all -- --apply-redirects`

## 3) SEO / routing

- Kiểm tra `docs/redirects/redirects.json` có đủ redirect cần thiết.
- `DATABASE_URL=.../kaha_vn npm run seo:slug-diff`
- `npm run seo:merge-redirect-candidates` (nếu report có gợi ý hợp lệ)
- Mở và check:
  - `/`
  - `/shop`
  - `/journal`
  - `/lookbook`
  - `/showroom`
  - `/moodboard`
  - `/feed.xml`
  - `/sitemap.xml`
  - 3-5 permalink cũ từ WP (qua redirect + canonical đúng).
  - `KAHA_CHECK_URL=http://127.0.0.1:3102 npm run staging:smoke`

## 4) Content sanity

- 10 sản phẩm có ảnh hero hiển thị đúng.
- 10 bài Journal hiển thị excerpt không còn HTML rác.
- Product page:
  - Moodboard toggle hoạt động
  - Quote request gửi thành công
  - Link Spec sheet mở `/spec/[slug]` + in/PDF được

## 5) Go-live safety

- Xác nhận backup DB + snapshot media trước cutover.
- Đọc lại `docs/ROLLBACK.md` (đảm bảo rollback command sẵn sàng).
- Chỉ thao tác boundary KAHA: DB `kaha_vn`, R2 `kaha/`, port 3102.
