import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Le Chai des Tortues | Beaux Rivages",
  description: "Ancien chai en pierre à Rivedoux-Plage, à 250 mètres de la plage. Une maison familiale, authentique et généreusement équipée sur l’Île de Ré.",
};

const highlights = [
  ["250 m", "de la plage à pied"],
  ["6 voyageurs", "et un bébé"],
  ["3 chambres", "et 2 salles d’eau"],
  ["Animaux", "bienvenus sur demande"],
] as const;

const experiences = [
  {
    title: "Le matin, le marché à pied",
    text: "Quelques minutes suffisent pour rejoindre les Halles, les commerces et les bonnes adresses de Rivedoux-Plage. On revient avec du pain encore chaud, quelques huîtres et l’envie de prendre son temps.",
  },
  {
    title: "À midi, une grande tablée",
    text: "La cuisine est pensée comme le cœur de la maison : vaste, conviviale et exceptionnellement équipée pour cuisiner ensemble, préparer les produits de la mer et partager de vrais repas de vacances.",
  },
  {
    title: "L’après-midi, la plage à pied",
    text: "Parasols, tapis, fauteuils pliants et jeux de plage sont déjà sur place. Les familles peuvent voyager plus léger et rejoindre l’océan en quelques minutes.",
  },
] as const;

export default function LeChaiDesTortuesPage() {
  return (
    <main className={styles.page}>
      <Header />

      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`${styles.heroContent} shell`}>
          <p className="eyebrow light">Rivedoux-Plage · Île de Ré</p>
          <h1>Le Chai des Tortues</h1>
          <p>Un ancien chai en pierre, restauré avec respect, où l’authenticité rétaise rencontre le confort d’une maison pensée pour les familles et les grandes tablées.</p>
          <div className={styles.actions}>
            <Link className="button" href="/#reserver">Demander mes dates</Link>
            <a className="button button-ghost" href="#decouvrir">Découvrir la maison</a>
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
          <p className="eyebrow">Une maison de caractère</p>
          <h2>La pierre, le bois, la lumière et le plaisir d’être ensemble.</h2>
        </div>
        <div className={styles.introText}>
          <p>Le Chai des Tortues conserve l’âme de son histoire. Les pierres d’origine de l’Île de Ré ont été préservées et réemployées lors de la rénovation, donnant à la maison une atmosphère chaleureuse et profondément locale.</p>
          <p>À l’intérieur, chaque espace a été pensé pour rendre le séjour simple et généreux : équipements bébé offerts, jeux et livres pour tous les âges, confort toute l’année grâce aux ventilateurs de plafond et rideaux thermiques, ainsi qu’une cuisine rare dans une location de vacances.</p>
        </div>
      </section>

      <section className={styles.imageStory}>
        <div className={styles.imagePanel} role="img" aria-label="Pierres anciennes et ambiance chaleureuse du Chai des Tortues" />
        <div className={styles.storyCopy}>
          <p className="eyebrow">L’âme du lieu</p>
          <h2>Un ancien chai devenu maison de vacances.</h2>
          <p>Ici, le patrimoine n’est pas un décor. Il se ressent dans l’épaisseur des murs, dans la texture de la pierre et dans cette sensation immédiate d’entrer dans une maison qui a une histoire.</p>
          <p>La rénovation a recherché l’équilibre : préserver le caractère du bâti, tout en offrant le niveau d’équipement et d’attention attendu d’une adresse Beaux Rivages.</p>
        </div>
      </section>

      <section className={`${styles.kitchen} shell`}>
        <div className={styles.kitchenHeading}>
          <p className="eyebrow">La cuisine signature</p>
          <h2>Pour ceux qui aiment cuisiner autant que partager.</h2>
        </div>
        <div className={styles.kitchenGrid}>
          <article>
            <span>01</span>
            <h3>Tout pour recevoir</h3>
            <p>Four, lave-vaisselle, réfrigérateur-congélateur, cafetières filtre et capsules, bouilloire, grille-pain et appareil à raclette.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Des équipements d’exception</h3>
            <p>Ninja dual air fryer et robot pâtissier-cuiseur Kenwood pour préparer facilement des repas complets, même en vacances.</p>
          </article>
          <article>
            <span>03</span>
            <h3>L’expérience fruits de mer</h3>
            <p>Grande marmite, couteaux à huîtres, pinces et ustensiles dédiés pour profiter pleinement des huîtres, coquillages et produits de l’océan.</p>
          </article>
        </div>
      </section>

      <section className={styles.family}>
        <div className={`${styles.familyInner} shell`}>
          <div>
            <p className="eyebrow light">Voyager léger</p>
            <h2>Tout est prévu pour les familles.</h2>
          </div>
          <div className={styles.familyText}>
            <p>Lit parapluie, chaise haute, poussette, baignoire pliante et tapis d’éveil sont mis gratuitement à disposition. Des livres, jeux et équipements de plage complètent l’accueil.</p>
            <p>Le séjour commence sans liste interminable à préparer : il ne reste qu’à profiter de l’île, de la plage et du temps passé ensemble.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.experiences} shell`}>
        <div className={styles.experienceHeading}>
          <p className="eyebrow">Une journée idéale</p>
          <h2>Vivre Rivedoux au rythme de la maison.</h2>
        </div>
        <div className={styles.experienceGrid}>
          {experiences.map((experience, index) => (
            <article key={experience.title}>
              <span>0{index + 1}</span>
              <h3>{experience.title}</h3>
              <p>{experience.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.localTip} shell`}>
        <p className="eyebrow">Le conseil de Stéphanie & Bruno</p>
        <blockquote>« Commencez la journée par les Halles, puis passez chez Nina Métayer pour découvrir ses créations inspirées de ses racines rétaises. Notre conseil gourmand : goûtez le pain au chocolat praliné. »</blockquote>
      </section>

      <section className={styles.cta}>
        <div className="shell">
          <p className="eyebrow light">Votre séjour sur l’Île de Ré</p>
          <h2>Le Chai des Tortues vous attend.</h2>
          <p>Écrivez directement à Stéphanie pour connaître les disponibilités, les conditions et personnaliser votre séjour.</p>
          <a className="button" href="mailto:coulotstephanie@gmail.com?subject=Demande%20de%20séjour%20-%20Le%20Chai%20des%20Tortues">Contacter Stéphanie</a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
