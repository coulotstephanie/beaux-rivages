import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const jsonObject = z.record(z.string(), z.json());

export const cmsBlockSchema = z.object({
  blockType: z.string().trim().min(1).max(80),
  position: z.number().int().min(0).max(10_000),
  content: jsonObject.default({}),
  settings: jsonObject.default({}),
  visible: z.boolean().default(true),
});

export const cmsPageSchema = z.object({
  id: z.uuid().optional(),
  pageType: z.enum(["page", "property", "article", "legal", "landing"]),
  slug,
  title: z.string().trim().min(2).max(200),
  status: z.enum(["draft", "published", "archived"]),
  locale: z
    .string()
    .trim()
    .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/)
    .default("fr"),
  seo: z.object({
    title: z.string().trim().max(70).optional(),
    description: z.string().trim().max(180).optional(),
    canonical: z.url().optional().or(z.literal("")),
    openGraphImage: z.string().trim().max(500).optional(),
    robots: z.string().trim().max(100).optional(),
    schema: z.json().optional(),
  }),
  blocks: z.array(cmsBlockSchema).max(200),
  reason: z.string().trim().min(3).max(300).default("Enregistrement manuel"),
});

export const cmsRestoreSchema = z.object({ id: z.uuid(), version: z.number().int().positive() });

export const siteSettingSchema = z.object({
  key: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/),
  value: z.json(),
  public: z.boolean().default(false),
  description: z.string().trim().max(300).optional(),
});
