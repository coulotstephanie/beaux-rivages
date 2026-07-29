"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type VideoSourceSet = {
  mp4: string;
  webm?: string;
  mobileMp4?: string;
  mobileWebm?: string;
};

export function HeroVideo({ sources, poster, priority = true, className = "" }: {
  sources: VideoSourceSet;
  poster: string;
  priority?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [canAutoplay, setCanAutoplay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, .35], ["0%", "5%"]);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const constrained = connection?.saveData || connection?.effectiveType === "2g";
    setCanAutoplay(!reduceMotion && !constrained);
  }, [reduceMotion]);

  useEffect(() => {
    if (!canAutoplay || !videoRef.current) return;
    void videoRef.current.play().catch(() => setPlaying(false));
  }, [canAutoplay]);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      return;
    }
    try {
      await video.play();
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div className={`hero-video ${ready ? "is-ready" : ""} ${className}`}>
      <Image src={poster} alt="" fill priority={priority} fetchPriority={priority ? "high" : "auto"} quality={90} sizes="100vw" />
      <motion.video
        ref={videoRef}
        style={{ y }}
        autoPlay={canAutoplay}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        tabIndex={-1}
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {sources.mobileWebm && <source src={sources.mobileWebm} media="(max-width: 900px)" type="video/webm" />}
        {sources.mobileMp4 && <source src={sources.mobileMp4} media="(max-width: 900px)" type="video/mp4" />}
        {sources.webm && <source src={sources.webm} type="video/webm" />}
        <source src={sources.mp4} type="video/mp4" />
      </motion.video>
      <button
        type="button"
        className="hero-video__control"
        onClick={() => void togglePlayback()}
        aria-label={playing ? "Mettre la vidéo d’accueil en pause" : "Lire la vidéo d’accueil"}
      >
        <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
        {playing ? "Pause" : "Lire la vidéo"}
      </button>
    </div>
  );
}
