#!/usr/bin/env node
/**
 * Merge suggested redirects from seo-slug-diff-report into redirects.json safely.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const REPORT = path.join(ROOT, "docs/seo-baseline/seo-slug-diff-report.json");
const REDIRECTS = path.join(ROOT, "docs/redirects/redirects.json");

if (!fs.existsSync(REPORT)) {
  console.error("Missing report: docs/seo-baseline/seo-slug-diff-report.json");
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(REPORT, "utf8"));
const suggested = Array.isArray(report.suggested_redirects)
  ? report.suggested_redirects
  : [];

const current = fs.existsSync(REDIRECTS)
  ? JSON.parse(fs.readFileSync(REDIRECTS, "utf8"))
  : [];
const rows = Array.isArray(current) ? current : [];

const key = (x) => `${x.source} -> ${x.destination}`;
const seen = new Set(rows.map(key));
let added = 0;
for (const s of suggested) {
  if (!s?.source || !s?.destination) continue;
  if (seen.has(key(s))) continue;
  rows.push({ source: s.source, destination: s.destination, permanent: true });
  seen.add(key(s));
  added++;
}

rows.sort((a, b) => String(a.source).localeCompare(String(b.source)));
fs.writeFileSync(REDIRECTS, JSON.stringify(rows, null, 2));
console.log(`redirects merged: +${added}, total=${rows.length}`);
