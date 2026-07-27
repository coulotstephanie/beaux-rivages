"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AttentionType, BookingExperienceId, BookingSelection, BookingStep, GuestCounts, StayOptionId } from "@/booking";
import { emailBookingGateway } from "@/booking-submission";
import { properties } from "@/data";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { BookingConfirmationPreview } from "./BookingConfirmationPreview";
import { BookingExperiences } from "./BookingExperiences";
import { BookingSidebar } from "./BookingSidebar";
import { BookingStepper } from "./BookingStepper";
import { GuestSelector } from "./GuestSelector";
import { PersonalAttentionCard } from "./PersonalAttentionCard";
import { PropertySelector } from "./PropertySelector";
import { StayOptions } from "./StayOptions";
import { Button, Container, Heading } from "./ui";

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
  "lune-de-miel": "lune-de-miel",
  "plateau-fruits-de-mer": "fruits-de-mer",
  "balade-velo": "velo",
  famille: "famille",
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
  const queriedExperiences = initialExperiences
    .map((slug) => experienceQueryMap[slug])
    .filter((id): id is BookingExperienceId => Boolean(id));
  const [step, setStep] = useState<BookingStep>(1);
  const [maxAccessible, setMaxAccessible] = useState<BookingStep>(1);
  const [selection, setSelection] = useState<BookingSelection>({
    ...initialSelection,
    propertySlug: properties.some((property) => property.slug === initialProperty) ? initialProperty ?? null : null,
    options: initialOptions,
    experiences: [...new Set(queriedExperiences)],
    attentionMessage: "",
  });
  const [preview, setPreview] = useState(false);
  const [finalValidation, setFinalValidation] = useState<{ status: "idle" | "checking" | "error"; message?: string }>({ status: "idle" });
  const contentRef = useRef<HTMLDivElement>(null);
  const selectedProperty = useMemo(() => properties.find((property) => property.slug === selection.propertySlug), [selection.propertySlug]);

  useEffect(() => {
    if (selection.guests.pets > 0 && !selection.options.includes("pet")) {
      setSelection((current) => ({ ...current, options: [...current.options, "pet"] }));
    }
    if (selection.guests.pets === 0 && selection.options.includes("pet")) {
      setSelection((current) => ({ ...current, options: current.options.filter((id) => id !== "pet") }));
    }
  }, [selection.guests.pets, selection.options]);

  const changeStep = (next: BookingStep) => {
    setStep(next);
    setPreview(false);
    requestAnimationFrame(() => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const canContinue = step === 1 ? Boolean(selection.propertySlug) : step === 2 ? Boolean(selection.arrival && selection.departure) : true;
  const updateGuests = (guests: GuestCounts) => setSelection((current) => ({ ...current, guests }));
  const selectProperty = (propertySlug: string) => {
    const capacity = Number(properties.find((property) => property.slug === propertySlug)?.capacity.match(/\d+/)?.[0] ?? 8);
    setSelection((current) => {
      const adults = Math.min(current.guests.adults, capacity);
      const children = Math.min(current.guests.children, Math.max(0, capacity - adults));
      return { ...current, propertySlug, guests: { ...current.guests, adults, children } };
    });
  };
  const updateOptions = (options: StayOptionId[]) => setSelection((current) => ({ ...current, options }));
  const updateExperiences = (experiences: BookingExperienceId[]) => setSelection((current) => ({ ...current, experiences }));
  const updateAttention = (attention: AttentionType | null, attentionMessage: string) => setSelection((current) => ({ ...current, attention, attentionMessage }));

  const continueJourney = async () => {
    if (!canContinue) return;
    if (step < 4) {
      const next = (step + 1) as BookingStep;
      setMaxAccessible((current) => Math.max(current, next) as BookingStep);
      changeStep(next);
    }
    else if (selectedProperty && selection.arrival && selection.departure) {
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
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setPreview(false);
        setFinalValidation({ status: "error", message: result.error ?? "La disponibilité ou le tarif ne peut pas être confirmé." });
        return;
      }
      setFinalValidation({ status: "idle" });
      setPreview(true);
      requestAnimationFrame(() => document.getElementById("booking-preview")?.scrollIntoView({ behavior: "smooth" }));
    }
  };

  const submissionUrl = selectedProperty
    ? emailBookingGateway.getSubmissionUrl({ selection, property: selectedProperty })
    : "#";

  return (
    <>
      <div className="booking-stepper-wrap"><Container><BookingStepper current={step} maxAccessible={maxAccessible} onSelect={changeStep} /></Container></div>
      <Container className="booking-experience">
        <div className="booking-experience__main" ref={contentRef}>
          {step === 1 && (
            <section aria-labelledby="booking-step-title">
              <Heading eyebrow="Étape 1 · Votre maison" title="Quelle atmosphère vous ressemble ?" id="booking-step-title" />
              <PropertySelector properties={properties} value={selection.propertySlug} onChange={selectProperty} />
            </section>
          )}
          {step === 2 && (
            <section aria-labelledby="booking-step-title">
              <Heading eyebrow="Étape 2 · Vos dates" title="Quand souhaitez-vous retrouver les îles ?" id="booking-step-title" />
              <AvailabilityCalendar
                arrival={selection.arrival}
                departure={selection.departure}
                propertySlug={selection.propertySlug ?? ""}
                onChange={(arrival, departure) => setSelection((current) => ({ ...current, arrival, departure }))}
              />
            </section>
          )}
          {step === 3 && (
            <section aria-labelledby="booking-step-title">
              <Heading eyebrow="Étape 3 · Les voyageurs" title="Pour qui préparons-nous la maison ?" id="booking-step-title" />
              <GuestSelector value={selection.guests} maxGuests={Number(selectedProperty?.capacity.match(/\d+/)?.[0] ?? 8)} onChange={updateGuests} />
            </section>
          )}
          {step === 4 && (
            <section aria-labelledby="booking-step-title">
              <Heading eyebrow="Étape 4 · Votre expérience" title="Les attentions qui changent un séjour." id="booking-step-title" />
              <BookingExperiences selection={selection} onChange={updateExperiences} />
              <StayOptions value={selection.options} onChange={updateOptions} />
              <PersonalAttentionCard
                value={selection.attention}
                message={selection.attentionMessage}
                onChange={updateAttention}
              />
            </section>
          )}
          <div className="booking-experience__navigation">
            {step > 1 && <button type="button" onClick={() => changeStep((step - 1) as BookingStep)}>← Retour</button>}
            <button type="button" className="booking-next-button" disabled={!canContinue || finalValidation.status === "checking"} onClick={() => void continueJourney()}>
              {finalValidation.status === "checking" ? "Vérification…" : step === 4 ? "Voir mon séjour" : "Continuer"} <span aria-hidden="true">→</span>
            </button>
            {!canContinue && <p role="status">{step === 1 ? "Choisissez une maison pour continuer." : "Choisissez une date d’arrivée et de départ."}</p>}
            {finalValidation.status === "error" ? <p role="alert">{finalValidation.message}</p> : null}
          </div>
        </div>
        <BookingSidebar selection={selection} property={selectedProperty} />
      </Container>
      {preview && selectedProperty && (
        <div id="booking-preview" className="booking-preview-wrap">
          <Container>
            <BookingConfirmationPreview selection={selection} property={selectedProperty} />
            <div className="booking-preview-wrap__action">
              <p>Cette prévisualisation ne constitue pas une réservation. Votre application e-mail va s’ouvrir ; la demande sera envoyée uniquement lorsque vous validerez le message. Aucun paiement ne vous sera demandé.</p>
              <Button href={submissionUrl}>Préparer l’e-mail de demande</Button>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
