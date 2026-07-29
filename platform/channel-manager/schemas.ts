import { z } from "zod";

export const channelActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("sync"), connectionId: z.string().uuid(), propertySlug: z.enum(["chai-des-tortues","villa-raie-manta","nid-d-ete"]) }).strict(),
  z.object({ action: z.literal("update_mapping"), mappingId: z.string().uuid(), externalListingId: z.string().trim().min(2).max(200), externalListingName: z.string().trim().max(200).optional(), syncPrices: z.boolean(), syncAvailability: z.boolean(), syncReservations: z.boolean() }).strict(),
  z.object({ action: z.literal("resolve_conflict"), conflictId: z.string().uuid(), status: z.enum(["investigating","resolved","ignored"]), resolution: z.string().trim().min(2).max(1000) }).strict(),
  z.object({ action: z.literal("retry_job"), jobId: z.string().uuid() }).strict(),
]);
export type ChannelAction = z.infer<typeof channelActionSchema>;
