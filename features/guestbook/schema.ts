import { z } from "zod";
import { guestBookHouses, guestBookLanguages, guestBookStatuses } from "./types";

export const guestBookEntrySchema = z.object({
  id: z.string().uuid().optional(),
  house: z.enum(guestBookHouses),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}(?:-\d{2})?$/, "Date attendue au format AAAA-MM ou AAAA-MM-JJ"),
  language: z.enum(guestBookLanguages),
  author: z.string().trim().min(1).max(80),
  text: z.string().trim().min(2).max(4000),
  featured: z.boolean().default(false),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  image: z.string().trim().max(500).nullable().optional(),
  status: z.enum(guestBookStatuses).default("photo_received"),
});

export type GuestBookEntryInput = z.infer<typeof guestBookEntrySchema>;
