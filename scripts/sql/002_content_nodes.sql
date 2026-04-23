-- content_nodes — bài/page/product sau import WP (DB kaha_vn only).
BEGIN;

CREATE TABLE IF NOT EXISTS content_nodes (
  id BIGSERIAL PRIMARY KEY,
  wp_post_id INTEGER,
  post_type TEXT NOT NULL CHECK (post_type IN ('post', 'page', 'product')),
  slug TEXT NOT NULL,
  title TEXT,
  body_html TEXT,
  excerpt TEXT,
  status TEXT NOT NULL DEFAULT 'publish',
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  featured_image_source_url TEXT,
  categories TEXT[],
  tags TEXT[],
  imported_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT content_nodes_slug_unique UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_content_nodes_post_type ON content_nodes (post_type);
CREATE INDEX IF NOT EXISTS idx_content_nodes_published ON content_nodes (published_at DESC);

COMMIT;
