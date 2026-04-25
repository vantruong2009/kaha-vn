import type { Metadata } from 'next';
import { Suspense } from 'react';
import { parseJSON, SETTINGS_DEFAULTS } from '@/lib/site-settings';
import { getSettings } from '@/lib/site-settings-server';
import type { FaqItem } from '@/lib/site-settings';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Liên Hệ — KAHA',
  description: 'Liên hệ KAHA để đặt hàng, tư vấn đèn lồng thủ công, hoặc nhận báo giá sỉ.',
  alternates: { canonical: '/lien-he' },
  openGraph: {
    title: 'Liên Hệ — KAHA',
    description: 'Liên hệ KAHA để đặt hàng, tư vấn đèn lồng thủ công, hoặc nhận báo giá sỉ.',
    type: 'website',
  },
};

const DEFAULT_FAQ = [
  { q: 'Giao hàng mất bao lâu?', a: 'Nội thành TP.HCM 1-2 ngày · Tỉnh thành 2-5 ngày làm việc qua GHN/GHTK' },
  { q: 'Có đặt sỉ được không?', a: 'Có, từ 10 sản phẩm trở lên. Liên hệ để nhận báo giá sỉ và ưu đãi đặc biệt.' },
  { q: 'In logo lên đèn được không?', a: 'Được, tối thiểu 20 chiếc. Giao trong 7-10 ngày làm việc sau khi xác nhận mẫu.' },
  { q: 'Đổi trả như thế nào?', a: 'Đổi trả miễn phí trong 7 ngày nếu lỗi sản xuất. Giữ nguyên bao bì khi gửi trả.' },
  { q: 'Thanh toán bằng gì?', a: 'COD, chuyển khoản, MoMo, VNPay. Không thu thêm phí cổng thanh toán.' },
  { q: 'Có cửa hàng vật lý không?', a: 'Có. Hội An (xưởng sản xuất), Hà Nội và TP.HCM. Xem địa chỉ chi tiết tại trang Chi nhánh.' },
];

export default async function ContactPage() {
  const settings = await getSettings();

  const defaultFaq = parseJSON<FaqItem[]>(SETTINGS_DEFAULTS.contact_faq, []);
  const contactFaq = parseJSON<FaqItem[]>(settings.contact_faq, defaultFaq);

  const phone = settings.contact_phone || '0989.778.247';
  const email = settings.contact_email || 'hi@kaha.vn';
  const address = settings.contact_address || '262/1/93 Phan Anh, Phường Phú Thạnh, Thành Phố Hồ Chí Minh, Việt Nam';

  const contact = {
    phone,
    hours: settings.contact_hours || '8:00 – 21:00, tất cả các ngày',
    email,
    address,
    zalo: settings.contact_zalo || '0989778247',
    b2bMin: settings.contact_b2b_min || '10 sản phẩm',
    b2bDesc:
      settings.contact_b2b_desc ||
      'Chúng tôi nhận đơn sỉ từ 10 sản phẩm trở lên. Có thể in logo, tùy chỉnh màu sắc và kích thước theo yêu cầu.',
    faqItems: contactFaq.length > 0 ? contactFaq : undefined,
  };

  const faqForSchema = contactFaq.length > 0 ? contactFaq : DEFAULT_FAQ;
  const faqPageLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqForSchema.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const contactPageLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Liên Hệ KAHA',
    url: 'https://kaha.vn/lien-he',
    description: 'Liên hệ KAHA để đặt hàng, tư vấn đèn lồng thủ công, hoặc nhận báo giá sỉ.',
    mainEntity: { '@id': 'https://kaha.vn/#organization' },
  };

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': 'https://kaha.vn/#organization',
    name: 'KAHA — Xưởng Đèn Lồng Trang Trí',
    url: 'https://kaha.vn',
    logo: 'https://kaha.vn/logo.webp',
    image: 'https://kaha.vn/opengraph-image',
    description: 'Xưởng sản xuất 500+ mẫu đèn lồng trang trí thủ công Hội An. Bán sỉ lẻ, giao toàn quốc, nhận đặt theo yêu cầu.',
    telephone: `+84${phone.replace(/\D/g, '').replace(/^0/, '')}`,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '262/1/93 Phan Anh',
      addressLocality: 'Phường Phú Thạnh, Quận Tân Phú',
      addressRegion: 'Thành phố Hồ Chí Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 10.771119,
      longitude: 106.624617,
    },
    hasMap: 'https://maps.app.goo.gl/ULoS941P6Va3RB5b8',
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '21:00',
    }],
    currenciesAccepted: 'VND',
    paymentAccepted: 'Cash, Bank Transfer, MoMo, VNPay, COD',
    priceRange: '₫₫',
    areaServed: { '@type': 'Country', name: 'Vietnam' },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+84${phone.replace(/\D/g, '').replace(/^0/, '')}`,
      contactType: 'sales',
      areaServed: 'VN',
      availableLanguage: ['Vietnamese', 'English'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '21:00',
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd).replace(/<\/script>/gi, '<\\/script>') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageLd).replace(/<\/script>/gi, '<\\/script>') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd).replace(/<\/script>/gi, '<\\/script>') }} />
      <Suspense fallback={null}>
        <ContactClient contact={contact} />
      </Suspense>
    </>
  );
}
