"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  AttentionType,
  BookingExperienceId,
  BookingSelection,
  BookingStep,
  GuestCounts,
  StayOptionId,
} from "@/booking";
import { isExperienceAvailableForProperty } from "@/booking";
import { emailBookingGateway } from "@/booking-submission";
import { properties } from "@/data";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { BookingConfirmationPreview } from "./BookingConfirmationPreview";
import { BookingExperiences } from "./BookingExperiences";
import { BookingSidebar } from "./BookingSidebar";
import { DirectBookingForm } from "./DirectBookingForm";
import type { BookingQuote } from "./PriceSummary";
import { BookingStepper } from "./BookingStepper";
import { GuestSelector } from "./GuestSelector";
import { PersonalAttentionCard } from "./PersonalAttentionCard";
import { PropertySelector } from "./PropertySelector";
import { StayOptions } from "./StayOptions";
import { Button, Container, Heading } from "./ui";
import { trackEvent } from "@/platform/analytics/events";

const initialSelection: BookingSelection = {
  propertySlug: null,
  arrival: null,
  departure: null,
  guests: { adults: 2, children: 0, babies: 0, pets: 0 },
  experiences: [],
  options: [],
  attention: null,
  attentionMessage: "",
};

const experienceQueryMap: Partial<Record<string, BookingExperienceId>> = {
  romance: "romance",
  anniversaire: "anniversaire",
};

export function BookingExperience({
  initialProperty,
  initialOptions = [],
  initialExperiences = [],
}: {
  initialProperty?: string;
  initialOptions?: StayOptionId[];
  initialExperiences?: string[];
}) {
  const hasInitialProperty = properties.some((property) => property.slug === initialProperty);
  const queriedExperiences = initialExperiences
    .map((slug) => experienceQueryMap[slug])
    .filter((id): id is BookingExperienceId => Boolean(id));
  const [step, setStep] = useState<BookingStep>(hasInitialProperty ? 2 : 1);
  const [maxAccessible, setMaxAccessible] = useState<BookingStep>(hasInitialProperty ? 2 : 1);
  const [propertyLocked, setPropertyLocked] = useState(hasInitialProperty);
  const [selection, setSelection] = useState<BookingSelection>({
    ...initialSelection,
    propertySlug: hasInitialProperty ? (initialProperty ?? null) : null,
    options: initialOptions,
    experiences: [
      ...new Set(
        queriedExperiences.filter((id) =>
          isExperienceAvailableForProperty(
            id,
            hasInitialProperty ? (initialProperty ?? null) : null,
          ),
        ),
      ),
    ],
    attentionMessage: "",
  });
  const [preview, setPreview] = useState(false);
  const [verifiedQuote, setVerifiedQuote] = useState<BookingQuote | null>(null);
  const [sourcesHealthy, setSourcesHealthy] = useState(false);
  const completedRef = useRef(false);
  const [finalValidation, setFinalValidation] = useState<{
    status: "idle" | "checking" | "error";
    message?: string;
  }>({ status: "idle" });
  const contentRef = useRef<HTMLDivElement>(null);
  const selectedProperty = useMemo(
    () => properties.find((property) => property.slug === selection.propertySlug),
    [selection.propertySlug],
  );

  useEffect(() => {
    if (selection.guests.pets > 0 && !selection.options.includes("pet")) {
      setSelection((current) => ({ ...current, options: [...current.options, "pet"] }));
    }
    if (selection.guests.pets === 0 && selection.options.includes("pet")) {
      setSelection((current) => ({
        ...current,
        options: current.options.filter((id) => id !== "pet"),
      }));
    }
  }, [selection.guests.pets, selection.options]);

  useEffect(() => {
    if (
      selection.options.includes("signature") &&
      !selection.options.some((id) => id === "signature-aperitif" || id === "signature-sweet")
    ) {
      setSelection((current) => ({
        ...current,
        options: [...current.options, "signature-aperitif"],
      }));
    }
  }, [selection.options]);

  useEffect(() => {
    const recordAbandonment = () => {
      if (step > 1 && !completedRef.current) {
        trackEvent("booking_abandoned", {
          step,
          property_slug: selection.propertySlug ?? "unknown",
        });
      }
    };
    window.addEventListener("pagehide", recordAbandonment);
    return () => window.removeEventListener("pagehide", recordAbandonment);
  }, [step, selection.propertySlug]);

  const changeStep = (next: BookingStep) => {
    if (propertyLocked && next === 1) return;
    setStep(next);
    setPreview(false);
    requestAnimationFrame(() =>
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const canContinue =
    step === 1
      ? Boolean(selection.propertySlug)
      : step === 2
        ? Boolean(selection.arrival && selection.departure)
        : true;
  const updateGuests = (guests: GuestCounts) => setSelection((current) => ({ ...current, guests }));
  const selectProperty = (propertySlug: string) => {
    trackEvent("search_availability", { property_slug: propertySlug });
    const capacity = Number(
      properties.find((property) => property.slug === propertySlug)?.capacity.match(/\d+/)?.[0] ??
        8,
    );
    setSelection((current) => {
      const adults = Math.min(current.guests.adults, capacity);
      const children = Math.min(current.guests.children, Math.max(0, capacity - adults));
      return {
        ...current,
        propertySlug,
        guests: { ...current.guests, adults, children },
        experiences: current.experiences.filter((id) =>
          isExperienceAvailableForProperty(id, propertySlug),
        ),
      };
    });
  };
  const updateOptions = (options: StayOptionId[]) =>
    setSelection((current) => ({ ...current, options }));
  const updateExperiences = (experiences: BookingExperienceId[]) =>
    setSelection((current) => ({ ...current, experiences }));
  const updateAttention = (attention: AttentionType | null, attentionMessage: string) =>
    setSelection((current) => ({ ...current, attention, attentionMessage }));

  const continueJourney = async () => {
    if (!canContinue) return;
    if (step < 4) {
      if (step === 1) setPropertyLocked(true);
      const next = (step + 1) as BookingStep;
      setMaxAccessible((current) => Math.max(current, next) as BookingStep);
      changeStep(next);
    } else if (selectedProperty && selection.arrival && selection.departure) {
      setFinalValidation({ status: "checking" });
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySlug: selectedProperty.slug,
          arrival: selection.arrival,
          departure: selection.departure,
          ...selection.guests,
          options: selection.options,
          experiences: selection.experiences,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        quote?: BookingQuote;
        sourcesHealthy?: boolean;
      };
      if (!response.ok) {
        setPreview(false);
        setFinalValidation({
          status: "error",
          message: result.error ?? "La disponibilité ou le tarif ne peut pas être confirmé.",
        });
        return;
      }
      setVerifiedQuote(result.quote ?? null);
      setSourcesHealthy(Boolean(result.sourcesHealthy));
      trackEvent("booking_quote_viewed", {
        property_slug: selectedProperty.slug,
        total: result.quote?.total ?? 0,
      });
      setFinalValidation({ status: "idle" });
      setPreview(true);
      requestAnimationFrame(() =>
        document.getElementById("booking-preview")?.scrollIntoView({ behavior: "smooth" }),
      );
    }
  };

  const submissionUrl = selectedProperty
    ? emailBookingGateway.getSubmissionUrl({ selection, property: selectedProperty })
    : "#";

  return (
    <>
      <div className="booking-stepper-wrap">
        <Container>
          <BookingStepper
            current={step}
            maxAccessible={maxAccessible}
            propertyLocked={propertyLocked}
            onSelect={changeStep}
          />
        </Container>
      </div>
      <Container className="booking-experience">
        <div className="booking-experience__main" ref={contentRef}>
          {propertyLocked && selectedProperty ? (
            <div className="booking-property-thread" role="status">
              <span>Vous réservez actuellement</span>
              <strong>{selectedProperty.title}</strong>
              <small>{selectedProperty.location}</small>
            </div>
          ) : null}
          {step === 1 && (
            <section aria-labelledby="booking-step-title">
              <Heading
                eyebrow="Étape 1 · Votre maison"
                title="Quelle atmosphère vous ressemble ?"
                id="booking-step-title"
              />
              <PropertySelector
                properties={properties}
                value={selection.propertySlug}
                onChange={selectProperty}
              />
            </section>
          )}
          {step === 2 && (
            <section aria-labelledby="booking-step-title">
              <Heading
                eyebrow="Étape 2 · Vos dates"
                title="Quand souhaitez-vous retrouver les îles ?"
                id="booking-step-title"
              />
              <AvailabilityCalendar
                arrival={selection.arrival}
                departure={selection.departure}
                propertySlug={selection.propertySlug ?? ""}
                onChange={(arrival, departure) =>
                  setSelection((current) => ({ ...current, arrival, departure }))
                }
              />
            </section>
          )}
          {step === 3 && (
            <section aria-labelledby="booking-step-title">
              <Heading
                eyebrow="Étape 3 · Les voyageurs"
                title="Pour qui préparons-nous la maison ?"
                id="booking-step-title"
              />
              <GuestSelector
                value={selection.guests}
                maxGuests={Number(selectedProperty?.capacity.match(/\d+/)?.[0] ?? 8)}
                onChange={updateGuests}
              />
            </section>
          )}
          {step === 4 && (
            <section aria-labelledby="booking-step-title">
              <Heading
                eyebrow="Étape 4 · Facultatif"
                title="Personnalisez votre séjour"
                id="booking-step-title"
              />
              <p className="booking-optional-intro">
                Cette étape est entièrement facultative. Vous pouvez continuer sans ajouter aucune
                attention ni expérience.
              </p>
              <StayOptions
                value={selection.options}
                guests={selection.guests}
                onChange={updateOptions}
              />
              <BookingExperiences selection={selection} onChange={updateExperiences} />
              <PersonalAttentionCard
                value={selection.attention}
                message={selection.attentionMessage}
                onChange={updateAttention}
              />
            </section>
          )}
          <div className="booking-experience__navigation">
            {step > 2 && (
              <button type="button" onClick={() => changeStep((step - 1) as BookingStep)}>
                ← Retour
              </button>
            )}
            <button
              type="button"
              className="booking-next-button"
              disabled={!canContinue || finalValidation.status === "checking"}
              onClick={() => void continueJourney()}
            >
              {finalValidation.status === "checking"
                ? "Vérification…"
                : step === 4
                  ? "Voir mon séjour"
                  : "Continuer"}{" "}
              <span aria-hidden="true">→</span>
            </button>
            {!canContinue && (
              <p role="status">
                {step === 1
                  ? "Choisissez une maison pour continuer."
                  : "Choisissez une date d’arrivée et de départ."}
              </p>
            )}
            {finalValidation.status === "error" ? (
              <p role="alert">{finalValidation.message}</p>
            ) : null}
          </div>
        </div>
        <BookingSidebar
          selection={selection}
          property={selectedProperty}
          onQuoteChange={setVerifiedQuote}
        />
      </Container>
      {preview && selectedProperty && (
        <div id="booking-preview" className="booking-preview-wrap">
          <Container>
            <BookingConfirmationPreview selection={selection} property={selectedProperty} />
            {verifiedQuote ? (
              <DirectBookingForm
                selection={selection}
                property={selectedProperty}
                quote={verifiedQuote}
                sourcesHealthy={sourcesHealthy}
                onSuccess={() => {
                  completedRef.current = true;
                }}
              />
            ) : null}
            <div className="booking-preview-wrap__action">
              <p>
                Si l’enregistrement en ligne est momentanément indisponible, vous pouvez toujours
                préparer la même demande dans votre application e-mail. Aucun paiement ne sera
                effectué.
              </p>
              <Button href={submissionUrl} variant="ghost">
                Préparer plutôt un e-mail
              </Button>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
