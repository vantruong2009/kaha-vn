import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { LDV_CUSTOMER_COOKIE } from '@/lib/auth/customer-constants';
import { verifyCustomerSession } from '@/lib/auth/customer-session';
import { hasPostgresConfigured, findCustomerByIdPg } from '@/lib/postgres/commerce';

export async function GET() {
  const raw = (await cookies()).get(LDV_CUSTOMER_COOKIE)?.value;
  const v = verifyCustomerSession(raw);
  if (!v) {
    return NextResponse.json({ user: null });
  }
  if (!hasPostgresConfigured()) {
    return NextResponse.json({ user: null });
  }
  const row = await findCustomerByIdPg(v.userId);
  if (!row) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      phone: row.phone,
      address: row.address,
    },
  });
}
