import { NextResponse, type NextRequest } from "next/server";

// Lightweight gate — checks only that cookie *exists*. Real verification happens
// in route/page handlers via getSession() (Edge runtime can't access Prisma).
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") return NextResponse.next();
  const token = req.cookies.get("jt_admin")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
