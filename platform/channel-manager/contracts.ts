export const channelProviders = ["airbnb", "booking", "abritel", "google_vacation_rentals", "holidu", "expedia", "hometogo"] as const;
export type ChannelProvider = typeof channelProviders[number];
export type ChannelReservation = {
  externalReference: string; listingId: string; arrival: string; departure: string; status: string;
  guest?: { firstName: string; lastName: string; email?: string; phone?: string };
  adults?: number; children?: number; babies?: number; pets?: number; totalCents?: number; currency?: string;
  comments?: string; arrivalTime?: string; departureTime?: string; options?: string[];
};
export interface ChannelConnector {
  provider: ChannelProvider;
  capabilities: readonly string[];
  importReservations(mappingId: string): Promise<ChannelReservation[]>;
  pushAvailability(mappingId: string, arrival: string, departure: string): Promise<{ externalId: string }>;
}
export type ChannelManagerSnapshot = {
  generatedAt: string;
  metrics: { synchronizedReservations: number; running: number; errors: number; alerts: number; conflicts: number; lastSyncAt: string | null };
  connections: { id: string; provider: string; name: string; mode: string; status: string; capabilities: string[]; lastCheckedAt: string | null; lastError: string }[];
  mappings: { id: string; connectionId: string; provider: string; propertyId: string; propertyName: string; externalListingId: string; externalListingName: string; status: string; syncPrices: boolean; syncAvailability: boolean; syncReservations: boolean }[];
  jobs: { id: string; provider: string; direction: string; resource: string; status: string; attempt: number; errorMessage: string; createdAt: string; startedAt: string | null; finishedAt: string | null }[];
  conflicts: { id: string; propertyName: string; provider: string; range: string; type: string; severity: string; status: string; proposedResolution: string; createdAt: string }[];
  logs: { id: string; provider: string; action: string; entityType: string; entityId: string; reversible: boolean; actor: string; createdAt: string }[];
  calendar: { id: string; propertyName: string; source: string; range: string; note: string }[];
};
