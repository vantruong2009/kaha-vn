/**
 * Đọc/ghi Postgres cho luồng commerce & admin API (server-only).
 * Gọi khi hasPostgresConfigured() — chỉ Postgres.
 */
import { getPostgresPool, hasPostgresConfigured } from '@/lib/postgres/server';

export { hasPostgresConfigured };

export type CheckoutItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type CheckoutInsertInput = {
  userId: string | null | undefined;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  items: CheckoutItem[];
  couponId: string | null | undefined;
};

export async function insertCheckoutOrderPg(
  input: CheckoutInsertInput
): Promise<{ ok: true; orderId: string } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderRes = await client.query<{ id: string }>(
      `insert into orders (
        user_id, receiver_name, receiver_phone, receiver_address,
        receiver_province, receiver_district,
        subtotal, discount, shipping_fee, total,
        payment_method, status
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      returning id`,
      [
        input.userId ?? null,
        input.receiverName,
        input.receiverPhone,
        input.receiverAddress,
        null,
        null,
        input.subtotal,
        input.discount,
        input.shippingFee,
        input.total,
        input.paymentMethod,
        'pending',
      ]
    );
    const orderId = orderRes.rows[0]?.id;
    if (!orderId) {
      await client.query('ROLLBACK');
      return { ok: false, message: 'Không lấy được id đơn hàng' };
    }

    for (const item of input.items) {
      await client.query(
        `insert into order_items (
          order_id, product_id, product_slug, product_name, product_image,
          price, quantity, subtotal
        ) values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          orderId,
          item.id,
          item.slug,
          item.name,
          item.image,
          item.price,
          item.quantity,
          item.price * item.quantity,
        ]
      );
    }

    if (input.couponId) {
      await client.query(
        `update coupons set used_count = coalesce(used_count, 0) + 1 where id = $1::uuid`,
        [input.couponId]
      );
    }

    await client.query('COMMIT');
    return { ok: true, orderId };
  } catch (e) {
    try {
      await client.query('ROLLBACK');
    } catch {
      /* ignore */
    }
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: msg };
  } finally {
    client.release();
  }
}

export type CouponRow = {
  id: string;
  code: string;
  type: string;
  value: string;
  min_order: string | null;
  max_uses: number | null;
  used_count: number | null;
  expires_at: string | null;
  active: boolean;
};

export async function fetchCouponByCodePg(code: string): Promise<CouponRow | null> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<CouponRow>(
    `select id, code, type, value::text, min_order::text, max_uses, used_count, expires_at::text, active
     from coupons where upper(code) = upper($1) limit 1`,
    [code]
  );
  return rows[0] ?? null;
}

export type OrderTrackRow = {
  id: string;
  status: string;
  created_at: string;
  receiver_name: string;
  receiver_phone: string;
  total: string;
  order_items: Array<{ product_name: string; quantity: number; price: string }>;
};

export async function fetchOrderForTrackPg(
  orderId: string,
  phone: string
): Promise<OrderTrackRow | null> {
  const pool = getPostgresPool();
  const o = await pool.query<OrderTrackRow>(
    `select id, status, created_at::text, receiver_name, receiver_phone, total::text
     from orders where id = $1::uuid and receiver_phone = $2 limit 1`,
    [orderId.trim(), phone.trim()]
  );
  if (!o.rows[0]) return null;
  const items = await pool.query<{ product_name: string; quantity: number; price: string }>(
    `select product_name, quantity, price::text from order_items where order_id = $1::uuid`,
    [orderId.trim()]
  );
  return { ...o.rows[0], order_items: items.rows };
}

export async function updateOrderStatusPg(orderId: string, status: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  try {
    const r = await pool.query(`update orders set status = $1, updated_at = now() where id = $2::uuid`, [
      status,
      orderId,
    ]);
    if (r.rowCount === 0) return { ok: false, message: 'Không tìm thấy đơn' };
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export async function insertOrderNotePg(
  orderId: string,
  content: string,
  author: string
): Promise<{ ok: true; note: Record<string, unknown> } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  try {
    const { rows } = await pool.query(
      `insert into order_notes (order_id, content, author) values ($1::uuid, $2, $3) returning *`,
      [orderId, content, author]
    );
    if (!rows[0]) return { ok: false, message: 'Insert failed' };
    return { ok: true, note: rows[0] as Record<string, unknown> };
  } catch {
    try {
      const { rows } = await pool.query(
        `insert into order_notes (order_id, note) values ($1::uuid, $2) returning *`,
        [orderId, content]
      );
      if (!rows[0]) return { ok: false, message: 'Insert failed' };
      return { ok: true, note: rows[0] as Record<string, unknown> };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : String(e) };
    }
  }
}

export async function fetchSettingsRowsPg(keys: string[] | null): Promise<Array<{ key: string; value: string }>> {
  const pool = getPostgresPool();
  if (keys && keys.length > 0) {
    const { rows } = await pool.query<{ key: string; value: string }>(
      `select key, value from settings where key = any($1::text[])`,
      [keys]
    );
    return rows;
  }
  const { rows } = await pool.query<{ key: string; value: string }>(`select key, value from settings`);
  return rows;
}

export async function upsertSettingsPg(entries: Array<{ key: string; value: string }>): Promise<{ ok: true } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const e of entries) {
      await client.query(
        `insert into settings (key, value) values ($1, $2)
         on conflict (key) do update set value = excluded.value, updated_at = now()`,
        [e.key, e.value]
      );
    }
    await client.query('COMMIT');
    return { ok: true };
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      /* ignore */
    }
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  } finally {
    client.release();
  }
}

export async function insertAdvisorLeadPg(data: {
  name: string;
  phone: string;
  answers: unknown;
  result_title: string;
  source: string;
  context: string;
  customer_note: string;
  sample_file_url: string;
  chat_messages: unknown;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  try {
    await pool.query(
      `insert into advisor_leads (
        name, phone, answers, result_title, source, context, customer_note, sample_file_url, chat_messages
      ) values ($1,$2,$3::jsonb,$4,$5,$6,$7,$8,$9::jsonb)`,
      [
        data.name,
        data.phone,
        JSON.stringify(data.answers ?? []),
        data.result_title,
        data.source,
        data.context,
        data.customer_note,
        data.sample_file_url,
        JSON.stringify(data.chat_messages ?? []),
      ]
    );
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/column|does not exist|42703/i.test(msg)) {
      try {
        await pool.query(
          `insert into advisor_leads (name, phone, answers, result_title) values ($1,$2,$3::jsonb,$4)`,
          [data.name, data.phone, JSON.stringify(data.answers ?? []), data.result_title]
        );
        return { ok: true };
      } catch (e2) {
        return { ok: false, message: e2 instanceof Error ? e2.message : String(e2) };
      }
    }
    return { ok: false, message: msg };
  }
}

export async function upsertNotFoundLogPg(path: string, referrer: string): Promise<void> {
  const pool = getPostgresPool();
  try {
    await pool.query(`select upsert_not_found_log($1::text, $2::text)`, [path, referrer]);
  } catch {
    try {
      await pool.query(
        `insert into not_found_logs (path, referrer, hit_count, last_seen_at)
         values ($1, $2, 1, now())
         on conflict (path) do update set
           hit_count = not_found_logs.hit_count + 1,
           referrer = excluded.referrer,
           last_seen_at = now()`,
        [path, referrer]
      );
    } catch {
      /* ignore — logging không chặn request */
    }
  }
}

export async function listNotFoundLogsPg(limit = 200): Promise<Record<string, unknown>[]> {
  const pool = getPostgresPool();
  const { rows } = await pool.query(
    `select * from not_found_logs order by hit_count desc nulls last limit $1`,
    [limit]
  );
  return rows as Record<string, unknown>[];
}

export async function deleteNotFoundLogPg(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  try {
    const r = await pool.query(`delete from not_found_logs where id = $1::uuid`, [id]);
    if (r.rowCount === 0) return { ok: false, message: 'Không tìm thấy log' };
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export async function countOrderNotificationsPg(todayStartIso: string): Promise<{ pendingOrders: number; todayOrders: number }> {
  const pool = getPostgresPool();
  const [pending, today] = await Promise.all([
    pool.query<{ count: string }>(`select count(*)::text as count from orders where status = 'pending'`),
    pool.query<{ count: string }>(`select count(*)::text as count from orders where created_at >= $1::timestamptz`, [todayStartIso]),
  ]);
  return {
    pendingOrders: Number(pending.rows[0]?.count ?? 0),
    todayOrders: Number(today.rows[0]?.count ?? 0),
  };
}

export async function listCouponsPg(): Promise<Record<string, unknown>[]> {
  const pool = getPostgresPool();
  const { rows } = await pool.query(`select * from coupons order by created_at desc`);
  return rows as Record<string, unknown>[];
}

export async function createCouponPg(input: {
  code: string;
  type: string;
  value: number;
  min_order: number | null;
  max_uses: number | null;
  expires_at: string | null;
}): Promise<{ ok: true; coupon: Record<string, unknown> } | { ok: false; message: string; conflict?: boolean }> {
  const pool = getPostgresPool();
  try {
    const exists = await pool.query(`select id from coupons where code = $1 limit 1`, [input.code]);
    if (exists.rows[0]) return { ok: false, message: `Mã "${input.code}" đã tồn tại`, conflict: true };
    const { rows } = await pool.query(
      `insert into coupons (code, type, value, min_order, max_uses, expires_at, used_count, active)
       values ($1,$2,$3,$4,$5,$6,0,true)
       returning *`,
      [input.code, input.type, input.value, input.min_order, input.max_uses, input.expires_at]
    );
    return { ok: true, coupon: rows[0] as Record<string, unknown> };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export async function updateCouponPg(id: string, fields: Record<string, unknown>): Promise<{ ok: true } | { ok: false; message: string; conflict?: boolean }> {
  const pool = getPostgresPool();
  try {
    const allowed = new Set(['code', 'type', 'value', 'min_order', 'max_uses', 'used_count', 'expires_at', 'active']);
    const keys = Object.keys(fields).filter(k => allowed.has(k));
    if (keys.length === 0) return { ok: true };
    const assignments = keys.map((k, i) => `"${k}" = $${i + 2}`);
    const values = keys.map(k => fields[k]);
    const q = `update coupons set ${assignments.join(', ')} where id = $1::uuid`;
    const r = await pool.query(q, [id, ...values]);
    if (r.rowCount === 0) return { ok: false, message: 'Không tìm thấy mã' };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/duplicate key|23505/i.test(msg)) return { ok: false, message: 'Mã đã tồn tại', conflict: true };
    return { ok: false, message: msg };
  }
}

export async function deleteCouponPg(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  try {
    const r = await pool.query(`delete from coupons where id = $1::uuid`, [id]);
    if (r.rowCount === 0) return { ok: false, message: 'Không tìm thấy mã' };
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

type RedirectRow = {
  id: string;
  from_path: string;
  to_path: string;
  status_code: number;
  is_active: boolean;
  created_at: string;
};

export async function listRedirectsPg(): Promise<RedirectRow[]> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<RedirectRow>(`select * from redirects order by created_at desc`);
  return rows;
}

export async function upsertRedirectsPg(rows: Array<{ from_path: string; to_path: string; status_code: number; is_active: boolean }>): Promise<void> {
  const pool = getPostgresPool();
  for (const r of rows) {
    await pool.query(
      `insert into redirects (from_path, to_path, status_code, is_active)
       values ($1,$2,$3,$4)
       on conflict (from_path) do update set
         to_path = excluded.to_path,
         status_code = excluded.status_code,
         is_active = excluded.is_active`,
      [r.from_path, r.to_path, r.status_code, r.is_active]
    );
  }
}

export async function upsertRedirectPg(row: { from_path: string; to_path: string; status_code: number; is_active: boolean }): Promise<Record<string, unknown> | null> {
  const pool = getPostgresPool();
  const { rows } = await pool.query(
    `insert into redirects (from_path, to_path, status_code, is_active)
     values ($1,$2,$3,$4)
     on conflict (from_path) do update set
       to_path = excluded.to_path,
       status_code = excluded.status_code,
       is_active = excluded.is_active
     returning *`,
    [row.from_path, row.to_path, row.status_code, row.is_active]
  );
  return (rows[0] as Record<string, unknown>) ?? null;
}

export async function deleteRedirectPg(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  try {
    const r = await pool.query(`delete from redirects where id = $1::uuid`, [id]);
    if (r.rowCount === 0) return { ok: false, message: 'Không tìm thấy redirect' };
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export async function setRedirectActivePg(id: string, isActive: boolean): Promise<{ ok: true } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  try {
    const r = await pool.query(`update redirects set is_active = $2 where id = $1::uuid`, [id, isActive]);
    if (r.rowCount === 0) return { ok: false, message: 'Không tìm thấy redirect' };
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

type OrderExportItem = { product_name: string; quantity: number; price: number };
export type OrderExportRow = Record<string, unknown> & { order_items: OrderExportItem[] };

export async function listOrdersForExportPg(filters: { status?: string | null; from?: string | null; to?: string | null }): Promise<OrderExportRow[]> {
  const pool = getPostgresPool();
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.status) {
    params.push(filters.status);
    where.push(`o.status = $${params.length}`);
  }
  if (filters.from) {
    params.push(filters.from);
    where.push(`o.created_at >= $${params.length}::timestamptz`);
  }
  if (filters.to) {
    const dateToEnd = new Date(filters.to);
    dateToEnd.setDate(dateToEnd.getDate() + 1);
    params.push(dateToEnd.toISOString());
    where.push(`o.created_at < $${params.length}::timestamptz`);
  }
  const whereSql = where.length ? `where ${where.join(' and ')}` : '';
  const q = `
    select
      o.*,
      coalesce(
        json_agg(json_build_object('product_name', oi.product_name, 'quantity', oi.quantity, 'price', oi.price))
        filter (where oi.id is not null),
        '[]'::json
      ) as order_items
    from orders o
    left join order_items oi on oi.order_id = o.id
    ${whereSql}
    group by o.id
    order by o.created_at desc
  `;
  const { rows } = await pool.query(q, params);
  return (rows as Array<Record<string, unknown>>).map(r => ({
    ...r,
    order_items: Array.isArray(r.order_items) ? (r.order_items as OrderExportItem[]) : [],
  }));
}

export async function deleteAdvisorLeadPg(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  try {
    const r = await pool.query(`delete from advisor_leads where id = $1::uuid`, [id]);
    if (r.rowCount === 0) return { ok: false, message: 'Không tìm thấy lead' };
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

// ─── Redirects (public, edge-safe qua API) ───────────────────────────────────

export type PublicRedirectRow = { from_path: string; to_path: string; status_code: number };

export async function fetchActiveRedirectsPg(): Promise<PublicRedirectRow[]> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<PublicRedirectRow>(
    `select from_path, to_path, status_code from redirects where is_active = true`
  );
  return rows;
}

// ─── Khách hàng (customer_accounts) ─────────────────────────────────────────

export type CustomerAccountRow = {
  id: string;
  email: string;
  password_hash: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  google_sub: string | null;
  facebook_id: string | null;
  created_at?: string;
};

export async function findCustomerByEmailNormalizedPg(email: string): Promise<CustomerAccountRow | null> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<CustomerAccountRow>(
    `select id, email, password_hash, full_name, phone, address, google_sub, facebook_id
     from customer_accounts where lower(trim(email)) = lower(trim($1)) limit 1`,
    [email]
  );
  return rows[0] ?? null;
}

export async function findCustomerByIdPg(id: string): Promise<CustomerAccountRow | null> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<CustomerAccountRow>(
    `select id, email, password_hash, full_name, phone, address, google_sub, facebook_id
     from customer_accounts where id = $1::uuid limit 1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function findCustomerByGoogleSubPg(sub: string): Promise<CustomerAccountRow | null> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<CustomerAccountRow>(
    `select id, email, password_hash, full_name, phone, address, google_sub, facebook_id
     from customer_accounts where google_sub = $1 limit 1`,
    [sub]
  );
  return rows[0] ?? null;
}

export async function findCustomerByFacebookIdPg(fbId: string): Promise<CustomerAccountRow | null> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<CustomerAccountRow>(
    `select id, email, password_hash, full_name, phone, address, google_sub, facebook_id
     from customer_accounts where facebook_id = $1 limit 1`,
    [fbId]
  );
  return rows[0] ?? null;
}

export async function insertCustomerPg(input: {
  email: string;
  passwordHash: string | null;
  fullName: string | null;
}): Promise<CustomerAccountRow | null> {
  const pool = getPostgresPool();
  try {
    const { rows } = await pool.query<CustomerAccountRow>(
      `insert into customer_accounts (email, password_hash, full_name)
       values ($1, $2, $3)
       returning id, email, password_hash, full_name, phone, address, google_sub, facebook_id`,
      [input.email.trim(), input.passwordHash, input.fullName]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function updateCustomerProfilePg(
  id: string,
  data: { full_name: string; phone: string; address: string }
): Promise<{ ok: true } | { ok: false; message: string }> {
  const pool = getPostgresPool();
  try {
    await pool.query(
      `update customer_accounts set full_name = $2, phone = $3, address = $4, updated_at = now()
       where id = $1::uuid`,
      [id, data.full_name, data.phone, data.address]
    );
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export async function setCustomerPasswordHashPg(id: string, passwordHash: string): Promise<void> {
  const pool = getPostgresPool();
  await pool.query(
    `update customer_accounts set password_hash = $2, updated_at = now() where id = $1::uuid`,
    [id, passwordHash]
  );
}

export async function linkGoogleToCustomerPg(id: string, googleSub: string, email?: string | null): Promise<void> {
  const pool = getPostgresPool();
  if (email) {
    await pool.query(
      `update customer_accounts set google_sub = $2, email = $3, updated_at = now() where id = $1::uuid`,
      [id, googleSub, email.trim()]
    );
  } else {
    await pool.query(
      `update customer_accounts set google_sub = $2, updated_at = now() where id = $1::uuid`,
      [id, googleSub]
    );
  }
}

export async function linkFacebookToCustomerPg(id: string, facebookId: string): Promise<void> {
  const pool = getPostgresPool();
  await pool.query(
    `update customer_accounts set facebook_id = $2, updated_at = now() where id = $1::uuid`,
    [id, facebookId]
  );
}

export async function insertCustomerOAuthGooglePg(
  email: string,
  googleSub: string,
  fullName: string | null
): Promise<CustomerAccountRow | null> {
  const pool = getPostgresPool();
  try {
    const { rows } = await pool.query<CustomerAccountRow>(
      `insert into customer_accounts (email, password_hash, full_name, google_sub)
       values ($1, null, $2, $3)
       returning id, email, password_hash, full_name, phone, address, google_sub, facebook_id`,
      [email.trim(), fullName, googleSub]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function insertCustomerOAuthFacebookPg(
  email: string,
  facebookId: string,
  fullName: string | null
): Promise<CustomerAccountRow | null> {
  const pool = getPostgresPool();
  try {
    const { rows } = await pool.query<CustomerAccountRow>(
      `insert into customer_accounts (email, password_hash, full_name, facebook_id)
       values ($1, null, $2, $3)
       returning id, email, password_hash, full_name, phone, address, google_sub, facebook_id`,
      [email.trim(), fullName, facebookId]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export type CustomerOrderRow = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  order_items: { product_name: string; quantity: number }[];
};

export async function listOrdersForCustomerPg(userId: string, limit = 5): Promise<CustomerOrderRow[]> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<{
    id: string;
    total: string | number;
    status: string;
    created_at: string;
    order_items: unknown;
  }>(
    `select o.id, o.total, o.status, o.created_at,
      coalesce(
        json_agg(json_build_object('product_name', oi.product_name, 'quantity', oi.quantity))
          filter (where oi.id is not null),
        '[]'::json
      ) as order_items
     from orders o
     left join order_items oi on oi.order_id = o.id
     where o.user_id::text = $1
     group by o.id
     order by o.created_at desc
     limit $2::int`,
    [userId, limit]
  );

  return rows.map(r => ({
    id: r.id,
    total: typeof r.total === 'string' ? parseFloat(r.total) : r.total,
    status: r.status,
    created_at: r.created_at,
    order_items: Array.isArray(r.order_items) ? (r.order_items as { product_name: string; quantity: number }[]) : [],
  }));
}

export async function insertCustomerAuthTokenPg(input: {
  purpose: 'password_reset' | 'magic_login';
  customerId: string;
  tokenHash: string;
  ttlHours: number;
}): Promise<void> {
  const pool = getPostgresPool();
  await pool.query(
    `insert into customer_auth_tokens (purpose, token_hash, customer_id, expires_at)
     values ($1, $2, $3::uuid, now() + ($4::int * interval '1 hour'))`,
    [input.purpose, input.tokenHash, input.customerId, input.ttlHours]
  );
}

export async function findValidCustomerAuthTokenPg(
  purpose: 'password_reset' | 'magic_login',
  tokenHash: string
): Promise<{ id: string; customer_id: string } | null> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<{ id: string; customer_id: string }>(
    `select id, customer_id from customer_auth_tokens
     where purpose = $1 and token_hash = $2 and used_at is null and expires_at > now()
     limit 1`,
    [purpose, tokenHash]
  );
  return rows[0] ?? null;
}

export async function markCustomerAuthTokenUsedPg(id: string): Promise<void> {
  const pool = getPostgresPool();
  await pool.query(`update customer_auth_tokens set used_at = now() where id = $1::uuid`, [id]);
}

export async function listCustomerAccountsPg(limit = 500): Promise<CustomerAccountRow[]> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<CustomerAccountRow>(
    `select id, email, password_hash, full_name, phone, address, google_sub, facebook_id
     from customer_accounts order by created_at desc limit $1::int`,
    [limit]
  );
  return rows;
}

export type CustomerAdminRow = CustomerAccountRow & {
  order_count: number;
};

export async function listCustomerAccountsAdminPg(limit = 2000): Promise<CustomerAdminRow[]> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<CustomerAdminRow>(
    `select c.id, c.email, c.password_hash, c.full_name, c.phone, c.address, c.google_sub, c.facebook_id,
            c.created_at,
            coalesce((
              select count(*)::int from orders o
              where o.user_id is not null and o.user_id::text = c.id::text
            ), 0) as order_count
     from customer_accounts c
     order by c.created_at desc
     limit $1::int`,
    [limit]
  );
  return rows;
}

// ─── Blog (metadata cache) ───────────────────────────────────────────────────

export async function fetchPostDateOverridesPg(): Promise<Record<string, string>> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<{ slug: string; date: string | null }>(
    `select slug, published_at::text as date
     from public.content_nodes
     where post_type = 'post' and status = 'publish' and published_at is not null`
  );
  const map: Record<string, string> = {};
  for (const r of rows) {
    if (r.slug && r.date) map[r.slug] = r.date;
  }
  return map;
}

export async function fetchDeletedPostSlugsPg(): Promise<string[]> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<{ slug: string }>(
    `select slug from public.content_nodes
     where post_type = 'post' and status in ('deleted', 'trash')`
  );
  return rows.map((r) => r.slug).filter(Boolean);
}

// ─── Admin dashboard ─────────────────────────────────────────────────────────

export async function countOrdersPg(): Promise<number> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<{ n: string }>(`select count(*)::text as n from orders`);
  return Number(rows[0]?.n ?? 0);
}

export async function countCustomerAccountsPg(): Promise<number> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<{ n: string }>(
    `select count(*)::text as n from customer_accounts`
  );
  return Number(rows[0]?.n ?? 0);
}

export type AdminRecentOrderRow = {
  id: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  status: string;
  total: number;
  payment_method: string;
  created_at: string;
  order_items: { product_name: string; quantity: number }[];
};

export async function listRecentOrdersAdminPg(limit: number): Promise<AdminRecentOrderRow[]> {
  const pool = getPostgresPool();
  const { rows: orders } = await pool.query<{
    id: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    status: string;
    total: string;
    payment_method: string;
    created_at: string;
  }>(
    `select id::text, receiver_name, receiver_phone, receiver_address, status, total::text, payment_method, created_at::text
     from orders order by created_at desc limit $1::int`,
    [limit]
  );
  if (orders.length === 0) return [];
  const ids = orders.map((o) => o.id);
  const { rows: items } = await pool.query<{
    order_id: string;
    product_name: string;
    quantity: number;
  }>(
    `select order_id::text as order_id, product_name, quantity from order_items where order_id = any($1::uuid[])`,
    [ids]
  );
  const byOrder = new Map<string, { product_name: string; quantity: number }[]>();
  for (const it of items) {
    const list = byOrder.get(it.order_id) ?? [];
    list.push({ product_name: it.product_name, quantity: it.quantity });
    byOrder.set(it.order_id, list);
  }
  return orders.map((o) => ({
    id: o.id,
    receiver_name: o.receiver_name,
    receiver_phone: o.receiver_phone,
    receiver_address: o.receiver_address ?? '',
    status: o.status,
    total: Number(o.total),
    payment_method: o.payment_method,
    created_at: o.created_at,
    order_items: byOrder.get(o.id) ?? [],
  }));
}

export async function sumOrderTotalsNonCancelledPg(): Promise<number> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<{ s: string | null }>(
    `select coalesce(sum(total), 0)::text as s from orders where status <> 'cancelled'`
  );
  return Number(rows[0]?.s ?? 0);
}

export type OrderRevenuePointRow = { created_at: string; total: number };

export async function listOrderTotalsForRevenueChartPg(sinceIso: string): Promise<OrderRevenuePointRow[]> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<{ created_at: string; total: string }>(
    `select created_at::text, total::text from orders
     where status <> 'cancelled' and created_at >= $1::timestamptz
     order by created_at asc`,
    [sinceIso]
  );
  return rows.map((r) => ({ created_at: r.created_at, total: Number(r.total) }));
}

export async function listOrderSummariesPg(): Promise<{ id: string; status: string }[]> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<{ id: string; status: string }>(
    `select id::text, status from orders order by created_at desc`
  );
  return rows;
}

/** Danh sách đơn kèm order_items (admin đơn hàng) — optional lọc status */
export async function listOrdersWithItemsAdminPg(
  statusFilter?: string | null
): Promise<AdminRecentOrderRow[]> {
  const pool = getPostgresPool();
  type O = {
    id: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    status: string;
    total: string;
    payment_method: string;
    created_at: string;
  };
  const { rows: orders } = statusFilter
    ? await pool.query<O>(
        `select id::text, receiver_name, receiver_phone, receiver_address, status, total::text, payment_method, created_at::text
         from orders where status = $1 order by created_at desc`,
        [statusFilter]
      )
    : await pool.query<O>(
        `select id::text, receiver_name, receiver_phone, receiver_address, status, total::text, payment_method, created_at::text
         from orders order by created_at desc`
      );
  if (orders.length === 0) return [];
  const ids = orders.map((o) => o.id);
  const { rows: items } = await pool.query<{
    order_id: string;
    product_name: string;
    quantity: number;
  }>(
    `select order_id::text as order_id, product_name, quantity from order_items where order_id = any($1::uuid[])`,
    [ids]
  );
  const byOrder = new Map<string, { product_name: string; quantity: number }[]>();
  for (const it of items) {
    const list = byOrder.get(it.order_id) ?? [];
    list.push({ product_name: it.product_name, quantity: it.quantity });
    byOrder.set(it.order_id, list);
  }
  return orders.map((o) => ({
    id: o.id,
    receiver_name: o.receiver_name,
    receiver_phone: o.receiver_phone,
    receiver_address: o.receiver_address ?? '',
    status: o.status,
    total: Number(o.total),
    payment_method: o.payment_method,
    created_at: o.created_at,
    order_items: byOrder.get(o.id) ?? [],
  }));
}

export async function listPostsAdminSummaryPg(): Promise<
  Array<{
    slug: string;
    title: string;
    thumbnail: string | null;
    categories: string[] | null;
    tags: string[] | null;
    date: string | null;
    status: string | null;
    meta_title: string | null;
    meta_desc: string | null;
    focus_keyword: string | null;
  }>
> {
  const pool = getPostgresPool();
  const { rows } = await pool.query(
    `select slug, title,
            featured_image_source_url as thumbnail,
            categories, tags,
            coalesce(published_at::text, imported_at::text) as date,
            status,
            seo_title as meta_title,
            seo_description as meta_desc,
            null::text as focus_keyword
     from public.content_nodes
     where post_type = 'post'
     order by coalesce(published_at, imported_at) desc nulls last`
  );
  return rows as Array<{
    slug: string;
    title: string;
    thumbnail: string | null;
    categories: string[] | null;
    tags: string[] | null;
    date: string | null;
    status: string | null;
    meta_title: string | null;
    meta_desc: string | null;
    focus_keyword: string | null;
  }>;
}

/** Chi tiết đơn admin: order + order_items + ghi chú */
export async function fetchAdminOrderDetailPg(orderId: string): Promise<{
  order: Record<string, unknown> & { order_items: Record<string, unknown>[] };
  notes: Record<string, unknown>[];
} | null> {
  const pool = getPostgresPool();
  const { rows: oRows } = await pool.query<Record<string, unknown>>(
    `select * from orders where id = $1::uuid limit 1`,
    [orderId]
  );
  const orderRow = oRows[0];
  if (!orderRow) return null;
  const { rows: items } = await pool.query<Record<string, unknown>>(
    `select * from order_items where order_id = $1::uuid`,
    [orderId]
  );
  const { rows: notes } = await pool.query<Record<string, unknown>>(
    `select * from order_notes where order_id = $1::uuid order by created_at desc`,
    [orderId]
  );
  return {
    order: { ...orderRow, order_items: items },
    notes,
  };
}

/** Trang xác nhận đơn — chỉ cần thông tin hiển thị + order_items */
export async function fetchOrderWithItemsByIdPg(orderId: string): Promise<{
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  payment_method: string;
  total: number;
  order_items: Record<string, unknown>[];
} | null> {
  const pool = getPostgresPool();
  const { rows } = await pool.query<{
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string | null;
    payment_method: string;
    total: string;
  }>(
    `select receiver_name, receiver_phone, receiver_address, payment_method, total::text
     from orders where id = $1::uuid limit 1`,
    [orderId]
  );
  const o = rows[0];
  if (!o) return null;
  const { rows: items } = await pool.query<Record<string, unknown>>(
    `select * from order_items where order_id = $1::uuid`,
    [orderId]
  );
  return {
    receiver_name: o.receiver_name,
    receiver_phone: o.receiver_phone,
    receiver_address: o.receiver_address ?? '',
    payment_method: o.payment_method,
    total: Number(o.total),
    order_items: items,
  };
}
