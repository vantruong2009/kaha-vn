---
name: r2-upload-and-verify
description: Upload media files to Cloudflare R2 and verify accessibility. Use when migrating WordPress media or troubleshooting missing images.
---

# R2 Upload and Verify

## Goal
Upload site media to Cloudflare R2 safely and verify public availability.

## Required inputs
- Source folder path
- Bucket name
- Prefix (usually per domain/site)
- Public base URL

## Workflow
1. Validate source folder and file count.
2. Upload media in batches.
3. Record failed uploads with reasons.
4. Verify random sample URLs return HTTP 200.
5. Return concise report.

## Output format
- `uploaded_count`
- `failed_count`
- `sample_ok_urls` (5-20 URLs)
- `failed_items` (if any)
- `retry_command`

## Quality gates
- Fail stage if failed_count is non-zero and critical files are missing.
- Do not proceed to production cutover until image verification passes.
