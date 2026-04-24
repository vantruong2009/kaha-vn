import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  hasPostgresConfigured,
  findCustomerByEmailNormalizedPg,
  insertCustomerPg,
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
      { error: 'Hệ thống đăng ký chưa được cấu hình (thiếu Postgres).' },
      { status: 503 }
    );
  }
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    password?: string;
    full_name?: string;
  } | null;
  if (!body?.email?.trim() || !body.password) {
    return NextResponse.json({ error: 'Nhập email và mật khẩu.' }, { status: 400 });
  }
  if (body.password.length < 6) {
    return NextResponse.json({ error: 'Mật khẩu ít nhất 6 ký tự.' }, { status: 400 });
  }
  const existing = await findCustomerByEmailNormalizedPg(body.email);
  if (existing) {
    return NextResponse.json({ error: 'Email này đã được đăng ký.' }, { status: 409 });
  }
  const hash = hashCustomerPassword(body.password);
  const row = await insertCustomerPg({
    email: body.email.trim(),
    passwordHash: hash,
    fullName: body.full_name?.trim() || null,
  });
  if (!row) {
    return NextResponse.json({ error: 'Không tạo được tài khoản. Thử lại sau.' }, { status: 500 });
  }
  const token = signCustomerSession(row.id, 14);
  const maxAge = 14 * 86400;
  (await cookies()).set(LDV_CUSTOMER_COOKIE, token, customerSessionCookieOptions(maxAge));
  return NextResponse.json({
    ok: true,
    user: { id: row.id, email: row.email, full_name: row.full_name },
  });
}
