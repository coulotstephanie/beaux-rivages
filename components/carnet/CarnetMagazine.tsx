import { carnetCategories, carnetSections } from "@/carnetData";
import { CarnetCategorySection } from "./CarnetCategorySection";

export function CarnetMagazine() {
  return (
    <>
      {carnetCategories.map((category, index) => (
        <CarnetCategorySection
          key={category.id}
          data={carnetSections[category.id]}
          tone={index % 2 ? "sand" : "light"}
          featured={category.featured}
        />
      ))}
    </>
  );
}
