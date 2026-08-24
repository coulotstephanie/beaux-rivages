import type { GalleryImage, Property } from "@/data";

export const editablePropertySlugs = ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"] as const;
export type EditablePropertySlug = (typeof editablePropertySlugs)[number];

export type PropertyVisualContent = {
  title: string;
  kicker: string;
  location: string;
  capacity: string;
  intro: string;
  hero: string;
  gallery: GalleryImage[];
  bookingTitle: string;
  bookingText: string;
  signatureTitle: string;
  signatureText: string;
  visualMediaOverrides: Record<string, GalleryImage>;
  visualMediaOrder: Record<string, string[]>;
  visualTextOverrides: Record<string, string>;
};

export type PropertyEditorDocument = {
  slug: EditablePropertySlug;
  draft: PropertyVisualContent;
  published: PropertyVisualContent;
  hasUnpublishedChanges: boolean;
  updatedAt?: string;
  publishedAt?: string;
};

export function visualContentFromProperty(property: Property): PropertyVisualContent {
  return {
    title: property.title,
    kicker: property.kicker,
    location: property.location,
    capacity: property.capacity,
    intro: property.intro,
    hero: property.hero,
    gallery: property.gallery,
    bookingTitle: property.bookingTitle,
    bookingText: property.bookingText,
    signatureTitle: property.signatureTitle,
    signatureText: property.signatureText,
    visualMediaOverrides: property.visualMediaOverrides ?? {},
    visualMediaOrder: property.visualMediaOrder ?? {},
    visualTextOverrides: property.visualTextOverrides ?? {},
  };
}

export function applyVisualContent(property: Property, content: PropertyVisualContent): Property {
  const { visualMediaOverrides, visualMediaOrder, visualTextOverrides, ...fields } = content;
  return {
    ...property,
    ...fields,
    ...(Object.keys(visualMediaOverrides).length ? { visualMediaOverrides } : {}),
    ...(Object.keys(visualMediaOrder).length ? { visualMediaOrder } : {}),
    ...(Object.keys(visualTextOverrides).length ? { visualTextOverrides } : {}),
  };
}
