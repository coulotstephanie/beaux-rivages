import { NextRequest } from "next/server";
import { z } from "zod";
import { authorizeStaff } from "@/platform/auth/server";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import type { Json } from "@/platform/database/database.types";

const experienceSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(1000),
  priceCents: z.number().int().min(0).max(1_000_000),
  enabled: z.boolean(),
  imagePath: z.string().trim().max(500).nullable(),
  galleryPaths: z.array(z.string().trim().max(500)).max(20),
  translations: z.record(z.string(), z.unknown()),
  content: z.record(z.string(), z.unknown()),
  availability: z.record(z.string(), z.unknown()),
  sortOrder: z.number().int().min(0).max(1000),
});
const requestStatusSchema = z.object({
  requestId: z.string().uuid(),
  status: z.enum(["new", "contacted", "proposal_sent", "accepted", "declined", "cancelled"]),
});

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  const client = getDatabaseClient();
  const [experiences, requests] = await Promise.all([
    client.from("premium_experiences").select("*").order("sort_order"),
    client.from("experience_requests").select("*").order("created_at", { ascending: false }),
  ]);
  if (experiences.error || requests.error)
    return noStoreJson({ error: "Expériences indisponibles." }, { status: 500 });
  return noStoreJson({ experiences: experiences.data, requests: requests.data });
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 12);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!(await authorizeStaff(request, ["admin", "concierge"])))
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const requestStatus = requestStatusSchema.safeParse(body);
  const client = getDatabaseClient();
  if (requestStatus.success) {
    const { error } = await client
      .from("experience_requests")
      .update({ status: requestStatus.data.status })
      .eq("id", requestStatus.data.requestId);
    return error
      ? noStoreJson({ error: "Mise à jour impossible." }, { status: 500 })
      : noStoreJson({ success: true });
  }
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success)
    return noStoreJson(
      { error: "Expérience invalide.", details: parsed.error.flatten() },
      { status: 400 },
    );
  const input = parsed.data;
  const payload = {
    code: input.code,
    label: input.label,
    description: input.description,
    price_cents: input.priceCents,
    enabled: input.enabled,
    image_path: input.imagePath,
    gallery_paths: input.galleryPaths,
    translations: input.translations as Json,
    content: input.content as Json,
    availability: input.availability as Json,
    sort_order: input.sortOrder,
  };
  const query = input.id
    ? client.from("premium_experiences").update(payload).eq("id", input.id)
    : client.from("premium_experiences").insert(payload);
  const { data, error } = await query.select("*").single();
  return error
    ? noStoreJson({ error: "Enregistrement impossible." }, { status: 500 })
    : noStoreJson({ experience: data }, { status: input.id ? 200 : 201 });
}
