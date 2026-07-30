import Link from "next/link";
import { properties } from "@/data";
import { propertyMedia } from "@/media/properties";

const comparisonRows = [
  { label: "Distance plage", values: ["250 m", "Quelques pas", "Portail privé à 20 m"] },
  { label: "Capacité", values: ["6 + bébé", "8 + bébé", "6 + bébé"] },
  { label: "Animaux", values: ["Acceptés", "Acceptés", "Acceptés sous conditions"] },
  { label: "Équipement bébé", values: ["Très complet", "Très complet", "Très complet"] },
  {
    label: "Vue",
    values: ["Maison de village", "Océan et pont de Ré", "Forêt et Fort Boyard depuis la plage"],
  },
  {
    label: "Cuisine",
    values: ["Signature, ultra-équipée", "Ouverte et familiale", "Très équipée, plain-pied"],
  },
  {
    label: "Ambiance",
    values: ["Pierre et patrimoine", "Design et lumière", "Nature et sérénité"],
  },
  {
    label: "Vidéos",
    values: [
      `${propertyMedia["chai-des-tortues"].videos.length} films`,
      `${propertyMedia["villa-raie-manta"].videos.length} film`,
      `${propertyMedia["nid-d-ete"].videos.length} film`,
    ],
  },
  { label: "Galerie", values: properties.map((property) => `${property.gallery.length} vues`) },
] as const;

export function HouseComparisonTable() {
  return (
    <div className="house-comparison">
      <div
        className="house-comparison__scroll"
        tabIndex={0}
        aria-label="Tableau comparatif des trois maisons, défilement horizontal possible"
      >
        <table>
          <caption className="sr-only">Comparaison détaillée des maisons Beaux Rivages</caption>
          <thead>
            <tr>
              <th scope="col">Critère</th>
              {properties.map((property) => (
                <th scope="col" key={property.slug}>
                  <span>{property.location}</span>
                  {property.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={`${row.label}-${properties[index].slug}`}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Découvrir</th>
              {properties.map((property) => (
                <td key={property.slug}>
                  <Link href={`/maisons/${property.slug}`}>
                    Voir la maison <span aria-hidden="true">→</span>
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
