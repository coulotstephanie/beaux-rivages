import type { ElementType, HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: ElementType;
  variant?: "default" | "glass" | "dark";
};

export function Card({ children, as: Component = "article", variant = "default", className = "", ...props }: CardProps) {
  return <Component className={`ui-card ui-card--${variant} ${className}`.trim()} {...props}>{children}</Component>;
}
