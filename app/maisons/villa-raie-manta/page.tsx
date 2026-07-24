import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Villa Raie Manta | Beaux Rivages",
  description:
    "Maison contemporaine à Rivedoux-Plage avec vue sur l’océan et le pont de l’Île de Ré. Quatre chambres, huit voyageurs et une expérience lumineuse face à la mer.",
};

const highlights = [
  ["8 voyageurs", "et un bébé"],
  ["4 chambres", "dont une suite"],
  ["Vue mer", "depuis le salon"],
  ["350 m", "des Halles et commerces"],
] as const;

const moments = [
  {
    title: "Le pont comme première émotion",
    text: "Tout commence en quittant le continent. Quelques kilomètres suspendus entre ciel et océan, puis la lumière de l’Île de Ré change déjà le rythme du séjour.",
  },
  {
    title: "L’océan dans le salon",
    text: "À l’étage, la pièce de vie a été volontairement placée face à la mer pour offrir une vue panoramique sur l’océan et le pont, du petit déjeuner au coucher du soleil.",
  },
  {
    title: "La plage à quelques pas",
    text: "On sort de la maison, on traverse quelques mètres et l’air marin prend le relais. Ici, les vacances se vivent simplement, entre baignades, marché et longues soirées dehors.",
  },
] as const;

export default function VillaRaieMantaPage() {
  return (
    <main className={styles.page}>
      <Header />

      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`${styles.heroContent} shell`}>
          <p className="eyebrow light">Rivedoux-Plage · Île de Ré</p>
          <h1>Villa Raie Manta</h1>
          <p>
            Une maison contemporaine où l’océan, le design et la lumière se rencontrent. Ici, la mer n’est pas seulement un paysage : elle fait partie de la maison.
          </p>
          <div className={styles.actions}>
            <Link className="button" href="/#reserver">Demander mes dates</Link>
            <a className="button button-ghost" href="#decouvrir">Découvrir la villa</a>
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
          <p className="eyebrow">Océan · Design · Lumière</p>
          <h2>Une maison pensée pour regarder la mer autrement.</h2>
        </div>
        <div className={styles.introText}>
          <p>
            Villa Raie Manta a été entièrement rénovée pour offrir une expérience fluide, lumineuse et généreuse. Son parti pris architectural est sa signature : installer le salon à l’étage afin d’ouvrir la maison sur l’océan et le pont de l’Île de Ré.
          </p>
          <p>
            Les espaces accueillent jusqu’à huit voyageurs et un bébé, avec quatre chambres, deux salles de bain, trois WC — dont un à l’étage —, une grande cuisine-salle à manger et une terrasse pensée pour prolonger les journées dehors.
          </p>
        </div>
      </section>

      <section className={styles.bridgeStory}>
        <div className={styles.bridgeVisual} role="img" aria-label="Le pont de l’Île de Ré entre ciel et océan" />
        <div className={styles.storyCopy}>
          <p className="eyebrow light">Tout commence ici</p>
          <h2>Le pont n’est pas seulement un passage. C’est le début des vacances.</h2>
          <p>
            Quelques kilomètres suspendus entre ciel et océan, et le quotidien s’efface peu à peu. Quelques instants plus tard, les portes de Villa Raie Manta s’ouvrent pour vous accueillir.
          </p>
        </div>
      </section>

      <section className={`${styles.signature} shell`}>
        <div className={styles.signatureHeading}>
          <p className="eyebrow">La signature de la villa</p>
          <h2>Un salon panoramique face à l’Atlantique.</h2>
        </div>
        <div className={styles.signatureGrid}>
          <article>
            <span>01</span>
            <h3>La vue comme décor</h3>
            <p>La mer et le pont accompagnent chaque moment de la journée, depuis le café du matin jusqu’aux lumières du soir.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Des volumes lumineux</h3>
            <p>La circulation, les ouvertures et les matériaux ont été pensés pour laisser entrer la lumière et créer une atmosphère apaisante.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Une maison à partager</h3>
            <p>La grande cuisine, la salle à manger et les espaces extérieurs permettent de vivre ensemble sans jamais se sentir à l’étroit.</p>
          </article>
        </div>
      </section>

      <section className={styles.rooms}>
        <div className={`${styles.roomsInner} shell`}>
          <div>
            <p className="eyebrow light">Dormir face à la lumière</p>
            <h2>Quatre chambres pour accueillir chacun avec confort.</h2>
          </div>
          <div className={styles.roomsText}>
            <p>
              Une suite au rez-de-chaussée facilite les séjours intergénérationnels. À l’étage, une chambre profite d’une vue mer remarquable, accompagnée d’une chambre avec lits jumeaux et d’une chambre pensée pour les enfants.
            </p>
            <p>
              Deux salles de bain et trois WC, dont un à l’étage, permettent à huit voyageurs de séjourner confortablement, tout en conservant des espaces calmes et intimes.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.moments} shell`}>
        <div className={styles.momentsHeading}>
          <p className="eyebrow">Une journée idéale</p>
          <h2>Vivre la villa au rythme de la mer.</h2>
        </div>
        <div className={styles.momentsGrid}>
          {moments.map((moment, index) => (
            <article key={moment.title}>
              <span>0{index + 1}</span>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.location} shell`}>
        <div>
          <p className="eyebrow">Tout à portée de pas</p>
          <h2>La mer, les Halles et le village.</h2>
        </div>
        <div className={styles.locationCopy}>
          <p>
            La villa se situe face au restaurant La Chaloupe, à proximité immédiate de l’océan et à environ 350 mètres des Halles, des commerces et des bonnes adresses de Rivedoux-Plage.
          </p>
          <p>
            L’arrivée est autonome par boîte à clés. Une arrivée personnalisée Beaux Rivages peut également être organisée pour découvrir la maison et recevoir des recommandations adaptées au séjour.
          </p>
        </div>
      </section>

      <section className={styles.localTip}>
        <div className="shell">
          <p className="eyebrow light">Le conseil de Stéphanie & Bruno</p>
          <blockquote>
            « Commencez par longer la mer au lever du jour, puis rejoignez les Halles. Pour les huîtres, Huîtres et Ma Ré est notre adresse de confiance depuis des années. »
          </blockquote>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="shell">
          <p className="eyebrow light">Votre séjour sur l’Île de Ré</p>
          <h2>Villa Raie Manta vous attend face à l’océan.</h2>
          <p>Contactez directement Stéphanie pour connaître les disponibilités et personnaliser votre séjour.</p>
          <a className="button" href="mailto:coulotstephanie@gmail.com?subject=Demande%20de%20séjour%20-%20Villa%20Raie%20Manta">Contacter Stéphanie</a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
