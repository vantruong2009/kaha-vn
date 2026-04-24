import { NextResponse } from 'next/server';
import { hasPostgresConfigured, getPostgresPool } from '@/lib/postgres/server';

export const revalidate = 3600;

export async function GET() {
  try {
    if (!hasPostgresConfigured()) {
      return NextResponse.json({ enabled: true }, {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      });
    }
    const pool = getPostgresPool();
    const { rows } = await pool.query<{ value: string }>(
      `select value from settings where key = 'popup_enabled' limit 1`
    );
    const enabled = (rows[0]?.value ?? 'true') !== 'false';
    return NextResponse.json({ enabled }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return NextResponse.json({ enabled: true }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' },
    });
  }
}
