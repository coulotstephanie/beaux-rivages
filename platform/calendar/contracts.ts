export type CalendarProvider = "airbnb" | "booking" | "abritel" | "google" | "manual" | "channel-manager" | "other";
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
export interface CalendarSourceRepository {
  list(propertySlug?: string): Promise<CalendarSource[]>;
  save(source: CalendarSource): Promise<CalendarSource>;
  remove(id: string): Promise<void>;
}
export type CalendarSyncResult = {
  sourceId: string;
  provider: CalendarProvider;
  propertySlug: string;
  status: "success" | "error";
  imported: number;
  syncedAt: string;
  error?: string;
};
