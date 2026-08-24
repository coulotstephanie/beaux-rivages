import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { authorizeStaff, staffAccessToken } from "@/platform/auth/server";
import { CmsRepository } from "@/platform/cms/repository";
import { PUBLISHED_CMS_CACHE_TAG } from "@/platform/cms/public";
import { cmsPageSchema, cmsRestoreSchema } from "@/platform/cms/schemas";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 40);
  if (limited) return limited;
  const identity = await authorizeStaff(request);
  const token = staffAccessToken(request);
  if (!identity || !token)
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  try {
    const repository = new CmsRepository(token);
    const pageId = request.nextUrl.searchParams.get("versions");
    return noStoreJson(
      pageId
        ? { versions: await repository.versions(pageId) }
        : { pages: await repository.listPages() },
    );
  } catch (error) {
    return noStoreJson(
      {
        error: "CMS indisponible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const identity = await authorizeStaff(request, ["admin", "editor"]);
  const token = staffAccessToken(request);
  if (!identity || !token)
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = cmsPageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Page invalide.", details: parsed.error.flatten() },
      { status: 400 },
    );
  const { reason, ...page } = parsed.data;
  try {
    const id = await new CmsRepository(token).savePage(page, reason);
    if (page.status === "published") revalidateTag(PUBLISHED_CMS_CACHE_TAG);
    return noStoreJson({ id }, { status: page.id ? 200 : 201 });
  } catch (error) {
    return noStoreJson(
      {
        error: "Enregistrement impossible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const limited = rateLimit(request, 12);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const identity = await authorizeStaff(request, ["admin", "editor"]);
  const token = staffAccessToken(request);
  if (!identity || !token)
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = cmsRestoreSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Version invalide." }, { status: 400 });
  try {
    const id = await new CmsRepository(token).restore(parsed.data.id, parsed.data.version);
    revalidateTag(PUBLISHED_CMS_CACHE_TAG);
    return noStoreJson({ id });
  } catch (error) {
    return noStoreJson(
      {
        error: "Restauration impossible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}
