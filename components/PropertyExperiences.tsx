import Image from "next/image";
import { BLUR_DATA_URL } from "@/media";
import type { PropertyPresentation } from "@/propertyPresentation";
import { Heading, Section } from "./ui";

type Experiences = NonNullable<PropertyPresentation["experiences"]>;

export function PropertyExperiences({
  experiences,
  heading,
}: {
  experiences: Experiences;
  heading?: PropertyPresentation["experiencesHeading"];
}) {
  return (
    <Section tone="sand" className="property-experiences" aria-labelledby="property-experiences-title">
      <Heading
        eyebrow={heading?.eyebrow ?? "L’art de vivre au Chai"}
        title={heading?.title ?? "Des journées simples, pleinement vécues."}
        description={heading?.description ?? "Le marché, l’océan et la grande cuisine composent des vacances qui suivent naturellement le rythme de l’île."}
        id="property-experiences-title"
      />
      <div className="property-experiences__grid">
        {experiences.map((experience, index) => {
          const wide = index === 0 || index === 5;
          return (
            <article className={wide ? "is-wide" : ""} key={experience.title}>
              <div className="property-experiences__media">
                <Image
                  src={experience.image}
                  alt={experience.alt}
                  fill
                  quality={88}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes={wide
                    ? "(max-width: 700px) 100vw, (max-width: 1200px) 66vw, 760px"
                    : "(max-width: 700px) 100vw, (max-width: 1200px) 34vw, 390px"}
                />
              </div>
              <div className="property-experiences__copy">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{experience.title}</h3>
                <p>{experience.copy}</p>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
