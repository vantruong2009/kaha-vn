import { NextRequest, NextResponse } from 'next/server';

/** Luồng OAuth cũ — chuyển sang /api/auth/google/callback hoặc Facebook tương ứng. */
export async function GET(request: NextRequest) {
  const dest = new URL('/tai-khoan/dang-nhap?error=legacy_oauth', request.url);
  return NextResponse.redirect(dest);
}
