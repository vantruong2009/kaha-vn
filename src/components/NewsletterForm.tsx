'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  if (submitted) {
    return (
      <div className="text-base text-brand-green font-semibold py-4">
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Đăng ký thành công! Cảm ơn bạn đã tham gia cộng đồng LongDenViet.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row rounded overflow-hidden shadow-md max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@cua-ban.com"
        required
        className="flex-1 px-5 py-3.5 text-sm bg-white outline-none border-none text-[#1a1a1a] placeholder-[#888]"
      />
      <button
        type="submit"
        className="bg-brand-green text-white px-6 py-3.5 text-sm font-bold hover:bg-brand-green-dk transition-colors duration-150 whitespace-nowrap"
      >
        Đăng ký miễn phí
      </button>
    </form>
  );
}
