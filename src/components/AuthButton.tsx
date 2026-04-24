'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchCustomerMe, type CustomerMeUser } from '@/lib/auth/fetch-customer-me';

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const btnClass =
  'hidden md:flex w-10 h-10 items-center justify-center text-[#4a4a4a] hover:text-[#1a6b3c] transition-colors focus-visible:outline-2 focus-visible:outline-[#1a6b3c] rounded-sm';

export default function AuthButton() {
  const [user, setUser] = useState<CustomerMeUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetchCustomerMe().then(u => {
        if (!cancelled) setUser(u);
      });
    };
    load();
    const onAuth = () => load();
    window.addEventListener('ldv:customer-auth', onAuth);
    window.addEventListener('focus', load);
    return () => {
      cancelled = true;
      window.removeEventListener('ldv:customer-auth', onAuth);
      window.removeEventListener('focus', load);
    };
  }, []);

  if (user) {
    const label =
      (user.full_name && user.full_name.trim().split(/\s+/).pop()) ||
      user.email?.split('@')[0] ||
      'Tài khoản';
    return (
      <Link
        href="/tai-khoan"
        className={btnClass}
        aria-label="Tài khoản của tôi"
        title={label}
      >
        <UserIcon />
      </Link>
    );
  }

  return (
    <Link
      href="/tai-khoan/dang-nhap"
      className={btnClass}
      aria-label="Đăng nhập"
    >
      <UserIcon />
    </Link>
  );
}
