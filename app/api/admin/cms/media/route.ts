import { createHash, randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { authorizeStaff, staffAccessToken } from "@/platform/auth/server";
import { getUserDatabaseClient } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
]);

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 40);
  if (limited) return limited;
  const identity = await authorizeStaff(request);
  const token = staffAccessToken(request);
  if (!identity || !token)
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  const database = getUserDatabaseClient(token);
  const { data, error } = await database
    .from("cms_media_assets")
    .select("*")
    .is("archived_at", null)
    .order("created_at", { ascending: false });
  if (error) return noStoreJson({ error: "Médiathèque indisponible." }, { status: 500 });
  return noStoreJson({
    assets: data.map((asset) => ({
      ...asset,
      url: database.storage.from(asset.bucket).getPublicUrl(asset.storage_path).data.publicUrl,
    })),
  });
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 10);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const identity = await authorizeStaff(request, ["admin", "editor"]);
  const token = staffAccessToken(request);
  if (!identity || !token)
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size > 100 * 1024 * 1024)
    return noStoreJson({ error: "Fichier invalide ou trop volumineux." }, { status: 400 });
  const bytes = await file.arrayBuffer();
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .slice(-120);
  const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;
  const database = getUserDatabaseClient(token);
  const upload = await database.storage
    .from("cms-media")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (upload.error) return noStoreJson({ error: "Téléversement impossible." }, { status: 500 });
  const record = await database
    .from("cms_media_assets")
    .insert({
      kind: file.type.startsWith("video/") ? "video" : "image",
      bucket: "cms-media",
      storage_path: path,
      title: String(form.get("title") || file.name),
      alt_text: String(form.get("altText") || "") || null,
      tags: String(form.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      checksum: createHash("sha256").update(Buffer.from(bytes)).digest("hex"),
      created_by: identity.userId,
    })
    .select("*")
    .single();
  if (record.error) {
    await database.storage.from("cms-media").remove([path]);
    return noStoreJson({ error: "Indexation du média impossible." }, { status: 500 });
  }
  return noStoreJson(
    {
      asset: {
        ...record.data,
        url: database.storage.from(record.data.bucket).getPublicUrl(record.data.storage_path).data
          .publicUrl,
      },
    },
    { status: 201 },
  );
}

export async function PATCH(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const identity = await authorizeStaff(request, ["admin", "editor"]);
  const token = staffAccessToken(request);
  if (!identity || !token)
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    title?: string;
    altText?: string;
    tags?: string[];
    archived?: boolean;
  } | null;
  if (!body?.id || !/^[0-9a-f-]{36}$/i.test(body.id))
    return noStoreJson({ error: "Média invalide." }, { status: 400 });
  const { data, error } = await getUserDatabaseClient(token)
    .from("cms_media_assets")
    .update({
      title: body.title?.trim().slice(0, 200),
      alt_text: body.altText?.trim().slice(0, 500),
      tags: body.tags
        ?.map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 30),
      archived_at: body.archived ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select("*")
    .single();
  if (error) return noStoreJson({ error: "Modification impossible." }, { status: 500 });
  return noStoreJson({ asset: data });
}
