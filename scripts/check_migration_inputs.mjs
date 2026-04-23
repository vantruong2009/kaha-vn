#!/usr/bin/env node
/**
 * Validates migration-inputs before wp-xml-to-postgres.
 * Exit 1 only with --strict when required files missing.
 */
import path from "node:path";
import {
  XML_CANDIDATES,
  existsReadable,
  migrationInputsDir,
  resolveMigrationXml,
} from "./migration_inputs_resolve.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const INPUT = migrationInputsDir(ROOT);
const strict = process.argv.includes("--strict");

let failed = false;
const manifest = path.join(INPUT, "MANIFEST.json");
const manifestExample = path.join(INPUT, "MANIFEST.example.json");

if (!existsReadable(manifestExample)) {
  console.error("Missing MANIFEST.example.json");
  failed = true;
}

if (!existsReadable(manifest)) {
  console.warn(
    "[migrate] MANIFEST.json absent — copy MANIFEST.example.json → MANIFEST.json",
  );
  if (strict) failed = true;
}

const foundXml = resolveMigrationXml(ROOT);
if (!foundXml) {
  console.warn(
    `[migrate] No WP XML (${XML_CANDIDATES.join(", ")}) — place export under docs/migration-inputs/`,
  );
  if (strict) failed = true;
} else {
  console.log("[migrate] WP XML:", path.relative(ROOT, foundXml));
}

process.exit(failed ? 1 : 0);
