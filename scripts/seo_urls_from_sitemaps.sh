#!/usr/bin/env bash
# Thu thập <loc> từ các sitemap con (đọc từ kaha-sitemap-index-*.txt hoặc truyền URL).
set -euo pipefail
INDEX="${1:-docs/seo-baseline/kaha-sitemap-index-20260423.txt}"
OUT="${2:-docs/seo-baseline/kaha-urls-from-sitemaps-20260423.txt}"
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

while read -r base || [[ -n "${base:-}" ]]; do
  [[ -z "${base// }" ]] && continue
  [[ "$base" =~ ^# ]] && continue
  curl -fsSL --max-time 60 "$base" | sed -n 's:.*<loc>\(.*\)</loc>.*:\1:p' >>"$TMP"
done <"$INDEX"

sort -u "$TMP" >"$OUT"
wc -l <"$OUT" >&2
echo "$OUT"
