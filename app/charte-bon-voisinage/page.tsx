import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/charte-bon-voisinage";
export const metadata = createPageMetadata({
  title: "Charte du bon voisinage | Beaux Rivages",
  description: legalDocuments.neighborhood.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.neighborhood} path={path} />;
}
