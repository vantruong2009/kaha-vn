---
name: staging-to-production-cutover
description: Execute safe cutover from staging to production with DNS and health checks. Use when a site is staging-ready and user asks to go live.
---

# Staging to Production Cutover

## Goal
Cut over safely with rollback readiness.

## Preconditions
- Staging checks passed.
- Redirect map validated.
- Sitemap and robots valid.
- Critical 404 = 0.

## Workflow
1. Confirm target domain and current DNS records.
2. Prepare production deployment (Vultr).
3. Apply Cloudflare DNS changes.
4. Validate SSL mode (Full strict) and origin cert readiness.
5. Run post-cutover checks:
   - homepage
   - key landing pages
   - key blog/product URLs
   - image loading
6. Monitor error signals (5xx/404 spike) for 30-60 minutes.

## Output format
- `cutover_status`
- `dns_changes`
- `health_check_result`
- `rollback_plan`

## Rules
- No cutover without preconditions.
- Keep rollback path documented before DNS switch.
