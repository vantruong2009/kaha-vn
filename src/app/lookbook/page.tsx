import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ShopTheLook } from "@/components/shop-the-look";
import { getSiteUrl } from "@/lib/site-url";

const site = getSiteUrl();

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Editorial lighting scenes và shop-the-look của KAHA.VN.",
  alternates: { canonical: "/lookbook" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Lookbook · KAHA.VN",
    description: "Editorial lighting scenes và shop-the-look của KAHA.VN.",
    url: `${site}/lookbook`,
    locale: "vi_VN",
  },
};

export default function LookbookPage() {
  return (
    <div className="flex min-h-full flex-col bg-paper-warm">
      <SiteHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 px-5 py-16 md:px-12 md:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
            KAHA.VN
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,2.8rem)] [font-family:var(--font-display),serif] text-ink-900">
            Lookbook
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
            Bộ sưu tập phối cảnh ánh sáng theo ngôn ngữ Obsidian. Chọn hotspot để
            mở nhóm sản phẩm tương ứng.
          </p>

          <div className="mt-10 space-y-8">
            <ShopTheLook
              imageSrc="/images/lookbook-livingroom.svg"
              imageAlt="Lookbook phòng khách tone đen trắng"
              title="Obsidian Living Room"
              caption="Lớp sáng dịu cho sofa chính, điểm nhấn bằng đèn thả trần và đèn bàn kim loại mờ."
              hotspots={[
                { label: "Pendant", href: "/shop?tag=pendant", x: 46, y: 28 },
                { label: "Table", href: "/shop?tag=table-lamp", x: 62, y: 60 },
                { label: "Wall", href: "/shop?tag=wall-light", x: 23, y: 38 },
              ]}
            />
            <ShopTheLook
              imageSrc="/images/lookbook-dining.svg"
              imageAlt="Lookbook khu dining cao cấp"
              title="Dining Scene"
              caption="Trục đèn linear phía trên bàn ăn, kết hợp wall washer tạo chiều sâu và texture."
              hotspots={[
                { label: "Linear", href: "/shop?tag=linear", x: 52, y: 22 },
                { label: "Wall", href: "/shop?tag=wall-washer", x: 24, y: 45 },
                { label: "Accent", href: "/shop?tag=accent", x: 74, y: 42 },
              ]}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
