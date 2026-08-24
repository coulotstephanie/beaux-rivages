import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { getProperty, type Property } from "@/data";
import { propertyMedia } from "@/media/properties";
import type { MediaAsset } from "@/media/types";
import { applyVisualContent, type EditablePropertySlug } from "./contracts";
import { PropertyEditorRepository } from "./repository";

function collectMediaAssets(value: unknown): MediaAsset[] {
  if (Array.isArray(value)) {
    return value.flatMap(collectMediaAssets);
  }
  if (!value || typeof value !== "object") {
    return [];
  }
  if ("src" in value && typeof value.src === "string") {
    return [value as MediaAsset];
  }
  return Object.values(value).flatMap(collectMediaAssets);
}

function useOptimizedMedia(property: Property, slug: EditablePropertySlug): Property {
  const optimizedByStem = new Map(
    collectMediaAssets(propertyMedia[slug])
      .filter((asset) => asset.src.endsWith(".webp"))
      .map((asset) => [asset.src.replace(/\.[^.]+$/, ""), asset.src]),
  );
  const optimizedSrc = (src: string) =>
    optimizedByStem.get(src.replace(/\.[^.]+$/, "")) ?? src;

  return {
    ...property,
    hero: optimizedSrc(property.hero),
    gallery: property.gallery.map((image) => ({ ...image, src: optimizedSrc(image.src) })),
    ...(property.visualMediaOverrides
      ? {
          visualMediaOverrides: Object.fromEntries(
            Object.entries(property.visualMediaOverrides).map(([key, image]) => [
              key,
              { ...image, src: optimizedSrc(image.src) },
            ]),
          ),
        }
      : {}),
  };
}

export async function getPublishedProperty(slug: EditablePropertySlug): Promise<Property> {
  noStore();
  const original = getProperty(slug);
  try {
    return useOptimizedMedia(
      applyVisualContent(original, (await new PropertyEditorRepository().get(slug)).published),
      slug,
    );
  } catch {
    return useOptimizedMedia(original, slug);
  }
}
