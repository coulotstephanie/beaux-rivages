import { z } from "zod";
import { bookingExperiences, stayOptions } from "@/booking";
import { propertySlugs } from "@/platform/calendar/config";

const optionIds = stayOptions.map((option) => option.id) as [
  (typeof stayOptions)[number]["id"],
  ...(typeof stayOptions)[number]["id"][],
];
const experienceIds = bookingExperiences.map((experience) => experience.id) as [
  (typeof bookingExperiences)[number]["id"],
  ...(typeof bookingExperiences)[number]["id"][],
];
const isoDate = z.iso.date();

export const reservationSearchSchema = z
  .object({
    propertySlug: z.enum(propertySlugs),
    arrival: isoDate,
    departure: isoDate,
    adults: z.coerce.number().int().min(1).max(8),
    children: z.coerce.number().int().min(0).max(8).default(0),
    babies: z.coerce.number().int().min(0).max(8).default(0),
    pets: z.coerce.number().int().min(0).max(8).default(0),
    options: z.array(z.enum(optionIds)).default([]),
    experiences: z.array(z.enum(experienceIds)).default([]),
    promotionCode: z.string().trim().max(40).optional(),
  })
  .superRefine((value, context) => {
    if (value.departure <= value.arrival) {
      context.addIssue({
        code: "custom",
        path: ["departure"],
        message: "La date de départ doit suivre la date d’arrivée.",
      });
    }
    if (value.adults + value.children > 8) {
      context.addIssue({
        code: "custom",
        path: ["children"],
        message: "Le séjour ne peut pas dépasser huit voyageurs.",
      });
    }
  });

export type ReservationSearchInput = z.infer<typeof reservationSearchSchema>;
