import { NextRequest } from "next/server";
import { initialGuestBookEntries } from "@/features/guestbook";
import { GuestBookRepository } from "@/features/guestbook/repository";
import { isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit } from "@/platform/http/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 60);
  if (limited) return limited;
  const params = request.nextUrl.searchParams;
  const filters = {
    search: params.get("search") ?? undefined,
    house: params.get("house") ?? undefined,
    language: params.get("language") ?? undefined,
    year: params.get("year") ?? undefined,
    tag: params.get("tag") ?? undefined,
  };
  if (!isDatabaseConfigured()) return noStoreJson({ entries: initialGuestBookEntries });
  try {
    const entries = await new GuestBookRepository().list(filters as never);
    return noStoreJson({ entries: entries.length ? entries : initialGuestBookEntries });
  } catch {
    return noStoreJson({ entries: initialGuestBookEntries });
  }
}
