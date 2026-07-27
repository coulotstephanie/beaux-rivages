import type { Property } from "@/data";
import type { Experience } from "@/experiences";
import type { HostRecommendation } from "@/recommendations";
import type { StayOption } from "@/booking";
import type { MediaAsset } from "@/media/types";

export type PublicationStatus = "draft" | "published" | "archived";
export type ManagedFaq = { id: string; category: string; question: string; answer: string; status: PublicationStatus; updatedAt: string };
export type NewsItem = { id: string; slug: string; title: string; summary: string; body: string; publishedAt: string | null; status: PublicationStatus };
export type ManagedMedia = MediaAsset & {
  id: string;
  propertySlug?: string;
  destinationSlug?: string;
  season?: "spring" | "summer" | "autumn" | "winter" | "christmas" | "easter";
  kind: "photo" | "video" | "drone";
  tags: string[];
  credit?: string;
  rightsConfirmed: boolean;
};

export type ContentSnapshot = {
  version: number;
  properties: Property[];
  recommendations: HostRecommendation[];
  experiences: Experience[];
  options: StayOption[];
  faqs: ManagedFaq[];
  news: NewsItem[];
  media: ManagedMedia[];
};

export type ContentCollection = keyof Omit<ContentSnapshot, "version">;
export type ContentChange<T = unknown> = {
  collection: ContentCollection;
  operation: "create" | "update" | "delete";
  id: string;
  value?: T;
  expectedVersion: number;
};
