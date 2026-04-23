#!/usr/bin/env node
/**
 * Dry-run: đếm <item> trong XML export (posts/pages/products trong channel).
 */
import fs from "node:fs";

const path = process.argv[2];
if (!path) {
  console.error("usage: node scripts/count_wp_xml_items.mjs <export.xml>");
  process.exit(1);
}

const xml = fs.readFileSync(path, "utf8");
const items = xml.match(/<item>/g);
console.log(items ? items.length : 0);
