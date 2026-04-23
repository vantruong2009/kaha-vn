#!/usr/bin/env node
/**
 * Upsert URLs from docs/seo-baseline/kaha-seed-crawl-*.csv into seo_baseline.
 * Requires DATABASE_URL pointing at database name kaha_vn only.
 */
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

function assertKahaDb(url) {
  if (!/\/kaha_vn(\?|$)/.test(url)) {
    throw new Error(
      "DATABASE_URL must use database kaha_vn (safety — không đụng DB site khác).",
    );
  }
}

const ROOT = path.join(import.meta.dirname, "..");
const CSV =
  process.env.SEO_BASELINE_CSV ||
  path.join(ROOT, "docs/seo-baseline/kaha-seed-crawl-20260423.csv");

const raw = fs.readFileSync(CSV, "utf8");
const lines = raw.split(/\r?\n/).filter(Boolean);
const header = lines[0];
if (!header.startsWith("url,")) {
  throw new Error("CSV must start with seo-baseline header (url,...)");
}

const urls = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const comma = line.indexOf(",");
  const url = comma === -1 ? line.trim() : line.slice(0, comma).trim();
  if (url) urls.push(url);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Set DATABASE_URL (postgresql://…/kaha_vn)");
  process.exit(1);
}
assertKahaDb(databaseUrl);

const pool = new pg.Pool({ connectionString: databaseUrl, max: 4 });

const sql = `
INSERT INTO seo_baseline (url, imported_at)
VALUES ($1, now())
ON CONFLICT (url) DO UPDATE SET imported_at = excluded.imported_at
`;

let n = 0;
try {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const url of urls) {
      await client.query(sql, [url]);
      n++;
      if (n % 200 === 0) process.stderr.write(`… ${n}\n`);
    }
    await client.query("COMMIT");
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}

console.error(`imported ${n} urls into seo_baseline`);
