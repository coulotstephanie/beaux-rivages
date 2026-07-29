import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { classNames } from "@/lib/class-names";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: ElementType;
  variant?: "default" | "glass" | "dark" | "sand";
  interactive?: boolean;
};

export function Card({
  children,
  as: Component = "article",
  variant = "default",
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <Component
      className={classNames(
        "ui-card",
        `ui-card--${variant}`,
        interactive && "ui-card--interactive",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
