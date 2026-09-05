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
    const [
      ratesResult,
      optionsResult,
      promotionsResult,
      overridesResult,
      yieldOverridesResult,
      guardrailsResult,
      touristTaxResult,
      pricingRulesResult,
      financialSettingsResult,
    ] = await Promise.all([
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
      client.from("rate_overrides").select("*").eq("property_id", property.id).eq("enabled", true),
      client
        .from("yield_rate_overrides")
        .select("stay_date,nightly_rate_cents,minimum_nights")
        .eq("property_id", property.id)
        .eq("status", "active"),
      client.from("rate_guardrails").select("*").eq("property_id", property.id).maybeSingle(),
      client
        .from("tourist_tax_settings")
        .select("*")
        .eq("property_id", property.id)
        .eq("enabled", true)
        .order("effective_from", { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from("property_pricing_rules" as "properties")
        .select("allowed_arrival_weekdays,optimize_calendar_gaps")
        .eq("property_id" as "id", property.id)
        .maybeSingle(),
      client
        .from("financial_settings" as "properties")
        .select(
          "deposit_percentage,full_payment_threshold_days,balance_due_days,security_deposit_cents",
        )
        .eq("id" as "slug", true)
        .maybeSingle(),
    ]);
    if (ratesResult.error) throw new Error(`PRICING_RATES_FAILED:${ratesResult.error.code}`);
    if (optionsResult.error) throw new Error(`PRICING_OPTIONS_FAILED:${optionsResult.error.code}`);
    if (promotionsResult.error)
      throw new Error(`PRICING_PROMOTIONS_FAILED:${promotionsResult.error.code}`);
    if (overridesResult.error)
      throw new Error(`PRICING_OVERRIDES_FAILED:${overridesResult.error.code}`);
    if (yieldOverridesResult.error)
      throw new Error(`PRICING_YIELD_OVERRIDES_FAILED:${yieldOverridesResult.error.code}`);
    if (guardrailsResult.error)
      throw new Error(`PRICING_GUARDRAILS_FAILED:${guardrailsResult.error.code}`);
    if (touristTaxResult.error)
      throw new Error(`PRICING_TOURIST_TAX_FAILED:${touristTaxResult.error.code}`);
    // This optional table was introduced after the original production pricing
    // schema. Its absence must not disable every quote.
    if (pricingRulesResult.error && pricingRulesResult.error.code !== "PGRST205")
      throw new Error(`PRICING_RULES_FAILED:${pricingRulesResult.error.code}`);
    if (financialSettingsResult.error && financialSettingsResult.error.code !== "PGRST205")
      throw new Error(`FINANCIAL_SETTINGS_FAILED:${financialSettingsResult.error.code}`);

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
        fixedAmount:
          (promotion as typeof promotion & { fixed_discount_cents?: number | null })
            .fixed_discount_cents != null
            ? (promotion as typeof promotion & { fixed_discount_cents: number })
                .fixed_discount_cents / 100
            : undefined,
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
      allowedArrivalWeekdays: (pricingRulesResult.error
        ? null
        : (pricingRulesResult.data as unknown as {
            allowed_arrival_weekdays?: number[];
          } | null)
      )?.allowed_arrival_weekdays ?? [1, 2, 3, 4, 5, 6, 7],
      optimizeCalendarGaps:
        (pricingRulesResult.error
          ? null
          : (pricingRulesResult.data as unknown as {
              optimize_calendar_gaps?: boolean;
            } | null)
        )?.optimize_calendar_gaps ?? true,
      cleaningFee: baseRate.cleaning_fee_cents / 100,
      securityDeposit:
        financialSettingsResult.error || !financialSettingsResult.data
          ? baseRate.security_deposit_cents / 100
          : Number(
              (
                financialSettingsResult.data as unknown as {
                  security_deposit_cents: number;
                }
              ).security_deposit_cents,
            ) / 100,
      financialPolicy: financialSettingsResult.error
        ? undefined
        : {
            depositPercentage: Number(
              (financialSettingsResult.data as unknown as { deposit_percentage: number } | null)
                ?.deposit_percentage ?? 30,
            ),
            fullPaymentThresholdDays: Number(
              (
                financialSettingsResult.data as unknown as {
                  full_payment_threshold_days: number;
                } | null
              )?.full_payment_threshold_days ?? 15,
            ),
            balanceDueDays: Number(
              (financialSettingsResult.data as unknown as { balance_due_days: number } | null)
                ?.balance_due_days ?? 14,
            ),
          },
      touristTax: touristTaxResult.data
        ? {
            enabled: touristTaxResult.data.enabled,
            mode:
              touristTaxResult.data.calculation_mode === "proportional"
                ? "percentage"
                : "fixed-per-adult-per-night",
            value: Number(touristTaxResult.data.rate_value),
            additionalRate: Number(touristTaxResult.data.additional_rate_percent),
            nightlyCap: touristTaxResult.data.nightly_cap_cents / 100,
            municipality: touristTaxResult.data.municipality,
            intercommunality: touristTaxResult.data.intercommunality,
            category: touristTaxResult.data.accommodation_category,
            classification: touristTaxResult.data
              .classification as PropertyRatePlan["touristTax"]["classification"],
            effectiveFrom: touristTaxResult.data.effective_from,
          }
        : {
            enabled: baseRate.tourist_tax_mode !== "disabled",
            mode:
              baseRate.tourist_tax_mode === "percentage"
                ? "percentage"
                : "fixed-per-adult-per-night",
            value: Number(baseRate.tourist_tax_value),
          },
      optionPrices,
      seasons,
      promotions,
      overrides: yieldOverridesResult.data.map((override) => ({
        date: override.stay_date,
        nightlyRate: override.nightly_rate_cents / 100,
        minimumNights: override.minimum_nights ?? undefined,
      })),
    };
  }
}
