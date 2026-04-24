#!/usr/bin/env node
const base = (process.env.KAHA_CHECK_URL || "http://127.0.0.1:3102").replace(/\/$/, "");

const targets = [
  "/",
  "/shop",
  "/journal",
  "/lookbook",
  "/showroom",
  "/moodboard",
  "/feed.xml",
  "/sitemap.xml",
  "/robots.txt",
  "/api/health",
  // Slug archive Woo (product_cat) → /shop?category=… (308 + follow)
  "/gia-cong-den-trang-tri",
];

let failed = 0;
console.log(`Smoke check base: ${base}\n`);

for (const path of targets) {
  const url = `${base}${path}`;
  try {
    const r = await fetch(url, { redirect: "follow" });
    if (!r.ok) {
      console.log(`❌ ${path} -> ${r.status}`);
      failed++;
    } else {
      console.log(`✅ ${path} -> ${r.status}`);
    }
  } catch {
    console.log(`❌ ${path} -> network error`);
    failed++;
  }
}

console.log(`\nResult: ${failed === 0 ? "PASS" : `FAIL (${failed})`}`);
process.exit(failed === 0 ? 0 : 1);
