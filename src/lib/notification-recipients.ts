import { hasPostgresConfigured, fetchSettingsRowsPg } from '@/lib/postgres/commerce';

const EMAIL_REGEX = /^[a-zA-Z0-9.\!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function addEmails(target: Set<string>, raw?: string | null) {
  if (!raw) return;

  for (const part of raw.split(/[,;\n]/)) {
    const email = part.trim().toLowerCase();
    if (email && EMAIL_REGEX.test(email)) {
      target.add(email);
    }
  }
}

export async function resolveNotificationRecipients(options: {
  envEmail?: string | null;
  fallbackEmail?: string;
} = {}): Promise<string[]> {
  const recipients = new Set<string>();
  const fallbackEmail = options.fallbackEmail || 'sales@longdenviet.com';

  addEmails(recipients, options.envEmail);

  if (hasPostgresConfigured()) {
    try {
      const rows = await fetchSettingsRowsPg(['contact_email', 'popup_email', 'store_email']);
      for (const row of rows) {
        addEmails(recipients, row.value);
      }
    } catch (err) {
      console.error('[notification-recipients] Failed to load site settings:', err);
    }
  }

  if (recipients.size === 0) {
    addEmails(recipients, fallbackEmail);
  }

  return [...recipients];
}
