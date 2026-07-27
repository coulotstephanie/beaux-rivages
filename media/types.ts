export type MediaAsset = {
  src: string;
  alt: string;
  caption?: string;
  scope: "property" | "destination";
  owner?: string;
};

export type PropertyMediaManifest = {
  slug: string;
  hero: MediaAsset;
  arrival: readonly MediaAsset[];
  exterior: readonly MediaAsset[];
  livingRoom: readonly MediaAsset[];
  kitchen: readonly MediaAsset[];
  bedrooms: readonly MediaAsset[];
  bathrooms: readonly MediaAsset[];
  terrace: readonly MediaAsset[];
  details: readonly MediaAsset[];
  lifestyle: readonly MediaAsset[];
  videos: readonly MediaAsset[];
  gallery: MediaAsset[];
  editorial?: Readonly<Record<string, MediaAsset>>;
};
