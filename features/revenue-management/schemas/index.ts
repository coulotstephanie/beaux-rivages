import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const rateOverrideSchema = z
  .object({
    propertySlug: z.enum(["chai-des-tortues", "villa-raie-manta", "nid-d-ete"]),
    name: z.string().trim().min(2).max(160),
    kind: z.enum(["manual", "weekend", "school_holiday", "public_holiday", "event"]),
    start: isoDate,
    end: isoDate,
    nightlyRate: z.number().positive().max(10_000),
    minimumNights: z.number().int().min(1).max(60).optional(),
  })
  .strict()
  .refine((value) => value.end >= value.start, {
    path: ["end"],
    message: "La date de fin doit suivre la date de début.",
  });
