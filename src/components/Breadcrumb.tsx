import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-[#888] mb-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">›</span>}
            {isLast || !item.href ? (
              <span className={isLast ? 'text-[#1a1a1a] font-medium' : 'text-[#888]'}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-brand-green hover:text-brand-green-dk hover:underline underline-offset-2 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
