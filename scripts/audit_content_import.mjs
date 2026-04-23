#!/usr/bin/env node
/**
 * Audit: đếm content_nodes theo Postgres; tuỳ chọn so khớp WXR (.xml).
 * Không truyền XML → tự tìm file trong docs/migration-inputs/ nếu có.
 * DATABASE_URL …/kaha_vn
 */
import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import pg from "pg";
import { resolveMigrationXml } from "./migration_inputs_resolve.mjs";

const KEEP_TYPES = new Set(["post", "page", "product"]);

function assertKahaDb(url) {
  if (!/\/kaha_vn(\?|$)/.test(url)) {
    throw new Error("DATABASE_URL must target database kaha_vn only.");
  }
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

function collectItems(parsed) {
  const ch = parsed?.rss?.channel ?? parsed?.channel;
  if (!ch) return [];
  const raw = ch.item;
  if (raw === undefined || raw === null) return [];
  return Array.isArray(raw) ? raw : [raw];
}

/** Đếm item sẽ được importer chấp nhận (cùng rule với import_wp_xml_content). */
function countImportable(items) {
  let n = 0;
  let skipped = 0;
  for (const item of items) {
    const postType =
      extractText(item["wp:post_type"]) || extractText(item.post_type);
    const status =
      extractText(item["wp:status"]) || extractText(item.status);
    // Mirror rule của importer: chỉ publish.
    if (status !== "publish") {
      skipped++;
      continue;
    }
    if (!KEEP_TYPES.has(postType)) {
      skipped++;
      continue;
    }
    const slug =
      extractText(item["wp:post_name"]) || extractText(item.post_name);
    if (!slug) {
      skipped++;
      continue;
    }
    n++;
  }
  return { importable: n, skipped };
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl?.trim()) {
  console.error("Set DATABASE_URL");
  process.exit(1);
}
assertKahaDb(dbUrl);

const ROOT = path.join(import.meta.dirname, "..");
let xmlArg = process.argv[2];
if (!xmlArg) {
  xmlArg = resolveMigrationXml(ROOT);
}

const pool = new pg.Pool({ connectionString: dbUrl, max: 3 });

const byType = await pool.query(
  `SELECT post_type, status, count(*)::int AS n
   FROM content_nodes GROUP BY post_type, status ORDER BY post_type, status`,
);
const total = await pool.query(`SELECT count(*)::int AS n FROM content_nodes`);
const publish = await pool.query(
  `SELECT count(*)::int AS n FROM content_nodes WHERE status = 'publish'`,
);

await pool.end();

console.log("content_nodes by type/status:");
console.table(byType.rows);
console.log("total rows:", total.rows[0]?.n);
console.log("publish:", publish.rows[0]?.n);

if (xmlArg) {
  const abs = path.isAbsolute(xmlArg)
    ? xmlArg
    : path.join(process.cwd(), xmlArg);
  const xml = fs.readFileSync(abs, "utf8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
    parseTagValue: true,
    removeNSPrefix: false,
  });
  const parsed = parser.parse(xml);
  const items = collectItems(parsed);
  const { importable, skipped } = countImportable(items);
  console.log("\nWXR:", abs);
  console.log("items total:", items.length);
  console.log("would import (same rules):", importable);
  console.log("skipped:", skipped);
  console.log(
    "delta (importable - DB total):",
    importable - Number(total.rows[0]?.n ?? 0),
  );
}
