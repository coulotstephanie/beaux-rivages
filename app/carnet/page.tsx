import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Le Carnet Beaux Rivages | Nos adresses et conseils",
  description:
    "Découvrez les bonnes adresses testées par Stéphanie et Bruno, les marchés, producteurs, plages, balades et expériences de l’Île de Ré et de l’Île d’Oléron.",
};

const univers = [
  { icon: "☀", title: "Selon la météo", text: "La plage, la balade ou l’activité la plus agréable selon le vent, la saison et l’heure de la journée." },
  { icon: "◌", title: "Selon vos envies", text: "Gastronomie, vélo, patrimoine, moments en famille, séjour romantique ou simplement ralentir." },
  { icon: "⌖", title: "Comme des locaux", text: "Des recommandations vécues, testées et choisies par Stéphanie et Bruno, qui habitent les îles toute l’année." },
] as const;

const addresses = [
  { tag: "Huîtres · Rivedoux-Plage", title: "Huîtres et Ma Ré", text: "Notre producteur de confiance pour les repas de famille et les grandes occasions. Une adresse authentique pour découvrir les huîtres de l’Île de Ré." },
  { tag: "Glaces · Île de Ré", title: "La Martinière", text: "Une maison emblématique. Notre conseil : commander à l’avance et retirer directement à l’atelier en période très fréquentée." },
  { tag: "Pâtisserie · Rivedoux-Plage", title: "Nina Métayer", text: "Une escale gourmande profondément liée à l’Île de Ré. Le pain au chocolat praliné fait partie de nos incontournables." },
] as const;

const themes = [
  "Les marchés du jour",
  "Nos producteurs préférés",
  "Les plus belles balades à vélo",
  "Les plages selon le vent",
  "Nos tables pour un dîner à deux",
  "Les sorties avec des enfants",
  "Que faire quand il pleut ?",
  "Les paysages qui nous font ralentir",
] as const;

export default function CarnetPage() {
  return (
    <main className={styles.page}>
      <Header />

      <section className={styles.hero}>
        <div className={`${styles.heroInner} shell`}>
          <p className="eyebrow light">Le concierge numérique Beaux Rivages</p>
          <h1>Le Carnet<br />Beaux Rivages</h1>
          <p className={styles.lead}>
            Plus qu’un guide touristique : nos habitudes, nos adresses de confiance et les expériences que nous aimons réellement partager.
          </p>
          <a className="button" href="#adresses">Ouvrir le carnet</a>
        </div>
      </section>

      <section className={`${styles.manifesto} shell`}>
        <p className="eyebrow">Une hospitalité qui continue hors de la maison</p>
        <h2>Nous ne vous indiquons pas seulement où aller. Nous vous racontons pourquoi nous aimons y revenir.</h2>
        <p>
          Stéphanie et Bruno vivent les îles toute l’année. Le Carnet rassemble leurs conseils de saison, leurs producteurs, leurs artisans et ces petits détails qui transforment une semaine de vacances en souvenirs que l’on garde longtemps.
        </p>
      </section>

      <section className={`${styles.univers} shell`}>
        {univers.map((item) => (
          <article key={item.title}>
            <span aria-hidden="true">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.signature}>
        <div className={`${styles.signatureInner} shell`}>
          <p className="eyebrow light">Le conseil de Stéphanie & Bruno</p>
          <blockquote>
            « Les plus beaux moments ne sont pas toujours dans les guides. Ils commencent souvent par une bonne adresse partagée au bon moment. »
          </blockquote>
        </div>
      </section>

      <section className={`${styles.addresses} shell`} id="adresses">
        <div className={styles.sectionHeading}>
          <p className="eyebrow">Nos bonnes adresses testées</p>
          <h2>Des lieux que nous recommandons comme à des amis.</h2>
        </div>
        <div className={styles.addressGrid}>
          {addresses.map((address, index) => (
            <article key={address.title}>
              <span className={styles.number}>0{index + 1}</span>
              <p className={styles.tag}>{address.tag}</p>
              <h3>{address.title}</h3>
              <p>{address.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.explore}>
        <div className={`${styles.exploreInner} shell`}>
          <div>
            <p className="eyebrow light">Préparer son séjour autrement</p>
            <h2>Un carnet pensé pour chaque moment des vacances.</h2>
          </div>
          <div className={styles.themeList}>
            {themes.map((theme) => <div key={theme}>{theme}<span>↗</span></div>)}
          </div>
        </div>
      </section>

      <section className={`${styles.members} shell`}>
        <div>
          <p className="eyebrow">Bientôt dans votre espace voyageur</p>
          <h2>Le Carnet deviendra votre compagnon avant, pendant et après le séjour.</h2>
        </div>
        <div>
          <p>
            Compte à rebours avant l’arrivée, météo, marées, guide d’accès, services optionnels, recommandations personnalisées et livre d’or numérique : tout sera réuni dans un espace privé et élégant.
          </p>
          <Link className="button" href="/#reserver">Préparer mon séjour</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
