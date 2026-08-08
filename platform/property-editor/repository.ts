import "server-only";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import { getProperty } from "@/data";
import {
  visualContentFromProperty,
  type EditablePropertySlug,
  type PropertyEditorDocument,
  type PropertyVisualContent,
} from "./contracts";

type Row = {
  property_slug: EditablePropertySlug;
  draft_content: PropertyVisualContent;
  published_content: PropertyVisualContent;
  updated_at: string;
  published_at: string | null;
};
type UntypedClient = {
  // Table added by the visual-editor migration; regenerate database types after applying it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from(table: string): any;
};

export class PropertyEditorRepository {
  private get db() {
    return getDatabaseClient() as unknown as UntypedClient;
  }

  async get(slug: EditablePropertySlug): Promise<PropertyEditorDocument> {
    const fallback = visualContentFromProperty(getProperty(slug));
    if (!isDatabaseConfigured())
      return { slug, draft: fallback, published: fallback, hasUnpublishedChanges: false };
    const result = await this.db
      .from("property_visual_content")
      .select("*")
      .eq("property_slug", slug)
      .maybeSingle();
    if (result.error) throw new Error(`PROPERTY_EDITOR_READ_FAILED:${result.error.code}`);
    const row = result.data as Row | null;
    if (!row) return { slug, draft: fallback, published: fallback, hasUnpublishedChanges: false };
    const normalize = (value: PropertyVisualContent): PropertyVisualContent => ({
      ...fallback,
      ...value,
      visualMediaOverrides: value.visualMediaOverrides ?? {},
      visualMediaOrder: value.visualMediaOrder ?? {},
      visualTextOverrides: value.visualTextOverrides ?? {},
    });
    const draft = normalize(row.draft_content);
    const published = normalize(row.published_content);
    return {
      slug,
      draft,
      published,
      hasUnpublishedChanges: JSON.stringify(draft) !== JSON.stringify(published),
      updatedAt: row.updated_at,
      publishedAt: row.published_at ?? undefined,
    };
  }

  async saveDraft(slug: EditablePropertySlug, content: PropertyVisualContent, userId: string) {
    const current = await this.get(slug);
    const result = await this.db
      .from("property_visual_content")
      .upsert(
        {
          property_slug: slug,
          draft_content: content,
          published_content: current.published,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "property_slug" },
      );
    if (result.error) throw new Error(`PROPERTY_EDITOR_WRITE_FAILED:${result.error.code}`);
  }

  async publish(slug: EditablePropertySlug, content: PropertyVisualContent, userId: string) {
    const now = new Date().toISOString();
    const result = await this.db
      .from("property_visual_content")
      .upsert(
        {
          property_slug: slug,
          draft_content: content,
          published_content: content,
          updated_by: userId,
          published_by: userId,
          updated_at: now,
          published_at: now,
        },
        { onConflict: "property_slug" },
      );
    if (result.error) throw new Error(`PROPERTY_EDITOR_PUBLISH_FAILED:${result.error.code}`);
  }

  async discard(slug: EditablePropertySlug, userId: string) {
    const current = await this.get(slug);
    await this.saveDraft(slug, current.published, userId);
  }
}
