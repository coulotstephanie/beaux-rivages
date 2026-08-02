"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TravelParty = "couple" | "famille" | "amis";
type Interest = "gastronomie" | "velo" | "plages" | "patrimoine" | "nature" | "nautique";

const parties: { id: TravelParty; label: string; house: string }[] = [
  { id: "couple", label: "En couple", house: "Le Chai des Tortues" },
  { id: "famille", label: "En famille", house: "Le Nid d’Été" },
  { id: "amis", label: "Entre amis", house: "Villa Raie Manta" },
];
const interests: { id: Interest; label: string }[] = [
  { id: "gastronomie", label: "Gastronomie" },
  { id: "velo", label: "Vélo" },
  { id: "plages", label: "Plages" },
  { id: "patrimoine", label: "Patrimoine" },
  { id: "nature", label: "Nature" },
  { id: "nautique", label: "Sports nautiques" },
];
const itineraryByInterest: Record<
  Interest,
  { morning: string; afternoon: string; evening: string }
> = {
  gastronomie: {
    morning: "Marché et rencontre avec un producteur",
    afternoon: "Déjeuner choisi dans le Carnet",
    evening: "Dîner autour des produits du marché",
  },
  velo: {
    morning: "Boucle à vélo adaptée au vent",
    afternoon: "Village, port et halte glacée",
    evening: "Retour par la côte à l’heure dorée",
  },
  plages: {
    morning: "Plage calme avant l’affluence",
    afternoon: "Temps libre et sieste à la maison",
    evening: "Coucher de soleil sur le sable",
  },
  patrimoine: {
    morning: "Tours ou village fortifié",
    afternoon: "Musée et ruelles anciennes",
    evening: "Dîner près d’un port",
  },
  nature: {
    morning: "Marais ou forêt au réveil",
    afternoon: "Observation du littoral",
    evening: "Balade douce sans programme",
  },
  nautique: {
    morning: "Activité encadrée selon les conditions",
    afternoon: "Récupération et plage abritée",
    evening: "Apéritif face à l’océan",
  },
};

export function SignatureStayBuilder() {
  const [party, setParty] = useState<TravelParty | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const plan = useMemo(() => {
    const chosen = selectedInterests.length ? selectedInterests : ["nature" as const];
    return chosen.slice(0, 3).map((interest, index) => ({
      day: `Jour ${index + 1}`,
      interest: interests.find((item) => item.id === interest)?.label ?? interest,
      ...itineraryByInterest[interest],
    }));
  }, [selectedInterests]);
  const house = parties.find((item) => item.id === party)?.house;
  const houseSlug =
    party === "famille" ? "nid-d-ete" : party === "amis" ? "villa-raie-manta" : "chai-des-tortues";

  const toggleInterest = (interest: Interest) =>
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );

  return (
    <div className="signature-builder">
      <div className="signature-builder__progress" aria-label={`Étape ${step} sur 3`}>
        {[1, 2, 3].map((item) => (
          <span key={item} className={step >= item ? "is-active" : ""}>
            {item}
          </span>
        ))}
      </div>

      {step === 1 ? (
        <fieldset>
          <legend>
            <span>01</span>Vous voyagez…
          </legend>
          <div className="signature-builder__party">
            {parties.map((item) => (
              <button
                key={item.id}
                type="button"
                className={party === item.id ? "is-active" : ""}
                aria-pressed={party === item.id}
                onClick={() => setParty(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            className="signature-builder__next"
            type="button"
            disabled={!party}
            onClick={() => setStep(2)}
          >
            Continuer <span aria-hidden="true">→</span>
          </button>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset>
          <legend>
            <span>02</span>Vous aimez…
          </legend>
          <div className="signature-builder__interests">
            {interests.map((item) => (
              <button
                key={item.id}
                type="button"
                className={selectedInterests.includes(item.id) ? "is-active" : ""}
                aria-pressed={selectedInterests.includes(item.id)}
                onClick={() => toggleInterest(item.id)}
              >
                <span>{selectedInterests.includes(item.id) ? "✓" : "+"}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div className="signature-builder__navigation">
            <button type="button" onClick={() => setStep(1)}>
              Retour
            </button>
            <button
              className="signature-builder__next"
              type="button"
              disabled={!selectedInterests.length}
              onClick={() => setStep(3)}
            >
              Créer mon séjour <span aria-hidden="true">→</span>
            </button>
          </div>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <div className="signature-builder__result" aria-live="polite">
          <p className="eyebrow light">Votre séjour signature</p>
          <h2>{house}, comme point de départ.</h2>
          <p>
            Une première proposition pour{" "}
            {parties.find((item) => item.id === party)?.label.toLocaleLowerCase("fr")}, à ajuster
            selon la météo, les marées et votre rythme.
          </p>
          <div className="signature-builder__days">
            {plan.map((day) => (
              <article key={day.day}>
                <p>
                  {day.day} · {day.interest}
                </p>
                <ol>
                  <li>
                    <time>09:00</time>
                    {day.morning}
                  </li>
                  <li>
                    <time>14:00</time>
                    {day.afternoon}
                  </li>
                  <li>
                    <time>18:30</time>
                    {day.evening}
                  </li>
                </ol>
              </article>
            ))}
          </div>
          <div className="signature-builder__actions">
            <Link
              className="primary-button"
              href={`/reserver?maison=${houseSlug}&profil=${party}&envies=${selectedInterests.join(",")}`}
            >
              Préparer ce séjour
            </Link>
            <button type="button" onClick={() => setStep(2)}>
              Modifier mes envies
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
