export type TravelerDocument = { id: string; title: string; url: string; availableFrom: string; sensitive: boolean };
export type ArrivalInformation = { propertySlug: string; availableFrom: string; parking: string; checkIn: string; contact: string };
export type TravelerPortal = {
  travelerId: string;
  reservationIds: string[];
  selectedExperienceSlugs: string[];
  guideSlugs: string[];
  recommendationSlugs: string[];
  documents: TravelerDocument[];
  arrival: ArrivalInformation | null;
};
