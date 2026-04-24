import type { Metadata } from 'next';
import FaqClient from './FaqClient';
import { parseJSON, SETTINGS_DEFAULTS } from '@/lib/site-settings';
import { getSettings } from '@/lib/site-settings-server';
import type { FaqItem } from '@/lib/site-settings';

export const metadata: Metadata = {
  title: 'Hỏi & Đáp — LongDenViet',
  description: 'Giải đáp các câu hỏi thường gặp về đèn lồng thủ công, giao hàng, đổi trả và thanh toán tại LongDenViet.',
  alternates: { canonical: '/hoi-dap' },
  openGraph: {
    title: 'Hỏi & Đáp — LongDenViet',
    description: 'Giải đáp các câu hỏi thường gặp về đèn lồng thủ công, giao hàng, đổi trả và thanh toán tại LongDenViet.',
    type: 'website',
  },
};

const HARDCODED_FAQ_LD = [
    // Đặt hàng & Thanh toán
    {
      '@type': 'Question',
      name: 'Làm thế nào để đặt hàng?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bạn có thể đặt hàng trực tiếp trên website: chọn sản phẩm → thêm vào giỏ → điền thông tin giao hàng → chọn phương thức thanh toán → hoàn tất đơn hàng. Hoặc đặt qua điện thoại: 0989.778.247 (8:00–21:00 mỗi ngày).',
      },
    },
    {
      '@type': 'Question',
      name: 'LongDenViet chấp nhận những phương thức thanh toán nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chúng tôi chấp nhận: COD (thanh toán khi nhận hàng), chuyển khoản ngân hàng, MoMo, VNPay, và thẻ ATM nội địa/quốc tế. Mọi giao dịch đều được mã hóa an toàn.',
      },
    },
    {
      '@type': 'Question',
      name: 'Tôi có thể thanh toán khi nhận hàng (COD) không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Có, chúng tôi hỗ trợ COD toàn quốc với đơn hàng dưới 5.000.000đ. Đối với đơn hàng lớn hơn hoặc đặt hàng sỉ, vui lòng thanh toán trước qua chuyển khoản.',
      },
    },
    {
      '@type': 'Question',
      name: 'Tôi có thể đặt hàng sỉ không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Có, chúng tôi nhận đặt hàng sỉ từ 10 chiếc trở lên với giá ưu đãi. Liên hệ 0989.778.247 hoặc qua trang Liên hệ để được tư vấn báo giá sỉ.',
      },
    },
    // Vận chuyển
    {
      '@type': 'Question',
      name: 'Phí vận chuyển là bao nhiêu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên (nội thành TP.HCM) hoặc từ 800.000đ (toàn quốc). Đơn hàng dưới mức trên, phí ship từ 20.000–50.000đ tùy khu vực.',
      },
    },
    {
      '@type': 'Question',
      name: 'Thời gian giao hàng là bao lâu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TP.HCM: 1–2 ngày. Hà Nội, Đà Nẵng: 2–3 ngày. Các tỉnh thành khác: 3–5 ngày. Đơn hàng đặt trước 14:00 sẽ được giao trong ngày (TP.HCM). Lưu ý: thời gian có thể dài hơn vào dịp Tết hoặc lễ lớn.',
      },
    },
    {
      '@type': 'Question',
      name: 'Đơn vị vận chuyển nào được sử dụng?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chúng tôi hợp tác với Giao Hàng Nhanh (GHN), Giao Hàng Tiết Kiệm (GHTK), và J&T Express. Đèn được đóng gói cẩn thận với xốp và thùng carton chắc chắn để bảo vệ trong quá trình vận chuyển.',
      },
    },
    {
      '@type': 'Question',
      name: 'Tôi có thể theo dõi đơn hàng không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Có, sau khi đơn hàng được xử lý bạn sẽ nhận được mã vận đơn qua SMS/Zalo. Bạn cũng có thể tra cứu tại trang Theo dõi đơn hàng hoặc liên hệ trực tiếp qua 0989.778.247.',
      },
    },
    // Sản phẩm
    {
      '@type': 'Question',
      name: 'Đèn được làm từ chất liệu gì?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Đèn lồng LongDenViet được làm từ các chất liệu truyền thống: khung tre già (đèn Hội An), mây và bẹ chuối (đèn mây), gỗ tự nhiên (đèn gỗ), vải lụa và vải linen cao cấp. Tất cả đều là vật liệu tự nhiên, thân thiện môi trường.',
      },
    },
    {
      '@type': 'Question',
      name: 'Làm thế nào để bảo quản đèn?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tránh để đèn ở nơi ẩm ướt hoặc tiếp xúc trực tiếp với mưa. Lau nhẹ bụi bằng khăn khô mềm. Khi cất giữ, để đèn trong hộp carton thoáng khí, tránh ép nặng. Đèn vải nên tránh tiếp xúc trực tiếp với ánh nắng kéo dài để giữ màu.',
      },
    },
    {
      '@type': 'Question',
      name: 'Có thể đặt thiết kế đèn theo yêu cầu riêng không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Có, chúng tôi nhận thiết kế theo yêu cầu: in logo, màu sắc riêng, kích thước tùy chỉnh, chữ thêu hoặc in... Thời gian sản xuất từ 7–14 ngày tùy số lượng và độ phức tạp. Liên hệ để được tư vấn và báo giá.',
      },
    },
    {
      '@type': 'Question',
      name: 'Đèn có thể dùng ngoài trời không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Đèn lồng của chúng tôi chủ yếu dùng trong nhà hoặc không gian có mái che. Một số mẫu đèn mây và đèn tre có thể dùng ngoài ban công có mái. Tránh để đèn tiếp xúc trực tiếp với mưa kéo dài.',
      },
    },
    // Đổi trả & Bảo hành
    {
      '@type': 'Question',
      name: 'Điều kiện đổi trả hàng là gì?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bạn có thể đổi/trả trong vòng 7 ngày kể từ ngày nhận hàng nếu: sản phẩm bị lỗi sản xuất, giao nhầm hàng, hoặc hư hỏng trong quá trình vận chuyển. Sản phẩm cần còn nguyên vẹn, chưa qua sử dụng và có đầy đủ hộp/tem nhãn.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quy trình đổi trả như thế nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bước 1: Liên hệ 0989.778.247 hoặc email sales@longdenviet.com để thông báo. Bước 2: Chụp ảnh sản phẩm lỗi gửi cho chúng tôi. Bước 3: Đội ngũ sẽ xác nhận và hướng dẫn gửi hàng về. Bước 4: Sau khi nhận hàng hoàn trả, chúng tôi sẽ gửi hàng mới hoặc hoàn tiền trong 3–5 ngày.',
      },
    },
    {
      '@type': 'Question',
      name: 'Phí vận chuyển đổi trả do ai chịu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nếu lỗi do chúng tôi (sản xuất hoặc giao nhầm), LongDenViet chịu toàn bộ phí vận chuyển đổi/trả. Nếu khách hàng đổi ý hoặc chọn nhầm sản phẩm, khách hàng chịu phí vận chuyển chiều về.',
      },
    },
    {
      '@type': 'Question',
      name: 'Có hoàn tiền mặt không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Có, chúng tôi hoàn tiền qua chuyển khoản ngân hàng hoặc MoMo trong vòng 3–5 ngày làm việc sau khi xác nhận đổi trả hợp lệ.',
      },
    },
];

export default async function FaqPage() {
  const settings = await getSettings();
  const defaultFaq = parseJSON<FaqItem[]>(SETTINGS_DEFAULTS.faq_items, []);
  const parsedFaq = parseJSON<FaqItem[]>(settings.faq_items, defaultFaq);
  const faqItems = parsedFaq.length > 0 ? parsedFaq : undefined;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: parsedFaq.length > 0
      ? parsedFaq.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        }))
      : HARDCODED_FAQ_LD,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqClient faqItems={faqItems} />
    </>
  );
}
