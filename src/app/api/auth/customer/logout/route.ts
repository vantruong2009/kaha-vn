import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { LDV_CUSTOMER_COOKIE } from '@/lib/auth/customer-constants';
import { customerSessionCookieOptions } from '@/lib/auth/customer-session';

export async function POST() {
  (await cookies()).set(LDV_CUSTOMER_COOKIE, '', {
    ...customerSessionCookieOptions(0),
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
