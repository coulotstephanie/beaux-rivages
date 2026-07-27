import "server-only";
import type { CalendarBlock, CalendarProvider, CalendarSyncResult } from "@/platform/calendar/contracts";
import { getDatabaseClient } from "./client";
import type { Database, Json } from "./database.types";

type OccupancySource = Database["public"]["Enums"]["occupancy_source"];
function toOccupancySource(provider: CalendarProvider): OccupancySource | null {
  if (provider === "channel-manager") return "channel_manager";
  if (provider === "other") return null;
  return provider;
}

export class SupabaseCalendarRepository {
  async recordSync(input: CalendarSyncResult) {
    const client = getDatabaseClient();
    const provider = toOccupancySource(input.provider);
    if (!provider) return;
    const { data: source, error: sourceError } = await client
      .from("calendar_sources")
      .select("id,properties!inner(slug)")
      .eq("provider", provider)
      .eq("properties.slug", input.propertySlug)
      .maybeSingle();
    if (sourceError || !source) return;
    const { error } = await client.from("sync_runs").insert({
      source_id: source.id,
      status: input.status === "success" ? "success" : "failed",
      imported_count: input.imported,
      error_count: input.status === "error" ? 1 : 0,
      error_details: input.error ? [{ message: input.error.slice(0, 500) }] : [],
      started_at: input.syncedAt,
      completed_at: input.syncedAt,
    });
    if (error) throw new Error(`SYNC_RECORD_FAILED:${error.code}`);
  }

  async replaceEvents(propertySlug: string, provider: CalendarProvider, blocks: CalendarBlock[], syncedAt: string) {
    const occupancySource = toOccupancySource(provider);
    if (!occupancySource) throw new Error("CALENDAR_PROVIDER_UNSUPPORTED");
    const events = blocks.map((block) => ({
      uid: block.uid,
      status: block.status,
      arrival: block.startsAt.slice(0, 10),
      departure: block.endsAt.slice(0, 10),
      summary: block.summary?.slice(0, 200),
    }));
    const { error } = await getDatabaseClient().rpc("replace_calendar_events", {
      requested_property_slug: propertySlug,
      requested_provider: occupancySource,
      imported_events: events as Json,
      synced_at: syncedAt,
    });
    if (error) throw new Error(`CALENDAR_EVENT_UPSERT_FAILED:${error.code}`);
  }
}
