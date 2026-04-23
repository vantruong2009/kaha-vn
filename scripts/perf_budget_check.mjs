#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.join(import.meta.dirname, "..");
const buildManifestPath = path.join(ROOT, ".next/build-manifest.json");

const TARGET_FIRSTLOAD_JS_BYTES = 120 * 1024; // target from master plan
const MAX_FIRSTLOAD_JS_BYTES = 140 * 1024; // temporary guardrail before final tuning
const MAX_HOME_HTML_BYTES = 80 * 1024;

let failed = 0;
function result(ok, label, detail = "") {
  console.log(`${ok ? "✅" : "❌"} ${label}${detail ? ` ${detail}` : ""}`);
  if (!ok) failed++;
}

if (!fs.existsSync(buildManifestPath)) {
  console.log("❌ Missing .next/build-manifest.json. Run npm run build first.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(buildManifestPath, "utf8"));
const homeFiles = Array.isArray(manifest.pages?.["/"]) ? manifest.pages["/"] : [];
const rootFiles = new Set([
  ...(manifest.rootMainFiles ?? []),
  ...homeFiles,
]);

let totalJs = 0;
let totalJsGzip = 0;
for (const rel of rootFiles) {
  if (!rel.endsWith(".js")) continue;
  const abs = path.join(ROOT, ".next", rel);
  if (fs.existsSync(abs)) {
    const buf = fs.readFileSync(abs);
    totalJs += buf.length;
    totalJsGzip += zlib.gzipSync(buf, { level: 9 }).length;
  }
}
result(
  totalJsGzip <= MAX_FIRSTLOAD_JS_BYTES,
  "First-load JS guardrail (gzip)",
  `(raw ${totalJs} bytes, gzip ${totalJsGzip} bytes; target ${TARGET_FIRSTLOAD_JS_BYTES})`,
);
if (totalJsGzip > TARGET_FIRSTLOAD_JS_BYTES) {
  console.log(
    `⚠️ Above target 120KB gzip by ${totalJsGzip - TARGET_FIRSTLOAD_JS_BYTES} bytes (still under 140KB guardrail).`,
  );
}

const homeHtml = path.join(ROOT, ".next/server/app/page.html");
if (fs.existsSync(homeHtml)) {
  const size = fs.statSync(homeHtml).size;
  result(size <= MAX_HOME_HTML_BYTES, "Home HTML budget", `(${size} bytes)`);
} else {
  console.log("⚠️ Home HTML file not found (route may be dynamic).");
}

console.log(`\nResult: ${failed === 0 ? "PASS" : `FAIL (${failed})`}`);
process.exit(failed === 0 ? 0 : 1);
