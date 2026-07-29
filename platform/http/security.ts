import { NextRequest, NextResponse } from "next/server";

const globalRateLimits = globalThis as typeof globalThis & { __beauxRivagesRateLimits?: Map<string, { count: number; resetAt: number }> };
const buckets = globalRateLimits.__beauxRivagesRateLimits ?? new Map<string, { count: number; resetAt: number }>();
globalRateLimits.__beauxRivagesRateLimits = buckets;

export function rateLimit(request: NextRequest, limit = 40, windowMs = 60_000) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = `${forwarded ?? "unknown"}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  bucket.count += 1;
  if (bucket.count <= limit) return null;
  return NextResponse.json({ error: "Trop de requêtes. Réessayez dans un instant." }, { status: 429, headers: { "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000)) } });
}

export function noStoreJson(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { "Cache-Control": "private, no-store", ...(init?.headers ?? {}) } });
}

export function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
}

export function requireSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return process.env.NODE_ENV === "development";
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
