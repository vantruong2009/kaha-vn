import { NextResponse } from 'next/server';
import {
  hasPostgresConfigured,
  findValidCustomerAuthTokenPg,
  markCustomerAuthTokenUsedPg,
  setCustomerPasswordHashPg,
} from '@/lib/postgres/commerce';
import { hashCustomerPassword, hashCustomerAuthToken } from '@/lib/auth/customer-session';

export async function POST(req: Request) {
  if (!hasPostgresConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình.' }, { status: 503 });
  }
  const body = (await req.json().catch(() => null)) as { token?: string; password?: string } | null;
  if (!body?.token || !body.password) {
    return NextResponse.json({ error: 'Thiếu dữ liệu.' }, { status: 400 });
  }
  if (body.password.length < 8) {
    return NextResponse.json({ error: 'Mật khẩu ít nhất 8 ký tự.' }, { status: 400 });
  }
  const th = hashCustomerAuthToken(body.token);
  const tok = await findValidCustomerAuthTokenPg('password_reset', th);
  if (!tok) {
    return NextResponse.json({ error: 'Liên kết không hợp lệ hoặc đã hết hạn.' }, { status: 400 });
  }
  await setCustomerPasswordHashPg(tok.customer_id, hashCustomerPassword(body.password));
  await markCustomerAuthTokenUsedPg(tok.id);
  return NextResponse.json({ ok: true });
}
