#!/usr/bin/env node
/**
 * One-shot migration pipeline:
 * 1) strict input checks
 * 2) ensure SQL tables
 * 3) import WP XML (auto-detect)
 * 4) audit import
 * 5) SEO slug diff
 * 6) optional merge redirect candidates
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import pg from "pg";

const ROOT = path.join(import.meta.dirname, "..");
const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const applyRedirects = argv.includes("--apply-redirects");

function loadEnvFile(absPath) {
  if (!fs.existsSync(absPath)) return;
  const raw = fs.readFileSync(absPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(k in process.env)) process.env[k] = v;
  }
}

// Auto-load DATABASE_URL from local env files if available.
loadEnvFile(path.join(ROOT, ".env.local"));
loadEnvFile(path.join(ROOT, ".env"));

const dbUrl = process.env.DATABASE_URL?.trim();
if (!dbUrl) {
  console.error("Set DATABASE_URL first (must target /kaha_vn).");
  process.exit(1);
}
if (!/\/kaha_vn(\?|$)/.test(dbUrl)) {
  console.error("DATABASE_URL must target /kaha_vn.");
  process.exit(1);
}

function runNodeScript(scriptRel, extra = []) {
  const script = path.join(import.meta.dirname, scriptRel);
  const r = spawnSync(process.execPath, [script, ...extra], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);
}

console.log("==> [1/6] check inputs (strict)");
runNodeScript("check_migration_inputs.mjs", ["--strict"]);

console.log("==> [2/6] ensure SQL tables (002 + 003)");
{
  const sql002 = fs.readFileSync(path.join(ROOT, "scripts/sql/002_content_nodes.sql"), "utf8");
  const sql003 = fs.readFileSync(path.join(ROOT, "scripts/sql/003_leads_tables.sql"), "utf8");
  const pool = new pg.Pool({ connectionString: dbUrl, max: 2 });
  try {
    await pool.query(sql002);
    await pool.query(sql003);
  } finally {
    await pool.end();
  }
}

if (dryRun) {
  console.log("==> [3/6] import XML (dry-run)");
  runNodeScript("import_wp_xml_auto.mjs", ["--dry-run"]);
  console.log("==> Done dry-run pipeline.");
  process.exit(0);
}

console.log("==> [3/6] import XML");
runNodeScript("import_wp_xml_auto.mjs");

console.log("==> [4/6] audit import");
runNodeScript("audit_content_import.mjs");

console.log("==> [5/6] SEO slug diff");
runNodeScript("seo_slug_diff.mjs");

if (applyRedirects) {
  console.log("==> [6/6] merge redirect candidates");
  runNodeScript("merge_redirect_candidates.mjs");
} else {
  console.log("==> [6/6] skip redirect merge (use --apply-redirects to enable)");
}

console.log("Migration pipeline complete.");
