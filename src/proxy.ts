import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APP_ROUTES = [
  "/dashboard",
  "/expenses",
  "/income",
  "/tags",
  "/profile",
  "/login",
  "/register",
];

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const path = request.nextUrl.pathname;

  // Only apply subdomain routing in production (skip localhost)
  const isLocal = hostname.startsWith("localhost") || hostname.startsWith("127.");
  if (isLocal) return NextResponse.next();

  // On keru.me, redirect app routes to app.keru.me
  if (!hostname.startsWith("app.")) {
    if (APP_ROUTES.some((route) => path.startsWith(route))) {
      const appUrl = new URL(path, `https://app.keru.me`);
      return NextResponse.redirect(appUrl);
    }
  }

  // On app.keru.me, redirect landing routes to keru.me
  if (hostname.startsWith("app.")) {
    if (path === "/" || path.startsWith("/pricing")) {
      const landingUrl = new URL(path, `https://keru.me`);
      return NextResponse.redirect(landingUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|og-image.png).*)",
  ],
};
