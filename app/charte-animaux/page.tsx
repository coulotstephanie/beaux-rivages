import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/charte-animaux";
export const metadata = createPageMetadata({
  title: "Charte Animaux | Beaux Rivages",
  description: legalDocuments.animals.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.animals} path={path} />;
}
