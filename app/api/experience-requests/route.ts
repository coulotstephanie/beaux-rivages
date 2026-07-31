import { NextRequest } from "next/server";
import { z } from "zod";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import { ConfigurableEmailProvider } from "@/platform/email/contracts";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const schema = z
  .object({
    experience: z.enum(["demande-en-mariage", "anniversaire"]),
    name: z.string().trim().min(2).max(100),
    email: z.email().max(200),
    phone: z.string().trim().min(6).max(30),
    desiredDate: z.iso.date(),
    house: z.enum(["chai-des-tortues", "villa-raie-manta", "nid-d-ete"]),
    budget: z.string().trim().max(80).optional(),
    project: z.string().trim().min(20).max(4000),
    consent: z.literal(true),
  })
  .strict();
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 4, 60_000);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine refusée." }, { status: 403 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Demandes indisponibles." }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Demande invalide." }, { status: 400 });
  const input = parsed.data;
  const { data, error } = await getDatabaseClient()
    .from("experience_requests")
    .insert({
      experience_code: input.experience,
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      desired_date: input.desiredDate,
      property_slug: input.house,
      budget: input.budget || null,
      project_description: input.project,
    })
    .select("id")
    .single();
  if (error) return noStoreJson({ error: "Enregistrement impossible." }, { status: 503 });
  const owner = process.env.RESERVATION_RECIPIENT?.trim();
  if (owner) {
    const provider = new ConfigurableEmailProvider();
    await Promise.allSettled([
      provider.send({
        to: owner,
        subject: `Nouvelle demande ${input.experience}`,
        html: `<h1>Nouvelle demande d’expérience</h1><p><strong>${escapeHtml(input.name)}</strong> · ${escapeHtml(input.email)} · ${escapeHtml(input.phone)}</p><p>${escapeHtml(input.desiredDate)} · ${escapeHtml(input.house)} · ${escapeHtml(input.budget || "Budget à définir")}</p><p>${escapeHtml(input.project)}</p>`,
        idempotencyKey: `experience-${data.id}-owner`,
      }),
      provider.send({
        to: input.email,
        subject: "Votre projet Beaux Rivages",
        html: `<h1>Votre projet est bien arrivé</h1><p>Bonjour ${escapeHtml(input.name)},</p><p>Stéphanie ou Bruno étudiera personnellement votre demande et reviendra vers vous avec une proposition sur mesure.</p>`,
        idempotencyKey: `experience-${data.id}-guest`,
      }),
    ]);
  }
  return noStoreJson({ id: data.id, status: "new" }, { status: 201 });
}
