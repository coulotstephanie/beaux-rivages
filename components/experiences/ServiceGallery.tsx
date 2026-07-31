"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { HospitalityService } from "@/hospitalityServices";

export function ServiceGallery({ gallery }: { gallery: HospitalityService["gallery"] }) {
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    if (selected === null) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);
  return (
    <>
      <div className="service-gallery">
        {gallery.map((image, index) => (
          <button
            type="button"
            key={image.src}
            onClick={() => setSelected(index)}
            aria-label={`Agrandir : ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading="lazy"
              sizes="(max-width: 720px) 100vw, 33vw"
            />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="service-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Photo agrandie"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              className="service-lightbox__close"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              Fermer ×
            </button>
            <Image
              src={gallery[selected].src}
              alt={gallery[selected].alt}
              fill
              sizes="100vw"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
