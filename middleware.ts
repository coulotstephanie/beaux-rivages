import { NextRequest, NextResponse } from "next/server";
import { isSupportedLocale, type SupportedLocale } from "@/i18n/config";

const localePrefix = /^\/(en|de|es|nl)(?=\/|$)/;
const legacyLocalePrefix = /^\/(es|nl)(?=\/|$)/;
const privatePublicPaths = new Set(["/carnet-voyageur", "/reserver"]);

function publicPath(pathname: string) {
  return pathname.replace(localePrefix, "") || "/";
}

function withPublicCache(response: NextResponse, pathname: string) {
  if (privatePublicPaths.has(publicPath(pathname))) return response;

  response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  response.headers.set(
    "CDN-Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=86400",
  );
  response.headers.set(
    "Vercel-CDN-Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=86400",
  );
  return response;
}

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

  if (locale === "fr") {
    return withPublicCache(
      NextResponse.next({ request: { headers: requestHeaders } }),
      request.nextUrl.pathname,
    );
  }

  const target = request.nextUrl.clone();
  target.pathname = request.nextUrl.pathname.replace(localePrefix, "") || "/";
  return withPublicCache(
    NextResponse.rewrite(target, { request: { headers: requestHeaders } }),
    request.nextUrl.pathname,
  );
}

export const config = {
  matcher: [
    "/((?!api|_next|administration|icon|apple-touch-icon|manifest|robots|sitemap|images|videos).*)",
  ],
};
