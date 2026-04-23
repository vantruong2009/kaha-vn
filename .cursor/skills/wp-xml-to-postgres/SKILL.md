---
name: wp-xml-to-postgres
description: Parse WordPress XML export and products XML, normalize data, import into VPS Postgres. Use when migrating a WordPress site's content to the Next.js stack.
---

# WP XML → Postgres Import

## Inputs required
- `xml_all`: path to WordPress full XML export
- `xml_products`: path to WooCommerce products XML (optional)
- `site_domain`: target domain
- `uploads_dir`: local path to wp-content/uploads
- `r2_prefix`: R2 storage prefix for this site

## What to keep
- post_type: post, page, product
- Fields: title, slug, content, excerpt, thumbnail, categories, tags, date, meta (Yoast SEO)

## What to discard
- post_type: attachment, shop_order, nav_menu_item, amp_validated_url, wp_global_styles
- WP shortcodes: strip [gallery], [caption], [vc_row], [vc_column], all [/...] blocks
- WP block comments: `<!-- wp:... -->` `<!-- /wp:... -->`
- Elementor/Visual Composer markup

## Media URL rewrite rule
`https://dengiasi.com/wp-content/uploads/` → `https://pub-xxx.r2.dev/dengiasi/`

## Import sequence
1. Dry-run: count rows to insert/update per table
2. Import: posts → pages → products → categories → redirects
3. Audit: compare counts, flag null slugs, missing images

## Output
- `import_summary`: counts per table
- `anomalies`: list of issues
- `next_step`: r2-upload-and-verify or fix anomalies first
