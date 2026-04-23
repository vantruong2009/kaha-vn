#!/usr/bin/env node
/**
 * Validates migration-inputs before wp-xml-to-postgres.
 * Exit 1 only with --strict when required files missing.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const INPUT = path.join(ROOT, "docs/migration-inputs");
const strict = process.argv.includes("--strict");

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

let failed = false;
const manifest = path.join(INPUT, "MANIFEST.json");
const manifestExample = path.join(INPUT, "MANIFEST.example.json");

if (!exists(manifestExample)) {
  console.error("Missing MANIFEST.example.json");
  failed = true;
}

if (!exists(manifest)) {
  console.warn(
    "[migrate] MANIFEST.json absent — copy MANIFEST.example.json → MANIFEST.json",
  );
  if (strict) failed = true;
}

const xmlCandidates = [
  "wordpress.xml",
  "kaha.wordpress.xml",
  "export.xml",
];
const hasXml = xmlCandidates.some((f) => exists(path.join(INPUT, f)));

if (!hasXml) {
  console.warn(
    `[migrate] No WP XML (${xmlCandidates.join(", ")}) — place export under docs/migration-inputs/`,
  );
  if (strict) failed = true;
}

process.exit(failed ? 1 : 0);
