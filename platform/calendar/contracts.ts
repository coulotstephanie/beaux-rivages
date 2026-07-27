export type CalendarProvider = "airbnb" | "booking" | "abritel" | "manual" | "other";
export type CalendarSource = { id: string; propertySlug: string; provider: CalendarProvider; url: string; enabled: boolean };
export type CalendarBlock = {
  uid: string;
  propertySlug: string;
  sourceId: string;
  startsAt: string;
  endsAt: string;
  summary?: string;
  status: "confirmed" | "tentative" | "cancelled";
};
export interface CalendarConnector {
  fetch(source: CalendarSource): Promise<CalendarBlock[]>;
}
