"use client";

import Image from "next/image";
import Link from "next/link";
import type { StayOptionId } from "@/booking";

export type WelcomeBasketChoice = Extract<StayOptionId, "aperitif-basket" | "basket"> | null;

export const welcomeBaskets = [
  {
    id: "aperitif-basket" as const,
    title: "Panier Apéritif Beaux Rivages",
    intro:
      "Commencez votre séjour autour de saveurs locales soigneusement sélectionnées pour partager un moment convivial dès votre arrivée.",
    image: "/images/properties/villa-raie-manta/editorial/ilot-aperitif.png",
    imageAlt: "Panier apéritif Beaux Rivages composé de produits artisanaux locaux",
    items: [
      "Une bouteille de vin Pelletier de l’Île de Ré — rouge, blanc ou rosé, au choix lors de la réservation",
      "Une sélection de biscuits apéritifs artisanaux de L’Atelier de la Biscuiterie de Ré",
      "Une terrine artisanale",
      "Une carte présentant les produits, leurs producteurs et les recommandations de Stéphanie & Bruno",
    ],
  },
  {
    id: "basket" as const,
    title: "Panier Douceur Beaux Rivages",
    intro:
      "Une sélection de gourmandises artisanales pour commencer votre séjour sur une note sucrée.",
    image: "/images/destination/experiences/panier-douceur-beaux-rivages.webp",
    imageAlt: "Panier Douceur Beaux Rivages composé de gourmandises artisanales",
    items: [
      "Une sélection de biscuits artisanaux de L’Atelier de la Biscuiterie de Ré",
      "Une confiture artisanale préparée localement",
      "Des caramels au beurre salé",
      "Une bouteille de jus de fruits",
      "Une carte présentant les produits, leurs producteurs et les recommandations de Stéphanie & Bruno",
    ],
  },
];

export function WelcomeBaskets({
  value,
  onChange,
  showPrice = true,
}: {
  value?: WelcomeBasketChoice;
  onChange?: (choice: WelcomeBasketChoice) => void;
  showPrice?: boolean;
}) {
  const selectable = Boolean(onChange);
  return (
    <section className="welcome-basket-experience" aria-labelledby="welcome-baskets-title">
      <div className="welcome-basket-experience__heading">
        <p className="eyebrow">Accueil gourmand</p>
        <h2 id="welcome-baskets-title">Deux paniers, une même attention portée aux producteurs.</h2>
        <p>
          Le choix du panier est effectué lors de la réservation.
          {showPrice ? " Chaque panier coûte 45 € par séjour." : ""}
        </p>
        {selectable ? (
          <label className={`welcome-basket-none${value === null ? " is-selected" : ""}`}>
            <input
              type="radio"
              name="welcome-basket"
              checked={value === null}
              onChange={() => onChange?.(null)}
            />
            Aucun panier
          </label>
        ) : null}
      </div>
      <div className="welcome-basket-experience__grid">
        {welcomeBaskets.map((basket) => {
          const selected = value === basket.id;
          return (
            <article className={selected ? "is-selected" : ""} key={basket.id}>
              <div className="welcome-basket-experience__image">
                <Image
                  src={basket.image}
                  alt={basket.imageAlt}
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </div>
              <div className="welcome-basket-experience__copy">
                <h3>{basket.title}</h3>
                {showPrice ? <strong>45 € par séjour</strong> : null}
                <p>{basket.intro}</p>
                <ul>
                  {basket.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {selectable ? (
                  <label className="primary-button">
                    <input
                      type="radio"
                      name="welcome-basket"
                      checked={selected}
                      onChange={() => onChange?.(basket.id)}
                    />
                    {selected ? "Panier choisi" : "Choisir ce panier"}
                  </label>
                ) : (
                  <Link className="primary-button" href={`/reserver?option=${basket.id}`}>
                    Choisir ce panier
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function SignatureWelcomeBaskets({
  included,
  extra,
  onIncludedChange,
  onExtraChange,
}: {
  included: "signature-aperitif" | "signature-sweet";
  extra: "aperitif-basket" | "basket" | null;
  onIncludedChange: (choice: "signature-aperitif" | "signature-sweet") => void;
  onExtraChange: (choice: "aperitif-basket" | "basket" | null) => void;
}) {
  const includedIsAperitif = included === "signature-aperitif";
  const extraChoice = includedIsAperitif ? "basket" : "aperitif-basket";
  const extraBasket = welcomeBaskets.find((item) => item.id === extraChoice)!;
  return (
    <section className="welcome-basket-experience" aria-labelledby="signature-baskets-title">
      <div className="welcome-basket-experience__heading">
        <p className="eyebrow">Votre panier gourmand inclus</p>
        <h2 id="signature-baskets-title">Choisissez votre panier de bienvenue.</h2>
        <p>Ce premier panier est inclus dans l’Expérience Signature, sans supplément.</p>
      </div>
      <div className="welcome-basket-experience__grid">
        {welcomeBaskets.map((basket) => {
          const choice = basket.id === "aperitif-basket" ? "signature-aperitif" : "signature-sweet";
          const selected = choice === included;
          return (
            <label className={selected ? "is-selected" : ""} key={choice}>
              <div className="welcome-basket-experience__image">
                <Image
                  src={basket.image}
                  alt={basket.imageAlt}
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </div>
              <div className="welcome-basket-experience__copy">
                <input
                  type="radio"
                  name="signature-basket"
                  checked={selected}
                  onChange={() => onIncludedChange(choice)}
                />
                <h3>{basket.title}</h3>
                <p>{basket.intro}</p>
                <strong>{selected ? "Panier inclus choisi" : "Choisir ce panier"}</strong>
              </div>
            </label>
          );
        })}
      </div>
      <div className="welcome-basket-experience__heading">
        <p className="eyebrow">Une gourmandise supplémentaire</p>
        <h2>Souhaitez-vous également profiter du second panier pendant votre séjour ?</h2>
        <label className={`welcome-basket-none${extra === extraChoice ? " is-selected" : ""}`}>
          <input
            type="checkbox"
            checked={extra === extraChoice}
            onChange={(event) => onExtraChange(event.target.checked ? extraChoice : null)}
          />
          Ajouter le {extraBasket.title} (+45 €)
        </label>
      </div>
    </section>
  );
}
