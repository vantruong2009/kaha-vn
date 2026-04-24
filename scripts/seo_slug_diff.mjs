#!/usr/bin/env node
/**
 * Diff URL baseline (WP) vs Next target (content_nodes + app routes + redirects).
 * Requires DATABASE_URL to compare DB slugs.
 */
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const ROOT = path.join(import.meta.dirname, "..");
const BASELINE_FILE =
  process.argv[2] ||
  "docs/seo-baseline/kaha-urls-from-sitemaps-20260423.txt";
const REDIRECT_FILE = "docs/redirects/redirects.json";
const OUT_FILE = "docs/seo-baseline/seo-slug-diff-report.json";

function readLines(absPath) {
  const raw = fs.readFileSync(absPath, "utf8");
  return raw
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function normalizePath(input) {
  try {
    const u = new URL(input.startsWith("http") ? input : `https://kaha.vn${input}`);
    const p = u.pathname.replace(/\/+$/, "") || "/";
    return p.toLowerCase();
  } catch {
    return "/";
  }
}

function ensureRedirectShape(rows) {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((x) => x && typeof x.source === "string" && typeof x.destination === "string")
    .map((x) => ({
      source: x.source,
      destination: x.destination,
      permanent: x.permanent !== false,
    }));
}

function heuristicRedirectFor(pathname) {
  if (pathname === "/blog" || pathname === "/blog/") return "/journal";
  if (pathname.startsWith("/category/")) return "/journal";
  if (pathname.startsWith("/tag/")) return "/journal";
  return null;
}

/** Khớp `source` trong redirects.json (gồm pattern kiểu Next `/prefix/:path*`). */
function pathMatchedByRedirectSource(sourcePattern, pathname) {
  const p = pathname;
  const m = sourcePattern.match(/\/:([\w]+)\*$/);
  if (m) {
    const prefixRaw = sourcePattern.slice(0, m.index);
    const prefix = normalizePath(prefixRaw);
    if (!prefix || prefix === "/") return false;
    return p === prefix || p.startsWith(`${prefix}/`);
  }
  return normalizePath(sourcePattern) === p;
}

function pathCoveredByRedirects(redirects, pathname) {
  for (const r of redirects) {
    if (pathMatchedByRedirectSource(r.source, pathname)) return true;
  }
  return false;
}

const baselineAbs = path.join(ROOT, BASELINE_FILE);
if (!fs.existsSync(baselineAbs)) {
  console.error(`Missing baseline file: ${baselineAbs}`);
  process.exit(1);
}

const baselinePaths = [...new Set(readLines(baselineAbs).map(normalizePath))];

const redirectsAbs = path.join(ROOT, REDIRECT_FILE);
const redirects = fs.existsSync(redirectsAbs)
  ? ensureRedirectShape(JSON.parse(fs.readFileSync(redirectsAbs, "utf8")))
  : [];

const appRoutes = new Set([
  "/",
  "/shop",
  "/journal",
  "/lookbook",
  "/showroom",
  "/moodboard",
  "/feed.xml",
  "/sitemap.xml",
  "/robots.txt",
]);

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl?.trim()) {
  console.error("Set DATABASE_URL first (must point to /kaha_vn).");
  process.exit(1);
}
if (!/\/kaha_vn(\?|$)/.test(dbUrl)) {
  console.error("DATABASE_URL must target /kaha_vn.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: dbUrl, max: 3 });
const r = await pool.query(
  `SELECT slug FROM content_nodes WHERE status = 'publish' ORDER BY slug`,
);
await pool.end();

const dbPaths = new Set(
  r.rows
    .map((x) => String(x.slug ?? "").trim().replace(/^\/+/, "").replace(/\/+$/, ""))
    .filter(Boolean)
    .map((slug) => `/${slug}`.toLowerCase()),
);

const covered = [];
const missing = [];
const suggestedRedirects = [];

for (const p of baselinePaths) {
  const hasDb = dbPaths.has(p);
  const hasApp = appRoutes.has(p);
  const hasRedirect = pathCoveredByRedirects(redirects, p);
  if (hasDb || hasApp || hasRedirect) {
    covered.push({ path: p, reason: hasDb ? "db_slug" : hasApp ? "app_route" : "redirect" });
    continue;
  }
  const suggested = heuristicRedirectFor(p);
  if (suggested) {
    suggestedRedirects.push({ source: p, destination: suggested, permanent: true });
    covered.push({ path: p, reason: "heuristic_redirect" });
  } else {
    missing.push(p);
  }
}

const report = {
  baseline_total: baselinePaths.length,
  covered_total: covered.length,
  missing_total: missing.length,
  missing_paths: missing,
  missing_sample: missing.slice(0, 120),
  suggested_redirects: suggestedRedirects,
  generated_at: new Date().toISOString(),
};

const outAbs = path.join(ROOT, OUT_FILE);
fs.writeFileSync(outAbs, JSON.stringify(report, null, 2));
console.log(`report: ${OUT_FILE}`);
console.log(
  `baseline=${report.baseline_total}, covered=${report.covered_total}, missing=${report.missing_total}`,
);
