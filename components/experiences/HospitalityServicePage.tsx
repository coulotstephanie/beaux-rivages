import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StructuredData } from "@/components/StructuredData";
import type { HospitalityService } from "@/hospitalityServices";
import { SITE_URL } from "@/seo";
import { ExperienceRequestForm } from "./ExperienceRequestForm";
import { ServiceGallery } from "./ServiceGallery";

export function HospitalityServicePage({ service }: { service: HospitalityService }) {
  const url = `${SITE_URL}/${service.slug}`;
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
          <p>{service.intro}</p>
        </div>
      </section>
      <section className="hospitality-service-content shell">
        {service.sections.map((section) => (
          <article key={section.title}>
            <p className="eyebrow">Beaux Rivages</p>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="service-gallery-section shell">
        <p className="eyebrow">L’atmosphère</p>
        <h2>Une expérience préparée avec justesse.</h2>
        <ServiceGallery gallery={service.gallery} />
      </section>
      {service.action === "quote" ? (
        <section className="experience-request-section shell">
          <p className="eyebrow">Votre projet</p>
          <h2>Racontez-nous le moment que vous imaginez.</h2>
          <ExperienceRequestForm
            experience={service.slug as "demande-en-mariage" | "anniversaire"}
          />
        </section>
      ) : (
        <section className="experience-detail-cta shell">
          <p className="eyebrow">Personnaliser votre séjour</p>
          <h2>
            {service.action === "included"
              ? "Cette attention fait déjà partie de l’hospitalité Beaux Rivages."
              : "Ajoutez cette expérience à votre demande de réservation."}
          </h2>
          <Link
            className="primary-button"
            href={
              service.action === "included"
                ? "/reserver"
                : `/reserver?${service.slug === "animaux" ? "option=pet" : service.slug === "experience-signature" ? "option=signature" : "experience=romance"}`
            }
          >
            {service.action === "included" ? "Choisir ma maison" : "Ajouter cette expérience"}
          </Link>
        </section>
      )}
      <Footer />
    </main>
  );
}
