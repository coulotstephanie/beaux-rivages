"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Sequence = { src: string; label: string };

export function CinematicHeroMedia({ sequences, poster, playbackRate = .82, sound = true }: {
  sequences: Sequence[];
  poster: string;
  playbackRate?: number;
  sound?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
      void videoRef.current.play().catch(() => undefined);
    }
  }, [index, playbackRate]);
  const sequence = sequences[index];
  return <div className="cinematic-media">
    <Image src={poster} alt="" fill priority fetchPriority="high" quality={95} sizes="100vw" />
    <video ref={videoRef} key={sequence.src} autoPlay muted={muted} playsInline preload="metadata" poster={poster}
      loop={sequences.length === 1} onEnded={() => setIndex((current) => (current + 1) % sequences.length)}>
      <source src={sequence.src} type="video/mp4" />
    </video>
    <div className="cinematic-media__chapters">{sequences.map((item, itemIndex) => <span key={item.label} className={index === itemIndex ? "is-active" : ""}>{item.label}</span>)}</div>
    {sound && <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Activer le son du film" : "Couper le son du film"}>{muted ? "Son off" : "Son on"}</button>}
  </div>;
}
