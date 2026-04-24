import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  hasPostgresConfigured,
  findValidCustomerAuthTokenPg,
  markCustomerAuthTokenUsedPg,
} from '@/lib/postgres/commerce';
import { hashCustomerAuthToken, signCustomerSession, customerSessionCookieOptions } from '@/lib/auth/customer-session';
import { LDV_CUSTOMER_COOKIE } from '@/lib/auth/customer-constants';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!hasPostgresConfigured() || !token) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=magic', req.url));
  }
  const th = hashCustomerAuthToken(token);
  const tok = await findValidCustomerAuthTokenPg('magic_login', th);
  if (!tok) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=magic', req.url));
  }
  await markCustomerAuthTokenUsedPg(tok.id);
  const session = signCustomerSession(tok.customer_id, 14);
  const maxAge = 14 * 86400;
  (await cookies()).set(LDV_CUSTOMER_COOKIE, session, customerSessionCookieOptions(maxAge));
  return NextResponse.redirect(new URL('/tai-khoan', req.url));
}
