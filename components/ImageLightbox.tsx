"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryImage } from "@/data";

type ImageLightboxProps = {
  images: GalleryImage[];
  activeIndex: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function ImageLightbox({ images, activeIndex, onClose, onChange }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const pointerStart = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isOpen = activeIndex !== null;

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
      openerRef.current?.focus();
      openerRef.current = null;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleArrows = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onChange((activeIndex + 1) % images.length);
      if (event.key === "ArrowLeft") onChange((activeIndex - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleArrows);
    return () => window.removeEventListener("keydown", handleArrows);
  }, [activeIndex, images.length, onChange]);

  useEffect(() => {
    if (!isPlaying || activeIndex === null) return;
    const timer = window.setInterval(() => onChange((activeIndex + 1) % images.length), 4200);
    return () => window.clearInterval(timer);
  }, [activeIndex, images.length, isPlaying, onChange]);

  useEffect(() => {
    if (activeIndex === null) setIsPlaying(false);
    setIsZoomed(false);
  }, [activeIndex]);

  if (!isMounted || activeIndex === null || !images[activeIndex]) return null;
  const image = images[activeIndex];
  const captionId = image.caption ? "lightbox-caption" : undefined;

  const handlePointerEnd = (clientX: number) => {
    if (pointerStart.current === null) return;
    const distance = clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 45) return;
    onChange(distance < 0
      ? (activeIndex + 1) % images.length
      : (activeIndex - 1 + images.length) % images.length);
  };

  return createPortal(
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Galerie plein écran, image ${activeIndex + 1} sur ${images.length}`}
      aria-describedby={captionId}
      ref={dialogRef}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} className="image-lightbox__close" type="button" onClick={onClose} aria-label="Fermer la galerie">×</button>
      <button
        className="image-lightbox__play"
        type="button"
        onClick={() => setIsPlaying((value) => !value)}
        aria-pressed={isPlaying}
      >
        {isPlaying ? "Pause" : "Diaporama"}
      </button>
      <button
        className="image-lightbox__zoom"
        type="button"
        onClick={() => setIsZoomed((value) => !value)}
        aria-pressed={isZoomed}
        aria-label={isZoomed ? "Réduire l’image" : "Zoomer dans l’image"}
      >
        {isZoomed ? "−" : "+"}
      </button>
      <button type="button" className="image-lightbox__previous" onClick={() => onChange((activeIndex - 1 + images.length) % images.length)} aria-label="Image précédente">←</button>
      <figure
        className={isZoomed ? "is-zoomed" : ""}
        onPointerDown={(event) => {
          if (!isZoomed && event.pointerType !== "mouse") pointerStart.current = event.clientX;
        }}
        onPointerUp={(event) => handlePointerEnd(event.clientX)}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
      >
        <Image src={image.src} alt={image.alt} fill sizes="100vw" quality={90} unoptimized priority draggable={false} onDoubleClick={() => setIsZoomed((value) => !value)} />
        {image.caption && <figcaption id={captionId}>{image.caption}</figcaption>}
      </figure>
      <button type="button" className="image-lightbox__next" onClick={() => onChange((activeIndex + 1) % images.length)} aria-label="Image suivante">→</button>
      <span className="image-lightbox__count">{activeIndex + 1} / {images.length}</span>
    </div>,
    document.body,
  );
}
