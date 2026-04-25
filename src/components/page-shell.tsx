import type { ReactNode } from "react";

/** Khung nội dung trang — header/footer đã render tại root layout. */
export async function PageShell({
  children,
  mainClassName = "px-5 py-12 md:px-12 md:py-16",
}: {
  children: ReactNode;
  /** class cho container nội dung trang. */
  mainClassName?: string;
}) {
  return (
    <div className={mainClassName}>
      <div tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
