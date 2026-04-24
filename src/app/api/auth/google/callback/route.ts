import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  hasPostgresConfigured,
  findCustomerByGoogleSubPg,
  findCustomerByEmailNormalizedPg,
  findCustomerByIdPg,
  linkGoogleToCustomerPg,
  insertCustomerOAuthGooglePg,
} from '@/lib/postgres/commerce';
import { signCustomerSession, customerSessionCookieOptions } from '@/lib/auth/customer-session';
import { LDV_CUSTOMER_COOKIE } from '@/lib/auth/customer-constants';

const COOKIE = 'ldv_go_ctx';

export async function GET(req: NextRequest) {
  if (!hasPostgresConfigured()) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=pg', req.url));
  }
  const err = req.nextUrl.searchParams.get('error');
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  if (err || !code || !state) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=google', req.url));
  }
  const ctxRaw = (await cookies()).get(COOKIE)?.value;
  if (!ctxRaw) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=google_ctx', req.url));
  }
  let ctx: { state: string; r: string };
  try {
    ctx = JSON.parse(Buffer.from(ctxRaw, 'base64url').toString('utf8')) as { state: string; r: string };
  } catch {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=google_ctx', req.url));
  }
  if (ctx.state !== state) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=google_ctx', req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=google_cfg', req.url));
  }

  const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const tokens = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!tokenRes.ok || !tokens.access_token) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=google_token', req.url));
  }

  const ui = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
    signal: AbortSignal.timeout(10_000),
  });
  const profile = (await ui.json()) as { id?: string; email?: string; name?: string };
  const sub = profile.id;
  const email = profile.email?.trim();
  if (!sub || !email) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=google_email', req.url));
  }

  let customer = await findCustomerByGoogleSubPg(sub);
  if (!customer) {
    const byEmail = await findCustomerByEmailNormalizedPg(email);
    if (byEmail) {
      await linkGoogleToCustomerPg(byEmail.id, sub, email);
      customer = await findCustomerByIdPg(byEmail.id);
    }
  }
  if (!customer) {
    customer = await insertCustomerOAuthGooglePg(email, sub, profile.name?.trim() || null);
  }
  if (!customer) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=google_user', req.url));
  }

  const session = signCustomerSession(customer.id, 14);
  const maxAge = 14 * 86400;
  (await cookies()).delete(COOKIE);
  (await cookies()).set(LDV_CUSTOMER_COOKIE, session, customerSessionCookieOptions(maxAge));

  const dest = ctx.r?.startsWith('/') ? ctx.r : '/tai-khoan';
  return NextResponse.redirect(new URL(dest, req.url));
}
