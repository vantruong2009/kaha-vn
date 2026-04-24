import { NextResponse } from 'next/server';
import { fetchProductsBySlugsFromCatalog } from '@/lib/products-db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { slugs?: string[] } | null;
  const slugs = Array.isArray(body?.slugs) ? body!.slugs! : [];
  if (slugs.length > 80) {
    return NextResponse.json({ error: 'Quá nhiều slug' }, { status: 400 });
  }
  const products = await fetchProductsBySlugsFromCatalog(slugs);
  return NextResponse.json({ products });
}
