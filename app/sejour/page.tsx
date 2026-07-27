import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageStructuredData } from "@/components/PageStructuredData";
import { HeroBackground } from "@/components/HeroBackground";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/sejour"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.sea });
const steps = [
  ["J−30", "Le voyage commence", "Choisir la maison, préciser les voyageurs et partager vos premières envies.", ["Comparer les maisons", "Vérifier les dates", "Signaler bébé ou animal"]],
  ["J−7", "Composer les journées", "Réserver les expériences sensibles à la saison et repérer vos adresses favorites.", ["Vélos et activités", "Restaurants", "Marchés et producteurs"]],
  ["J−1", "Les derniers repères", "Recevoir l’accès, le stationnement, la météo, les marées et la check-list adaptée.", ["Code d’arrivée", "Météo & marées", "Valise utile"]],
  ["Arrivée", "La maison vous attend", "Accès autonome, essentiels déjà en place et attention préparée selon vos choix.", ["Entrer sans contrainte", "Découvrir la maison", "Nous joindre si besoin"]],
  ["Pendant", "Vivre les îles", "Le Carnet devient votre compagnon : adresses, cartes, conseils et plans de repli météo.", ["Carte filtrable", "Conseils du jour", "Assistance discrète"]],
  ["Départ", "Partir simplement", "Une check-list courte, un départ autonome et la possibilité d’un horaire tardif selon disponibilité.", ["Ranger l’essentiel", "Fermer la maison", "Partager une remarque"]],
  ["Retour", "Le souvenir continue", "Retrouver vos coups de cœur, transmettre votre avis et imaginer une autre saison.", ["Livre d’or", "Photos souvenirs", "Prochain séjour"]],
];
export default function StayJourneyPage() {
  return <main><PageStructuredData {...pageSeo} /><Header />
    <section className="subpage-hero"><HeroBackground src={siteMedia.destination.sea} /><div className="subpage-overlay" /><div className="subpage-copy"><p className="eyebrow light">Votre séjour avec Beaux Rivages</p><h1>Être accompagné, sans jamais être contraint.</h1><p>Avant, pendant et après le séjour, chaque information arrive au moment où elle devient utile.</p></div></section>
    <section className="journey-page shell">{steps.map(([time, title, copy, checklist], index) => <article key={time as string}><div className="journey-page__time"><span>{time as string}</span><small>Étape 0{index + 1}</small></div><div><h2>{title as string}</h2><p>{copy as string}</p><ul>{(checklist as string[]).map((item) => <li key={item}>✓ {item}</li>)}</ul></div></article>)}</section>
    <section className="during-stay"><div className="shell"><p className="eyebrow light">Pendant le séjour</p><h2>Votre compagnon local, dans votre poche.</h2><div className="during-grid"><article><span aria-hidden="true">☀</span><h3>Selon la météo</h3><p>Une plage abritée, une balade, une visite ou une bonne table adaptée à la journée.</p></article><article><span aria-hidden="true">≈</span><h3>Selon les marées</h3><p>Les horaires utiles et les conseils de baignade restent faciles à retrouver.</p></article><article><span aria-hidden="true">⌖</span><h3>Autour de vous</h3><p>À pied, à vélo ou en voiture : le Carnet rassemble les recommandations selon votre temps disponible.</p></article></div></div></section>
    <section className="after-stay shell"><p className="eyebrow">Après le départ</p><h2>Les souvenirs continuent.</h2><p>Le livre d’or, vos bonnes adresses et une autre saison deviennent autant de raisons de retrouver les îles.</p></section>
    <Footer />
  </main>;
}
