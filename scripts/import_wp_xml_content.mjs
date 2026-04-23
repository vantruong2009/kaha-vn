#!/usr/bin/env node
/**
 * Import WordPress WXR vào content_nodes (post, page, product đã publish).
 *
 * DATABASE_URL → phải là …/kaha_vn
 * Usage: node scripts/import_wp_xml_content.mjs [--dry-run] [--limit N] <path/to/export.xml>
 */
import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import pg from "pg";

const KEEP_TYPES = new Set(["post", "page", "product"]);

function assertKahaDb(url) {
  if (!/\/kaha_vn(\?|$)/.test(url)) {
    throw new Error(
      "DATABASE_URL must target database kaha_vn only.",
    );
  }
}

function stripWpCruft(html) {
  let s = html || "";
  s = s.replace(/<!--\s*wp:[\s\S]*?-->/g, "");
  s = s.replace(
    /\[(?:gallery|caption|vc_row|vc_column|vc_section|vc_wp_text|vc_single_image)[^\]]*\]/gi,
    "",
  );
  s = s.replace(/\[\/?(?:vc_|gallery|caption)[^\]]*\]/gi, "");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

function extractText(val) {
  if (val === undefined || val === null) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    if ("#text" in val && val["#text"] !== undefined) {
      return String(val["#text"]).trim();
    }
    const keys = Object.keys(val).filter((k) => !k.startsWith("@_"));
    if (keys.length === 1) return extractText(val[keys[0]]);
  }
  return "";
}

function parseIsoGmt(wpGmt) {
  if (!wpGmt?.trim()) return null;
  const iso = wpGmt.trim().replace(" ", "T") + "Z";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function collectItems(parsed) {
  const ch = parsed?.rss?.channel ?? parsed?.channel;
  if (!ch) return [];
  const raw = ch.item;
  if (raw === undefined || raw === null) return [];
  return Array.isArray(raw) ? raw : [raw];
}

const argv = process.argv.slice(2);
let dryRun = false;
let limit = Infinity;
const paths = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--dry-run") dryRun = true;
  else if (a === "--limit") {
    limit = Number.parseInt(argv[++i] ?? "", 10);
    if (!Number.isFinite(limit) || limit < 1) limit = Infinity;
  } else if (a.startsWith("--limit=")) {
    const n = Number.parseInt(a.slice("--limit=".length), 10);
    limit = Number.isFinite(n) && n >= 1 ? n : Infinity;
  } else if (!a.startsWith("--")) paths.push(a);
}

const xmlPath = paths[0];
if (!xmlPath) {
  console.error(
    "usage: node scripts/import_wp_xml_content.mjs [--dry-run] [--limit N] <export.xml>",
  );
  process.exit(1);
}

const abs = path.isAbsolute(xmlPath)
  ? xmlPath
  : path.join(process.cwd(), xmlPath);

const xml = fs.readFileSync(abs, "utf8");
const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
  parseTagValue: true,
  removeNSPrefix: false,
});
const parsed = parser.parse(xml);
const items = collectItems(parsed);

let inserted = 0;
let skipped = 0;
const rows = [];

for (const item of items) {
  const postType = extractText(item["wp:post_type"]) || extractText(item.post_type);
  const status = extractText(item["wp:status"]) || extractText(item.status);
  if (status === "trash" || status === "auto-draft") {
    skipped++;
    continue;
  }
  if (!KEEP_TYPES.has(postType)) {
    skipped++;
    continue;
  }

  const slug = extractText(item["wp:post_name"]) || extractText(item.post_name);
  if (!slug) {
    skipped++;
    continue;
  }

  const title = extractText(item.title);
  const rawBody =
    extractText(item["content:encoded"]) ||
    extractText(item.contentencoded) ||
    extractText(item["content"]);
  const rawExcerpt =
    extractText(item["excerpt:encoded"]) ||
    extractText(item.excerptencoded) ||
    "";

  const wpId = Number.parseInt(
    extractText(item["wp:post_id"]) || extractText(item.post_id) || "",
    10,
  );
  const publishedAt = parseIsoGmt(
    extractText(item["wp:post_date_gmt"]) ||
      extractText(item.post_date_gmt) ||
      "",
  );

  rows.push({
    wp_post_id: Number.isFinite(wpId) ? wpId : null,
    post_type: postType,
    slug,
    title: title || null,
    body_html: stripWpCruft(rawBody) || null,
    excerpt: rawExcerpt.trim() || null,
    status,
    published_at: publishedAt,
  });

  if (rows.length >= limit) break;
}

if (dryRun) {
  console.error(
    `dry-run: would upsert ${rows.length} rows (skipped ${skipped} items, total parsed ${items.length})`,
  );
  process.exit(0);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Set DATABASE_URL (postgresql://…/kaha_vn)");
  process.exit(1);
}
assertKahaDb(databaseUrl);

const pool = new pg.Pool({ connectionString: databaseUrl, max: 4 });
const client = await pool.connect();

const sql = `
INSERT INTO content_nodes (
  wp_post_id, post_type, slug, title, body_html, excerpt, status, published_at
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz)
ON CONFLICT (slug) DO UPDATE SET
  wp_post_id = excluded.wp_post_id,
  post_type = excluded.post_type,
  title = excluded.title,
  body_html = excluded.body_html,
  excerpt = excluded.excerpt,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now()
`;

try {
  await client.query("BEGIN");
  for (const r of rows) {
    await client.query(sql, [
      r.wp_post_id,
      r.post_type,
      r.slug,
      r.title,
      r.body_html,
      r.excerpt,
      r.status,
      r.published_at,
    ]);
    inserted++;
  }
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
  console.error(e);
  process.exit(1);
} finally {
  client.release();
  await pool.end();
}

console.error(`import_wp_xml_content: upserted ${inserted} rows`);
