import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import { SupabasePricingPlanReader } from "@/platform/database/pricing";
import { recommendRate } from "./engine";
import type { YieldAction } from "./schemas";
import type { YieldFactor, YieldSnapshot } from "./contracts";
type Row = Record<string, unknown>;
const range = (value: string) => {
  const m = value.match(/\[(\d{4}-\d{2}-\d{2}),(\d{4}-\d{2}-\d{2})\)/);
  return m ? { start: m[1], end: m[2] } : null;
};
const day = (d: Date) => d.toISOString().slice(0, 10);
export class YieldRepository {
  private client = getDatabaseClient();
  async snapshot(): Promise<YieldSnapshot> {
    const [strategies, recommendations, events, logs, properties] = await Promise.all([
      this.client.from("yield_strategies").select("*"),
      this.client.from("yield_recommendations").select("*").order("stay_date").limit(1000),
      this.client.from("demand_events").select("*").order("date_range"),
      this.client
        .from("yield_decision_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      this.client.from("properties").select("id,name,slug"),
    ]);
    const failed = [strategies, recommendations, events, logs, properties].find((r) => r.error);
    if (failed?.error) throw new Error(`YIELD_READ_FAILED:${failed.error.code}`);
    const props = new Map(((properties.data ?? []) as Row[]).map((r) => [String(r.id), r]));
    const rec = (recommendations.data ?? []) as Row[];
    const pending = rec.filter((r) => r.status === "pending");
    return {
      generatedAt: new Date().toISOString(),
      metrics: {
        pending: pending.length,
        accepted: rec.filter((r) => r.status === "accepted").length,
        rejected: rec.filter((r) => r.status === "rejected").length,
        averageChange: pending.length
          ? Math.round(
              (pending.reduce(
                (s, r) =>
                  s + (Number(r.recommended_rate_cents) / Number(r.base_rate_cents) - 1) * 100,
                0,
              ) /
                pending.length) *
                10,
            ) / 10
          : 0,
        projectedRevenueImpactCents: pending.reduce(
          (s, r) => s + Number(r.recommended_rate_cents) - Number(r.base_rate_cents),
          0,
        ),
      },
      strategies: ((strategies.data ?? []) as Row[]).map((r) => ({
        id: String(r.id),
        propertyId: String(r.property_id),
        propertyName: String(props.get(String(r.property_id))?.name ?? "Maison"),
        minimumRateCents: Number(r.minimum_rate_cents),
        maximumRateCents: Number(r.maximum_rate_cents),
        targetOccupancy: Number(r.target_occupancy),
        lastMinuteDays: Number(r.last_minute_days),
        earlyBookingDays: Number(r.early_booking_days),
        enabled: Boolean(r.enabled),
      })),
      recommendations: rec.map((r) => ({
        id: String(r.id),
        propertyId: String(r.property_id),
        propertyName: String(props.get(String(r.property_id))?.name ?? "Maison"),
        stayDate: String(r.stay_date),
        baseRateCents: Number(r.base_rate_cents),
        recommendedRateCents: Number(r.recommended_rate_cents),
        occupancyRate: Number(r.occupancy_rate),
        leadDays: Number(r.lead_days),
        factors: Array.isArray(r.factors) ? (r.factors as YieldFactor[]) : [],
        confidence: Number(r.confidence),
        status: String(r.status),
        decisionNote: String(r.decision_note ?? ""),
        createdAt: String(r.created_at),
      })),
      events: ((events.data ?? []) as Row[]).map((r) => ({
        id: String(r.id),
        name: String(r.name),
        kind: String(r.kind),
        range: String(r.date_range),
        impactPercentage: Number(r.impact_percentage),
        source: String(r.source ?? ""),
      })),
      logs: ((logs.data ?? []) as Row[]).map((r) => ({
        id: String(r.id),
        action: String(r.action),
        actor: String(r.actor),
        createdAt: String(r.created_at),
      })),
    };
  }
  async execute(input: YieldAction) {
    if (input.action === "update_strategy") {
      const { data, error } = await this.client
        .from("yield_strategies")
        .update({
          minimum_rate_cents: input.minimumRateCents,
          maximum_rate_cents: input.maximumRateCents,
          target_occupancy: input.targetOccupancy,
          enabled: input.enabled,
        })
        .eq("id", input.strategyId)
        .select("id")
        .single();
      if (error) throw new Error(`YIELD_STRATEGY_FAILED:${error.code}`);
      return data;
    }
    if (input.action === "decide") {
      const { data: rec, error: readError } = await this.client
        .from("yield_recommendations")
        .select("*")
        .eq("id", input.recommendationId)
        .eq("status", "pending")
        .single();
      if (readError) throw new Error(`YIELD_RECOMMENDATION_NOT_FOUND:${readError.code}`);
      if (input.decision === "accepted") {
        const { error } = await this.client
          .from("yield_rate_overrides")
          .upsert(
            {
              property_id: rec.property_id,
              recommendation_id: rec.id,
              stay_date: rec.stay_date,
              nightly_rate_cents: rec.recommended_rate_cents,
              status: "active",
            },
            { onConflict: "property_id,stay_date" },
          );
        if (error) throw new Error(`YIELD_OVERRIDE_FAILED:${error.code}`);
      }
      const now = new Date().toISOString();
      await this.client
        .from("yield_recommendations")
        .update({
          status: input.decision,
          decision_note: input.note ?? null,
          decided_by: "admin",
          decided_at: now,
        })
        .eq("id", rec.id);
      await this.client
        .from("yield_decision_logs")
        .insert({
          recommendation_id: rec.id,
          action: input.decision,
          actor: "admin",
          before_data: { status: "pending" },
          after_data: { status: input.decision, note: input.note },
        });
      return { id: rec.id };
    }
    const { data: strategy, error: strategyError } = await this.client
      .from("yield_strategies")
      .select("*,properties(slug)")
      .eq("property_id", input.propertyId)
      .single();
    if (strategyError) throw new Error(`YIELD_STRATEGY_NOT_FOUND:${strategyError.code}`);
    const slug = String((strategy.properties as unknown as Row).slug) as
      "chai-des-tortues" | "villa-raie-manta" | "nid-d-ete";
    const plan = await new SupabasePricingPlanReader().get(slug);
    const start = new Date();
    start.setUTCHours(12, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + input.days);
    const [startDate, endDate] = [day(start), day(end)];
    const [blocksResult, eventsResult] = await Promise.all([
      this.client.from("occupancy_blocks").select("stay_range").eq("property_id", input.propertyId),
      this.client
        .from("demand_events")
        .select("*")
        .overlaps("date_range", `[${startDate},${endDate})`),
    ]);
    if (blocksResult.error || eventsResult.error) throw new Error("YIELD_CONTEXT_FAILED");
    const blocks = ((blocksResult.data ?? []) as Row[])
      .map((r) => range(String(r.stay_range)))
      .filter(Boolean) as { start: string; end: string }[];
    const events = (eventsResult.data ?? []) as Row[];
    const records = [];
    for (let index = 0; index < input.days; index++) {
      const date = new Date(start);
      date.setUTCDate(date.getUTCDate() + index);
      const stayDate = day(date);
      const windowEnd = new Date(date);
      windowEnd.setUTCDate(windowEnd.getUTCDate() + 30);
      let occupied = 0;
      for (let i = 0; i < 30; i++) {
        const cursor = new Date(date);
        cursor.setUTCDate(cursor.getUTCDate() + i);
        const current = day(cursor);
        if (blocks.some((b) => current >= b.start && current < b.end)) occupied++;
      }
      const occupancy = Math.round((occupied / 30) * 100);
      const season = plan.seasons
        .filter((s) => stayDate >= s.startsOn && stayDate < s.endsOn)
        .sort((a, b) => b.nightlyRate - a.nightlyRate)[0];
      const weekend = [5, 6].includes(date.getUTCDay());
      const base = Math.round(
        (season?.nightlyRate ?? (weekend ? plan.weekendNightlyRate : plan.baseNightlyRate)) * 100,
      );
      const event = events.find((e) => {
        const r = range(String(e.date_range));
        return r && stayDate >= r.start && stayDate < r.end;
      });
      const proposal = recommendRate({
        baseRateCents: base,
        minimumRateCents: Number(strategy.minimum_rate_cents),
        maximumRateCents: Number(strategy.maximum_rate_cents),
        occupancyRate: occupancy,
        targetOccupancy: Number(strategy.target_occupancy),
        leadDays: index,
        isWeekend: weekend,
        eventImpactPercentage: Number(event?.impact_percentage ?? 0),
        eventName: event ? String(event.name) : undefined,
        maximumIncreasePercentage: Number(strategy.maximum_increase_percentage),
        maximumDecreasePercentage: Number(strategy.maximum_decrease_percentage),
        occupancyWeight: Number(strategy.occupancy_weight),
        leadTimeWeight: Number(strategy.lead_time_weight),
        eventWeight: Number(strategy.event_weight),
      });
      records.push({
        property_id: input.propertyId,
        stay_date: stayDate,
        base_rate_cents: base,
        recommended_rate_cents: proposal.recommendedRateCents,
        occupancy_rate: occupancy,
        lead_days: index,
        factors: proposal.factors,
        confidence: proposal.confidence,
        status: "pending",
      });
    }
    await this.client
      .from("yield_recommendations")
      .delete()
      .eq("property_id", input.propertyId)
      .eq("status", "pending");
    const { error } = await this.client.from("yield_recommendations").insert(records);
    if (error) throw new Error(`YIELD_GENERATION_FAILED:${error.code}`);
    await this.client
      .from("yield_decision_logs")
      .insert({
        action: "generated",
        actor: "admin",
        after_data: { propertyId: input.propertyId, count: records.length },
      });
    return { count: records.length };
  }
}
