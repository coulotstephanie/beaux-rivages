import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/mentions-legales";
export const metadata = createPageMetadata({
  title: "Mentions légales | Beaux Rivages",
  description: legalDocuments.mentions.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.mentions} path={path} />;
}
