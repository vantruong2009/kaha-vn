import { NextRequest, NextResponse } from "next/server";

// Hosts staging/internal → noindex để không bị Google index nhầm
const NOINDEX_HOSTS = ["oracle.kaha.vn", "staging.kaha.vn"];

// WooCommerce query params thường bị Google crawl gây duplicate content
const WOO_PARAMS = [
  "add-to-cart",
  "wc-ajax",
  "woo_ajax",
  "filter_",
  "min_price",
  "max_price",
  "orderby",
  "order",
  "paged",
];

function hasWooParams(url: URL): boolean {
  for (const [key] of url.searchParams.entries()) {
    if (WOO_PARAMS.some((p) => key.startsWith(p))) return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname, searchParams } = request.nextUrl;

  // Admin redirect: oracle subdomain → /admin/ops
  if (host.startsWith("oracle.kaha.vn") && pathname === "/") {
    const res = NextResponse.redirect(new URL("/admin/ops", request.url));
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // Staging/internal hosts → noindex
  if (NOINDEX_HOSTS.some((h) => host.startsWith(h))) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // Strip WooCommerce legacy query params → 308 clean URL
  if (hasWooParams(request.nextUrl)) {
    const clean = new URL(pathname, request.url);
    // Keep non-woo params (e.g. utm_*)
    for (const [key, val] of searchParams.entries()) {
      if (!WOO_PARAMS.some((p) => key.startsWith(p))) {
        clean.searchParams.set(key, val);
      }
    }
    return NextResponse.redirect(clean, { status: 308 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
