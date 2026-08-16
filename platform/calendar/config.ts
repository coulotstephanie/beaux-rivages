import type { CalendarProvider, CalendarSource } from "./contracts";

export const propertySlugs = ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"] as const;
export type PropertySlug = (typeof propertySlugs)[number];

const sourceDefinitions: { propertySlug: PropertySlug; provider: CalendarProvider; env: string }[] =
  [
    {
      propertySlug: "chai-des-tortues",
      provider: "airbnb",
      env: "ICAL_CHAI_DES_TORTUES_AIRBNB_URL",
    },
    {
      propertySlug: "chai-des-tortues",
      provider: "booking",
      env: "ICAL_CHAI_DES_TORTUES_BOOKING_URL",
    },
    {
      propertySlug: "villa-raie-manta",
      provider: "airbnb",
      env: "ICAL_VILLA_RAIE_MANTA_AIRBNB_URL",
    },
    {
      propertySlug: "villa-raie-manta",
      provider: "booking",
      env: "ICAL_VILLA_RAIE_MANTA_BOOKING_URL",
    },
    { propertySlug: "nid-d-ete", provider: "airbnb", env: "ICAL_NID_D_ETE_AIRBNB_URL" },
    { propertySlug: "nid-d-ete", provider: "booking", env: "ICAL_NID_D_ETE_BOOKING_URL" },
    { propertySlug: "nid-d-ete", provider: "abritel", env: "ICAL_NID_D_ETE_ABRITEL_URL" },
    { propertySlug: "nid-d-ete", provider: "google", env: "ICAL_NID_D_ETE_GOOGLE_URL" },
  ];

export function isPropertySlug(value: string | null): value is PropertySlug {
  return Boolean(value && propertySlugs.includes(value as PropertySlug));
}

export function getCalendarSources(propertySlug?: PropertySlug): CalendarSource[] {
  return sourceDefinitions
    .filter((definition) => !propertySlug || definition.propertySlug === propertySlug)
    .flatMap((definition) => {
      const url = process.env[definition.env]?.trim();
      if (!url) return [];
      return [
        {
          id: `${definition.propertySlug}-${definition.provider}`,
          propertySlug: definition.propertySlug,
          provider: definition.provider,
          url,
          enabled: true,
        },
      ];
    });
}

export function getCalendarConfigurationStatus() {
  return sourceDefinitions.map((definition) => ({
    id: `${definition.propertySlug}-${definition.provider}`,
    propertySlug: definition.propertySlug,
    provider: definition.provider,
    configured: Boolean(process.env[definition.env]?.trim()),
    environmentVariable: definition.env,
  }));
}
