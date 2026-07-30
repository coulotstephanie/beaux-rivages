export type YieldFactor = {
  code: "occupancy" | "lead_time" | "weekend" | "event" | "season";
  label: string;
  percentage: number;
  explanation: string;
};
export type YieldInput = {
  baseRateCents: number;
  minimumRateCents: number;
  maximumRateCents: number;
  occupancyRate: number;
  targetOccupancy: number;
  leadDays: number;
  isWeekend: boolean;
  eventImpactPercentage: number;
  eventName?: string;
  maximumIncreasePercentage: number;
  maximumDecreasePercentage: number;
  occupancyWeight: number;
  leadTimeWeight: number;
  eventWeight: number;
};
export type YieldProposal = {
  recommendedRateCents: number;
  changePercentage: number;
  confidence: number;
  factors: YieldFactor[];
};
export type YieldSnapshot = {
  generatedAt: string;
  metrics: {
    pending: number;
    accepted: number;
    rejected: number;
    averageChange: number;
    projectedRevenueImpactCents: number;
  };
  strategies: {
    id: string;
    propertyId: string;
    propertyName: string;
    minimumRateCents: number;
    maximumRateCents: number;
    targetOccupancy: number;
    lastMinuteDays: number;
    earlyBookingDays: number;
    enabled: boolean;
  }[];
  recommendations: {
    id: string;
    propertyId: string;
    propertyName: string;
    stayDate: string;
    baseRateCents: number;
    recommendedRateCents: number;
    occupancyRate: number;
    leadDays: number;
    factors: YieldFactor[];
    confidence: number;
    status: string;
    decisionNote: string;
    createdAt: string;
  }[];
  events: {
    id: string;
    name: string;
    kind: string;
    range: string;
    impactPercentage: number;
    source: string;
  }[];
  logs: { id: string; action: string; actor: string; createdAt: string }[];
};
