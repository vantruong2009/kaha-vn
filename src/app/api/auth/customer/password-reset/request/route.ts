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
  if (!row?.password_hash) {
    return NextResponse.json({ ok: true });
  }
  const raw = randomBytes(28).toString('hex');
  const tokenHash = hashCustomerAuthToken(raw);
  await insertCustomerAuthTokenPg({
    purpose: 'password_reset',
    customerId: row.id,
    tokenHash,
    ttlHours: 24,
  });

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    new URL(req.url).origin;
  const link = `${origin}/tai-khoan/dat-lai-mat-khau?token=${encodeURIComponent(raw)}`;

  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'KAHA <orders@kaha.vn>',
          to: [row.email],
          subject: 'Đặt lại mật khẩu KAHA',
          html: `<p>Xin chào,</p><p>Nhấn liên kết sau để đặt lại mật khẩu (hiệu lực 24 giờ):</p><p><a href="${link}">${link}</a></p><p>Nếu không phải bạn, bỏ qua email này.</p>`,
        }),
        signal: AbortSignal.timeout(12_000),
      });
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({ ok: true });
}
