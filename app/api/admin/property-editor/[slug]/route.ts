import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { authorizeStaff } from "@/platform/auth/server";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import {
  editablePropertySlugs,
  type EditablePropertySlug,
} from "@/platform/property-editor/contracts";
import { propertyEditorMutationSchema } from "@/platform/property-editor/schemas";
import { PropertyEditorRepository } from "@/platform/property-editor/repository";
import { PUBLISHED_PROPERTY_CACHE_TAG } from "@/platform/property-editor/public";

function valid(value: string): value is EditablePropertySlug {
  return editablePropertySlugs.includes(value as EditablePropertySlug);
}

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const limited = rateLimit(request, 40);
  if (limited) return limited;
  const identity = await authorizeStaff(request);
  if (!identity) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  const { slug } = await context.params;
  if (!valid(slug)) return noStoreJson({ error: "Maison inconnue." }, { status: 404 });
  try {
    return noStoreJson(await new PropertyEditorRepository().get(slug));
  } catch {
    return noStoreJson({ error: "Éditeur indisponible." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const identity = await authorizeStaff(request, ["admin", "editor"]);
  if (!identity) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const { slug } = await context.params;
  if (!valid(slug)) return noStoreJson({ error: "Maison inconnue." }, { status: 404 });
  const parsed = propertyEditorMutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Contenu invalide.", details: parsed.error.flatten() },
      { status: 400 },
    );
  const repository = new PropertyEditorRepository();
  try {
    if (parsed.data.action === "save-draft")
      await repository.saveDraft(slug, parsed.data.content, identity.userId);
    else if (parsed.data.action === "publish") {
      await repository.publish(slug, parsed.data.content, identity.userId);
      revalidateTag(PUBLISHED_PROPERTY_CACHE_TAG);
    }
    else await repository.discard(slug, identity.userId);
    return noStoreJson({ ok: true, document: await repository.get(slug) });
  } catch {
    return noStoreJson({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
