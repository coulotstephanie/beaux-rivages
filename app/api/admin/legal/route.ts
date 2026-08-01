import { NextRequest } from "next/server";
import { z } from "zod";
import { authorizeStaff } from "@/platform/auth/server";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const sectionSchema = z.tuple([
  z.string().trim().min(1).max(180),
  z.string().trim().min(1).max(10_000),
]);
const documentSchema = z.object({
  documentKey: z.string().regex(/^[a-z][a-z0-9_]*$/),
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().min(2).max(500),
  sections: z.array(sectionSchema).min(1).max(40),
  version: z.string().trim().min(1).max(40),
  effectiveFrom: z.string().date(),
  publish: z.boolean(),
});

async function listDocuments() {
  const { data, error } = await getDatabaseClient()
    .from("legal_documents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`LEGAL_READ_FAILED:${error.code}`);
  return (data ?? []).map((row) => ({
    id: row.id,
    documentKey: row.document_key,
    title: row.title,
    description: row.description,
    sections: row.sections,
    version: row.version,
    effectiveFrom: row.effective_from,
    published: row.published,
    createdAt: row.created_at,
  }));
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  try {
    return noStoreJson({ documents: await listDocuments() });
  } catch (error) {
    return noStoreJson(
      {
        error: "Centre juridique indisponible.",
        code: error instanceof Error ? error.message : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 8);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const staff = await authorizeStaff(request, ["admin"]);
  if (!staff) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = documentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Document invalide.", details: parsed.error.flatten() },
      { status: 400 },
    );
  const value = parsed.data;
  const client = getDatabaseClient();
  const { data, error } = await client
    .from("legal_documents")
    .insert({
      document_key: value.documentKey,
      title: value.title,
      description: value.description,
      sections: value.sections,
      version: value.version,
      effective_from: value.effectiveFrom,
      published: false,
      created_by: staff.userId,
    })
    .select("id")
    .single();
  if (error)
    return noStoreJson(
      {
        error: error.code === "23505" ? "Cette version existe déjà." : "Enregistrement impossible.",
        code: error.code,
      },
      { status: 400 },
    );
  if (value.publish) {
    const { error: publishError } = await client.rpc("publish_legal_document", {
      target_id: data.id,
    });
    if (publishError)
      return noStoreJson(
        { error: "Version enregistrée mais publication impossible.", code: publishError.code },
        { status: 500 },
      );
  }
  return noStoreJson({ ok: true, documents: await listDocuments() });
}
