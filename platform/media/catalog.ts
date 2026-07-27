import type { ManagedMedia } from "@/platform/content/contracts";

export type MediaFilters = {
  query?: string;
  propertySlug?: string;
  destinationSlug?: string;
  season?: ManagedMedia["season"];
  kind?: ManagedMedia["kind"];
  tags?: string[];
};

export function searchMedia(media: ManagedMedia[], filters: MediaFilters) {
  const query = filters.query?.trim().toLocaleLowerCase("fr") ?? "";
  return media.filter((asset) => {
    if (filters.propertySlug && asset.propertySlug !== filters.propertySlug) return false;
    if (filters.destinationSlug && asset.destinationSlug !== filters.destinationSlug) return false;
    if (filters.season && asset.season !== filters.season) return false;
    if (filters.kind && asset.kind !== filters.kind) return false;
    if (filters.tags?.some((tag) => !asset.tags.includes(tag))) return false;
    if (!query) return true;
    return [asset.alt, asset.caption, asset.credit, ...asset.tags].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(query);
  });
}
