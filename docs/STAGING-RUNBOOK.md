# KAHA.VN Staging Runbook

Runbook rút gọn để kiểm tra staging trước cutover.

## 1. Chuẩn bị env

- Copy `.env.example` -> `.env.local` tại root project. `docker compose` **đọc** `.env.local` qua `env_file` (không đóng gói vào image).
- Bắt buộc:
  - `NEXT_PUBLIC_SITE_URL=https://staging.kaha.vn` (hoặc URL staging thật)
  - `DATABASE_URL=.../kaha_vn`
  - `NEXT_PUBLIC_MEDIA_BASE=.../kaha` (nếu đã dùng R2)

## 2. Build và chạy

- `npm run lint`
- `npm run build`
- `docker compose --env-file .env.local up -d --build` (`network_mode: host` + `HOSTNAME=127.0.0.1` — để **build** nhận `NEXT_PUBLIC_MEDIA_BASE` / `NEXT_PUBLIC_SITE_URL` vì `.env.local` không nằm trong Docker build context)
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

## 4c. R2 — sync `wp-content/uploads` → prefix `kaha/`

- Code thay `https://kaha.vn/wp-content/uploads/` → `NEXT_PUBLIC_MEDIA_BASE/` (`src/lib/rewrite-kaha-media-url.ts`). Ví dụ `NEXT_PUBLIC_MEDIA_BASE=https://pub-….r2.dev/kaha` (không slash cuối).
- Object trên R2 (bucket `media`) cần key dạng `kaha/<năm>/<tháng>/…` khớp đường dẫn sau `uploads/` (vd. file WP `…/uploads/2024/10/x.jpg` → key `kaha/2024/10/x.jpg`).
- **Oracle** (đặt credential trong `~/.aws/credentials` hoặc env; `ACCOUNT_ID` từ dashboard R2):

```bash
export AWS_DEFAULT_REGION=auto
export AWS_ENDPOINT_URL=https://ACCOUNT_ID.r2.cloudflarestorage.com
aws s3 sync /var/www/kaha.vn/httpdocs/wp-content/uploads/ s3://media/kaha/ --only-show-errors
```

- Sau khi sync + đã có `NEXT_PUBLIC_MEDIA_BASE` trong `.env.local`: `docker compose up -d --build`, mở `/shop` — `src` ảnh phải trỏ R2 (hoặc `/_next/image?url=…r2…`).

## 5. SEO & feed

- `/robots.txt`, `/sitemap.xml`, `/feed.xml`
- canonical và OG đúng origin staging
- 5 URL redirect legacy từ `docs/redirects/redirects.json`

## 6. Điều kiện pass staging

- `lint` + `build` + `prelaunch:check` + `staging:smoke` + `perf:budget` đều pass
- Không có lỗi 5xx khi click flow chính
- DB `kaha_vn` chứa dữ liệu import đủ theo `migrate:audit`
