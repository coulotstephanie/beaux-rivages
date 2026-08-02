"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { experiences, getExperienceHref } from "@/experiences";
import { hostRecommendations } from "@/recommendations";
import { properties } from "@/data";

const travelGroups = ["En couple", "En famille", "Entre amis"] as const;
const interests = ["Gastronomie", "Plages", "Nature", "Vélo"] as const;

export function InspirationQuiz() {
  const [group, setGroup] = useState<(typeof travelGroups)[number]>("En couple");
  const [likes, setLikes] = useState<string[]>(["Gastronomie"]);
  const result = useMemo(() => {
    const property =
      group === "Entre amis"
        ? properties[1]
        : group === "En famille"
          ? properties[2]
          : likes.includes("Plages")
            ? properties[1]
            : properties[0];
    const experience = experiences
      .filter((item) => {
        const text = `${item.title} ${item.text}`.toLowerCase();
        return likes.some((like) =>
          text.includes(like.toLowerCase().replace("gastronomie", "gour")),
        );
      })
      .slice(0, 3);
    return {
      property,
      experiences: experience.length
        ? experience
        : experiences.filter((item) =>
            ["balade-velo", "coucher-de-soleil", "romance"].includes(item.slug),
          ),
      addresses: hostRecommendations
        .filter(
          (item) => item.island === (property.slug === "nid-d-ete" ? "Île d’Oléron" : "Île de Ré"),
        )
        .slice(0, 3),
    };
  }, [group, likes]);

  const toggleLike = (like: string) =>
    setLikes((current) =>
      current.includes(like) ? current.filter((item) => item !== like) : [...current, like],
    );

  return (
    <div className="inspiration-quiz">
      <div className="inspiration-quiz__form">
        <fieldset>
          <legend>Vous partez…</legend>
          {travelGroups.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setGroup(item)}
              className={group === item ? "is-selected" : ""}
              aria-pressed={group === item}
            >
              {group === item ? "●" : "○"} {item}
            </button>
          ))}
        </fieldset>
        <fieldset>
          <legend>Vous aimez…</legend>
          {interests.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => toggleLike(item)}
              className={likes.includes(item) ? "is-selected" : ""}
              aria-pressed={likes.includes(item)}
            >
              {likes.includes(item) ? "●" : "○"} {item}
            </button>
          ))}
        </fieldset>
      </div>
      <div className="inspiration-quiz__result" aria-live="polite">
        <p className="eyebrow">Votre échappée Beaux Rivages</p>
        <h2>{result.property.title}</h2>
        <p>{result.property.intro}</p>
        <div className="inspiration-quiz__columns">
          <div>
            <strong>À vivre</strong>
            {result.experiences.map((item) => (
              <Link key={item.slug} href={getExperienceHref(item.slug)}>
                {item.title} <span>↗</span>
              </Link>
            ))}
          </div>
          <div>
            <strong>À goûter</strong>
            {result.addresses.map((item) => (
              <a key={item.slug} href={item.website} target="_blank" rel="noreferrer">
                {item.name} <span>↗</span>
              </a>
            ))}
          </div>
        </div>
        <p className="inspiration-quiz__route">
          Itinéraire suggéré : marché le matin · expérience choisie l’après-midi · dîner à la maison
          · rivage au coucher du soleil.
        </p>
        <Link
          className="primary-button"
          href={`/reserver?maison=${result.property.slug}&option=signature`}
        >
          Créer ce séjour
        </Link>
      </div>
    </div>
  );
}
