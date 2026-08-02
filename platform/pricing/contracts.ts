import type { BookingExperienceId, StayOptionId } from "@/booking";
import type { PropertySlug } from "@/platform/calendar/config";

export type SeasonKind =
  "low" | "mid" | "high" | "school-holiday" | "public-holiday" | "event" | "manual";
export type DateRange = { startsOn: string; endsOn: string };
export type SeasonRule = DateRange & {
  id: string;
  label: string;
  kind: SeasonKind;
  nightlyRate: number;
  minimumNights?: number;
};
export type Promotion =
  | {
      id: string;
      label: string;
      enabled: boolean;
      kind: "long-stay";
      percentage: number;
      fixedAmount?: number;
      minimumNights: number;
    }
  | {
      id: string;
      label: string;
      enabled: boolean;
      kind: "last-minute";
      percentage: number;
      fixedAmount?: number;
      maximumLeadDays: number;
    }
  | {
      id: string;
      label: string;
      enabled: boolean;
      kind: "early-booking";
      percentage: number;
      fixedAmount?: number;
      minimumLeadDays: number;
    }
  | {
      id: string;
      label: string;
      enabled: boolean;
      kind: "code";
      percentage: number;
      fixedAmount?: number;
      code: string;
      ranges?: DateRange[];
    }
  | {
      id: string;
      label: string;
      enabled: boolean;
      kind: "seasonal";
      percentage: number;
      fixedAmount?: number;
      ranges: DateRange[];
    };

export type PropertyRatePlan = {
  propertySlug: PropertySlug;
  currency: "EUR";
  baseNightlyRate: number;
  weekendNightlyRate: number;
  minimumNightlyRate?: number;
  maximumNightlyRate?: number;
  minimumNights: number;
  maximumNights: number;
  /** ISO weekdays accepted for an arrival (1 = Monday, 7 = Sunday). */
  allowedArrivalWeekdays?: number[];
  optimizeCalendarGaps?: boolean;
  cleaningFee: number;
  securityDeposit: number;
  financialPolicy?: {
    depositPercentage: number;
    fullPaymentThresholdDays: number;
    balanceDueDays: number;
  };
  touristTax: {
    mode: "fixed-per-adult-per-night" | "percentage";
    value: number;
    enabled: boolean;
    additionalRate?: number;
    nightlyCap?: number;
    municipality?: string;
    intercommunality?: string;
    category?: string;
    classification?: "unclassified" | "1" | "2" | "3" | "4" | "5";
    effectiveFrom?: string;
  };
  optionPrices: Partial<Record<StayOptionId, number>>;
  seasons: SeasonRule[];
  promotions: Promotion[];
  overrides?: { date: string; nightlyRate: number; minimumNights?: number }[];
};

export type QuoteRequest = {
  propertySlug: PropertySlug;
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  babies: number;
  pets: number;
  options: StayOptionId[];
  experiences: BookingExperienceId[];
  promotionCode?: string;
};

export interface RatePlanRepository {
  get(propertySlug: PropertySlug): Promise<PropertyRatePlan>;
  list(): Promise<PropertyRatePlan[]>;
  save(plan: PropertyRatePlan): Promise<PropertyRatePlan>;
}

export interface RateDistributionConnector {
  push(
    plan: PropertyRatePlan,
  ): Promise<{ provider: string; status: "accepted" | "unsupported"; externalId?: string }>;
}

export type RateDistributionStatus = {
  provider: "airbnb" | "booking";
  status: "not_connected" | "connected" | "available";
  lastSynchronizationAt: string | null;
  automaticPushEnabled: false;
};
