#!/usr/bin/env node
/**
 * Runs import_wp_xml_content.mjs against the first WP XML found in docs/migration-inputs/.
 * Pass-through: --dry-run, --limit N (same as main script).
 *
 * DATABASE_URL must target …/kaha_vn
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { resolveMigrationXml } from "./migration_inputs_resolve.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const resolved = resolveMigrationXml(ROOT);

if (!resolved) {
  console.error(
    `[migrate] No WP XML in docs/migration-inputs/. Expected one of: wordpress.xml, kaha.wordpress.xml, export.xml`,
  );
  process.exit(1);
}

const script = path.join(import.meta.dirname, "import_wp_xml_content.mjs");
const extra = process.argv.slice(2);
const r = spawnSync(
  process.execPath,
  [script, ...extra, resolved],
  { stdio: "inherit", cwd: ROOT },
);
process.exit(r.status ?? 1);
