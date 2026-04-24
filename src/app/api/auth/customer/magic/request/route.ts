import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import {
  hasPostgresConfigured,
  findCustomerByEmailNormalizedPg,
  insertCustomerAuthTokenPg,
} from '@/lib/postgres/commerce';
import { hashCustomerAuthToken } from '@/lib/auth/customer-session';

export async function POST(req: Request) {
  if (!hasPostgresConfigured()) {
    return NextResponse.json({ ok: true });
  }
  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim();
  if (!email) {
    return NextResponse.json({ error: 'Nhập email.' }, { status: 400 });
  }
  const row = await findCustomerByEmailNormalizedPg(email);
  if (!row) {
    return NextResponse.json({ ok: true });
  }
  const raw = randomBytes(28).toString('hex');
  const tokenHash = hashCustomerAuthToken(raw);
  await insertCustomerAuthTokenPg({
    purpose: 'magic_login',
    customerId: row.id,
    tokenHash,
    ttlHours: 2,
  });

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    new URL(req.url).origin;
  const link = `${origin}/api/auth/customer/magic/consume?token=${encodeURIComponent(raw)}`;

  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'LongDenViet <orders@longdenviet.com>',
          to: [row.email],
          subject: 'Đăng nhập LongDenViet',
          html: `<p>Nhấn liên kết để đăng nhập (2 giờ):</p><p><a href="${link}">${link}</a></p>`,
        }),
        signal: AbortSignal.timeout(12_000),
      });
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({ ok: true });
}
