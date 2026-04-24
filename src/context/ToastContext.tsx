'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast { id: number; message: string; type: ToastType; }

interface ToastCtxValue { toast: (message: string, type?: ToastType) => void; }

const ToastCtx = createContext<ToastCtxValue>({ toast: () => {} });
let _id = 0;

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'success')
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>;
  if (type === 'error')
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  if (type === 'warning')
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.5" fill="#fcd34d"/></svg>;
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#93c5fd"/></svg>;
}

const TOAST_BG: Record<ToastType, string> = {
  success: '#104e2e',
  error:   '#7f1d1d',
  warning: '#78350f',
  info:    '#1e3a5f',
};
const TOAST_BORDER: Record<ToastType, string> = {
  success: '#1a6b3c',
  error:   '#b91c1c',
  warning: '#b45309',
  info:    '#2563eb',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++_id;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '8px',
          pointerEvents: 'none',
          width: 'min(360px, calc(100vw - 32px))',
        }}
      >
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              background: TOAST_BG[t.type],
              border: `1px solid ${TOAST_BORDER[t.type]}`,
              borderRadius: '14px',
              padding: '11px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
              pointerEvents: 'all',
              animation: 'toast-in 0.22s ease-out',
            }}
          >
            <span style={{ flexShrink: 0 }}><ToastIcon type={t.type} /></span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'white', lineHeight: 1.45, flex: 1 }}>{t.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              style={{ flexShrink: 0, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 2, fontSize: 18, lineHeight: 1 }}
              aria-label="Đóng"
            >×</button>
          </div>
        ))}
      </div>
      <style>{`@keyframes toast-in{from{opacity:0;transform:translateY(10px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
