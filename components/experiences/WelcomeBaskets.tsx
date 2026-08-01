"use client";

import Image from "next/image";
import Link from "next/link";
import type { StayOptionId } from "@/booking";

export type WelcomeBasketChoice = Extract<StayOptionId, "aperitif-basket" | "basket"> | null;

const baskets = [
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
    image: "/images/destination/petit-dejeuner-ocean.jpg",
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
        {baskets.map((basket) => {
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
