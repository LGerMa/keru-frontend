import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALE_COOKIE, SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "@/i18n/request";

const APP_ROUTES = [
  "/dashboard",
  "/expenses",
  "/income",
  "/tags",
  "/profile",
  "/login",
  "/register",
];

function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(preferred ?? "")
    ? (preferred as Locale)
    : DEFAULT_LOCALE;
}

function withLocaleCookie(response: NextResponse, request: NextRequest): NextResponse {
  if (!request.cookies.has(LOCALE_COOKIE)) {
    const locale = detectLocale(request.headers.get("accept-language"));
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return response;
}

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const path = request.nextUrl.pathname;

  // Only apply subdomain routing in production (skip localhost and ngrok tunnels)
  const isLocal =
    hostname.startsWith("localhost") ||
    hostname.startsWith("127.") ||
    hostname.endsWith(".ngrok-free.app") ||
    hostname.endsWith(".ngrok.io");

  if (!isLocal) {
    // On keru.me, redirect app routes to app.keru.me
    if (!hostname.startsWith("app.")) {
      if (APP_ROUTES.some((route) => path.startsWith(route))) {
        const appUrl = new URL(path, `https://app.keru.me`);
        return withLocaleCookie(NextResponse.redirect(appUrl), request);
      }
    }

    // On app.keru.me, / → /dashboard; /pricing → keru.me/pricing
    if (hostname.startsWith("app.")) {
      if (path === "/") {
        return withLocaleCookie(
          NextResponse.redirect(new URL("/dashboard", request.url)),
          request
        );
      }
      if (path.startsWith("/pricing")) {
        return withLocaleCookie(
          NextResponse.redirect(new URL(path, `https://keru.me`)),
          request
        );
      }
    }
  }

  return withLocaleCookie(NextResponse.next(), request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|og-image.png).*)",
  ],
};
