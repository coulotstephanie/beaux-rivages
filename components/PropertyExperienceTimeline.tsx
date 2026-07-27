import type { PropertyPresentation } from "@/propertyPresentation";
import { Heading, Section } from "./ui";

export function PropertyExperienceTimeline({ timeline }: { timeline: PropertyPresentation["timeline"] }) {
  return (
    <Section tone="dark" className="experience-timeline">
      <Heading eyebrow="Une journée idéale" title="Prendre le temps, du premier café à la lumière du soir." light />
      <ol>
        {timeline.map((step) => (
          <li key={step.time}>
            <time>{step.time}</time>
            <span aria-hidden="true" />
            <div><h3>{step.title}</h3><p>{step.copy}</p></div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
