import type { CalendarBlock, CalendarSyncResult } from "./contracts";
import { ICalendarConnector } from "./connector";
import { getCalendarSources, getCalendarConfigurationStatus, type PropertySlug } from "./config";
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

type CalendarReadOptions = {
  force?: boolean;
  persist?: boolean;
};

export async function synchronizePropertyCalendars(
  propertySlug: PropertySlug,
  force = false,
  persist = false,
) {
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
  const persisted =
    persist && isDatabaseConfigured()
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
              const message =
                error instanceof Error ? error.message : "Calendar persistence failed.";
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
    expiresAt: Date.now() + 60_000,
  };
  cache.set(propertySlug, value);
  return value;
}

function dateOnly(value: string) {
  return value.slice(0, 10);
}

export async function getPropertyAvailability(
  propertySlug: PropertySlug,
  options: CalendarReadOptions | boolean = {},
) {
  const normalized = typeof options === "boolean" ? { force: options, persist: options } : options;
  const calendar = await synchronizePropertyCalendars(
    propertySlug,
    normalized.force ?? false,
    normalized.persist ?? false,
  );
  const repository = new SupabaseCalendarRepository();
  const [internalBlocks, lastKnown] = isDatabaseConfigured()
    ? await Promise.all([
        repository.listOutboundBlocks(propertySlug),
        repository.lastKnownExternalState(propertySlug),
      ])
    : [[], { providers: [], blocks: [] }];
  const requiredProviders = ["airbnb", "booking"] as const;
  const configuredProviders = new Set(
    getCalendarConfigurationStatus()
      .filter((source) => source.propertySlug === propertySlug && source.configured)
      .map((source) => source.provider),
  );
  const failedProviders = calendar.results
    .filter((result) => result.status === "error")
    .map((result) => result.provider);
  const reliable = requiredProviders.every((provider) => {
    const live = calendar.results.some(
      (result) => result.provider === provider && result.status === "success",
    );
    const snapshot = lastKnown.providers.some(
      (state) => state.provider === provider && state.hasSnapshot,
    );
    return (configuredProviders.has(provider) && live) || snapshot;
  });
  return {
    propertySlug,
    generatedAt: new Date().toISOString(),
    blocks: [
      ...calendar.blocks.map((block) => ({
        startsOn: dateOnly(block.startsAt),
        endsOn: dateOnly(block.endsAt),
        status: block.status,
        source: block.sourceId,
      })),
      ...internalBlocks.map((block) => ({
        id: block.id,
        startsOn: block.startsOn,
        endsOn: block.endsOn,
        status: "confirmed" as const,
        source: block.source,
      })),
      ...lastKnown.blocks.map((block) => ({
        ...block,
        status: block.status as "confirmed" | "tentative",
      })),
    ],
    sources: calendar.results,
    reliable,
    usingLastKnownState:
      reliable &&
      (failedProviders.length > 0 ||
        requiredProviders.some((provider) => !configuredProviders.has(provider))),
  };
}
