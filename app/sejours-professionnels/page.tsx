import type { Metadata } from "next";
import { languageAlternates } from "@/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ChefHat, House, Laptop, Shirt, Users, Video, Wifi } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StructuredData } from "@/components/StructuredData";
import { TeleworkInquiryForm } from "@/components/TeleworkInquiryForm";

const canonical = "https://www.beaux-rivages.com/sejours-professionnels";
const hero = "/images/properties/villa-raie-manta/editorial/teletravail-vue-ocean.png";

export const metadata: Metadata = {
  title: "Séjours professionnels Ré et Oléron | Beaux Rivages",
  description: "Maisons équipées de la fibre pour missions, chantiers, remplacements et télétravail sur les îles de Ré et d’Oléron. Proposition personnalisée.",
  alternates: { canonical: "/sejours-professionnels", languages: languageAlternates("/sejours-professionnels") },
  openGraph: { title: "Séjours professionnels sur les îles de Ré et d’Oléron", description: "Maisons équipées de la fibre pour missions, chantiers, remplacements et télétravail sur les deux îles.", url: canonical, images: [{ url: hero, alt: "Télétravail face à l’océan à Villa Raie Manta" }] },
};

const equipment = [
  [Wifi, "Fibre installée", "Une connexion Internet adaptée au télétravail, aux échanges en ligne et aux visioconférences."],
  [Video, "Wi-Fi dans la maison", "Restez connecté depuis les principaux espaces de vie."],
  [Laptop, "Espaces de travail", "Une table ou un espace pour installer confortablement ordinateur et documents."],
  [House, "Environnement calme", "Des conditions agréables pour se concentrer, téléphoner et organiser sa journée."],
  [Users, "Trois ou quatre chambres", "Une organisation adaptée aux collègues souhaitant préserver leur indépendance et leur rythme."],
  [ChefHat, "Cuisine entièrement équipée", "Préparez facilement vos repas pendant les missions et les séjours prolongés."],
  [BriefcaseBusiness, "Pièce de vie confortable", "Un véritable espace pour se retrouver ou se détendre après le travail."],
  [Shirt, "Solution pour le linge", "Lave-linge au Chai et au Nid d’Été ; laverie disponible dans le village pour Villa Raie Manta."],
] as const;

const stays = [
  ["Télétravail ponctuel ou prolongé", "Changer de cadre tout en conservant de bonnes conditions de travail."],
  ["Mission professionnelle", "Salariés et indépendants amenés à intervenir temporairement sur l’Île de Ré."],
  ["Chantier et déplacement d’équipe", "Loger plusieurs collaborateurs ensemble tout en préservant l’indépendance de chacun."],
  ["Remplacement saisonnier ou médical", "Un hébergement confortable pendant une période déterminée."],
  ["Formation et événement professionnel", "Des déplacements de quelques jours liés à une formation, une réunion ou un événement."],
  ["Séjour de moyenne durée", "Des missions de plusieurs semaines, selon les dates et les disponibilités."],
] as const;

const houses = [
  { name: "Le Chai des Tortues", tagline: "Le caractère d’un ancien chai, le confort d’une maison pensée pour les séjours prolongés.", description: "Pierre d’origine de l’Île de Ré, bois chaleureux, vaste pièce de vie et cuisine particulièrement bien équipée : Le Chai des Tortues offre une atmosphère authentique et conviviale. À Rivedoux-Plage, commerces, marché, restaurants et plage à environ 250 mètres se rejoignent à pied.", image: "/images/properties/chai-des-tortues/editorial/teletravail-coin-bureau.png", alt: "Télétravail dans la pièce de vie reconnaissable du Chai des Tortues", href: "/maisons/chai-des-tortues", points: ["Fibre et Wi-Fi", "Trois chambres", "Grande table et espaces de travail", "Cuisine très entièrement équipée", "Lave-linge", "Plage à environ 250 mètres", "Marché, commerces et restaurants à pied"] },
  { name: "Villa Raie Manta", tagline: "Travailler face à l’océan et retrouver la lumière de l’Île de Ré après sa journée.", description: "Contemporaine, lumineuse et tournée vers la mer, Villa Raie Manta offre un cadre inspirant pour travailler et se ressourcer. Sa pièce de vie à l’étage ouvre une vue panoramique sur l’océan et le pont de l’Île de Ré.", image: "/images/properties/villa-raie-manta/salon-vue-mer.jpeg", alt: "Pièce de vie lumineuse de Villa Raie Manta avec vue sur l’océan", href: "/maisons/villa-raie-manta", points: ["Fibre et Wi-Fi", "Quatre chambres", "Espaces pour installer un ordinateur", "Cuisine équipée", "Pièce de vie lumineuse", "Vue sur l’océan et le pont", "Commerces et services à proximité"] },
  { name: "Le Nid d’Été", tagline: "Un refuge calme entre forêt et océan pour travailler sur l’Île d’Oléron.", description: "À Boyardville, Le Nid d’Été offre une pièce de vie confortable, un espace où installer son ordinateur et un accès direct à la plage des Saumonards. Une solution adaptée aux missions professionnelles sur Oléron et aux séjours de moyenne durée.", image: "/images/properties/nid-d-ete/editorial/teletravail-piece-de-vie.png", alt: "Télétravail à la grande table du Nid d’Été à Boyardville", href: "/maisons/nid-d-ete", points: ["Fibre Orange et espace de travail", "Deux chambres", "Cuisine entièrement équipée", "Lave-linge", "Arrivée autonome", "Plage à environ 20 mètres", "Commerces et services de Boyardville à proximité"] },
] as const;

export default function TeleworkPage() {
  return <main className="telework-page">
    <StructuredData data={[{ "@context": "https://schema.org", "@type": "WebPage", name: "Séjours professionnels sur les îles de Ré et d’Oléron", description: metadata.description, url: canonical }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.beaux-rivages.com" }, { "@type": "ListItem", position: 2, name: "Séjours professionnels", item: canonical }] }]} />
    <Header />
    <section className="telework-hero">
      <Image src={hero} alt="Professionnelle en télétravail dans la pièce de vie de Villa Raie Manta face à l’océan" fill priority quality={90} sizes="100vw" />
      <div className="telework-hero__shade" /><div className="telework-shell telework-hero__content"><p className="eyebrow light">Vous travaillez sur les îles, nous vous logeons.</p><h1>Séjours professionnels sur les îles de Ré et d’Oléron</h1><p>Mission, remplacement, chantier, formation ou télétravail prolongé : installez-vous dans l’une de nos maisons sur les îles de Ré et d’Oléron et profitez d’un environnement confortable, calme et équipé de la fibre.</p><p>Après votre journée, retrouvez l’océan, les commerces du village et la douceur de vivre des îles.</p><div className="telework-actions"><Button href="#proposition" size="lg">Organiser votre séjour professionnel</Button><Button href="#maisons" variant="secondary" size="lg">Découvrir les maisons</Button></div><small>Proposition personnalisée selon vos dates, la durée du séjour, le nombre d’occupants et les disponibilités.</small></div>
    </section>
    <nav className="telework-breadcrumb telework-shell" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span aria-hidden>›</span><span>Séjours professionnels</span></nav>

    <section className="telework-section telework-shell"><header className="telework-heading"><p className="eyebrow">Un cadre adapté à votre activité</p><h2>La fibre, le calme et l’espace nécessaire pour travailler sereinement</h2><p>Une connexion fiable et un environnement calme changent réellement le quotidien lorsqu’un séjour professionnel se prolonge. Nos maisons de Rivedoux-Plage permettent de travailler, d’organiser des appels ou des visioconférences, puis de déconnecter dans une véritable maison plutôt que dans une simple chambre d’hôtel.</p></header><div className="telework-equipment">{equipment.map(([Icon, title, text]) => <article key={title}><Icon aria-hidden /><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="telework-section telework-section--sand"><div className="telework-shell"><header className="telework-heading"><p className="eyebrow">Des solutions flexibles</p><h2>Un logement pour chaque rythme professionnel</h2><p>Chaque déplacement répond à une organisation différente. Stéphanie et Bruno étudient directement votre demande afin de vous orienter vers la maison et la durée de séjour les plus adaptées.</p></header><div className="telework-stays">{stays.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="telework-feature"><div className="telework-feature__image"><Image src="/images/properties/chai-des-tortues/kitchen/cuisine-et-table.jpeg" alt="Grande table et cuisine entièrement équipée du Chai des Tortues" fill sizes="(max-width: 850px) 100vw, 50vw" /></div><div className="telework-feature__copy"><p className="eyebrow">Plus qu’un lieu pour dormir</p><h2>Retrouver le confort d’une maison après sa journée</h2><p>Pouvoir préparer un repas, disposer d’une chambre indépendante, prendre soin de son linge ou simplement s’installer confortablement le soir devient essentiel lorsque le déplacement se prolonge.</p><p>Les maisons Beaux Rivages sont de véritables lieux de vie : elles permettent de conserver ses habitudes, de travailler dans de bonnes conditions et de partager certains moments avec ses collègues sans renoncer à son intimité.</p><ul>{["Deux à quatre chambres selon la maison", "Cuisine équipée pour les repas du quotidien", "Espaces de vie confortables", "Lave-linge au Chai et au Nid ; laverie du village pour la Villa", "Fibre et Wi-Fi", "Arrivée autonome", "Stéphanie et Bruno disponibles en cas de besoin"].map((point) => <li key={point}>{point}</li>)}</ul></div></section>

    <section className="telework-section telework-shell" id="maisons"><header className="telework-heading"><p className="eyebrow">Choisissez votre atmosphère</p><h2>Trois maisons pour vivre sereinement son séjour professionnel</h2><p>Deux maisons à Rivedoux-Plage sur l’Île de Ré, et Le Nid d’Été à Boyardville pour les missions sur l’Île d’Oléron.</p></header><div className="telework-houses">{houses.map((house) => <article key={house.name}><div className="telework-houses__image"><Image src={house.image} alt={house.alt} fill sizes="(max-width: 850px) 100vw, 50vw" /></div><div><h3>{house.name}</h3><strong>{house.tagline}</strong><p>{house.description}</p><ul>{house.points.map((point) => <li key={point}>{point}</li>)}</ul><Button href={house.href} variant="secondary">Découvrir {house.name}</Button></div></article>)}</div></section>

    <section className="telework-balance"><Image src="/images/destination/re-authentique/pont-coucher-soleil-velo.jpg" alt="Rivage de Rivedoux-Plage et pont de l’Île de Ré en fin de journée" fill sizes="100vw" /><div className="telework-balance__shade"/><div className="telework-shell telework-balance__content"><p className="eyebrow light">Travailler, puis respirer</p><h2>L’océan à proximité pour vraiment déconnecter</h2><p>Une fois l’ordinateur refermé, il suffit de quelques minutes pour retrouver le rivage, marcher sur la plage, faire quelques courses dans le village ou simplement profiter du calme de la maison.</p><p>Rivedoux-Plage, animé toute l’année, concilie les contraintes d’un déplacement professionnel avec un cadre de vie agréable en toute saison.</p><div>{[["Tout à proximité", "Commerces, marché, restaurants et services facilement accessibles toute l’année."], ["Un cadre apaisant", "Le calme de Rivedoux-Plage après une journée de travail."], ["Des hôtes qui vivent sur place", "Stéphanie et Bruno partagent leurs conseils pratiques toute l’année."]].map(([title,text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="telework-section telework-section--sand" id="proposition"><div className="telework-shell telework-contact"><div><p className="eyebrow">Votre séjour professionnel</p><h2>Parlez-nous de votre besoin</h2><p>Indiquez-nous vos dates, la durée prévue, le nombre de personnes et le motif du déplacement. Nous vous répondrons directement avec la maison disponible et la solution la plus adaptée.</p><p>Les conditions et le tarif sont étudiés selon la période, la durée du séjour, le nombre d’occupants et les disponibilités.</p><address><strong>Stéphanie Coulot</strong><a href="tel:+33617260094">+33 6 17 26 00 94</a><a href="mailto:coulotstephanie@gmail.com">coulotstephanie@gmail.com</a></address></div><TeleworkInquiryForm /></div></section>

    <section className="telework-final telework-shell"><p className="eyebrow">Beaux Rivages · Îles de Ré et d’Oléron</p><h2>Votre mission sur les îles, le confort d’une maison en plus</h2><p>Que vous veniez seul, avec un collègue ou avec une équipe, nous étudions votre demande pour vous proposer un séjour simple à organiser, confortable et adapté à votre rythme professionnel.</p><div className="telework-actions"><Button href="#proposition" size="lg">Organiser votre séjour professionnel <ArrowRight aria-hidden /></Button><Button href="tel:+33617260094" variant="secondary" size="lg">Nous appeler</Button></div></section>
    <a className="telework-mobile-cta" href="#proposition">Organiser votre séjour professionnel</a><Footer />
  </main>;
}
