import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import MainHomePage, {
  generateMetadata as generateMainMetadata,
  revalidate as mainRevalidate,
} from "@/app/(main)/page";

export const revalidate = mainRevalidate;

export async function generateMetadata(): Promise<Metadata> {
  return generateMainMetadata();
}

export default async function HomePage() {
  return (
    <PageShell mainClassName="p-0">
      <MainHomePage />
    </PageShell>
  );
}
