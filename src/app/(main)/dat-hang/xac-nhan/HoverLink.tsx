'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function HoverLink({ href, children, className, style }: Props) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
      }}
    >
      {children}
    </Link>
  );
}

export function HoverLinkWithShadow({ href, children, className, style }: Props) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(90,74,56,.12)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {children}
    </Link>
  );
}
