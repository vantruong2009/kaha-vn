'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { AdvisorQuestion } from '@/lib/site-settings';

interface Props {
  label: string;
  heading: string;
  desc: string;
  questions: AdvisorQuestion[];
  compact?: boolean; // hero inline mode
}

export default function HomeAdvisor({ label, heading, desc, questions, compact = false }: Props) {
  const [activeQ, setActiveQ] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const canSubmit = allAnswered || analyzed;

  const handleSelect = (qIdx: number, option: string) => {
    const next = questions.findIndex((_, i) => i > qIdx && !(i in { ...answers, [qIdx]: option }));
    setAnswers(prev => ({ ...prev, [qIdx]: option }));
    if (next !== -1) setActiveQ(next);
    else setActiveQ(-1);
  };

  const handleSubmit = () => { if (canSubmit) setSubmitted(true); };

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
      setPhotoName(file.name);
      setAnalyzing(true);
      setAnalyzed(false);
      setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 1800);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoPreview(null); setPhotoName(''); setAnalyzing(false); setAnalyzed(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetAll = () => { setAnswers({}); setSubmitted(false); setActiveQ(0); setPhotoPreview(null); setAnalyzed(false); setPhotoName(''); };

  // ── SUBMITTED STATE ──────────────────────────────────────────────────────────
  if (submitted) {
    const content = (
      <div className={`text-center ${compact ? 'py-4' : 'py-16 px-4'}`}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: 'rgba(16,78,46,0.08)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <p className={`font-bold mb-2 ${compact ? 'text-sm' : 'text-xl'}`} style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
          Đã có gợi ý cho bạn!
        </p>
        <p className={`mb-5 ${compact ? 'text-xs' : 'text-sm'}`} style={{ color: '#888', lineHeight: 1.7 }}>
          Xem ngay những mẫu đèn phù hợp nhất.
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/san-pham"
            className="inline-flex items-center justify-center gap-1.5 text-white font-bold rounded-full transition-all"
            style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', boxShadow: '0 3px 10px rgba(16,78,46,0.28)', fontSize: compact ? 12 : 14, padding: compact ? '9px 20px' : '12px 28px' }}>
            Xem gợi ý sản phẩm
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
          </Link>
          <button onClick={resetAll}
            className="text-xs font-semibold py-2 rounded-full border transition-colors"
            style={{ color: '#888', borderColor: '#EDE5D8' }}>
            Làm lại
          </button>
        </div>
      </div>
    );
    if (compact) return <div className="rounded-2xl p-4" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>{content}</div>;
    return content;
  }

  // ── COMPACT MODE (Hero inline) ───────────────────────────────────────────────
  if (compact) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #EDE5D8' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(201,130,42,0.1)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c9822a" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#c9822a' }}>{label}</p>
            {answeredCount > 0 && (
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,78,46,0.08)', color: '#104e2e' }}>
                {answeredCount}/{questions.length}
              </span>
            )}
          </div>
          <p className="text-[13px] font-bold leading-snug" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>{heading}</p>
        </div>

        {/* Questions — compact accordion */}
        <div className="px-3 py-2 space-y-1">
          {questions.map((q, idx) => {
            const isOpen = activeQ === idx;
            const answered = answers[idx];
            return (
              <div key={idx}>
                <button type="button" onClick={() => setActiveQ(isOpen ? -1 : idx)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: answered ? 'rgba(16,78,46,0.06)' : isOpen ? 'rgba(16,78,46,0.04)' : 'transparent',
                    border: `1px solid ${answered ? 'rgba(16,78,46,0.18)' : isOpen ? 'rgba(16,78,46,0.12)' : '#EDE5D8'}`,
                  }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                    style={{ background: answered ? '#104e2e' : isOpen ? '#104e2e' : '#EDE5D8', color: answered || isOpen ? 'white' : '#888' }}>
                    {answered
                      ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : idx + 1}
                  </span>
                  <span className="flex-1 text-xs font-semibold truncate" style={{ color: answered ? '#104e2e' : '#1a1a1a' }}>
                    {answered ? `${q.label.replace('?', '')} — ${answered}` : q.label}
                  </span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {isOpen && (
                  <div className="grid grid-cols-2 gap-1.5 mt-1.5 px-2 pb-1">
                    {q.options.map(opt => (
                      <button key={opt} type="button" onClick={() => handleSelect(idx, opt)}
                        className="px-2.5 py-2 rounded-lg text-[11px] font-semibold text-left transition-all"
                        style={{
                          background: answers[idx] === opt ? '#104e2e' : '#FAF7F2',
                          color: answers[idx] === opt ? 'white' : '#444',
                          border: `1px solid ${answers[idx] === opt ? '#104e2e' : '#EDE5D8'}`,
                        }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="px-3 pb-3">
          <button type="button" onClick={handleSubmit} disabled={!canSubmit}
            className="w-full py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            style={{
              background: canSubmit ? 'linear-gradient(to bottom, #1a6b3c, #104e2e)' : '#EDE5D8',
              color: canSubmit ? 'white' : '#a0907a',
              boxShadow: canSubmit ? '0 3px 10px rgba(16,78,46,0.25)' : 'none',
            }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            {canSubmit ? 'Xem gợi ý của tôi' : `Trả lời ${questions.length - answeredCount} câu hỏi nữa`}
          </button>
        </div>
      </div>
    );
  }

  // ── FULL MODE ────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Left — quiz */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#c9822a' }}>{label}</p>
        <h2 className="text-h2 mb-3" style={{ color: '#1a1a1a', letterSpacing: '-0.025em' }}>{heading}</h2>
        <p className="text-sm leading-[1.8] mb-8" style={{ color: '#666' }}>{desc}</p>
        <div className="rounded-2xl p-6 space-y-2" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <p className="text-xs leading-[1.7] mb-4" style={{ color: '#888' }}>
            Trả lời {questions.length} câu hỏi nhanh để nhận gợi ý cá nhân hóa, hoặc tải ảnh phòng lên để AI phân tích trực tiếp.
          </p>
          {questions.map((q, idx) => {
            const isOpen = activeQ === idx;
            const answered = answers[idx];
            return (
              <div key={idx}>
                <button type="button" onClick={() => setActiveQ(isOpen ? -1 : idx)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
                  style={{
                    background: answered ? 'rgba(16,78,46,0.06)' : isOpen ? 'rgba(16,78,46,0.04)' : 'transparent',
                    border: `1px solid ${answered ? 'rgba(16,78,46,0.2)' : isOpen ? 'rgba(16,78,46,0.15)' : '#EDE5D8'}`,
                  }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                    style={{ background: answered ? '#104e2e' : isOpen ? '#104e2e' : '#EDE5D8', color: answered || isOpen ? 'white' : '#888' }}>
                    {answered ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> : idx + 1}
                  </span>
                  <span className="flex-1 text-sm font-semibold" style={{ color: answered ? '#104e2e' : '#1a1a1a' }}>
                    {answered ? <>{q.label} <span className="font-normal" style={{ color: '#888' }}>— {answered}</span></> : q.label}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {isOpen && (
                  <div className="grid grid-cols-2 gap-2 mt-2 pl-4">
                    {q.options.map(opt => (
                      <button key={opt} type="button" onClick={() => handleSelect(idx, opt)}
                        className="px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background: answers[idx] === opt ? '#104e2e' : '#FAF7F2',
                          color: answers[idx] === opt ? 'white' : '#444',
                          border: `1px solid ${answers[idx] === opt ? '#104e2e' : '#EDE5D8'}`,
                        }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="pt-3">
            <button type="button" onClick={handleSubmit} disabled={!canSubmit || analyzing}
              className="w-full py-3.5 rounded-full text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: canSubmit && !analyzing ? 'linear-gradient(to bottom, #1a6b3c, #104e2e)' : '#EDE5D8',
                color: canSubmit && !analyzing ? 'white' : '#a0907a',
                boxShadow: canSubmit && !analyzing ? '0 4px 14px rgba(16,78,46,0.28)' : 'none',
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              {analyzing ? 'Đang phân tích ảnh...' : canSubmit ? 'Xem gợi ý của tôi' : `Còn ${questions.length - answeredCount} câu hỏi`}
            </button>
          </div>
        </div>
      </div>

      {/* Right — photo upload */}
      <div className="flex flex-col gap-4">
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleFileChange} aria-label="Tải ảnh phòng" />
        <div role="button" tabIndex={0} aria-label="Tải ảnh phòng của bạn"
          onClick={() => !analyzing && fileInputRef.current?.click()}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all"
          style={{
            background: photoPreview ? 'transparent' : 'linear-gradient(135deg, #FFFDF8, #F5EDE0)',
            border: `2px ${dragOver ? 'solid' : 'dashed'} ${dragOver ? '#104e2e' : analyzed ? '#104e2e' : '#EDE5D8'}`,
            minHeight: 280, cursor: analyzing ? 'default' : 'pointer',
            boxShadow: dragOver ? '0 0 0 4px rgba(16,78,46,0.08)' : 'none',
          }}>
          {photoPreview ? (
            <>
              <img src={photoPreview} alt="Ảnh phòng đã tải lên" className="w-full h-full object-cover" style={{ minHeight: 280, maxHeight: 360 }} />
              {analyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: 'rgba(10,51,32,0.72)', backdropFilter: 'blur(2px)' }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="animate-spin">
                    <circle cx="18" cy="18" r="15" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
                    <path d="M18 3 A15 15 0 0 1 33 18" stroke="#c9822a" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  <p className="text-white text-sm font-semibold">Đang phân tích không gian...</p>
                  <p className="text-white/60 text-xs">AI đang nhận diện màu sắc và phong cách</p>
                </div>
              )}
              {analyzed && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#104e2e', color: 'white' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Đã phân tích xong
                </div>
              )}
              {!analyzing && (
                <button type="button" onClick={clearPhoto} aria-label="Xóa ảnh"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.55)', color: 'white' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
              {!analyzing && (
                <div className="absolute bottom-0 inset-x-0 px-4 py-2.5 flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span className="text-white text-[11px] truncate flex-1">{photoName}</span>
                  <span className="text-white/60 text-[10px] shrink-0">Đổi ảnh</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
              <div className="absolute top-4 left-4 opacity-10 pointer-events-none">
                <svg viewBox="0 0 60 86" width="36" height="52" fill="none"><line x1="30" y1="0" x2="30" y2="10" stroke="#c9822a" strokeWidth="2" strokeLinecap="round"/><rect x="18" y="8" width="24" height="5" rx="1.5" fill="#c9822a"/><path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#c9822a" strokeWidth="1.5" fill="rgba(201,130,42,0.2)"/><rect x="18" y="74" width="24" height="5" rx="1.5" fill="#c9822a"/></svg>
              </div>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: dragOver ? 'rgba(16,78,46,0.1)' : 'rgba(201,130,42,0.1)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dragOver ? '#104e2e' : '#c9822a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Tải ảnh phòng của bạn</p>
                <p className="text-xs leading-[1.7]" style={{ color: '#aaa' }}>JPG, PNG tối đa 10MB</p>
                <p className="text-xs" style={{ color: '#aaa' }}>AI sẽ phân tích màu sắc và phong cách</p>
              </div>
              <div className="px-5 py-2.5 rounded-full text-xs font-bold" style={{ background: 'rgba(16,78,46,0.08)', color: '#104e2e', border: '1px solid rgba(16,78,46,0.15)' }}>
                {dragOver ? 'Thả ảnh vào đây' : 'Chọn ảnh hoặc kéo thả'}
              </div>
            </div>
          )}
        </div>
        <div className="rounded-xl px-5 py-4 space-y-2.5" style={{ background: '#FAF7F2', border: '1px solid #EDE5D8' }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: '#888' }}>Mẹo chụp ảnh đẹp</p>
          {['Chụp ban ngày khi phòng có ánh sáng tự nhiên', 'Bao gồm toàn bộ góc không gian cần trang trí', 'Độ phân giải tối thiểu 800×600px để phân tích chính xác'].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-px" style={{ background: 'rgba(16,78,46,0.1)' }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="text-xs leading-[1.7]" style={{ color: '#666' }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
