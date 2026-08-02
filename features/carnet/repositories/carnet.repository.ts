import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import type { CarnetEntry } from "../types";
import type { z } from "zod";
import type { carnetEntrySchema } from "../schemas";

type CarnetInput = z.infer<typeof carnetEntrySchema>;

const mapEntry = (row: {
  id: string;
  slug: string;
  category: string;
  destination: string;
  title: string;
  summary: string;
  body: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  official_url: string | null;
  phone: string | null;
  image_path: string | null;
  image_alt: string | null;
  host_tip: string | null;
  google_maps_url: string | null;
  gallery_paths: string[];
  video_url: string | null;
  opening_hours: unknown;
  opening_period: string | null;
  recommendation_level: number;
  highlights: string[];
  tags: string[];
  featured: boolean;
  status: string;
  sort_order: number;
  version: number;
  meta_title: string | null;
  meta_description: string | null;
  open_graph_image_path: string | null;
}): CarnetEntry => ({
  id: row.id,
  slug: row.slug,
  category: row.category as CarnetEntry["category"],
  destination: row.destination as CarnetEntry["destination"],
  title: row.title,
  summary: row.summary,
  body: row.body,
  address: row.address ?? "",
  coordinates: row.latitude == null || row.longitude == null ? null : [row.latitude, row.longitude],
  officialUrl: row.official_url ?? "",
  googleMapsUrl: row.google_maps_url ?? "",
  phone: row.phone ?? "",
  imagePath: row.image_path ?? "",
  imageAlt: row.image_alt ?? "",
  galleryPaths: row.gallery_paths,
  videoUrl: row.video_url ?? "",
  openingHours:
    row.opening_hours && typeof row.opening_hours === "object"
      ? (row.opening_hours as Record<string, string>)
      : {},
  openingPeriod: row.opening_period ?? "",
  recommendationLevel: row.recommendation_level,
  highlights: row.highlights,
  hostTip: row.host_tip ?? "",
  tags: row.tags,
  featured: row.featured,
  status: row.status as CarnetEntry["status"],
  sortOrder: row.sort_order,
  version: row.version,
  metaTitle: row.meta_title ?? "",
  metaDescription: row.meta_description ?? "",
  openGraphImagePath: row.open_graph_image_path ?? "",
});

export class CarnetRepository {
  private client = getDatabaseClient();

  async list(options: { publishedOnly?: boolean } = {}) {
    let query = this.client.from("carnet_entries").select("*").order("sort_order").order("title");
    if (options.publishedOnly) query = query.eq("status", "published");
    const { data, error } = await query;
    if (error) throw new Error(`CARNET_READ_FAILED:${error.code}`);
    return (data ?? []).map(mapEntry);
  }

  async save(input: CarnetInput) {
    const payload = {
      slug: input.slug,
      category: input.category,
      destination: input.destination,
      title: input.title,
      summary: input.summary,
      body: input.body,
      address: input.address ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      official_url: input.officialUrl ?? null,
      google_maps_url: input.googleMapsUrl ?? null,
      phone: input.phone ?? null,
      image_path: input.imagePath ?? null,
      image_alt: input.imageAlt ?? null,
      gallery_paths: input.galleryPaths,
      video_url: input.videoUrl ?? null,
      opening_hours: input.openingHours,
      opening_period: input.openingPeriod ?? null,
      recommendation_level: input.recommendationLevel,
      highlights: input.highlights,
      host_tip: input.hostTip ?? null,
      tags: input.tags,
      featured: input.featured,
      status: input.status,
      sort_order: input.sortOrder,
      meta_title: input.metaTitle ?? null,
      meta_description: input.metaDescription ?? null,
      open_graph_image_path: input.openGraphImagePath ?? null,
      published_at: input.status === "published" ? new Date().toISOString() : null,
    };
    const query = input.id
      ? this.client.from("carnet_entries").update(payload).eq("id", input.id)
      : this.client.from("carnet_entries").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) throw new Error(`CARNET_WRITE_FAILED:${error.code}`);
    return mapEntry(data);
  }

  async remove(id: string) {
    const { error } = await this.client.from("carnet_entries").delete().eq("id", id);
    if (error) throw new Error(`CARNET_DELETE_FAILED:${error.code}`);
  }
}
