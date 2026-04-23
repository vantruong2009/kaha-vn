#!/usr/bin/env node
/**
 * Prepare migration inputs folder:
 * - ensure MANIFEST.json exists (copy from example once)
 * - print expected XML filenames
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const INPUT = path.join(ROOT, "docs/migration-inputs");
const ex = path.join(INPUT, "MANIFEST.example.json");
const out = path.join(INPUT, "MANIFEST.json");

if (!fs.existsSync(INPUT)) fs.mkdirSync(INPUT, { recursive: true });
if (!fs.existsSync(ex)) {
  console.error("Missing docs/migration-inputs/MANIFEST.example.json");
  process.exit(1);
}

if (!fs.existsSync(out)) {
  fs.copyFileSync(ex, out);
  console.log("Created docs/migration-inputs/MANIFEST.json from example.");
} else {
  console.log("MANIFEST.json already exists.");
}

console.log(
  "Place WP XML as one of: docs/migration-inputs/wordpress.xml | kaha.wordpress.xml | export.xml",
);
