import Image from "next/image";
import { pickMedia, type MediaQuery } from "@/media/picker";

export function MediaPicker({ query, className = "" }: { query: MediaQuery; className?: string }) {
  const media = pickMedia({ ...query, limit: 1 })[0];
  if (!media) return null;
  if (media.type === "video") {
    return <video className={className} muted loop playsInline preload="none" poster="/images/destination/bateau-calme.jpeg">
      {"webm" in media && media.webm && <source src={media.webm} type="video/webm" />}
      <source src={media.src} type="video/mp4" />
    </video>;
  }
  return <Image className={className} src={media.src} alt={media.description} fill sizes="100vw" />;
}
