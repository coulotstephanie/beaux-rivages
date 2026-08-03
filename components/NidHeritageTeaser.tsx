import Image from "next/image";
import { Button, Container } from "./ui";

export function NidHeritageTeaser() {
  return (
    <section className="heritage-teaser">
      <div className="heritage-teaser__image">
        <Image
          src="/images/destination/patrimoine/dune-boyardville.jpg"
          alt="Le littoral de Boyardville entre dunes, forêt et océan"
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </div>
      <Container>
        <p className="eyebrow light">L’histoire des lieux</p>
        <h2>Dormir au cœur de l’histoire de Fort Boyard.</h2>
        <p>
          Le Nid d’Été se trouve dans La Maison Heureuse, un ensemble édifié dès 1803 pour
          accompagner le chantier de Fort Boyard, puis transformé en colonie de vacances. Un
          patrimoine inscrit Monument historique, entre forêt et plage.
        </p>
        <Button href="/maison-heureuse-fort-boyard" variant="secondary">
          Découvrir cette histoire <span aria-hidden="true">→</span>
        </Button>
      </Container>
    </section>
  );
}
