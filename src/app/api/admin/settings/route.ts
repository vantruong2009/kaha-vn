import { NextResponse } from "next/server";
import {
  getSiteSettings,
  upsertSiteSettings,
  type SiteSettings,
} from "@/server/site-settings";

function isAuthorized(req: Request): boolean {
  const expected = process.env.ADMIN_SETTINGS_TOKEN?.trim();
  if (!expected) return false;
  const incoming = req.headers.get("x-admin-token")?.trim();
  return !!incoming && incoming === expected;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const settings = await getSiteSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let body: Partial<SiteSettings>;
  try {
    body = (await req.json()) as Partial<SiteSettings>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const settings = await upsertSiteSettings(body);
  return NextResponse.json({ ok: true, settings });
}
