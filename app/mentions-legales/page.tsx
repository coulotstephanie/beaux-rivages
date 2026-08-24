import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
import { DynamicCmsPage } from "@/components/cms/DynamicCmsPage";
import { getPublishedCmsPage } from "@/platform/cms/public";
const path = "/mentions-legales";
export const metadata = createPageMetadata({
  title: "Mentions légales | Beaux Rivages",
  description: legalDocuments.mentions.description,
  path,
});
export default async function Page() {
  const managedPage = await getPublishedCmsPage("mentions-legales");
  if (managedPage) return <DynamicCmsPage page={managedPage} />;
  return <LegalPage document={legalDocuments.mentions} path={path} />;
}
