import "server-only";
import { unstable_cache as cache } from "next/cache";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import type { CmsPage } from "./contracts";

export const PUBLISHED_CMS_CACHE_TAG = "published-cms-content";

/** Lecture résiliente : tant que la page n'est pas publiée dans V4, le site
 * continue d'utiliser son contenu statique historique. */
const getCachedPublishedCmsPage = cache(
  async (slug: string): Promise<CmsPage | null> => {
    if (!isDatabaseConfigured()) return null;
    try {
      const database = getDatabaseClient();
      const page = await database
        .from("cms_pages")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (page.error || !page.data) return null;
      const blocks = await database
        .from("cms_blocks")
        .select("*")
        .eq("page_id", page.data.id)
        .eq("visible", true)
        .order("position");
      if (blocks.error) return null;
      return {
        id: page.data.id,
        pageType: page.data.page_type as CmsPage["pageType"],
        slug: page.data.slug,
        title: page.data.title,
        status: "published",
        locale: page.data.locale,
        seo: page.data.seo as CmsPage["seo"],
        updatedAt: page.data.updated_at,
        blocks: (blocks.data ?? []).map((block) => ({
          id: block.id,
          blockType: block.block_type,
          position: block.position,
          content: block.content as CmsPage["blocks"][number]["content"],
          settings: block.settings as CmsPage["blocks"][number]["settings"],
          visible: block.visible,
        })),
      };
    } catch {
      return null;
    }
  },
  ["published-cms-content"],
  { revalidate: 300, tags: [PUBLISHED_CMS_CACHE_TAG] },
);

export async function getPublishedCmsPage(slug: string): Promise<CmsPage | null> {
  return getCachedPublishedCmsPage(slug);
}
