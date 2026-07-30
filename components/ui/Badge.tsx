import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "@/lib/class-names";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  light?: boolean;
  variant?: "neutral" | "success" | "warning" | "danger" | "info";
};

export function Badge({
  children,
  light = false,
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={classNames(
        "ui-badge",
        `ui-badge--${variant}`,
        light && "ui-badge--light",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
