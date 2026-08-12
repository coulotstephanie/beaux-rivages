import { NextRequest } from "next/server";
import { z } from "zod";
import { ConfigurableEmailProvider } from "@/platform/email/contracts";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const schema = z.object({
  name: z.string().trim().min(2).max(100), company: z.string().trim().max(160).optional(),
  email: z.email().max(200), phone: z.string().trim().min(6).max(30),
  reason: z.enum(["Télétravail", "Mission professionnelle", "Chantier", "Remplacement saisonnier", "Remplacement médical", "Formation", "Événement professionnel", "Autre"]),
  arrivalDate: z.string().max(20).optional(), departureDate: z.string().max(20).optional(),
  approximateDuration: z.string().trim().max(100).optional(), occupants: z.coerce.number().int().min(1).max(10),
  bedrooms: z.coerce.number().int().min(1).max(4), preferredHouse: z.enum(["sans-preference", "chai-des-tortues", "villa-raie-manta", "nid-d-ete"]),
  message: z.string().trim().min(10).max(4000), consent: z.literal("on"),
}).strict().refine((value) => value.arrivalDate || value.approximateDuration, { message: "Dates ou durée requises" });
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 4, 60_000); if (limited) return limited;
  if (!requireSameOrigin(request)) return noStoreJson({ error: "Origine refusée." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Demande invalide." }, { status: 400 });
  const input = parsed.data;
  const recipient = process.env.RESERVATION_RECIPIENT?.trim() || "coulotstephanie@gmail.com";
  const provider = new ConfigurableEmailProvider();
  const details = [`Entreprise : ${input.company || "Non renseignée"}`, `Motif : ${input.reason}`, `Dates : ${input.arrivalDate || "À confirmer"} — ${input.departureDate || "À confirmer"}`, `Durée : ${input.approximateDuration || "À confirmer"}`, `Occupants : ${input.occupants}`, `Chambres : ${input.bedrooms}`, `Maison : ${input.preferredHouse}`].map(escapeHtml).join("<br>");
  try {
    await Promise.all([
      provider.send({ to: recipient, replyTo: input.email, subject: `Séjour professionnel · ${input.name}`, html: `<h1>Nouvelle demande de séjour professionnel</h1><p><strong>${escapeHtml(input.name)}</strong><br>${escapeHtml(input.email)} · ${escapeHtml(input.phone)}</p><p>${details}</p><p>${escapeHtml(input.message)}</p>`, idempotencyKey: `telework-owner-${crypto.randomUUID()}` }),
      provider.send({ to: input.email, subject: "Votre demande Beaux Rivages", html: `<h1>Votre demande est bien arrivée</h1><p>Bonjour ${escapeHtml(input.name)},</p><p>Stéphanie et Bruno étudient votre séjour professionnel et vous répondront avec une proposition personnalisée.</p>`, idempotencyKey: `telework-guest-${crypto.randomUUID()}` }),
    ]);
  } catch { return noStoreJson({ error: "Envoi indisponible." }, { status: 503 }); }
  return noStoreJson({ status: "sent" }, { status: 201 });
}
