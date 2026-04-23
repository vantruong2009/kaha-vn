import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const LOGO_PATH = path.join(process.cwd(), "public/images/logo.png");

export function SiteHeader() {
  const hasLogo = fs.existsSync(LOGO_PATH);

  return (
    <header className="border-b border-hairline px-5 py-6 md:px-12">
      {hasLogo ? (
        <Image
          src="/images/logo.png"
          alt="KAHA.VN"
          width={180}
          height={54}
          className="h-8 w-auto max-w-[200px] object-contain object-left"
          priority
          sizes="180px"
        />
      ) : (
        <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
          KAHA.VN
        </span>
      )}
    </header>
  );
}
