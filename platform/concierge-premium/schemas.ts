import { z } from "zod";
export const conciergeOrderSchema = z.object({
  reservationReference:z.string().trim().min(4).max(40),
  email:z.string().trim().toLowerCase().email().max(254),
  locale:z.enum(["fr","en","de"]).default("fr"),
  promotionCode:z.string().trim().max(30).optional(),
  message:z.string().trim().max(1500).optional(),
  items:z.array(z.object({ experienceId:z.string().uuid(),quantity:z.number().int().min(1).max(30) }).strict()).min(1).max(30),
}).strict();
export const specialRequestSchema = z.object({
  reservationReference:z.string().trim().min(4).max(40),email:z.string().trim().toLowerCase().email(),
  occasion:z.enum(["birthday","wedding","proposal","baby","surprise","allergies","diet","other"]),
  details:z.string().trim().min(5).max(2000),allergies:z.string().trim().max(1000).optional(),dietaryRequirements:z.string().trim().max(1000).optional(),
}).strict();
export const conciergeRequestSchema=z.discriminatedUnion("action",[
  conciergeOrderSchema.extend({ action:z.literal("order") }),
  specialRequestSchema.extend({ action:z.literal("special_request") }),
]);
