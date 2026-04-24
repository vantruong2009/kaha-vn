import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  hasPostgresConfigured,
  findCustomerByFacebookIdPg,
  findCustomerByEmailNormalizedPg,
  findCustomerByIdPg,
  linkFacebookToCustomerPg,
  insertCustomerOAuthFacebookPg,
} from '@/lib/postgres/commerce';
import { signCustomerSession, customerSessionCookieOptions } from '@/lib/auth/customer-session';
import { LDV_CUSTOMER_COOKIE } from '@/lib/auth/customer-constants';

const COOKIE = 'ldv_fb_ctx';

export async function GET(req: NextRequest) {
  if (!hasPostgresConfigured()) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=pg', req.url));
  }
  const err = req.nextUrl.searchParams.get('error');
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  if (err || !code || !state) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=fb', req.url));
  }
  const ctxRaw = (await cookies()).get(COOKIE)?.value;
  if (!ctxRaw) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=fb_ctx', req.url));
  }
  let ctx: { state: string; r: string };
  try {
    ctx = JSON.parse(Buffer.from(ctxRaw, 'base64url').toString('utf8')) as { state: string; r: string };
  } catch {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=fb_ctx', req.url));
  }
  if (ctx.state !== state) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=fb_ctx', req.url));
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appId || !appSecret) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=fb_cfg', req.url));
  }

  const redirectUri = `${req.nextUrl.origin}/api/auth/facebook/callback`;
  const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
  tokenUrl.searchParams.set('client_id', appId);
  tokenUrl.searchParams.set('client_secret', appSecret);
  tokenUrl.searchParams.set('redirect_uri', redirectUri);
  tokenUrl.searchParams.set('code', code);

  const tokenRes = await fetch(tokenUrl.toString(), { signal: AbortSignal.timeout(15_000) });
  const tokens = (await tokenRes.json()) as { access_token?: string; error?: { message?: string } };
  if (!tokenRes.ok || !tokens.access_token) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=fb_token', req.url));
  }

  const meUrl = new URL('https://graph.facebook.com/v18.0/me');
  meUrl.searchParams.set('fields', 'id,email,name');
  meUrl.searchParams.set('access_token', tokens.access_token);
  const meRes = await fetch(meUrl.toString(), { signal: AbortSignal.timeout(10_000) });
  const me = (await meRes.json()) as { id?: string; email?: string; name?: string };
  const fbId = me.id;
  const email = me.email?.trim();
  if (!fbId || !email) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=fb_email', req.url));
  }

  let customer = await findCustomerByFacebookIdPg(fbId);
  if (!customer) {
    const byEmail = await findCustomerByEmailNormalizedPg(email);
    if (byEmail) {
      await linkFacebookToCustomerPg(byEmail.id, fbId);
      customer = await findCustomerByIdPg(byEmail.id);
    }
  }
  if (!customer) {
    customer = await insertCustomerOAuthFacebookPg(email, fbId, me.name?.trim() || null);
  }
  if (!customer) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=fb_user', req.url));
  }

  const session = signCustomerSession(customer.id, 14);
  const maxAge = 14 * 86400;
  (await cookies()).delete(COOKIE);
  (await cookies()).set(LDV_CUSTOMER_COOKIE, session, customerSessionCookieOptions(maxAge));

  const dest = ctx.r?.startsWith('/') ? ctx.r : '/tai-khoan';
  return NextResponse.redirect(new URL(dest, req.url));
}
