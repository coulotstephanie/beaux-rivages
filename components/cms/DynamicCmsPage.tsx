import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { CmsPage } from "@/platform/cms/contracts";

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function DynamicCmsPage({ page }: { page: CmsPage }) {
  return (
    <main className="cms-public-page">
      <Header contrast="dark" />
      <header className="faq-hero shell">
        <p className="eyebrow">Beaux Rivages</p>
        <h1>{page.title}</h1>
      </header>
      {page.blocks.map((block) => {
        const title = text(block.content.title);
        const body = text(block.content.body);
        const mediaUrl = text(block.content.mediaUrl);
        const alt = text(block.content.alt);
        if (block.blockType === "hero")
          return (
            <section className="cms-public-hero" key={block.id}>
              {mediaUrl && <img src={mediaUrl} alt={alt} />}
              <div className="shell">
                <h2>{title}</h2>
                {body && <p>{body}</p>}
              </div>
            </section>
          );
        if (block.blockType === "image")
          return (
            <figure className="shell" key={block.id}>
              {mediaUrl && <img src={mediaUrl} alt={alt} />}{" "}
              {body && <figcaption>{body}</figcaption>}
            </figure>
          );
        if (block.blockType === "video")
          return (
            <section className="shell" key={block.id}>
              <h2>{title}</h2>
              {mediaUrl && <video src={mediaUrl} controls preload="metadata" />}
              {body && <p>{body}</p>}
            </section>
          );
        if (block.blockType === "faq")
          return (
            <details className="shell" key={block.id}>
              <summary>{title}</summary>
              <p>{body}</p>
            </details>
          );
        if (block.blockType === "map")
          return (
            <section className="shell" key={block.id}>
              <h2>{title}</h2>
              <p>{body}</p>
              {mediaUrl && <a href={mediaUrl}>Ouvrir la carte</a>}
            </section>
          );
        return (
          <section className="shell" key={block.id}>
            <h2>{title}</h2>
            {body
              .split("\n")
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </section>
        );
      })}
      <Footer />
    </main>
  );
}
