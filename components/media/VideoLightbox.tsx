"use client";

import { useEffect } from "react";
import type { VideoSourceSet } from "./HeroVideo";

export function VideoLightbox({ open, onClose, sources, title }: { open: boolean; onClose: () => void; sources: VideoSourceSet; title: string }) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="video-lightbox" role="dialog" aria-modal="true" aria-label={title}>
    <button type="button" onClick={onClose} autoFocus>Fermer</button>
    <video controls autoPlay playsInline>
      {sources.webm && <source src={sources.webm} type="video/webm" />}
      <source src={sources.mp4} type="video/mp4" />
    </video>
  </div>;
}

