import { bookingExperiences, calculateSignaturePackPrice, getNights, stayOptions } from "@/booking";
import type { Promotion, PropertyRatePlan, QuoteRequest } from "./contracts";
import { ratePlanRepository } from "./repository";
import { buildPaymentSchedule } from "@/platform/reservations/payment-schedule";
import { frenchStayReferenceCalendar } from "@/platform/calendar/french-reference-calendar";
import { minimumNightsForDate } from "./channels";
import { nidDEte2027NightlyRate } from "./nid-d-ete-2027";

function eachNight(arrival: string, nights: number) {
  const dates: string[] = [];
  const cursor = new Date(`${arrival}T12:00:00Z`);
  for (let index = 0; index < nights; index += 1) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

export function rateForDate(plan: PropertyRatePlan, date: string) {
  const airbnb2027Rate =
    plan.propertySlug === "nid-d-ete" ? nidDEte2027NightlyRate(date) : undefined;
  if (airbnb2027Rate !== undefined) {
    return {
      rate: airbnb2027Rate,
      season: "Tarif Airbnb 2027",
      minimumNights: plan.minimumNights,
    };
  }
  const priority = {
    manual: 7,
    event: 6,
    "public-holiday": 5,
    "school-holiday": 4,
    high: 3,
    mid: 2,
    low: 1,
  };
  const season = plan.seasons
    .filter((candidate) => date >= candidate.startsOn && date < candidate.endsOn)
    .sort((a, b) => priority[b.kind] - priority[a.kind])[0];
  const acceptedYield = plan.overrides?.find((override) => override.date === date);
  const explicitManualRate = season?.kind === "manual";
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return {
    rate:
      (explicitManualRate ? season.nightlyRate : acceptedYield?.nightlyRate) ??
      season?.nightlyRate ??
      (day === 5 || day === 6 ? plan.weekendNightlyRate : plan.baseNightlyRate),
    season:
      (explicitManualRate ? season.label : acceptedYield ? "Yield validé" : season?.label) ??
      (day === 5 || day === 6 ? "Week-end" : "Tarif standard"),
    minimumNights:
      (explicitManualRate ? season.minimumNights : acceptedYield?.minimumNights) ??
      season?.minimumNights ??
      plan.minimumNights,
  };
}

function promotionApplies(promotion: Promotion, input: QuoteRequest, nights: number) {
  if (!promotion.enabled) return false;
  const leadDays = Math.floor(
    (new Date(`${input.arrival}T12:00:00Z`).getTime() - Date.now()) / 86_400_000,
  );
  if (promotion.kind === "long-stay") return nights >= promotion.minimumNights;
  if (promotion.kind === "last-minute")
    return leadDays >= 0 && leadDays <= promotion.maximumLeadDays;
  if (promotion.kind === "early-booking") return leadDays >= promotion.minimumLeadDays;
  if (promotion.kind === "code")
    return (
      promotion.code.toUpperCase() === input.promotionCode?.trim().toUpperCase() &&
      (!promotion.ranges ||
        promotion.ranges.some(
          (range) => input.arrival < range.endsOn && input.departure > range.startsOn,
        ))
    );
  return promotion.ranges.some(
    (range) => input.arrival < range.endsOn && input.departure > range.startsOn,
  );
}

export async function calculateQuote(input: QuoteRequest) {
  const plan = await ratePlanRepository.get(input.propertySlug);
  const nights = getNights(input.arrival, input.departure);
  const stayDates = eachNight(input.arrival, nights);
  const referenceDays = await frenchStayReferenceCalendar(
    stayDates.map((date) => Number(date.slice(0, 4))),
  );
  const nightlyLines = stayDates.map((date) => {
    const rate = rateForDate(plan, date);
    return {
      date,
      ...rate,
      minimumNights: minimumNightsForDate(date, rate.minimumNights, referenceDays),
    };
  });
  const requiredMinimum = Math.max(
    plan.minimumNights,
    ...nightlyLines.map((line) => line.minimumNights),
  );
  const arrivalIsoWeekday = new Date(`${input.arrival}T12:00:00Z`).getUTCDay() || 7;
  const arrivalIsAllowed =
    !plan.allowedArrivalWeekdays?.length || plan.allowedArrivalWeekdays.includes(arrivalIsoWeekday);
  const stayIsValid = arrivalIsAllowed && nights >= requiredMinimum && nights <= plan.maximumNights;
  const accommodationBeforeDiscount = nightlyLines.reduce((sum, line) => sum + line.rate, 0);
  // Direct booking savings for Le Nid d’Été come only from avoiding platform
  // commissions: its accommodation price must never receive another discount.
  const applicablePromotions =
    input.propertySlug === "nid-d-ete"
      ? []
      : plan.promotions.filter((promotion) => promotionApplies(promotion, input, nights));
  const promotionValue = (promotion: Promotion) =>
    promotion.fixedAmount ?? (accommodationBeforeDiscount * promotion.percentage) / 100;
  const bestPromotion = applicablePromotions.sort(
    (a, b) => promotionValue(b) - promotionValue(a),
  )[0];
  const discount = bestPromotion
    ? Math.min(accommodationBeforeDiscount, Math.round(promotionValue(bestPromotion) * 100) / 100)
    : 0;
  const accommodation = accommodationBeforeDiscount - discount;
  const payingGuests = Math.max(1, input.adults + input.children);
  const optionLines = input.options.flatMap((id) => {
    const option = stayOptions.find((candidate) => candidate.id === id);
    if (!option) return [];
    const unitPrice =
      option.id === "signature"
        ? calculateSignaturePackPrice({ adults: input.adults, children: input.children })
        : (plan.optionPrices[id] ?? option.price);
    const quantity =
      option.id === "pet"
        ? Math.max(1, input.pets)
        : option.unit?.startsWith("par voyageur")
          ? payingGuests
          : 1;
    return [{ id, label: option.label, quantity, unitPrice, total: unitPrice * quantity }];
  });
  const experienceLines = input.experiences.flatMap((id) => {
    const experience = bookingExperiences.find((candidate) => candidate.id === id);
    return experience
      ? [
          {
            id,
            label: experience.label,
            quantity: 1,
            unitPrice: experience.price,
            total: experience.price,
          },
        ]
      : [];
  });
  const liableGuests = input.adults;
  const exemptGuests = input.children + input.babies;
  const occupants = Math.max(1, liableGuests + exemptGuests);
  const nightlyPricePerGuest = nights > 0 ? accommodation / nights / occupants : 0;
  const baseTaxPerGuestNight = plan.touristTax.enabled
    ? plan.touristTax.mode === "fixed-per-adult-per-night"
      ? plan.touristTax.value
      : Math.min(
          nightlyPricePerGuest * (plan.touristTax.value / 100),
          plan.touristTax.nightlyCap ?? Number.POSITIVE_INFINITY,
        )
    : 0;
  const taxPerGuestNight =
    Math.round(baseTaxPerGuestNight * (1 + (plan.touristTax.additionalRate ?? 0) / 100) * 100) /
    100;
  const touristTax = Math.round(taxPerGuestNight * liableGuests * nights * 100) / 100;
  const touristTaxDetails = {
    liableGuests,
    exemptGuests,
    nights,
    nightlyPricePerGuest: Math.round(nightlyPricePerGuest * 100) / 100,
    baseRate: plan.touristTax.value,
    additionalRate: plan.touristTax.additionalRate ?? 0,
    nightlyCap: plan.touristTax.nightlyCap ?? null,
    taxPerGuestNight,
    method: plan.touristTax.mode === "percentage" ? "Tarif proportionnel" : "Tarif fixe classé",
    category: plan.touristTax.category ?? "Meublé de tourisme",
    classification: plan.touristTax.classification ?? "unclassified",
    effectiveFrom: plan.touristTax.effectiveFrom,
    municipality: plan.touristTax.municipality,
    intercommunality: plan.touristTax.intercommunality,
  };
  const optionsTotal = optionLines.reduce((sum, line) => sum + line.total, 0);
  const experiencesTotal = experienceLines.reduce((sum, line) => sum + line.total, 0);
  const total = accommodation + plan.cleaningFee + touristTax + optionsTotal + experiencesTotal;
  const paymentSchedule = buildPaymentSchedule(
    input.arrival,
    Math.round(total * 100),
    new Date(),
    plan.financialPolicy,
  );
  return {
    propertySlug: input.propertySlug,
    currency: plan.currency,
    nights,
    stayRules: {
      valid: stayIsValid,
      requiredMinimum,
      maximumNights: plan.maximumNights,
      arrivalIsAllowed,
      allowedArrivalWeekdays: plan.allowedArrivalWeekdays ?? [1, 2, 3, 4, 5, 6, 7],
      optimizeCalendarGaps: plan.optimizeCalendarGaps ?? true,
    },
    nightlyLines,
    accommodationBeforeDiscount,
    promotion: bestPromotion
      ? {
          id: bestPromotion.id,
          label: bestPromotion.label,
          percentage: bestPromotion.percentage,
          fixedAmount: bestPromotion.fixedAmount,
          discount,
        }
      : null,
    accommodation,
    cleaningFee: plan.cleaningFee,
    securityDeposit: { amount: plan.securityDeposit, includedInTotal: false },
    touristTax,
    touristTaxDetails,
    optionLines,
    experienceLines,
    optionsTotal,
    experiencesTotal,
    total,
    paymentSchedule: {
      ...paymentSchedule,
      depositDue: paymentSchedule.depositDueCents / 100,
      balanceDue: paymentSchedule.balanceDueCents / 100,
    },
    contractual: false,
  };
}

export async function buildAnnualRates(
  propertySlug: PropertyRatePlan["propertySlug"],
  year: number,
) {
  const plan = await ratePlanRepository.get(propertySlug);
  const referenceDays = await frenchStayReferenceCalendar([year]);
  const cursor = new Date(Date.UTC(year, 0, 1, 12));
  const days: { date: string; rate: number; season: string; minimumNights: number }[] = [];
  while (cursor.getUTCFullYear() === year) {
    const date = cursor.toISOString().slice(0, 10);
    const rate = rateForDate(plan, date);
    days.push({
      date,
      ...rate,
      minimumNights: minimumNightsForDate(date, rate.minimumNights, referenceDays),
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return { propertySlug, year, currency: plan.currency, days };
}
