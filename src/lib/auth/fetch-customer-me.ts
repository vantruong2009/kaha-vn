export type CustomerMeUser = {
  id: string;
  email: string;
  full_name: string | null;
  phone?: string | null;
  address?: string | null;
};

export async function fetchCustomerMe(): Promise<CustomerMeUser | null> {
  try {
    const r = await fetch('/api/auth/customer/me', { credentials: 'include' });
    if (!r.ok) return null;
    const j = (await r.json()) as { user: CustomerMeUser | null };
    return j.user ?? null;
  } catch {
    return null;
  }
}

export function notifyCustomerAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('ldv:customer-auth'));
  }
}
