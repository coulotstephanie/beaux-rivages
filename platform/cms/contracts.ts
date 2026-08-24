import type { Json } from "@/platform/database/database.types";

export type CmsSeo = {
  title?: string;
  description?: string;
  canonical?: string;
  openGraphImage?: string;
  robots?: string;
  schema?: Json;
};

export type CmsBlock = {
  id?: string;
  blockType: string;
  position: number;
  content: Record<string, Json | undefined>;
  settings: Record<string, Json | undefined>;
  visible: boolean;
};

export type CmsPage = {
  id?: string;
  pageType: "page" | "property" | "article" | "legal" | "landing";
  slug: string;
  title: string;
  status: "draft" | "published" | "archived";
  locale: string;
  seo: CmsSeo;
  blocks: CmsBlock[];
  updatedAt?: string;
};

export type CmsPageVersion = {
  version: number;
  reason: string | null;
  createdAt: string;
};
