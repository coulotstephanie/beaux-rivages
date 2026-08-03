import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { createPageMetadata } from "@/seo";

export const metadata = createPageMetadata({
  title: "Balades à vélo sur l’Île de Ré et l’Île d’Oléron",
  path: "/velo-itineraires",
  description:
    "Idées de balades à vélo depuis les maisons Beaux Rivages et accès aux cartes officielles des pistes cyclables de Ré et d’Oléron.",
  image: "/images/velo/ile-de-re-piste-marais.jpg",
});

const islands = [
  {
    id: "ile-de-re",
    eyebrow: "Depuis Le Chai des Tortues et Villa Raie Manta",
    title: "L’Île de Ré, entre villages blancs et marais salants",
    introduction:
      "Au départ de Rivedoux-Plage, les pistes permettent de composer une promenade douce vers La Flotte et l’abbaye des Châteliers, ou de poursuivre vers Saint-Martin-de-Ré. Pour une journée plus ample, les itinéraires officiels rejoignent les marais, Ars-en-Ré et le nord de l’île.",
    image: "/images/velo/ile-de-re-piste-marais.jpg",
    imageAlt: "Piste cyclable traversant les marais salants de l’Île de Ré",
    credit: "Skimel · CC BY-SA 4.0",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Piste_cyclable_marais_salants_%C3%AEle_de_R%C3%A9.jpg",
    ideas: [
      {
        title: "Rivedoux-Plage → La Flotte",
        text: "Une première sortie paisible entre littoral, port et marché, facile à interrompre pour une pause face à l’océan.",
      },
      {
        title: "Rivedoux-Plage → Abbaye des Châteliers → Saint-Martin",
        text: "Une balade qui relie les pierres de l’abbaye, les paysages côtiers et les fortifications de Saint-Martin-de-Ré.",
      },
      {
        title: "Les marais du nord",
        text: "À préparer avec la carte officielle : marais salants, Ars-en-Ré, Fier d’Ars et pistes autorisées autour de Lilleau des Niges.",
      },
    ],
    links: [
      {
        label: "Voir les itinéraires vélo officiels",
        href: "https://www.iledere.com/organiser-activites-et-loisirs/itineraires-balades-et-randonnees/a-velo/",
      },
      {
        label: "Consulter la carte officielle des pistes",
        href: "https://www.iledere.com/sinformer/les-services-de-loffice-de-tourisme/documentation-touristique/plan-des-pistes-cyclables/",
      },
    ],
  },
  {
    id: "ile-d-oleron",
    eyebrow: "Depuis Le Nid d’Été",
    title: "L’Île d’Oléron, de la forêt des Saumonards aux villages du nord",
    introduction:
      "Depuis Boyardville, le vélo invite d’abord à suivre la forêt et le littoral. Selon votre envie, poursuivez vers La Brée-les-Bains et Saint-Denis-d’Oléron, ou composez une journée vers les ports, les marais et le phare de Chassiron en suivant le réseau balisé.",
    image: "/images/velo/ile-d-oleron-littoral.jpg",
    imageAlt: "Littoral, forêt et villages de l’Île d’Oléron",
    credit: "Sammyday · CC BY-SA 3.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:%C3%8Ele_d%27Ol%C3%A9ron.jpg",
    ideas: [
      {
        title: "Boyardville → forêt des Saumonards",
        text: "Une sortie courte et très nature, entre pins, plage et vues ouvertes vers le pertuis et Fort Boyard.",
      },
      {
        title: "Boyardville → La Brée-les-Bains",
        text: "Une promenade à prolonger selon le vent et le rythme de chacun, entre villages, littoral et haltes gourmandes.",
      },
      {
        title: "Le nord de l’île et Chassiron",
        text: "Une journée plus soutenue à préparer sur la carte officielle, en reliant Saint-Denis-d’Oléron, les paysages du nord et le phare.",
      },
    ],
    links: [
      {
        label: "Découvrir les balades officielles à vélo",
        href: "https://www.ile-oleron-marennes.com/explorer/bouger-selon-ses-envies/se-balader-a-velo",
      },
      {
        label: "Consulter les cartes cyclables officielles",
        href: "https://www.ile-oleron-marennes.com/espace-partenaires/l-office-de-tourisme/nos-supports-de-communication-print",
      },
    ],
  },
] as const;

export default function VeloItinerairesPage() {
  return (
    <main className="bike-guide-page">
      <Header />
      <section className="bike-guide-hero">
        <Image
          src="/images/velo/ile-de-re-piste-marais.jpg"
          alt="Balade à vélo au milieu des paysages insulaires"
          fill
          priority
          sizes="100vw"
        />
        <div className="bike-guide-hero__veil" />
        <div className="shell bike-guide-hero__copy">
          <p className="eyebrow light">Découvrir les îles autrement</p>
          <h1>À vélo, le voyage commence dès que l’on quitte la maison.</h1>
          <p>
            Des idées de balades pour rêver, puis les cartes officielles pour choisir votre piste et
            préparer votre itinéraire en toute sérénité.
          </p>
        </div>
      </section>

      <nav className="bike-guide-jump shell" aria-label="Choisir une île">
        <a href="#ile-de-re">Explorer l’Île de Ré</a>
        <a href="#ile-d-oleron">Explorer l’Île d’Oléron</a>
      </nav>

      {islands.map((island, index) => (
        <section className="bike-island shell" id={island.id} key={island.id}>
          <div className={`bike-island__visual${index % 2 ? " bike-island__visual--right" : ""}`}>
            <Image
              src={island.image}
              alt={island.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
            />
            <a href={island.creditUrl} target="_blank" rel="noreferrer">
              Photo : {island.credit}
            </a>
          </div>
          <div className="bike-island__content">
            <p className="eyebrow">{island.eyebrow}</p>
            <h2>{island.title}</h2>
            <p className="bike-island__intro">{island.introduction}</p>
            <div className="bike-route-list">
              {island.ideas.map((idea) => (
                <article key={idea.title}>
                  <span aria-hidden="true">↗</span>
                  <div>
                    <h3>{idea.title}</h3>
                    <p>{idea.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="bike-island__links">
              {island.links.map((link) => (
                <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bike-guide-note">
        <div className="shell">
          <p className="eyebrow light">Le conseil de Stéphanie & Bruno</p>
          <h2>Regardez le vent avant de choisir le sens de votre balade.</h2>
          <p>
            Les idées présentées ici sont des inspirations. Pour le tracé, les distances, les
            éventuelles déviations et les règles de circulation, utilisez toujours les cartes à jour
            des offices de tourisme.
          </p>
          <Link href="/carnet">Poursuivre dans le Carnet Beaux Rivages →</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
