import type { ReactNode } from "react";

type HeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  level?: 1 | 2 | 3;
  id?: string;
};

export function Heading({ eyebrow, title, description, align = "left", light = false, level = 2, id }: HeadingProps) {
  const Title = `h${level}` as const;
  return (
    <div className={`ui-heading ui-heading--${align}${light ? " ui-heading--light" : ""}`}>
      {eyebrow && <p className="ui-heading__eyebrow">{eyebrow}</p>}
      <Title id={id}>{title}</Title>
      {description && <p className="ui-heading__description">{description}</p>}
    </div>
  );
}
