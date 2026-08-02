import { z } from "zod";
import { carnetCategories } from "../types";

export const carnetEntrySchema = z
  .object({
    id: z.string().uuid().optional(),
    slug: z
      .string()
      .trim()
      .min(2)
      .max(160)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.enum(carnetCategories),
    destination: z.enum(["ile_de_re", "ile_oleron", "la_rochelle", "all"]),
    title: z.string().trim().min(2).max(180),
    summary: z.string().trim().min(2).max(500),
    body: z.string().trim().max(10_000).default(""),
    address: z.string().trim().max(300).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    officialUrl: z.string().url().optional(),
    googleMapsUrl: z.string().url().optional(),
    phone: z.string().trim().max(40).optional(),
    imagePath: z.string().trim().max(500).optional(),
    imageAlt: z.string().trim().max(300).optional(),
    galleryPaths: z.array(z.string().trim().max(500)).max(30).default([]),
    videoUrl: z.string().url().optional(),
    openingHours: z.record(z.string(), z.string().max(120)).default({}),
    openingPeriod: z.string().trim().max(300).optional(),
    recommendationLevel: z.number().int().min(0).max(5).default(0),
    highlights: z
      .array(
        z.enum([
          "stephanie_favorite",
          "bruno_favorite",
          "must_see",
          "family",
          "rainy_day",
          "sunset",
          "bike_accessible",
        ]),
      )
      .max(7)
      .default([]),
    hostTip: z.string().trim().max(1000).optional(),
    tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
    featured: z.boolean().default(false),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    sortOrder: z.number().int().min(0).max(10_000).default(100),
    metaTitle: z.string().trim().max(70).optional(),
    metaDescription: z.string().trim().max(170).optional(),
    openGraphImagePath: z.string().trim().max(500).optional(),
  })
  .strict()
  .refine((value) => (value.latitude == null) === (value.longitude == null), {
    message: "Latitude et longitude doivent être renseignées ensemble.",
  });

export const carnetSearchSchema = z
  .object({
    query: z.string().trim().max(120).default(""),
    category: z.enum(carnetCategories).optional(),
    destination: z.enum(["ile_de_re", "ile_oleron", "la_rochelle", "all"]).optional(),
  })
  .strict();
