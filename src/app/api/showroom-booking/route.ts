import { NextResponse } from "next/server";
import { isRateLimited } from "@/server/rate-limit";

function clean(input: unknown, max = 500): string {
  const v = String(input ?? "").trim().replace(/\s+/g, " ");
  return v.length > max ? v.slice(0, max) : v;
}

function isDateYmd(v: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

export async function POST(req: Request) {
  const form = await req.formData();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`showroom:${ip}`, 8, 10 * 60 * 1000)) {
    return NextResponse.redirect(new URL("/showroom?status=rate_limited", req.url), 303);
  }
  // Honeypot.
  if (clean(form.get("website"), 200)) {
    return NextResponse.redirect(new URL("/showroom?status=ok", req.url), 303);
  }
  const row = {
    name: clean(form.get("name"), 120),
    phone: clean(form.get("phone"), 40),
    email: clean(form.get("email"), 220) || null,
    visit_date: clean(form.get("visitDate"), 20),
    slot: clean(form.get("slot"), 60) || null,
    note: clean(form.get("note"), 2000) || null,
    source_ip: ip,
  };
  if (!row.name || !row.phone || !isDateYmd(row.visit_date)) {
    return NextResponse.redirect(new URL("/showroom?status=invalid", req.url), 303);
  }

  if (!process.env.DATABASE_URL?.trim()) {
    console.info("showroom_booking(no_db)", row);
    return NextResponse.redirect(new URL("/showroom?status=ok", req.url), 303);
  }

  try {
    const { getPool } = await import("@/server/db");
    const pool = getPool();
    await pool.query(
      `INSERT INTO showroom_bookings
       (name, phone, email, visit_date, slot, note)
       VALUES ($1,$2,$3,$4::date,$5,$6)`,
      [row.name, row.phone, row.email, row.visit_date, row.slot, row.note],
    );
    return NextResponse.redirect(new URL("/showroom?status=ok", req.url), 303);
  } catch {
    return NextResponse.redirect(
      new URL("/showroom?status=error&hint=run-003-leads-tables-sql", req.url),
      303,
    );
  }
}
