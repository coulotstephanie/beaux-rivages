import type { CalendarBlock, CalendarSyncResult } from "./contracts";
import { ICalendarConnector } from "./connector";
import { getCalendarSources, type PropertySlug } from "./config";
import { mergeCalendarBlocks } from "./ical";
import { isDatabaseConfigured } from "@/platform/database/client";
import { SupabaseCalendarRepository } from "@/platform/database/calendar";
export { isDateRangeAvailable as isRangeAvailable } from "@/lib/date-ranges";

type CachedCalendar = { blocks: CalendarBlock[]; results: CalendarSyncResult[]; expiresAt: number };
const globalCalendar = globalThis as typeof globalThis & {
  __beauxRivagesCalendar?: Map<string, CachedCalendar>;
};
const cache = globalCalendar.__beauxRivagesCalendar ?? new Map<string, CachedCalendar>();
globalCalendar.__beauxRivagesCalendar = cache;
const connector = new ICalendarConnector();

export async function synchronizePropertyCalendars(propertySlug: PropertySlug, force = false) {
  const current = cache.get(propertySlug);
  if (!force && current && current.expiresAt > Date.now()) return current;
  const sources = getCalendarSources(propertySlug);
  const settled = await Promise.all(
    sources.map(async (source) => {
      const syncedAt = new Date().toISOString();
      try {
        const blocks = await connector.fetch(source);
        return {
          blocks,
          result: {
            sourceId: source.id,
            provider: source.provider,
            propertySlug,
            status: "success",
            imported: blocks.length,
            syncedAt,
          } satisfies CalendarSyncResult,
        };
      } catch (error) {
        console.error(
          JSON.stringify({
            event: "calendar.sync.error",
            sourceId: source.id,
            message: error instanceof Error ? error.message : "Unknown error",
          }),
        );
        return {
          blocks: [] as CalendarBlock[],
          result: {
            sourceId: source.id,
            provider: source.provider,
            propertySlug,
            status: "error",
            imported: 0,
            syncedAt,
            error: error instanceof Error ? error.message : "Synchronization failed.",
          } satisfies CalendarSyncResult,
        };
      }
    }),
  );
  const persisted = isDatabaseConfigured()
    ? await Promise.all(
        settled.map(async (item) => {
          const repository = new SupabaseCalendarRepository();
          try {
            if (item.result.status === "success") {
              await repository.replaceEvents(
                propertySlug,
                item.result.provider,
                item.blocks,
                item.result.syncedAt,
              );
            }
            await repository.recordSync(item.result);
            return item;
          } catch (error) {
            const message = error instanceof Error ? error.message : "Calendar persistence failed.";
            console.error(
              JSON.stringify({
                event: "calendar.persistence.error",
                sourceId: item.result.sourceId,
                message,
              }),
            );
            return {
              blocks: item.blocks,
              result: { ...item.result, status: "error" as const, error: message },
            };
          }
        }),
      )
    : settled;
  const value = {
    blocks: mergeCalendarBlocks(persisted.flatMap((item) => item.blocks)),
    results: persisted.map((item) => item.result),
    expiresAt: Date.now() + 5 * 60_000,
  };
  cache.set(propertySlug, value);
  return value;
}

function dateOnly(value: string) {
  return value.slice(0, 10);
}

export async function getPropertyAvailability(propertySlug: PropertySlug, force = false) {
  const calendar = await synchronizePropertyCalendars(propertySlug, force);
  return {
    propertySlug,
    generatedAt: new Date().toISOString(),
    blocks: calendar.blocks.map((block) => ({
      startsOn: dateOnly(block.startsAt),
      endsOn: dateOnly(block.endsAt),
      status: block.status,
    })),
    sources: calendar.results,
  };
}
