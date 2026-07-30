import { NextRequest, NextResponse } from "next/server";
import { supportedLocales } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = supportedLocales.find(
    (candidate) =>
      candidate !== "fr" && (pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`)),
  );

  if (!locale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname.slice(locale.length + 1) || "/";
  url.searchParams.set("__locale", locale);

  const response = NextResponse.rewrite(url);
  response.headers.set("Content-Language", locale);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|administration|icon|apple-touch-icon|manifest|robots|sitemap).*)"],
};
