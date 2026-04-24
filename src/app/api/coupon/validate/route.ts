import { NextResponse } from 'next/server';
import { rateLimitAsync } from '@/lib/rateLimit';
import { fetchCouponByCodePg, hasPostgresConfigured } from '@/lib/postgres/commerce';

export async function GET(req: Request) {
  const ip =
    (req as { headers: { get: (k: string) => string | null } }).headers
      .get('x-forwarded-for')
      ?.split(',')[0]
      .trim() ?? 'unknown';
  if (!(await rateLimitAsync(`coupon:${ip}`, 10, 60_000))) {
    return NextResponse.json({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code')?.trim().toUpperCase();
  const subtotal = Number(searchParams.get('subtotal') ?? 0);

  if (!code) {
    return NextResponse.json({ error: 'Thiếu mã giảm giá' }, { status: 400 });
  }

  if (!hasPostgresConfigured()) {
    return NextResponse.json({ error: 'Hệ thống đang bảo trì' }, { status: 503 });
  }

  let coupon: {
    id: string;
    code: string;
    type: string;
    value: unknown;
    min_order: unknown;
    max_uses: number | null;
    used_count: number | null;
    expires_at: string | null;
    active: boolean;
  } | null = null;

  try {
    const row = await fetchCouponByCodePg(code);
    if (row) {
      coupon = {
        id: row.id,
        code: row.code,
        type: row.type,
        value: row.value,
        min_order: row.min_order,
        max_uses: row.max_uses,
        used_count: row.used_count,
        expires_at: row.expires_at,
        active: row.active,
      };
    }
  } catch {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }

  if (!coupon) return NextResponse.json({ error: 'Mã không tồn tại' }, { status: 404 });
  if (!coupon.active) return NextResponse.json({ error: 'Mã đã bị vô hiệu hoá' }, { status: 400 });
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Mã đã hết hạn' }, { status: 400 });
  }
  const used = Number(coupon.used_count ?? 0);
  if (coupon.max_uses != null && used >= coupon.max_uses) {
    return NextResponse.json({ error: 'Mã đã hết lượt sử dụng' }, { status: 400 });
  }
  const minOrder = Number(coupon.min_order ?? 0);
  if (minOrder && subtotal < minOrder) {
    return NextResponse.json(
      {
        error: `Đơn hàng tối thiểu ${minOrder.toLocaleString('vi-VN')}₫ để dùng mã này`,
      },
      { status: 400 }
    );
  }

  const val = Number(coupon.value);
  const discount =
    coupon.type === 'percent' ? Math.round((subtotal * val) / 100) : Math.min(val, subtotal);

  return NextResponse.json({
    ok: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type as 'percent' | 'fixed',
      value: val,
      discount,
    },
  });
}
