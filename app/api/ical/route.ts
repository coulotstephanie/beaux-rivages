import { NextRequest } from "next/server";
import { isPropertySlug } from "@/platform/calendar/config";
import { rateLimit } from "@/platform/http/security";
import { isDatabaseConfigured } from "@/platform/database/client";
import { SupabaseCalendarRepository } from "@/platform/database/calendar";

function icalDate(value: string) {
  return value.replaceAll("-", "");
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 80);
  if (limited) return limited;
  const property = request.nextUrl.searchParams.get("property");
  if (!isPropertySlug(property)) return new Response("Unknown property", { status: 400 });
  if (!isDatabaseConfigured()) return new Response("Calendar unavailable", { status: 503 });
  const blocks = await new SupabaseCalendarRepository().listOutboundBlocks(property);
  const events = blocks
    .map((block) =>
      [
        "BEGIN:VEVENT",
        `UID:${property}-${block.id}@beaux-rivages.com`,
        `DTSTAMP:${new Date()
          .toISOString()
          .replace(/[-:]/g, "")
          .replace(/\.\d{3}/, "")}`,
        `DTSTART;VALUE=DATE:${icalDate(block.startsOn)}`,
        `DTEND;VALUE=DATE:${icalDate(block.endsOn)}`,
        "SUMMARY:Indisponible - Beaux Rivages",
        "STATUS:CONFIRMED",
        "END:VEVENT",
      ].join("\r\n"),
    )
    .join("\r\n");
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Beaux Rivages//Availability//FR",
    "CALSCALE:GREGORIAN",
    events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "private, max-age=300",
    },
  });
}
