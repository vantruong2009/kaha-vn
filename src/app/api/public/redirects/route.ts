import { NextResponse } from 'next/server';
import { hasPostgresConfigured, fetchActiveRedirectsPg } from '@/lib/postgres/commerce';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!hasPostgresConfigured()) {
    return NextResponse.json([], { headers: { 'Cache-Control': 'public, s-maxage=60' } });
  }
  try {
    const rows = await fetchActiveRedirectsPg();
    return NextResponse.json(rows, { headers: { 'Cache-Control': 'public, s-maxage=300' } });
  } catch {
    return NextResponse.json([]);
  }
}
