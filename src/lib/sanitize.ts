export function sanitizeText(input: string, maxLength = 1000): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().slice(0, 254);
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+\-\s()]/g, "").trim().slice(0, 20);
}
