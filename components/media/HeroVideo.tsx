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
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, .35], ["0%", "5%"]);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const constrained = connection?.saveData || connection?.effectiveType === "2g";
    const desktop = window.matchMedia("(min-width: 701px)").matches;
    setCanPlayVideo(desktop && !reduceMotion && !constrained);
  }, [reduceMotion]);

  useEffect(() => {
    if (!canPlayVideo || !videoRef.current) return;
    void videoRef.current.play().catch(() => setCanPlayVideo(false));
  }, [canPlayVideo]);

  return (
    <div className={`hero-video ${ready ? "is-ready" : ""} ${className}`}>
      <Image src={poster} alt="" fill priority={priority} fetchPriority={priority ? "high" : "auto"} quality={90} sizes="100vw" />
      {canPlayVideo && (
        <motion.video
          ref={videoRef}
          style={{ y }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        >
          {sources.mobileWebm && <source src={sources.mobileWebm} media="(max-width: 900px)" type="video/webm" />}
          {sources.mobileMp4 && <source src={sources.mobileMp4} media="(max-width: 900px)" type="video/mp4" />}
          {sources.webm && <source src={sources.webm} type="video/webm" />}
          <source src={sources.mp4} type="video/mp4" />
        </motion.video>
      )}
    </div>
  );
}

