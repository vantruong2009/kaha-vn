# KAHA.VN Staging Runbook

Runbook rút gọn để kiểm tra staging trước cutover.

## 1. Chuẩn bị env

- Copy `.env.example` -> `.env.local` (hoặc env compose).
- Bắt buộc:
  - `NEXT_PUBLIC_SITE_URL=https://staging.kaha.vn` (hoặc URL staging thật)
  - `DATABASE_URL=.../kaha_vn`
  - `NEXT_PUBLIC_MEDIA_BASE=.../kaha` (nếu đã dùng R2)

## 2. Build và chạy

- `npm run lint`
- `npm run build`
- `docker compose up -d --build`
- `curl -s http://127.0.0.1:3102/api/health`

## 3. Smoke + budget

- `KAHA_CHECK_URL=http://127.0.0.1:3102 npm run staging:smoke`
- `npm run perf:budget`

## 4. Kiểm tra nghiệp vụ chính

- `/shop`:
  - search / category / tag / sort / pagination
- Product detail:
  - Moodboard toggle
  - Quote request submit thành công
  - Spec sheet mở được (`/spec/[slug]`)
- `/showroom`:
  - submit lịch hẹn (`status=ok`)
- `/lookbook`:
  - hotspot dẫn sang query `/shop?...`

## 4b. Import one-shot (khi có XML thật)

- Đặt XML vào `docs/migration-inputs/`
- Chạy dry-run:
  - `DATABASE_URL=.../kaha_vn npm run migrate:run-all:dry`
- Chạy thật + merge redirect candidates:
  - `DATABASE_URL=.../kaha_vn npm run migrate:run-all -- --apply-redirects`

## 5. SEO & feed

- `/robots.txt`, `/sitemap.xml`, `/feed.xml`
- canonical và OG đúng origin staging
- 5 URL redirect legacy từ `docs/redirects/redirects.json`

## 6. Điều kiện pass staging

- `lint` + `build` + `prelaunch:check` + `staging:smoke` + `perf:budget` đều pass
- Không có lỗi 5xx khi click flow chính
- DB `kaha_vn` chứa dữ liệu import đủ theo `migrate:audit`
