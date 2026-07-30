export type PropertyId = "chai" | "villa" | "nid";
export type CalendarView = "jour" | "semaine" | "mois" | "année";
export type StayKind =
  | "direct"
  | "external"
  | "owner"
  | "maintenance"
  | "housekeeping"
  | "blocked";

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "positive" | "warning" | "danger";
};

export type CalendarEvent = {
  id: string;
  propertyId: PropertyId;
  title: string;
  guest?: string;
  startsOn: string;
  endsOn: string;
  kind: StayKind;
};

export type RateRule = {
  id: string;
  propertyId: PropertyId;
  label: string;
  period: string;
  nightlyRate: number;
  minimumNights: number;
  closedDays: string[];
  status: "active" | "draft";
};

export type Offer = {
  id: string;
  label: string;
  description: string;
  value: string;
  enabled: boolean;
  kind: "promotion" | "code" | "pack" | "service";
};

export type GuestTimelineItem = {
  id: string;
  date: string;
  title: string;
  detail: string;
  kind: "stay" | "payment" | "contract" | "invoice" | "message" | "note";
};

export type GuestProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  language: string;
  birthday?: string;
  partnerBirthday?: string;
  tags: string[];
  preferences: string[];
  pets: { name: string; type: string; notes: string }[];
  loyalty: { tier: "Bronze" | "Argent" | "Or" | "Signature"; stays: number; nights: number; value: number };
  privateNotes: string;
  timeline: GuestTimelineItem[];
};
