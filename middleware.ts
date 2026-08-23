import { NextRequest, NextResponse } from "next/server";
import { isSupportedLocale, type SupportedLocale } from "@/i18n/config";

const localePrefix = /^\/(en|de|es|nl)(?=\/|$)/;
const legacyLocalePrefix = /^\/(es|nl)(?=\/|$)/;

export function middleware(request: NextRequest) {
  if (legacyLocalePrefix.test(request.nextUrl.pathname)) {
    const target = request.nextUrl.clone();
    target.pathname = request.nextUrl.pathname.replace(legacyLocalePrefix, "") || "/";
    return NextResponse.redirect(target, 308);
  }

  const match = request.nextUrl.pathname.match(localePrefix);
  const locale: SupportedLocale = match && isSupportedLocale(match[1]) ? match[1] : "fr";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-beaux-rivages-locale", locale);
  requestHeaders.set("x-beaux-rivages-pathname", request.nextUrl.pathname);
  if (locale === "fr") return NextResponse.next({ request: { headers: requestHeaders } });
  const target = request.nextUrl.clone();
  target.pathname = request.nextUrl.pathname.replace(localePrefix, "") || "/";
  return NextResponse.rewrite(target, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!api|_next|administration|icon|apple-touch-icon|manifest|robots|sitemap|images|videos).*)",
  ],
};
