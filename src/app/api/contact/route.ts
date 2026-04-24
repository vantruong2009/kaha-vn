import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { rateLimitAsync } from '@/lib/rateLimit';
import { sanitizeText, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import { resolveNotificationRecipients } from '@/lib/notification-recipients';

// RFC 5322-compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.\!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const contactSchema = z.object({
  name: z.string().min(1, 'Thiếu họ tên').max(100),
  phone: z.string().min(1, 'Thiếu số điện thoại').max(20),
  email: z.union([z.string().regex(EMAIL_REGEX, 'Email không hợp lệ'), z.literal('')]).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, 'Thiếu nội dung').max(5000),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

async function saveUploadedFiles(formData: FormData): Promise<string[]> {
  const files = formData.getAll('files') as File[];
  if (!files.length) return [];

  // In production (Vercel), public/ is read-only — files go to /tmp/media_khach instead
  const uploadDir = process.env.NODE_ENV === 'production'
    ? '/tmp/media_khach'
    : path.join(process.cwd(), 'public', 'media_khach');

  fs.mkdirSync(uploadDir, { recursive: true });

  const saved: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (!ALLOWED_TYPES.includes(file.type)) continue;
    if (file.size > 4 * 1024 * 1024) continue;

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
    const filename = `${Date.now()}_${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    saved.push(filename);
  }
  return saved;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!(await rateLimitAsync(ip, 5, 60_000))) {
    return NextResponse.json({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' }, { status: 429 });
  }

  try {
    const contentType = req.headers.get('content-type') ?? '';
    const isMultipart = contentType.includes('multipart/form-data');

    let rawName: string, rawPhone: string, rawEmail: string | undefined,
        rawSubject: string | undefined, rawMessage: string;
    let savedFiles: string[] = [];

    if (isMultipart) {
      const fd = await req.formData();
      rawName    = (fd.get('name')    as string) ?? '';
      rawPhone   = (fd.get('phone')   as string) ?? '';
      rawEmail   = (fd.get('email')   as string) ?? '';
      rawSubject = (fd.get('subject') as string) ?? '';
      rawMessage = (fd.get('message') as string) ?? '';
      savedFiles = await saveUploadedFiles(fd);
    } else {
      const body = await req.json();
      rawName    = body.name    ?? '';
      rawPhone   = body.phone   ?? '';
      rawEmail   = body.email   ?? '';
      rawSubject = body.subject ?? '';
      rawMessage = body.message ?? '';
    }

    const parsed = contactSchema.safeParse({
      name: rawName, phone: rawPhone, email: rawEmail,
      subject: rawSubject, message: rawMessage,
    });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    const { name, phone, email, subject, message } = parsed.data;
    const cleanName    = sanitizeText(name, 100);
    const cleanPhone   = sanitizePhone(phone);
    const cleanEmail   = email ? sanitizeEmail(email) : '';
    const cleanSubject = subject ? sanitizeText(subject, 200) : '';
    const cleanMessage = sanitizeText(message, 5000);

    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      const recipients = await resolveNotificationRecipients({
        envEmail: process.env.ORDER_NOTIFY_EMAIL,
      });

      const filesHtml = savedFiles.length
        ? `<tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;color:#888;font-size:13px;vertical-align:top;">File đính kèm</td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;font-size:13px;">${savedFiles.map(f => escapeHtml(f)).join('<br/>')}</td>
           </tr>`
        : '';

      const emailHtml = `
        <div style="font-family:'Be Vietnam Pro',Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#c9822a;margin-bottom:24px;">Liên hệ mới từ LongDenViet</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;color:#888;width:140px;font-size:13px;">Họ và tên</td>
              <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;font-weight:600;font-size:14px;">${escapeHtml(cleanName)}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;color:#888;font-size:13px;">Số điện thoại</td>
              <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;font-weight:600;font-size:14px;">${escapeHtml(cleanPhone)}</td>
            </tr>
            ${cleanEmail ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;color:#888;font-size:13px;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;font-size:14px;">${escapeHtml(cleanEmail)}</td>
            </tr>` : ''}
            ${cleanSubject ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;color:#888;font-size:13px;">Chủ đề</td>
              <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;font-size:14px;">${escapeHtml(cleanSubject)}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;color:#888;font-size:13px;vertical-align:top;">Nội dung</td>
              <td style="padding:10px 0;border-bottom:1px solid #EEF0F8;font-size:14px;white-space:pre-wrap;">${escapeHtml(cleanMessage)}</td>
            </tr>
            ${filesHtml}
          </table>
          <p style="margin-top:32px;font-size:12px;color:#888;">Gửi qua form liên hệ tại longdenviet.com</p>
        </div>
      `;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'LongDenViet Contact <contact@longdenviet.com>',
          to: recipients,
          subject: `[LongDenViet] Liên hệ mới từ ${cleanName}`,
          html: emailHtml,
          reply_to: cleanEmail || undefined,
        }),
      });

      if (!res.ok) {
        console.error('[contact] Resend API error: non-200 response');
        return NextResponse.json({ error: 'Không thể gửi email. Vui lòng thử lại.' }, { status: 500 });
      }
    } else {
      // Dev fallback — do not log PII
      console.log('[contact] No RESEND_API_KEY set. Form submission received (dev mode). PII omitted from logs.');
      if (savedFiles.length) console.log('[contact] Files saved:', savedFiles);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Unexpected error occurred');
    return NextResponse.json({ error: 'Đã xảy ra lỗi. Vui lòng thử lại.' }, { status: 500 });
  }
}
