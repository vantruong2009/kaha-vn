import type { Metadata } from 'next';
import Link from 'next/link';
import { getPage } from '@/lib/get-page';
import PolicyContactBox from '@/components/PolicyContactBox';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật',
  description:
    'Chính sách bảo mật thông tin khách hàng của LongDenViet. Chúng tôi cam kết bảo vệ dữ liệu cá nhân và không chia sẻ với bên thứ ba.',
  alternates: { canonical: '/chinh-sach-bao-mat' },
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'LongDenViet thu thập những thông tin gì của tôi?',
      acceptedAnswer: { '@type': 'Answer', text: 'LongDenViet chỉ thu thập thông tin cần thiết: họ tên, số điện thoại, địa chỉ giao hàng (để xử lý đơn hàng); phương thức thanh toán (qua cổng bảo mật VNPay/MoMo); dữ liệu duyệt web qua cookie để cải thiện website.' },
    },
    {
      '@type': 'Question',
      name: 'LongDenViet có bán thông tin của tôi cho bên thứ ba không?',
      acceptedAnswer: { '@type': 'Answer', text: 'Không. LongDenViet cam kết không bán, cho thuê hoặc chia sẻ thông tin cá nhân của khách hàng với bên thứ ba vì mục đích thương mại.' },
    },
    {
      '@type': 'Question',
      name: 'Tôi có thể yêu cầu xóa thông tin cá nhân không?',
      acceptedAnswer: { '@type': 'Answer', text: 'Có, bạn có quyền yêu cầu xóa dữ liệu cá nhân bằng cách liên hệ Zalo 0989 778 247 hoặc email sales@longdenviet.com, trừ trường hợp pháp luật yêu cầu lưu giữ.' },
    },
    {
      '@type': 'Question',
      name: 'LongDenViet bảo vệ thông tin tôi như thế nào?',
      acceptedAnswer: { '@type': 'Answer', text: 'LongDenViet sử dụng mã hóa SSL/TLS cho toàn bộ dữ liệu truyền tải, kiểm soát truy cập nội bộ chặt chẽ, lưu trữ trên máy chủ có tường lửa bảo vệ và giám sát hệ thống liên tục.' },
    },
  ],
};

export default async function PrivacyPolicyPage() {
  const page = await getPage('chinh-sach-bao-mat');
  if (page?.content) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>{page.meta_title || page.title || 'Chính Sách Bảo Mật'}</h1>
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
            <span className="text-[11px] font-medium" style={{ color: '#1a1a1a' }}>Chính sách bảo mật</span>
          </nav>
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#c9822a' }}>Chính sách</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>
            Chính Sách Bảo Mật
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

            {/* Intro */}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(26,107,60,0.05)', border: '1px solid rgba(26,107,60,0.15)' }}>
              <p className="text-[13px] leading-[1.8]" style={{ color: '#4a4a4a' }}>
                LongDenViet cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn khi sử dụng dịch vụ tại longdenviet.com.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                1. Thu Thập Thông Tin
              </h2>
              <p className="text-[13px] mb-4 leading-[1.8]" style={{ color: '#6a5840' }}>
                Chúng tôi chỉ thu thập thông tin cần thiết để phục vụ giao dịch và cải thiện trải nghiệm của bạn:
              </p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    title: 'Thông tin đặt hàng',
                    desc: 'Họ tên, số điện thoại, địa chỉ giao hàng, email (tùy chọn) — dùng để xử lý và giao đơn hàng.',
                  },
                  {
                    title: 'Thông tin thanh toán',
                    desc: 'Phương thức thanh toán bạn chọn. LongDenViet không lưu trữ thông tin thẻ ngân hàng; việc xử lý thanh toán do VNPay/MoMo thực hiện theo chuẩn PCI-DSS.',
                  },
                  {
                    title: 'Dữ liệu duyệt web',
                    desc: 'Thông tin trình duyệt, địa chỉ IP, trang đã xem — thu thập qua cookie để phân tích và cải thiện hiệu suất website.',
                  },
                  {
                    title: 'Thông tin tự nguyện',
                    desc: 'Đánh giá sản phẩm, tin nhắn liên hệ, đăng ký nhận bản tin — chỉ khi bạn chủ động cung cấp.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-4 rounded-2xl" style={{ border: '1px solid #EDE5D8' }}>
                    <span className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5" style={{ background: 'rgba(26,107,60,0.08)', color: '#1a6b3c' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </span>
                    <div>
                      <div className="text-[13px] font-bold mb-0.5" style={{ color: '#1a1a1a' }}>{item.title}</div>
                      <p className="text-[12px] leading-[1.75]" style={{ color: '#6a5840' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                2. Sử Dụng Thông Tin
              </h2>
              <p className="text-[13px] mb-3 leading-[1.8]" style={{ color: '#6a5840' }}>
                Thông tin của bạn được sử dụng cho các mục đích sau:
              </p>
              <ul className="flex flex-col gap-2.5 text-[13px]" style={{ color: '#6a5840' }}>
                {[
                  'Xử lý đơn hàng, xác nhận giao dịch và giao hàng đúng địa chỉ',
                  'Liên hệ xác nhận đơn hàng qua Zalo/SMS sau khi đặt hàng',
                  'Gửi thông báo về trạng thái đơn hàng và vận chuyển',
                  'Gửi bản tin khuyến mãi (chỉ khi bạn đã đăng ký, có thể hủy bất kỳ lúc nào)',
                  'Phân tích hành vi mua sắm để cải thiện sản phẩm và dịch vụ',
                  'Tuân thủ nghĩa vụ pháp lý khi cần thiết',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-4 rounded-2xl text-[13px] leading-[1.8]" style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)', border: '1px solid #EDE5D8', color: '#4a4a4a' }}>
                <strong style={{ color: '#1a1a1a' }}>Cam kết:</strong> LongDenViet <strong>không bán, cho thuê hoặc chia sẻ</strong> thông tin cá nhân của bạn với bên thứ ba vì mục đích thương mại.
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                3. Bảo Mật Thông Tin
              </h2>
              <p className="text-[13px] mb-4 leading-[1.8]" style={{ color: '#6a5840' }}>
                Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ dữ liệu của bạn:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
                    title: 'Mã hóa SSL/TLS', desc: 'Toàn bộ dữ liệu truyền tải được mã hóa',
                  },
                  {
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                    title: 'Kiểm soát truy cập', desc: 'Chỉ nhân viên có thẩm quyền mới truy cập được dữ liệu',
                  },
                  {
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1M12 15v2"/><circle cx="12" cy="14" r="1" fill="currentColor"/></svg>,
                    title: 'Lưu trữ an toàn', desc: 'Dữ liệu lưu trên máy chủ có tường lửa bảo vệ',
                  },
                  {
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                    title: 'Giám sát liên tục', desc: 'Hệ thống được theo dõi để phát hiện xâm nhập bất thường',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-4 rounded-2xl" style={{ border: '1px solid #EDE5D8' }}>
                    <span className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5" style={{ background: 'rgba(26,107,60,0.08)', color: '#1a6b3c' }}>{item.icon}</span>
                    <div>
                      <div className="text-[13px] font-bold mb-0.5" style={{ color: '#1a1a1a' }}>{item.title}</div>
                      <p className="text-[12px] leading-[1.75]" style={{ color: '#6a5840' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                4. Quyền Của Khách Hàng
              </h2>
              <p className="text-[13px] mb-4 leading-[1.8]" style={{ color: '#6a5840' }}>
                Bạn có đầy đủ quyền đối với dữ liệu cá nhân của mình:
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { right: 'Quyền truy cập', desc: 'Yêu cầu xem thông tin cá nhân chúng tôi đang lưu về bạn.' },
                  { right: 'Quyền chỉnh sửa', desc: 'Yêu cầu cập nhật thông tin không chính xác hoặc không đầy đủ.' },
                  { right: 'Quyền xóa', desc: 'Yêu cầu xóa dữ liệu cá nhân (trừ trường hợp pháp luật yêu cầu lưu giữ).' },
                  { right: 'Quyền rút đồng ý', desc: 'Hủy đăng ký nhận bản tin marketing bất kỳ lúc nào qua link trong email.' },
                  { right: 'Quyền khiếu nại', desc: 'Gửi khiếu nại đến Cục An toàn thông tin (Bộ TT&TT) nếu quyền lợi bị vi phạm.' },
                ].map((item) => (
                  <div key={item.right} className="flex items-start gap-3">
                    <span className="text-[13px] font-bold mt-0.5 shrink-0" style={{ color: '#1a6b3c', minWidth: '140px' }}>{item.right}:</span>
                    <p className="text-[13px] leading-[1.8]" style={{ color: '#6a5840' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                5. Liên Hệ Về Bảo Mật
              </h2>
              <p className="text-[13px] mb-4 leading-[1.8]" style={{ color: '#6a5840' }}>
                Nếu bạn có bất kỳ câu hỏi, yêu cầu hoặc khiếu nại liên quan đến chính sách bảo mật này, vui lòng liên hệ:
              </p>
              <PolicyContactBox items={[
                { type: 'company', label: 'LongDenViet', value: 'Đèn Lồng Thủ Công Truyền Thống' },
                { type: 'address', label: 'Địa chỉ',    value: '262/1/93 Phan Anh, Phường Phú Thạnh, Thành Phố Hồ Chí Minh, Việt Nam' },
                { type: 'zalo',    label: 'Zalo',        value: '0989 778 247', href: 'https://zalo.me/0989778247' },
                { type: 'email',   label: 'Email',       value: 'sales@longdenviet.com', href: 'mailto:sales@longdenviet.com' },
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
