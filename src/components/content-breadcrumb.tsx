import Link from "next/link";
import { breadcrumbSegmentLabel } from "@/lib/breadcrumb-segment-label";

const linkClass =
  "text-ink-500 underline-offset-4 transition-colors hover:text-ink-900 hover:underline hover:decoration-platinum-deep";

type Props = {
  segments: string[];
};

export function ContentBreadcrumb({ segments }: Props) {
  const clean = segments.filter(Boolean);
  if (clean.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-3xl">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-ink-500">
        <li className="inline-flex items-center">
          <Link href="/" className={linkClass}>
            Trang chủ
          </Link>
        </li>
        {clean.map((seg, i) => {
          const path = `/${clean.slice(0, i + 1).join("/")}`;
          const label = breadcrumbSegmentLabel(seg);
          const isLast = i === clean.length - 1;
          return (
            <li key={path} className="inline-flex items-center gap-x-1.5">
              <span aria-hidden className="text-ink-400">
                /
              </span>
              {isLast ? (
                <span className="font-medium text-ink-700" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link href={path} className={linkClass}>
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
