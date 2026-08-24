import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
import { DynamicCmsPage } from "@/components/cms/DynamicCmsPage";
import { getPublishedCmsPage } from "@/platform/cms/public";
const path = "/conditions-generales-de-vente";
export const metadata = createPageMetadata({
  title: "Conditions Générales de Vente | Beaux Rivages",
  description: legalDocuments.cgv.description,
  path,
});
export default async function Page() {
  const managedPage = await getPublishedCmsPage("conditions-generales-de-vente");
  if (managedPage) return <DynamicCmsPage page={managedPage} />;
  return <LegalPage document={legalDocuments.cgv} path={path} />;
}
