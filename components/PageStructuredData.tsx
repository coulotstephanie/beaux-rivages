import type { StaticPageSeo } from "@/content/fr/seo";
import { createPageStructuredData } from "@/seo";
import { StructuredData } from "./StructuredData";

export function PageStructuredData(config: StaticPageSeo) {
  return <StructuredData data={createPageStructuredData(config)} />;
}
