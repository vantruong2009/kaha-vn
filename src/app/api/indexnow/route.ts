import { NextRequest, NextResponse } from 'next/server';

const KEY = '71000cb497ae734415da2b7b7b6745eb';
const HOST = 'longdenviet.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

async function buildAllUrls(): Promise<string[]> {
  const base = `https://${HOST}`;
  const urls: string[] = [];

  // Static pages
  const statics = [
    '/', '/san-pham', '/blog', '/lien-he', '/ve-chung-toi',
    '/cn-hcm', '/cn-hoi-an', '/cn-ha-noi',
    '/bang-gia', '/hoi-dap', '/dai-ly', '/gia-cong-den-trang-tri',
    '/den-trang-tri-khach-san-resort', '/den-trang-tri-nha-hang-quan-cafe',
    '/chinh-sach-doi-tra', '/chinh-sach-van-chuyen', '/chinh-sach-bao-mat',
  ];
  statics.forEach(p => urls.push(`${base}${p}`));

  // Products + categories
  const { products, categories } = await import('@/lib/products');
  categories.forEach((c: { id: string }) => urls.push(`${base}/c/${c.id}`));
  products.forEach((p: { slug: string }) => urls.push(`${base}/p/${p.slug}`));

  // City landing pages
  const { citySlugs } = await import('@/data/city-landing');
  (citySlugs as string[]).forEach(slug => urls.push(`${base}/mua-den-long-tai/${slug}`));

  // Blog posts
  const { getAllPostSlugs } = await import('@/lib/getPosts');
  const postSlugs = await getAllPostSlugs();
  postSlugs.forEach(slug => urls.push(`${base}/blog/${slug}`));

  return [...new Set(urls)];
}

async function submitToIndexNow(urls: string[]) {
  const BATCH = 9000;
  const results = [];
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch };
    const batchResult: Record<string, { status: number; ok: boolean }> = {};
    await Promise.all(
      ENDPOINTS.map(async endpoint => {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(payload),
          });
          batchResult[endpoint] = { status: res.status, ok: res.ok };
        } catch (_e) {
          batchResult[endpoint] = { status: 0, ok: false };
        }
      })
    );
    results.push(batchResult);
  }
  return results;
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const urls = await buildAllUrls();
  const results = await submitToIndexNow(urls);

  return NextResponse.json({
    ok: true,
    submitted: urls.length,
    results,
    breakdown: {
      blog: urls.filter(u => u.includes('/blog/')).length,
      products: urls.filter(u => u.includes('/p/')).length,
      categories: urls.filter(u => u.includes('/c/')).length,
      cities: urls.filter(u => u.includes('/mua-den-long-tai/')).length,
      statics: urls.filter(u => !u.includes('/blog/') && !u.includes('/p/') && !u.includes('/c/') && !u.includes('/mua-den-long-tai/')).length,
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('x-admin-secret');
  if (!auth || auth !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const urls: string[] = body.urls?.length ? body.urls : await buildAllUrls();
  const results = await submitToIndexNow(urls);

  return NextResponse.json({ ok: true, submitted: urls.length, results });
}
