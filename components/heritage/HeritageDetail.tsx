import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button, Container } from "@/components/ui";
import { heritageHouses, heritageSites, type HeritageSite } from "@/content/patrimoine";
import type { HeritageEditorial } from "@/content/patrimoinePremium";
import { HeritageGallery, type HeritageGalleryImage } from "./HeritageGallery";
import { HeritageMap } from "./HeritageMap";

export function HeritageDetail({
  site,
  editorial,
  images = site.images,
}: {
  site: HeritageSite;
  editorial?: HeritageEditorial;
  images?: HeritageGalleryImage[];
}) {
  const similar = heritageSites
    .filter((item) => item.island === site.island && item.slug !== site.slug)
    .slice(0, 3);

  return (
    <main className="heritage-detail">
      <Header />
      <section className="heritage-detail__hero">
        <Image src={site.images[0].src} alt={site.images[0].alt} fill priority sizes="100vw" />
        <div className="heritage-detail__shade" />
        <Container>
          <Link href="/patrimoine">Patrimoine · {site.island}</Link>
          <h1>{site.title}</h1>
          <p>{site.subtitle}</p>
          {editorial && <p className="heritage-detail__lead">{editorial.emotionalLead}</p>}
        </Container>
      </section>

      <section className="heritage-detail__island-bar shell" aria-label="Destination actuelle">
        <span>Vous découvrez actuellement le patrimoine de {site.island}</span>
        <Link href="/patrimoine">Voir tous les lieux patrimoniaux →</Link>
      </section>

      <section className="heritage-detail__intro shell">
        <p className="eyebrow">Une histoire des îles</p>
        {editorial?.premiumPage?.introduction.title && (
          <h2>{editorial.premiumPage.introduction.title}</h2>
        )}
        {(editorial?.premiumPage?.introduction.paragraphs ?? [site.introduction]).map(
          (paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ),
        )}
      </section>

      <section className="heritage-story-v2 shell" aria-labelledby="heritage-story-title">
        <p className="eyebrow">L’histoire du lieu</p>
        <h2 id="heritage-story-title">Un récit à découvrir au rythme de l’île</h2>
        <div>
          {(editorial?.story ?? [site.history, site.architecture]).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {editorial && (
        <section className="heritage-editorial shell">
          <article>
            <p className="eyebrow">Pourquoi le découvrir</p>
            <h2>Ce qui mérite vraiment le détour</h2>
            <p>{editorial.unique}</p>
          </article>
          <article>
            <p className="eyebrow">Ouvrir l’œil</p>
            <h2>Nos incontournables sur place</h2>
            <ul>
              {editorial.mustSee.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      )}

      {editorial && (
        <section className="heritage-host-notes shell" aria-labelledby="heritage-anecdotes-title">
          <div>
            <p className="eyebrow">Les anecdotes de Stéphanie & Bruno</p>
            <h2 id="heritage-anecdotes-title">Les moments que nous aimons partager.</h2>
            {(
              editorial.premiumPage?.summit.paragraphs ??
              editorial.idealDay.slice(0, 2).map((step) => step.detail)
            ).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside>
            <p className="eyebrow light">Le conseil de Stéphanie & Bruno</p>
            <blockquote>« {site.advice} »</blockquote>
          </aside>
        </section>
      )}

      <HeritageGallery title={site.title} images={images} />

      {editorial?.premiumPage && (
        <section
          className="heritage-nearby shell"
          id={site.slug === "phare-des-baleines" ? "vieille-tour" : undefined}
          aria-labelledby="heritage-nearby-title"
        >
          <p className="eyebrow">Autour de ce lieu</p>
          <h2 id="heritage-nearby-title">
            {editorial.premiumPage.labels?.nearby ?? `Prolonger la découverte sur ${site.island}`}
          </h2>
          <div>
            {editorial.premiumPage.nearby.map((place) => (
              <Link href={place.href} key={place.title}>
                <h3>{place.title}</h3>
                <p>{place.detail}</p>
                <span>Découvrir →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="heritage-practical shell">
        <div>
          <p className="eyebrow">Informations pratiques</p>
          <h2>Préparer votre découverte</h2>
          <dl>
            <div>
              <dt>Durée conseillée</dt>
              <dd>{site.duration}</dd>
            </div>
            <div>
              <dt>Accès</dt>
              <dd>{site.access}</dd>
            </div>
            <div>
              <dt>Tarif</dt>
              <dd>{site.price}</dd>
            </div>
          </dl>
          <div className="heritage-practical__badges">
            {site.audiences.map((audience) => (
              <span key={audience}>{audience}</span>
            ))}
          </div>
          {editorial && (
            <dl className="heritage-practical__extended">
              <div>
                <dt>Stationnement</dt>
                <dd>{editorial.practical.parking}</dd>
              </div>
              <div>
                <dt>À vélo</dt>
                <dd>{editorial.practical.bike}</dd>
              </div>
              <div>
                <dt>Accessibilité</dt>
                <dd>{editorial.practical.accessibility}</dd>
              </div>
              <div>
                <dt>En famille</dt>
                <dd>{editorial.practical.families}</dd>
              </div>
              <div>
                <dt>Avec un chien</dt>
                <dd>{editorial.practical.dogs}</dd>
              </div>
            </dl>
          )}
          <a href={site.source.href} target="_blank" rel="noreferrer">
            Vérifier les informations officielles →
          </a>
          {editorial?.premiumPage && (
            <div className="heritage-sources">
              <h3>Sources historiques</h3>
              {editorial.premiumPage.sources.map((source) => (
                <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
                  {source.label} →
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="heritage-detail__map shell">
        <p className="eyebrow">Carte & itinéraires</p>
        <h2>Depuis chacune de nos maisons</h2>
        <HeritageMap site={site} />
      </section>

      <section className="heritage-houses shell">
        <div>
          <p className="eyebrow">Prolonger l’expérience</p>
          <h2>Choisir sa maison sur l’île</h2>
        </div>
        <div>
          {heritageHouses.map((house) => (
            <Link key={house.name} href={house.href}>
              <span>{house.name}</span>
              <small>Découvrir la maison →</small>
            </Link>
          ))}
        </div>
      </section>

      {similar.length > 0 && (
        <section className="heritage-similar shell">
          <p className="eyebrow">À découvrir aussi</p>
          <div>
            {similar.map((item) => (
              <Link href={`/patrimoine/${item.slug}`} key={item.slug}>
                {item.title}
                <span>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="heritage-detail__cta">
        <h2>Et si votre prochaine histoire commençait ici ?</h2>
        <Button href="/reserver">Choisir votre maison</Button>
      </section>
      <Footer />
    </main>
  );
}
