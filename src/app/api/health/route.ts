import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ ok: true, service: "kaha-vn" }, { status: 200 });
}
