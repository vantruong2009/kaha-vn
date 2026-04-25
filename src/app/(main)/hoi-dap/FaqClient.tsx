'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

interface FaqItem {
  q: string;
  a: string;
  section?: string;
}

interface FaqSection {
  title: string;
  icon: React.ReactNode;
  items: FaqItem[];
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  'Đặt hàng & Thanh toán': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.57L23 6H6"/>
    </svg>
  ),
  'Vận chuyển': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 3v5h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  'Sản phẩm': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    </svg>
  ),
  'Đổi trả & Bảo hành': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <polyline points="23 20 23 14 17 14"/>
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/>
    </svg>
  ),
};

const DEFAULT_SECTION_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const HARDCODED_SECTIONS: FaqSection[] = [
  {
    title: 'Đặt hàng & Thanh toán',
    icon: SECTION_ICONS['Đặt hàng & Thanh toán'],
    items: [
      {
        q: 'Làm thế nào để đặt hàng?',
        a: 'Bạn có thể đặt hàng trực tiếp trên website: chọn sản phẩm → thêm vào giỏ → điền thông tin giao hàng → chọn phương thức thanh toán → hoàn tất đơn hàng. Hoặc đặt qua điện thoại: 0989.778.247 (8:00–21:00 mỗi ngày).',
      },
      {
        q: 'KAHA chấp nhận những phương thức thanh toán nào?',
        a: 'Chúng tôi chấp nhận: COD (thanh toán khi nhận hàng), chuyển khoản ngân hàng, MoMo, VNPay, và thẻ ATM nội địa/quốc tế. Mọi giao dịch đều được mã hóa an toàn.',
      },
      {
        q: 'Tôi có thể thanh toán khi nhận hàng (COD) không?',
        a: 'Có, chúng tôi hỗ trợ COD toàn quốc với đơn hàng dưới 5.000.000đ. Đối với đơn hàng lớn hơn hoặc đặt hàng sỉ, vui lòng thanh toán trước qua chuyển khoản.',
      },
      {
        q: 'Tôi có thể đặt hàng sỉ không?',
        a: 'Có, chúng tôi nhận đặt hàng sỉ từ 10 chiếc trở lên với giá ưu đãi. Liên hệ 0989.778.247 hoặc qua trang Liên hệ để được tư vấn báo giá sỉ.',
      },
    ],
  },
  {
    title: 'Vận chuyển',
    icon: SECTION_ICONS['Vận chuyển'],
    items: [
      {
        q: 'Phí vận chuyển là bao nhiêu?',
        a: 'Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên (nội thành TP.HCM) hoặc từ 800.000đ (toàn quốc). Đơn hàng dưới mức trên, phí ship từ 20.000–50.000đ tùy khu vực.',
      },
      {
        q: 'Thời gian giao hàng là bao lâu?',
        a: 'TP.HCM: 1–2 ngày. Hà Nội, Đà Nẵng: 2–3 ngày. Các tỉnh thành khác: 3–5 ngày. Đơn hàng đặt trước 14:00 sẽ được giao trong ngày (TP.HCM). Lưu ý: thời gian có thể dài hơn vào dịp Tết hoặc lễ lớn.',
      },
      {
        q: 'Đơn vị vận chuyển nào được sử dụng?',
        a: 'Chúng tôi hợp tác với Giao Hàng Nhanh (GHN), Giao Hàng Tiết Kiệm (GHTK), và J&T Express. Đèn được đóng gói cẩn thận với xốp và thùng carton chắc chắn để bảo vệ trong quá trình vận chuyển.',
      },
      {
        q: 'Tôi có thể theo dõi đơn hàng không?',
        a: 'Có, sau khi đơn hàng được xử lý bạn sẽ nhận được mã vận đơn qua SMS/Zalo. Bạn cũng có thể tra cứu tại trang Theo dõi đơn hàng hoặc liên hệ trực tiếp qua 0989.778.247.',
      },
    ],
  },
  {
    title: 'Sản phẩm',
    icon: SECTION_ICONS['Sản phẩm'],
    items: [
      {
        q: 'Đèn được làm từ chất liệu gì?',
        a: 'Đèn lồng KAHA được làm từ các chất liệu truyền thống: khung tre già (đèn Hội An), mây và bẹ chuối (đèn mây), gỗ tự nhiên (đèn gỗ), vải lụa và vải linen cao cấp. Tất cả đều là vật liệu tự nhiên, thân thiện môi trường.',
      },
      {
        q: 'Làm thế nào để bảo quản đèn?',
        a: 'Tránh để đèn ở nơi ẩm ướt hoặc tiếp xúc trực tiếp với mưa. Lau nhẹ bụi bằng khăn khô mềm. Khi cất giữ, để đèn trong hộp carton thoáng khí, tránh ép nặng. Đèn vải nên tránh tiếp xúc trực tiếp với ánh nắng kéo dài để giữ màu.',
      },
      {
        q: 'Có thể đặt thiết kế đèn theo yêu cầu riêng không?',
        a: 'Có, chúng tôi nhận thiết kế theo yêu cầu: in logo, màu sắc riêng, kích thước tùy chỉnh, chữ thêu hoặc in... Thời gian sản xuất từ 7–14 ngày tùy số lượng và độ phức tạp. Liên hệ để được tư vấn và báo giá.',
      },
      {
        q: 'Đèn có thể dùng ngoài trời không?',
        a: 'Đèn lồng của chúng tôi chủ yếu dùng trong nhà hoặc không gian có mái che. Một số mẫu đèn mây và đèn tre có thể dùng ngoài ban công có mái. Tránh để đèn tiếp xúc trực tiếp với mưa kéo dài.',
      },
    ],
  },
  {
    title: 'Đổi trả & Bảo hành',
    icon: SECTION_ICONS['Đổi trả & Bảo hành'],
    items: [
      {
        q: 'Điều kiện đổi trả hàng là gì?',
        a: 'Bạn có thể đổi/trả trong vòng 7 ngày kể từ ngày nhận hàng nếu: sản phẩm bị lỗi sản xuất, giao nhầm hàng, hoặc hư hỏng trong quá trình vận chuyển. Sản phẩm cần còn nguyên vẹn, chưa qua sử dụng và có đầy đủ hộp/tem nhãn.',
      },
      {
        q: 'Quy trình đổi trả như thế nào?',
        a: 'Bước 1: Liên hệ 0989.778.247 hoặc email hi@kaha.vn để thông báo. Bước 2: Chụp ảnh sản phẩm lỗi gửi cho chúng tôi. Bước 3: Đội ngũ sẽ xác nhận và hướng dẫn gửi hàng về. Bước 4: Sau khi nhận hàng hoàn trả, chúng tôi sẽ gửi hàng mới hoặc hoàn tiền trong 3–5 ngày.',
      },
      {
        q: 'Phí vận chuyển đổi trả do ai chịu?',
        a: 'Nếu lỗi do chúng tôi (sản xuất hoặc giao nhầm), KAHA chịu toàn bộ phí vận chuyển đổi/trả. Nếu khách hàng đổi ý hoặc chọn nhầm sản phẩm, khách hàng chịu phí vận chuyển chiều về.',
      },
      {
        q: 'Có hoàn tiền mặt không?',
        a: 'Có, chúng tôi hoàn tiền qua chuyển khoản ngân hàng hoặc MoMo trong vòng 3–5 ngày làm việc sau khi xác nhận đổi trả hợp lệ.',
      },
    ],
  },
];

function buildSectionsFromItems(items: FaqItem[]): FaqSection[] {
  const map = new Map<string, FaqItem[]>();
  for (const item of items) {
    const s = item.section ?? 'Khác';
    if (!map.has(s)) map.set(s, []);
    map.get(s)!.push(item);
  }
  return Array.from(map.entries()).map(([title, sItems]) => ({
    title,
    icon: SECTION_ICONS[title] ?? DEFAULT_SECTION_ICON,
    items: sItems,
  }));
}

function AccordionItem({ item, isOpen, onToggle }: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: '1px solid #EDE5D8' }} className="last:border-0">
      <button
        onClick={onToggle}
        className="w-full text-left flex items-start justify-between gap-4 py-4"
        aria-expanded={isOpen}
      >
        <span className="text-[13px] font-semibold leading-snug" style={{ color: isOpen ? '#104e2e' : '#1a1a1a' }}>
          {item.q}
        </span>
        <span
          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-all duration-200"
          style={{
            border: `2px solid ${isOpen ? '#104e2e' : '#C8BAA8'}`,
            background: isOpen ? '#104e2e' : 'transparent',
            transform: isOpen ? 'rotate(180deg)' : 'none',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5L5 6.5L8 3.5" stroke={isOpen ? 'white' : '#888'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 text-[13px] leading-[1.8]" style={{ color: '#6a5840' }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FaqClient({ faqItems }: { faqItems?: FaqItem[] }) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const faqSections =
    faqItems && faqItems.length > 0
      ? buildSectionsFromItems(faqItems)
      : HARDCODED_SECTIONS;

  const toggle = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>

      {/* Page header */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Câu hỏi thường gặp' },
            ]}
          />
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#c9822a' }}>Hỗ trợ khách hàng</p>
            <h1 className="text-2xl md:text-4xl font-bold mb-3" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>
              Câu Hỏi Thường Gặp
            </h1>
            <p className="text-[13px]" style={{ color: '#6a5840' }}>
              Không tìm thấy câu trả lời? Liên hệ chúng tôi qua{' '}
              <a href="tel:+84989778247" className="font-semibold hover:underline" style={{ color: '#104e2e' }}>
                0989.778.247
              </a>
              {' '}hoặc{' '}
              <Link href="/lien-he" className="font-semibold hover:underline" style={{ color: '#104e2e' }}>
                nhắn tin tư vấn
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* FAQ sections */}
        <div className="max-w-3xl flex flex-col gap-5">
          {faqSections.map(section => (
            <div
              key={section.title}
              className="relative overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} />

              {/* Section header */}
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{ borderBottom: '1px solid #EDE5D8', background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)' }}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(201,130,42,0.12)', color: '#c9822a' }}
                >
                  {section.icon}
                </span>
                <h2 className="text-[15px] font-bold" style={{ color: '#1a1a1a' }}>
                  {section.title}
                </h2>
              </div>

              {/* Items */}
              <div className="px-6">
                {section.items.map((item, idx) => {
                  const key = `${section.title}-${idx}`;
                  return (
                    <AccordionItem
                      key={key}
                      item={item}
                      isOpen={!!openItems[key]}
                      onToggle={() => toggle(key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-8 max-w-3xl relative overflow-hidden text-center"
          style={{ background: 'linear-gradient(135deg, #1a6b3c, #104e2e)', borderRadius: '20px', padding: '40px 32px', boxShadow: '0 8px 32px rgba(16,78,46,.25)' }}
        >
          <span className="absolute top-0 left-4 right-4" style={{ height: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <h3 className="text-[20px] font-bold text-white mb-2">
            Vẫn còn thắc mắc?
          </h3>
          <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng 8:00–21:00 mỗi ngày.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+84989778247"
              className="inline-flex items-center justify-center gap-2 text-[13px] font-bold transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: '#FFFFFF', borderRadius: '12px', padding: '11px 22px', color: '#104e2e', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              0989.778.247
            </a>
            <Link
              href="/lien-he"
              className="inline-flex items-center justify-center text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{ border: '1px solid rgba(255,255,255,0.4)', borderRadius: '12px', padding: '11px 22px' }}
            >
              Nhắn tin tư vấn →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
