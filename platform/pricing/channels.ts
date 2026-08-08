export type PricingChannel = "beaux-rivages" | "airbnb" | "booking";
export type MarkupStrategy = "none" | "percentage" | "fixed" | "net-parity";

export type ChannelRule = {
  channel: PricingChannel;
  commissionPercentage: number;
  commissionAppliesToCleaning: boolean;
  markupStrategy: MarkupStrategy;
  markupValue: number;
};

export type DatedChannelRules = {
  before: ChannelRule;
  after: ChannelRule;
  effectiveFrom: string;
};

export type BookingPromotionRule = {
  id: string;
  label: string;
  kind:
    "genius-1" | "genius-2" | "genius-3" | "mobile" | "early-booking" | "last-minute" | "temporary";
  enabled: boolean;
  percentage: number;
  startsOn: string | null;
  endsOn: string | null;
  stackable: boolean;
  priority: number;
};

export type ChannelCalculationInput = {
  date: string;
  nights: number;
  masterNightlyRate: number;
  cleaningFee: number;
  airbnb: DatedChannelRules;
  booking: ChannelRule;
  bookingPromotions: BookingPromotionRule[];
  manualNightlyOverrides?: Partial<Record<Exclude<PricingChannel, "beaux-rivages">, number>>;
};

export type ChannelPrice = {
  channel: PricingChannel;
  nightlyRate: number;
  accommodation: number;
  cleaningFee: number;
  guestTotal: number;
  commissionPercentage: number;
  commission: number;
  activePromotions: Array<{ id: string; label: string; percentage: number; discount: number }>;
  promotionDiscount: number;
  estimatedNetRevenue: number;
  manualOverride: boolean;
};

const money = (value: number) => Math.round(value * 100) / 100;

function markedUpNightly(master: number, rule: ChannelRule) {
  if (rule.markupStrategy === "percentage") return master * (1 + rule.markupValue / 100);
  if (rule.markupStrategy === "fixed") return master + rule.markupValue;
  if (rule.markupStrategy === "net-parity" && rule.commissionPercentage < 100)
    return master / (1 - rule.commissionPercentage / 100);
  return master;
}

function promotionIsActive(promotion: BookingPromotionRule, date: string) {
  return (
    promotion.enabled &&
    (!promotion.startsOn || date >= promotion.startsOn) &&
    (!promotion.endsOn || date <= promotion.endsOn)
  );
}

export function applyBookingPromotions(
  amount: number,
  rules: BookingPromotionRule[],
  date: string,
) {
  const eligible = rules
    .filter((rule) => promotionIsActive(rule, date))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
  const selected: BookingPromotionRule[] = [];
  for (const promotion of eligible) {
    if (selected.some((item) => !item.stackable)) continue;
    if (!promotion.stackable && selected.length) continue;
    if (promotion.stackable || selected.length === 0) selected.push(promotion);
  }
  let remaining = amount;
  const applied = selected.map((promotion) => {
    const discount = money((remaining * promotion.percentage) / 100);
    remaining = money(Math.max(0, remaining - discount));
    return { id: promotion.id, label: promotion.label, percentage: promotion.percentage, discount };
  });
  return { finalAmount: remaining, discount: money(amount - remaining), applied };
}

function calculateChannel(
  channel: PricingChannel,
  nightlyRate: number,
  nights: number,
  cleaningFee: number,
  rule: ChannelRule,
  promotions: ReturnType<typeof applyBookingPromotions>,
  manualOverride: boolean,
): ChannelPrice {
  const accommodation =
    channel === "booking" ? promotions.finalAmount : money(nightlyRate * nights);
  const guestTotal = money(accommodation + cleaningFee);
  const commissionBase = accommodation + (rule.commissionAppliesToCleaning ? cleaningFee : 0);
  const commission = money((commissionBase * rule.commissionPercentage) / 100);
  return {
    channel,
    nightlyRate: money(nightlyRate),
    accommodation,
    cleaningFee: money(cleaningFee),
    guestTotal,
    commissionPercentage: rule.commissionPercentage,
    commission,
    activePromotions: channel === "booking" ? promotions.applied : [],
    promotionDiscount: channel === "booking" ? promotions.discount : 0,
    estimatedNetRevenue: money(guestTotal - commission),
    manualOverride,
  };
}

export function calculateChannelComparison(input: ChannelCalculationInput) {
  const directRule: ChannelRule = {
    channel: "beaux-rivages",
    commissionPercentage: 0,
    commissionAppliesToCleaning: false,
    markupStrategy: "none",
    markupValue: 0,
  };
  const airbnbRule =
    input.date >= input.airbnb.effectiveFrom ? input.airbnb.after : input.airbnb.before;
  const airbnbOverride = input.manualNightlyOverrides?.airbnb;
  const bookingOverride = input.manualNightlyOverrides?.booking;
  const airbnbNightly = airbnbOverride ?? markedUpNightly(input.masterNightlyRate, airbnbRule);
  const bookingNightly = bookingOverride ?? markedUpNightly(input.masterNightlyRate, input.booking);
  const noPromotions = {
    finalAmount: money(input.masterNightlyRate * input.nights),
    discount: 0,
    applied: [],
  };
  const bookingPromotions = applyBookingPromotions(
    money(bookingNightly * input.nights),
    input.bookingPromotions,
    input.date,
  );
  const direct = calculateChannel(
    "beaux-rivages",
    input.masterNightlyRate,
    input.nights,
    input.cleaningFee,
    directRule,
    noPromotions,
    false,
  );
  const airbnb = calculateChannel(
    "airbnb",
    airbnbNightly,
    input.nights,
    input.cleaningFee,
    airbnbRule,
    noPromotions,
    airbnbOverride != null,
  );
  const booking = calculateChannel(
    "booking",
    bookingNightly,
    input.nights,
    input.cleaningFee,
    input.booking,
    bookingPromotions,
    bookingOverride != null,
  );
  return {
    direct,
    airbnb,
    booking,
    netDifference: {
      airbnbVsDirect: money(airbnb.estimatedNetRevenue - direct.estimatedNetRevenue),
      bookingVsDirect: money(booking.estimatedNetRevenue - direct.estimatedNetRevenue),
    },
  };
}

export function requiredMinimumNights(input: {
  date: string;
  csvMinimum: number;
  schoolHoliday?: boolean;
  bridgeNights?: number;
}) {
  const month = Number(input.date.slice(5, 7));
  if (month === 7 || month === 8) return 7;
  if (input.bridgeNights && input.bridgeNights > 0) return input.bridgeNights;
  if (input.schoolHoliday) return 4;
  return input.csvMinimum;
}

export function minimumNightsForDate(
  date: string,
  csvMinimum: number,
  referenceDays: Array<{
    date: string;
    kind: "school_holiday" | "public_holiday" | "bridge";
    minimumNights?: number;
  }>,
) {
  const matching = referenceDays.filter((day) => day.date === date);
  return requiredMinimumNights({
    date,
    csvMinimum,
    schoolHoliday: matching.some((day) => day.kind === "school_holiday"),
    bridgeNights: Math.max(
      0,
      ...matching.filter((day) => day.kind === "bridge").map((day) => day.minimumNights ?? 0),
    ),
  });
}

export function isInsideRollingWindow(date: string, today: string, months = 12) {
  const upper = new Date(`${today}T12:00:00Z`);
  upper.setUTCMonth(upper.getUTCMonth() + months);
  return date >= today && date < upper.toISOString().slice(0, 10);
}

export function rollingWindow(today = new Date().toISOString().slice(0, 10), months = 12) {
  const endExclusive = new Date(`${today}T12:00:00Z`);
  endExclusive.setUTCMonth(endExclusive.getUTCMonth() + months);
  const lastDay = new Date(endExclusive);
  lastDay.setUTCDate(lastDay.getUTCDate() - 1);
  return {
    start: today,
    end: lastDay.toISOString().slice(0, 10),
    endExclusive: endExclusive.toISOString().slice(0, 10),
  };
}
