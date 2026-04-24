import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'ldv_go_ctx';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL('/tai-khoan/dang-nhap?error=google_cfg', req.url));
  }
  const state = randomBytes(24).toString('hex');
  const redirectPath = req.nextUrl.searchParams.get('redirect') || '/tai-khoan';
  const payload = Buffer.from(JSON.stringify({ state, r: redirectPath }), 'utf8').toString('base64url');
  const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);
  url.searchParams.set('access_type', 'online');
  url.searchParams.set('prompt', 'select_account');
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
