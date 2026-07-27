import Image from "next/image";

export function MediaBackground({ src, alt = "", sizes = "100vw" }: { src: string; alt?: string; sizes?: string }) {
  return (
    <span className="media-background" aria-hidden={alt ? undefined : true}>
      <Image src={src} alt={alt} fill loading="lazy" quality={88} sizes={sizes} />
    </span>
  );
}
