import type { HTMLAttributes, ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: "light" | "sand" | "dark";
  contained?: boolean;
};

export function Section({ children, tone = "light", contained = true, className = "", ...props }: SectionProps) {
  return (
    <section className={`ui-section ui-section--${tone} ${className}`.trim()} {...props}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
