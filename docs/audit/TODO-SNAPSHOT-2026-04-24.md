# Snapshot tồn đọng (tự động ghi — không thay cho checklist tay)

**Môi trường ghi số liệu:** workspace `kaha-vn`, DB qua `DATABASE_URL` trong `.env.local` (cùng máy chạy lệnh).

## `body_html` rỗng (`publish`)

**Trước** (snapshot đầu): product 475/477 trống — nguyên nhân: WXR WooCommerce gần như không có `content:encoded`, mô tả nằm ở `excerpt:encoded`.

**Sau** khi sửa `scripts/import_wp_xml_content.mjs` (product: fallback `body_html` từ excerpt HTML) + chạy lại `npm run migrate:import-wp-xml -- docs/migration-inputs/wordpress.xml` trên DB workspace:

| post_type | empty_body | total |
|-----------|-------------|-------|
| page      | 4           | 26    |
| post      | 369         | 430   |
| product   | 161         | 477   |

*(empty = `NULL` hoặc chỉ khoảng trắng.)* Còn **161** product: thường là excerpt cũng rỗng / strip hết trong XML — cần bổ sung tay trên WP hoặc nguồn khác. **Post** vẫn nhiều trống: XML post ít khi có excerpt HTML dài khi `content` trống.

## XML vs DB (`npm run migrate:audit`)

- File: `docs/migration-inputs/wordpress.xml` (~15.7 MB, có trên đĩa).
- `delta (importable - DB total): -226` → DB nhiều hơn phần XML “would import” theo rule hiện tại; cần chốt một bản export + import lại hoặc ghi nhận cố ý.

## Docker rebuild

Trên **máy workspace Cursor** lệnh `docker compose … build` **lỗi** `permission denied … /var/run/docker.sock` — không rebuild được từ agent.

**Chạy trên VPS (user có quyền docker), trong thư mục repo** (Oracle workspace ví dụ):

```bash
cd /home/opc/cursor-workspace/projects/kaha-vn && git pull origin main && docker compose --env-file .env.local up -d --build
```

*(Nếu clone ở đường dẫn khác — Mac, Vultr — thay `cd` cho đúng.)*

## Logo

Đã thêm `public/images/logo.png` (tải từ `https://kaha.vn/wp-content/uploads/2025/03/kaha-2025-R.png` — logo header WP).

## Không tự động được từ repo

- **GSC** (tài khoản Google).
- **DNS cutover** (quyền nhà cung cấp DNS).
- **R2 `aws s3 sync`** (credential + chạy trên máy có AWS CLI; không chạy trong phiên này).
- **Homepage / mockup UI** (quyết định thiết kế + khối nội dung).
- **Làm đầy `body_html`** hàng loạt (cần nguồn WP hoặc chỉnh import — không đoán nội dung).
