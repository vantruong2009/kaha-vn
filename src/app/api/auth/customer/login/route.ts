import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  hasPostgresConfigured,
  findCustomerByEmailNormalizedPg,
} from '@/lib/postgres/commerce';
import {
  hashCustomerPassword,
  signCustomerSession,
  customerSessionCookieOptions,
} from '@/lib/auth/customer-session';
import { LDV_CUSTOMER_COOKIE } from '@/lib/auth/customer-constants';

export async function POST(req: Request) {
  if (!hasPostgresConfigured()) {
    return NextResponse.json(
      { error: 'Hệ thống đăng nhập chưa được cấu hình (thiếu Postgres).' },
      { status: 503 }
    );
  }
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  if (!body?.email?.trim() || !body.password) {
    return NextResponse.json({ error: 'Nhập email và mật khẩu.' }, { status: 400 });
  }
  const row = await findCustomerByEmailNormalizedPg(body.email);
  if (!row?.password_hash || row.password_hash !== hashCustomerPassword(body.password)) {
    return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
  }
  const token = signCustomerSession(row.id, 14);
  const maxAge = 14 * 86400;
  (await cookies()).set(LDV_CUSTOMER_COOKIE, token, customerSessionCookieOptions(maxAge));
  return NextResponse.json({
    ok: true,
    user: { id: row.id, email: row.email, full_name: row.full_name },
  });
}
