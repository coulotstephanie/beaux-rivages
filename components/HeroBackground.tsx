import Image from "next/image";
import { BLUR_DATA_URL } from "@/media";

export function HeroBackground({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <span className="hero-background" aria-hidden={alt ? undefined : true}>
      <Image
        src={src}
        alt={alt}
        fill
        quality={95}
        priority
        fetchPriority="high"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        sizes="100vw"
      />
    </span>
  );
}
