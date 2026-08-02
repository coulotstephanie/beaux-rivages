import { NextRequest } from "next/server";
import { heritageSites } from "@/content/patrimoine";
import { authorizeStaff } from "@/platform/auth/server";
import { getDatabaseClient } from "@/platform/database/client";
import { listHeritageMedia } from "@/platform/heritage/media";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

type LooseClient = { from(table: string): any }; // eslint-disable-line @typescript-eslint/no-explicit-any
const validSlugs = new Set(heritageSites.map((site) => site.slug));
const validStatuses = new Set(["draft", "published", "archived"]);

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  try {
    return noStoreJson({ media: await listHeritageMedia() });
  } catch {
    return noStoreJson(
      { error: "Photothèque Patrimoine indisponible. Appliquez la migration dédiée." },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 10);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const staff = await authorizeStaff(request, ["admin", "concierge"]);
  if (!staff) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("photo");
  const siteSlug = String(form?.get("siteSlug") ?? "");
  const altText = String(form?.get("altText") ?? "").trim();
  if (
    !(file instanceof File) ||
    !validSlugs.has(siteSlug) ||
    altText.length < 3 ||
    altText.length > 300 ||
    file.size > 10_485_760 ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type)
  ) {
    return noStoreJson(
      { error: "Photo invalide (JPG, PNG ou WebP, 10 Mo maximum) ou description ALT manquante." },
      { status: 400 },
    );
  }
  const database = getDatabaseClient();
  const client = database as unknown as LooseClient;
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const storagePath = `${siteSlug}/${crypto.randomUUID()}.${extension}`;
  const uploaded = await database.storage
    .from("heritage")
    .upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploaded.error)
    return noStoreJson(
      { error: "Téléversement impossible. Vérifiez que la migration Patrimoine est appliquée." },
      { status: 500 },
    );
  const imagePath = database.storage.from("heritage").getPublicUrl(storagePath).data.publicUrl;
  const isCover = form?.get("isCover") === "on";
  if (isCover)
    await client.from("heritage_media").update({ is_cover: false }).eq("site_slug", siteSlug);
  const inserted = await client
    .from("heritage_media")
    .insert({
      site_slug: siteSlug,
      image_path: imagePath,
      storage_path: storagePath,
      alt_text: altText,
      caption: String(form?.get("caption") ?? "").trim() || null,
      sort_order: Number(form?.get("sortOrder") ?? 100),
      is_cover: isCover,
      status: "published",
      created_by: staff.userId,
    })
    .select("id")
    .single();
  if (inserted.error) {
    await database.storage.from("heritage").remove([storagePath]);
    return noStoreJson({ error: "Enregistrement impossible." }, { status: 500 });
  }
  return noStoreJson({ ok: true, id: inserted.data.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const limited = rateLimit(request, 15);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!(await authorizeStaff(request, ["admin", "concierge"])))
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (
    !body ||
    !/^[0-9a-f-]{36}$/i.test(String(body.id)) ||
    String(body.altText ?? "").trim().length < 3 ||
    !validStatuses.has(String(body.status))
  )
    return noStoreJson({ error: "Données invalides." }, { status: 400 });
  const client = getDatabaseClient() as unknown as LooseClient;
  if (body.isCover)
    await client
      .from("heritage_media")
      .update({ is_cover: false })
      .eq("site_slug", String(body.siteSlug));
  const { error } = await client
    .from("heritage_media")
    .update({
      alt_text: String(body.altText).trim(),
      caption: String(body.caption ?? "").trim() || null,
      sort_order: Number(body.sortOrder ?? 100),
      is_cover: Boolean(body.isCover),
      status: String(body.status),
    })
    .eq("id", String(body.id));
  return error
    ? noStoreJson({ error: "Modification impossible." }, { status: 500 })
    : noStoreJson({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const limited = rateLimit(request, 10);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!(await authorizeStaff(request, ["admin"])))
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[0-9a-f-]{36}$/i.test(id))
    return noStoreJson({ error: "Identifiant invalide." }, { status: 400 });
  const database = getDatabaseClient();
  const client = database as unknown as LooseClient;
  const found = await client
    .from("heritage_media")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  const removed = await client.from("heritage_media").delete().eq("id", id);
  if (removed.error) return noStoreJson({ error: "Suppression impossible." }, { status: 500 });
  if (found.data?.storage_path)
    await database.storage.from("heritage").remove([found.data.storage_path]);
  return noStoreJson({ deleted: true });
}
