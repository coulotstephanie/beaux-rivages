import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import type { GuestBookEntryInput } from "./schema";
import type { GuestBookEntry, GuestBookFilters } from "./types";

type GuestBookRow = {
  id: string;
  house: string;
  entry_date: string;
  date_precision: "day" | "month";
  language: string;
  author: string;
  text: string;
  featured: boolean;
  tags: string[];
  image_path: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

const mapRow = (row: GuestBookRow): GuestBookEntry => ({
  id: row.id,
  house: row.house as GuestBookEntry["house"],
  date: row.date_precision === "month" ? row.entry_date.slice(0, 7) : row.entry_date,
  language: row.language as GuestBookEntry["language"],
  author: row.author,
  text: row.text,
  featured: row.featured,
  tags: row.tags,
  image: row.image_path,
  status: row.status as GuestBookEntry["status"],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class GuestBookRepository {
  private client = getDatabaseClient();

  async list(filters: GuestBookFilters = {}, publishedOnly = true) {
    let query = this.client
      .from("guest_book_entries")
      .select("*")
      .order("entry_date", { ascending: false });
    if (publishedOnly) query = query.eq("status", "published");
    if (filters.house && filters.house !== "all") query = query.eq("house", filters.house);
    if (filters.language && filters.language !== "all")
      query = query.eq("language", filters.language);
    if (filters.tag) query = query.contains("tags", [filters.tag]);
    if (filters.year)
      query = query
        .gte("entry_date", `${filters.year}-01-01`)
        .lte("entry_date", `${filters.year}-12-31`);
    if (filters.search)
      query = query.textSearch("search_vector", filters.search, {
        type: "websearch",
        config: "simple",
      });
    const { data, error } = await query;
    if (error) throw new Error(`GUESTBOOK_READ_FAILED:${error.code}`);
    return ((data ?? []) as GuestBookRow[]).map(mapRow);
  }

  async save(input: GuestBookEntryInput) {
    const hasExactDay = input.date.length === 10;
    const payload = {
      house: input.house,
      entry_date: hasExactDay ? input.date : `${input.date}-01`,
      date_precision: hasExactDay ? "day" : "month",
      language: input.language,
      author: input.author,
      text: input.text,
      featured: input.featured,
      tags: input.tags,
      image_path: input.image ?? null,
      status: input.status,
    };
    const query = input.id
      ? this.client.from("guest_book_entries").update(payload).eq("id", input.id)
      : this.client.from("guest_book_entries").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) throw new Error(`GUESTBOOK_WRITE_FAILED:${error.code}`);
    return mapRow(data as GuestBookRow);
  }

  async remove(id: string) {
    const { error } = await this.client.from("guest_book_entries").delete().eq("id", id);
    if (error) throw new Error(`GUESTBOOK_DELETE_FAILED:${error.code}`);
  }
}
