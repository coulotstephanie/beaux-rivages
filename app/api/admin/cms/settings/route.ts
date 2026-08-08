import { NextRequest } from "next/server";
import { authorizeStaff, staffAccessToken } from "@/platform/auth/server";
import { getUserDatabaseClient } from "@/platform/database/client";
import { siteSettingSchema } from "@/platform/cms/schemas";
import { z } from "zod";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  const identity = await authorizeStaff(request);
  const token = staffAccessToken(request);
  if (!identity || !token)
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  const database = getUserDatabaseClient(token);
  const [settings, links] = await Promise.all([
    database.from("site_settings").select("*").order("key"),
    database.from("managed_links").select("*").order("key"),
  ]);
  if (settings.error || links.error)
    return noStoreJson({ error: "Paramètres indisponibles." }, { status: 500 });
  return noStoreJson({ settings: settings.data, links: links.data });
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const identity = await authorizeStaff(request, ["admin"]);
  const token = staffAccessToken(request);
  if (!identity || !token)
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const linkSchema = z.object({
    kind: z.literal("link"),
    key: z.string().trim().min(1).max(100),
    label: z.string().trim().min(1).max(150),
    url: z
      .string()
      .trim()
      .regex(/^(https?:\/\/|mailto:|tel:|whatsapp:)/),
    active: z.boolean().default(true),
  });
  const link = linkSchema.safeParse(body);
  const parsed = siteSettingSchema.safeParse(body);
  if (!link.success && !parsed.success)
    return noStoreJson({ error: "Paramètre invalide." }, { status: 400 });
  const database = getUserDatabaseClient(token);
  const { error } = link.success
    ? await database
        .from("managed_links")
        .upsert({
          key: link.data.key,
          label: link.data.label,
          url: link.data.url,
          active: link.data.active,
          updated_at: new Date().toISOString(),
        })
    : await database
        .from("site_settings")
        .upsert({
          ...parsed.data!,
          updated_by: identity.userId,
          updated_at: new Date().toISOString(),
        });
  if (error) return noStoreJson({ error: "Enregistrement impossible." }, { status: 500 });
  return noStoreJson({ saved: true });
}
