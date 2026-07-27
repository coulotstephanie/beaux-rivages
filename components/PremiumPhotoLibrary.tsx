"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { photoCategories, type LibraryPhoto, type PhotoCategory } from "@/phototheque";
import { ImageLightbox } from "./ImageLightbox";

const collections = ["Toutes les maisons", "Le Chai des Tortues", "Villa Raie Manta", "Le Nid d’Été", "Beaux Rivages"] as const;

export function PremiumPhotoLibrary({ photos }: { photos: LibraryPhoto[] }) {
  const [category, setCategory] = useState<(typeof photoCategories)[number]>("Tous");
  const [collection, setCollection] = useState<(typeof collections)[number]>("Toutes les maisons");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visible = useMemo(() => photos.filter((photo) =>
    (category === "Tous" || photo.category === category)
    && (collection === "Toutes les maisons" || photo.collection === collection)
  ), [category, collection, photos]);

  const chooseCategory = (value: (typeof photoCategories)[number]) => {
    setCategory(value);
    setActiveIndex(null);
  };

  return (
    <>
      <div className="photo-library__toolbar">
        <div role="group" aria-label="Filtrer par catégorie">
          {photoCategories.map((item) => (
            <button type="button" className={category === item ? "is-active" : ""} onClick={() => chooseCategory(item)} key={item}>
              {item}<small>{item === "Tous" ? photos.length : photos.filter((photo) => photo.category === item as PhotoCategory).length}</small>
            </button>
          ))}
        </div>
        <label>
          <span>Collection</span>
          <select value={collection} onChange={(event) => { setCollection(event.target.value as typeof collection); setActiveIndex(null); }}>
            {collections.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <p className="photo-library__result" aria-live="polite">{visible.length} photographie{visible.length > 1 ? "s" : ""}</p>
      <div className="photo-library__grid">
        {visible.map((photo, index) => (
          <button type="button" onClick={() => setActiveIndex(index)} key={photo.src} className={`photo-library__photo photo-library__photo--${index % 7}`}>
            <Image src={photo.src} alt={photo.alt} fill loading="lazy" quality={86} sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            <span className="photo-library__shade" />
            <span className="photo-library__caption"><small>{photo.collection} · {photo.category}</small><strong>{photo.caption ?? photo.alt}</strong></span>
            <span className="photo-library__expand" aria-hidden="true">⤢</span>
          </button>
        ))}
      </div>
      <ImageLightbox images={visible} activeIndex={activeIndex} onClose={() => setActiveIndex(null)} onChange={setActiveIndex} />
    </>
  );
}
