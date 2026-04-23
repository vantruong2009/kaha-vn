---
name: site-brand-apply
description: Apply brand customization (colors, logo, site name, contact info) to a cloned longdenviet.com skeleton for a new site. Use when setting up a new site's visual identity.
---

# Site Brand Apply

## Goal
Customize cloned longdenviet skeleton for a new domain in under 30 minutes.

## Required inputs
- `domain`: target domain
- `site_name`: display name
- `tagline`: short slogan
- `color_primary`: hex (e.g. #1a6b3c)
- `color_dark`: hex for hover/footer
- `color_accent`: hex for warm accent (default #c9822a)
- `logo_file`: filename in public/images/
- `phone`: hotline display
- `address`: business address
- `email`: contact email
- `facebook_url`: Facebook page

## Files to change
1. `src/app/globals.css` — update 3 CSS variables:
   - `--color-brand-green`
   - `--color-brand-green-dk`
   - `--color-brand-amber`
2. `public/images/logo.png` — replace with new logo
3. DB settings table — upsert 10-15 keys (site_name, tagline, contact_phone, contact_email, contact_address, footer_copyright, footer_location_label, advisor_call_phone, float_phone)

## Do NOT change
- Component logic
- Layout structure
- Checkout/cart/auth
- API routes
- SEO engine

## Output
- List of changed files
- List of DB keys upserted
- Screenshot verification prompt for user
