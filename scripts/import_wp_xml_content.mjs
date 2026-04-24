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
import { plainTextFromHtml } from "./lib/plain_text.mjs";

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

function parsePostmetaMap(item) {
  const raw = item["wp:postmeta"];
  const blocks =
    raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];
  /** @type {Map<string, string>} */
  const map = new Map();
  for (const b of blocks) {
    const k = extractText(b["wp:meta_key"]);
    const v = extractText(b["wp:meta_value"]);
    if (k) map.set(k, v);
  }
  return map;
}

function seoFromMap(map) {
  const t1 = map.get("_yoast_wpseo_title") || map.get("_rank_math_title");
  const t2 = map.get("_yoast_wpseo_metadesc") || map.get("_rank_math_description");
  const rawMeta = t2?.trim() ? t2.trim() : null;
  return {
    seo_title: t1?.trim() ? t1.trim() : null,
    seo_description: rawMeta
      ? plainTextFromHtml(rawMeta, { maxLength: 320 }) || null
      : null,
  };
}

/** @param {Map<number,string>} attachmentMap */
function resolveFeatured(map, attachmentMap) {
  const thumbRaw = map.get("_thumbnail_id");
  const thumbId = thumbRaw ? Number.parseInt(thumbRaw, 10) : NaN;
  if (Number.isFinite(thumbId)) {
    const u = attachmentMap.get(thumbId);
    if (u) return u;
  }
  const yoastOg =
    map.get("_yoast_wpseo_opengraph-image") || map.get("_yoast_wpseo_image");
  const yoastTrim = (yoastOg || "").trim();
  if (yoastTrim.startsWith("http")) return yoastTrim;
  const rm =
    map.get("rank_math_facebook_image") ||
    map.get("_rank_math_facebook_image") ||
    map.get("_rank_math_image_source_url");
  const rmTrim = (rm || "").trim();
  if (rmTrim.startsWith("http")) return rmTrim;
  return null;
}

/** @param {unknown[]} items */
function buildAttachmentMap(items) {
  /** @type {Map<number,string>} */
  const m = new Map();
  for (const item of items) {
    const pt = extractText(item["wp:post_type"]);
    if (pt !== "attachment") continue;
    const id = Number.parseInt(
      extractText(item["wp:post_id"]) || extractText(item.post_id),
      10,
    );
    let url =
      extractText(item["wp:attachment_url"]) ||
      extractText(item["attachment_url"]) ||
      "";
    if (!url.startsWith("http")) {
      const g = extractText(item.guid);
      if (g.startsWith("http")) url = g;
    }
    if (Number.isFinite(id) && url.startsWith("http")) m.set(id, url.trim());
  }
  return m;
}

function extractTaxonomies(item) {
  const cats = [];
  const tags = [];
  const raw = item.category;
  const arr = raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];
  for (const c of arr) {
    if (!c || typeof c !== "object") continue;
    const domain = String(c["@_domain"] ?? c.domain ?? "").trim();
    let nicename = String(c["@_nicename"] ?? c.nicename ?? "").trim();
    if (!nicename) nicename = extractText(c);
    if (!nicename) continue;
    if (domain === "category" || domain === "product_cat") cats.push(nicename);
    else if (domain === "post_tag" || domain === "product_tag")
      tags.push(nicename);
  }
  return {
    categories: [...new Set(cats)],
    tags: [...new Set(tags)],
  };
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
const attachmentMap = buildAttachmentMap(items);

let inserted = 0;
let skipped = 0;
const rows = [];

for (const item of items) {
  const postType = extractText(item["wp:post_type"]) || extractText(item.post_type);
  const status = extractText(item["wp:status"]) || extractText(item.status);
  // Import tối giản: chỉ nội dung publish (không kéo draft/private/pending).
  if (status !== "publish") {
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

  /** WooCommerce WXR: hầu hết product có `content:encoded` rỗng, mô tả nằm ở `excerpt:encoded` (HTML). */
  let bodyHtml = stripWpCruft(rawBody) || null;
  if (
    postType === "product" &&
    (!bodyHtml || !String(bodyHtml).trim()) &&
    rawExcerpt.trim()
  ) {
    const fromExcerpt = stripWpCruft(rawExcerpt);
    if (fromExcerpt) bodyHtml = fromExcerpt;
  }

  const wpId = Number.parseInt(
    extractText(item["wp:post_id"]) || extractText(item.post_id) || "",
    10,
  );
  const publishedAt = parseIsoGmt(
    extractText(item["wp:post_date_gmt"]) ||
      extractText(item.post_date_gmt) ||
      "",
  );

  const metaMap = parsePostmetaMap(item);
  const { seo_title, seo_description } = seoFromMap(metaMap);
  const featured_image_source_url = resolveFeatured(metaMap, attachmentMap);
  const { categories, tags } = extractTaxonomies(item);

  rows.push({
    wp_post_id: Number.isFinite(wpId) ? wpId : null,
    post_type: postType,
    slug,
    title: title || null,
    body_html: bodyHtml,
    excerpt: rawExcerpt.trim()
      ? plainTextFromHtml(rawExcerpt, { maxLength: 800 }) || null
      : null,
    status,
    published_at: publishedAt,
    seo_title,
    seo_description,
    featured_image_source_url,
    categories,
    tags,
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
  wp_post_id, post_type, slug, title, body_html, excerpt, status, published_at,
  seo_title, seo_description, featured_image_source_url, categories, tags
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8::timestamptz, $9, $10, $11, $12::text[], $13::text[]
)
ON CONFLICT (slug) DO UPDATE SET
  wp_post_id = excluded.wp_post_id,
  post_type = excluded.post_type,
  title = excluded.title,
  body_html = excluded.body_html,
  excerpt = excluded.excerpt,
  status = excluded.status,
  published_at = excluded.published_at,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  featured_image_source_url = excluded.featured_image_source_url,
  categories = excluded.categories,
  tags = excluded.tags,
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
      r.seo_title,
      r.seo_description,
      r.featured_image_source_url,
      r.categories,
      r.tags,
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
