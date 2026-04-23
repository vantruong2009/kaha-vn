---
name: wp-export-checklist
description: Prepare and validate WordPress export inputs (XML/CSV/media list). Use when starting migration for a site or when the user asks to export WP data.
---

# WP Export Checklist

## Goal
Collect complete and clean source data from WordPress before migration.

## Inputs to collect
- Domain name
- Has WooCommerce (yes/no)
- XML export path
- Products CSV path (if WooCommerce)
- Media source strategy (REST/API or backup folder)

## Workflow
1. Confirm domain and scope (posts/pages/products/categories/media).
2. Instruct export:
   - WP Admin -> Tools -> Export -> All content -> XML.
   - WooCommerce -> Products -> Export -> CSV (if applicable).
3. Ensure files are present and readable.
4. Produce a normalized handoff block:
   - `domain`
   - `xml_file`
   - `products_csv` (optional)
   - `media_source`
   - `estimated_counts` (if known)

## Validation checks
- XML file exists and non-empty.
- CSV provided when site has products.
- Domain in file names matches target site.
- No missing required input before moving to import stage.
