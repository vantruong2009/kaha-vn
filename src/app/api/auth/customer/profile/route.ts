import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { LDV_CUSTOMER_COOKIE } from '@/lib/auth/customer-constants';
import { verifyCustomerSession } from '@/lib/auth/customer-session';
import { hasPostgresConfigured, updateCustomerProfilePg } from '@/lib/postgres/commerce';

export async function PATCH(req: Request) {
  if (!hasPostgresConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình Postgres.' }, { status: 503 });
  }
  const raw = (await cookies()).get(LDV_CUSTOMER_COOKIE)?.value;
  const v = verifyCustomerSession(raw);
  if (!v) {
    return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    full_name?: string;
    phone?: string;
    address?: string;
  } | null;
  if (!body) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }
  const r = await updateCustomerProfilePg(v.userId, {
    full_name: body.full_name ?? '',
    phone: body.phone ?? '',
    address: body.address ?? '',
  });
  if (!r.ok) {
    return NextResponse.json({ error: r.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
