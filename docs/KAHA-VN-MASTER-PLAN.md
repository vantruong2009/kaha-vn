# KAHA.VN — Master Plan (Enterprise Next.js)

Tài liệu nguồn sự thật cho dự án KAHA.VN. Agent đọc file này trước khi thao tác. Ngắn gọn, đúng trọng tâm, không lặp lại kiến thức phổ thông.

## 1. Bối cảnh

- KAHA.VN là site đèn cao cấp, đang live bản WordPress trên Oracle `129.150.50.69`.
- Stack Next.js đích: Vultr `45.76.150.11` (cùng stack với longdenviet + dennhat), port `127.0.0.1:3102`.
- Dùng chung Postgres container `vps-postgres` (database mới `kaha_vn`).
- Dùng chung R2 bucket `media`, prefix `kaha/`.
- Cloudflare DNS + SSL + CDN.

## 1c. An toàn đa site / ERP

- Không thao tác gây mất dữ liệu hoặc ảnh hưởng site đang live khác và **ERP**. Chỉ đụng boundary KAHA: DB `kaha_vn`, R2 prefix `kaha/`, container port **3102**. Không migrate đơn Woo vào Next; không đụng schema/DB dùng chung ngoài scope đã phân quyền.

## 1b. Dev workflow (SSH → Oracle)

MacBook máy yếu, không chạy dev local. Mọi việc build + code + test diễn ra trên Oracle VPS qua Cursor Remote SSH.

- Cursor Desktop chạy trên MacBook.
- Remote SSH: host alias `oracle-migration` (user `opc`, ip `129.150.50.69`, key `~/.ssh/id_ed25519`).
- Workspace root: `/home/opc/cursor-workspace/projects/kaha-vn/`.
- `.cursor/rules/*`, `.cursor/skills/*`, `docs/*` của dự án nằm trên Oracle, load tự động khi mở workspace.
- `~/.cursor/skills/agent-economy`, `seo-baseline-preserve`, `~/.cursor/hooks/*` nằm trên MacBook, áp dụng mọi session Remote SSH.
- Permission: tất cả file/thư mục dự án owner `opc`, mode 700 (thư mục) hoặc 600 (file nhạy cảm). Không ai ngoài `opc` và `root` đọc được.
- Git remote: GitHub repo riêng `kaha-vn`, clone tại `/home/opc/cursor-workspace/projects/kaha-vn/`.
- Deploy target: Vultr `45.76.150.11` qua `git push` + `docker compose up -d --build`.

## 2. Mục tiêu thành công

| Tiêu chí | Ngưỡng |
|----------|--------|
| Giữ thứ hạng SEO | ≥ 95% keyword top-20 không rớt 30 ngày sau cutover |
| LCP mobile | < 2.0s |
| INP | < 150ms |
| CLS | < 0.05 |
| Lighthouse Performance | ≥ 95 |
| Lighthouse SEO | 100 |
| First-load JS | < 120KB gzipped |
| Uptime | ≥ 99.9% 30 ngày đầu |

## 3. Quyết định kiến trúc (đã chốt)

- **Repo**: riêng tại `/Users/ga/Documents/claude/9sites/kaha-vn`, clone sườn từ longdenviet rồi tách.
- **Database**: `kaha_vn` trên `vps-postgres`.
- **Bucket**: `media` prefix `kaha/`.
- **Port container**: `3102`.
- **Design system**: tone đen-trắng, accent platinum (Obsidian tokens trong skill).
- **Admin**: `admin.kaha.vn` tách riêng admin của longdenviet.
- **Staging**: `staging.kaha.vn` trỏ Oracle trong phase build, Vultr sau cutover.

## 4. Công nghệ Next.js áp dụng

- Next.js 16 + React 19 + Turbopack.
- Partial Prerendering cho trang sản phẩm.
- `use cache` directive với tag theo từng sản phẩm.
- `after()` API cho analytics không chặn response.
- View Transitions API cho chuyển trang.
- Typed Routes để bắt link chết lúc build.
- AVIF ưu tiên, fallback WebP.
- Instrumentation hook tích hợp Sentry + OpenTelemetry.

## 5. Tính năng cốt lõi

Cắt bớt tính năng hào nhoáng ít giá trị. Giữ nhóm tăng conversion thực.

**Bắt buộc**:
- Variant system (màu × size × công suất) mỗi SKU riêng giá/ảnh/stock.
- Filter cao cấp: chất liệu, nhiệt độ màu (K), công suất, phong cách.
- Lookbook/Collection pages dạng editorial.
- Hover video preview ≤ 500KB `preload="none"`.
- Shop the look: hotspot sản phẩm trong ảnh lifestyle.
- Spec sheet PDF tự sinh cho mỗi sản phẩm.
- Moodboard (localStorage + sync sau login).
- Quote request cho B2B, tách với "Thêm vào giỏ".
- Showroom booking calendar.

**Phase 2** (sau launch): 360° viewer, AR room visualizer — chỉ thêm nếu traffic yêu cầu.

## 6. Roadmap phase

| Phase | Nội dung | Ngày |
|-------|----------|------|
| P0 | Bootstrap repo + SEO inventory | 1 |
| P1 | Export WP + upload R2 | 1-2 |
| P2 | Design system Obsidian | 2 |
| P3 | Công nghệ Next + tính năng cốt lõi | 3 |
| P4 | Import data + rewrite URL + redirect | 2 |
| P5 | Performance tuning đạt budget | 1 |
| P6 | Staging diff + cutover | 1 đêm |
| P7 | Monitoring 30 ngày | 30 |

Tổng thực thi code: 8-10 ngày làm việc.

## 7. Rủi ro & Rollback

- WordPress Oracle chỉ **stop** sau cutover, không xóa, giữ 14 ngày.
- DNS TTL hạ 60s trước cutover 24h.
- Backup Postgres + R2 snapshot trước cutover.
- File `docs/ROLLBACK.md` gồm 5 lệnh DNS + 2 lệnh `docker compose` là đủ quay về cũ.
- Ngưỡng báo động: traffic giảm > 15% vs baseline → rollback ngay.

## 8. Nguồn tham chiếu

- Rule umbrella: `.cursor/rules/kaha-vn-migration.mdc`
- Design system: `.cursor/skills/kaha-design-obsidian/SKILL.md`
- SEO baseline: `~/.cursor/skills/seo-baseline-preserve/SKILL.md`
- Token & model: `~/.cursor/skills/agent-economy/SKILL.md`
- 7-sites flow có sẵn: `.cursor/rules/kaha-7-sites-migration.mdc` + các skill `wp-xml-to-postgres`, `site-brand-apply`, `postgres-import-audit`, `r2-upload-and-verify`, `site-launch-checklist`, `staging-to-production-cutover`.

## 9. Quyết định đã chốt

- **Logo:** Dùng PNG tạm (`kaha-2025-R.png`); SVG sau khi có vector.
- **Accent UI:** **Platinum / brushed nickel** (OKLCH cool metallic, chroma thấp — premium hơn champagne trang trí). Chi tiết token trong `kaha-design-obsidian` skill.
- **Đơn WooCommerce:** Không migrate; đơn cũ nằm ngoài phạm vi Next (coi như xoá khỏi migration).
