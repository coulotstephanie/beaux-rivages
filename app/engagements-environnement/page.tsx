import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/engagements-environnement";
export const metadata = createPageMetadata({
  title: "Engagements environnementaux | Beaux Rivages",
  description: legalDocuments.environment.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.environment} path={path} />;
}
