import { z } from "zod";
export const yieldActionSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("generate"),
      propertyId: z.string().uuid(),
      days: z.number().int().min(7).max(365).default(90),
    })
    .strict(),
  z
    .object({
      action: z.literal("decide"),
      recommendationId: z.string().uuid(),
      decision: z.enum(["accepted", "rejected"]),
      note: z.string().trim().max(1000).optional(),
    })
    .strict(),
  z
    .object({
      action: z.literal("update_strategy"),
      strategyId: z.string().uuid(),
      minimumRateCents: z.number().int().min(0),
      maximumRateCents: z.number().int().min(0),
      targetOccupancy: z.number().min(0).max(100),
      enabled: z.boolean(),
    })
    .strict()
    .refine((v) => v.maximumRateCents >= v.minimumRateCents, {
      message: "Le plafond doit dépasser le tarif minimum.",
    }),
]);
export type YieldAction = z.infer<typeof yieldActionSchema>;
