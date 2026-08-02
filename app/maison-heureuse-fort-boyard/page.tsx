import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageStructuredData } from "@/components/PageStructuredData";
import { Button, Container } from "@/components/ui";
import { staticPageSeo } from "@/content/fr/seo";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/maison-heureuse-fort-boyard"];
const hero = "/images/properties/nid-d-ete/authentique/maison-heureuse-vue-aerienne.jpg";

export const metadata = createPageMetadata({ ...pageSeo, image: hero });

export default function MaisonHeureuseFortBoyardPage() {
  return (
    <main className="heritage-page">
      <PageStructuredData {...pageSeo} />
      <Header />

      <section className="heritage-hero">
        <Image
          src={hero}
          alt="Vue aérienne de La Maison Heureuse entre forêt et plage des Saumonards"
          fill
          priority
          sizes="100vw"
        />
        <div className="heritage-hero__overlay" />
        <Container>
          <p className="eyebrow light">Boyardville · Île d’Oléron</p>
          <h1>Dormir au cœur de l’histoire de Fort Boyard.</h1>
          <p>
            Le Nid d’Été vous accueille dans La Maison Heureuse, un patrimoine rare intimement lié à
            la naissance de Boyardville et au grand chantier du fort.
          </p>
        </Container>
      </section>

      <section className="heritage-chapter shell">
        <div className="heritage-chapter__copy">
          <p className="eyebrow">1803 · La naissance d’un lieu</p>
          <h2>La Maison Heureuse, deux siècles face à l’océan.</h2>
          <p>
            Dès 1803, un vaste ensemble est construit à Boyardville pour abriter les magasins et les
            logements des ingénieurs, militaires, artisans et ouvriers engagés dans l’édification de
            Fort Boyard. Près de trois cents personnes pouvaient alors y être accueillies.
          </p>
          <p>
            Après le chantier, le site connaît plusieurs vies. La Marine y installe une école des
            torpilles en 1875, puis une caserne. Dans les années 1920, l’architecte Clément Camus et
            le décorateur André Hellé transforment l’ensemble en colonie de vacances : La Maison
            Heureuse.
          </p>
          <p>
            Pensée autour de l’air, de la lumière et de la nature, son architecture de villégiature
            ouvre une nouvelle page tournée vers l’enfance et les séjours au bord de la mer. Tous
            ses bâtiments sont inscrits au titre des Monuments historiques depuis le 23 juillet
            2004.
          </p>
        </div>
        <figure className="heritage-chapter__media">
          <Image
            src="/images/properties/nid-d-ete/airbnb-exterieur-1-1.jpeg"
            alt="Façade historique de La Maison Heureuse à Boyardville"
            fill
            sizes="(max-width: 900px) 100vw, 44vw"
          />
          <figcaption>L’élégance balnéaire préservée de La Maison Heureuse.</figcaption>
        </figure>
      </section>

      <section className="heritage-fort">
        <div className="heritage-fort__media">
          <Image
            src="/images/properties/nid-d-ete/fort-boyard-saumonards.jpg"
            alt="Fort Boyard vu depuis la plage des Saumonards"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="heritage-fort__copy">
          <p className="eyebrow light">Le vaisseau de pierre</p>
          <h2>Fort Boyard, à l’horizon.</h2>
          <p>
            Imaginé pour protéger l’arsenal de Rochefort entre les îles d’Aix et d’Oléron, le
            chantier commence sous Bonaparte en 1803. Interrompu puis repris, il traverse une grande
            partie du XIXᵉ siècle ; les ouvrages complémentaires se poursuivent jusqu’en 1866.
          </p>
          <p>
            Déjà dépassé par les progrès de l’artillerie, le fort devient ensuite place militaire
            puis prison avant de connaître une renaissance mondiale grâce au jeu télévisé lancé en
            1990.
          </p>
          <p>
            Depuis la plage des Saumonards, accessible par le portail privé de la résidence, sa
            silhouette accompagne les promenades, les grandes marées et les lumières du matin. Des
            croisières au départ de Boyardville permettent de s’en approcher, le fort lui-même
            n’étant pas ouvert au public.
          </p>
        </div>
      </section>

      <section className="heritage-stay shell">
        <div>
          <p className="eyebrow">Le Nid d’Été</p>
          <h2>Une adresse de vacances qui porte une mémoire.</h2>
          <p>
            Séjourner ici, c’est emprunter les allées arborées de La Maison Heureuse, rejoindre la
            plage en quelques pas et habiter, le temps des vacances, un lieu façonné par deux
            siècles d’histoires maritimes et humaines.
          </p>
          <div className="heritage-stay__actions">
            <Button href="/maisons/nid-d-ete">Découvrir Le Nid d’Été</Button>
            <Button href="/reserver?maison=nid-d-ete" variant="ghost">
              Choisir mes dates
            </Button>
          </div>
        </div>
        <aside className="heritage-sources" aria-label="Sources historiques">
          <h3>Pour prolonger l’histoire</h3>
          <Link href="https://pop.culture.gouv.fr/notice/merimee/PA17000066" target="_blank">
            Notice officielle des Monuments historiques
          </Link>
          <Link
            href="https://www.ile-oleron-marennes.com/preparer-mes-vacances/quoi-faire/balades-et-randonnees/circuit-du-patrimoine-de-boyardville"
            target="_blank"
          >
            Circuit officiel du patrimoine de Boyardville
          </Link>
          <Link
            href="https://la.charente-maritime.fr/culture-patrimoine/fort-boyard"
            target="_blank"
          >
            L’histoire de Fort Boyard par le Département
          </Link>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
