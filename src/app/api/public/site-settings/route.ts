import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/site-settings-server';

export const dynamic = 'force-dynamic';

/** Dùng cho client (vd. /tu-van) — không import getSettings trực tiếp trong 'use client'. */
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings, {
    headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' },
  });
}
