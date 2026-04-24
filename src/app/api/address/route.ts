import { NextRequest, NextResponse } from 'next/server';

// Free Vietnam address API from provinces.open-api.vn
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get('type'); // 'provinces' | 'districts' | 'wards'
  const code = searchParams.get('code'); // province code or district code

  try {
    let url = '';
    if (type === 'provinces') {
      url = 'https://provinces.open-api.vn/api/?depth=1';
    } else if (type === 'districts' && code) {
      url = `https://provinces.open-api.vn/api/p/${code}?depth=2`;
    } else if (type === 'wards' && code) {
      url = `https://provinces.open-api.vn/api/d/${code}?depth=2`;
    } else {
      return NextResponse.json({ error: 'invalid params' }, { status: 400 });
    }

    const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h
    const data = await res.json();

    if (type === 'provinces') {
      return NextResponse.json(data.map((p: {code: number; name: string}) => ({ code: p.code, name: p.name })));
    } else if (type === 'districts') {
      return NextResponse.json((data.districts || []).map((d: {code: number; name: string}) => ({ code: d.code, name: d.name })));
    } else {
      return NextResponse.json((data.wards || []).map((w: {code: number; name: string}) => ({ code: w.code, name: w.name })));
    }
  } catch (err) {
    console.error('[Address API]', err);
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 });
  }
}
