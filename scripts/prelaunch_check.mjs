#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");

function ok(cond, yes, no = yes) {
  if (cond) console.log(`✅ ${yes}`);
  else console.log(`❌ ${no}`);
  return cond;
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

let failed = 0;

console.log("KAHA prelaunch quick check\n");

failed += ok(exists("src/app/page.tsx"), "Homepage route", "Missing homepage route")
  ? 0
  : 1;
failed += ok(exists("src/app/shop/page.tsx"), "Shop route", "Missing /shop")
  ? 0
  : 1;
failed += ok(exists("src/app/journal/page.tsx"), "Journal route", "Missing /journal")
  ? 0
  : 1;
failed += ok(exists("src/app/lookbook/page.tsx"), "Lookbook route", "Missing /lookbook")
  ? 0
  : 1;
failed += ok(exists("src/app/showroom/page.tsx"), "Showroom route", "Missing /showroom")
  ? 0
  : 1;
failed += ok(exists("src/app/moodboard/page.tsx"), "Moodboard route", "Missing /moodboard")
  ? 0
  : 1;
failed += ok(exists("src/app/feed.xml/route.ts"), "RSS route", "Missing /feed.xml")
  ? 0
  : 1;
failed += ok(exists("src/app/sitemap.ts"), "Sitemap route", "Missing /sitemap.xml")
  ? 0
  : 1;
failed += ok(exists("src/app/robots.ts"), "Robots route", "Missing /robots.txt")
  ? 0
  : 1;
failed += ok(
  exists("src/app/api/quote/route.ts"),
  "Quote API",
  "Missing /api/quote",
)
  ? 0
  : 1;
failed += ok(
  exists("src/app/api/showroom-booking/route.ts"),
  "Showroom booking API",
  "Missing /api/showroom-booking",
)
  ? 0
  : 1;
failed += ok(exists("docs/ROLLBACK.md"), "Rollback doc", "Missing docs/ROLLBACK.md")
  ? 0
  : 1;
failed += ok(
  exists("docs/PRELAUNCH-CHECKLIST.md"),
  "Prelaunch checklist doc",
  "Missing docs/PRELAUNCH-CHECKLIST.md",
)
  ? 0
  : 1;
failed += ok(
  exists("docs/STAGING-RUNBOOK.md"),
  "Staging runbook doc",
  "Missing docs/STAGING-RUNBOOK.md",
)
  ? 0
  : 1;
failed += ok(
  exists("scripts/staging_smoke.mjs"),
  "Staging smoke script",
  "Missing scripts/staging_smoke.mjs",
)
  ? 0
  : 1;
failed += ok(
  exists("scripts/perf_budget_check.mjs"),
  "Perf budget script",
  "Missing scripts/perf_budget_check.mjs",
)
  ? 0
  : 1;

const envExample = path.join(ROOT, ".env.example");
if (fs.existsSync(envExample)) {
  const env = fs.readFileSync(envExample, "utf8");
  failed += ok(
    env.includes("NEXT_PUBLIC_SITE_URL="),
    ".env.example includes NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SITE_URL missing in .env.example",
  )
    ? 0
    : 1;
  failed += ok(
    env.includes("DATABASE_URL="),
    ".env.example includes DATABASE_URL comment",
    "DATABASE_URL hint missing in .env.example",
  )
    ? 0
    : 1;
} else {
  console.log("❌ Missing .env.example");
  failed++;
}

console.log(`\nResult: ${failed === 0 ? "PASS" : `FAIL (${failed})`}`);
process.exit(failed === 0 ? 0 : 1);
