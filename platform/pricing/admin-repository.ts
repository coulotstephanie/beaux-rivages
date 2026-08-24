import "server-only";

import type { PropertySlug } from "@/platform/calendar/config";
import { getDatabaseClient } from "@/platform/database/client";

type PricingEntity = "season" | "promotion" | "option" | "pricing_rule" | "rate_override";

export type PricingMutation =
  | { action: "arrival-days"; propertySlug: PropertySlug; weekdays: number[] }
  | { action: "gap-optimization"; propertySlug: PropertySlug; enabled: boolean }
  | {
      action: "season";
      propertySlug: PropertySlug;
      name: string;
      kind: "low" | "mid" | "high" | "custom";
      startsOn: string;
      endsOn: string;
      nightlyRate: number;
      minimumNights: number;
      replaceOverrides?: boolean;
    }
  | {
      action: "season-update";
      propertySlug: PropertySlug;
      id: string;
      name: string;
      kind: "low" | "mid" | "high" | "custom";
      startsOn: string;
      endsOn: string;
      nightlyRate: number;
      minimumNights: number;
      replaceOverrides?: boolean;
    }
  | { action: "season-delete"; propertySlug: PropertySlug; id: string }
  | {
      action: "promotion";
      propertySlug: PropertySlug;
      name: string;
      kind: "seasonal" | "code";
      percentage: number;
      fixedAmount?: number;
      startsOn: string;
      endsOn: string;
      code?: string;
    }
  | {
      action: "promotion-update";
      propertySlug: PropertySlug;
      id: string;
      name: string;
      percentage: number;
      fixedAmount?: number;
      startsOn: string;
      endsOn: string;
    }
  | { action: "promotion-toggle"; propertySlug: PropertySlug; id: string; enabled: boolean }
  | { action: "promotion-delete"; propertySlug: PropertySlug; id: string }
  | {
      action: "option";
      propertySlug: PropertySlug;
      code: string;
      price: number;
      enabled: boolean;
    }
  | {
      action: "copy-year";
      propertySlug: PropertySlug;
      fromYear: number;
      toYear: number;
    }
  | {
      action: "copy-property";
      propertySlug: PropertySlug;
      targetPropertySlug: PropertySlug;
    }
  | {
      action: "undo";
      propertySlug: PropertySlug;
      changeId: string;
    };

type UntypedClient = {
  // New pricing tables are introduced by the migration in this sprint and are not yet present in
  // the generated production types. This boundary disappears after `npm run db:types` is run.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from(table: string): any;
};

export class PricingAdminRepository {
  private db = getDatabaseClient() as unknown as UntypedClient;

  private async property(propertySlug: PropertySlug) {
    const result = await this.db
      .from("properties")
      .select("id,name")
      .eq("slug", propertySlug)
      .single();
    if (result.error) throw new Error(`PRICING_PROPERTY_FAILED:${result.error.code}`);
    return result.data as { id: string; name: string };
  }

  private async audit(input: {
    propertyId: string;
    entityType: PricingEntity;
    entityId?: string;
    action: "create" | "update" | "delete" | "copy";
    previousValue?: unknown;
    newValue: unknown;
    userId: string;
  }) {
    const result = await this.db.from("pricing_change_log").insert({
      property_id: input.propertyId,
      entity_type: input.entityType,
      entity_id: input.entityId ?? null,
      action: input.action,
      previous_value: input.previousValue ?? null,
      new_value: input.newValue,
      changed_by: input.userId,
    });
    if (result.error) throw new Error(`PRICING_AUDIT_FAILED:${result.error.code}`);
  }

  async snapshot(propertySlug: PropertySlug) {
    const property = await this.property(propertySlug);
    const [seasons, promotions, options, rules, history, connections, overrides] =
      await Promise.all([
        this.db
          .from("seasons")
          .select("*,rates(*)")
          .eq("property_id", property.id)
          .order("begins_on"),
        this.db
          .from("promotions")
          .select("*")
          .eq("property_id", property.id)
          .order("created_at", { ascending: false }),
        this.db
          .from("property_options")
          .select("price_cents,enabled,options(code,name,pricing_mode)")
          .eq("property_id", property.id),
        this.db
          .from("property_pricing_rules")
          .select("allowed_arrival_weekdays,optimize_calendar_gaps,updated_at")
          .eq("property_id", property.id)
          .maybeSingle(),
        this.db
          .from("pricing_change_log")
          .select("id,entity_type,action,previous_value,new_value,changed_at,changed_by")
          .eq("property_id", property.id)
          .order("changed_at", { ascending: false })
          .limit(50),
        this.db
          .from("rate_distribution_connections")
          .select("provider,status,last_synchronization_at,automatic_push_enabled")
          .eq("property_id", property.id)
          .order("provider"),
        this.db
          .from("rate_overrides")
          .select("id,begins_on,ends_on,name")
          .eq("property_id", property.id)
          .eq("enabled", true),
      ]);
    const failure = [seasons, promotions, options, rules, history, connections, overrides].find(
      (item) => item.error,
    );
    if (failure?.error) throw new Error(`PRICING_CENTER_READ_FAILED:${failure.error.code}`);
    return {
      property,
      seasons: seasons.data ?? [],
      promotions: promotions.data ?? [],
      options: options.data ?? [],
      rules: rules.data ?? { allowed_arrival_weekdays: [1, 2, 3, 4, 5, 6, 7] },
      history: history.data ?? [],
      connections: connections.data ?? [],
      overrides: overrides.data ?? [],
    };
  }

  async mutate(input: PricingMutation, userId: string) {
    const property = await this.property(input.propertySlug);
    if (input.action === "undo") {
      const change = await this.db
        .from("pricing_change_log")
        .select("*")
        .eq("id", input.changeId)
        .eq("property_id", property.id)
        .single();
      if (change.error) throw new Error(`PRICING_HISTORY_FAILED:${change.error.code}`);
      const row = change.data as {
        entity_type: string;
        entity_id: string | null;
        action: string;
        previous_value: Record<string, unknown> | null;
        new_value: Record<string, unknown> | null;
      };
      const table =
        row.entity_type === "season"
          ? "seasons"
          : row.entity_type === "promotion"
            ? "promotions"
            : row.entity_type === "option"
              ? "property_options"
              : row.entity_type === "pricing_rule"
                ? "property_pricing_rules"
                : row.entity_type === "rate_override"
                  ? "rate_overrides"
                  : null;
      if (!table) throw new Error("PRICING_UNDO_UNSUPPORTED");
      if (row.action === "create" && (row.entity_id || Array.isArray(row.new_value?.ids))) {
        const ids = Array.isArray(row.new_value?.ids) ? row.new_value.ids : [row.entity_id];
        const removed = await this.db.from(table).delete().in("id", ids);
        if (removed.error) throw new Error(`PRICING_UNDO_FAILED:${removed.error.code}`);
      } else if (row.previous_value) {
        const restored = await this.db.from(table).upsert(row.previous_value);
        if (restored.error) throw new Error(`PRICING_UNDO_FAILED:${restored.error.code}`);
      } else throw new Error("PRICING_UNDO_UNAVAILABLE");
      const audit = await this.db.from("pricing_change_log").insert({
        property_id: property.id,
        entity_type: row.entity_type,
        entity_id: row.entity_id,
        action: "restore",
        previous_value: row.new_value,
        new_value: row.previous_value,
        changed_by: userId,
      });
      if (audit.error) throw new Error(`PRICING_AUDIT_FAILED:${audit.error.code}`);
      return { restored: true };
    }
    if (input.action === "arrival-days") {
      const before = await this.db
        .from("property_pricing_rules")
        .select("*")
        .eq("property_id", property.id)
        .maybeSingle();
      const value = {
        property_id: property.id,
        allowed_arrival_weekdays: input.weekdays,
        updated_by: userId,
      };
      const saved = await this.db.from("property_pricing_rules").upsert(value).select("*").single();
      if (saved.error) throw new Error(`PRICING_RULE_WRITE_FAILED:${saved.error.code}`);
      await this.audit({
        propertyId: property.id,
        entityType: "pricing_rule",
        action: "update",
        previousValue: before.data,
        newValue: saved.data,
        userId,
      });
      return saved.data;
    }
    if (input.action === "gap-optimization") {
      const before = await this.db
        .from("property_pricing_rules")
        .select("*")
        .eq("property_id", property.id)
        .maybeSingle();
      const value = {
        property_id: property.id,
        optimize_calendar_gaps: input.enabled,
        updated_by: userId,
      };
      const saved = await this.db.from("property_pricing_rules").upsert(value).select("*").single();
      if (saved.error) throw new Error(`PRICING_RULE_WRITE_FAILED:${saved.error.code}`);
      await this.audit({
        propertyId: property.id,
        entityType: "pricing_rule",
        action: "update",
        previousValue: before.data,
        newValue: saved.data,
        userId,
      });
      return saved.data;
    }
    if (input.action === "option") {
      const option = await this.db.from("options").select("id").eq("code", input.code).single();
      if (option.error) throw new Error(`PRICING_OPTION_FAILED:${option.error.code}`);
      const before = await this.db
        .from("property_options")
        .select("*")
        .eq("property_id", property.id)
        .eq("option_id", option.data.id)
        .maybeSingle();
      const value = {
        property_id: property.id,
        option_id: option.data.id,
        price_cents: Math.round(input.price * 100),
        enabled: input.enabled,
      };
      const saved = await this.db.from("property_options").upsert(value).select("*").single();
      if (saved.error) throw new Error(`PRICING_OPTION_WRITE_FAILED:${saved.error.code}`);
      await this.audit({
        propertyId: property.id,
        entityType: "option",
        action: "update",
        previousValue: before.data,
        newValue: saved.data,
        userId,
      });
      return saved.data;
    }
    if (input.action === "season" || input.action === "season-update") {
      const previous =
        input.action === "season-update"
          ? await this.db
              .from("seasons")
              .select("*,rates(*)")
              .eq("id", input.id)
              .eq("property_id", property.id)
              .single()
          : { data: null, error: null };
      if (previous.error) throw new Error(`PRICING_SEASON_READ_FAILED:${previous.error.code}`);
      if (input.replaceOverrides) {
        const removedOverrides = await this.db
          .from("rate_overrides")
          .delete()
          .eq("property_id", property.id)
          .lte("begins_on", input.endsOn)
          .gte("ends_on", input.startsOn);
        if (removedOverrides.error)
          throw new Error(`PRICING_OVERRIDE_DELETE_FAILED:${removedOverrides.error.code}`);
      }
      if (input.action === "season-update") {
        const season = await this.db
          .from("seasons")
          .update({
            name: input.name,
            kind: input.kind,
            begins_on: input.startsOn,
            ends_on: input.endsOn,
            minimum_nights: input.minimumNights,
          })
          .eq("id", input.id)
          .eq("property_id", property.id)
          .select("*")
          .single();
        if (season.error) throw new Error(`PRICING_SEASON_WRITE_FAILED:${season.error.code}`);
        const rate = await this.db
          .from("rates")
          .update({
            name: input.name,
            nightly_rate_cents: Math.round(input.nightlyRate * 100),
            minimum_nights: input.minimumNights,
          })
          .eq("season_id", input.id)
          .eq("property_id", property.id)
          .select("*")
          .single();
        if (rate.error) throw new Error(`PRICING_SEASON_RATE_FAILED:${rate.error.code}`);
        await this.audit({
          propertyId: property.id,
          entityType: "season",
          entityId: input.id,
          action: "update",
          previousValue: previous.data,
          newValue: { ...season.data, rates: [rate.data] },
          userId,
        });
        return season.data;
      }
      const season = await this.db
        .from("seasons")
        .insert({
          property_id: property.id,
          name: input.name,
          kind: input.kind,
          begins_on: input.startsOn,
          ends_on: input.endsOn,
          minimum_nights: input.minimumNights,
        })
        .select("id")
        .single();
      if (season.error) throw new Error(`PRICING_SEASON_WRITE_FAILED:${season.error.code}`);
      const rate = await this.db
        .from("rates")
        .insert({
          property_id: property.id,
          season_id: season.data.id,
          name: input.name,
          nightly_rate_cents: Math.round(input.nightlyRate * 100),
          minimum_nights: input.minimumNights,
        })
        .select("*")
        .single();
      if (rate.error) throw new Error(`PRICING_SEASON_RATE_FAILED:${rate.error.code}`);
      await this.audit({
        propertyId: property.id,
        entityType: "season",
        entityId: season.data.id,
        action: "create",
        newValue: { ...input, id: season.data.id },
        userId,
      });
      return { id: season.data.id };
    }
    if (input.action === "season-delete") {
      const previous = await this.db
        .from("seasons")
        .select("*,rates(*)")
        .eq("id", input.id)
        .eq("property_id", property.id)
        .single();
      if (previous.error) throw new Error(`PRICING_SEASON_READ_FAILED:${previous.error.code}`);
      const removed = await this.db
        .from("seasons")
        .delete()
        .eq("id", input.id)
        .eq("property_id", property.id);
      if (removed.error) throw new Error(`PRICING_SEASON_DELETE_FAILED:${removed.error.code}`);
      await this.audit({
        propertyId: property.id,
        entityType: "season",
        entityId: input.id,
        action: "delete",
        previousValue: previous.data,
        newValue: { deleted: true },
        userId,
      });
      return { deleted: true };
    }
    if (input.action === "promotion") {
      const value = {
        property_id: property.id,
        name: input.name,
        kind: input.kind,
        percentage: input.fixedAmount ? 0 : input.percentage,
        fixed_discount_cents: input.fixedAmount ? Math.round(input.fixedAmount * 100) : null,
        code: input.code?.toUpperCase() || null,
        valid_range: `[${input.startsOn},${input.endsOn})`,
        enabled: true,
      };
      const saved = await this.db.from("promotions").insert(value).select("*").single();
      if (saved.error) throw new Error(`PRICING_PROMOTION_WRITE_FAILED:${saved.error.code}`);
      await this.audit({
        propertyId: property.id,
        entityType: "promotion",
        entityId: saved.data.id,
        action: "create",
        newValue: saved.data,
        userId,
      });
      return saved.data;
    }
    if (input.action === "promotion-update" || input.action === "promotion-toggle") {
      const previous = await this.db
        .from("promotions")
        .select("*")
        .eq("id", input.id)
        .eq("property_id", property.id)
        .single();
      if (previous.error) throw new Error(`PRICING_PROMOTION_READ_FAILED:${previous.error.code}`);
      const value =
        input.action === "promotion-toggle"
          ? { enabled: input.enabled }
          : {
              name: input.name,
              percentage: input.fixedAmount ? 0 : input.percentage,
              fixed_discount_cents: input.fixedAmount ? Math.round(input.fixedAmount * 100) : null,
              valid_range: `[${input.startsOn},${input.endsOn})`,
            };
      const saved = await this.db
        .from("promotions")
        .update(value)
        .eq("id", input.id)
        .eq("property_id", property.id)
        .select("*")
        .single();
      if (saved.error) throw new Error(`PRICING_PROMOTION_WRITE_FAILED:${saved.error.code}`);
      await this.audit({
        propertyId: property.id,
        entityType: "promotion",
        entityId: input.id,
        action: "update",
        previousValue: previous.data,
        newValue: saved.data,
        userId,
      });
      return saved.data;
    }
    if (input.action === "promotion-delete") {
      const previous = await this.db
        .from("promotions")
        .select("*")
        .eq("id", input.id)
        .eq("property_id", property.id)
        .single();
      if (previous.error) throw new Error(`PRICING_PROMOTION_READ_FAILED:${previous.error.code}`);
      const removed = await this.db
        .from("promotions")
        .delete()
        .eq("id", input.id)
        .eq("property_id", property.id);
      if (removed.error) throw new Error(`PRICING_PROMOTION_DELETE_FAILED:${removed.error.code}`);
      await this.audit({
        propertyId: property.id,
        entityType: "promotion",
        entityId: input.id,
        action: "delete",
        previousValue: previous.data,
        newValue: { deleted: true },
        userId,
      });
      return { deleted: true };
    }
    if (input.action === "copy-property") {
      const target = await this.property(input.targetPropertySlug);
      const source = await this.snapshot(input.propertySlug);
      for (const option of source.options) {
        if (!option.options) continue;
        await this.mutate(
          {
            action: "option",
            propertySlug: input.targetPropertySlug,
            code: option.options.code,
            price: option.price_cents / 100,
            enabled: option.enabled,
          },
          userId,
        );
      }
      await this.mutate(
        {
          action: "arrival-days",
          propertySlug: input.targetPropertySlug,
          weekdays: source.rules.allowed_arrival_weekdays,
        },
        userId,
      );
      let copiedSeasons = 0;
      for (const season of source.seasons) {
        const rate = season.rates?.[0];
        if (!rate) continue;
        await this.mutate(
          {
            action: "season",
            propertySlug: input.targetPropertySlug,
            name: season.name,
            kind: season.kind,
            startsOn: season.begins_on,
            endsOn: season.ends_on,
            nightlyRate: rate.nightly_rate_cents / 100,
            minimumNights: rate.minimum_nights ?? season.minimum_nights ?? 1,
          },
          userId,
        );
        copiedSeasons += 1;
      }
      await this.audit({
        propertyId: target.id,
        entityType: "pricing_rule",
        action: "copy",
        newValue: {
          sourceProperty: input.propertySlug,
          copiedOptions: source.options.length,
          copiedSeasons,
        },
        userId,
      });
      return { copiedOptions: source.options.length, copiedSeasons };
    }
    const delta = input.toYear - input.fromYear;
    const source = await this.db
      .from("seasons")
      .select("*,rates(*)")
      .eq("property_id", property.id)
      .gte("begins_on", `${input.fromYear}-01-01`)
      .lte("ends_on", `${input.fromYear}-12-31`);
    if (source.error) throw new Error(`PRICING_COPY_READ_FAILED:${source.error.code}`);
    let copied = 0;
    for (const season of source.data ?? []) {
      const shift = (value: string) => `${Number(value.slice(0, 4)) + delta}${value.slice(4)}`;
      const rate = season.rates?.[0];
      if (!rate) continue;
      await this.mutate(
        {
          action: "season",
          propertySlug: input.propertySlug,
          name: `${season.name} ${input.toYear}`,
          kind: season.kind,
          startsOn: shift(season.begins_on),
          endsOn: shift(season.ends_on),
          nightlyRate: rate.nightly_rate_cents / 100,
          minimumNights: rate.minimum_nights ?? season.minimum_nights ?? 1,
        },
        userId,
      );
      copied += 1;
    }
    return { copied };
  }
}
