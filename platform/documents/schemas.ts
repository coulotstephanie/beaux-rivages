import { z } from "zod";
const id = z.string().uuid();
const kind = z.enum([
  "quote",
  "contract",
  "deposit_invoice",
  "balance_invoice",
  "final_invoice",
  "credit_note",
  "receipt",
  "payment_statement",
  "certificate",
]);
export const documentActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("generate"), reservationId: id, kind }),
  z.object({
    action: z.literal("prepare_signature"),
    documentId: id,
    signerEmail: z.string().email(),
    expiresAt: z.string().datetime().nullable().optional(),
  }),
  z.object({
    action: z.literal("update_signature"),
    requestId: id,
    status: z.enum(["sent", "viewed", "signed", "declined", "expired", "cancelled"]),
  }),
  z.object({
    action: z.literal("record_delivery"),
    documentId: id,
    recipient: z.string().email(),
    channel: z.enum(["email", "portal", "download"]).default("email"),
    status: z
      .enum(["prepared", "sent", "delivered", "opened", "downloaded", "failed"])
      .default("prepared"),
  }),
  z.object({ action: z.literal("archive"), documentId: id, reason: z.string().min(3).max(500) }),
  z.object({
    action: z.literal("save_template"),
    templateId: id.nullable().optional(),
    kind,
    name: z.string().min(2).max(100),
    primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
    footerText: z.string().max(2000).default(""),
    legalText: z.string().max(10000).default(""),
    active: z.boolean().default(true),
  }),
  z.object({
    action: z.literal("save_settings"),
    legalName: z.string().min(2).max(150),
    address: z.string().max(500),
    phone: z.string().max(50),
    email: z.string().email(),
    iban: z.string().max(50),
    bic: z.string().max(20),
    vatNumber: z.string().max(50),
    vatEnabled: z.boolean(),
    logoPath: z.string().max(500),
    primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
    footerText: z.string().max(2000),
    legalMentions: z.string().max(10000),
    ownerSignaturePath: z.string().max(500),
  }),
]);
export type DocumentAction = z.infer<typeof documentActionSchema>;
