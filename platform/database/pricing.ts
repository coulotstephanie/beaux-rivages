import "server-only";
import type { StayOptionId } from "@/booking";
import type { PropertySlug } from "@/platform/calendar/config";
import type { Promotion, PropertyRatePlan } from "@/platform/pricing/contracts";
import { getDatabaseClient } from "./client";

function addDay(date: string) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

function parseDateRange(value: string | null) {
  if (!value || value.length < 3) return [];
  const [startsOn, endsOn] = value.slice(1, -1).split(",");
  return startsOn && endsOn ? [{ startsOn, endsOn }] : [];
}

export class SupabasePricingPlanReader {
  async get(propertySlug: PropertySlug): Promise<PropertyRatePlan> {
    const client = getDatabaseClient();
    const propertyResult = await client
      .from("properties")
      .select("id,slug,currency")
      .eq("slug", propertySlug)
      .single();
    if (propertyResult.error)
      throw new Error(`PRICING_PROPERTY_FAILED:${propertyResult.error.code}`);
    const property = propertyResult.data;
    const [ratesResult, optionsResult, promotionsResult, overridesResult, guardrailsResult] =
      await Promise.all([
        client
          .from("rates")
          .select("*,seasons(*)")
          .eq("property_id", property.id)
          .eq("enabled", true),
        client
          .from("property_options")
          .select("price_cents,enabled,options(code)")
          .eq("property_id", property.id),
        client.from("promotions").select("*").eq("property_id", property.id),
        client
          .from("rate_overrides")
          .select("*")
          .eq("property_id", property.id)
          .eq("enabled", true),
        client.from("rate_guardrails").select("*").eq("property_id", property.id).maybeSingle(),
      ]);
    if (ratesResult.error) throw new Error(`PRICING_RATES_FAILED:${ratesResult.error.code}`);
    if (optionsResult.error) throw new Error(`PRICING_OPTIONS_FAILED:${optionsResult.error.code}`);
    if (promotionsResult.error)
      throw new Error(`PRICING_PROMOTIONS_FAILED:${promotionsResult.error.code}`);
    if (overridesResult.error)
      throw new Error(`PRICING_OVERRIDES_FAILED:${overridesResult.error.code}`);
    if (guardrailsResult.error)
      throw new Error(`PRICING_GUARDRAILS_FAILED:${guardrailsResult.error.code}`);

    const rates = ratesResult.data;
    const baseRate = rates.find((rate) => !rate.season_id && rate.weekdays.includes(1));
    const weekendRate = rates.find((rate) => !rate.season_id && rate.weekdays.includes(6));
    if (!baseRate || !weekendRate) throw new Error(`PRICING_BASE_RATE_MISSING:${propertySlug}`);

    const seasons: PropertyRatePlan["seasons"] = rates.flatMap((rate) => {
      const season = rate.seasons;
      if (!season) return [];
      return [
        {
          id: season.id,
          label: season.name,
          kind: season.kind.replaceAll("_", "-") as PropertyRatePlan["seasons"][number]["kind"],
          startsOn: season.begins_on,
          endsOn: addDay(season.ends_on),
          nightlyRate: rate.nightly_rate_cents / 100,
          minimumNights: rate.minimum_nights ?? season.minimum_nights ?? undefined,
        },
      ];
    });
    seasons.push(
      ...overridesResult.data.map((override) => ({
        id: override.id,
        label: override.name,
        kind: (override.kind === "school_holiday"
          ? "school-holiday"
          : override.kind === "public_holiday"
            ? "public-holiday"
            : override.kind === "event"
              ? "event"
              : "manual") as PropertyRatePlan["seasons"][number]["kind"],
        startsOn: override.begins_on,
        endsOn: addDay(override.ends_on),
        nightlyRate: override.nightly_rate_cents / 100,
        minimumNights: override.minimum_nights ?? undefined,
      })),
    );

    const promotions = promotionsResult.data.map((promotion): Promotion => {
      const common = {
        id: promotion.id,
        label: promotion.name,
        enabled: promotion.enabled,
        percentage: Number(promotion.percentage),
      };
      if (promotion.kind === "long_stay")
        return { ...common, kind: "long-stay", minimumNights: promotion.minimum_nights ?? 1 };
      if (promotion.kind === "last_minute")
        return {
          ...common,
          kind: "last-minute",
          maximumLeadDays: promotion.maximum_lead_days ?? 0,
        };
      if (promotion.kind === "early_booking")
        return {
          ...common,
          kind: "early-booking",
          minimumLeadDays: promotion.minimum_lead_days ?? 0,
        };
      if (promotion.kind === "code") return { ...common, kind: "code", code: promotion.code ?? "" };
      return {
        ...common,
        kind: "seasonal",
        ranges: parseDateRange(
          typeof promotion.valid_range === "string" ? promotion.valid_range : null,
        ),
      };
    });

    const optionPrices = Object.fromEntries(
      optionsResult.data.flatMap((item) =>
        item.enabled && item.options?.code
          ? [[item.options.code as StayOptionId, item.price_cents / 100]]
          : [],
      ),
    ) as Partial<Record<StayOptionId, number>>;

    return {
      propertySlug,
      currency: "EUR",
      baseNightlyRate: baseRate.nightly_rate_cents / 100,
      weekendNightlyRate: weekendRate.nightly_rate_cents / 100,
      minimumNightlyRate: guardrailsResult.data?.minimum_rate_cents
        ? guardrailsResult.data.minimum_rate_cents / 100
        : undefined,
      maximumNightlyRate: guardrailsResult.data?.maximum_rate_cents
        ? guardrailsResult.data.maximum_rate_cents / 100
        : undefined,
      minimumNights: baseRate.minimum_nights ?? 1,
      maximumNights: baseRate.maximum_nights ?? 28,
      cleaningFee: baseRate.cleaning_fee_cents / 100,
      securityDeposit: baseRate.security_deposit_cents / 100,
      touristTax: {
        enabled: baseRate.tourist_tax_mode !== "disabled",
        mode:
          baseRate.tourist_tax_mode === "percentage" ? "percentage" : "fixed-per-adult-per-night",
        value: Number(baseRate.tourist_tax_value),
      },
      optionPrices,
      seasons,
      promotions,
    };
  }
}
