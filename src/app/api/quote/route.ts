import { NextResponse } from "next/server";
import { isRateLimited } from "@/server/rate-limit";

type Payload = {
  productSlug: string;
  productTitle: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  quantity?: number;
  note?: string;
  website?: string;
};

function clean(input: unknown, max = 500): string {
  const v = String(input ?? "").trim().replace(/\s+/g, " ");
  return v.length > max ? v.slice(0, max) : v;
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`quote:${ip}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  // Honeypot: bot sẽ hay điền field này.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true, persisted: false }, { status: 201 });
  }

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const productSlug = clean(body.productSlug, 220);
  if (!name || !phone || !productSlug) {
    return NextResponse.json({ ok: false, error: "missing_required_fields" }, { status: 400 });
  }

  const row = {
    product_slug: productSlug,
    product_title: clean(body.productTitle, 220),
    name,
    phone,
    email: clean(body.email, 220) || null,
    company: clean(body.company, 220) || null,
    quantity: Number.isFinite(body.quantity) ? Math.max(1, Number(body.quantity)) : 1,
    note: clean(body.note, 2000) || null,
    source_ip: ip,
  };

  if (!process.env.DATABASE_URL?.trim()) {
    console.info("quote_request(no_db)", row);
    return NextResponse.json({ ok: true, persisted: false }, { status: 201 });
  }

  try {
    const { getPool } = await import("@/server/db");
    const pool = getPool();
    const r = await pool.query<{ id: number }>(
      `INSERT INTO quote_requests
       (product_slug, product_title, name, phone, email, company, quantity, note)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        row.product_slug,
        row.product_title,
        row.name,
        row.phone,
        row.email,
        row.company,
        row.quantity,
        row.note,
      ],
    );
    return NextResponse.json({ ok: true, id: r.rows[0]?.id ?? null, persisted: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "db_error_or_missing_table", hint: "run scripts/sql/003_leads_tables.sql" },
      { status: 503 },
    );
  }
}
