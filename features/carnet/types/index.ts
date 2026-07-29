export const carnetCategories = [
  "restaurant",
  "producer",
  "bakery",
  "pastry",
  "market",
  "beach",
  "activity",
  "walk",
  "cycle_route",
  "village",
  "fort_boyard",
  "tide",
  "weather",
  "emergency",
  "useful_number",
  "host_tip",
  "seasonal_event",
] as const;

export type CarnetCategory = (typeof carnetCategories)[number];
export type CarnetDestination = "ile_de_re" | "ile_oleron" | "la_rochelle" | "all";

export type CarnetEntry = {
  id: string;
  slug: string;
  category: CarnetCategory;
  destination: CarnetDestination;
  title: string;
  summary: string;
  body: string;
  address: string;
  coordinates: readonly [number, number] | null;
  officialUrl: string;
  googleMapsUrl: string;
  phone: string;
  imagePath: string;
  imageAlt: string;
  galleryPaths: string[];
  videoUrl: string;
  openingHours: Record<string, string>;
  openingPeriod: string;
  recommendationLevel: number;
  highlights: string[];
  hostTip: string;
  tags: string[];
  featured: boolean;
  status: "draft" | "published" | "archived";
  version: number;
  metaTitle: string;
  metaDescription: string;
  openGraphImagePath: string;
};
