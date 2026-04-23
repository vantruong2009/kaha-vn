---
name: postgres-import-audit
description: Import migration data into Postgres and audit row counts/data integrity. Use when running migration scripts or validating completeness before cutover.
---

# Postgres Import Audit

## Goal
Run safe import and verify data completeness in Postgres.

## Workflow
1. Run dry-run first.
2. Execute actual import only after dry-run is clean.
3. Compare source vs destination counts:
   - posts
   - products
   - settings
   - pages
   - redirects
   - seo_categories
4. Detect anomalies:
   - missing slugs
   - null critical fields
   - broken image references
5. Return fix plan for any mismatch.

## Output format
- `dry_run_status`
- `import_status`
- `count_comparison`
- `anomalies`
- `next_actions`

## Rules
- Do not skip dry-run.
- If mismatch exists, block production cutover.
