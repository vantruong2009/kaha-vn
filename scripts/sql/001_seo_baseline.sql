-- Áp dụng CHỈ trên database kaha_vn (vps-postgres). Không chạy trên DB dùng chung site khác.
BEGIN;

CREATE TABLE IF NOT EXISTS seo_baseline (
  url TEXT PRIMARY KEY,
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  canonical TEXT,
  robots TEXT,
  og_image TEXT,
  json_ld_types TEXT[],
  imported_at TIMESTAMPTZ DEFAULT now()
);

COMMIT;
