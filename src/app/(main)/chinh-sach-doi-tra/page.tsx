import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyContactBox from '@/components/PolicyContactBox';
import { getPage } from '@/lib/get-page';

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Tôi có thể đổi trả hàng trong bao lâu?',
      acceptedAnswer: { '@type': 'Answer', text: 'LongDenViet chấp nhận đổi trả trong vòng 7 ngày kể từ ngày nhận hàng, áp dụng cho sản phẩm lỗi kỹ thuật từ nhà sản xuất hoặc giao không đúng mẫu.' },
    },
    {
      '@type': 'Question',
      name: 'Phí vận chuyển đổi trả do ai chịu?',
      acceptedAnswer: { '@type': 'Answer', text: 'Phí vận chuyển đổi trả lần đầu do LongDenViet chịu nếu lỗi từ phía chúng tôi. Từ lần thứ hai trở đi, khách hàng chịu phí vận chuyển một chiều.' },
    },
    {
      '@type': 'Question',
      name: 'Sản phẩm đặt theo yêu cầu riêng có được đổi trả không?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sản phẩm đặt theo yêu cầu riêng (khắc tên, màu sắc/kích thước tùy chỉnh) không áp dụng đổi trả trừ trường hợp lỗi kỹ thuật từ nhà sản xuất.' },
    },
    {
      '@type': 'Question',
      name: 'Quy trình đổi trả diễn ra như thế nào?',
      acceptedAnswer: { '@type': 'Answer', text: 'Bước 1: Liên hệ Zalo 0989 778 247 kèm ảnh/video sản phẩm lỗi. Bước 2: Nhận xác nhận và địa chỉ gửi hàng. Bước 3: Gửi hàng qua GHN hoặc GHTK. Bước 4: Nhận sản phẩm thay thế trong 3–5 ngày làm việc.' },
    },
    {
      '@type': 'Question',
      name: 'Điều kiện để sản phẩm được chấp nhận đổi trả là gì?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng, còn đầy đủ tem nhãn và bao bì gốc. Cần có ảnh/video chứng minh tình trạng sản phẩm tại thời điểm nhận hàng.' },
    },
  ],
};

export const metadata: Metadata = {
  title: 'Chính Sách Đổi Trả Hàng',
  description:
    'Chính sách đổi trả hàng của LongDenViet — Đổi trả trong 7 ngày, miễn phí đổi lần đầu. Cam kết hỗ trợ khách hàng tận tình.',
  alternates: { canonical: '/chinh-sach-doi-tra' },
};

export default async function ReturnPolicyPage() {
  await getPage('chinh-sach-doi-tra'); // preload only, use static content below
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
            <span className="text-[11px] font-medium" style={{ color: '#1a1a1a' }}>Chính sách đổi trả</span>
          </nav>
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#c9822a' }}>Chính sách</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>
            Chính Sách Đổi Trả
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

            {/* Summary box */}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(26,107,60,0.05)', border: '1px solid rgba(26,107,60,0.15)' }}>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(26,107,60,0.1)', color: '#1a6b3c' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/></svg>
                </span>
                <div>
                  <div className="font-bold text-[14px] mb-1" style={{ color: '#1a6b3c' }}>
                    Đổi trả trong 7 ngày — Miễn phí lần đầu
                  </div>
                  <p className="text-[13px] leading-[1.8]" style={{ color: '#4a4a4a' }}>
                    LongDenViet cam kết hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi từ nhà sản xuất hoặc không đúng với mô tả.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                1. Điều Kiện Đổi Trả
              </h2>
              <p className="text-[13px] mb-4 leading-[1.8]" style={{ color: '#6a5840' }}>
                Chúng tôi chấp nhận đổi trả khi đáp ứng <strong>tất cả</strong> các điều kiện sau:
              </p>
              <ul className="flex flex-col gap-2.5 text-[13px]" style={{ color: '#6a5840' }}>
                {[
                  'Yêu cầu đổi trả trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng (theo dấu bưu điện/GHN/GHTK)',
                  'Sản phẩm còn nguyên vẹn, chưa qua sử dụng, còn đầy đủ tem nhãn và bao bì gốc',
                  'Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất: đứt dây, gãy khung tre, phai màu vải bất thường',
                  'Sản phẩm giao không đúng mẫu, màu sắc hoặc kích thước so với đơn đặt hàng',
                  'Có ảnh/video chứng minh tình trạng sản phẩm tại thời điểm nhận hàng',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                2. Quy Trình Đổi Trả
              </h2>
              <div className="flex flex-col gap-4">
                {[
                  {
                    step: '01',
                    title: 'Liên hệ LongDenViet',
                    desc: 'Nhắn Zalo 0989 778 247 hoặc email sales@longdenviet.com kèm mã đơn hàng, ảnh/video sản phẩm lỗi.',
                  },
                  {
                    step: '02',
                    title: 'Xác nhận và gửi hàng',
                    desc: 'Sau khi xác nhận, chúng tôi sẽ cung cấp địa chỉ gửi hàng. Khách hàng đóng gói kỹ và gửi qua GHN hoặc GHTK.',
                  },
                  {
                    step: '03',
                    title: 'Kiểm tra và xử lý',
                    desc: 'Chúng tôi kiểm tra trong 1–2 ngày làm việc sau khi nhận hàng. Nếu đủ điều kiện, chúng tôi gửi sản phẩm thay thế ngay.',
                  },
                  {
                    step: '04',
                    title: 'Hoàn tất',
                    desc: 'Sản phẩm mới sẽ được giao đến bạn trong 3–5 ngày làm việc. Phí vận chuyển đổi trả lần đầu do LongDenViet chịu.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div
                      className="w-9 h-9 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', boxShadow: '0 2px 8px rgba(16,78,46,.3)' }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold mb-0.5" style={{ color: '#1a1a1a' }}>{item.title}</div>
                      <p className="text-[13px] leading-[1.8]" style={{ color: '#6a5840' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                3. Sản Phẩm Không Được Đổi Trả
              </h2>
              <p className="text-[13px] mb-3 leading-[1.8]" style={{ color: '#6a5840' }}>
                Chúng tôi <strong>không nhận đổi trả</strong> trong các trường hợp sau:
              </p>
              <ul className="flex flex-col gap-2 text-[13px]" style={{ color: '#6a5840' }}>
                {[
                  'Sản phẩm đã qua sử dụng, có dấu hiệu hư hỏng do người dùng (rơi, nước, lửa)',
                  'Đổi trả sau 7 ngày kể từ ngày nhận hàng',
                  'Sản phẩm đặt theo yêu cầu riêng (khắc tên, màu sắc/kích thước tùy chỉnh)',
                  'Sản phẩm không còn đầy đủ bao bì, tem nhãn gốc',
                  'Thay đổi ý do không thích (chỉ áp dụng đổi trả khi lỗi sản phẩm)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d04a2e" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                4. Liên Hệ Hỗ Trợ
              </h2>
              <PolicyContactBox />
            </section>
          </div>
        </div>

        {/* Back link */}
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
