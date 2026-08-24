import { z } from "zod";

const text = z.string().trim().min(1).max(5_000);
export const propertyVisualContentSchema = z.object({
  title: text.max(200),
  kicker: text.max(300),
  location: text.max(300),
  capacity: text.max(300),
  intro: text,
  hero: text.max(1_000),
  gallery: z
    .array(
      z.object({
        src: text.max(1_000),
        alt: z.string().max(500),
        caption: z.string().max(500).optional(),
      }),
    )
    .max(100),
  bookingTitle: text.max(300),
  bookingText: text,
  signatureTitle: text.max(300),
  signatureText: text,
  visualMediaOverrides: z
    .record(
      z.string().max(200),
      z.object({
        src: text.max(1_000),
        alt: z.string().max(500),
        caption: z.string().max(500).optional(),
      }),
    )
    .default({}),
  visualMediaOrder: z.record(z.string().max(200), z.array(z.string().max(200)).max(20)).default({}),
  visualTextOverrides: z
    .record(z.string().max(200), z.string().trim().min(1).max(5_000))
    .default({}),
});

export const propertyEditorMutationSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("save-draft"), content: propertyVisualContentSchema }),
  z.object({ action: z.literal("publish"), content: propertyVisualContentSchema }),
  z.object({ action: z.literal("discard") }),
]);
