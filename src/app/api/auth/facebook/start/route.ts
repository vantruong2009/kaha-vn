import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'ldv_fb_ctx';

export async function GET(req: NextRequest) {
  const appId = process.env.FACEBOOK_APP_ID;
  if (!appId) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=fb_cfg', req.url));
  }
  const state = randomBytes(24).toString('hex');
  const redirectPath = req.nextUrl.searchParams.get('redirect') || '/tai-khoan';
  const payload = Buffer.from(JSON.stringify({ state, r: redirectPath }), 'utf8').toString('base64url');
  const redirectUri = `${req.nextUrl.origin}/api/auth/facebook/callback`;
  const url = new URL('https://www.facebook.com/v18.0/dialog/oauth');
  url.searchParams.set('client_id', appId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', 'email,public_profile');
  const res = NextResponse.redirect(url.toString());
  res.cookies.set(COOKIE, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return res;
}
