import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import type { z } from "zod";
import type { rateOverrideBatchSchema, rateOverrideSchema } from "../schemas";
import { planDailyRateOverrideWrites } from "../rate-override-plan";

type RateOverrideInput = z.infer<typeof rateOverrideSchema>;
type RateOverrideBatchInput = z.infer<typeof rateOverrideBatchSchema>;

export class RateOverrideRepository {
  private client = getDatabaseClient();

  private async propertyId(propertySlug: RateOverrideInput["propertySlug"]) {
    const { data, error } = await this.client
      .from("properties")
      .select("id")
      .eq("slug", propertySlug)
      .single();
    if (error) throw new Error(`RATE_PROPERTY_FAILED:${error.code}`);
    return data.id;
  }

  private writeError(error: { code?: string }) {
    if (error.code === "23514") throw new Error("RATE_OUTSIDE_GUARDRAILS");
    throw new Error(`RATE_OVERRIDE_WRITE_FAILED:${error.code ?? "UNKNOWN"}`);
  }

  async create(input: RateOverrideInput, userId?: string) {
    const propertyId = await this.propertyId(input.propertySlug);
    const previous = await this.client
      .from("rate_overrides")
      .select("id,begins_on,ends_on,kind,name,nightly_rate_cents,minimum_nights,updated_at")
      .eq("property_id", propertyId)
      .eq("begins_on", input.start)
      .eq("ends_on", input.end)
      .eq("kind", input.kind)
      .eq("enabled", true)
      .order("updated_at", { ascending: false });
    if (previous.error) throw new Error(`RATE_OVERRIDE_READ_FAILED:${previous.error.code}`);

    const current = previous.data[0];
    const values = {
      property_id: propertyId,
      name: input.name,
      kind: input.kind,
      begins_on: input.start,
      ends_on: input.end,
      nightly_rate_cents: Math.round(input.nightlyRate * 100),
      minimum_nights: input.minimumNights ?? null,
      updated_by: userId ?? null,
    };
    const query = current
      ? this.client.from("rate_overrides").update(values).eq("id", current.id)
      : this.client.from("rate_overrides").insert({ ...values, created_by: userId ?? null });
    const saved = await query.select("id").single();
    if (saved.error) this.writeError(saved.error);
    if (!saved.data) throw new Error("RATE_OVERRIDE_WRITE_FAILED:NO_DATA");

    const duplicateIds = previous.data.slice(1).map((row) => row.id);
    if (duplicateIds.length) {
      const disabled = await this.client
        .from("rate_overrides")
        .update({ enabled: false, updated_by: userId ?? null })
        .in("id", duplicateIds);
      if (disabled.error) this.writeError(disabled.error);
    }

    if (userId) {
      const audit = await this.client.from("pricing_change_log" as "properties").insert({
        property_id: propertyId,
        entity_type: "rate_override",
        entity_id: saved.data.id,
        action: current ? "update" : "create",
        previous_value: current ?? null,
        new_value: input,
        changed_by: userId,
      } as never);
      if (audit.error) throw new Error(`PRICING_AUDIT_FAILED:${audit.error.code}`);
    }
    return saved.data;
  }

  async createBatch(input: RateOverrideBatchInput, userId?: string) {
    const propertyId = await this.propertyId(input.propertySlug);
    let minimumRate = 0;
    if (input.importMode === "csv") {
      const guardrail = await this.client
        .from("rate_guardrails")
        .select("minimum_rate_cents")
        .eq("property_id", propertyId)
        .single();
      if (guardrail.error) throw new Error(`RATE_GUARDRAIL_READ_FAILED:${guardrail.error.code}`);
      minimumRate = guardrail.data.minimum_rate_cents / 100;
    }
    const entries = input.entries.map((entry) => ({
      ...entry,
      sourceNightlyRate: entry.nightlyRate,
      nightlyRate:
        input.importMode === "csv" ? Math.max(entry.nightlyRate, minimumRate) : entry.nightlyRate,
    }));
    const dates = [...new Set(entries.map((entry) => entry.date))];
    const previous = await this.client
      .from("rate_overrides")
      .select("id,begins_on,ends_on,kind,name,nightly_rate_cents,minimum_nights,updated_at")
      .eq("property_id", propertyId)
      .eq("enabled", true)
      .in("begins_on", dates);
    if (previous.error) throw new Error(`RATE_OVERRIDE_READ_FAILED:${previous.error.code}`);

    const plan = planDailyRateOverrideWrites(previous.data, entries, input.kind);
    const row = (entry: RateOverrideBatchInput["entries"][number]) => ({
      property_id: propertyId,
      name: input.name,
      kind: input.kind,
      begins_on: entry.date,
      ends_on: entry.date,
      nightly_rate_cents: Math.round(entry.nightlyRate * 100),
      minimum_nights: entry.minimumNights ?? null,
      updated_by: userId ?? null,
    });

    const updatedIds: string[] = [];
    for (const update of plan.updates) {
      const saved = await this.client
        .from("rate_overrides")
        .update(row(update.entry))
        .eq("id", update.id)
        .select("id")
        .single();
      if (saved.error) this.writeError(saved.error);
      if (!saved.data) throw new Error("RATE_OVERRIDE_WRITE_FAILED:NO_DATA");
      updatedIds.push(saved.data.id);
    }

    let insertedIds: string[] = [];
    if (plan.inserts.length) {
      const inserted = await this.client
        .from("rate_overrides")
        .insert(plan.inserts.map((entry) => ({ ...row(entry), created_by: userId ?? null })))
        .select("id");
      if (inserted.error) this.writeError(inserted.error);
      insertedIds = (inserted.data ?? []).map((item) => item.id);
    }

    if (plan.disableIds.length) {
      const disabled = await this.client
        .from("rate_overrides")
        .update({ enabled: false, updated_by: userId ?? null })
        .in("id", plan.disableIds);
      if (disabled.error) this.writeError(disabled.error);
    }

    if (userId) {
      const audit = await this.client.from("pricing_change_log" as "properties").insert({
        property_id: propertyId,
        entity_type: "rate_override",
        entity_id: null,
        action: plan.updates.length ? "update" : "create",
        previous_value: previous.data,
        new_value: {
          name: input.name,
          kind: input.kind,
          import_mode: input.importMode ?? null,
          entries,
          guardrail: input.importMode === "csv" ? { minimum_rate: minimumRate } : null,
          guardrail_applied_count: entries.filter(
            (entry) => entry.nightlyRate !== entry.sourceNightlyRate,
          ).length,
          ids: [...updatedIds, ...insertedIds],
          disabled_duplicate_ids: plan.disableIds,
        },
        changed_by: userId,
      } as never);
      if (audit.error) throw new Error(`PRICING_AUDIT_FAILED:${audit.error.code}`);
    }
    return {
      count: entries.length,
      updated: updatedIds.length,
      created: insertedIds.length,
      guardrailApplied: entries.filter((entry) => entry.nightlyRate !== entry.sourceNightlyRate)
        .length,
      minimumRate: input.importMode === "csv" ? minimumRate : null,
    };
  }
}
