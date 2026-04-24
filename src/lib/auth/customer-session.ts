import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { LDV_CUSTOMER_COOKIE } from '@/lib/auth/customer-constants';

export { LDV_CUSTOMER_COOKIE };

const PASSWORD_PEPPER = 'ldv-customer-pw-2026';

export function hashCustomerPassword(password: string): string {
  return createHash('sha256').update(password).update(PASSWORD_PEPPER).digest('hex');
}

export function hashCustomerAuthToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).update('ldv-customer-token-2026').digest('hex');
}

function getCustomerSessionSecret(): string {
  return (
    process.env.CUSTOMER_SESSION_SECRET ||
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'ldv-dev-customer-session-insecure'
  );
}

/** Định dạng: uuid.expUnix.sigHex (uuid không chứa dấu chấm) */
export function signCustomerSession(userId: string, daysValid = 14): string {
  const exp = Math.floor(Date.now() / 1000) + daysValid * 86400;
  const payload = `${userId}|${exp}`;
  const sig = createHmac('sha256', getCustomerSessionSecret()).update(payload).digest('hex');
  return `${userId}.${exp}.${sig}`;
}

export function verifyCustomerSession(token: string | undefined): { userId: string; exp: number } | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, expStr, sigHex] = parts;
  if (!userId || !expStr || !sigHex) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  const payload = `${userId}|${expStr}`;
  const expected = createHmac('sha256', getCustomerSessionSecret()).update(payload).digest('hex');
  if (expected.length !== sigHex.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(sigHex, 'utf8'))) return null;
  } catch {
    return null;
  }
  return { userId, exp };
}

export function customerSessionCookieOptions(maxAgeSec: number): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSec,
  };
}

export async function setCustomerSessionCookie(userId: string): Promise<void> {
  const token = signCustomerSession(userId, 14);
  const maxAge = 14 * 86400;
  (await cookies()).set(LDV_CUSTOMER_COOKIE, token, customerSessionCookieOptions(maxAge));
}

export async function clearCustomerSessionCookie(): Promise<void> {
  (await cookies()).set(LDV_CUSTOMER_COOKIE, '', { ...customerSessionCookieOptions(0), maxAge: 0 });
}
