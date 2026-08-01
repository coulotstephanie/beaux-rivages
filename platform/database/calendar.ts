import "server-only";
import type {
  CalendarBlock,
  CalendarProvider,
  CalendarSyncResult,
} from "@/platform/calendar/contracts";
import { getDatabaseClient } from "./client";
import type { Database, Json } from "./database.types";

type OccupancySource = Database["public"]["Enums"]["occupancy_source"];
function toOccupancySource(provider: CalendarProvider): OccupancySource | null {
  if (provider === "channel-manager") return "channel_manager";
  if (provider === "other") return null;
  return provider;
}

export class SupabaseCalendarRepository {
  async lastKnownExternalState(propertySlug: string) {
    const client = getDatabaseClient();
    const { data: property, error: propertyError } = await client
      .from("properties")
      .select("id")
      .eq("slug", propertySlug)
      .maybeSingle();
    if (propertyError || !property) throw new Error("CALENDAR_PROPERTY_NOT_FOUND");
    const { data: sources, error: sourcesError } = await client
      .from("calendar_sources")
      .select("id,provider,last_synced_at,enabled")
      .eq("property_id", property.id)
      .eq("enabled", true);
    if (sourcesError) throw new Error(`CALENDAR_STATE_FAILED:${sourcesError.code}`);
    const sourceIds = (sources ?? []).map((source) => source.id);
    const { data: events, error: eventsError } = sourceIds.length
      ? await client
          .from("calendar_events")
          .select("id,source_id,arrival,departure,status")
          .in("source_id", sourceIds)
          .neq("status", "cancelled")
          .gte("departure", new Date().toISOString().slice(0, 10))
          .limit(5000)
      : { data: [], error: null };
    if (eventsError) throw new Error(`CALENDAR_STATE_FAILED:${eventsError.code}`);
    const providerBySource = new Map(
      (sources ?? []).map((source) => [source.id, String(source.provider)]),
    );
    return {
      providers: (sources ?? []).map((source) => ({
        provider: String(source.provider),
        hasSnapshot: Boolean(source.last_synced_at),
      })),
      blocks: (events ?? []).map((event) => ({
        id: String(event.id),
        startsOn: String(event.arrival),
        endsOn: String(event.departure),
        status: String(event.status),
        source: providerBySource.get(event.source_id) ?? "external",
      })),
    };
  }

  async listOutboundBlocks(propertySlug: string) {
    const client = getDatabaseClient();
    const { data: property, error: propertyError } = await client
      .from("properties")
      .select("id")
      .eq("slug", propertySlug)
      .maybeSingle();
    if (propertyError || !property) throw new Error("CALENDAR_PROPERTY_NOT_FOUND");
    const { data, error } = await client
      .from("occupancy_blocks")
      .select("id,stay_range,source,note")
      .eq("property_id", property.id)
      .in("source", ["reservation", "manual"])
      .order("created_at", { ascending: true })
      .limit(5000);
    if (error) throw new Error(`CALENDAR_EXPORT_FAILED:${error.code}`);
    return (data ?? []).flatMap((row) => {
      const match = String(row.stay_range).match(
        /[[(](\d{4}-\d{2}-\d{2}),(\d{4}-\d{2}-\d{2})[)\]]/,
      );
      return match
        ? [
            {
              id: String(row.id),
              startsOn: match[1],
              endsOn: match[2],
              source: String(row.source),
              note: row.note ? String(row.note) : null,
            },
          ]
        : [];
    });
  }

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
    if (input.status === "error") {
      const entityId = `${input.propertySlug}:${input.provider}`;
      const { data: existing } = await client
        .from("back_office_notifications")
        .select("id")
        .eq("entity_type", "calendar_source")
        .eq("entity_id", entityId)
        .is("dismissed_at", null)
        .limit(1);
      if (!existing?.length) {
        await client.from("back_office_notifications").insert({
          kind: "system",
          title: "Synchronisation calendrier indisponible",
          body: `${input.propertySlug} · ${input.provider}. Le dernier état fiable est conservé et la réservation directe est suspendue s’il n’existe pas.`,
          priority: "urgent",
          entity_type: "calendar_source",
          entity_id: entityId,
        });
      }
    }
  }

  async replaceEvents(
    propertySlug: string,
    provider: CalendarProvider,
    blocks: CalendarBlock[],
    syncedAt: string,
  ) {
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
