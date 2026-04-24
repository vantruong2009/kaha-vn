'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  'Tất cả',
  'Đặt hàng & Thanh toán',
  'Vận chuyển & Giao hàng',
  'Đổi trả & Bảo hành',
  'Sản phẩm',
  'Đặt sỉ & Doanh nghiệp',
];

const FAQS = [
  // Đặt hàng & Thanh toán
  {
    cat: 'Đặt hàng & Thanh toán',
    q: 'Tôi có thể đặt hàng bằng những cách nào?',
    a: 'Bạn có thể đặt hàng trực tiếp trên website, qua Zalo OA, Messenger hoặc gọi hotline 0989.778.247. Đội ngũ tư vấn hỗ trợ từ 8:00–21:00 mỗi ngày kể cả cuối tuần.',
  },
  {
    cat: 'Đặt hàng & Thanh toán',
    q: 'Các phương thức thanh toán được chấp nhận?',
    a: 'Chúng tôi chấp nhận: chuyển khoản ngân hàng, thanh toán MoMo, VNPAY, và thanh toán khi nhận hàng (COD) cho đơn trong TP.HCM. Thẻ ATM nội địa và thẻ quốc tế (Visa/Mastercard) cũng được hỗ trợ qua cổng VNPAY.',
  },
  {
    cat: 'Đặt hàng & Thanh toán',
    q: 'Đơn hàng của tôi có thể bị hủy hoặc thay đổi không?',
    a: 'Bạn có thể hủy hoặc thay đổi đơn hàng trong vòng 2 giờ sau khi đặt, miễn là đơn chưa được đóng gói. Vui lòng liên hệ hotline 0989.778.247 càng sớm càng tốt. Đơn hàng đặt theo yêu cầu (custom) không thể hủy sau khi xác nhận sản xuất.',
  },
  {
    cat: 'Đặt hàng & Thanh toán',
    q: 'Tôi có nhận được xác nhận đơn hàng không?',
    a: 'Có. Ngay sau khi đặt hàng thành công, hệ thống sẽ gửi email xác nhận kèm mã đơn hàng đến địa chỉ email bạn đã cung cấp. Nếu không thấy, hãy kiểm tra thư mục spam hoặc liên hệ chúng tôi.',
  },

  // Vận chuyển & Giao hàng
  {
    cat: 'Vận chuyển & Giao hàng',
    q: 'Thời gian giao hàng là bao lâu?',
    a: 'Với đơn hàng có sẵn: 1–2 ngày với TP.HCM, 2–4 ngày với các tỉnh thành khác. Với đèn làm theo yêu cầu (custom): 7–14 ngày tùy độ phức tạp. Thời gian có thể kéo dài vào dịp Tết Nguyên Đán.',
  },
  {
    cat: 'Vận chuyển & Giao hàng',
    q: 'Phí vận chuyển được tính như thế nào?',
    a: 'Miễn phí vận chuyển cho đơn từ 500.000đ toàn quốc. Đơn dưới 500.000đ: phí ship theo biểu giá đơn vị vận chuyển (thường 25.000–45.000đ tùy khu vực). Đơn sỉ lớn (từ 50 chiếc) được miễn phí ship toàn quốc không điều kiện.',
  },
  {
    cat: 'Vận chuyển & Giao hàng',
    q: 'Làm sao để theo dõi đơn hàng?',
    a: 'Sau khi đơn được giao cho đơn vị vận chuyển, chúng tôi sẽ gửi mã vận đơn qua Zalo/SMS. Bạn cũng có thể tra cứu tại trang Theo dõi đơn hàng trên website, hoặc đăng nhập tài khoản để xem trạng thái realtime.',
  },
  {
    cat: 'Vận chuyển & Giao hàng',
    q: 'Đèn lồng có dễ vỡ khi vận chuyển không?',
    a: 'Chúng tôi đóng gói mỗi chiếc đèn trong túi nilon riêng, bọc xốp và đặt trong hộp carton cứng với lớp đệm bảo vệ. Tỉ lệ hàng hư hỏng do vận chuyển dưới 0.5%. Nếu nhận hàng bị hỏng, vui lòng quay video unboxing và liên hệ ngay để được xử lý.',
  },

  // Đổi trả & Bảo hành
  {
    cat: 'Đổi trả & Bảo hành',
    q: 'Chính sách đổi trả như thế nào?',
    a: 'Chúng tôi chấp nhận đổi/trả trong 7 ngày kể từ ngày nhận hàng nếu: sản phẩm bị lỗi sản xuất, hàng không đúng mô tả, hoặc hàng bị hỏng do vận chuyển. Sản phẩm cần còn nguyên trạng, chưa qua sử dụng và còn đủ bao bì.',
  },
  {
    cat: 'Đổi trả & Bảo hành',
    q: 'Trường hợp nào KHÔNG được đổi trả?',
    a: 'Không áp dụng đổi trả trong các trường hợp: sản phẩm đặt theo yêu cầu riêng (custom), đèn đã được lắp đặt hoặc có dấu hiệu sử dụng, hàng bị hỏng do không bảo quản đúng cách (để ngoài mưa, tiếp xúc nước lâu dài), hoặc quá 7 ngày kể từ ngày nhận.',
  },
  {
    cat: 'Đổi trả & Bảo hành',
    q: 'Quy trình đổi trả như thế nào?',
    a: 'Bước 1: Liên hệ hotline hoặc Zalo trong vòng 7 ngày, mô tả lý do và gửi ảnh/video sản phẩm.\nBước 2: Đội ngũ xem xét và phản hồi trong 2 giờ.\nBước 3: Gửi hàng về địa chỉ kho (chúng tôi hỗ trợ phí ship chiều về nếu lỗi từ phía chúng tôi).\nBước 4: Nhận hàng đổi hoặc hoàn tiền trong 3–5 ngày làm việc.',
  },
  {
    cat: 'Đổi trả & Bảo hành',
    q: 'Đèn lồng có bảo hành không?',
    a: 'Tất cả sản phẩm được bảo hành 3 tháng đối với lỗi sản xuất (khung bị gãy, vải bị bung đường may, dây điện lỗi nếu có). Không bảo hành các hư hỏng do tác động ngoại lực, sử dụng sai cách hoặc để ngoài trời trong thời gian dài.',
  },

  // Sản phẩm
  {
    cat: 'Sản phẩm',
    q: 'Đèn lồng của LongDenViet được làm từ chất liệu gì?',
    a: 'Chúng tôi sử dụng các chất liệu truyền thống: tre già tự nhiên, mây rừng, vải lụa tơ tằm, vải cotton, giấy dó và giấy điệp. Tất cả khung đèn được đan/uốn thủ công, không dùng keo công nghiệp hoặc vật liệu tổng hợp có hại.',
  },
  {
    cat: 'Sản phẩm',
    q: 'Đèn có dùng được ngoài trời không?',
    a: 'Phần lớn đèn lồng được thiết kế cho trang trí trong nhà. Một số dòng đèn tre và đèn giấy có thể dùng ngoài hiên có mái che, nhưng không nên để tiếp xúc trực tiếp với mưa hoặc độ ẩm cao trong thời gian dài. Chúng tôi có dòng đèn outdoor theo yêu cầu với lớp phủ chống thấm.',
  },
  {
    cat: 'Sản phẩm',
    q: 'Đèn có kèm bóng đèn không? Dùng bóng loại nào?',
    a: 'Đèn có kèm dây điện và đui đèn, nhưng không kèm bóng. Chúng tôi khuyến nghị dùng bóng LED Edison 4W–6W, ánh sáng vàng ấm (2700K), đuôi E27. Tránh dùng bóng có công suất lớn hơn 10W hoặc bóng tỏa nhiều nhiệt để bảo vệ vải và tre.',
  },
  {
    cat: 'Sản phẩm',
    q: 'Tôi không tìm thấy sản phẩm mình muốn, có thể đặt theo yêu cầu không?',
    a: 'Hoàn toàn có thể. LongDenViet nhận thiết kế và sản xuất đèn theo yêu cầu: kích thước, màu sắc, hình dạng, in logo thương hiệu. Thời gian sản xuất từ 7–21 ngày tùy số lượng và độ phức tạp. Liên hệ sales@longdenviet.com hoặc Zalo để được tư vấn miễn phí.',
  },
  {
    cat: 'Sản phẩm',
    q: 'Màu sắc sản phẩm thực tế có giống ảnh không?',
    a: 'Chúng tôi cố gắng chụp ảnh trong điều kiện ánh sáng tự nhiên để phản ánh đúng nhất màu sắc thực tế. Tuy nhiên, do đèn được làm thủ công nên có thể có sự khác biệt nhỏ về màu sắc và kích thước (±5%) giữa các lô hàng — đây là đặc điểm của sản phẩm handmade, không phải lỗi sản phẩm.',
  },

  // Đặt sỉ & Doanh nghiệp
  {
    cat: 'Đặt sỉ & Doanh nghiệp',
    q: 'Điều kiện để được giá sỉ?',
    a: 'Giá sỉ áp dụng từ 10 chiếc cùng loại trở lên. Chiết khấu tăng theo số lượng: 10–29 chiếc (5%), 30–99 chiếc (10%), 100+ chiếc (15–20%). Liên hệ để nhận bảng giá sỉ chi tiết và chính sách dành riêng cho đại lý.',
  },
  {
    cat: 'Đặt sỉ & Doanh nghiệp',
    q: 'Có thể in logo thương hiệu lên đèn không?',
    a: 'Có. Chúng tôi nhận in/thêu logo, tên thương hiệu lên đèn vải và một số dòng đèn giấy. Đơn tối thiểu là 20 chiếc cho in logo. Phí thiết kế miễn phí khi đặt từ 50 chiếc. Thời gian sản xuất thêm 3–5 ngày so với đơn thường.',
  },
  {
    cat: 'Đặt sỉ & Doanh nghiệp',
    q: 'LongDenViet có tư vấn trang trí không gian không?',
    a: 'Có. Đội ngũ của chúng tôi có kinh nghiệm tư vấn trang trí cho quán cà phê, nhà hàng, resort, sự kiện và showroom. Dịch vụ tư vấn miễn phí khi đặt hàng. Chúng tôi có thể tư vấn qua ảnh/video không gian, hoặc đến trực tiếp tại TP.HCM.',
  },
  {
    cat: 'Đặt sỉ & Doanh nghiệp',
    q: 'Có hỗ trợ xuất hóa đơn VAT không?',
    a: 'Có. Chúng tôi xuất hóa đơn VAT đầy đủ theo yêu cầu cho các đơn hàng doanh nghiệp. Vui lòng cung cấp thông tin công ty (tên, MST, địa chỉ) khi đặt hàng hoặc trong vòng 24 giờ sau khi thanh toán.',
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #EDE5D8' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-6 py-5 text-left"
      >
        <span className="text-[13px] font-semibold leading-snug" style={{ color: open ? '#104e2e' : '#1a1a1a' }}>
          {q}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0907a" strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, marginTop: 2, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="pb-6 pr-10">
          <p className="text-[13px] leading-[1.8] whitespace-pre-line" style={{ color: '#6a5840' }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HoTroClient() {
  const [activecat, setActiveCat] = useState('Tất cả');
  const [search, setSearch] = useState('');

  const filtered = FAQS.filter(faq => {
    const matchCat = activecat === 'Tất cả' || faq.cat === activecat;
    const matchSearch = !search || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = CATEGORIES.slice(1).reduce<Record<string, typeof FAQS>>((acc, cat) => {
    const items = filtered.filter(f => f.cat === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-3" style={{ color: '#c9822a' }}>Hỗ trợ</p>
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] leading-tight mb-8" style={{ letterSpacing: '-0.03em' }}>
            Tìm câu trả lời<br/>cho thắc mắc của bạn.
          </h1>

          {/* Search */}
          <div className="relative max-w-lg">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0907a" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)', border: '1px solid #E8DDD0', borderRadius: '12px', outline: 'none', width: '100%', paddingLeft: '38px', paddingRight: '14px', paddingTop: '11px', paddingBottom: '11px', fontSize: '13px', color: '#1a1a1a' }}
              onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
              onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16">

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCat(cat); setSearch(''); }}
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-150"
              style={{
                borderRadius: '10px',
                background: activecat === cat ? 'linear-gradient(to bottom, #1a6b3c, #104e2e)' : 'rgba(0,0,0,0.04)',
                color: activecat === cat ? '#fff' : '#6a5840',
                boxShadow: activecat === cat ? '0 2px 8px rgba(16,78,46,.25)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        {search && filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#888] text-sm">Không tìm thấy kết quả cho &ldquo;{search}&rdquo;</p>
            <button onClick={() => setSearch('')} className="mt-4 text-sm text-brand-green underline">Xóa tìm kiếm</button>
          </div>
        ) : activecat === 'Tất cả' && !search ? (
          /* Grouped by category */
          <div className="space-y-14">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-6" style={{ color: '#c9822a' }}>{cat}</p>
                <div>
                  {items.map(faq => <AccordionItem key={faq.q} q={faq.q} a={faq.a} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Flat list for search/filter */
          <div>
            {activecat !== 'Tất cả' && (
              <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-6" style={{ color: '#c9822a' }}>{activecat}</p>
            )}
            {filtered.map(faq => <AccordionItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        )}

        {/* Still need help */}
        <div className="mt-20 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8" style={{ borderTop: '1px solid #EDE5D8' }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-4" style={{ color: '#c9822a' }}>Vẫn cần hỗ trợ?</p>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-2">Liên hệ trực tiếp</h2>
            <p className="text-sm text-[#888]">Đội ngũ tư vấn sẵn sàng 8:00–21:00 mỗi ngày.</p>
          </div>
          <div className="space-y-3">
            <a href="tel:+84905151701" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors" style={{ border: '1px solid #E8DDD0' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a] group-hover:text-brand-green transition-colors">0989.778.247</p>
                <p className="text-xs text-[#888]">Gọi ngay</p>
              </div>
            </a>
            <a href="mailto:sales@longdenviet.com" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors" style={{ border: '1px solid #E8DDD0' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a] group-hover:text-brand-green transition-colors">sales@longdenviet.com</p>
                <p className="text-xs text-[#888]">Email</p>
              </div>
            </a>
          </div>
          <div className="space-y-3">
            <a href="https://zalo.me/0989778247" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-[#0068FF] flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z"/></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a] group-hover:text-brand-green transition-colors">Chat Zalo</p>
                <p className="text-xs text-[#888]">Phản hồi trong 30 phút</p>
              </div>
            </a>
            <Link href="/lien-he" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors" style={{ border: '1px solid #E8DDD0' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a] group-hover:text-brand-green transition-colors">Gửi tin nhắn</p>
                <p className="text-xs text-[#888]">Trang liên hệ</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
