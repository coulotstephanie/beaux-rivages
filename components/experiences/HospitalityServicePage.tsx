import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StructuredData } from "@/components/StructuredData";
import type { HospitalityService } from "@/hospitalityServices";
import { SITE_URL } from "@/seo";
import { ExperienceRequestForm } from "./ExperienceRequestForm";
import { ExperienceSections } from "./ExperienceSections";
import { ServiceGallery } from "./ServiceGallery";
import { WelcomeBaskets } from "./WelcomeBaskets";
import { hospitalityServices } from "@/hospitalityServices";
import { getExperienceEditorial } from "@/experienceEditorial";

export function HospitalityServicePage({ service }: { service: HospitalityService }) {
  const editorial = getExperienceEditorial(service.slug);
  const url = `${SITE_URL}/${service.slug}`;
  const included = service.sections.flatMap(({ title, items }) =>
    items.map((item) => `${title} · ${item}`),
  );
  const similar = hospitalityServices
    .filter(({ slug }) => slug !== service.slug)
    .map((item) => ({
      title: item.title,
      href: item.slug === "essentiel" ? "/essentiel" : `/${item.slug}`,
      image: item.image,
      imageAlt: item.imageAlt,
    }));
  const bookingHref =
    service.action === "included"
      ? "/reserver"
      : `/reserver?${service.slug === "animaux" ? "option=pet" : service.slug === "experience-signature" ? "option=signature" : service.slug === "panier-aperitif" ? "option=aperitif-basket" : service.slug === "panier-douceur" ? "option=basket" : "experience=romance"}`;
  return (
    <main className="hospitality-service-page">
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.intro,
            image: `${SITE_URL}${service.image}`,
            provider: { "@type": "LodgingBusiness", name: "Beaux Rivages", url: SITE_URL },
            offers:
              service.price === null
                ? undefined
                : {
                    "@type": "Offer",
                    price: service.price,
                    priceCurrency: "EUR",
                    availability: "https://schema.org/InStock",
                  },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
              {
                "@type": "ListItem",
                position: 2,
                name: "Expériences & Services",
                item: `${SITE_URL}/experiences`,
              },
              { "@type": "ListItem", position: 3, name: service.title, item: url },
            ],
          },
        ]}
      />
      <Header />
      <section className="hospitality-service-hero">
        <Image src={service.image} alt={service.imageAlt} fill priority sizes="100vw" />
        <div>
          <span aria-hidden="true">{service.icon}</span>
          <p className="eyebrow light">{service.badge}</p>
          <h1>{service.title}</h1>
          <p>{editorial.hook}</p>
        </div>
      </section>
      <section className="experience-emotional-story shell">
        <p className="eyebrow">Ce que vous allez vivre</p>
        <h2>{editorial.hook}</h2>
        <p>{editorial.moment}</p>
      </section>
      {service.slug === "experience-signature" ? (
        <div className="shell">
          <WelcomeBaskets showPrice={false} />
        </div>
      ) : null}
      <ExperienceSections
        presentation={service.intro}
        included={included}
        practical={
          service.practical ?? [
            { label: "Disponibilité", value: "Sur demande" },
            { label: "Maisons", value: "Selon l’expérience choisie" },
          ]
        }
        faq={
          service.faq ?? [
            {
              question: "Comment réserver cette expérience ?",
              answer:
                "Ajoutez-la à votre demande de séjour ou contactez directement Stéphanie et Bruno.",
            },
          ]
        }
        bookingHref={bookingHref}
        bookingLabel={
          service.action === "included" ? "Choisir ma maison" : "Ajouter cette expérience"
        }
        linenIncluded={service.linenIncluded}
        similar={similar}
        sources={service.sources}
        editorial={editorial}
      />
      <section className="service-gallery-section shell">
        <p className="eyebrow">L’atmosphère</p>
        <h2>Une expérience préparée avec justesse.</h2>
        <ServiceGallery gallery={service.gallery} />
      </section>
      {service.action === "quote" && (
        <section className="experience-request-section shell">
          <p className="eyebrow">Votre projet</p>
          <h2>Racontez-nous le moment que vous imaginez.</h2>
          <ExperienceRequestForm
            experience={service.slug as "demande-en-mariage" | "anniversaire"}
          />
        </section>
      )}
      <Footer />
    </main>
  );
}
