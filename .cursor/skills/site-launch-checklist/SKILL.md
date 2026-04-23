---
name: site-launch-checklist
description: Run pre-launch verification checklist before DNS cutover. Use before going live for any site migration.
---

# Site Launch Checklist

## Run in order — block launch if any Critical fails

### Content
- [ ] Homepage loads with correct site name and logo
- [ ] Top 5 blog posts accessible and images load
- [ ] Top 5 products accessible and images load
- [ ] Categories navigate correctly
- [ ] Internal links work (no /wp-content/ links remaining)

### SEO
- [ ] `/sitemap.xml` returns valid XML with 10+ URLs
- [ ] `/robots.txt` correct (not blocking Googlebot)
- [ ] Page title and meta description correct on homepage
- [ ] Schema JSON-LD present on product/blog pages
- [ ] Old WP URLs 301 redirect to new Next URLs

### Technical
- [ ] Mobile responsive (test 375px width)
- [ ] SSL valid (Cloudflare Full strict)
- [ ] No console errors on homepage
- [ ] Lighthouse Performance > 80
- [ ] 404 page works and returns HTTP 404

### GA/GSC
- [ ] GA4 tracking fires on pageview
- [ ] GSC domain verified
- [ ] Sitemap submitted to GSC

## Output
- Pass/Fail per item
- Blockers list (must fix before cutover)
- Warnings list (fix within 7 days post-launch)
