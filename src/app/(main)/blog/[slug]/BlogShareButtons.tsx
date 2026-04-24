'use client';

import { useState } from 'react';

interface BlogShareButtonsProps {
  url: string;
  title: string;
}

export default function BlogShareButtons({ url, title }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-[#EDE5D8]">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#888] mb-3">
        Chia sẻ bài viết
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chia sẻ lên Facebook"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-[#EDE5D8] text-[#1877f2] hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-colors duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
          </svg>
          Facebook
        </a>

        {/* Zalo */}
        <a
          href={`https://zalo.me/share/url?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chia sẻ qua Zalo"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-[#EDE5D8] text-[#0068ff] hover:bg-[#0068ff] hover:text-white hover:border-[#0068ff] transition-colors duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.5c-.21.3-.51.45-.81.45-.18 0-.36-.045-.51-.15l-2.58-1.71c-.18-.12-.3-.3-.33-.51-.03-.21.03-.42.15-.585l.945-1.305-2.55-.03c-.375 0-.705-.165-.93-.435-.225-.27-.315-.63-.255-.975l.78-4.5c.09-.54.57-.915 1.11-.84.54.075.915.57.84 1.11l-.645 3.72 2.07.03c.36 0 .69.165.915.435.225.27.315.63.255.975l-.03.195 1.74 1.155.285-3.27c.045-.54.525-.945 1.065-.9.54.045.945.525.9 1.065l-.42 4.8c-.03.33-.195.63-.45.84zM7.5 16.5c-.54 0-1.005-.39-1.08-.93l-.75-5.4c-.075-.54.3-1.035.84-1.11.54-.075 1.035.3 1.11.84l.75 5.4c.075.54-.3 1.035-.84 1.11-.015.09-.03.09-.03.09z"/>
          </svg>
          Zalo
        </a>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          aria-label="Sao chép đường dẫn"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-[#EDE5D8] text-brand-green hover:bg-brand-green hover:text-white hover:border-brand-green transition-colors duration-150"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Đã sao chép!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Sao chép link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
