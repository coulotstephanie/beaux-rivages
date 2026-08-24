import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartFaq } from "@/components/SmartFaq";
import { smartFaqs } from "@/faqData";
import { StructuredData } from "@/components/StructuredData";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { createPageMetadata } from "@/seo";
import { DynamicCmsPage } from "@/components/cms/DynamicCmsPage";
import { getPublishedCmsPage } from "@/platform/cms/public";

const pageSeo = staticPageSeo["/faq"];
export const metadata = createPageMetadata(pageSeo);
export default async function FaqPage() {
  const managedPage = await getPublishedCmsPage("faq");
  if (managedPage) return <DynamicCmsPage page={managedPage} />;
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: smartFaqs.map(([, question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }}
      />
      <Header contrast="dark" />
      <section className="faq-hero shell">
        <p className="eyebrow">Questions fréquentes</p>
        <h1>Une réponse claire, au bon moment.</h1>
        <p>
          Maisons, îles, réservation, enfants, animaux, vélo ou plages : filtrez selon votre
          question.
        </p>
      </section>
      <section className="faq-section shell">
        <SmartFaq />
      </section>
      <Footer />
    </main>
  );
}
