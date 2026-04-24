// GA4 event tracking utility
// Works only when NEXT_PUBLIC_GA_ID is set and gtag is loaded

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// Ecommerce events
export function trackAddToCart(product: { id: string; name: string; price: number; category?: string }) {
  trackEvent('add_to_cart', {
    currency: 'VND',
    value: product.price,
    items: JSON.stringify([{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      item_category: product.category || '',
      quantity: 1,
    }]),
  });
}

export function trackViewItem(product: { id: string; name: string; price: number; category?: string }) {
  trackEvent('view_item', {
    currency: 'VND',
    value: product.price,
    item_id: product.id,
    item_name: product.name,
  });
}

export function trackSearch(searchTerm: string) {
  trackEvent('search', { search_term: searchTerm });
}

export function trackBeginCheckout(value: number) {
  trackEvent('begin_checkout', { currency: 'VND', value });
}

export function trackGiftFinderStart() {
  trackEvent('gift_finder_start');
}

export function trackGiftFinderComplete(answers: Record<string, string[]>) {
  trackEvent('gift_finder_complete', {
    recipient: answers.recipient?.join(',') || '',
    occasion: answers.occasion?.join(',') || '',
    budget: answers.budget?.[0] || '',
  });
}

// Conversion events — contact & phone
export function trackContactClick(params?: { method?: string; page?: string }) {
  trackEvent('contact_click', {
    method: params?.method || 'unknown',
    page: params?.page || (typeof window !== 'undefined' ? window.location.pathname : ''),
  });
}

export function trackPhoneClick(params?: { phone?: string; page?: string }) {
  trackEvent('phone_click', {
    phone_number: params?.phone || '0989778247',
    page: params?.page || (typeof window !== 'undefined' ? window.location.pathname : ''),
  });
}

export function trackZaloClick(params?: { page?: string }) {
  trackEvent('zalo_click', {
    page: params?.page || (typeof window !== 'undefined' ? window.location.pathname : ''),
  });
}
