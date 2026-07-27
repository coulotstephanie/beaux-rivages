import { properties } from "@/data";
import { experiences } from "@/experiences";
import { hostRecommendations } from "@/recommendations";
import { stayOptions } from "@/booking";
import { smartFaqs } from "@/faqData";
import { photoLibrary } from "@/phototheque";
import type { ContentSnapshot } from "./contracts";

export const officialContentSnapshot: ContentSnapshot = {
  version: 1,
  properties,
  recommendations: hostRecommendations,
  experiences,
  options: stayOptions,
  faqs: smartFaqs.map(([category, question, answer], index) => ({
    id: `faq-${index + 1}`, category, question, answer, status: "published", updatedAt: "2026-07-26",
  })),
  news: [],
  media: photoLibrary.map((asset, index) => ({
    ...asset,
    id: `media-${index + 1}`,
    propertySlug: asset.owner,
    kind: asset.src.endsWith(".mp4") ? "video" : "photo",
    tags: [asset.category.toLowerCase(), asset.collection.toLowerCase()],
    rightsConfirmed: false,
  })),
};
