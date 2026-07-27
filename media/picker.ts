import catalog from "./media.json";

export type SmartMedia = (typeof catalog)[number];
export type MediaQuery = {
  type?: SmartMedia["type"];
  property?: SmartMedia["property"];
  emotion?: string;
  season?: string;
  tags?: string[];
  limit?: number;
};

export function pickMedia(query: MediaQuery = {}): SmartMedia[] {
  return catalog
    .filter((media) => !query.type || media.type === query.type)
    .filter((media) => !query.property || media.property === query.property)
    .filter((media) => !query.emotion || media.emotion.includes(query.emotion))
    .filter((media) => !query.season || media.season.includes(query.season))
    .filter((media) => !query.tags?.length || query.tags.every((tag) => media.tags.includes(tag)))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, query.limit ?? catalog.length);
}

export function getMediaById(id: string): SmartMedia | undefined {
  return catalog.find((media) => media.id === id);
}

