import type { ReactNode } from "react";
import { classNames } from "@/lib/class-names";

type NavbarProps = {
  brand: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  label?: string;
  className?: string;
};

export function Navbar({
  brand,
  children,
  actions,
  label = "Navigation principale",
  className,
}: NavbarProps) {
  return (
    <header className={classNames("ui-navbar", className)}>
      <div className="ui-navbar__brand">{brand}</div>
      <nav aria-label={label}>{children}</nav>
      {actions && <div className="ui-navbar__actions">{actions}</div>}
    </header>
  );
}
