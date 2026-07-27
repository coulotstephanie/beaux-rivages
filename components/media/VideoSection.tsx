"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoSourceSet } from "./HeroVideo";

export function VideoSection({ sources, poster, title }: { sources: VideoSourceSet; poster: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "160px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <section className="video-section" aria-label={title}>
    <video ref={ref} controls playsInline preload="none" poster={poster}>
      {visible && sources.webm && <source src={sources.webm} type="video/webm" />}
      {visible && <source src={sources.mp4} type="video/mp4" />}
    </video>
  </section>;
}

