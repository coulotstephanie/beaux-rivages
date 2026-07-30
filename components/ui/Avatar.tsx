import Image from "next/image";
import { classNames } from "@/lib/class-names";

type AvatarProps = {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const classes = classNames("ui-avatar", `ui-avatar--${size}`, className);
  return src ? (
    <span className={classes} title={name}>
      <Image src={src} alt="" fill sizes="96px" />
      <span className="sr-only">{name}</span>
    </span>
  ) : (
    <span className={classes} role="img" aria-label={name}>
      {initials(name)}
    </span>
  );
}
