import type { BookingSelection } from "@/booking";
import { bookingExperiences, stayOptions } from "@/booking";
import type { Property } from "@/data";

export type BookingSubmission = {
  selection: BookingSelection;
  property: Property;
};

export interface BookingGateway {
  getSubmissionUrl(submission: BookingSubmission): string;
}

export const emailBookingGateway: BookingGateway = {
  getSubmissionUrl({ selection, property }) {
    const optionLabels = selection.options.map((id) => stayOptions.find((item) => item.id === id)?.label ?? id);
    const experienceLabels = selection.experiences.map((id) => bookingExperiences.find((item) => item.id === id)?.label ?? id);
    const body = [
      "Bonjour Stéphanie et Bruno,",
      "",
      `Je souhaite vous transmettre mon projet de séjour à ${property.title}.`,
      `Arrivée : ${selection.arrival ?? "à préciser"}`,
      `Départ : ${selection.departure ?? "à préciser"}`,
      `Voyageurs : ${selection.guests.adults} adulte(s), ${selection.guests.children} enfant(s), ${selection.guests.babies} bébé(s), ${selection.guests.pets} animal(aux)`,
      `Expériences : ${experienceLabels.length ? experienceLabels.join(", ") : "aucune"}`,
      `Options : ${optionLabels.length ? optionLabels.join(", ") : "aucune"}`,
      `Attention : ${selection.attention ?? "aucune"}`,
      selection.attentionMessage ? `Message : ${selection.attentionMessage}` : "",
      "",
      "Merci de me confirmer les disponibilités et le tarif définitif.",
    ].filter(Boolean).join("\n");
    return `mailto:coulotstephanie@gmail.com?subject=${encodeURIComponent(`Projet de séjour — ${property.title}`)}&body=${encodeURIComponent(body)}`;
  },
};
