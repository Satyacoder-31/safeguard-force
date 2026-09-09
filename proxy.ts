import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route protection for /admin/**.
 *
 * Next.js 16: `middleware.ts` is deprecated in favor of `proxy.ts` (same
 * runtime semantics). This proxy only checks for the presence of Supabase
 * auth cookies — full authorization happens server-side in layouts/actions
 * via requireAdmin() (defense in depth; proxy is not a security boundary
 * on its own).
 */

const SUPABASE_AUTH_COOKIE = "sb-*-auth-token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const hasSession = request.cookies
      .getAll()
      .some((c) => new RegExp(`^${SUPABASE_AUTH_COOKIE}$`.replace("*", "[^.]+")).test(c.name));

    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
