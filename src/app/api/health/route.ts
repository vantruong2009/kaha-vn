import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const base: Record<string, unknown> = {
    ok: true,
    service: "kaha-vn",
    node: process.version,
  };

  if (!process.env.DATABASE_URL?.trim()) {
    base.db = "skipped";
    return NextResponse.json(base, { status: 200 });
  }

  try {
    const { getPool } = await import("@/server/db");
    const pool = getPool();
    await pool.query("SELECT 1");
    base.db = "ok";
    return NextResponse.json(base, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, service: "kaha-vn", db: "error", node: process.version },
      { status: 503 },
    );
  }
}
