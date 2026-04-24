import { NextResponse } from 'next/server';
import { rateLimitAsync } from '@/lib/rateLimit';
import { fetchOrderForTrackPg, hasPostgresConfigured } from '@/lib/postgres/commerce';

export async function POST(req: Request) {
  const ip = (req as { headers: { get: (k: string) => string | null } }).headers
    .get('x-forwarded-for')
    ?.split(',')[0]
    .trim() ?? 'unknown';

  if (!(await rateLimitAsync(`order-track:${ip}`, 10, 60_000))) {
    return NextResponse.json(
      { error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' },
      { status: 429 }
    );
  }

  const { orderId, phone } = await req.json().catch(() => ({}));

  if (!orderId || !phone) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
  }

  const oid = String(orderId).trim();
  const ph = String(phone).trim();

  if (!hasPostgresConfigured()) {
    return NextResponse.json({ error: 'Hệ thống đang bảo trì' }, { status: 503 });
  }

  try {
    const row = await fetchOrderForTrackPg(oid, ph);
    if (!row) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }
    return NextResponse.json({
      order: {
        id: row.id,
        status: row.status,
        created_at: row.created_at,
        receiver_name: row.receiver_name,
        receiver_phone: row.receiver_phone,
        total: Number(row.total),
        order_items: row.order_items.map((i) => ({
          product_name: i.product_name,
          quantity: i.quantity,
          price: Number(i.price),
        })),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
  }
}
