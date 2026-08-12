import type { PropertyPresentation } from "@/propertyPresentation";
import { Heading, Section } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

export function PropertyExperienceTimeline({ timeline, locale = "fr" }: { timeline: PropertyPresentation["timeline"]; locale?: SupportedLocale }) {
  return (
    <Section tone="dark" className="experience-timeline">
      <Heading eyebrow={tr(locale, "Une journée idéale")} title={tr(locale, "Prendre le temps, du premier café à la lumière du soir.")} light />
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
