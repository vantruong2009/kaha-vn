import type { Metadata } from 'next';
import Link from 'next/link';
import { getPage } from '@/lib/get-page';
import PolicyContactBox from '@/components/PolicyContactBox';

export const metadata: Metadata = {
  title: 'Điều Khoản và Điều Kiện | LongDenViet',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ tại LongDenViet — Chính sách bảo mật, bán hàng, chia sẻ thông tin khách hàng.',
  alternates: { canonical: '/dieu-khoan' },
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'LongDenViet có chia sẻ thông tin khách hàng cho bên thứ ba không?',
      acceptedAnswer: { '@type': 'Answer', text: 'Không. LongDenViet cam kết không chia sẻ thông tin khách hàng cho bất kỳ bên thứ ba nào, ngoại trừ đơn vị vận chuyển liên quan trực tiếp đến giao hàng.' },
    },
    {
      '@type': 'Question',
      name: 'Sản phẩm thủ công có được phép có sai lệch nhỏ về kích thước không?',
      acceptedAnswer: { '@type': 'Answer', text: 'Có, vì sản phẩm được làm thủ công hoàn toàn, mỗi chiếc đèn có thể có sai lệch nhỏ về màu sắc hoặc kích thước so với hình ảnh (±5%). Đây là đặc trưng của hàng thủ công, không phải lỗi sản phẩm.' },
    },
    {
      '@type': 'Question',
      name: 'Phương thức thanh toán nào được chấp nhận tại LongDenViet?',
      acceptedAnswer: { '@type': 'Answer', text: 'LongDenViet chấp nhận: COD (tiền mặt khi nhận hàng), chuyển khoản ngân hàng, VNPay và MoMo. Đơn từ 3 triệu VNĐ hoặc giao ngoài TP.HCM cần đặt cọc 50%.' },
    },
    {
      '@type': 'Question',
      name: 'Sau khi đặt hàng bao lâu tôi sẽ nhận được xác nhận?',
      acceptedAnswer: { '@type': 'Answer', text: 'LongDenViet sẽ xác nhận đơn hàng qua Zalo hoặc SMS trong vòng 2–4 giờ trong giờ làm việc (8:00–21:00 mỗi ngày). Đơn hàng chỉ được xử lý sau khi xác nhận.' },
    },
  ],
};

const sections = [
  {
    title: 'I. Chính Sách Bảo Mật và Chia Sẻ Thông Tin',
    items: [
      {
        heading: 'Mục đích',
        content:
          'Website Lồng Đèn Việt (longdenviet.com) tôn trọng sự riêng tư, muốn bảo vệ thông tin cá nhân và thông tin thanh toán của bạn. Chính sách bảo mật dưới đây là những cam kết mà chúng tôi thực hiện nhằm tôn trọng và bảo vệ quyền lợi của người truy cập.',
      },
      {
        heading: '2.1/ Thu thập thông tin',
        content:
          'Khi khách hàng thực hiện giao dịch / đăng ký mở tài khoản tại Lồng Đèn Việt, khách hàng phải cung cấp một số thông tin cần thiết. Khách hàng có trách nhiệm bảo đảm thông tin đúng và luôn cập nhật đầy đủ và chính xác nhất.',
      },
      {
        heading: '2.2/ Lưu trữ và bảo mật thông tin riêng',
        content:
          'Thông tin khách hàng, cũng như các trao đổi giữa khách hàng và Lồng Đèn Việt, đều được lưu trữ và bảo mật bởi hệ thống của Lồng Đèn Việt. Chúng tôi có các biện pháp thích hợp về kỹ thuật và an ninh để ngăn chặn việc truy cập, sử dụng trái phép thông tin khách hàng.',
      },
      {
        heading: '2.3/ Sử dụng thông tin khách hàng',
        content:
          'Lồng Đèn Việt có quyền sử dụng thông tin khách hàng để: giao hàng theo địa chỉ đã cung cấp; cung cấp thông tin về sản phẩm, ưu đãi; xử lý đơn đặt hàng; cải thiện trải nghiệm người dùng thông qua dữ liệu cookies.',
      },
      {
        heading: 'Chia sẻ thông tin khách hàng',
        content:
          'Lồng Đèn Việt cam kết sẽ không chia sẻ thông tin của khách hàng cho bất kỳ công ty nào khác, ngoại trừ những bên thứ ba có liên quan trực tiếp đến việc giao hàng. Chúng tôi có thể tiết lộ thông tin cá nhân khi có yêu cầu của cơ quan pháp luật hoặc khi được sự đồng ý của khách hàng.',
      },
    ],
  },
  {
    title: 'II. Điều Khoản Sử Dụng Dịch Vụ',
    items: [
      {
        heading: 'Phạm vi áp dụng',
        content:
          'Các điều khoản này áp dụng cho tất cả khách hàng và người dùng truy cập website longdenviet.com. Bằng việc sử dụng website, bạn đồng ý với toàn bộ điều khoản được nêu.',
      },
      {
        heading: 'Quyền và nghĩa vụ của khách hàng',
        content:
          'Khách hàng có quyền: tra cứu thông tin sản phẩm, đặt hàng trực tuyến, yêu cầu hỗ trợ sau bán hàng. Khách hàng có nghĩa vụ: cung cấp thông tin chính xác khi đặt hàng, thanh toán đúng hạn, kiểm tra hàng khi nhận.',
      },
      {
        heading: 'Giới hạn trách nhiệm',
        content:
          'LongDenViet không chịu trách nhiệm với những thiệt hại phát sinh do sự cố kỹ thuật ngoài tầm kiểm soát, thiên tai, hoặc hành động của bên thứ ba. Mức bồi thường tối đa không vượt quá giá trị đơn hàng.',
      },
      {
        heading: 'Thay đổi điều khoản',
        content:
          'LongDenViet có quyền thay đổi điều khoản mà không cần thông báo trước. Phiên bản điều khoản mới nhất luôn được đăng tải trên website. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận điều khoản mới.',
      },
    ],
  },
  {
    title: 'III. Chính Sách Bán Hàng',
    items: [
      {
        heading: 'Đặt hàng và xác nhận',
        content:
          'Sau khi đặt hàng thành công, chúng tôi sẽ xác nhận qua Zalo/SMS trong vòng 2–4 giờ trong giờ làm việc (8:00–21:00 mỗi ngày). Đơn hàng chỉ được xử lý sau khi xác nhận.',
      },
      {
        heading: 'Giá cả và thanh toán',
        content:
          'Tất cả giá niêm yết đã bao gồm VAT (nếu áp dụng). Phương thức thanh toán: COD (tiền mặt khi nhận hàng), chuyển khoản ngân hàng, VNPay, MoMo. Đơn từ 3 triệu VNĐ hoặc giao ngoài TP.HCM: đặt cọc 50%.',
      },
      {
        heading: 'Hàng thủ công và khác biệt nhỏ',
        content:
          'Vì sản phẩm được làm thủ công hoàn toàn, mỗi chiếc đèn có thể có sự khác biệt nhỏ về màu sắc, kích thước so với hình ảnh (±5%). Điều này là đặc trưng của hàng thủ công, không phải lỗi sản phẩm.',
      },
    ],
  },
];

export default async function TermsPage() {
  const page = await getPage('dieu-khoan');
  if (page?.content) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>{page.meta_title || page.title || 'Điều Khoản Sử Dụng'}</h1>
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

      {/* Page Header */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
          <nav className="flex items-center gap-2 mb-5">
            <Link href="/" className="text-[11px] font-medium transition-colors hover:text-[#104e2e]" style={{ color: '#a0907a' }}>Trang chủ</Link>
            <span style={{ color: '#c0b0a0' }}>›</span>
            <span className="text-[11px] font-medium" style={{ color: '#1a1a1a' }}>Điều khoản và điều kiện</span>
          </nav>
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#c9822a' }}>Pháp lý</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>
            Điều Khoản và Điều Kiện
          </h1>
          <p className="text-[13px]" style={{ color: '#a0907a' }}>Cập nhật lần cuối: tháng 1, 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">

        {/* Intro notice */}
        <div className="p-5 rounded-2xl mb-6" style={{ background: 'rgba(26,107,60,0.05)', border: '1px solid rgba(26,107,60,0.15)' }}>
          <p className="text-[13px] leading-[1.8]" style={{ color: '#4a4a4a' }}>
            Vui lòng đọc kỹ các điều khoản và điều kiện dưới đây trước khi sử dụng dịch vụ tại longdenviet.com. Bằng việc truy cập và sử dụng website, bạn đồng ý tuân thủ các điều khoản này.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {sections.map((section) => (
            <div
              key={section.title}
              className="relative overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} aria-hidden="true" />
              <div className="p-7 md:p-10">
                <h2 className="text-xl font-bold mb-6" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                  {section.title}
                </h2>
                <div className="flex flex-col gap-5">
                  {section.items.map((item) => (
                    <div key={item.heading}>
                      <h3 className="text-[13px] font-bold mb-1.5" style={{ color: '#1a6b3c' }}>{item.heading}</h3>
                      <p className="text-[13px] leading-[1.8]" style={{ color: '#6a5840' }}>{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-sm font-bold mb-3" style={{ color: '#1a1a1a' }}>Liên hệ về điều khoản</p>
          <PolicyContactBox items={[
            { type: 'zalo',    label: 'Zalo',    value: '0989 778 247',             href: 'https://zalo.me/0989778247' },
            { type: 'email',   label: 'Email',   value: 'sales@longdenviet.com',    href: 'mailto:sales@longdenviet.com' },
            { type: 'address', label: 'Địa chỉ', value: '262/1/93 Phan Anh, Phường Phú Thạnh, Thành Phố Hồ Chí Minh, Việt Nam' },
          ]} />
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
