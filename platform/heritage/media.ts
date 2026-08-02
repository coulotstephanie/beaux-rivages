import "server-only";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";

export type HeritageMedia = {
  id: string;
  siteSlug: string;
  src: string;
  storagePath: string | null;
  alt: string;
  caption: string;
  sortOrder: number;
  isCover: boolean;
  status: "draft" | "published" | "archived";
};

type LooseClient = { from(table: string): any }; // eslint-disable-line @typescript-eslint/no-explicit-any

function mapMedia(row: Record<string, unknown>): HeritageMedia {
  return {
    id: String(row.id),
    siteSlug: String(row.site_slug),
    src: String(row.image_path),
    storagePath: row.storage_path ? String(row.storage_path) : null,
    alt: String(row.alt_text),
    caption: row.caption ? String(row.caption) : "",
    sortOrder: Number(row.sort_order),
    isCover: Boolean(row.is_cover),
    status: String(row.status) as HeritageMedia["status"],
  };
}

export async function listHeritageMedia(
  siteSlug?: string,
  publishedOnly = false,
): Promise<HeritageMedia[]> {
  if (!isDatabaseConfigured()) return [];
  const client = getDatabaseClient() as unknown as LooseClient;
  let query = client
    .from("heritage_media")
    .select("*")
    .order("is_cover", { ascending: false })
    .order("sort_order");
  if (siteSlug) query = query.eq("site_slug", siteSlug);
  if (publishedOnly) query = query.eq("status", "published");
  const { data, error } = await query;
  if (error) {
    if (String(error.code) === "42P01") return [];
    throw new Error(`HERITAGE_MEDIA_READ_FAILED:${error.code}`);
  }
  return (data ?? []).map((row: Record<string, unknown>) => mapMedia(row));
}
