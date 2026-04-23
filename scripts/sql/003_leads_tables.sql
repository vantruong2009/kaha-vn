-- KAHA leads tables (quote + showroom booking) in database kaha_vn.
BEGIN;

CREATE TABLE IF NOT EXISTS quote_requests (
  id BIGSERIAL PRIMARY KEY,
  product_slug TEXT NOT NULL,
  product_title TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  company TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS showroom_bookings (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  visit_date DATE NOT NULL,
  slot TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_showroom_bookings_created_at ON showroom_bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_showroom_bookings_visit_date ON showroom_bookings (visit_date DESC);

COMMIT;
