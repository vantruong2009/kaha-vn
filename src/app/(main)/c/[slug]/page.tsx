import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { getCatalogProducts } from '@/lib/products-db';
import { categories } from '@/lib/products';
import Breadcrumb from '@/components/Breadcrumb';

const CAT_IMAGE_MAP: Record<string, string> = {
  'den-quan-cafe':        'cafe',
  'den-quan-tra-sua':     'cafe',
  'kaha-living':          'san',
  'long-den-gia-re':      'san',
  'den-nhat-ban':         'nhat',
  'den-long-nhat-ban':    'nhat',
  'nhat-ban':             'nhat',
  'den-vai-cao-cap':      'vai',
  'chup-den-vai':         'vai',
  'long-den-vai-lua':     'vai',
  'long-den-vai-hoa':     'vai',
  'den-ve':               've-tranh',
  'long-den-ve':          've-tranh',
  'den-ve-tranh':         've-tranh',
  'long-den-ve-thu-cong': 've-tranh',
  'den-khach-san':        'resort',
  'den-khach-san-2':      'resort',
  'den-treo-quan-bbq':    'nha-hang',
  'den-sushi-bbq':        'nha-hang',
  'den-nha-hang':         'nha-hang',
  'den-nha-hang-2':       'nha-hang',
  'gia-cong-den-trang-tri': 'tuong',
  'den-op-tuong':         'tuong',
  'den-gan-tuong':        'tuong',
  'den-trung-thu':        'tet',
  'den-long-tet':         'tet',
  'long-den-tet':         'tet',
  '%f0%9f%91%91-trung-thu': 'tet',
  'den-long-go':          'go',
  'hoi-an-lantern':       'hoian',
  'den-hoi-an':           'hoian',
  'den-noi-that':         'bedroom',
  'phong-ngu':            'bedroom',
  'phong-khach':          'bedroom',
  'den-tre':              'tre',
  'den-may-tre':          'tre',
  'den-may':              'tre',
  'den-tha-tran':         'tha-tran',
  'phong-an':             'dining',
  'phong-bep':            'dining',
  'ngoai-troi':           'ngoai-troi',
  'den-ngoai-troi':       'ngoai-troi',
};
const getCatImg = (id: string) => `/images/menu/${CAT_IMAGE_MAP[id] ?? 'san'}.webp`;
const stripEmoji = (s: string) => s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
import CategoryProductGrid from './CategoryProductGrid';
import rawCategories from '../../../../../public/data/categories.json';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return rawCategories.map((c: { slug: string }) => ({ slug: c.slug }));
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'den-long': 'Đèn lồng thủ công truyền thống — biểu tượng văn hoá hàng trăm năm của người Việt. Khung tre bền chắc, vải lụa mềm mại, màu sắc rực rỡ, được làm hoàn toàn bằng tay bởi nghệ nhân làng nghề Hội An.',
  'hoi-an-lantern': 'Đèn lồng Hội An chính gốc — sản xuất tại xưởng liên kết làng nghề phố cổ. Đúng chất liệu, đúng kỹ thuật, đúng màu sắc của đèn lồng Hội An truyền thống được UNESCO công nhận.',
  'den-kieu-nhat': 'Đèn kiểu Nhật Bản — phong cách tối giản wabi-sabi, ánh sáng dịu nhẹ qua vật liệu tự nhiên. Phù hợp quán trà, onsen, nhà hàng Nhật và không gian thiền định. Hơn 200 mẫu đèn lồng Nhật thuần Việt.',
  'den-long-go': 'Đèn lồng gỗ chạm khắc — quà tặng cao cấp và trang trí nội thất premium. Gỗ tự nhiên bền đẹp, hoa văn chạm tay tinh xảo, mỗi chiếc là tác phẩm nghệ thuật độc bản.',
  'den-vai-cao-cap': 'Đèn vải cao cấp với chất liệu lụa, organza và cotton thủ công. Màu sắc phong phú, có thể đặt theo màu riêng, in logo thương hiệu cho sự kiện và không gian cao cấp.',
  'chup-den-vai': 'Chụp đèn vải — chao đèn thay thế và gia công số lượng lớn theo yêu cầu. Hơn 10 màu: nâu, vàng đồng, xám khói, đen, trắng, cam, hồng, tím, xanh lá, xanh dương. Đường kính 20–60cm, vải dày 280gsm, khung thép sơn tĩnh điện bền đẹp. Giao toàn quốc trong 2–4 ngày.',
  'den-may-tre': 'Đèn tre & mây đan thủ công — phong cách rustic tự nhiên, bền đẹp theo thời gian. Từng nan tre được chọn lọc kỹ, đan tay bởi nghệ nhân có 20+ năm kinh nghiệm ở làng nghề miền Trung.',
  'den-long-tet': 'Đèn lồng Tết mang không khí Tết Nguyên Đán vào mọi không gian. Màu đỏ truyền thống — phúc lộc, may mắn — được làm thủ công với hoa văn tinh tế, phù hợp trang trí nhà ở, quán cafe, văn phòng dịp Tết.',
  'den-trung-thu': 'Lồng đèn Trung Thu thủ công cho trẻ em và trang trí mùa lễ hội. Từ đèn ông sao, đèn cá, đèn kéo quân đến đèn lồng nghệ thuật — tất cả được làm tay với chất liệu an toàn.',
  'den-tha-tran': 'Đèn thả trần trang trí — điểm nhấn không gian với những chùm đèn lồng lơ lửng đẹp mắt. Phù hợp sảnh khách sạn, nhà hàng, tiệc cưới và không gian sự kiện cao cấp.',
  'den-quan-cafe': 'Đèn trang trí quán cafe — tạo không gian ấm cúng, chụp ảnh đẹp, thu hút khách hàng. Hơn 200 mẫu đèn lồng phù hợp phong cách vintage, Hội An, Nhật Bản, boho.',
  'den-nha-hang': 'Đèn trang trí nhà hàng — nâng tầm không gian ẩm thực với ánh sáng thủ công ấm áp. Nhận đặt theo bản vẽ, số lượng lớn giá ưu đãi, lắp đặt tận nơi tại TP.HCM.',
  'den-khach-san': 'Đèn trang trí resort & khách sạn — tạo không gian nghỉ dưỡng đẳng cấp với ánh sáng thiên nhiên. Chuyên cung cấp cho hàng trăm resort 4–5 sao trên toàn quốc.',
  'phong-khach': 'Đèn trang trí phòng khách — tạo điểm nhấn ấm áp cho không gian tiếp khách. Từ đèn lồng nhỏ xinh đến chùm đèn nghệ thuật — lựa chọn phong phú cho mọi phong cách nội thất.',
  'phong-ngu': 'Đèn trang trí phòng ngủ — ánh sáng dịu nhẹ, ấm áp giúp không gian nghỉ ngơi thêm thư thái. Đèn vải lụa, đèn tre mây và đèn kiểu Nhật là lựa chọn được yêu thích nhất.',
  'phong-bep': 'Đèn trang trí phòng bếp & phòng ăn — không gian ẩm thực thêm ấm cúng với ánh đèn thủ công. Đèn tre mây và đèn vải là lựa chọn phù hợp nhất cho bếp và bàn ăn.',
  'ngoai-troi': 'Đèn trang trí ngoài trời — lý tưởng cho ban công, sân vườn, lối đi và không gian outdoor. Chất liệu bền bỉ, chống mưa nắng, giữ màu sắc tươi sáng.',
  'den-noi-that': 'Đèn trang trí nội thất cao cấp — kết hợp tinh tế giữa ánh sáng và nghệ thuật thủ công Việt Nam. Phù hợp biệt thự, căn hộ cao cấp và showroom.',
  'den-ve-tranh': 'Đèn vẽ tranh thủ công — mỗi chiếc đèn là một tác phẩm nghệ thuật độc bản. Họa tiết dân gian, phong cảnh quê hương và hoa sen được vẽ tay tỉ mỉ bởi nghệ nhân.',
  'den-san': 'Đèn sàn thủ công trang trí — điểm nhấn nghệ thuật cho góc phòng khách, phòng ngủ và quán cafe. Khung sắt rèn hoặc gỗ tự nhiên kết hợp chao đèn vải lụa, tạo ánh sáng khuếch tán dịu nhẹ phủ cả góc phòng.',
  'den-ap-tuong': 'Đèn áp tường thủ công — giải pháp chiếu sáng trang trí cho hành lang, đầu giường và không gian hẹp. Phong cách Hội An, Nhật Bản và rustic tre mây — lựa chọn được ưa chuộng tại khách sạn, resort và homestay.',
  'gia-cong-den-trang-tri': 'Gia công đèn trang trí theo yêu cầu — nhận thiết kế & sản xuất đèn lồng theo bản vẽ, màu sắc, kích thước và số lượng riêng. Phù hợp dự án khách sạn, resort, sự kiện và quà tặng doanh nghiệp.',
  'ngoi-sao-nhua': 'Đèn ngôi sao nhựa — đèn lồng nhựa lắp ráp nhiều màu sắc, giá rẻ, phù hợp trang trí đại trà, lễ hội và quán ăn bình dân.',
  'den-tron-10-mau': 'Đèn lồng tròn 10 màu — bộ đèn lồng tròn đầy màu sắc, tạo không gian rực rỡ cho lễ hội và trang trí.',
  'hoa-dang': 'Hoa đăng & đèn thả sông — sản phẩm tâm linh và lễ hội truyền thống Việt Nam. Phù hợp lễ Phật, cầu an, thả hoa đăng và các sự kiện văn hoá.',
  'qua-tang': 'Đèn lồng làm quà tặng — ý nghĩa, độc đáo, đặc trưng văn hoá Việt. Có thể đóng hộp quà, ghi thiệp chúc mừng, in logo doanh nghiệp. Phù hợp quà tặng đối tác nước ngoài, sự kiện, hội nghị.',
  'den-long-trang-tri': 'Đèn lồng trang trí đa dạng — tổng hợp các mẫu đèn lồng thủ công đẹp nhất cho mọi không gian và dịp lễ. Sản xuất tại xưởng Hội An, giao hàng toàn quốc.',
};

/* ─────────────────────────────────────────────────────────────
   CATEGORY RICH CONTENT — intro + FAQ + related posts
───────────────────────────────────────────────────────────── */
interface CatFaqItem { q: string; a: string; }
interface CatContent {
  intro: string[];
  relatedPosts?: { label: string; href: string }[];
  faq: CatFaqItem[];
}

const CATEGORY_CONTENT: Record<string, CatContent> = {
  'den-trung-thu': {
    intro: [
      'Lồng đèn Trung Thu là linh hồn của Tết Thiếu Nhi Việt Nam — mỗi năm đến rằm tháng 8, hàng triệu chiếc đèn trung thu thủ công thắp sáng đường phố, sân nhà và tâm hồn của những đứa trẻ. Tại LongDenViet, chúng tôi chuyên sản xuất và phân phối lồng đèn trung thu thủ công từ làng nghề Hội An, với hơn 200 mẫu đèn cho mùa Trung Thu 2025.',
      'Bộ sưu tập đèn trung thu của LongDenViet bao gồm đầy đủ các loại đèn truyền thống: đèn ông sao 5 cánh và 8 cánh, đèn cá chép, đèn con bướm, đèn kéo quân, đèn lồng tròn vải lụa, và đèn lồng tre đan thủ công. Tất cả được làm từ chất liệu an toàn cho trẻ em — khung tre tự nhiên, vải lụa không phai màu, dây điện đạt chuẩn an toàn.',
      'Mẫu mới 2025 được thiết kế theo xu hướng hiện đại nhưng vẫn giữ hồn truyền thống: đèn lồng vải organza phối màu pastel, đèn tre đan hoa văn dân tộc thiểu số, và đèn lồng giấy xếp nghệ thuật. Mỗi chiếc đèn được làm thủ công hoàn toàn bởi nghệ nhân có kinh nghiệm 15+ năm tại làng nghề miền Trung Việt Nam.',
      'Giá đèn trung thu tại LongDenViet: đèn lẻ từ 35.000đ – 450.000đ/chiếc tùy loại. Đặt sỉ từ 50 chiếc giảm 15–25%, từ 200 chiếc có thể in logo thương hiệu. Phù hợp trường học, trung tâm thiếu nhi, siêu thị và doanh nghiệp tổ chức sự kiện Trung Thu. Xuất xứ: 100% Việt Nam — sản xuất tại Hội An, Quảng Nam.',
      'Đơn sỉ từ 100 chiếc trở lên nên đặt trước lễ ít nhất 3–4 tuần để đảm bảo giao hàng đúng hẹn. LongDenViet giao hàng toàn quốc qua GHN và GHTK, đóng gói chắc chắn đảm bảo đèn không biến dạng trong vận chuyển.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng trang trí nhà hàng dịp Tết Trung Thu', href: '/blog/den-long-trang-tri-nha-hang-tet-trung-thu' },
      { label: 'Đèn nhựa trung thu lắp ráp — hướng dẫn chọn mua', href: '/blog/den-nhua-trung-thu-lap-rap' },
      { label: 'Đèn trung thu hình cá chép — ý nghĩa và cách chọn', href: '/blog/den-trung-thu-hinh-ca-chep' },
    ],
    faq: [
      { q: 'Đèn trung thu thủ công LongDenViet được làm từ chất liệu gì?', a: 'Đèn trung thu LongDenViet sử dụng khung tre già tự nhiên, vải lụa hoặc organza cao cấp không phai màu, và giấy bồi nhiều lớp. Tất cả chất liệu an toàn cho trẻ em, không chứa hóa chất độc hại. Dây điện đi kèm đạt chuẩn an toàn điện Việt Nam.' },
      { q: 'Giá đèn trung thu sỉ tại LongDenViet là bao nhiêu?', a: 'Giá đèn trung thu sỉ: từ 50 chiếc giảm 15%, từ 100 chiếc giảm 20%, từ 200 chiếc giảm 25% so với giá lẻ. Giá lẻ từ 35.000đ – 450.000đ/chiếc tùy mẫu. Liên hệ 0989.778.247 để nhận báo giá sỉ chi tiết.' },
      { q: 'Có thể in logo lên đèn trung thu không?', a: 'Có, LongDenViet nhận in logo hoặc chữ thêu lên đèn trung thu với số lượng từ 200 chiếc trở lên. Có thể in trực tiếp hoặc thêu tay tùy yêu cầu. Thời gian sản xuất thêm 5–7 ngày so với đèn thông thường.' },
      { q: 'Đặt đèn trung thu trước bao lâu để giao kịp?', a: 'Đơn lẻ: đặt trước 5–7 ngày. Đơn sỉ 50–100 chiếc: đặt trước 2 tuần. Đơn từ 100 chiếc hoặc có in logo: đặt trước ít nhất 3–4 tuần. Vào mùa cao điểm tháng 8–9 âm lịch, nên đặt sớm hơn.' },
      { q: 'Đèn trung thu có an toàn cho trẻ em không?', a: 'Có. Đèn trung thu LongDenViet được sản xuất với tiêu chí an toàn cho trẻ em: chất liệu không độc hại, cạnh tre được vát nhẵn, dây điện có lớp cách điện đạt chuẩn. Đèn dùng bóng LED tiết kiệm điện, ít phát nhiệt, giảm nguy cơ cháy vải.' },
      { q: 'Có những loại đèn trung thu nào tại LongDenViet?', a: 'LongDenViet có hơn 200 mẫu đèn trung thu: đèn ông sao (5 cánh, 8 cánh), đèn cá chép, đèn con bướm, đèn kéo quân, đèn lồng tròn vải lụa nhiều cỡ, đèn lồng tre đan, đèn ngôi sao nhựa nhiều màu, và đèn lồng giấy xếp nghệ thuật. Cập nhật mẫu mới 2025.' },
      { q: 'Mua đèn trung thu số lượng ít có được không?', a: 'Hoàn toàn có thể. LongDenViet bán lẻ từ 1 chiếc, không yêu cầu số lượng tối thiểu cho đơn lẻ. Đặt hàng online qua website hoặc liên hệ 0989.778.247 (8:00–21:00 mỗi ngày).' },
      { q: 'Đèn trung thu LongDenViet có xuất xứ ở đâu?', a: 'Toàn bộ đèn trung thu tại LongDenViet được sản xuất tại Việt Nam — chủ yếu tại làng nghề Hội An (Quảng Nam) và xưởng TP.HCM. Không nhập hàng từ nước ngoài. 100% thủ công Việt Nam.' },
    ],
  },

  'hoi-an-lantern': {
    intro: [
      'Đèn lồng Hội An chính gốc — được làm thủ công tại xưởng liên kết trực tiếp với làng nghề phố cổ Hội An, Quảng Nam. Mỗi chiếc đèn lồng Hội An tại LongDenViet là sản phẩm của đôi tay nghệ nhân lành nghề, sử dụng đúng kỹ thuật truyền thống đã được UNESCO công nhận là di sản văn hóa phi vật thể.',
      'Bộ sưu tập hơn 500 mẫu đèn lồng Hội An tại LongDenViet đa dạng về hình dạng, màu sắc và chất liệu: từ đèn lồng tròn vải lụa truyền thống (ø20cm – ø60cm), đèn lồng oval, đèn lồng hình thuyền, đến đèn lồng khắc gỗ và đèn lồng vẽ tay nghệ thuật. Màu sắc phong phú từ đỏ, vàng, xanh lam, cam đến pastel nhẹ nhàng.',
      'Đèn lồng Hội An LongDenViet phù hợp cho mọi không gian: nhà ở, quán cafe phong cách vintage, nhà hàng ẩm thực Việt, khách sạn boutique, và làm quà tặng quý khách nước ngoài. Giá từ 45.000đ – 380.000đ/chiếc. Nhận đặt sỉ từ 20 chiếc với giá ưu đãi, tùy chỉnh màu sắc theo yêu cầu.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng Hội An giá sỉ chính hãng — hướng dẫn mua', href: '/blog/den-long-hoi-an-gia-si-chinh-hang' },
      { label: 'Đèn lồng gỗ Hội An đẹp — top mẫu bán chạy', href: '/blog/den-long-go-hoi-an-dep' },
      { label: 'Đèn vẽ tranh phong cảnh Hội An', href: '/blog/den-ve-tranh-phong-canh-hoi-an' },
    ],
    faq: [
      { q: 'Đèn lồng Hội An thật khác đèn lồng thường ở điểm nào?', a: 'Đèn lồng Hội An thật có khung tre già chẻ tay (không dùng máy), vải lụa được căng và buộc thủ công từng dải, tua rua được tết bằng tay. Đèn có độ bền cao hơn hàng công nghiệp, màu sắc giữ bền từ 2–5 năm. Sản xuất theo kỹ thuật truyền thống UNESCO công nhận.' },
      { q: 'Đèn lồng Hội An LongDenViet có được làm tại Hội An không?', a: 'Có. LongDenViet liên kết trực tiếp với xưởng sản xuất tại phố cổ Hội An và làng nghề Cẩm Phô (Quảng Nam). Một phần sản phẩm được hoàn thiện tại xưởng TP.HCM nhưng khung và vải đều từ nghệ nhân Hội An.' },
      { q: 'Giá đèn lồng Hội An bao nhiêu một chiếc?', a: 'Giá đèn lồng Hội An tại LongDenViet từ 45.000đ (đèn mini ø15cm) đến 380.000đ (đèn đại ø60cm, khung gỗ). Phổ biến nhất là đèn ø30cm giá 85.000–150.000đ/chiếc. Đặt sỉ từ 20 chiếc giảm 10–20% tùy số lượng.' },
      { q: 'Có thể đặt màu sắc theo yêu cầu không?', a: 'Có, LongDenViet nhận đặt màu theo yêu cầu cho đơn từ 20 chiếc trở lên. Có thể chọn màu vải, màu tua rua, màu khung và hoa văn thêu. Thời gian sản xuất thêm 3–5 ngày so với mẫu có sẵn.' },
      { q: 'Đèn lồng Hội An có thể dùng ngoài trời không?', a: 'Đèn lồng vải truyền thống chỉ phù hợp không gian có mái che hoặc trong nhà. Nếu cần treo ngoài trời, nên chọn mẫu đèn tre hoặc đèn mây có xử lý chống ẩm. LongDenViet có dòng đèn outdoor riêng phù hợp ban công và sân vườn có mái.' },
    ],
  },

  'den-long-tet': {
    intro: [
      'Đèn lồng Tết là nét đẹp không thể thiếu trong mỗi dịp Tết Nguyên Đán của người Việt. Màu đỏ rực rỡ mang ý nghĩa phúc lộc, may mắn — những chùm đèn lồng Tết treo trước cửa nhà, quán cafe, văn phòng doanh nghiệp từ 23 tháng Chạp đến hết Rằm tháng Giêng tạo nên không khí Tết ấm áp đặc trưng Việt Nam.',
      'Bộ sưu tập đèn lồng Tết tại LongDenViet gồm: đèn lồng tròn đỏ truyền thống (nhiều cỡ từ ø15cm đến ø80cm), đèn lồng hình thỏi vàng, đèn lồng chữ Phúc–Lộc–Thọ–Vạn, đèn lồng con giáp theo năm, và bộ đèn lồng dây trang trí mái hiên. Tất cả được làm thủ công từ vải lụa cao cấp, khung tre bền chắc, chỉ thêu tay tỉ mỉ.',
      'Giá đèn lồng Tết tại LongDenViet: lẻ từ 25.000đ – 350.000đ/chiếc. Đặt sỉ từ 50 chiếc giảm 20–30%. Đơn sỉ từ 100 chiếc nên đặt trước Tết ít nhất 4 tuần để đảm bảo giao hàng đúng dịp. LongDenViet giao toàn quốc, có phục vụ trang trí đèn lồng Tết tận nơi tại TP.HCM.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng trang trí phiên chợ Tết — ý tưởng hay', href: '/blog/den-long-trang-tri-phien-cho-tet' },
      { label: 'Đèn tròn màu trang trí công ty dịp Tết', href: '/blog/den-tron-mau-trang-tri-cong-ty-tet' },
      { label: 'Đèn lồng trang trí nhà hàng dịp Tết', href: '/blog/den-long-trang-tri-nha-hang-tet-trung-thu' },
    ],
    faq: [
      { q: 'Đèn lồng Tết nên treo từ ngày nào?', a: 'Theo phong tục Việt Nam, đèn lồng Tết thường được treo từ ngày 23 tháng Chạp (ngày đưa ông Táo) đến hết Rằm tháng Giêng (15/1 âm lịch). Một số gia đình treo sớm từ ngày 20 tháng Chạp để không khí Tết đậm đà hơn.' },
      { q: 'Giá đèn lồng Tết sỉ tại LongDenViet?', a: 'Giá sỉ đèn lồng Tết: từ 50 chiếc giảm 20%, từ 100 chiếc giảm 25%, từ 200 chiếc giảm 30% so với giá lẻ. Ngoài ra còn có combo bộ đèn trang trí sảnh, mái hiên giá ưu đãi theo gói. Liên hệ 0989.778.247 để nhận báo giá.' },
      { q: 'Đặt đèn lồng Tết trước bao lâu để kịp?', a: 'Đơn lẻ: 5–7 ngày. Đơn sỉ 50–100 chiếc: 2 tuần. Đơn sỉ từ 100 chiếc hoặc tùy chỉnh màu: ít nhất 3–4 tuần trước Tết. Tháng 11–12 dương lịch là mùa cao điểm, nên đặt sớm để ưu tiên sản xuất.' },
      { q: 'Có dịch vụ trang trí đèn lồng Tết tận nơi không?', a: 'Có, LongDenViet cung cấp dịch vụ trang trí đèn lồng Tết tận nơi tại TP.HCM cho văn phòng, nhà hàng, khách sạn và trung tâm thương mại. Bao gồm tư vấn thiết kế, cung cấp đèn và lắp đặt. Liên hệ để được báo giá.' },
      { q: 'Đèn lồng Tết có thể treo ngoài trời không?', a: 'Đèn lồng vải truyền thống nên treo trong nhà hoặc hiên có mái che. Cho ban công và sảnh ngoài trời, LongDenViet có dòng đèn lồng Tết chất liệu tre hoặc đèn nhựa chịu nước, giữ màu đỏ bền đẹp dù nắng mưa.' },
    ],
  },

  'den-may-tre': {
    intro: [
      'Đèn mây tre đan thủ công — sản phẩm của văn hóa làng nghề truyền thống Việt Nam, kết hợp vật liệu tự nhiên với kỹ thuật đan lát tinh xảo. Mỗi chiếc đèn tre được làm từ tre già 3–5 năm tuổi, phơi khô tự nhiên, chẻ nan đều, đan theo các hoa văn dân gian độc đáo.',
      'Đèn mây tre của LongDenViet phù hợp phong cách rustic, wabi-sabi và nội thất Việt truyền thống. Chất liệu 100% tự nhiên: tre, mây, bẹ chuối. Màu sắc tự nhiên của gỗ tre, không sơn hóa chất — thân thiện môi trường và an toàn cho không gian sống. Kích thước đa dạng từ mini (ø10cm) đến đại (ø60cm).',
      'Giá đèn mây tre tại LongDenViet: từ 55.000đ – 420.000đ/chiếc tùy loại và kích thước. Đặt sỉ từ 30 chiếc giảm 15–20%. Xuất xứ: làng nghề Bình Dương, Quảng Nam và Bình Định. LongDenViet nhận gia công theo bản vẽ và tùy chỉnh kích thước cho dự án nội thất và khách sạn.',
    ],
    relatedPosts: [
      { label: 'Đèn mây tre: bao lâu thì hỏng và cách bảo quản', href: '/blog/den-may-tre-bao-lau-thi-hong' },
      { label: 'Đèn mây tre cho nhà hàng thương hiệu', href: '/blog/den-may-tre-cho-nha-hang-thuong-hieu' },
      { label: 'Đèn mây tre trang trí phòng khách — ý tưởng đẹp', href: '/blog/den-may-tre-trang-tri-phong-khach' },
    ],
    faq: [
      { q: 'Đèn mây tre có bền không, cần bảo quản như thế nào?', a: 'Đèn mây tre bền từ 3–8 năm nếu bảo quản đúng cách. Tránh để ở nơi ẩm ướt hoặc tiếp xúc mưa trực tiếp. Lau bụi bằng khăn khô mềm, không dùng khăn ướt. Tre sẽ lên màu nâu vàng đẹp tự nhiên theo thời gian.' },
      { q: 'Giá đèn mây tre sỉ tại LongDenViet?', a: 'Giá sỉ đèn mây tre: từ 30 chiếc giảm 15%, từ 100 chiếc giảm 20%, từ 500 chiếc giảm 25% so với giá lẻ. Giá lẻ từ 55.000đ – 420.000đ/chiếc. Có hỗ trợ mẫu thử trước khi đặt sỉ. Liên hệ 0989.778.247 để được tư vấn.' },
      { q: 'Đèn mây tre có dùng được ngoài trời không?', a: 'Đèn mây tre có thể treo ở ban công hoặc hiên có mái che (không tiếp xúc mưa trực tiếp). Không nên treo ngoài trời hoàn toàn vì ẩm ướt kéo dài sẽ làm mục tre. LongDenViet có xử lý chống ẩm theo yêu cầu cho đèn dùng outdoor có mái.' },
      { q: 'Có thể đặt kích thước tùy chỉnh không?', a: 'Có, LongDenViet nhận đặt đèn mây tre theo kích thước tùy chỉnh với số lượng từ 20 chiếc trở lên. Có thể tùy chỉnh: đường kính, chiều cao, hoa văn đan và màu sơn phủ bề mặt. Thời gian sản xuất 10–15 ngày.' },
      { q: 'Đèn mây tre LongDenViet được làm từ chất liệu gì?', a: 'Đèn mây tre LongDenViet sử dụng: tre già (3–5 năm tuổi) từ rừng tự nhiên, mây tự nhiên, bẹ chuối khô và lá cọ. Tất cả được phơi khô tự nhiên, không dùng hóa chất bảo quản độc hại. 100% vật liệu xuất xứ Việt Nam.' },
    ],
  },

  'den-kieu-nhat': {
    intro: [
      'Đèn kiểu Nhật Bản — phong cách tối giản wabi-sabi, lấy cảm hứng từ chochin (提灯) và andon (行灯) truyền thống Nhật, được tái hiện bởi nghệ nhân Việt với chất liệu địa phương: tre, giấy dó, vải mỏng xuyên sáng. Ánh sáng dịu nhẹ, ấm vàng qua lớp vải mờ tạo cảm giác yên tĩnh và thanh bình.',
      'Điểm khác biệt chính giữa đèn kiểu Nhật và đèn lồng Hội An: đèn Nhật sử dụng màu trung tính (trắng, be, nâu tự nhiên) và hình dạng trụ hoặc hộp vuông góc cạnh; trong khi đèn lồng Hội An thường có màu sắc rực rỡ và hình oval/tròn truyền thống. Cả hai đều được làm thủ công tại xưởng LongDenViet.',
      'Đèn kiểu Nhật phù hợp cho: quán trà, onsen spa, nhà hàng Nhật, phòng thiền định, góc đọc sách yên tĩnh. Giá từ 65.000đ – 580.000đ/chiếc. Hơn 80 mẫu hiện có, nhận đặt riêng theo yêu cầu. LongDenViet là một trong số ít xưởng tại Việt Nam sản xuất đèn kiểu Nhật chính thống.',
    ],
    relatedPosts: [
      { label: 'Đèn Nhật Bản in chữ Kanji theo yêu cầu', href: '/blog/den-nhat-ban-in-kanji-theo-yeu-cau' },
      { label: 'Bán sỉ đèn Nhật Bản số lượng lớn — giá gốc xưởng', href: '/blog/den-nhat-ban-ban-si-so-luong-lon' },
      { label: 'Đèn Nhật Bản cho resort onsen — top 5 mẫu', href: '/blog/den-nhat-ban-cho-resort-onsen' },
    ],
    faq: [
      { q: 'Đèn kiểu Nhật LongDenViet có phải hàng nhập từ Nhật không?', a: 'Không. Đèn kiểu Nhật tại LongDenViet được sản xuất hoàn toàn tại Việt Nam bởi nghệ nhân Việt, lấy cảm hứng từ thiết kế chochin và andon truyền thống Nhật Bản. Chất liệu 100% trong nước: tre Việt, giấy dó Việt, vải mỏng nội địa. Giá thành rẻ hơn hàng nhập 3–5 lần.' },
      { q: 'Sự khác biệt giữa đèn Nhật Bản và đèn Hội An là gì?', a: 'Đèn Hội An: màu sắc rực rỡ (đỏ, vàng, xanh), hình oval/tròn, tua rua nhiều màu, phong cách lễ hội. Đèn kiểu Nhật: màu trung tính (trắng, be, nâu), hình trụ hoặc hộp góc cạnh, không tua rua, phong cách thiền định tối giản.' },
      { q: 'Đèn kiểu Nhật phù hợp không gian nào?', a: 'Đèn kiểu Nhật phù hợp nhất với: quán trà, spa/onsen, nhà hàng Nhật, phòng thiền, không gian yoga, thư viện và nhà ở phong cách tối giản. Cũng phù hợp cho quán cafe muốn tạo góc yên tĩnh khác biệt.' },
      { q: 'Giá đèn kiểu Nhật bao nhiêu?', a: 'Giá đèn kiểu Nhật tại LongDenViet từ 65.000đ (đèn mini ø15cm) đến 580.000đ (đèn đại, hộp gỗ). Phổ biến nhất là đèn trụ ø20cm giá 120.000–180.000đ/chiếc. Đặt sỉ từ 20 chiếc giảm 15–20%.' },
      { q: 'Có thể đặt màu hoặc kích thước riêng cho đèn kiểu Nhật không?', a: 'Có, nhận đặt từ 10 chiếc trở lên. Có thể tùy chỉnh: màu vải (trắng, be, xám, đen), kích thước, hình dạng, có hoặc không có chữ Hán/Kana. Thời gian sản xuất 7–10 ngày. Phù hợp cho quán cafe, spa muốn đồng bộ thương hiệu.' },
    ],
  },

  'den-vai-cao-cap': {
    intro: [
      'Đèn vải cao cấp — dòng sản phẩm đỉnh cao trong bộ sưu tập LongDenViet, kết hợp giữa chất liệu lụa tự nhiên, organza và cotton thủ công với kỹ thuật may vá truyền thống. Mỗi chiếc đèn vải được cắt may tỉ mỉ, căng đều trên khung thép sơn tĩnh điện bền đẹp, tạo ra ánh sáng ấm áp, dịu nhẹ đặc trưng không loại đèn nào có được.',
      'Bộ sưu tập đèn vải cao cấp tại LongDenViet có hơn 150 mẫu với đầy đủ hình dạng: tròn, oval, trụ, hộp vuông và hình đèn lồng truyền thống. Màu sắc phong phú gồm hơn 12 tông màu tiêu chuẩn (trắng, vàng champagne, nâu camel, đỏ đô, xanh ngọc, hồng nude, tím lavender...) — tất cả đều có thể đặt riêng theo màu Pantone. Kích thước từ ø20cm đến ø80cm, chiều cao tùy chỉnh.',
      'Đèn vải cao cấp LongDenViet phù hợp cho: khách sạn boutique 4–5 sao, nhà hàng fine dining, spa cao cấp, tiệc cưới sang trọng, showroom và biệt thự. Có thể in/thêu logo thương hiệu lên vải từ 50 chiếc trở lên. Giá từ 120.000đ – 680.000đ/chiếc tùy chất liệu và kích thước. Đặt sỉ từ 20 chiếc giảm 15–25%.',
      'Chất liệu vải đèn tại LongDenViet gồm 3 dòng: vải lụa tự nhiên (cao cấp nhất, bề mặt mịn bóng, xuyên sáng đều), vải organza (mỏng nhẹ, xuyên sáng tốt, màu sắc tươi sáng) và vải cotton dày 280gsm (bền, ít nhăn, phù hợp không gian thương mại). Khung thép chịu tải tốt, không gỉ, có thể dùng bóng LED E27 hoặc GU10 tùy model.',
    ],
    relatedPosts: [
      { label: 'Đèn vải lụa cao cấp trang trí — cách chọn và bảo quản', href: '/blog/den-vai-lua-cao-cap-trang-tri' },
      { label: 'Chụp đèn vải thay thế — hướng dẫn chọn đúng kích thước', href: '/blog/chup-den-vai-thay-the' },
      { label: 'Đèn vải trang trí tiệc cưới — xu hướng 2025', href: '/blog/den-vai-trang-tri-tiec-cuoi' },
    ],
    faq: [
      { q: 'Đèn vải cao cấp LongDenViet dùng chất liệu gì?', a: 'LongDenViet có 3 dòng vải chính: lụa tự nhiên (mịn bóng, cao cấp nhất), organza (mỏng nhẹ, xuyên sáng tốt) và cotton 280gsm (bền, ít nhăn). Khung thép sơn tĩnh điện chống gỉ. Tất cả chất liệu đạt tiêu chuẩn PCCC, an toàn cho không gian thương mại và dân dụng.' },
      { q: 'Giá đèn vải cao cấp sỉ tại LongDenViet bao nhiêu?', a: 'Giá lẻ từ 120.000đ – 680.000đ/chiếc tùy loại và kích thước. Đặt sỉ từ 20 chiếc giảm 15%, từ 50 chiếc giảm 20%, từ 100 chiếc giảm 25%. Mẫu đặt riêng theo màu Pantone cần tối thiểu 30 chiếc. Liên hệ 0989.778.247 để nhận báo giá chi tiết.' },
      { q: 'Có thể đặt màu vải theo yêu cầu không?', a: 'Có. LongDenViet nhận đặt màu vải theo mã Pantone hoặc mẫu vải khách hàng cung cấp, tối thiểu 30 chiếc/màu. Có thể phối nhiều màu trong cùng đơn hàng. Thời gian sản xuất thêm 3–5 ngày so với mẫu màu tiêu chuẩn.' },
      { q: 'Đèn vải có thể dùng ngoài trời không?', a: 'Đèn vải lụa và organza chỉ phù hợp trong nhà hoặc hiên có mái che hoàn toàn. Dòng cotton 280gsm có thể dùng nơi thoáng mát nhưng tránh mưa trực tiếp. LongDenViet có dòng đèn vải xử lý chống ẩm và phủ nano cho outdoor theo đặt hàng riêng.' },
      { q: 'Đèn vải có thể in logo thương hiệu không?', a: 'Có, nhận in/thêu logo từ 50 chiếc trở lên. Phương pháp in nhiệt trực tiếp lên vải (giá tốt, phù hợp số lượng lớn) hoặc thêu máy/thêu tay (cao cấp hơn). Thời gian sản xuất thêm 5–7 ngày.' },
      { q: 'Bóng đèn nào phù hợp với đèn vải LongDenViet?', a: 'Khuyến nghị dùng bóng LED E27 3W–5W nhiệt độ màu 2700K–3000K (vàng ấm) để tạo ánh sáng đẹp nhất qua vải. Không dùng bóng sợi đốt vì phát nhiệt cao dễ hỏng vải. LongDenViet có bán kèm bóng LED phù hợp theo yêu cầu.' },
    ],
  },

  'den-tha-tran': {
    intro: [
      'Đèn thả trần — giải pháp trang trí không gian chiều đứng được ưa chuộng nhất hiện nay tại các nhà hàng, quán cafe, khách sạn và tiệc cưới cao cấp. Những chùm đèn lồng lơ lửng ở nhiều độ cao khác nhau tạo ra chiều sâu không gian độc đáo, biến trần nhà thành điểm nhìn nghệ thuật.',
      'LongDenViet cung cấp đèn thả trần với đầy đủ chủng loại: đèn lồng vải thả đơn, chùm đèn lồng Hội An 3–5–7 chiếc/chùm, đèn mây tre thả nghệ thuật và đèn vải cao cấp thả phòng ăn. Dây thả có thể điều chỉnh độ dài từ 50cm đến 3m theo trần nhà. Phù hợp trần cao từ 2.5m trở lên.',
      'Dịch vụ lắp đặt đèn thả trần trọn gói tại TP.HCM: LongDenViet đo đạc thực địa miễn phí, tư vấn phối màu và bố cục, cung cấp đèn và lắp đặt đến khi hoàn chỉnh. Nhận dự án từ 10 đèn trở lên. Đã lắp đặt cho hơn 80 nhà hàng, quán cafe và khách sạn tại TP.HCM và các tỉnh.',
      'Giá đèn thả trần tại LongDenViet: đèn đơn từ 85.000đ – 480.000đ/chiếc tùy loại. Combo chùm 5 chiếc từ 350.000đ – 1.500.000đ/chùm. Phí lắp đặt tính riêng theo diện tích và độ phức tạp. Liên hệ 0989.778.247 để được tư vấn thiết kế và báo giá thi công.',
    ],
    relatedPosts: [
      { label: 'Đèn thả trần quán cafe — 15 ý tưởng bố cục đẹp', href: '/blog/den-tha-tran-quan-cafe-y-tuong-bo-cuc' },
      { label: 'Chùm đèn lồng thả trần — cách lắp đặt đúng kỹ thuật', href: '/blog/chum-den-long-tha-tran-lap-dat' },
      { label: 'Đèn thả bàn ăn — cách chọn độ cao và kích thước', href: '/blog/den-tha-ban-an-chon-do-cao' },
    ],
    faq: [
      { q: 'Đèn thả trần nên treo ở độ cao bao nhiêu?', a: 'Đèn thả bàn ăn: đáy đèn cách mặt bàn 60–75cm. Đèn thả hành lang/lối đi: đáy đèn cách sàn ít nhất 210cm. Đèn trang trí không gian rộng (nhà hàng, tiệc): bố cục nhiều tầng cao, tạo chiều sâu. LongDenViet tư vấn bố cục miễn phí khi đặt đơn từ 10 chiếc.' },
      { q: 'Giá đèn thả trần sỉ bao nhiêu?', a: 'Giá lẻ từ 85.000đ – 480.000đ/chiếc. Đặt sỉ từ 10 chiếc giảm 10%, từ 30 chiếc giảm 20%, từ 100 chiếc giảm 25%. Combo chùm 5 chiếc đi kèm khung trần và dây điện từ 350.000đ. Liên hệ 0989.778.247 để nhận báo giá theo số lượng thực tế.' },
      { q: 'LongDenViet có dịch vụ lắp đặt đèn thả trần không?', a: 'Có, LongDenViet cung cấp dịch vụ lắp đặt trọn gói tại TP.HCM: đo đạc thực địa, tư vấn bố cục, cung cấp đèn và lắp đặt. Nhận từ 10 đèn trở lên. Phí lắp đặt tính theo số lượng đèn và độ cao trần. Liên hệ để được khảo sát miễn phí.' },
      { q: 'Đèn thả trần phù hợp với loại trần nào?', a: 'Đèn thả trần phù hợp với trần bê tông, trần thạch cao và trần gỗ có độ cao từ 2.5m trở lên. Với trần thấp hơn 2.5m nên chọn đèn áp trần hoặc đèn thả mini. LongDenViet cung cấp móc trần và phụ kiện treo phù hợp từng loại trần.' },
      { q: 'Dây treo đèn có thể điều chỉnh độ dài không?', a: 'Có. Tất cả đèn thả trần LongDenViet đều có dây điện bọc vải có thể điều chỉnh độ dài từ 50cm đến 3m. Khi đặt hàng cần thông báo chiều cao trần và vị trí treo để LongDenViet cắt dây đúng độ dài, tiết kiệm thời gian lắp đặt.' },
    ],
  },

  'den-quan-cafe': {
    intro: [
      'Đèn trang trí quán cafe — một trong những yếu tố quan trọng nhất tạo nên không khí và thương hiệu của mỗi quán. Ánh sáng đèn lồng thủ công ấm áp, dịu nhẹ tạo ra góc chụp ảnh đẹp tự nhiên, thu hút khách hàng check-in và chia sẻ lên mạng xã hội — hiệu quả marketing gián tiếp mà không loại quảng cáo nào thay thế được.',
      'LongDenViet đã cung cấp đèn trang trí cho hơn 200 quán cafe tại TP.HCM và toàn quốc, từ quán nhỏ 30m² đến chuỗi cafe 10+ chi nhánh. Các phong cách phổ biến nhất: vintage Hội An (đèn lồng vải nhiều màu), Nhật Bản wabi-sabi (đèn kiểu Nhật tông trắng/nâu), boho tự nhiên (đèn mây tre) và Indochine thanh lịch (đèn thả vải cao cấp).',
      'Gói trang trí đèn quán cafe trọn gói: LongDenViet tư vấn phối màu theo concept quán, lựa chọn model đèn phù hợp, tính toán số lượng và bố cục tối ưu, giao hàng tận nơi và hỗ trợ lắp đặt tại TP.HCM. Đã phục vụ: The Coffee House, Phúc Long (một số chi nhánh), nhiều quán cafe độc lập nổi tiếng tại Q.1, Q.3, Bình Thạnh, Thủ Đức.',
      'Giá đèn trang trí quán cafe tại LongDenViet: từ 45.000đ – 480.000đ/chiếc tùy loại. Gói trang trí trọn bộ 20 đèn cho quán nhỏ từ 2.500.000đ – 6.000.000đ tùy model. Đặt sỉ từ 20 chiếc giảm 15–25%. Bảo hành đèn 12 tháng, hỗ trợ thay thế nhanh trong vòng 48 giờ tại TP.HCM.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng trang trí quán cafe — 20 ý tưởng đẹp nhất 2025', href: '/blog/den-long-trang-tri-quan-cafe-y-tuong-dep' },
      { label: 'Cách chọn đèn trang trí quán cafe theo phong cách', href: '/blog/cach-chon-den-trang-tri-quan-cafe-theo-phong-cach' },
      { label: 'Chi phí trang trí đèn quán cafe — bảng giá tham khảo', href: '/blog/chi-phi-trang-tri-den-quan-cafe' },
    ],
    faq: [
      { q: 'Nên chọn loại đèn nào cho quán cafe phong cách vintage?', a: 'Phong cách vintage Hội An: đèn lồng vải nhiều màu (đỏ, vàng, cam, tím) kết hợp đèn thả trần. Phong cách Nhật Bản: đèn kiểu Nhật tông trắng/be treo đơn hoặc cụm 3 chiếc. Phong cách rustic boho: đèn mây tre nhiều cỡ, kết hợp cây xanh. LongDenViet tư vấn miễn phí theo ảnh concept quán.' },
      { q: 'Quán cafe cần bao nhiêu đèn lồng để đủ đẹp?', a: 'Quán 30–50m²: tối thiểu 15–25 đèn, bố cục thả trần + góc accent. Quán 50–100m²: 30–50 đèn. Quán trên 100m² hoặc nhiều tầng: 50+ đèn. LongDenViet tư vấn số lượng cụ thể dựa trên ảnh mặt bằng, không tính phí.' },
      { q: 'Đèn trang trí quán cafe có bền không, mất bao lâu thì phải thay?', a: 'Đèn vải bền 2–4 năm trong điều kiện trong nhà có máy lạnh. Đèn mây tre bền 3–6 năm. Đèn lồng Hội An truyền thống bền 1–3 năm tùy bảo quản. LongDenViet bảo hành 12 tháng và hỗ trợ thay thế nhanh tại TP.HCM để quán không bị gián đoạn kinh doanh.' },
      { q: 'Có thể đặt đèn in logo quán không?', a: 'Có, nhận in logo hoặc tên quán lên đèn từ 50 chiếc trở lên. Phương pháp: in nhiệt, thêu máy hoặc viết tay thủ công (cho phong cách handmade). Thời gian sản xuất thêm 5–7 ngày. Phù hợp chuỗi quán hoặc khai trương cần sự kiện đặc biệt.' },
      { q: 'LongDenViet có tư vấn thiết kế đèn cho quán cafe không?', a: 'Có, LongDenViet cung cấp dịch vụ tư vấn trang trí đèn miễn phí cho đơn từ 20 chiếc trở lên: chọn model, phối màu, bố cục, tính số lượng. Khách hàng chỉ cần gửi ảnh mặt bằng và concept tham khảo qua Zalo 0989.778.247.' },
    ],
  },

  'den-khach-san': {
    intro: [
      'Đèn trang trí resort & khách sạn — phân khúc đòi hỏi tiêu chuẩn cao nhất về chất liệu, tính thẩm mỹ và độ bền. LongDenViet chuyên cung cấp đèn lồng thủ công cho các dự án khách sạn 3–5 sao, resort nghỉ dưỡng và boutique hotel trên toàn quốc, với kinh nghiệm thực hiện hơn 50 dự án hospitality trong 5 năm qua.',
      'Điểm mạnh của đèn LongDenViet trong dự án khách sạn: (1) Tùy chỉnh hoàn toàn theo bộ nhận diện thương hiệu — màu sắc, hoa văn, kích thước và in logo; (2) Số lượng lớn đồng nhất — mỗi chiếc đèn trong cùng đơn hàng được kiểm soát chất lượng nghiêm ngặt để đảm bảo đồng đều; (3) Dịch vụ lắp đặt và bảo trì định kỳ tại TP.HCM và một số tỉnh thành.',
      'LongDenViet đã cung cấp đèn cho: các resort tại Phú Quốc, Đà Nẵng, Hội An, Mũi Né và Nha Trang. Hạng mục thực hiện: đèn thả sảnh chính, đèn hành lang, đèn trang trí nhà hàng trong resort, đèn bể bơi và khu vực outdoor có mái che, đèn spa và khu dịch vụ cao cấp.',
      'Quy trình dự án khách sạn: tư vấn và khảo sát thực địa → thiết kế bản vẽ kỹ thuật → mẫu thử duyệt → sản xuất đại trà → kiểm tra chất lượng 100% → vận chuyển và lắp đặt → nghiệm thu. Thời gian triển khai dự án 200 đèn trở lên: 4–6 tuần. Liên hệ sales@longdenviet.com cho dự án B2B.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng trang trí resort — tiêu chuẩn và cách chọn', href: '/blog/den-long-trang-tri-resort-tieu-chuan' },
      { label: 'Đèn thả sảnh khách sạn — ý tưởng và xu hướng 2025', href: '/blog/den-tha-sanh-khach-san-y-tuong' },
      { label: 'Gia công đèn in logo cho chuỗi khách sạn', href: '/blog/gia-cong-den-in-logo-chuoi-khach-san' },
    ],
    faq: [
      { q: 'LongDenViet có kinh nghiệm cung cấp đèn cho dự án khách sạn lớn không?', a: 'Có. LongDenViet đã thực hiện hơn 50 dự án khách sạn và resort từ 3 đến 5 sao trên toàn quốc, bao gồm các resort tại Phú Quốc, Đà Nẵng, Hội An và Nha Trang. Đơn hàng lớn nhất thực hiện là 1.200 chiếc đèn cho một resort 5 sao tại Đà Nẵng.' },
      { q: 'Đèn cho khách sạn có thể tùy chỉnh theo thương hiệu không?', a: 'Có hoàn toàn. LongDenViet nhận tùy chỉnh: màu vải theo mã Pantone hoặc màu thương hiệu, in/thêu logo lên đèn, kích thước và hình dạng riêng, và cả hoa văn độc quyền. Số lượng tối thiểu cho đặt hàng tùy chỉnh hoàn toàn là 100 chiếc.' },
      { q: 'Thời gian sản xuất đơn hàng khách sạn lớn là bao lâu?', a: 'Đơn 100–200 chiếc: 15–21 ngày. Đơn 200–500 chiếc: 3–4 tuần. Đơn trên 500 chiếc: 4–6 tuần. Thời gian bao gồm sản xuất mẫu thử (5–7 ngày), duyệt mẫu và sản xuất đại trà. Khuyến nghị liên hệ trước 2–3 tháng cho dự án lớn.' },
      { q: 'Có dịch vụ lắp đặt và bảo trì đèn cho khách sạn không?', a: 'Có, LongDenViet cung cấp dịch vụ lắp đặt tận nơi tại TP.HCM và các tỉnh theo thỏa thuận. Bảo trì định kỳ theo hợp đồng: kiểm tra, vệ sinh và thay thế đèn hỏng. Hỗ trợ khẩn cấp trong 48 giờ cho khách sạn tại TP.HCM.' },
      { q: 'Giá đèn cho dự án khách sạn tính như thế nào?', a: 'Giá dự án khách sạn được tính theo số lượng, mức độ tùy chỉnh và chất liệu. Thường giảm 25–35% so với giá lẻ cho đơn từ 200 chiếc trở lên. Liên hệ sales@longdenviet.com hoặc 0989.778.247 để nhận báo giá dự án trong 24 giờ làm việc.' },
    ],
  },

  'den-nha-hang': {
    intro: [
      'Đèn trang trí nhà hàng — yếu tố then chốt tạo nên trải nghiệm ẩm thực đáng nhớ. Ánh sáng đúng tông màu và bầu không khí đèn lồng thủ công không chỉ nâng tầm món ăn về mặt thị giác mà còn tạo cảm xúc gắn kết khách hàng với thương hiệu nhà hàng. LongDenViet đã cung cấp đèn cho hơn 120 nhà hàng trên toàn quốc.',
      'Phong cách đèn phổ biến nhất trong nhà hàng hiện nay: (1) Đèn lồng Hội An nhiều màu cho nhà hàng ẩm thực Việt truyền thống; (2) Đèn mây tre tự nhiên cho nhà hàng organic và farm-to-table; (3) Đèn vải cao cấp tone trung tính cho nhà hàng fine dining; (4) Đèn kiểu Nhật cho nhà hàng sushi, BBQ Nhật và izakaya. LongDenViet tư vấn phong cách phù hợp từng loại hình nhà hàng.',
      'Giải pháp đèn nhà hàng trọn gói từ LongDenViet: khảo sát mặt bằng và phân tích ánh sáng miễn phí, thiết kế phương án bố cục đèn theo từng khu vực (khu ăn chính, quầy bar, lối vào, WC), cung cấp đèn và lắp đặt tại TP.HCM. Bảo hành 12 tháng, thay thế nhanh đảm bảo nhà hàng không gián đoạn hoạt động.',
    ],
    relatedPosts: [
      { label: 'Đèn trang trí nhà hàng Việt — phong cách và cách chọn', href: '/blog/den-trang-tri-nha-hang-viet-phong-cach' },
      { label: 'Đèn lồng cho nhà hàng — top 10 mẫu bán chạy 2025', href: '/blog/den-long-cho-nha-hang-top-10-mau' },
      { label: 'Chi phí trang trí đèn nhà hàng — bảng giá thực tế', href: '/blog/chi-phi-trang-tri-den-nha-hang' },
    ],
    faq: [
      { q: 'Nhà hàng nên chọn loại đèn lồng nào?', a: 'Phụ thuộc vào concept: nhà hàng Việt truyền thống → đèn lồng Hội An nhiều màu; nhà hàng Nhật → đèn kiểu Nhật tông trắng/nâu; nhà hàng hải sản/quán nhậu → đèn mây tre rustic; fine dining → đèn vải cao cấp tông trung tính. LongDenViet tư vấn miễn phí dựa trên ảnh concept nhà hàng.' },
      { q: 'Đặt bao nhiêu đèn cho nhà hàng 100 chỗ ngồi?', a: 'Nhà hàng 100 chỗ ngồi (~150–200m²) thường cần 40–80 đèn tùy bố cục và kích thước đèn. Khu ăn chính: 1 đèn/4–6m² trần. Lối vào và khu chờ: accent 5–10 đèn. Quầy bar: 3–8 đèn thả. LongDenViet tính số lượng cụ thể theo bản vẽ mặt bằng miễn phí.' },
      { q: 'Đèn nhà hàng có bao lâu thì phải thay?', a: 'Đèn vải: 2–3 năm (khuyến nghị vệ sinh 6 tháng/lần). Đèn mây tre: 3–5 năm. Đèn lồng Hội An: 1.5–2.5 năm. Độ bền phụ thuộc môi trường (độ ẩm, khói bếp, điều hòa). LongDenViet cung cấp gói bảo trì định kỳ cho nhà hàng theo hợp đồng, đảm bảo thay thế nhanh không ảnh hưởng kinh doanh.' },
      { q: 'Có thể đặt đèn in logo nhà hàng không?', a: 'Có, từ 30 chiếc trở lên. In logo bằng nhiều phương pháp: in nhiệt, thêu máy, khắc laser (cho đèn gỗ). Thêu tay cho sản phẩm cao cấp muốn nét tinh tế. Thời gian thêm 5–7 ngày. Rất phù hợp khai trương nhà hàng mới hoặc rebrand.' },
      { q: 'LongDenViet có lắp đặt đèn nhà hàng tận nơi không?', a: 'Có, dịch vụ lắp đặt tại TP.HCM miễn phí cho đơn từ 30 chiếc trở lên. Các tỉnh thành khác: phí lắp đặt tính theo khoảng cách. Lắp đặt ngoài giờ (tối hoặc cuối tuần) để không ảnh hưởng giờ kinh doanh nhà hàng theo thỏa thuận.' },
    ],
  },

  'den-long-go': {
    intro: [
      'Đèn lồng gỗ chạm khắc — phân khúc cao cấp nhất trong dòng đèn thủ công Việt Nam, kết hợp kỹ thuật chạm khắc gỗ tinh xảo với ánh sáng xuyên qua những hoa văn tỉ mỉ. Mỗi chiếc đèn gỗ LongDenViet là tác phẩm nghệ thuật độc bản, được chạm tay bởi nghệ nhân có hơn 20 năm kinh nghiệm từ làng nghề Đồng Kỵ (Bắc Ninh) và Cẩm Hà (Hội An).',
      'Chất liệu gỗ sử dụng: gỗ pơmu (bền, thơm, chống mối mọt tự nhiên), gỗ hương đỏ (vân đẹp, màu ấm), gỗ trắc (cao cấp nhất, dùng làm quà tặng), gỗ thông (nhẹ, giá tốt hơn cho số lượng lớn) và gỗ MDF phủ veneer (phù hợp gia công số lượng lớn đồng nhất). Tất cả gỗ được xử lý chống ẩm và mối mọt trước khi gia công.',
      'Đèn lồng gỗ LongDenViet phù hợp cho: quà tặng doanh nghiệp cao cấp (in logo, đóng hộp sang trọng), trang trí biệt thự và căn hộ penthouse, sảnh khách sạn 5 sao, bàn thờ và không gian tâm linh trang trọng, và xuất khẩu quà lưu niệm cho khách nước ngoài. Giá từ 180.000đ – 2.500.000đ/chiếc tùy gỗ và độ phức tạp chạm khắc.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng gỗ chạm khắc — các loại gỗ và cách chọn', href: '/blog/den-long-go-cham-khac-cac-loai-go' },
      { label: 'Đèn gỗ làm quà tặng doanh nghiệp — ý nghĩa và cách đặt', href: '/blog/den-go-qua-tang-doanh-nghiep' },
      { label: 'Đèn lồng gỗ Hội An — nghệ thuật chạm khắc truyền thống', href: '/blog/den-long-go-hoi-an-nghe-thuat-cham-khac' },
    ],
    faq: [
      { q: 'Đèn lồng gỗ LongDenViet được làm từ loại gỗ nào?', a: 'LongDenViet dùng nhiều loại gỗ: pơmu (bền, thơm), hương đỏ (vân đẹp), trắc (cao cấp nhất), thông (nhẹ, giá tốt) và MDF phủ veneer (cho đơn số lượng lớn). Gỗ tự nhiên được xử lý chống ẩm và mối mọt. Tư vấn loại gỗ phù hợp ngân sách và mục đích sử dụng khi liên hệ đặt hàng.' },
      { q: 'Giá đèn lồng gỗ là bao nhiêu?', a: 'Giá đèn gỗ tùy loại gỗ và độ phức tạp: gỗ thông đơn giản từ 180.000đ, gỗ hương chạm cơ bản từ 350.000đ, gỗ pơmu chạm tinh xảo từ 650.000đ, gỗ trắc cao cấp từ 1.200.000đ. Đèn gỗ đặt theo thiết kế riêng: liên hệ 0989.778.247 để được báo giá.' },
      { q: 'Đèn gỗ có thể đặt làm quà tặng doanh nghiệp không?', a: 'Hoàn toàn có thể. LongDenViet nhận đặt đèn gỗ làm quà tặng từ 10 chiếc: khắc laser logo/tên công ty/thông điệp, đóng hộp gỗ sang trọng kèm thiệp. Giá quà tặng doanh nghiệp từ 350.000đ/bộ. Giao hàng toàn quốc, có hóa đơn VAT.' },
      { q: 'Đèn gỗ có bền không, cần bảo quản như thế nào?', a: 'Đèn gỗ tự nhiên bền 10–20 năm nếu bảo quản đúng cách: tránh ẩm trực tiếp, lau bụi bằng khăn khô mềm, không dùng hóa chất tẩy rửa. Định kỳ 1–2 năm có thể đánh bóng lại bằng dầu dưỡng gỗ. Để trong nhà có điều hòa, gỗ giữ đẹp rất lâu dài.' },
      { q: 'Thời gian sản xuất đèn gỗ là bao lâu?', a: 'Mẫu có sẵn: 3–5 ngày. Đèn gỗ đặt theo thiết kế mới: 7–15 ngày tùy độ phức tạp chạm khắc. Đơn số lượng lớn (50+ chiếc): 3–4 tuần. Đèn gỗ trắc và hương cao cấp cần thêm thời gian do gia công kỹ lưỡng hơn. Đặt sớm ít nhất 2–3 tuần cho đơn cần gấp.' },
    ],
  },

  'den-ve-tranh': {
    intro: [
      'Đèn vẽ tranh thủ công — phân khúc nghệ thuật độc đáo nhất của LongDenViet, nơi mỗi chiếc đèn lồng trở thành một tác phẩm hội họa thu nhỏ. Họa sĩ vẽ tay trực tiếp lên vải đèn bằng màu acrylic chuyên dụng, tạo ra những họa tiết không chiếc nào giống chiếc nào — đảm bảo tính độc bản tuyệt đối.',
      'Các chủ đề tranh phổ biến tại LongDenViet: phong cảnh làng quê Việt Nam (cánh đồng lúa, sông nước, đồi núi), hoa sen và hoa đào truyền thống, tranh Đông Hồ dân gian, phong cảnh phố cổ Hội An và Hà Nội, 12 con giáp nghệ thuật, và các họa tiết theo yêu cầu riêng của khách hàng. Màu vẽ bền màu, không lem khi treo trong môi trường bình thường.',
      'Đèn vẽ tranh LongDenViet phù hợp làm: quà tặng cao cấp cho đối tác nước ngoài, quà lưu niệm du lịch Việt Nam, trang trí gallery và không gian văn hóa, bộ sưu tập nghệ thuật cá nhân. Giá từ 150.000đ – 1.200.000đ/chiếc tùy kích thước và độ phức tạp của tranh. Đặt vẽ tranh theo chủ đề riêng từ 5 chiếc trở lên.',
    ],
    relatedPosts: [
      { label: 'Đèn vẽ tranh thủ công Hội An — quy trình và chất liệu', href: '/blog/den-ve-tranh-thu-cong-hoi-an-quy-trinh' },
      { label: 'Đèn lồng vẽ tranh làm quà tặng — ý tưởng độc đáo', href: '/blog/den-long-ve-tranh-qua-tang-doc-dao' },
      { label: 'Tranh dân gian Đông Hồ trên đèn lồng — nghệ thuật Việt', href: '/blog/tranh-dong-ho-tren-den-long-nghe-thuat-viet' },
    ],
    faq: [
      { q: 'Đèn vẽ tranh LongDenViet được vẽ bằng gì, có bền màu không?', a: 'Đèn vẽ tranh dùng màu acrylic chuyên dụng cho vải, bền màu và không lem dưới điều kiện bình thường. Màu giữ đẹp 3–5 năm nếu để trong nhà, tránh ánh nắng trực tiếp chiếu vào mặt vải. Không giặt bằng nước. Lau nhẹ bằng khăn khô khi cần.' },
      { q: 'Có thể đặt vẽ tranh theo chủ đề riêng không?', a: 'Có, LongDenViet nhận đặt vẽ tranh theo chủ đề riêng từ 5 chiếc trở lên: logo thương hiệu, hình ảnh sản phẩm, chân dung cách điệu, phong cảnh đặc biệt. Khách hàng cung cấp ảnh/sketch tham khảo, họa sĩ phác thảo và xác nhận trước khi vẽ chính thức. Thời gian sản xuất 7–14 ngày.' },
      { q: 'Giá đèn vẽ tranh thủ công là bao nhiêu?', a: 'Giá từ 150.000đ (đèn ø20cm, họa tiết đơn giản) đến 1.200.000đ (đèn ø60cm, tranh phức tạp nhiều màu). Đèn vẽ tranh theo chủ đề riêng giá cao hơn 30–50% do công vẽ tỉ mỉ hơn. Đặt từ 10 chiếc giảm 10–15%.' },
      { q: 'Đèn vẽ tranh có phải hàng độc bản không?', a: 'Với đèn vẽ tay thủ công hoàn toàn, mỗi chiếc là một tác phẩm độc bản — không có 2 chiếc hoàn toàn giống nhau dù cùng chủ đề. LongDenViet có thể in số thứ tự và chữ ký họa sĩ lên đèn để chứng nhận tính độc bản nếu khách hàng yêu cầu.' },
      { q: 'Đèn vẽ tranh phù hợp làm quà tặng đối tác nước ngoài không?', a: 'Rất phù hợp. Đèn vẽ tranh LongDenViet mang đậm bản sắc văn hóa Việt Nam, có giá trị nghệ thuật cao, dễ mang theo (nhẹ, có thể tháo khung gấp gọn). LongDenViet đóng hộp quà sang trọng, kèm card tiếng Anh giải thích nghệ thuật đèn lồng Việt Nam và certificate of authenticity.' },
    ],
  },

  'chup-den-vai': {
    intro: [
      'Chụp đèn vải (chao đèn) thay thế và gia công số lượng lớn — LongDenViet cung cấp chụp đèn vải đa dạng với hơn 10 màu tiêu chuẩn: nâu camel, vàng champagne, xám khói, đen, trắng ngà, cam đất, hồng nude, tím lavender, xanh lá rừng, xanh dương navy. Đường kính từ 20cm đến 60cm, vải dày 280gsm, khung thép sơn tĩnh điện bền đẹp.',
      'Chụp đèn vải LongDenViet phù hợp cho việc thay thế chao đèn cũ, nâng cấp đèn phòng ngủ khách sạn, hoặc trang trí quán cafe và nhà hàng với số lượng lớn đồng bộ. Có thể kết hợp với đế đèn sẵn có hoặc đặt cùng bộ đèn hoàn chỉnh. Kích thước chuẩn E27 tương thích với hầu hết các loại đế đèn phổ biến.',
      'Giá chụp đèn vải tại LongDenViet: từ 65.000đ – 280.000đ/chiếc tùy kích thước và màu sắc. Đặt sỉ từ 30 chiếc giảm 15–20%, từ 100 chiếc giảm 25%. Giao hàng toàn quốc qua GHN trong 2–4 ngày làm việc. Nhận đặt màu Pantone riêng từ 50 chiếc trở lên.',
    ],
    relatedPosts: [
      { label: 'Chụp đèn vải thay thế — hướng dẫn chọn đúng kích thước', href: '/blog/chup-den-vai-thay-the' },
      { label: 'Gia công chụp đèn vải số lượng lớn', href: '/blog/gia-cong-chup-den-vai-2' },
      { label: 'Đèn vải cao cấp trang trí nội thất', href: '/blog/den-vai-trang-tri-2' },
    ],
    faq: [
      { q: 'Chụp đèn vải có nhiều kích thước nào?', a: 'LongDenViet cung cấp chụp đèn vải từ ø20cm đến ø60cm, với các kích thước phổ biến: 20cm, 25cm, 30cm, 35cm, 40cm, 45cm, 50cm và 60cm. Chiều cao tương ứng từ 15cm đến 45cm. Nếu cần kích thước khác, có thể đặt riêng từ 50 chiếc trở lên.' },
      { q: 'Chụp đèn vải LongDenViet tương thích với đui đèn nào?', a: 'Toàn bộ chụp đèn vải LongDenViet đều tương thích đui E27 tiêu chuẩn — loại đui đèn phổ biến nhất tại Việt Nam. Khuyến nghị dùng bóng LED E27 3–5W nhiệt độ màu 2700K–3000K để ánh sáng vàng ấm đẹp nhất qua vải.' },
      { q: 'Có thể đặt màu chụp đèn vải theo yêu cầu không?', a: 'Có, nhận đặt màu Pantone hoặc mẫu vải khách hàng cung cấp từ 50 chiếc trở lên. Thời gian sản xuất thêm 3–5 ngày so với màu tiêu chuẩn. Phù hợp cho chuỗi khách sạn, nhà hàng muốn đồng bộ màu sắc theo brand guideline.' },
      { q: 'Giá sỉ chụp đèn vải bao nhiêu?', a: 'Giá lẻ từ 65.000đ – 280.000đ/chiếc tùy kích thước. Từ 30 chiếc giảm 15%, từ 100 chiếc giảm 20%, từ 300 chiếc giảm 25%. Liên hệ 0989.778.247 để nhận bảng giá sỉ đầy đủ theo kích thước và số lượng.' },
      { q: 'Chụp đèn vải có bền không?', a: 'Vải dày 280gsm kết hợp khung thép sơn tĩnh điện bền 3–5 năm trong điều kiện trong nhà. Nên lau bụi bằng khăn khô, tránh để ở nơi ẩm. Không phù hợp sử dụng ngoài trời không có mái che.' },
    ],
  },

  'phong-khach': {
    intro: [
      'Đèn trang trí phòng khách — không gian tiếp khách là bộ mặt của ngôi nhà, và ánh sáng chính là yếu tố tạo nên ấn tượng đầu tiên. Đèn lồng thủ công LongDenViet mang vẻ đẹp nghệ thuật Việt Nam vào phòng khách, tạo điểm nhấn độc đáo mà không loại đèn công nghiệp nào có thể thay thế được.',
      'Lựa chọn phổ biến nhất cho phòng khách: đèn lồng Hội An vải lụa treo giữa phòng (điểm nhấn trần), đèn mây tre đặt góc salon, đèn thả trần nghệ thuật trên bàn trà và đèn vải cao cấp trên kệ trang trí. Mỗi phong cách nội thất có dòng đèn phù hợp riêng — từ cổ điển, hiện đại đến scandinavian, Indochine.',
      'Giá đèn trang trí phòng khách tại LongDenViet: từ 85.000đ – 580.000đ/chiếc tùy model. Tư vấn miễn phí lựa chọn đèn phù hợp phong cách nội thất qua Zalo 0989.778.247 — chỉ cần gửi ảnh phòng khách, nhận ngay gợi ý cụ thể về model, màu sắc và cách bố trí.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng trang trí phòng khách hiện đại', href: '/blog/den-long-phong-khach-hien-dai' },
      { label: 'Cách bố trí đèn trang trí cho căn phòng', href: '/blog/cach-bo-tri-den-trang-tri-cho-can-phong' },
      { label: 'Đèn trang trí nội thất chung cư hiện đại', href: '/blog/bo-tri-den-trang-tri-noi-that-chung-cu-hien-dai' },
    ],
    faq: [
      { q: 'Nên chọn đèn lồng loại nào cho phòng khách?', a: 'Phòng khách hiện đại: đèn mây tre tông tự nhiên hoặc đèn vải tông trung tính. Phòng khách Indochine/cổ điển: đèn lồng Hội An vải lụa màu sắc rực rỡ hoặc đèn gỗ chạm khắc. Phòng khách nhỏ: đèn thả trần mini giúp tạo chiều cao ảo. LongDenViet tư vấn miễn phí qua ảnh.' },
      { q: 'Đèn lồng phòng khách cần mấy chiếc?', a: 'Phòng khách 20–30m²: 1 đèn thả trần chính + 2–3 đèn nhỏ accent. Phòng khách 30–50m²: 1–2 đèn trần + 4–6 đèn nhỏ trang trí kệ, góc sofa. Phòng khách lớn trên 50m²: cụm 3–5 đèn thả trần ở các độ cao khác nhau tạo chiều sâu. Tư vấn cụ thể khi gửi ảnh mặt bằng.' },
      { q: 'Đèn lồng có phù hợp phong cách phòng khách hiện đại không?', a: 'Hoàn toàn phù hợp. Đèn mây tre tông nâu tự nhiên hoặc đèn vải trắng/be rất hợp với nội thất hiện đại tối giản. Đèn kiểu Nhật cũng rất trendy cho phong cách scandinavian và japandi đang thịnh hành. Chìa khóa là chọn đúng màu sắc tông trung tính.' },
      { q: 'Giá đèn phòng khách tại LongDenViet bao nhiêu?', a: 'Đèn nhỏ accent (ø15–20cm): 65.000đ – 150.000đ. Đèn vừa (ø25–35cm): 120.000đ – 280.000đ. Đèn lớn thả trần (ø40–60cm): 250.000đ – 580.000đ. Combo trang trí phòng khách đầy đủ (1 đèn chính + 4 đèn nhỏ) từ 600.000đ – 1.800.000đ.' },
      { q: 'Có dịch vụ tư vấn trang trí đèn phòng khách không?', a: 'Có, LongDenViet tư vấn miễn phí qua Zalo 0989.778.247: gửi ảnh phòng khách + phong cách mong muốn, nhận gợi ý cụ thể về model đèn, số lượng, cách bố trí và ước tính ngân sách. Dịch vụ tư vấn thiết kế và lắp đặt tại nhà có tính phí tại TP.HCM.' },
    ],
  },

  'phong-ngu': {
    intro: [
      'Đèn trang trí phòng ngủ — ánh sáng trong phòng ngủ cần đạt được sự cân bằng: đủ sáng để sinh hoạt nhưng đủ dịu nhẹ để thư giãn và dễ ngủ. Đèn lồng vải lụa, đèn mây tre và đèn kiểu Nhật của LongDenViet tạo ra ánh sáng lan toả tự nhiên qua chất liệu, không chói mắt, tạo cảm giác ấm áp và bình yên.',
      'Xu hướng trang trí phòng ngủ với đèn lồng thủ công 2025: đèn thả đầu giường thay đèn ngủ thông thường (tiết kiệm diện tích mặt bàn, thẩm mỹ hơn), đèn lồng mini đặt trên kệ trang trí tạo điểm nhấn, và đèn dây đèn lồng nhỏ trang trí vách đầu giường theo phong cách boho. Phòng ngủ resort và khách sạn thường dùng đèn vải cao cấp tông trắng/be tạo cảm giác thư giãn.',
      'Giá đèn trang trí phòng ngủ tại LongDenViet: từ 55.000đ – 420.000đ/chiếc. Combo đèn phòng ngủ (1 đèn thả + 2 đèn ngủ nhỏ) từ 250.000đ – 800.000đ. Nhận tư vấn miễn phí qua Zalo 0989.778.247.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng phòng ngủ — ý tưởng trang trí đẹp', href: '/blog/den-long-phong-ngu' },
      { label: 'Đèn đặt đầu giường phòng ngủ resort', href: '/blog/den-ban-dat-dau-giuong-phong-ngu-resort' },
      { label: 'Bố trí đèn phòng ngủ hợp phong thủy', href: '/blog/bo-tri-den-phong-ngu-hop-phong-thuy' },
    ],
    faq: [
      { q: 'Loại đèn nào phù hợp nhất cho phòng ngủ?', a: 'Cho phòng ngủ, ưu tiên đèn tạo ánh sáng khuếch tán dịu nhẹ: đèn vải lụa trắng/be (ánh sáng lan đều), đèn mây tre (ánh sáng qua khe đan tạo hoa văn trên tường đẹp), hoặc đèn kiểu Nhật (tối giản, bình yên). Tránh đèn có điểm sáng tập trung quá mạnh.' },
      { q: 'Đèn thả đầu giường cần treo ở độ cao bao nhiêu?', a: 'Đèn thả đầu giường treo tối ưu khi đáy đèn ngang tầm vai khi ngồi trên giường, khoảng 60–75cm tính từ mặt đệm. Độ cao này vừa đủ sáng để đọc sách, vừa không chói mắt khi nằm. Dây điện LongDenViet điều chỉnh được từ 50cm đến 2m.' },
      { q: 'Đèn lồng trong phòng ngủ có an toàn không?', a: 'An toàn khi dùng bóng LED (ít phát nhiệt). LongDenViet khuyến nghị bóng LED E27 3W nhiệt độ màu 2700K — tiêu thụ điện thấp, gần như không phát nhiệt, an toàn với vải đèn. Không dùng bóng sợi đốt vì nhiệt cao có thể làm hỏng vải lụa.' },
      { q: 'Giá đèn ngủ thủ công tại LongDenViet bao nhiêu?', a: 'Đèn ngủ nhỏ ø15–20cm: 55.000đ – 120.000đ. Đèn thả đầu giường ø25–35cm: 130.000đ – 280.000đ. Đèn vải cao cấp phòng ngủ resort ø30–45cm: 200.000đ – 420.000đ. Sỉ từ 20 chiếc giảm 15%.' },
      { q: 'Có thể dùng đèn lồng thay đèn ngủ thông thường không?', a: 'Hoàn toàn có thể. Đèn lồng vải hoặc đèn kiểu Nhật thả bên cạnh giường vừa có chức năng chiếu sáng, vừa trang trí đẹp hơn đèn ngủ thông thường nhiều lần. Với bóng LED 3W, đủ sáng để đọc sách mà không chói mắt khi muốn ngủ sớm.' },
    ],
  },

  'ngoai-troi': {
    intro: [
      'Đèn trang trí ngoài trời — ban công, sân vườn, lối đi và không gian outdoor là những góc sống ngày càng được chú trọng trong thiết kế nhà Việt hiện đại. Ánh sáng đèn lồng thủ công ngoài trời tạo ra không gian lãng mạn và ấm cúng, biến ban công bé nhỏ thành góc thư giãn lý tưởng sau giờ làm việc.',
      'LongDenViet có dòng đèn outdoor chuyên dụng: đèn tre và mây được xử lý chống ẩm, đèn lồng vải phủ nano waterproof, và đèn nhựa chịu mưa nắng bền màu. Phù hợp cho ban công chung cư (đèn nhỏ treo lan can), sân vườn biệt thự (đèn cột hoặc đèn treo dây giữa các cây), mái hiên nhà hàng và lối đi resort.',
      'Giá đèn ngoài trời tại LongDenViet: từ 75.000đ – 450.000đ/chiếc. Dây đèn lồng trang trí ban công từ 180.000đ/dây 5 chiếc. Đặt sỉ từ 20 chiếc giảm 15%. Tư vấn lắp đặt miễn phí cho dự án resort và sân vườn tại TP.HCM qua hotline 0989.778.247.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng ngoài trời — cách chọn và bảo quản', href: '/blog/den-long-hoi-an-treo-ngoai-troi' },
      { label: 'Đèn lồng trang trí ban công chung cư', href: '/blog/den-long-trang-tri-ban-cong' },
      { label: 'Đèn lồng sân vườn — trang trí ngoại thất đẹp', href: '/blog/den-long-trang-tri-san-vuon' },
    ],
    faq: [
      { q: 'Đèn lồng nào phù hợp treo ngoài trời?', a: 'Cho ngoài trời, chọn: đèn lồng tre/mây đã xử lý chống ẩm, đèn lồng nhựa chịu thời tiết, hoặc đèn vải phủ nano waterproof của LongDenViet. Tránh đèn lồng vải lụa thông thường — dễ phai màu và mục vải khi tiếp xúc mưa trực tiếp.' },
      { q: 'Đèn lồng outdoor bền được bao lâu?', a: 'Đèn tre/mây xử lý chống ẩm: 2–4 năm ở nơi có mái che, 1–2 năm outdoor hoàn toàn. Đèn lồng nhựa: 3–5 năm. Đèn vải phủ nano: 1–2 năm. Để tăng tuổi thọ, nên cất vào trong mùa mưa dài ngày và vệ sinh định kỳ.' },
      { q: 'Ban công nhỏ nên trang trí đèn kiểu gì?', a: 'Ban công nhỏ dưới 4m² nên dùng: dây đèn lồng mini treo dọc lan can (5–7 chiếc), 1–2 đèn lồng nhỏ ø15–20cm treo góc, hoặc đèn cắm đất mini. Tránh đèn quá to làm ban công thêm chật. LongDenViet có bộ kit trang trí ban công từ 250.000đ.' },
      { q: 'Đèn ngoài trời có cần bảo trì không?', a: 'Nên vệ sinh đèn 1–2 lần/tháng bằng khăn khô mềm để loại bỏ bụi và nước đọng. Trước mùa mưa, kiểm tra dây điện và đầu nối ngoài trời. Bôi dầu dừa hoặc sáp chống ẩm lên đèn tre mỗi 3–6 tháng. Liên hệ 0989.778.247 nếu cần tư vấn bảo trì dự án lớn.' },
      { q: 'Đèn lồng outdoor tại LongDenViet giá bao nhiêu?', a: 'Đèn tre/mây outdoor: 75.000đ – 320.000đ/chiếc. Đèn lồng nhựa màu sắc: 35.000đ – 120.000đ/chiếc. Dây đèn lồng ban công (5 chiếc): từ 180.000đ. Đặt sỉ từ 20 chiếc giảm 15%, từ 100 chiếc giảm 25%. Liên hệ 0989.778.247.' },
    ],
  },

  'den-noi-that': {
    intro: [
      'Đèn trang trí nội thất cao cấp — dòng sản phẩm định hướng thiết kế nội thất biệt thự, căn hộ cao cấp và showroom. Khi ánh sáng nhân tạo được chọn lựa kỹ càng, nó không chỉ chiếu sáng mà còn kể câu chuyện về gu thẩm mỹ của chủ nhân — đèn lồng thủ công Việt Nam là lựa chọn thể hiện phong cách độc đáo và tôn vinh văn hóa bản địa.',
      'LongDenViet cung cấp đèn nội thất cao cấp cho biệt thự và căn hộ với đầy đủ giải pháp: đèn thả trần nghệ thuật cho phòng khách lớn, đèn đứng sàn bên sofa tạo điểm nhấn, đèn áp tường hành lang, đèn bàn trang trí và đèn tủ kệ. Chất liệu từ gỗ khắc thủ công, mây tre đan tinh xảo đến vải lụa cao cấp — tất cả được thiết kế để tương thích với nội thất premium.',
      'Dịch vụ tư vấn ánh sáng nội thất trọn gói: LongDenViet phối hợp với kiến trúc sư và nhà thiết kế nội thất để lựa chọn giải pháp đèn phù hợp cho từng không gian cụ thể. Đã tư vấn và cung cấp đèn cho nhiều dự án biệt thự cao cấp tại TP.HCM, Hà Nội và Đà Nẵng.',
    ],
    relatedPosts: [
      { label: 'Đèn trang trí nội thất chung cư hiện đại', href: '/blog/bo-tri-den-trang-tri-noi-that-chung-cu-hien-dai' },
      { label: 'Cách chọn đèn trang trí đúng cho nội thất', href: '/blog/cach-chon-den-dung-trang-tri-noi-that' },
      { label: 'Nghe thuật trang trí đèn chung cư cao cấp', href: '/blog/nghe-thuat-trang-tri-den-chung-cu-cao-cap' },
    ],
    faq: [
      { q: 'Đèn nội thất LongDenViet phù hợp với phong cách nào?', a: 'Đèn LongDenViet phù hợp đặc biệt với: Indochine (đèn lồng Hội An, gỗ chạm), Japandi (đèn kiểu Nhật tối giản), Wabi-sabi (đèn mây tre tự nhiên), và Tropical Luxury (đèn lồng vải màu sắc kết hợp cây xanh). Cũng phù hợp nội thất hiện đại khi chọn tông màu trung tính.' },
      { q: 'Làm sao phối đèn trang trí với nội thất sẵn có?', a: 'Nguyên tắc cơ bản: chọn đèn cùng tone màu chủ đạo của phòng (trung tính, ấm, lạnh). Nếu nội thất đã có nhiều chi tiết, chọn đèn đơn giản làm nền. Nếu nội thất tối giản, có thể chọn đèn có hoa văn nổi bật làm điểm nhấn. LongDenViet tư vấn miễn phí khi gửi ảnh.' },
      { q: 'Đèn thủ công có thể dùng cho biệt thự cao cấp không?', a: 'Hoàn toàn có thể. Nhiều biệt thự và căn hộ penthouse cao cấp tại Việt Nam hiện đang dùng đèn thủ công như điểm nhấn nghệ thuật độc bản. Đèn gỗ chạm khắc hoặc đèn vải cao cấp tùy chỉnh theo màu Pantone là lựa chọn phổ biến. LongDenViet đã thực hiện nhiều dự án biệt thự 5–15 tỷ.' },
      { q: 'Giá đèn nội thất cao cấp tại LongDenViet?', a: 'Đèn nội thất trung cấp (ø25–40cm): 150.000đ – 350.000đ. Đèn cao cấp (vải lụa, gỗ chạm): 300.000đ – 680.000đ. Đèn nghệ thuật tùy chỉnh độc bản: từ 800.000đ trở lên tùy thiết kế. Liên hệ 0989.778.247 để nhận tư vấn và báo giá dự án.' },
      { q: 'Có dịch vụ lắp đặt đèn nội thất tận nơi không?', a: 'Có, LongDenViet cung cấp dịch vụ lắp đặt đèn nội thất tại TP.HCM cho dự án từ 10 chiếc trở lên. Bao gồm khảo sát thực địa, tư vấn bố cục ánh sáng, cung cấp đèn và lắp đặt. Phí lắp đặt tính theo số lượng và độ phức tạp. Liên hệ để được báo giá.' },
    ],
  },

  'qua-tang': {
    intro: [
      'Đèn lồng làm quà tặng — ý nghĩa, độc đáo và đặc trưng văn hoá Việt Nam. Khi bạn tặng một chiếc đèn lồng Hội An thủ công, bạn không chỉ tặng vật phẩm — bạn tặng câu chuyện về nghề làng, về phố cổ, về ánh sáng văn hoá trăm năm. Đây là món quà khiến người nhận nhớ mãi và gắn kết sâu sắc hơn với văn hoá Việt.',
      'LongDenViet cung cấp dịch vụ đóng gói quà tặng chuyên nghiệp: hộp quà cao cấp, giấy gói thủ công, thiệp chúc viết tay và dây ruy băng trang trí. Phù hợp cho: quà tặng đối tác nước ngoài, quà tặng sự kiện doanh nghiệp (hội nghị, khai trương, year-end party), quà cưới độc đáo và quà lưu niệm phố cổ Hội An.',
      'Đặt quà tặng đèn lồng theo số lượng lớn: LongDenViet nhận in logo doanh nghiệp, thêu tên công ty hoặc slogan lên đèn, đóng hộp đồng bộ theo bộ nhận diện thương hiệu. Giá quà tặng từ 85.000đ – 580.000đ/set tùy model và cách đóng gói. Liên hệ 0989.778.247 để nhận báo giá quà tặng doanh nghiệp.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng quà tặng doanh nghiệp ý nghĩa', href: '/blog/den-long-lam-qua-tang-doanh-nghiep' },
      { label: 'Đèn lồng Hội An quà tặng Tết ý nghĩa', href: '/blog/den-long-hoi-an-qua-tang-tet-y-nghia' },
      { label: 'Đèn lồng quà tặng ý nghĩa cho mọi dịp', href: '/blog/den-long-qua-tang-y-nghia' },
    ],
    faq: [
      { q: 'Đèn lồng là quà tặng phù hợp dịp nào?', a: 'Đèn lồng phù hợp làm quà tặng cho: Tết Nguyên Đán, Tết Trung Thu, khai trương, sinh nhật, quà cưới, quà kỷ niệm thành lập công ty, quà tặng đối tác nước ngoài và quà lưu niệm Việt Nam. Đèn lồng là món quà vừa thực dụng (trang trí được), vừa ý nghĩa văn hoá sâu sắc.' },
      { q: 'Có thể in logo công ty lên đèn lồng quà tặng không?', a: 'Có, LongDenViet nhận in/thêu logo từ 50 chiếc trở lên. Phương pháp: in nhiệt trực tiếp (nhanh, giá tốt) hoặc thêu tay (cao cấp, bền đẹp hơn). Thời gian sản xuất thêm 5–7 ngày. Phù hợp cho quà tặng hội nghị, sự kiện doanh nghiệp và chuỗi khách sạn.' },
      { q: 'Đặt đèn lồng quà tặng số lượng lớn có được giảm giá không?', a: 'Có. Từ 50 chiếc giảm 20%, từ 100 chiếc giảm 25%, từ 200 chiếc giảm 30% so với giá lẻ. Ngoài ra còn có thể đàm phán giá theo dự án cho đơn trên 500 chiếc. LongDenViet cũng hỗ trợ chi phí đóng gói hộp quà cho đơn từ 100 chiếc.' },
      { q: 'Dịch vụ đóng gói quà tặng của LongDenViet như thế nào?', a: 'LongDenViet cung cấp 3 tùy chọn đóng gói: (1) Hộp giấy kraft đơn giản + giấy mỏng + thiệp in sẵn logo — phù hợp quà tặng tập thể. (2) Hộp cứng cao cấp + dây ruy băng + thiệp viết tay — phù hợp quà VIP. (3) Túi vải có logo thêu — phù hợp quà lưu niệm. Phí đóng gói từ 15.000đ – 45.000đ/set.' },
      { q: 'Đèn lồng quà tặng có giao hàng toàn quốc không?', a: 'Có, LongDenViet giao hàng toàn quốc qua GHN, GHTK và J&T Express. Đơn quà tặng được đóng gói chắc chắn 2 lớp bảo vệ đảm bảo đèn không biến dạng khi vận chuyển. Thời gian giao hàng: 1–2 ngày TP.HCM, 2–4 ngày các tỉnh.' },
    ],
  },

  'den-san': {
    intro: [
      'Đèn sàn thủ công — loại đèn đứng trang trí đang được ưa chuộng trong nội thất Việt hiện đại vì khả năng tạo điểm nhấn nghệ thuật ngay tại góc phòng. Không giống đèn trần hay đèn bàn thông thường, đèn sàn tạo ra luồng ánh sáng khuếch tán từ dưới lên, làm mềm không gian và tạo cảm giác ấm áp vào buổi tối.',
      'LongDenViet cung cấp đèn sàn thủ công với 3 phong cách chính: đèn sàn vải lụa phong cách Hội An (khung sắt rèn, chao vải lụa tơ tằm đường kính 35–50cm), đèn sàn kiểu Nhật (khung tre, chao giấy washi hoặc vải mỏng, cao 150–180cm), và đèn sàn tre mây rustic (đan thủ công, ánh sáng xuyên qua khe đan tạo hoa văn trên tường). Phù hợp đặt góc phòng khách, cạnh sofa đọc sách, bên cạnh giường ngủ hoặc tạo điểm nhấn cho quán cafe.',
      'Giá đèn sàn thủ công LongDenViet từ 220.000đ – 680.000đ/chiếc tùy kiểu dáng và chất liệu. Nhận đặt màu theo yêu cầu, gia công in logo cho chuỗi khách sạn. Giao toàn quốc trong 2–4 ngày, lắp đặt miễn phí tại TP.HCM cho đơn từ 5 chiếc. Liên hệ 0989.778.247 để được tư vấn và xem mẫu thực tế.',
    ],
    relatedPosts: [
      { label: 'Cách chọn đèn trang trí đúng cho nội thất', href: '/blog/cach-chon-den-dung-trang-tri-noi-that' },
      { label: 'Bố trí đèn trang trí nội thất chung cư hiện đại', href: '/blog/bo-tri-den-trang-tri-noi-that-chung-cu-hien-dai' },
      { label: 'Đèn lồng phòng ngủ — ý tưởng trang trí đẹp', href: '/blog/den-long-phong-ngu' },
    ],
    faq: [
      { q: 'Đèn sàn thủ công LongDenViet cao bao nhiêu?', a: 'Đèn sàn LongDenViet có chiều cao từ 140cm đến 185cm tùy model. Phổ biến nhất là 155–165cm — vừa đủ để chao đèn ngang tầm mắt khi ngồi, ánh sáng khuếch tán tự nhiên. Có thể đặt gia công theo chiều cao yêu cầu cho dự án khách sạn.' },
      { q: 'Đặt đèn sàn ở vị trí nào trong phòng khách?', a: 'Vị trí tốt nhất: góc phòng sau sofa (tạo ánh sáng nền ấm), bên cạnh kệ sách (đèn đọc và trang trí), hoặc hai bên TV tạo hiệu ứng backlight. Tránh đặt giữa phòng vì cản lối đi. LongDenViet tư vấn bố cục ánh sáng miễn phí khi gửi ảnh mặt bằng qua Zalo.' },
      { q: 'Đèn sàn vải lụa có bền không, có dễ bám bụi không?', a: 'Vải lụa tơ tằm của LongDenViet được xử lý chống bụi tĩnh điện. Bụi bám chỉ cần phủi nhẹ bằng cọ lông mềm 1–2 lần/tháng. Không giặt bằng nước. Tránh đặt gần cửa sổ có nắng trực tiếp để vải giữ màu lâu. Bảo hành 12 tháng cho chao đèn vải.' },
      { q: 'Giá đèn sàn thủ công tại LongDenViet bao nhiêu?', a: 'Đèn sàn vải lụa Hội An: 220.000đ – 420.000đ. Đèn sàn kiểu Nhật: 280.000đ – 520.000đ. Đèn sàn tre mây cao cấp: 350.000đ – 680.000đ. Đặt sỉ từ 5 chiếc trở lên giảm 15%. Liên hệ 0989.778.247 để nhận báo giá theo yêu cầu cụ thể.' },
      { q: 'Có thể dùng đèn sàn ngoài trời ban công không?', a: 'Đèn sàn vải lụa không phù hợp ngoài trời do dễ bị mưa nắng làm hỏng. Để trang trí ban công, nên chọn dòng đèn tre xử lý chống ẩm hoặc đèn lồng nhựa chịu thời tiết của LongDenViet. Tư vấn miễn phí khi gọi 0989.778.247.' },
    ],
  },

  'den-ap-tuong': {
    intro: [
      'Đèn áp tường thủ công — xu hướng trang trí nội thất đang được ưa chuộng tại khách sạn boutique, homestay và nhà ở cao cấp. Khác với đèn treo trần hay đèn sàn, đèn áp tường gắn trực tiếp vào tường, tiết kiệm diện tích sàn và tạo ra nguồn sáng theo chiều ngang — lý tưởng cho hành lang hẹp, đầu giường và khu vực tiếp khách.',
      'LongDenViet có 3 dòng đèn áp tường chủ đạo: đèn áp tường lồng Hội An (khung sắt, vải lụa màu sắc phong phú — hợp với nhà hàng, resort có phong cách Indochine), đèn áp tường kiểu Nhật (khung tre, giấy shoji hoặc vải mỏng — tối giản, spa và nhà hàng Nhật), và đèn áp tường mây tre (đan thủ công, ánh sáng tạo hoa văn đổ bóng đẹp trên tường). Có thể gắn đơn lẻ hoặc thành dãy theo hành lang.',
      'Giá đèn áp tường LongDenViet từ 180.000đ – 520.000đ/chiếc. Nhận gia công theo bản vẽ cho dự án khách sạn, chuỗi nhà hàng. Bao gồm phụ kiện gắn tường, hướng dẫn lắp đặt. Lắp đặt miễn phí tại TP.HCM cho đơn từ 10 chiếc. Liên hệ 0989.778.247.',
    ],
    relatedPosts: [
      { label: 'Đèn trang trí nội thất cao cấp — xu hướng 2026', href: '/blog/nghe-thuat-trang-tri-den-chung-cu-cao-cap' },
      { label: 'Cách chọn đèn trang trí đúng cho nội thất', href: '/blog/cach-chon-den-dung-trang-tri-noi-that' },
      { label: 'Đèn lồng trang trí ban công chung cư', href: '/blog/den-long-trang-tri-ban-cong' },
    ],
    faq: [
      { q: 'Đèn áp tường thủ công lắp đặt thế nào?', a: 'Đèn áp tường LongDenViet đi kèm bracket gắn tường và vít tiêu chuẩn. Lắp đặt đơn giản trong 15–20 phút: khoan 2 lỗ theo khoảng cách bracket, bắt vít, treo đèn. Dây điện dẫn vào tường qua lỗ khoan sẵn hoặc chạy dọc tường. Có hướng dẫn chi tiết kèm theo sản phẩm.' },
      { q: 'Nên treo đèn áp tường ở độ cao bao nhiêu?', a: 'Đèn áp tường hành lang: treo ở độ cao 2,0–2,2m để chiếu sáng lối đi mà không chói mắt. Đèn áp tường đầu giường: 1,4–1,6m từ sàn (ngang đầu khi ngồi). Đèn hai bên gương phòng tắm: 1,8m từ sàn. LongDenViet tư vấn vị trí cụ thể theo mặt bằng khi gửi ảnh qua Zalo.' },
      { q: 'Đèn áp tường có phù hợp cho khách sạn không?', a: 'Rất phù hợp. LongDenViet đã cung cấp đèn áp tường cho hàng trăm khách sạn 3–5 sao, homestay và resort tại VN. Ưu điểm cho khách sạn: tiết kiệm diện tích, dễ vệ sinh, bền đẹp. Nhận gia công đồng bộ màu sắc và kích thước theo tiêu chuẩn từng phòng. Tối thiểu 20 chiếc/đơn gia công.' },
      { q: 'Giá đèn áp tường thủ công tại LongDenViet?', a: 'Đèn áp tường lồng vải nhỏ ø15–20cm: 180.000đ – 280.000đ. Đèn áp tường kiểu Nhật: 220.000đ – 380.000đ. Đèn áp tường mây tre cao cấp: 280.000đ – 520.000đ. Sỉ từ 10 chiếc giảm 15%, từ 50 chiếc giảm 25%. Liên hệ 0989.778.247 để báo giá dự án.' },
      { q: 'Đèn áp tường phù hợp phong cách nội thất nào?', a: 'Đèn áp tường LongDenViet phù hợp nhất với: Indochine (đèn lồng Hội An màu sắc ấm), Japandi (đèn kiểu Nhật tối giản), Wabi-sabi (đèn mây tre tự nhiên), và Tropical (kết hợp với cây xanh trong nhà). Không phù hợp với nội thất hiện đại minimalist thuần — cần thêm điểm nhấn khác để cân bằng.' },
    ],
  },

  'phong-bep': {
    intro: [
      'Đèn trang trí phòng bếp và phòng ăn — không gian ẩm thực thêm ấm cúng, gắn kết gia đình với ánh sáng đèn thủ công đúng điệu. Phòng bếp và phòng ăn thường bị bỏ qua trong việc chọn đèn trang trí, dẫn đến không gian thiếu tầng lớp ánh sáng và trở nên đơn điệu dù nội thất tốt.',
      'LongDenViet gợi ý 2 vị trí đặt đèn lồng cho phòng ăn và bếp: đèn thả trần phía trên bàn ăn (1 chiếc lớn ø40–60cm hoặc 3 chiếc nhỏ thả ở độ cao khác nhau — tạo hiệu ứng depth đẹp) và đèn áp tường hoặc đèn sàn ở góc phòng ăn tạo ánh sáng nền ấm. Chất liệu phù hợp nhất cho bếp: đèn mây tre (chịu nhiệt tốt, dễ vệ sinh) và đèn vải xử lý chống bụi.',
      'Kinh nghiệm từ thực tế: nhiều quán cafe và nhà hàng TP.HCM đã dùng đèn lồng Hội An thả trần trên bàn ăn thay đèn thả trần kim loại thông thường — tạo ra bầu không khí ấm áp và riêng biệt hơn hẳn. LongDenViet có sẵn 200+ mẫu đèn thả trần phù hợp phòng ăn, giá từ 85.000đ – 380.000đ/chiếc. Liên hệ 0989.778.247 để được tư vấn chọn theo kích thước bàn ăn.',
    ],
    relatedPosts: [
      { label: 'Đèn thả trần phòng bếp — cách chọn theo kích thước bàn', href: '/blog/den-tha-tran-trang-tri-phong-an' },
      { label: 'Bố trí đèn phòng ngủ hợp phong thủy', href: '/blog/bo-tri-den-phong-ngu-hop-phong-thuy' },
      { label: 'Cách chọn đèn trang trí đúng cho nội thất', href: '/blog/cach-chon-den-dung-trang-tri-noi-that' },
    ],
    faq: [
      { q: 'Đèn thả trần phòng ăn nên chọn kích thước bao nhiêu?', a: 'Nguyên tắc cơ bản: đường kính đèn = chiều rộng bàn ăn ÷ 2. Ví dụ bàn ăn 80cm → đèn ø40cm. Nếu dùng 3 đèn nhỏ thả theo hàng: đường kính mỗi đèn ø25–30cm, cách nhau 25–30cm. Độ cao đáy đèn cách mặt bàn 70–80cm để đủ sáng mà không chói mắt khi ngồi.' },
      { q: 'Đèn lồng phòng bếp có an toàn không?', a: 'An toàn khi dùng bóng LED (ít phát nhiệt, không nguy cơ cháy vải). LongDenViet khuyến nghị bóng LED E27 5W–7W, nhiệt độ màu 2700K–3000K (ánh vàng ấm) cho phòng ăn. Tránh đặt đèn vải quá gần bếp gas — dầu mỡ bắn có thể thấm vào vải. Đèn mây tre phù hợp khu vực gần bếp hơn đèn vải.' },
      { q: 'Nên chọn đèn phòng ăn phong cách gì cho nhà hiện đại?', a: 'Nhà hiện đại tông trắng-gỗ: chọn đèn mây tre tự nhiên hoặc đèn kiểu Nhật tông nâu-kem — tạo điểm nhấn ấm mà không phá vỡ tông màu chủ. Nhà theo phong cách Indochine hoặc vintage: đèn lồng Hội An vải lụa màu vàng-đỏ-xanh lá là lựa chọn điểm nhấn xuất sắc. Nhà Scandinavian: đèn mây tre nhỏ tone-on-tone màu trắng hoặc be.' },
      { q: 'Phòng bếp nhỏ nên dùng đèn gì?', a: 'Phòng bếp dưới 10m² nên chọn 1 đèn thả trần ø25–35cm đặt trung tâm, kết hợp đèn LED âm trần ở khu vực nấu nướng (đảm bảo đủ sáng để làm bếp). Không treo nhiều đèn lồng trong bếp nhỏ — sẽ trở nên chật chội. Tập trung vào 1 đèn đẹp làm điểm nhấn, tránh phân tán thị giác.' },
      { q: 'Giá đèn trang trí phòng bếp và phòng ăn tại LongDenViet?', a: 'Đèn thả trần nhỏ ø20–30cm: 85.000đ – 180.000đ. Đèn thả trần phòng ăn ø35–50cm: 150.000đ – 380.000đ. Đèn áp tường khu vực ăn uống: 180.000đ – 320.000đ. Combo 3 đèn thả trần bàn ăn: từ 320.000đ. Giao toàn quốc, lắp đặt miễn phí tại TP.HCM cho đơn từ 5 chiếc.' },
    ],
  },

  'ngoi-sao-nhua': {
    intro: [
      'Đèn ngôi sao nhựa — dòng đèn lồng lắp ráp nhựa đa màu sắc, giá bình dân, phù hợp trang trí lễ hội quy mô lớn, quán ăn bình dân và các sự kiện cộng đồng. Đèn ngôi sao nhựa LongDenViet có khả năng lắp ráp dễ dàng trong vài phút, không cần dụng cụ, và có thể tháo rời để cất gọn sau lễ hội.',
      'Bộ sưu tập đèn ngôi sao nhựa tại LongDenViet: đèn ngôi sao 5 cánh và 8 cánh với đường kính 20cm, 25cm, 30cm, 40cm và 60cm. Có 3 dòng chính: đèn nhựa 2 mảnh lắp ráp (phổ biến nhất), đèn nhựa xuyên sáng trong suốt và đèn nhựa có nhạc pin (phù hợp trẻ em). Màu sắc: đỏ, vàng, xanh lá, xanh dương, tím, hồng và trắng.',
      'Giá đèn ngôi sao nhựa tại LongDenViet: từ 12.000đ – 85.000đ/chiếc tùy kích thước và loại. Sỉ từ 100 chiếc giảm 20%, từ 500 chiếc giảm 30%. Phù hợp cho trường học tổ chức Trung Thu, xã phường trang trí phố phường, siêu thị và trung tâm thương mại treo trang trí mùa lễ hội.',
    ],
    relatedPosts: [
      { label: 'Đèn ngôi sao nhựa giá sỉ — hướng dẫn chọn mua', href: '/blog/den-ngoi-sao-nhua-gia-si' },
      { label: 'Đèn trung thu trẻ em — đèn nào an toàn nhất', href: '/blog/den-long-cho-tre-em' },
      { label: 'Đèn lồng Trung Thu giá rẻ cho trường học', href: '/blog/den-trung-thu-gia-si' },
    ],
    faq: [
      { q: 'Đèn ngôi sao nhựa lắp ráp có khó không?', a: 'Rất dễ lắp ráp — chỉ cần 2–5 phút, không cần dụng cụ. Mỗi bộ gồm 2 mảnh nhựa có khớp nối sẵn, chỉ cần ấn vào nhau và gắn dây thả là xong. Phù hợp cả trẻ em từ 6 tuổi trở lên tự lắp. LongDenViet có video hướng dẫn trên fanpage.' },
      { q: 'Đèn ngôi sao nhựa có bền không?', a: 'Đèn nhựa bền 2–3 mùa Trung Thu nếu bảo quản đúng cách. Sau lễ hội nên tháo rời, vệ sinh và cất trong hộp tránh nén đè. Không để ngoài trời mưa nắng trực tiếp. Chất liệu nhựa PP không chứa BPA, an toàn cho trẻ em.' },
      { q: 'Đèn ngôi sao nhựa sỉ giá bao nhiêu?', a: 'Giá lẻ từ 12.000đ (ø20cm) đến 85.000đ (ø60cm). Sỉ từ 100 chiếc giảm 20%, từ 500 chiếc giảm 30%, từ 1000 chiếc giảm 35%. Combo 100 chiếc đèn ø30cm nhiều màu từ 2.400.000đ. Liên hệ 0989.778.247 để nhận báo giá sỉ chi tiết.' },
      { q: 'Có bao nhiêu màu sắc đèn ngôi sao nhựa?', a: 'LongDenViet có 7 màu cơ bản: đỏ, vàng, xanh lá, xanh dương, tím, hồng và trắng. Có thể đặt theo màu cụ thể hoặc combo nhiều màu pha trộn. Mẫu đèn nhựa xuyên sáng trong suốt cũng rất được ưa chuộng vì tạo hiệu ứng ánh sáng đẹp đêm.' },
      { q: 'Đèn ngôi sao nhựa phù hợp sự kiện nào?', a: 'Phù hợp nhất cho: Tết Trung Thu trường học và khu phố, trang trí cổng chào lễ hội, trung tâm thương mại mùa lễ hội, tiệc thiếu nhi và sinh nhật bé, và trang trí quán ăn bình dân theo mùa. Không phù hợp cho không gian cao cấp — nên chọn đèn tre hoặc vải cho không gian premium.' },
    ],
  },

  'den-long-trang-tri': {
    intro: [
      'Đèn lồng trang trí — bộ sưu tập tổng hợp hơn 500 mẫu đèn lồng thủ công đẹp nhất từ LongDenViet, phù hợp mọi không gian và dịp lễ. Từ đèn lồng Hội An truyền thống đến đèn tre mây hiện đại, từ đèn vải cao cấp đến đèn gỗ chạm khắc — tất cả đều được sản xuất thủ công tại Việt Nam bởi nghệ nhân làng nghề.',
      'Đèn lồng trang trí LongDenViet phục vụ đa dạng nhu cầu: trang trí nhà ở và căn hộ, trang trí quán cafe và nhà hàng, trang trí khách sạn và resort, trang trí sự kiện cưới hỏi, hội nghị và lễ hội, và quà tặng doanh nghiệp. Mỗi dịp, mỗi không gian đều có dòng đèn phù hợp — từ đơn giản bình dân đến phức tạp cao cấp.',
      'Giá đèn lồng trang trí tại LongDenViet: từ 35.000đ (đèn nhỏ đơn giản) đến 800.000đ (đèn nghệ thuật cao cấp). Phổ biến nhất là tầm 85.000đ – 250.000đ/chiếc. Nhận tư vấn miễn phí, giao hàng toàn quốc, bảo hành 12 tháng. Liên hệ 0989.778.247 để được hỗ trợ lựa chọn.',
    ],
    relatedPosts: [
      { label: 'Đèn lồng trang trí — hướng dẫn chọn theo không gian', href: '/blog/cach-chon-den-dung-trang-tri-noi-that' },
      { label: 'Đèn lồng Hội An — nguồn gốc và ý nghĩa', href: '/blog/den-long-hoi-an-y-nghia-lich-su' },
      { label: 'Top đèn lồng trang trí bán chạy tại LongDenViet', href: '/blog/den-long-dep' },
    ],
    faq: [
      { q: 'LongDenViet có bao nhiêu mẫu đèn lồng trang trí?', a: 'LongDenViet hiện có hơn 500 mẫu đèn lồng trang trí thuộc 8 dòng chính: đèn lồng Hội An vải lụa, đèn mây tre đan, đèn kiểu Nhật, đèn lồng gỗ, đèn vải cao cấp, đèn thả trần, đèn Trung Thu và đèn Tết. Mẫu mới được cập nhật hàng quý.' },
      { q: 'Làm sao chọn đèn lồng phù hợp cho không gian của mình?', a: 'Cách đơn giản nhất: gửi ảnh không gian và mô tả phong cách muốn hướng đến qua Zalo 0989.778.247. LongDenViet có đội tư vấn sẵn sàng gợi ý model cụ thể, màu sắc và cách bố trí miễn phí cho đơn từ 5 chiếc trở lên.' },
      { q: 'Đèn lồng trang trí LongDenViet có xuất xứ ở đâu?', a: '100% sản xuất tại Việt Nam — chủ yếu tại làng nghề Hội An (Quảng Nam) và xưởng sản xuất TP.HCM. Không nhập hàng từ Trung Quốc. Tất cả nghệ nhân là người Việt, kỹ thuật làm đèn truyền thống Việt Nam được giữ gìn và phát triển.' },
      { q: 'Có thể xem hàng thực tế trước khi đặt không?', a: 'Có thể đặt hàng mẫu thử 1 chiếc trước khi đặt sỉ. Ngoài ra, LongDenViet có showroom trưng bày tại TP.HCM — liên hệ 0989.778.247 để đặt lịch xem hàng và được tư vấn trực tiếp. Cũng có thể xem video review sản phẩm thực tế trên fanpage LongDenViet.' },
      { q: 'Thời gian giao hàng đèn lồng trang trí bao lâu?', a: 'TP.HCM: giao trong ngày hoặc hôm sau. Các tỉnh miền Nam: 1–2 ngày. Miền Trung và Bắc: 2–4 ngày. Đơn hàng nhỏ giao qua GHN/GHTK. Đơn lớn trên 20 chiếc giao xe tải, đóng gói chắc chắn. Theo dõi đơn hàng real-time qua link được gửi khi xuất kho.' },
    ],
  },

  'gia-cong-den-trang-tri': {
    intro: [
      'Dịch vụ gia công đèn trang trí theo yêu cầu — LongDenViet nhận thiết kế và sản xuất đèn lồng tùy chỉnh cho doanh nghiệp, khách sạn, resort, nhà hàng và sự kiện. Từ màu sắc, kích thước, hoa văn đến in/thêu logo thương hiệu — tất cả đều có thể tùy chỉnh theo bản vẽ của khách hàng.',
      'Quy trình gia công: (1) Khách hàng cung cấp yêu cầu và mẫu tham khảo → (2) LongDenViet thiết kế bản vẽ kỹ thuật miễn phí → (3) Sản xuất mẫu thử trong 3–5 ngày → (4) Xác nhận mẫu → (5) Sản xuất đại trà. Thời gian sản xuất từ 7–21 ngày tùy số lượng và độ phức tạp. Số lượng tối thiểu: 20 chiếc/mẫu.',
      'Dịch vụ gia công đèn LongDenViet phù hợp cho: quà tặng doanh nghiệp in logo, trang trí sự kiện quy mô lớn (wedding, gala, hội nghị), chuỗi khách sạn cần đèn đồng bộ thương hiệu và xuất khẩu. Giá gia công cạnh tranh, giảm thêm theo số lượng. Liên hệ 0989.778.247 để nhận báo giá trong 24 giờ.',
    ],
    relatedPosts: [
      { label: 'Xưởng đèn lồng gia công — quy trình sản xuất', href: '/blog/xuong-den-long-gia-cong' },
      { label: 'Gia công chụp đèn trang trí theo yêu cầu', href: '/blog/gia-cong-chup-den-trang-tri' },
      { label: 'Gia công đèn vải theo đơn đặt hàng', href: '/blog/gia-cong-den-vai' },
    ],
    faq: [
      { q: 'Số lượng tối thiểu để đặt gia công đèn là bao nhiêu?', a: 'Số lượng tối thiểu là 20 chiếc/mẫu cho gia công đèn tiêu chuẩn. Với mẫu hoàn toàn mới (thiết kế từ đầu), tối thiểu 50 chiếc. Đơn hàng dưới mức tối thiểu vẫn có thể thương lượng tùy độ phức tạp — liên hệ để tư vấn.' },
      { q: 'Có thể in logo lên đèn không?', a: 'Có. LongDenViet nhận in logo bằng nhiều phương pháp: in nhiệt trực tiếp lên vải, thêu tay hoặc thêu máy, và dán decal chịu nhiệt. In nhiệt phù hợp số lượng lớn, thêu tay cho sản phẩm cao cấp.' },
      { q: 'Thời gian sản xuất đèn gia công là bao lâu?', a: 'Mẫu thử: 3–5 ngày. Sản xuất đại trà 20–50 chiếc: 7–10 ngày. 50–200 chiếc: 10–15 ngày. Trên 200 chiếc: 15–21 ngày. Thời gian có thể dài hơn vào mùa cao điểm (Tết, Trung Thu). Đặt sớm để ưu tiên lịch sản xuất.' },
      { q: 'Chi phí gia công đèn trang trí là bao nhiêu?', a: 'Chi phí phụ thuộc vào chất liệu, kích thước, hoa văn và số lượng. Đơn giản nhất (đèn vải tròn, 1 màu, in logo): từ 85.000đ/chiếc cho đơn 100 chiếc. Phức tạp hơn (thêu tay, nhiều màu): từ 150.000đ/chiếc. Liên hệ 0989.778.247 để nhận báo giá miễn phí.' },
      { q: 'Có thể thiết kế hoàn toàn mới theo ý tưởng của tôi không?', a: 'Hoàn toàn có thể. LongDenViet có đội ngũ thiết kế sản xuất bản vẽ kỹ thuật miễn phí dựa trên ý tưởng của khách hàng. Bạn chỉ cần mô tả ý tưởng, cung cấp hình ảnh tham khảo hoặc brand guideline — chúng tôi sẽ dịch thành sản phẩm thực tế.' },
      { q: 'Có thể gia công đèn xuất khẩu ra nước ngoài không?', a: 'Có. LongDenViet có kinh nghiệm gia công đèn lồng xuất khẩu sang Nhật Bản, Hàn Quốc, Mỹ và châu Âu. Sản phẩm được đóng gói theo tiêu chuẩn xuất khẩu, kèm CO/CQ nếu cần. Liên hệ để được tư vấn về yêu cầu kỹ thuật và chứng từ xuất khẩu.' },
      { q: 'Chất liệu nào có thể dùng để gia công đèn trang trí?', a: 'LongDenViet gia công đèn với nhiều chất liệu: vải lụa, organza, cotton, đay, mây tre đan, gỗ tự nhiên và khung sắt sơn tĩnh điện. Mỗi chất liệu phù hợp với phong cách và không gian khác nhau. Tư vấn viên sẽ đề xuất chất liệu tối ưu dựa trên mục đích sử dụng và ngân sách của bạn.' },
      { q: 'Có thể xem mẫu thực tế trước khi đặt số lượng lớn không?', a: 'Có. LongDenViet luôn sản xuất mẫu thử (sample) trước khi sản xuất đại trà. Chi phí mẫu thử được tính theo giá vật liệu thực tế, sẽ được hoàn lại khi đặt đơn sản xuất đại trà từ 50 chiếc trở lên. Mẫu thử hoàn thành trong 3–5 ngày làm việc.' },
      { q: 'LongDenViet có hỗ trợ lắp đặt tận nơi không?', a: 'Có, LongDenViet hỗ trợ lắp đặt tận nơi cho đơn hàng tại TP.HCM và các tỉnh lân cận (Bình Dương, Đồng Nai, Long An). Với các tỉnh xa hơn, đội kỹ thuật có thể di chuyển theo thỏa thuận. Chi phí lắp đặt tính theo quy mô công trình và khoảng cách.' },
      { q: 'Phương thức thanh toán cho đơn gia công như thế nào?', a: 'Đơn gia công thanh toán theo 2 đợt: 50% đặt cọc khi xác nhận mẫu thử, 50% còn lại trước khi giao hàng. Chấp nhận chuyển khoản ngân hàng, tiền mặt tại xưởng. Với đối tác thường xuyên có thể thương lượng hình thức thanh toán linh hoạt hơn.' },
    ],
  },
};

// Maps UI/nav slugs → actual WordPress category slugs that have products.
// Needed when the nav slug differs from any WP category slug.
// For WP-native slugs (den-tha-tran, phong-khach, etc.) no alias needed —
// they match directly via p.tags (which now holds ALL raw WP categories).
const SLUG_ALIAS_MAP: Record<string, string[]> = {
  // ── 23 danh mục chính (categories.json) ──
  'hoi-an-lantern':        ['den-hoi-an'],
  'den-kieu-nhat':         ['den-nhat-ban', 'den-long-nhat-ban', 'nhat-ban', 'den-long-nhat-ban-2'],
  'den-vai-cao-cap':       ['chup-den-vai', 'long-den-vai-lua', 'long-den-vai-hoa', 'den-vai-nhan', 'long-den-vai-gam', 'den-vai-cao-cap-2'],
  'den-may-tre':           ['den-tre', 'den-may', 'den-tam-tre'],
  'den-long-go':           [],
  'den-tha-tran':          ['den-op-tran', 'den-chum'],
  'den-trung-thu':         ['%f0%9f%91%91-trung-thu', 'den-nhua-rap', 'den-nhua-2-manh', 'den-nhua-nhac', 'den-nhua-lap-rap', 'long-den-nhua-pin', 'den-giay-thu', 'long-den-giay-xep', 'long-den-giay-kieng', 'den-kieng-thu', 'den-kieng-hinh-thu', 'den-kieng-truyen-thong', 'den-giay-rap', 'long-den-giay-tron', 'den-giay-tru-hinh-thu', 'den-keo-quan', 'long-den-co-tich', 'den-12-con-giap'],
  'den-ve-tranh':          ['den-ve', 'long-den-ve', 'long-den-ve-thu-cong', 'den-my-thuat', 'den-my-thuat-2'],
  'long-den-khung-sat':    [],
  'den-long-tet':          ['long-den-tet', 'den-cung-dinh'],
  'den-ap-tuong':          ['den-op-tuong', 'den-gan-tuong'],
  'den-san':               ['den-cay'],
  'den-noel':              ['ngoi-sao-nhua', 'den-nhua-xuyen-sang'],
  'den-quan-cafe':         ['den-quan-tra-sua', 'long-den-gia-re', 'long-den-hinh-tron', 'long-den-tron-mau', 'den-tron-10-mau', 'den-trai-tim'],
  'den-nha-hang':          ['den-treo-quan-bbq', 'den-sushi-bbq', 'den-nha-hang-2'],
  'den-khach-san':         ['den-khach-san-2', 'long-den-cao-cap'],
  'phong-khach':           ['kaha-living'],
  'phong-ngu':             [],
  'ngoai-troi':            ['den-ngoai-troi'],
  'den-noi-that':          ['den-sang-tao', 'long-den-sang-tao'],
  'gia-cong-den-trang-tri': [],
  'phu-kien':              ['phu-kien-den', 'phu-kien-long-den'],
  'phong-bep':             ['phong-an'],
  // ── Alias cũ (backward compat cho URL cũ) ──
  'den-tre-may':           ['den-tre', 'den-may-tre'],
  'den-long-trang-tri':    ['hoi-an-lantern', 'den-long-go', 'long-den-vai-hoa'],
  'den-ban':               ['chup-den-vai'],
  'den-ngoai-troi':        ['ngoai-troi', 'den-ngoai-troi'],
  'phu-kien-den':          ['phu-kien', 'phu-kien-den', 'phu-kien-long-den'],
  'hoa-dang':              ['hoi-an-lantern', 'den-long-tet', 'long-den-giay-xep'],
  'qua-tang':              ['hoi-an-lantern', 'den-long-go', 'den-vai-cao-cap'],
  'den-long':              ['hoi-an-lantern', 'den-long-go', 'long-den-vai-hoa'],
  'den-vai':               ['den-vai-cao-cap', 'long-den-vai-hoa', 'long-den-vai-lua'],
};

// Fallback: convert slug to readable Vietnamese label
const SLUG_LABELS: Record<string, string> = {
  'den-long':            'Đèn Lồng',
  'den-vai':             'Đèn Vải',
  'den-tre-may':         'Đèn Tre & Mây',
  'den-may-tre':         'Đèn Tre & Mây',
  'den-tet':             'Đèn Tết',
  'den-long-tet':        'Đèn Lồng Tết',
  'den-nhat-ban':        'Đèn Nhật Bản',
  'den-kieu-nhat':       'Đèn Kiểu Nhật',
  'den-quan-cafe':       'Đèn Quán Cafe',
  'den-quan-bbq':        'Đèn Quán BBQ',
  'den-khach-san':       'Đèn Khách Sạn',
  'kaha-living':         'Kaha Living',
  'hoi-an-lantern':      'Đèn Lồng Hội An',
  'den-tha-tran':        'Đèn Thả Trần',
  'den-san':             'Đèn Sàn',
  'den-ap-tuong':        'Đèn Áp Tường',
  'den-ve-tranh':        'Đèn Vẽ Tranh',
  'phong-khach':         'Đèn Phòng Khách',
  'phong-ngu':           'Đèn Phòng Ngủ',
  'phong-bep':           'Đèn Phòng Bếp',
  'ngoai-troi':          'Đèn Ngoài Trời',
  'den-noi-that':        'Đèn Nội Thất',
  'den-nha-hang':        'Đèn Nhà Hàng',
  'den-long-trang-tri':  'Đèn Lồng Trang Trí',
  'ngoi-sao-nhua':       'Đèn Ngôi Sao',
  'den-tron-10-mau':     'Đèn Tròn 10 Màu',
  'hoa-dang':            'Hoa Đăng',
  'den-trung-thu':       'Đèn Trung Thu',
  'qua-tang':            'Quà Tặng Đèn Lồng',
  'gia-cong-den-trang-tri': 'Gia Công Đèn Trang Trí',
};

function slugToLabel(slug: string): string {
  if (SLUG_LABELS[slug]) return SLUG_LABELS[slug];
  // Generic: replace hyphens, capitalize each word
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  'hoi-an-lantern': {
    title: 'Lồng Đèn Hội An Thủ Công | 500+ Mẫu | Giá Sỉ Lẻ TP.HCM',
    description: 'Lồng đèn Hội An chính gốc — 500+ mẫu thủ công, đúng kỹ thuật làng nghề phố cổ. Giá sỉ tận gốc, giao 2–4 ngày toàn quốc. Hotline 0989.778.247 — Tư vấn 8h-21h.',
  },
  'den-trung-thu': {
    title: 'Đèn Trung Thu 2026 | 300+ Mẫu Thủ Công | Giao Nhanh Toàn Quốc',
    description: 'Đèn Trung Thu 2026 thủ công: 300+ mẫu an toàn cho trẻ. Đèn ông sao, cá chép, kéo quân, lồng nghệ thuật. Giao nhanh toàn quốc. Hotline 0989.778.247 — Tư vấn 8h-21h.',
  },
  'den-long-tet': {
    title: 'Đèn Lồng Tết 2026 | Bán Sỉ Lẻ | Xưởng LongDenViet TP.HCM',
    description: 'Đèn lồng Tết 2026 thủ công — màu đỏ truyền thống, phúc lộc. Trang trí nhà, quán cafe, văn phòng. Bán sỉ lẻ, giao toàn quốc. Hotline 0989.778.247 — Tư vấn 8h-21h.',
  },
  'den-may-tre': {
    title: 'Đèn Mây Tre Thủ Công Việt Nam | Bán Sỉ Toàn Quốc | LongDenViet',
    description: 'Đèn mây tre đan thủ công Việt Nam — rustic tự nhiên, bền đẹp. Nghệ nhân 20+ năm kinh nghiệm. Giao hàng toàn quốc. Hotline 0989.778.247 — Tư vấn miễn phí 8h-21h.',
  },
  'den-kieu-nhat': {
    title: 'Đèn Lồng Kiểu Nhật Bản | Thủ Công Cao Cấp | LongDenViet',
    description: 'Đèn lồng kiểu Nhật Bản thủ công — wabi-sabi, ánh sáng dịu nhẹ, 200+ mẫu. Phù hợp quán trà, nhà hàng Nhật, spa. Hotline 0989.778.247 — Tư vấn miễn phí 8h-21h.',
  },
  'den-tha-tran': {
    title: 'Đèn Thả Trần Trang Trí | 300+ Mẫu | Giá Sỉ Giao Toàn Quốc',
    description: 'Đèn thả trần trang trí: 300+ mẫu cho khách sạn, nhà hàng, tiệc cưới. Giá sỉ, giao 2–4 ngày toàn quốc. Hotline 0989.778.247 — Tư vấn miễn phí 8h-21h.',
  },
  'den-vai-cao-cap': {
    title: 'Đèn Vải Cao Cấp Thủ Công | In Logo | Giá Sỉ | LongDenViet',
    description: 'Đèn vải cao cấp: lụa, organza thủ công, đặt màu riêng, in logo thương hiệu. Phù hợp sự kiện và không gian cao cấp. Giá sỉ. Hotline 0989.778.247 — Tư vấn 8h-21h.',
  },
  'den-san': {
    title: 'Đèn Sàn Thủ Công Trang Trí | Đèn Đứng Nội Thất | LongDenViet',
    description: 'Đèn sàn thủ công: khung sắt rèn + chao vải lụa, đèn sàn kiểu Nhật, đèn sàn mây tre. Từ 220.000đ. Tư vấn bố trí ánh sáng miễn phí. Hotline 0989.778.247 — 8h-21h.',
  },
  'den-ap-tuong': {
    title: 'Đèn Áp Tường Thủ Công | Đèn Treo Tường Trang Trí | LongDenViet',
    description: 'Đèn áp tường thủ công: phong cách Hội An, Nhật Bản, mây tre rustic. Phù hợp khách sạn, homestay, hành lang. Từ 180.000đ. Hotline 0989.778.247 — Tư vấn 8h-21h.',
  },
  'phong-bep': {
    title: 'Đèn Trang Trí Phòng Bếp & Phòng Ăn | Thủ Công | LongDenViet',
    description: 'Đèn thả trần và đèn lồng trang trí phòng bếp, phòng ăn — ấm cúng, gắn kết gia đình. 200+ mẫu, từ 85.000đ. Giao toàn quốc. Hotline 0989.778.247 — Tư vấn 8h-21h.',
  },
  'den-long-go': {
    title: 'Đèn Lồng Gỗ Chạm Khắc | Quà Tặng Cao Cấp | LongDenViet',
    description: 'Đèn lồng gỗ chạm khắc thủ công — quà tặng doanh nghiệp độc đáo, trang trí nội thất premium. Gỗ tự nhiên bền đẹp. Từ 180.000đ. Hotline 0989.778.247.',
  },
  'den-ve-tranh': {
    title: 'Đèn Vẽ Tranh Thủ Công | Đèn Lồng Nghệ Thuật | LongDenViet',
    description: 'Đèn lồng vẽ tranh thủ công — họa tiết dân gian, hoa sen, phong cảnh quê hương. Mỗi chiếc là tác phẩm độc bản. Từ 120.000đ. Hotline 0989.778.247.',
  },
  'phong-khach': {
    title: 'Đèn Trang Trí Phòng Khách Thủ Công | LongDenViet',
    description: 'Đèn lồng phòng khách: đèn thả trần, đèn sàn, đèn áp tường. Phong cách Hội An, Nhật Bản, rustic. Từ 85.000đ. Hotline 0989.778.247 — 8h-21h.',
  },
  'phong-ngu': {
    title: 'Đèn Trang Trí Phòng Ngủ | Ánh Sáng Dịu Nhẹ | LongDenViet',
    description: 'Đèn lồng phòng ngủ: vải lụa, mây tre, kiểu Nhật — ánh sáng dịu nhẹ, ấm áp. Đèn thả đầu giường từ 130.000đ. Hotline 0989.778.247 — Tư vấn 8h-21h.',
  },
  'den-quan-cafe': {
    title: 'Đèn Trang Trí Quán Cafe | 200+ Mẫu | Giá Sỉ | LongDenViet',
    description: 'Đèn quán cafe thủ công: vintage, Hội An, Nhật Bản, boho. 200+ mẫu, giá sỉ cho chuỗi. Tư vấn thiết kế ánh sáng miễn phí. Hotline 0989.778.247 — 8h-21h.',
  },
  'den-nha-hang': {
    title: 'Đèn Trang Trí Nhà Hàng | Gia Công Số Lượng Lớn | LongDenViet',
    description: 'Đèn nhà hàng thủ công: đặt theo bản vẽ, số lượng lớn giá ưu đãi, lắp đặt tại TP.HCM. Chuyên chuỗi F&B và nhà hàng BBQ. Hotline 0989.778.247 — 8h-21h.',
  },
  'den-khach-san': {
    title: 'Đèn Trang Trí Khách Sạn Resort | Gia Công | LongDenViet',
    description: 'Đèn khách sạn, resort 3–5 sao thủ công — tạo không gian nghỉ dưỡng đẳng cấp. Gia công in logo, đồng bộ thương hiệu. Báo giá trong 30 phút. 0989.778.247.',
  },
  'ngoai-troi': {
    title: 'Đèn Trang Trí Ngoài Trời | Ban Công Sân Vườn | LongDenViet',
    description: 'Đèn lồng ngoài trời: ban công, sân vườn, mái hiên — chống ẩm, bền màu. Dây đèn lồng ban công từ 180.000đ. Giao toàn quốc. Hotline 0989.778.247 — 8h-21h.',
  },
  'den-noi-that': {
    title: 'Đèn Trang Trí Nội Thất Cao Cấp | Thủ Công | LongDenViet',
    description: 'Đèn nội thất thủ công cao cấp cho biệt thự, căn hộ premium, showroom. Tư vấn giải pháp ánh sáng trọn gói. Từ 150.000đ. Hotline 0989.778.247 — 8h-21h.',
  },
};

const CAT_OG_IMAGE: Record<string, string> = {
  'hoi-an-lantern':       '/images/menu/danh-muc-hoian-longdenviet.jpg',
  'den-hoi-an':           '/images/menu/danh-muc-hoian-longdenviet.jpg',
  'den-kieu-nhat':        '/images/menu/danh-muc-nhat-longdenviet.jpg',
  'den-long-nhat-ban':    '/images/menu/danh-muc-nhat-longdenviet.jpg',
  'den-nhat-ban':         '/images/menu/danh-muc-nhat-longdenviet.jpg',
  'den-long-go':          '/images/menu/danh-muc-go-longdenviet.jpg',
  'den-vai-cao-cap':      '/images/menu/danh-muc-vai-longdenviet.jpg',
  'chup-den-vai':         '/images/menu/danh-muc-vai-longdenviet.jpg',
  'den-may-tre':          '/images/menu/danh-muc-tre-longdenviet.jpg',
  'den-tre':              '/images/menu/danh-muc-tre-longdenviet.jpg',
  'den-tha-tran':         '/images/menu/danh-muc-tha-tran-longdenviet.jpg',
  'den-quan-cafe':        '/images/menu/danh-muc-cafe-longdenviet.jpg',
  'den-quan-tra-sua':     '/images/menu/danh-muc-cafe-longdenviet.jpg',
  'den-nha-hang':         '/images/menu/danh-muc-nha-hang-longdenviet.jpg',
  'den-sushi-bbq':        '/images/menu/danh-muc-nha-hang-longdenviet.jpg',
  'den-treo-quan-bbq':    '/images/menu/danh-muc-nha-hang-longdenviet.jpg',
  'den-khach-san':        '/images/menu/danh-muc-resort-longdenviet.jpg',
  'den-khach-san-2':      '/images/menu/danh-muc-resort-longdenviet.jpg',
  'den-trung-thu':        '/images/menu/danh-muc-tet-longdenviet.jpg',
  'den-long-tet':         '/images/menu/danh-muc-tet-longdenviet.jpg',
  'long-den-tet':         '/images/menu/danh-muc-tet-longdenviet.jpg',
  'den-ve-tranh':         '/images/menu/danh-muc-ve-tranh-longdenviet.jpg',
  'gia-cong-den-trang-tri': '/images/menu/den-hoi-an-trang-tri-khach-san-longdenviet.webp',
  'phong-khach':          '/images/menu/khong-gian-phong-khach-longdenviet.webp',
  'phong-ngu':            '/images/menu/khong-gian-phong-ngu-longdenviet.webp',
  'phong-bep':            '/images/menu/khong-gian-phong-bep-longdenviet.webp',
  'phong-an':             '/images/menu/danh-muc-dining-longdenviet.jpg',
  'ngoai-troi':           '/images/menu/danh-muc-ngoai-troi-longdenviet.jpg',
  'den-ngoai-troi':       '/images/menu/danh-muc-ngoai-troi-longdenviet.jpg',
  'den-noi-that':         '/images/menu/khong-gian-resort-longdenviet.webp',
  'den-ap-tuong':         '/images/menu/den-hoi-an-trang-tri-quan-cafe-longdenviet.webp',
  'den-long-trang-tri':   '/images/menu/danh-muc-hoian-longdenviet.jpg',
};

const BASE_URL = 'https://longdenviet.com';

function isLegacyCrownTrungThuSlug(slug: string): boolean {
  if (slug.toLowerCase() === 'den-trung-thu') return false;
  if (!slug.toLowerCase().endsWith('-trung-thu')) return false;
  if (/%f0%9f%91%91/i.test(slug)) return true;
  try {
    return decodeURIComponent(slug).codePointAt(0) === 0x1f451;
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (isLegacyCrownTrungThuSlug(slug)) {
    permanentRedirect('/c/den-trung-thu');
  }
  const normalizedSlug = slug.toLowerCase();
  const cat = categories.find(c => c.id === normalizedSlug);
  const label = cat?.label ?? slugToLabel(normalizedSlug);
  const custom = CATEGORY_META[normalizedSlug];
  const rawCat = rawCategories.find(c => c.slug === normalizedSlug);
  const title = custom?.title ?? `${label} — Đèn Thủ Công Việt Nam | LongDenViet`;
  const description = custom?.description ?? (rawCat as { meta_description?: string })?.meta_description ?? `Khám phá bộ sưu tập ${label} thủ công truyền thống Việt Nam. Được làm bởi nghệ nhân lành nghề, giao hàng toàn quốc. Hotline 0989.778.247 — Tư vấn miễn phí 8h-21h.`;
  const ogImg = CAT_OG_IMAGE[normalizedSlug] ?? '/images/menu/danh-muc-hoian-longdenviet.jpg';
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/c/${normalizedSlug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'vi_VN',
      images: [{
        url: `${BASE_URL}${ogImg}`,
        width: 1200,
        height: 800,
        alt: `${label} — Đèn Lồng Thủ Công LongDenViet`,
      }],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const [{ slug }, products] = await Promise.all([params, getCatalogProducts()]);
  if (isLegacyCrownTrungThuSlug(slug)) {
    permanentRedirect('/c/den-trung-thu');
  }
  const normalizedSlug = slug.toLowerCase();

  // Find by exact id match OR raw slug (categories may come from rawCategories only)
  const cat = categories.find(c => c.id === normalizedSlug)
    ?? (rawCategories.find(c => c.slug === normalizedSlug)
      ? { id: normalizedSlug, label: rawCategories.find(c => c.slug === normalizedSlug)!.name, emoji: '🏮' }
      : null);

  // Expand slug via alias map so nav slugs (den-kieu-nhat) match WP slugs (den-nhat-ban)
  const aliases = SLUG_ALIAS_MAP[normalizedSlug] ?? [];
  const slugsToMatch = [normalizedSlug, ...aliases];
  const catProducts = products.filter(p =>
    p.stock !== 0 && (
      slugsToMatch.some(s => p.tags.includes(s)) ||
      slugsToMatch.some(s => p.category === s)
    )
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://longdenviet.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sản phẩm',
        item: 'https://longdenviet.com/san-pham',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cat?.label ?? slug,
        item: `https://longdenviet.com/c/${slug}`,
      },
    ],
  };

  const collectionPageLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://longdenviet.com/c/${slug}`,
    name: `${cat?.label ?? slugToLabel(slug)} — Đèn Thủ Công Việt Nam | LongDenViet`,
    description: `Khám phá bộ sưu tập ${cat?.label ?? slugToLabel(slug)} thủ công truyền thống Việt Nam. Được làm bởi nghệ nhân lành nghề, giao hàng toàn quốc.`,
    url: `https://longdenviet.com/c/${slug}`,
    numberOfItems: catProducts.length,
    isPartOf: { '@type': 'WebSite', '@id': 'https://longdenviet.com' },
    ...(normalizedSlug === 'den-trung-thu' ? {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'VND',
        lowPrice: 35000,
        highPrice: 250000,
        offerCount: 300,
        seller: { '@type': 'Organization', name: 'LongDenViet' },
      },
    } : {}),
  };

  // FAQPage schema — per-category questions for rich snippet
  const FAQ_DATA: Record<string, { q: string; a: string }[]> = {
    'den-trung-thu': [
      { q: 'Lồng đèn trung thu thủ công LongDenViet có những mẫu nào?', a: 'LongDenViet có 300+ mẫu lồng đèn Trung Thu thủ công gồm: đèn ông sao, đèn cá chép, đèn bướm, đèn kéo quân, đèn con thỏ, đèn hoa sen và đèn lồng Hội An truyền thống. Tất cả làm tay bằng chất liệu an toàn cho trẻ em.' },
      { q: 'Giá lồng đèn trung thu thủ công bao nhiêu?', a: 'Giá lồng đèn Trung Thu thủ công từ 35.000đ–250.000đ/chiếc tùy mẫu và chất liệu. Bán sỉ số lượng lớn (từ 50 chiếc) giảm 20–40%. Liên hệ 0989.778.247 để báo giá sỉ.' },
      { q: 'LongDenViet có giao lồng đèn trung thu toàn quốc không?', a: 'Có. LongDenViet giao hàng toàn quốc qua các đối tác vận chuyển. Nội thành TP.HCM giao trong ngày (trước 10h sáng). Tỉnh thành khác 2–5 ngày làm việc.' },
      { q: 'Mua sỉ lồng đèn trung thu số lượng lớn ở đâu?', a: 'LongDenViet nhận đơn sỉ lồng đèn Trung Thu từ 50 chiếc trở lên. Hỗ trợ in logo thương hiệu, đóng gói theo yêu cầu. Gọi ngay 0989.778.247 hoặc nhắn Zalo để được báo giá.' },
      { q: 'Lồng đèn trung thu LongDenViet có an toàn cho trẻ em không?', a: 'Tất cả lồng đèn Trung Thu của LongDenViet dùng chất liệu an toàn: tre mây tự nhiên, vải không độc hại, sơn nước thân thiện môi trường. Phù hợp trẻ em từ 3 tuổi trở lên khi có người lớn giám sát.' },
    ],
    'hoi-an-lantern': [
      { q: 'Đèn lồng Hội An LongDenViet được làm từ chất liệu gì?', a: 'Đèn lồng Hội An tại LongDenViet được làm từ khung tre/sắt thủ công kết hợp vải lụa, vải bố hoặc vải tơ tằm. Mỗi chiếc đèn do nghệ nhân làng nghề Hội An làm tay, đảm bảo đúng kỹ thuật truyền thống.' },
      { q: 'Mua đèn lồng Hội An ở đâu uy tín tại TP.HCM?', a: 'LongDenViet là xưởng sản xuất đèn lồng Hội An lớn tại TP.HCM với 500+ mẫu. Địa chỉ: 262/1/93 Phan Anh, P.Phú Thạnh, Q.Tân Phú. Hotline 0989.778.247 — giao hàng miễn phí nội thành từ 500k.' },
      { q: 'Đèn lồng Hội An có bao nhiêu màu sắc?', a: 'LongDenViet có hơn 20 màu sắc đèn lồng Hội An: đỏ, vàng, xanh lá, tím, hồng, cam, trắng ngà, xanh dương và các màu phối. Có thể đặt màu theo yêu cầu cho đơn sỉ từ 20 chiếc.' },
      { q: 'Đèn lồng Hội An dùng trong nhà hàng, quán cafe được không?', a: 'Hoàn toàn phù hợp. LongDenViet cung cấp đèn lồng Hội An cho hàng trăm quán cafe, nhà hàng, resort trên cả nước. Tư vấn miễn phí bố cục, chọn mẫu phù hợp không gian.' },
      { q: 'Đèn lồng Hội An có bền không, bảo quản thế nào?', a: 'Đèn lồng Hội An chất liệu tốt dùng được 2–5 năm nếu bảo quản đúng cách. Tránh để ngoài mưa trực tiếp, lau bằng khăn khô khi bụi. Vải có thể thay thế khi cần — LongDenViet hỗ trợ thay vải theo yêu cầu.' },
    ],
    'den-long-tet': [
      { q: 'Đèn lồng Tết có những mẫu phổ biến nào?', a: 'Các mẫu đèn lồng Tết phổ biến tại LongDenViet gồm: đèn lồng đỏ truyền thống, đèn lồng hoa đào, đèn lồng cành mai, đèn cá chép, đèn lồng 12 con giáp và đèn lồng Hội An phong cách Tết. Hơn 200 mẫu để chọn.' },
      { q: 'Mua sỉ đèn lồng Tết giá tốt ở đâu?', a: 'LongDenViet nhận đơn sỉ đèn lồng Tết từ 100 chiếc trở lên với giá ưu đãi 20–40%. Hỗ trợ in logo, đóng gói quà tặng doanh nghiệp. Hotline 0989.778.247 — đặt hàng sớm trước Tết 30–45 ngày.' },
      { q: 'Đèn lồng Tết thích hợp trang trí không gian nào?', a: 'Đèn lồng Tết phù hợp trang trí: nhà ở, quán cafe, nhà hàng, khách sạn, văn phòng, trung tâm thương mại và không gian sự kiện. Màu đỏ-vàng truyền thống mang lại không khí Tết ấm áp, tài lộc.' },
      { q: 'Đặt hàng đèn lồng Tết cần bao lâu để nhận?', a: 'Đơn lẻ: 2–3 ngày (nội thành TP.HCM) hoặc 3–7 ngày (tỉnh thành). Đơn sỉ số lượng lớn: cần đặt trước 2–4 tuần. Khuyến nghị đặt trước Tết Nguyên Đán ít nhất 30 ngày để đảm bảo đủ hàng.' },
    ],
    'den-may-tre': [
      { q: 'Đèn mây tre đan LongDenViet được làm từ nguyên liệu gì?', a: 'Đèn mây tre đan LongDenViet dùng tre già tự nhiên từ làng nghề miền Trung, mây sợi chọn lọc và sơn/dầu bảo vệ bề mặt thân thiện môi trường. Mỗi chiếc đan thủ công 100% bởi nghệ nhân 20+ năm kinh nghiệm.' },
      { q: 'Đèn tre mây phù hợp với phong cách nội thất nào?', a: 'Đèn tre mây phù hợp phong cách: rustic, boho, Indochine, Wabi-sabi, tropical và hiện đại tối giản. Đặc biệt được ưa chuộng tại quán cafe, nhà hàng hải sản, resort và không gian thư giãn.' },
      { q: 'Đèn mây tre có bền không, dùng được bao lâu?', a: 'Đèn mây tre chất lượng cao của LongDenViet bền 3–7 năm nếu để trong nhà tránh ẩm. Có thể dùng ngoài trời mái che. Phun một lớp sơn bảo vệ mỗi năm để kéo dài tuổi thọ.' },
      { q: 'Giá đèn mây tre đan bao nhiêu?', a: 'Giá đèn mây tre tại LongDenViet từ 150.000đ–1.500.000đ tùy kích thước và độ phức tạp. Giảm giá sỉ từ 10 chiếc. Liên hệ 0989.778.247 để được báo giá chi tiết.' },
    ],
    'den-kieu-nhat': [
      { q: 'Đèn lồng kiểu Nhật Bản LongDenViet khác gì đèn Hội An?', a: 'Đèn kiểu Nhật (Chochin) có đặc trưng: hình ống, khung tre mềm, giấy washi hoặc vải trắng mỏng, ánh sáng khuếch tán đều. Đèn Hội An có hình cầu/bầu dục, vải màu sắc rực rỡ hơn. Cả hai đều thủ công 100%.' },
      { q: 'Đèn kiểu Nhật phù hợp không gian trang trí nào?', a: 'Đèn kiểu Nhật phù hợp: quán trà, onsen, nhà hàng Nhật, spa, phòng thiền định, không gian zen và nội thất tối giản. Tạo ánh sáng dịu nhẹ, ấm áp, rất được ưa chuộng trong decor tối giản hiện đại.' },
      { q: 'LongDenViet có bao nhiêu mẫu đèn kiểu Nhật?', a: 'LongDenViet có 200+ mẫu đèn kiểu Nhật từ cỡ nhỏ (đường kính 15cm) đến cỡ lớn (60cm), bao gồm: đèn Chochin treo, đèn Bonbori để bàn, đèn Andon vuông và đèn lồng Nhật treo cửa.' },
    ],
    'gia-cong-den-trang-tri': [
      { q: 'LongDenViet nhận gia công đèn trang trí theo yêu cầu không?', a: 'Có. LongDenViet nhận gia công đèn lồng trang trí hoàn toàn theo yêu cầu: kích thước, màu sắc, chất liệu, hình dạng, in logo thương hiệu. Phù hợp cho khách sạn, resort, sự kiện, quà tặng doanh nghiệp. Đặt hàng tối thiểu 20 chiếc.' },
      { q: 'Thời gian gia công đèn trang trí theo yêu cầu là bao lâu?', a: 'Thời gian gia công 7–21 ngày tùy độ phức tạp và số lượng. Đơn đơn giản 20–50 chiếc: 7–10 ngày. Đơn phức tạp 100+ chiếc: 15–21 ngày. Cần đặt cọc 30–50% để khởi công.' },
      { q: 'Chi phí gia công đèn lồng theo yêu cầu như thế nào?', a: 'Chi phí gia công phụ thuộc vào chất liệu, kích thước và số lượng. Thông thường từ 200.000đ–2.000.000đ/chiếc. Số lượng càng nhiều giá đơn vị càng thấp. Liên hệ 0989.778.247 để được báo giá cụ thể.' },
      { q: 'LongDenViet có thiết kế đèn theo bản vẽ không?', a: 'Có. Đội ngũ LongDenViet sẽ tư vấn, phác thảo thiết kế và làm mẫu thử trước khi sản xuất hàng loạt. Phí thiết kế miễn phí cho đơn từ 50 chiếc trở lên.' },
    ],
  };
  const catContent = CATEGORY_CONTENT[normalizedSlug];
  const faqData = catContent?.faq ?? FAQ_DATA[normalizedSlug];
  const faqSchema = faqData ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null;

  const itemListSchema = catProducts.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': cat?.label ?? slugToLabel(slug),
    'description': `Bộ sưu tập ${cat?.label ?? slugToLabel(slug)} thủ công truyền thống Việt Nam`,
    'numberOfItems': catProducts.length,
    'itemListElement': catProducts.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'url': `https://longdenviet.com/p/${p.slug}`,
      'name': p.name,
      'image': p.image.startsWith('/') ? `https://longdenviet.com${p.image}` : p.image,
    })),
  } : null;

  const catLabel = cat?.label ?? slugToLabel(slug);
  const heroImg  = CAT_OG_IMAGE[normalizedSlug] ?? '/images/menu/danh-muc-hoian-longdenviet.jpg';

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\/script>/gi, '<\\/script>') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd).replace(/<\/script>/gi, '<\\/script>') }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema).replace(/<\/script>/gi, '<\\/script>') }} />}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/<\/script>/gi, '<\\/script>') }} />}

      {/* ── Category Hero — cream background, elegant ── */}
      <div className="w-full border-b border-[#E8DCC9]" style={{ background: '#FAF7F2' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-7 md:pt-7 md:pb-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-3 text-[11px] font-medium" style={{ color: '#9a8878' }}>
            <Link href="/" className="hover:text-brand-green transition-colors">Trang chủ</Link>
            <span style={{ color: '#c0b4a8' }}>/</span>
            <Link href="/san-pham" className="hover:text-brand-green transition-colors">Sản phẩm</Link>
            <span style={{ color: '#c0b4a8' }}>/</span>
            <span style={{ color: '#5a4e42' }}>{catLabel}</span>
          </nav>

          {/* Title + meta row */}
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <h1
                className="font-bold leading-[1.0] text-brand-green"
                style={{ fontSize: 'clamp(1.5rem, 3.8vw, 2.4rem)', letterSpacing: '-0.035em' }}
              >
                {catLabel}
              </h1>
              {catContent?.intro[0] && (
                <p className="mt-2 line-clamp-1 max-w-lg" style={{ color: '#7a6a58', fontSize: '13px', lineHeight: '1.5' }}>
                  {catContent.intro[0]}
                </p>
              )}
            </div>

            {/* Right: count + đặt sỉ */}
            <div className="flex items-center gap-2 shrink-0">
              {catProducts.length > 0 && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold"
                  style={{ background: '#F5F0EA', color: '#5a4e42', border: '1px solid #E0D4C8' }}
                >
                  {catProducts.length} mẫu
                </span>
              )}
              <a
                href="/lien-he"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] transition-all hover:bg-brand-green hover:text-white"
                style={{ background: 'transparent', border: '1.5px solid #104e2e', color: '#104e2e' }}
              >
                Đặt sỉ →
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">

        {/* ── Category pills ── */}
        {(() => {
          const catCounts = Object.fromEntries(
            categories.map(c => [c.id, products.filter(p => p.category === c.id).length])
          );
          const sorted = categories
            .map(c => ({ ...c, count: catCounts[c.id] ?? 0 }))
            .filter(c => c.count > 0)
            .sort((a, b) => b.count - a.count);
          return (
            <div className="pt-5 mb-8 -mx-4 md:-mx-0">
              <div className="flex gap-3 overflow-x-auto px-4 md:px-0 pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <Link href="/san-pham" className="shrink-0 flex flex-col items-center gap-1.5 group">
                  <div className="w-[64px] h-[64px] rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-200" style={{ background: '#f0ece5', border: '1.5px solid #e8e0d4' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                    </svg>
                  </div>
                  <span className="text-[10.5px] font-semibold text-[#777] group-hover:text-[#1a6b3c] transition-colors">Tất cả</span>
                </Link>
                {sorted.map(c => {
                  const active = c.id === normalizedSlug;
                  const label = stripEmoji(c.label);
                  return (
                    <Link key={c.id} href={`/c/${c.id}`} className="shrink-0 flex flex-col items-center gap-1.5 group">
                      <div className={[
                        'relative w-[64px] h-[64px] rounded-2xl overflow-hidden transition-all duration-200',
                        active
                          ? 'shadow-[0_0_0_2.5px_#1a6b3c,0_0_0_5px_rgba(16,78,46,0.12)]'
                          : 'opacity-80 group-hover:opacity-100',
                      ].join(' ')}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getCatImg(c.id)} alt={label} loading="lazy" decoding="async"
                          className={`w-full h-full object-cover transition-transform duration-300 ${!active && 'group-hover:scale-105'}`} />
                        {active && <div className="absolute inset-0" style={{ background: 'rgba(16,78,46,0.08)' }} />}
                      </div>
                      <span className={`text-[10.5px] font-semibold leading-tight text-center line-clamp-2 w-[68px] transition-colors ${active ? 'text-[#1a6b3c]' : 'text-[#777] group-hover:text-[#1a6b3c]'}`}>
                        {label}
                      </span>
                    </Link>
                  );
                })}
                <span className="shrink-0 w-4" />
              </div>
            </div>
          );
        })()}

        {/* ── Editorial intro block (paragraphs 2+) ── */}
        {catContent && catContent.intro.length > 1 && (
          <div
            className="mb-10 rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #f9f6f0 0%, #f4efe6 100%)', border: '1px solid #ede5d8' }}
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: paragraphs */}
              <div className="px-6 py-7 md:px-8 md:py-8 space-y-4" style={{ borderRight: '1px solid #ede5d8' }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#c9822a' }}>
                  Về danh mục này
                </p>
                {catContent.intro.slice(1, 3).map((p, i) => (
                  <p key={i} className="text-[13.5px] text-[#444] leading-[1.8]">{p}</p>
                ))}
              </div>
              {/* Right: paragraphs 4+ or related posts */}
              <div className="px-6 py-7 md:px-8 md:py-8">
                {catContent.intro.length > 3
                  ? <div className="space-y-4">
                      {catContent.intro.slice(3).map((p, i) => (
                        <p key={i} className="text-[13.5px] text-[#444] leading-[1.8]">{p}</p>
                      ))}
                    </div>
                  : catContent.relatedPosts && catContent.relatedPosts.length > 0
                    ? <>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#c9822a' }}>Bài viết liên quan</p>
                        <ul className="space-y-3">
                          {catContent.relatedPosts.map(post => (
                            <li key={post.href}>
                              <Link href={post.href} className="flex items-start gap-2.5 group">
                                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#c9822a' }} />
                                <span className="text-[13px] text-[#333] font-medium group-hover:text-[#1a6b3c] transition-colors leading-snug">{post.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    : <div className="h-full flex flex-col justify-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(16,78,46,0.1)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                          <div><p className="text-[12px] font-bold text-[#1a1a1a]">Nghệ nhân thủ công</p><p className="text-[11px] text-[#888]">20+ năm kinh nghiệm</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(16,78,46,0.1)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                          </div>
                          <div><p className="text-[12px] font-bold text-[#1a1a1a]">Giao toàn quốc</p><p className="text-[11px] text-[#888]">2–4 ngày làm việc</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(16,78,46,0.1)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                          </div>
                          <div><p className="text-[12px] font-bold text-[#1a1a1a]">100% thủ công</p><p className="text-[11px] text-[#888]">Không hàng công nghiệp</p></div>
                        </div>
                      </div>
                }
              </div>
            </div>
          </div>
        )}

        {/* Product grid with sort + pagination */}
        <Suspense fallback={
          <div className="flex items-center justify-center py-20 text-[#888] text-sm">
            Đang tải sản phẩm...
          </div>
        }>
          <CategoryProductGrid
            products={catProducts}
            defaultSort={normalizedSlug === 'den-long-go' ? 'newest' : 'default'}
            categorySlug={normalizedSlug}
          />
        </Suspense>

        {/* ── FAQ section ── */}
        {catContent?.faq && catContent.faq.length > 0 && (
          <section className="mt-16 mb-4">
            <div className="flex items-end gap-4 mb-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: '#c9822a' }}>Giải đáp thắc mắc</p>
                <h2 className="text-[1.625rem] font-bold text-[#1a1a1a]" style={{ letterSpacing: '-0.028em' }}>
                  Câu hỏi thường gặp
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {catContent.faq.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-xl overflow-hidden transition-all duration-200"
                  style={{ background: '#fff', border: '1px solid #ede5d8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  <summary
                    className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none"
                    style={{ userSelect: 'none' }}
                  >
                    <span className="font-semibold text-[#1a1a1a] text-[13.5px] leading-snug">{item.q}</span>
                    <span
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-200"
                      style={{ background: '#f0ece5' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6,9 12,15 18,9"/>
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-[13px] text-[#4a4a4a] leading-[1.85]" style={{ borderTop: '1px solid #f0ece5' }}>
                    <div className="pt-3">{item.a}</div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── Bottom CTA ── */}
        <div
          className="mt-12 rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(110deg, #0a3320 0%, #104e2e 60%, #1a6b3c 100%)' }}
        >
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5 px-7 py-7 md:py-6">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color: '#e8a84a' }}>LongDenViet®</p>
              <p className="text-white font-bold text-[17px]" style={{ letterSpacing: '-0.02em' }}>
                Xưởng đèn lồng thủ công · 800+ mẫu
              </p>
              <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Tư vấn miễn phí · Giao toàn quốc · Nhận sỉ từ 20 chiếc
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="tel:0989778247"
                className="inline-flex items-center gap-2 font-bold text-[#0a3320] rounded-full transition-all active:scale-[0.97]"
                style={{ background: '#fff', fontSize: '12.5px', padding: '10px 22px', boxShadow: '0 2px 16px rgba(0,0,0,0.25)' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                Gọi ngay
              </a>
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 font-semibold rounded-full transition-all active:scale-[0.97]"
                style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)', fontSize: '12.5px', padding: '9px 20px' }}
              >
                Tất cả sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
