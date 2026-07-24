import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Le Nid d’Été | Beaux Rivages",
  description:
    "Séjour à Saint-Georges-d’Oléron dans la résidence historique La Maison Heureuse, avec accès privé direct à la plage des Saumonards face à Fort Boyard.",
};

const highlights = [
  ["1 à 6 voyageurs", "et un bébé"],
  ["2 chambres", "dont une literie king size"],
  ["Accès privé", "direct à la plage"],
  ["Monument Historique", "La Maison Heureuse"],
] as const;

const arrival = [
  {
    title: "Le portail de La Maison Heureuse",
    text: "Dès l’entrée, le séjour prend une autre allure. La résidence se dévoile derrière son portail, protégée, paisible et entièrement tournée vers la nature.",
  },
  {
    title: "Les allées sous les peupliers",
    text: "De grands arbres apportent leur ombre et accompagnent le chemin jusqu’au cœur de cette résidence historique au charme singulier.",
  },
  {
    title: "Le passage vers l’océan",
    text: "À quelques pas du Nid d’Été, un portail privé s’ouvre directement sur la plage des Saumonards, face à Fort Boyard.",
  },
] as const;

const moments = [
  {
    title: "Le matin face à Fort Boyard",
    text: "Quelques pas suffisent pour rejoindre le sable, respirer l’air marin et regarder la lumière changer sur Fort Boyard.",
  },
  {
    title: "L’après-midi sous les pins",
    text: "Entre baignade, forêt des Saumonards et escapade à vélo, chacun choisit son rythme sans reprendre la voiture.",
  },
  {
    title: "Le soir dans le calme de la résidence",
    text: "On retrouve le jardin clos, la douceur des peupliers et le plaisir d’un dîner simple après une journée dehors.",
  },
] as const;

export default function LeNidDEtePage() {
  return (
    <main className={styles.page}>
      <Header />

      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`${styles.heroContent} shell`}>
          <p className="eyebrow light">Saint-Georges-d’Oléron · Île d’Oléron</p>
          <h1>Le Nid d’Été</h1>
          <p>
            Une parenthèse entre patrimoine, forêt et océan, dans la résidence historique La Maison Heureuse, avec un accès privé direct à la plage des Saumonards.
          </p>
          <div className={styles.actions}>
            <Link className="button" href="/#reserver">Demander mes dates</Link>
            <a className="button button-ghost" href="#decouvrir">Découvrir le lieu</a>
          </div>
        </div>
      </section>

      <section className={`${styles.highlights} shell`} aria-label="Informations essentielles">
        {highlights.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className={`${styles.intro} shell`} id="decouvrir">
        <div>
          <p className="eyebrow">Nature · Patrimoine · Sérénité</p>
          <h2>Un séjour qui commence bien avant d’ouvrir la porte.</h2>
        </div>
        <div className={styles.introText}>
          <p>
            Le Nid d’Été se trouve dans l’appartement D12 de La Maison Heureuse, résidence historique située au 355 Route des Saumonards. Le logement est installé juste à côté du portail privé qui mène directement à la plage.
          </p>
          <p>
            Maison de plain-pied, jardin clos sans vis-à-vis, équipements modernes, fibre, lave-vaisselle et lave-linge : tout est pensé pour vivre des vacances simples, confortables et proches de l’océan.
          </p>
        </div>
      </section>

      <section className={styles.history}>
        <div className={styles.historyVisual} role="img" aria-label="La résidence historique La Maison Heureuse" />
        <div className={styles.historyCopy}>
          <p className="eyebrow light">Un lieu chargé d’histoire</p>
          <h2>La Maison Heureuse, témoin de l’aventure de Fort Boyard.</h2>
          <p>
            La résidence fut construite pour accueillir les ouvriers impliqués dans la construction de Fort Boyard. Aujourd’hui classée Monument Historique, elle conserve une atmosphère rare, entre mémoire du lieu et douceur des vacances en bord de mer.
          </p>
        </div>
      </section>

      <section className={`${styles.arrival} shell`}>
        <div className={styles.sectionHeading}>
          <p className="eyebrow">L’arrivée comme première expérience</p>
          <h2>Du portail historique jusqu’au sable.</h2>
        </div>
        <div className={styles.cardGrid}>
          {arrival.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.beach}>
        <div className={`${styles.beachInner} shell`}>
          <div>
            <p className="eyebrow light">Le privilège du Nid d’Été</p>
            <h2>Un portail privé, puis la plage des Saumonards.</h2>
          </div>
          <div className={styles.beachText}>
            <p>
              Le plus bel atout du logement est à quelques mètres : un accès réservé aux résidents ouvre directement sur une longue plage naturelle, face à Fort Boyard.
            </p>
            <p>
              Pas de route à traverser, pas de voiture à reprendre. On part avec une serviette, les jeux de plage et l’on rejoint l’océan en quelques instants.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.comfort} shell`}>
        <div>
          <p className="eyebrow">Une maison facile à vivre</p>
          <h2>Le confort d’aujourd’hui dans un lieu d’exception.</h2>
        </div>
        <div className={styles.comfortList}>
          <p>Deux chambres avec literie de qualité, dont un lit king size, et un canapé convertible permettant d’accueillir jusqu’à six voyageurs.</p>
          <p>Cuisine équipée, lave-vaisselle, lave-linge, fibre Orange, matériel pour bébé et équipements de plage à disposition.</p>
          <p>Jardin entièrement clos, grands peupliers devant l’entrée, voile d’ombrage et résidence sécurisée pour profiter sereinement des extérieurs.</p>
        </div>
      </section>

      <section className={`${styles.moments} shell`}>
        <div className={styles.sectionHeading}>
          <p className="eyebrow">Une journée idéale</p>
          <h2>Vivre Oléron entre forêt, plage et Fort Boyard.</h2>
        </div>
        <div className={styles.cardGrid}>
          {moments.map((moment, index) => (
            <article key={moment.title}>
              <span>0{index + 1}</span>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.localTip}>
        <div className="shell">
          <p className="eyebrow light">Le conseil de Stéphanie & Bruno</p>
          <blockquote>
            « Allez sur la plage tôt le matin, lorsque la lumière est douce et que Fort Boyard semble flotter au-dessus de l’eau. C’est l’un de nos moments préférés. »
          </blockquote>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="shell">
          <p className="eyebrow light">Votre séjour sur l’Île d’Oléron</p>
          <h2>Le Nid d’Été vous attend au bord de l’océan.</h2>
          <p>Contactez directement Stéphanie pour connaître les disponibilités et préparer votre séjour.</p>
          <a className="button" href="mailto:coulotstephanie@gmail.com?subject=Demande%20de%20séjour%20-%20Le%20Nid%20d%27Été">Contacter Stéphanie</a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
