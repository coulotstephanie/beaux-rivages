import type { PropertySlug } from "@/platform/calendar/config";

export type LoyaltyStatus = "new" | "loyal" | "regular" | "vip";

export type CrmTravelerSummary = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  locale: string;
  countryCode: string;
  stays: number;
  totalSpentCents: number;
  firstVisit: string | null;
  lastVisit: string | null;
  pets: boolean;
  children: boolean;
  preferredPropertySlug: PropertySlug | null;
  loyalty: LoyaltyStatus;
};

export type CrmTravelerDetail = CrmTravelerSummary & {
  address: { line1: string; line2: string; postalCode: string; city: string };
  preferences: {
    floor: string;
    room: string;
    sleeping: string;
    arrival: string;
    allergies: string;
    dietary: string;
    comments: string;
    internalNotes: string;
  };
  averageSpendCents: number;
  staysHistory: Array<Record<string, unknown>>;
  petsHistory: Array<Record<string, unknown>>;
  childrenHistory: Array<Record<string, unknown>>;
  activities: Array<Record<string, unknown>>;
  documents: Array<Record<string, unknown>>;
  payments: Array<Record<string, unknown>>;
  changeLog: Array<Record<string, unknown>>;
};
