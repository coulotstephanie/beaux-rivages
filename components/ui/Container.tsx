import type { ElementType, HTMLAttributes, ReactNode } from "react";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: ElementType;
  size?: "default" | "wide" | "narrow";
};

export function Container({ children, as: Component = "div", size = "default", className = "", ...props }: ContainerProps) {
  return <Component className={`ui-container ui-container--${size} ${className}`.trim()} {...props}>{children}</Component>;
}
