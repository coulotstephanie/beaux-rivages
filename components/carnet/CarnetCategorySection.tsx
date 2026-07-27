import type { CarnetSectionData } from "@/carnetData";
import { EditorialDivider } from "@/components/EditorialDivider";
import { Heading, Section } from "@/components/ui";
import { CarnetEntryCard } from "./CarnetEntryCard";

export function CarnetCategorySection({ data, tone = "light", featured = false }: { data: CarnetSectionData; tone?: "light" | "sand"; featured?: boolean }) {
  return (
    <Section id={data.id} tone={tone} className="carnet-category-section">
      <div className="carnet-category-section__heading">
        <Heading eyebrow={data.eyebrow} title={data.title} description={data.intro} />
        <EditorialDivider label={data.title} />
      </div>
      <div className={`carnet-category-section__grid${data.entries.length === 1 ? " is-single" : ""}`}>
        {data.entries.map((entry, index) => <CarnetEntryCard key={entry.slug} entry={entry} featured={featured && index === 0} />)}
      </div>
    </Section>
  );
}
