import type { Metadata } from 'next';
import Link from 'next/link';
import { getPage } from '@/lib/get-page';
import PolicyContactBox from '@/components/PolicyContactBox';

export const metadata: Metadata = {
  title: 'Chính Sách Vận Chuyển',
  description:
    'Thông tin phí vận chuyển, thời gian giao hàng và các đơn vị vận chuyển của LongDenViet. Miễn phí ship cho đơn từ 500.000đ.',
  alternates: { canonical: '/chinh-sach-van-chuyen' },
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'LongDenViet có miễn phí vận chuyển không?',
      acceptedAnswer: { '@type': 'Answer', text: 'Có, LongDenViet miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000đ trở lên qua GHN Tiêu Chuẩn. Đơn dưới 500.000đ phí ship 35.000đ.' },
    },
    {
      '@type': 'Question',
      name: 'Thời gian giao hàng mất bao lâu?',
      acceptedAnswer: { '@type': 'Answer', text: 'TP.HCM: 1–2 ngày làm việc. Hà Nội, Đà Nẵng: 2–3 ngày làm việc. Tỉnh thành khác: 3–5 ngày làm việc. Vùng cao/hải đảo: 5–7 ngày làm việc.' },
    },
    {
      '@type': 'Question',
      name: 'LongDenViet hợp tác với đơn vị vận chuyển nào?',
      acceptedAnswer: { '@type': 'Answer', text: 'LongDenViet hợp tác chính với Giao Hàng Nhanh (GHN) phủ sóng 63 tỉnh thành, và Giao Hàng Tiết Kiệm (GHTK) tại một số tỉnh miền Bắc, miền Trung.' },
    },
    {
      '@type': 'Question',
      name: 'Tôi có thể thay đổi địa chỉ giao hàng sau khi đặt không?',
      acceptedAnswer: { '@type': 'Answer', text: 'Bạn có thể thay đổi địa chỉ giao hàng nếu đơn hàng chưa bàn giao cho đơn vị vận chuyển. Liên hệ ngay qua Zalo 0989 778 247 để được hỗ trợ.' },
    },
  ],
};

export default async function ShippingPolicyPage() {
  const page = await getPage('chinh-sach-van-chuyen');
  if (page?.content) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>{page.meta_title || page.title || 'Chính Sách Vận Chuyển'}</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div
            className="relative overflow-hidden prose max-w-none"
            style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '40px' }}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    );
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\/script>/gi, '<\\/script>') }}
      />
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-5">
            <Link href="/" className="text-[11px] font-medium transition-colors hover:text-[#104e2e]" style={{ color: '#a0907a' }}>Trang chủ</Link>
            <span style={{ color: '#c0b0a0' }}>›</span>
            <span className="text-[11px] font-medium" style={{ color: '#1a1a1a' }}>Chính sách vận chuyển</span>
          </nav>
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#c9822a' }}>Chính sách</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>
            Chính Sách Vận Chuyển
          </h1>
          <p className="text-[13px]" style={{ color: '#a0907a' }}>Cập nhật lần cuối: tháng 1, 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">

        {/* Main card */}
        <div
          className="relative overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} aria-hidden="true" />
          <div className="p-7 md:p-10 space-y-8">

            {/* Free shipping callout */}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(26,107,60,0.05)', border: '1px solid rgba(26,107,60,0.15)' }}>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(26,107,60,0.1)', color: '#1a6b3c' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </span>
                <div>
                  <div className="font-bold text-[14px] mb-1" style={{ color: '#1a6b3c' }}>
                    Miễn phí vận chuyển cho đơn từ 500.000đ
                  </div>
                  <p className="text-[13px] leading-[1.8]" style={{ color: '#4a4a4a' }}>
                    Áp dụng toàn quốc với phương thức vận chuyển tiêu chuẩn GHN. Đơn dưới 500.000đ phí ship 35.000đ.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 - Shipping fees */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                1. Phí Vận Chuyển
              </h2>
              <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid #EDE5D8' }}>
                <table className="w-full text-[13px]">
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)' }}>
                      <th className="text-left px-4 py-3 font-bold" style={{ color: '#1a1a1a' }}>Phương thức</th>
                      <th className="text-left px-4 py-3 font-bold" style={{ color: '#1a1a1a' }}>Đơn dưới 500k</th>
                      <th className="text-left px-4 py-3 font-bold" style={{ color: '#1a1a1a' }}>Đơn từ 500k</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: '1px solid #EDE5D8' }}>
                    <tr style={{ borderBottom: '1px solid #EDE5D8' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>GHN Tiêu Chuẩn</td>
                      <td className="px-4 py-3" style={{ color: '#6a5840' }}>35.000đ</td>
                      <td className="px-4 py-3 font-bold" style={{ color: '#1a6b3c' }}>Miễn phí</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>GHN Hỏa Tốc</td>
                      <td className="px-4 py-3" style={{ color: '#6a5840' }}>65.000đ</td>
                      <td className="px-4 py-3" style={{ color: '#6a5840' }}>65.000đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] mt-3 leading-relaxed" style={{ color: '#a0907a' }}>
                * Phí vận chuyển có thể thay đổi theo vùng địa lý xa trung tâm. Chúng tôi sẽ thông báo nếu có phụ phí trước khi xác nhận đơn hàng.
              </p>
            </section>

            {/* Section 2 - Delivery time */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                2. Thời Gian Giao Hàng
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { region: 'TP. Hồ Chí Minh',   standard: '1–2 ngày làm việc',  express: 'Trong ngày hoặc ngày hôm sau' },
                  { region: 'Hà Nội & Đà Nẵng',  standard: '2–3 ngày làm việc',  express: '1–2 ngày làm việc' },
                  { region: 'Tỉnh / Thành khác', standard: '3–5 ngày làm việc',  express: '2–3 ngày làm việc' },
                  { region: 'Vùng cao / Hải đảo',standard: '5–7 ngày làm việc',  express: 'Liên hệ để biết thêm' },
                ].map((item) => (
                  <div key={item.region} className="p-4 rounded-2xl" style={{ border: '1px solid #EDE5D8' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(26,107,60,0.08)', color: '#1a6b3c' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 2C8.68 2 6 4.68 6 8c0 4.75 6 13 6 13s6-8.25 6-13c0-3.32-2.68-6-6-6z"/><circle cx="12" cy="8" r="2"/></svg>
                      </span>
                      <div className="text-[13px] font-bold" style={{ color: '#1a1a1a' }}>{item.region}</div>
                    </div>
                    <div className="flex flex-col gap-1 text-[12px]" style={{ color: '#6a5840' }}>
                      <div className="flex justify-between">
                        <span style={{ color: '#a0907a' }}>Tiêu chuẩn:</span>
                        <span className="font-medium">{item.standard}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#a0907a' }}>Hỏa tốc:</span>
                        <span className="font-medium">{item.express}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] mt-3 leading-relaxed" style={{ color: '#a0907a' }}>
                * Thời gian trên tính từ lúc đơn hàng được xác nhận và bàn giao cho đơn vị vận chuyển (trong giờ làm việc, không kể ngày lễ tết).
              </p>
            </section>

            {/* Section 3 - Carriers */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                3. Đơn Vị Vận Chuyển
              </h2>
              <p className="text-[13px] mb-4 leading-[1.8]" style={{ color: '#6a5840' }}>
                LongDenViet hợp tác với các đơn vị vận chuyển uy tín để đảm bảo đèn thủ công được đóng gói cẩn thận và giao đến tay bạn an toàn.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    name: 'Giao Hàng Nhanh (GHN)',
                    desc: 'Đối tác chính — phủ sóng toàn quốc 63 tỉnh thành, hệ thống tra cứu đơn hàng trực tuyến.',
                    highlight: true,
                  },
                  {
                    name: 'Giao Hàng Tiết Kiệm (GHTK)',
                    desc: 'Đối tác phụ — phục vụ một số tỉnh thành khu vực miền Bắc và miền Trung.',
                    highlight: false,
                  },
                ].map((carrier) => (
                  <div
                    key={carrier.name}
                    className="flex items-start gap-3 p-4 rounded-2xl"
                    style={{
                      border: carrier.highlight ? '1px solid rgba(26,107,60,0.2)' : '1px solid #EDE5D8',
                      background: carrier.highlight ? 'rgba(26,107,60,0.04)' : '#FFFFFF',
                    }}
                  >
                    <span className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)', color: '#a0907a' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="text-[13px] font-bold" style={{ color: '#1a1a1a' }}>{carrier.name}</div>
                        {carrier.highlight && (
                          <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-md" style={{ background: '#1a6b3c', color: '#fff' }}>
                            Chính
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] leading-[1.75]" style={{ color: '#6a5840' }}>{carrier.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 - Support */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                4. Hỗ Trợ Vận Chuyển
              </h2>
              <p className="text-[13px] mb-4 leading-[1.8]" style={{ color: '#6a5840' }}>
                Nếu bạn cần hỗ trợ theo dõi đơn hàng, thay đổi địa chỉ giao hàng sau khi đặt, hoặc có vấn đề với quá trình giao hàng, hãy liên hệ ngay:
              </p>
              <PolicyContactBox items={[
                { type: 'zalo',      label: 'Zalo',      value: '0989 778 247 (8:00–21:00 mỗi ngày)', href: 'https://zalo.me/0989778247' },
                { type: 'email',     label: 'Email',     value: 'sales@longdenviet.com',               href: 'mailto:sales@longdenviet.com' },
                { type: 'messenger', label: 'Messenger', value: 'm.me/longdenviet',                   href: 'https://m.me/longdenviet' },
              ]} />
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-semibold transition-colors hover:underline" style={{ color: '#1a6b3c' }}>
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
