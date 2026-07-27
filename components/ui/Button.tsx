import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  ariaLabel?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ariaLabel,
}: ButtonProps) {
  const classes = `ui-button ui-button--${variant} ${className}`.trim();

  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return <a href={href} className={classes} aria-label={ariaLabel}>{children}</a>;
  }

  if (/^https?:\/\//.test(href)) {
    return <a href={href} className={classes} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">{children}</a>;
  }

  return <Link href={href} className={classes} aria-label={ariaLabel}>{children}</Link>;
}
