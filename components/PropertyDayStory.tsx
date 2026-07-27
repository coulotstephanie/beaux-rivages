import Image from "next/image";
import type { PropertyPresentation } from "@/propertyPresentation";
import { BLUR_DATA_URL } from "@/media";
import { EditorialDivider } from "./EditorialDivider";
import { Container, Heading } from "./ui";

export function PropertyDayStory({ scenes }: { scenes: PropertyPresentation["dayStory"] }) {
  return (
    <section className="property-day-story" aria-labelledby="day-story-title">
      <Container className="property-day-story__intro">
        <Heading
          eyebrow="Du matin à la nuit"
          title="Une maison ne se visite pas. Elle se vit, heure après heure."
          description="La lumière, les gestes et les paysages racontent une journée Beaux Rivages."
          id="day-story-title"
          light
        />
        <EditorialDivider label="Une journée sur les îles" />
      </Container>
      <div className="property-day-story__scenes">
        {scenes.map((scene, index) => (
          <article className={`day-scene day-scene--${scene.align ?? (index % 2 ? "right" : "left")}`} key={scene.phase}>
            <div className="day-scene__media">
              <Image
                src={scene.image}
                alt=""
                fill
                quality={90}
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="100vw"
              />
              <span className="day-scene__veil" />
            </div>
            <Container className="day-scene__content">
              <div>
                <span className="day-scene__number">0{index + 1}</span>
                <p className="eyebrow light">{scene.phase}</p>
                <h3>{scene.title}</h3>
                <p>{scene.copy}</p>
                <blockquote>« {scene.quote} »</blockquote>
              </div>
            </Container>
          </article>
        ))}
      </div>
    </section>
  );
}
