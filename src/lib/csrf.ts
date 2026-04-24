/**
 * CSRF guard dựa trên Origin/Referer — dùng cho các POST route công khai.
 * Allowlist: kaha.vn prod + localhost dev (port 3102).
 */
export function validateCsrf(req: Request): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (!origin && !referer) return false;

  const allowedOrigins = [
    "https://kaha.vn",
    "https://www.kaha.vn",
    process.env.NODE_ENV === "development" ? "http://localhost:3102" : null,
    process.env.NODE_ENV === "development" ? "http://127.0.0.1:3102" : null,
  ].filter(Boolean) as string[];

  if (origin) return allowedOrigins.some((o) => origin === o);
  if (referer) return allowedOrigins.some((o) => referer.startsWith(o));

  return false;
}
