import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** Khung chung: header + main + footer — dùng cho mọi trang nội dung. */
export async function PageShell({
  children,
  mainClassName = "flex-1 px-5 py-12 md:px-12 md:py-16",
}: {
  children: ReactNode;
  /** class cho thẻ <main> (padding / flex). */
  mainClassName?: string;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper-warm">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className={mainClassName}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
