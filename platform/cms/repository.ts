import "server-only";

import type { Json } from "@/platform/database/database.types";
import { getUserDatabaseClient } from "@/platform/database/client";
import type { CmsPage } from "./contracts";

function asJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

export class CmsRepository {
  constructor(private readonly accessToken: string) {}

  private get database() {
    return getUserDatabaseClient(this.accessToken);
  }

  async listPages(): Promise<CmsPage[]> {
    const { data: pages, error } = await this.database
      .from("cms_pages")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(`CMS_LIST_FAILED:${error.message}`);
    const pageIds = (pages ?? []).map((page) => page.id);
    const blocks = pageIds.length
      ? await this.database
          .from("cms_blocks")
          .select("*")
          .in("page_id", pageIds)
          .order("position", { ascending: true })
      : { data: [], error: null };
    if (blocks.error) throw new Error(`CMS_BLOCKS_FAILED:${blocks.error.message}`);
    return (pages ?? []).map((page) => ({
      id: page.id,
      pageType: page.page_type as CmsPage["pageType"],
      slug: page.slug,
      title: page.title,
      status: page.status as CmsPage["status"],
      locale: page.locale,
      seo: (page.seo ?? {}) as CmsPage["seo"],
      updatedAt: page.updated_at,
      blocks: (blocks.data ?? [])
        .filter((block) => block.page_id === page.id)
        .map((block) => ({
          id: block.id,
          blockType: block.block_type,
          position: block.position,
          content: block.content as CmsPage["blocks"][number]["content"],
          settings: block.settings as CmsPage["blocks"][number]["settings"],
          visible: block.visible,
        })),
    }));
  }

  async savePage(page: CmsPage, reason: string) {
    const { blocks, ...pagePayload } = page;
    const { data, error } = await this.database.rpc("cms_save_page", {
      page_payload: asJson(pagePayload),
      block_payload: asJson(blocks),
      change_reason: reason,
    });
    if (error) throw new Error(`CMS_SAVE_FAILED:${error.message}`);
    return data;
  }

  async versions(pageId: string) {
    const { data, error } = await this.database
      .from("cms_page_versions")
      .select("version, reason, created_at")
      .eq("page_id", pageId)
      .order("version", { ascending: false });
    if (error) throw new Error(`CMS_VERSIONS_FAILED:${error.message}`);
    return (data ?? []).map((version) => ({
      version: version.version,
      reason: version.reason,
      createdAt: version.created_at,
    }));
  }

  async restore(pageId: string, version: number) {
    const { data, error } = await this.database.rpc("cms_restore_page", {
      target_page_id: pageId,
      target_version: version,
    });
    if (error) throw new Error(`CMS_RESTORE_FAILED:${error.message}`);
    return data;
  }
}
