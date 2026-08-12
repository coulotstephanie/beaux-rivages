"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type HeritageGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  creditHref?: string;
};

export function HeritageGallery({
  title,
  images,
}: {
  title: string;
  images: HeritageGalleryImage[];
}) {
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    if (active == null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight")
        setActive((value) => (value == null ? null : (value + 1) % images.length));
      if (event.key === "ArrowLeft")
        setActive((value) => (value == null ? null : (value - 1 + images.length) % images.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, images.length]);

  return (
    <>
      <section className="heritage-detail__gallery shell" aria-label={`Photographies de ${title}`}>
        {images.map((image, index) => (
          <figure
            key={`${image.src}-${index}`}
            id={image.src.includes("vieille-tour-des-baleines") ? "vieille-tour" : undefined}
            className={index === 0 ? "is-wide" : ""}
          >
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Agrandir : ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={index === 0 ? "100vw" : "50vw"}
                unoptimized={image.src.startsWith("http")}
              />
            </button>
            {(image.caption || image.credit) && (
              <figcaption>
                {image.caption}
                {image.credit && image.creditHref && (
                  <>
                    {" "}
                    ·{" "}
                    <a href={image.creditHref} target="_blank" rel="noreferrer">
                      {image.credit}
                    </a>
                  </>
                )}
              </figcaption>
            )}
          </figure>
        ))}
      </section>
      {active != null && (
        <div
          className="heritage-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Galerie de ${title}`}
          onClick={() => setActive(null)}
        >
          <button
            className="heritage-lightbox__close"
            type="button"
            onClick={() => setActive(null)}
            aria-label="Fermer la galerie"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActive((active - 1 + images.length) % images.length);
            }}
            aria-label="Photo précédente"
          >
            ‹
          </button>
          <figure onClick={(event) => event.stopPropagation()}>
            <Image
              src={images[active].src}
              alt={images[active].alt}
              fill
              sizes="100vw"
              unoptimized={images[active].src.startsWith("http")}
            />
            <figcaption>{images[active].caption || images[active].alt}</figcaption>
          </figure>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActive((active + 1) % images.length);
            }}
            aria-label="Photo suivante"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
