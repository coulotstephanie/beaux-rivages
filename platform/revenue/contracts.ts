import type { PropertySlug } from "@/platform/calendar/config";

export type LoyaltyTier = "decouverte" | "insulaire" | "grand-large" | "ambassadeur";
export type MarketingChannel = "direct" | "airbnb" | "booking" | "abritel" | "google" | "referral" | "other";
export type CampaignKind = "news" | "new-offer" | "school-holiday" | "last-availability" | "christmas" | "spring" | "summer" | "autumn" | "birthday" | "post-stay" | "loyalty";

export type TravelerCommercialProfile = {
  guestId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  locale: "fr" | "en" | "de";
  countryCode?: string;
  acquisitionChannel: MarketingChannel;
  stays: number;
  totalSpentCents: number;
  directStays: number;
  children: boolean;
  pets: boolean;
  preferredProperty?: PropertySlug;
  purchasedExperienceCodes: string[];
  preferredExperienceCodes: string[];
  birthday?: string;
  allergies?: string;
  sleepingPreferences?: string;
  arrivalPreferences?: string;
  internalNotes?: string;
  specialRequests?: string;
};

export type LoyaltyBenefit = {
  code: string;
  label: string;
  kind: "gift" | "discount" | "early-check-in" | "late-check-out" | "priority" | "signature";
  value?: number;
};

export type GiftCard = {
  id: string;
  code: string;
  initialAmountCents: number;
  balanceCents: number;
  expiresAt: string;
  status: "draft" | "active" | "redeemed" | "expired" | "cancelled";
};

export type RevenuePromotion = {
  id: string;
  code: string;
  label: string;
  discountType: "fixed" | "percentage";
  value: number;
  minimumStayNights?: number;
  directOnly: boolean;
  lowSeasonOnly: boolean;
  returningGuestsOnly: boolean;
  propertySlugs: PropertySlug[];
  startsAt: string;
  endsAt: string;
  enabled: boolean;
};

export type UpsellContext = {
  adults: number;
  children: number;
  babies: number;
  pets: number;
  arrival: string;
  departure: string;
  birthdayDuringStay?: boolean;
  selectedCodes: string[];
};

export type CommercialKpis = {
  directBookings: number;
  revenueCents: number;
  averageBasketCents: number;
  returningGuestRate: number;
  loyalTravelers: number;
  giftCardsSoldCents: number;
  promotionUses: number;
  signaturePacks: number;
};
