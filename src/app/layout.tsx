import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { FloatingContactButtons } from "@/components/floating-contact-buttons";
import { JsonLdOrganization } from "@/components/json-ld-organization";
import { SkipLink } from "@/components/skip-link";
import { JsonLdWebSite } from "@/components/json-ld-website";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import { QuickViewProvider } from "@/context/QuickViewContext";
import QuickViewSheet from "@/components/QuickViewSheet";
import { getSiteUrl } from "@/lib/site-url";
import { getSiteSettings } from "@/server/site-settings";
import "./globals.css";

const fontDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#faf8f5",
};

const site = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
  },
  alternates: {
    types: {
      "application/rss+xml": `${site}/feed.xml`,
    },
  },
  title: {
    default: "KAHA.VN — Đèn cao cấp",
    template: "%s · KAHA.VN",
  },
  description:
    "KAHA.VN — chiếu sáng cao cấp, thiết kế editorial.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: site,
    siteName: "KAHA.VN",
    title: "KAHA.VN — Đèn cao cấp",
    description:
      "KAHA.VN — chiếu sáng cao cấp, thiết kế editorial.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KAHA.VN — Đèn cao cấp",
    description:
      "KAHA.VN — chiếu sáng cao cấp, thiết kế editorial.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  return (
    <html
      lang="vi"
      className={`${fontDisplay.variable} ${fontBody.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col [font-family:var(--font-body)]"
      >
        <SkipLink />
        <JsonLdOrganization />
        <JsonLdWebSite />
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <QuickViewProvider>
                <SiteHeader />
                <main id="main-content" className="flex-1 bg-paper-warm text-ink-900">
                  {children}
                </main>
                <SiteFooter />
                <QuickViewSheet />
              </QuickViewProvider>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
        <FloatingContactButtons settings={settings} />
      </body>
    </html>
  );
}
