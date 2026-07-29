import type { ChannelConnector, ChannelProvider, ChannelReservation } from "./contracts";

class PartnerConnector implements ChannelConnector {
  readonly capabilities = ["availability"];
  constructor(readonly provider: ChannelProvider) {}
  async importReservations(): Promise<ChannelReservation[]> {
    throw new Error(`PARTNER_API_NOT_CONFIGURED:${this.provider}`);
  }
  async pushAvailability(): Promise<{ externalId: string }> {
    throw new Error(`PARTNER_API_NOT_CONFIGURED:${this.provider}`);
  }
}

const registry = new Map<ChannelProvider, ChannelConnector>();
for (const provider of ["airbnb", "booking", "abritel", "google_vacation_rentals", "holidu", "expedia", "hometogo"] as const) {
  registry.set(provider, new PartnerConnector(provider));
}

export function channelConnector(provider: ChannelProvider) {
  const connector = registry.get(provider);
  if (!connector) throw new Error(`UNKNOWN_CHANNEL:${provider}`);
  return connector;
}

export function registerChannelConnector(connector: ChannelConnector) {
  registry.set(connector.provider, connector);
}
