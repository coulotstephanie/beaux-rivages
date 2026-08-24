import Image from "next/image";
import type { ReactNode } from "react";
import type { Property } from "@/data";
import { getPropertyPresentation } from "@/propertyPresentation";
import { reviewProfiles } from "@/reviews";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { HostRecommendation } from "./HostRecommendation";
import { MediaBackground } from "./MediaBackground";
import { NearbyMap } from "./NearbyMap";
import { PropertyAmenitiesGrid } from "./PropertyAmenitiesGrid";
import { PropertyExperienceTimeline } from "./PropertyExperienceTimeline";
import { PropertyExperiences } from "./PropertyExperiences";
import { PropertyFacts } from "./PropertyFacts";
import { PropertyFilms } from "./PropertyFilms";
import { PropertyHero } from "./PropertyHero";
import { PropertyHighlights } from "./PropertyHighlights";
import { PropertyHistoryStory } from "./PropertyHistoryStory";
import { PropertySignatureDetails } from "./PropertySignatureDetails";
import { PropertyDestinationLinks } from "./PropertyDestinationLinks";
import { PropertyPracticalDetails } from "./PropertyPracticalDetails";
import { PropertyDayStory } from "./PropertyDayStory";
import { PropertyStickyBooking } from "./PropertyStickyBooking";
import { ReviewProfileCard } from "./ReviewProfileCard";
import { Badge, Button, Container, Heading, Section } from "./ui";
import { StructuredData } from "./StructuredData";
import { propertyMedia, type PropertySlug } from "@/media/properties";
import type { MediaAsset } from "@/media/types";
import { createPropertyStructuredData } from "@/seo";
import { ChaiEditorialReport } from "./properties/ChaiEditorialReport";
import { IslandHouseEditorialReport } from "./properties/IslandHouseEditorialReport";
import { NidSaumonardsStory } from "./properties/NidSaumonardsStory";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as localize } from "@/i18n/lot1-client";

export function PropertyPage({
  property,
  children,
  locale = "fr",
}: {
  property: Property;
  children?: ReactNode;
  locale?: SupportedLocale;
}) {
  const presentation = getPropertyPresentation(property.slug);
  const hasChaiEditorialReport = property.slug === "chai-des-tortues";
  const reviewProfile = reviewProfiles.find((profile) => profile.slug === property.slug);
  const manifest = propertyMedia[property.slug as PropertySlug];
  const manifestAssets: readonly MediaAsset[] = [
    manifest.hero,
    ...manifest.gallery,
    ...manifest.arrival,
    ...manifest.exterior,
    ...manifest.livingRoom,
    ...manifest.kitchen,
    ...manifest.bedrooms,
    ...manifest.bathrooms,
    ...manifest.terrace,
    ...manifest.details,
    ...manifest.lifestyle,
    ...manifest.videos,
  ];
  const invalidOwnedMedia = manifestAssets.find(
    (asset) => asset.scope === "property" && asset.owner !== property.slug,
  );
  if (invalidOwnedMedia) {
    throw new Error(
      `Media owned by another property on ${property.slug}: ${invalidOwnedMedia.src}`,
    );
  }
  const allowedMedia = new Set(manifestAssets.map((asset) => asset.src));
  const storyAsset = manifestAssets.find((asset) => asset.src === presentation.storyImage);
  const ctaImages: Record<PropertySlug, string> = {
    "chai-des-tortues": "/images/properties/chai-des-tortues/details/escalier-colimacon.jpeg",
    "villa-raie-manta": "/images/properties/villa-raie-manta/airbnb-cour-d-entree-1.jpeg",
    "nid-d-ete": "/images/properties/nid-d-ete/airbnb-arriere-cour-4.jpeg",
  };
  const usedMedia = [
    property.hero,
    ...property.gallery.map((image) => image.src),
    presentation.storyImage,
    ...presentation.dayStory.map((scene) => scene.image),
    ...(presentation.experiences?.map((experience) => experience.image) ?? []),
  ];
  if (
    usedMedia.some(
      (src) =>
        !allowedMedia.has(src) &&
        !src.startsWith("/images/destination/") &&
        !src.startsWith("http"),
    )
  ) {
    throw new Error(`Media missing from manifest for property: ${property.slug}`);
  }

  return (
    <main className={`premium-property-page property-${property.slug}`}>
      <StructuredData data={createPropertyStructuredData(property)} />
      <Header locale={locale} />
      <PropertyHero property={property} locale={locale} />
      <PropertyHistoryStory propertySlug={property.slug as PropertySlug} />

      {hasChaiEditorialReport ? (
        <ChaiEditorialReport
          locale={locale}
          mediaOverrides={property.visualMediaOverrides}
          mediaOrder={property.visualMediaOrder}
          textOverrides={property.visualTextOverrides}
        />
      ) : null}

      {property.slug === "villa-raie-manta" || property.slug === "nid-d-ete" ? (
        <IslandHouseEditorialReport
          locale={locale}
          house={property.slug}
          mediaOverrides={property.visualMediaOverrides}
          mediaOrder={property.visualMediaOrder}
          textOverrides={property.visualTextOverrides}
        />
      ) : (
        !hasChaiEditorialReport && <PropertyDayStory scenes={presentation.dayStory} />
      )}

      {property.slug === "nid-d-ete" && <NidSaumonardsStory locale={locale} />}

      <PropertyFilms films={manifest.videos} poster={property.hero} />

      {reviewProfile && (
        <Section tone="sand" className="property-review-section" id="avis-voyageurs">
          <Heading
            eyebrow={localize(locale, "Pourquoi nos voyageurs reviennent")}
            title={localize(locale, "Ce qu’ils retiennent vraiment de leur séjour.")}
            description={localize(
              locale,
              `Plus de ${reviewProfile.airbnbReviewCount + (reviewProfile.otherSources?.reduce((total, source) => total + (source.reviewCount ?? 0), 0) ?? 0)} voyageurs nous ont déjà fait confiance pour cette maison.`,
            )}
          />
          <Container size="narrow">
            <ReviewProfileCard profile={reviewProfile} />
          </Container>
        </Section>
      )}

      <PropertySignatureDetails propertySlug={property.slug as PropertySlug} />

      <PropertyFacts property={property} locale={locale} />

      <section id="histoire" className="property-story-premium">
        <div className="property-story-premium__visual">
          <Image
            src={presentation.storyImage}
            alt={storyAsset?.alt ?? `Atmosphère de ${property.title}`}
            fill
            quality={85}
            loading="lazy"
            sizes="(max-width: 900px) 100vw, 48vw"
          />
        </div>
        <div className="property-story-premium__copy">
          <Badge>{presentation.storyEyebrow}</Badge>
          <h2>{presentation.storyTitle}</h2>
          <div className="property-signature-note">
            <span>{localize(locale, "La signature de la maison")}</span>
            <strong data-editor-field="signatureTitle">{property.signatureTitle}</strong>
            <p data-editor-field="signatureText">{property.signatureText}</p>
          </div>
          <Button href={`/reserver?maison=${property.slug}`} variant="ghost">
            {localize(locale, "Préparer mon séjour")} <span aria-hidden="true">→</span>
          </Button>
        </div>
      </section>

      <PropertyHighlights property={property} locale={locale} />

      {presentation.experiences && (
        <PropertyExperiences
          experiences={presentation.experiences}
          heading={presentation.experiencesHeading}
        />
      )}

      <PropertyExperienceTimeline timeline={presentation.timeline} />

      <HostRecommendation
        slugs={property.recommendationSlugs}
        fallback={{ title: property.signatureTitle, copy: property.signatureText }}
      />

      <Section className="nearby-section">
        <Heading
          eyebrow={localize(locale, "Autour de la maison")}
          title={localize(locale, "Les îles à portée de pas.")}
          description={localize(
            locale,
            "Sélectionnez un repère pour découvrir les essentiels autour de votre maison.",
          )}
        />
        <NearbyMap map={presentation.map} />
      </Section>

      <PropertyAmenitiesGrid property={property} locale={locale} />
      <PropertyPracticalDetails property={property} locale={locale} />
      <PropertyDestinationLinks property={property} />

      {children}

      <section className="premium-property-cta">
        <MediaBackground src={ctaImages[property.slug as PropertySlug]} />
        <Container>
          <p className="eyebrow light">{localize(locale, "Réserver en direct")}</p>
          <h2 data-editor-field="bookingTitle">{property.bookingTitle}</h2>
          <p>
            <span data-editor-field="bookingText">{property.bookingText}</span>{" "}
            {localize(
              locale,
              "Réservation directe, échange avec Stéphanie, attentions personnalisables et règlement sécurisé par virement bancaire.",
            )}
          </p>
          <Button href={`/${locale === "fr" ? "" : `${locale}/`}reserver?maison=${property.slug}`}>
            {localize(locale, "Choisir mes dates")}
          </Button>
        </Container>
      </section>

      <Footer locale={locale} />
      <PropertyStickyBooking property={property} locale={locale} />
    </main>
  );
}
