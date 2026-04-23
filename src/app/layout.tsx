import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "KAHA.VN — Đèn cao cấp",
    template: "%s · KAHA.VN",
  },
  description:
    "KAHA.VN — chiếu sáng cao cấp, thiết kế editorial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${fontDisplay.variable} ${fontBody.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col [font-family:var(--font-body)]"
      >
        {children}
      </body>
    </html>
  );
}
