import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { PropertyCard } from "@/components/PropertyCard";
import { Heading, Section } from "@/components/ui";
import { properties } from "@/data";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";
import { DynamicCmsPage } from "@/components/cms/DynamicCmsPage";
import { getPublishedCmsPage } from "@/platform/cms/public";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";

const pageSeo = staticPageSeo["/maisons"];
export const metadata = createPageMetadata({
  ...pageSeo,
  image: siteMedia.properties["villa-raie-manta"].hero.src,
});

export default async function PropertiesPage() {
  const managedPage = await getPublishedCmsPage("maisons");
  if (managedPage) return <DynamicCmsPage page={managedPage} />;
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="page-hero properties-index-hero">
        <HeroBackground src={siteMedia.properties["villa-raie-manta"].hero.src} />
        <div className="page-hero-content">
          <p className="eyebrow light">Les maisons Beaux Rivages</p>
          <h1>Trois maisons, trois façons de vivre les îles.</h1>
          <p>
            Pierres anciennes, lumière sur l’océan ou plage au bout du chemin : choisissez la maison
            qui donnera son rythme à votre séjour.
          </p>
        </div>
      </section>
      <Section className="properties-index">
        <Heading
          eyebrow="Île de Ré · Île d’Oléron"
          title="Une même attention, des expériences singulières."
          description="Chaque maison possède son caractère, ses usages et sa relation particulière avec le rivage."
        />
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.slug}
              title={property.title}
              subtitle={property.intro}
              href={`/maisons/${property.slug}`}
              image={property.hero}
              location={property.location}
            />
          ))}
        </div>
      </Section>
      <Footer />
    </main>
  );
}
