"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { GalleryImage } from "@/data";
import { ImageLightbox } from "./ImageLightbox";

export function FullscreenGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = useCallback(() => setActiveIndex(null), []);
  const change = useCallback((index: number) => setActiveIndex(index), []);

  return (
    <>
      <div className="fullscreen-gallery" aria-label={`Galerie de ${images.length} photographies`}>
        {images.map((image, index) => (
          <button
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`fullscreen-gallery__item item-${index + 1}`}
            key={image.src}
          >
            <span className="sr-only">Agrandir l’image {index + 1} sur {images.length} : {image.alt}.</span>
            <Image src={image.src} alt={image.alt} fill quality={88} loading="lazy" sizes={index === 0 ? "(max-width: 800px) 82vw, (max-width: 1400px) 58vw, 700px" : "(max-width: 800px) 82vw, (max-width: 1400px) 36vw, 430px"} />
            <span className="fullscreen-gallery__shade" />
            {image.caption && <span className="fullscreen-gallery__caption">{image.caption}</span>}
            <span className="fullscreen-gallery__expand" aria-hidden="true">⤢</span>
          </button>
        ))}
      </div>
      <ImageLightbox images={images} activeIndex={activeIndex} onClose={close} onChange={change} />
    </>
  );
}
