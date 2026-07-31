import Image from "next/image";
import type { ReactNode } from "react";
import type { Property } from "@/data";
import { getPropertyPresentation } from "@/propertyPresentation";
import { reviewProfiles } from "@/reviews";
import { Footer } from "./Footer";
import { FullscreenGallery } from "./FullscreenGallery";
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

export function PropertyPage({ property, children }: { property: Property; children?: ReactNode }) {
  const presentation = getPropertyPresentation(property.slug);
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
  const usedMedia = [
    property.hero,
    ...property.gallery.map((image) => image.src),
    presentation.storyImage,
    ...presentation.dayStory.map((scene) => scene.image),
    ...(presentation.experiences?.map((experience) => experience.image) ?? []),
  ];
  if (usedMedia.some((src) => !allowedMedia.has(src))) {
    throw new Error(`Media missing from manifest for property: ${property.slug}`);
  }

  return (
    <main className={`premium-property-page property-${property.slug}`}>
      <StructuredData data={createPropertyStructuredData(property)} />
      <Header />
      <PropertyHero property={property} />
      <PropertyFacts property={property} />

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
          <p>{property.story}</p>
          <div className="property-signature-note">
            <span>La signature de la maison</span>
            <strong>{property.signatureTitle}</strong>
            <p>{property.signatureText}</p>
          </div>
          <Button href={`/reserver?maison=${property.slug}`} variant="ghost">
            Préparer mon séjour <span aria-hidden="true">→</span>
          </Button>
        </div>
      </section>

      <PropertyHighlights property={property} />

      <Section className="premium-gallery-section">
        <Heading
          eyebrow="La maison et ses horizons"
          title="Les espaces, les paysages, l’atmosphère du séjour."
          description="Parcourez en plein écran la maison et son environnement."
        />
        <FullscreenGallery images={property.gallery} />
      </Section>

      <PropertyDayStory scenes={presentation.dayStory} />

      <PropertyFilms films={manifest.videos} poster={property.hero} />

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
          eyebrow="Autour de la maison"
          title="Les îles à portée de pas."
          description="Sélectionnez un repère pour découvrir les essentiels autour de votre maison."
        />
        <NearbyMap map={presentation.map} />
      </Section>

      <PropertyAmenitiesGrid property={property} />
      <PropertyPracticalDetails property={property} />
      <PropertyDestinationLinks property={property} />

      {reviewProfile && (
        <Section tone="sand" className="property-review-section">
          <Heading
            eyebrow="Ils ont vécu Beaux Rivages"
            title="Ce sont nos voyageurs qui racontent le mieux la maison."
          />
          <Container size="narrow">
            <ReviewProfileCard profile={reviewProfile} />
          </Container>
        </Section>
      )}

      {children}

      <section className="premium-property-cta">
        <MediaBackground src={property.hero} />
        <Container>
          <p className="eyebrow light">Réserver en direct</p>
          <h2>{property.bookingTitle}</h2>
          <p>
            {property.bookingText} Réservation directe, échange avec Stéphanie, attentions
            personnalisables et paiement par Chèques-Vacances, virement bancaire ou espèces.
          </p>
          <Button href={`/reserver?maison=${property.slug}`}>Choisir mes dates</Button>
        </Container>
      </section>

      <Footer />
      <PropertyStickyBooking property={property} />
    </main>
  );
}
