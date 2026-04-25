import type { ReactNode } from "react";

export const revalidate = 86400;

export default function MainLayout({ children }: { children: ReactNode }) {
  return children;
}
