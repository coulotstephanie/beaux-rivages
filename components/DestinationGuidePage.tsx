import Image from "next/image";
import Link from "next/link";
import type { DestinationGuide } from "@/destinationGuides";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { HeroBackground } from "./HeroBackground";
import { Button, Container } from "./ui";
import { DestinationPropertyLinks } from "./DestinationPropertyLinks";

export function DestinationGuidePage({ guide }: { guide: DestinationGuide }) {
  return (
    <main className="destination-guide">
      <Header />
      <section className="page-hero destination-guide__hero">
        <HeroBackground src={guide.hero} />
        <div className="page-hero-content">
          <p className="eyebrow light">{guide.kicker}</p>
          <h1>{guide.title}</h1>
          <p>{guide.introduction}</p>
          <Button href="#guide">Ouvrir le guide</Button>
        </div>
      </section>

      <section className="destination-guide__essentials" aria-label="L’essentiel">
        <Container>
          {guide.essentials.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </Container>
      </section>

      <section id="guide" className="destination-guide__history">
        <div className="destination-guide__image">
          <Image src={guide.history.image} alt="" fill loading="lazy" quality={88} sizes="(max-width: 900px) 100vw, 48vw" />
        </div>
        <div className="destination-guide__copy">
          <p className="eyebrow">Histoire & caractère</p>
          <h2>{guide.history.title}</h2>
          <p>{guide.history.copy}</p>
        </div>
      </section>

      <section className="destination-guide__section-heading">
        <Container size="narrow">
          <p className="eyebrow">À ne pas manquer</p>
          <h2>Les incontournables, à notre manière</h2>
          <p>Des lieux connus, mais choisis au bon moment et reliés par le plaisir du chemin.</p>
        </Container>
      </section>

      <div className="destination-guide__chapters">
        {guide.chapters.map((chapter, index) => (
          <section className={index % 2 ? "is-reversed" : ""} key={chapter.title}>
            <div className="destination-guide__image">
              <Image src={chapter.image} alt="" fill loading="lazy" quality={88} sizes="(max-width: 900px) 100vw, 52vw" />
            </div>
            <div className="destination-guide__copy">
              <p className="eyebrow">{chapter.eyebrow}</p>
              <h2>{chapter.title}</h2>
              <p>{chapter.copy}</p>
              <ul>
                {chapter.tips.map((tip) => <li key={tip}>{tip}</li>)}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <section className="destination-guide__map">
        <Container>
          <div>
            <p className="eyebrow light">Carte sensible</p>
            <h2>{guide.map.label}</h2>
            <p>Nos repères pour construire une journée sans courir.</p>
            <a href={guide.map.href} target="_blank" rel="noreferrer">Ouvrir la carte détaillée ↗</a>
          </div>
          <ol>
            {guide.map.points.map((point, index) => (
              <li key={point.name}><span>{index + 1}</span><div><strong>{point.name}</strong><small>{point.note}</small></div></li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="destination-guide__addresses">
        <Container>
          <p className="eyebrow">Testées, aimées, racontées</p>
          <h2>Les bonnes adresses de Stéphanie & Bruno</h2>
          <div>
            {guide.addresses.map((address) => (
              <article key={address.name}>
                <span>{address.kind}</span>
                <h3>{address.name}</h3>
                <p>{address.advice}</p>
              </article>
            ))}
          </div>
          <Link href="/carnet">Retrouver toutes nos recommandations dans Le Carnet →</Link>
        </Container>
      </section>

      <section className="destination-guide__advice">
        <Container>
          <p className="eyebrow">Le bon conseil au bon moment</p>
          <h2>Choisir selon la saison et la météo</h2>
          <div className="destination-guide__advice-grid">
            <article>
              <h3>Au fil des saisons</h3>
              {guide.seasons.map((item) => <div key={item.season}><strong>{item.season}</strong><p>{item.advice}</p></div>)}
            </article>
            <article>
              <h3>Selon le ciel</h3>
              {guide.weather.map((item) => <div key={item.condition}><strong>{item.condition}</strong><ul>{item.ideas.map((idea) => <li key={idea}>{idea}</li>)}</ul></div>)}
            </article>
          </div>
        </Container>
      </section>

      <section className="destination-guide__audiences">
        <Container>
          <article><p className="eyebrow light">Avec les enfants</p><h2>Conseils familles</h2><ul>{guide.audiences.families.map((tip) => <li key={tip}>{tip}</li>)}</ul></article>
          <article><p className="eyebrow light">À deux</p><h2>Conseils couples</h2><ul>{guide.audiences.couples.map((tip) => <li key={tip}>{tip}</li>)}</ul></article>
        </Container>
      </section>

      <section className="destination-guide__itineraries">
        <Container>
          <p className="eyebrow">Du premier café au dernier rayon</p>
          <h2>Nos itinéraires</h2>
          <div>
            {guide.itineraries.map((itinerary) => (
              <article key={itinerary.title}>
                <span>{itinerary.duration}</span><h3>{itinerary.title}</h3>
                <ol>{itinerary.steps.map((step, index) => <li key={step}><b>{index + 1}</b>{step}</li>)}</ol>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="destination-guide__gallery">
        <Container>
          <p className="eyebrow">En images</p><h2>La galerie</h2>
          <div>
            {guide.gallery.map((image) => (
              <figure key={image.src}>
                <span><Image src={image.src} alt={image.alt} fill loading="lazy" quality={88} sizes="(max-width: 700px) 100vw, 50vw" /></span>
                <figcaption>{image.caption}{image.credit && <> · <a href={image.source} target="_blank" rel="noreferrer">{image.credit}, {image.license}</a></>}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className="destination-guide__faq">
        <Container size="narrow">
          <p className="eyebrow">Avant de partir</p><h2>Questions fréquentes</h2>
          <div>{guide.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
        </Container>
      </section>

      <DestinationPropertyLinks guide={guide} />

      <section className="destination-guide__cta">
        <Container size="narrow">
          <p className="eyebrow">Le conseil juste au bon moment</p>
          <h2>Retrouvez nos adresses personnelles dans Le Carnet.</h2>
          <p>Restaurants, producteurs, plages et marchés choisis par Stéphanie & Bruno.</p>
          <Button href="/carnet">Consulter Le Carnet</Button>
          <Link href="/destinations">Voir toutes les destinations</Link>
        </Container>
      </section>
      <Footer />
    </main>
  );
}
