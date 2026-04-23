# SEO baseline — KAHA.VN

Theo skill `seo-baseline-preserve`: crawl CSV đầy đủ + GSC export lưu cùng thư mục này.

Có sẵn: snapshot home JSON, leaf sitemap, slug stub, URL list (~1107), **`kaha-seed-crawl-20260423.csv`**. Import Postgres (`seo_baseline`): `DATABASE_URL=postgresql://…/kaha_vn npm run migrate:import-seo-baseline` sau khi chạy **`scripts/sql/001_seo_baseline.sql`** trên DB **`kaha_vn`**. App: `/sitemap.xml`, `/robots.txt`. Full crawl Yoast columns + GSC export vẫn thiếu.
