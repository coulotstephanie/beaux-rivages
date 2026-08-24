import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import type { PropertySlug } from "@/platform/calendar/config";
import { ratePlanRepository } from "@/platform/pricing/repository";
import { rateForDate } from "@/platform/pricing/service";
import {
  calculateChannelComparison,
  type BookingPromotionRule,
  type ChannelRule,
  type DatedChannelRules,
  type MarkupStrategy,
} from "@/platform/pricing/channels";
import { isInsideRollingWindow, minimumNightsForDate } from "@/platform/pricing/channels";
import { frenchStayReferenceCalendar } from "@/platform/calendar/french-reference-calendar";

type Row = Record<string, unknown>;
type Channel = "airbnb" | "booking";
type UntypedClient = {
  // Tables are introduced by the Tarifs & Canaux migration; regenerate generated types after deployment.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from(table: string): any;
};

const enumerate = (start: string, end: string) => {
  const days: string[] = [];
  const cursor = new Date(`${start}T12:00:00Z`);
  while (cursor.toISOString().slice(0, 10) <= end) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
};

const rule = (row: Row | undefined, channel: Channel): ChannelRule => ({
  channel,
  commissionPercentage: Number(row?.commission_percentage ?? 0),
  commissionAppliesToCleaning: row?.commission_applies_to_cleaning !== false,
  markupStrategy: String(row?.markup_strategy ?? "none") as MarkupStrategy,
  markupValue: Number(row?.markup_value ?? 0),
});

export class ChannelPricingRepository {
  private db = getDatabaseClient() as unknown as UntypedClient;

  private async propertyId(slug: PropertySlug) {
    const result = await this.db.from("properties").select("id,name").eq("slug", slug).single();
    if (result.error) throw new Error(`CHANNEL_PROPERTY_FAILED:${result.error.code}`);
    return result.data;
  }

  async calendar(slug: PropertySlug, start: string, end: string) {
    const dates = enumerate(start, end);
    const today = new Date().toISOString().slice(0, 10);
    if (
      !dates.length ||
      dates.length > 366 ||
      !isInsideRollingWindow(start, today) ||
      !isInsideRollingWindow(end, today)
    )
      throw new Error("CHANNEL_DATE_RANGE_INVALID");
    const [property, plan] = await Promise.all([
      this.propertyId(slug),
      ratePlanRepository.get(slug),
    ]);
    const referenceDays = await frenchStayReferenceCalendar(
      dates.map((date) => Number(date.slice(0, 4))),
    );
    const [settingsResult, promotionsResult, overridesResult] = await Promise.all([
      this.db
        .from("channel_pricing_settings")
        .select("*")
        .eq("property_id", property.id)
        .eq("enabled", true),
      this.db
        .from("booking_channel_promotions")
        .select("*")
        .eq("property_id", property.id)
        .order("priority", { ascending: false }),
      this.db
        .from("channel_rate_overrides")
        .select("channel,stay_date,nightly_rate_cents,reason")
        .eq("property_id", property.id)
        .eq("active", true)
        .gte("stay_date", start)
        .lte("stay_date", end),
    ]);
    const failed = [settingsResult, promotionsResult, overridesResult].find(
      (result) => result.error,
    );
    if (failed?.error) throw new Error(`CHANNEL_READ_FAILED:${failed.error.code}`);
    const settings = (settingsResult.data ?? []) as unknown as Row[];
    const airbnbPrevious = settings.find(
      (item) => item.channel === "airbnb" && item.mode === "previous",
    );
    const airbnbCurrent = settings.find(
      (item) => item.channel === "airbnb" && item.mode === "current",
    );
    const bookingCurrent = settings.find(
      (item) => item.channel === "booking" && item.mode === "current",
    );
    const airbnb: DatedChannelRules = {
      before: rule(airbnbPrevious, "airbnb"),
      after: rule(airbnbCurrent, "airbnb"),
      effectiveFrom: String(airbnbCurrent?.effective_from ?? "9999-12-31"),
    };
    const booking = rule(bookingCurrent, "booking");
    const bookingPromotions: BookingPromotionRule[] = (
      (promotionsResult.data ?? []) as unknown as Row[]
    ).map((item) => ({
      id: String(item.id),
      label: String(item.name),
      kind: String(item.kind) as BookingPromotionRule["kind"],
      enabled: Boolean(item.enabled),
      percentage: Number(item.percentage),
      startsOn: item.begins_on ? String(item.begins_on) : null,
      endsOn: item.ends_on ? String(item.ends_on) : null,
      stackable: Boolean(item.stackable),
      priority: Number(item.priority),
    }));
    const overrideMap = new Map(
      ((overridesResult.data ?? []) as unknown as Row[]).map((item) => [
        `${item.stay_date}:${item.channel}`,
        item,
      ]),
    );
    const days = dates.map((date) => {
      const master = rateForDate(plan, date);
      const airbnbOverride = overrideMap.get(`${date}:airbnb`);
      const bookingOverride = overrideMap.get(`${date}:booking`);
      const comparison = calculateChannelComparison({
        date,
        nights: 1,
        masterNightlyRate: master.rate,
        cleaningFee: plan.cleaningFee,
        airbnb,
        booking,
        bookingPromotions,
        manualNightlyOverrides: {
          ...(airbnbOverride ? { airbnb: Number(airbnbOverride.nightly_rate_cents) / 100 } : {}),
          ...(bookingOverride ? { booking: Number(bookingOverride.nightly_rate_cents) / 100 } : {}),
        },
      });
      return {
        date,
        season: master.season,
        minimumNights: minimumNightsForDate(date, master.minimumNights, referenceDays),
        cleaningFee: plan.cleaningFee,
        ...comparison,
      };
    });
    return {
      property: { slug, name: property.name },
      currency: "EUR" as const,
      start,
      end,
      settings: { airbnb, booking },
      promotions: bookingPromotions,
      days,
    };
  }

  async setChannelOverride(
    slug: PropertySlug,
    channel: Channel,
    date: string,
    nightlyRate: number,
    reason: string | undefined,
    userId: string,
  ) {
    const property = await this.propertyId(slug);
    const result = await this.db
      .from("channel_rate_overrides")
      .upsert(
        {
          property_id: property.id,
          channel,
          stay_date: date,
          nightly_rate_cents: Math.round(nightlyRate * 100),
          reason: reason ?? null,
          active: true,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "property_id,channel,stay_date" },
      );
    if (result.error) throw new Error(`CHANNEL_OVERRIDE_WRITE_FAILED:${result.error.code}`);
  }

  async deleteChannelOverride(slug: PropertySlug, channel: Channel, date: string, userId: string) {
    const property = await this.propertyId(slug);
    const result = await this.db
      .from("channel_rate_overrides")
      .update({ active: false, updated_by: userId, updated_at: new Date().toISOString() })
      .eq("property_id", property.id)
      .eq("channel", channel)
      .eq("stay_date", date);
    if (result.error) throw new Error(`CHANNEL_OVERRIDE_DELETE_FAILED:${result.error.code}`);
  }
}
