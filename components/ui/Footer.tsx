import type { ReactNode } from "react";
import { classNames } from "@/lib/class-names";

type FooterProps = {
  brand: ReactNode;
  children: ReactNode;
  legal?: ReactNode;
  className?: string;
};

export function Footer({ brand, children, legal, className }: FooterProps) {
  return (
    <footer className={classNames("ui-footer", className)}>
      <div className="ui-footer__brand">{brand}</div>
      <div className="ui-footer__content">{children}</div>
      {legal && <div className="ui-footer__legal">{legal}</div>}
    </footer>
  );
}
