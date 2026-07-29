import type { ReactNode } from "react";
import { classNames } from "@/lib/class-names";

type ShellLayoutProps = {
  header?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  label?: string;
};

export function ShellLayout({
  header,
  sidebar,
  children,
  footer,
  className,
  label,
}: ShellLayoutProps) {
  return (
    <div className={classNames("app-shell", className)} data-layout={label}>
      {header}
      <div className="app-shell__body">
        {sidebar && <aside className="app-shell__sidebar">{sidebar}</aside>}
        <main className="app-shell__content">{children}</main>
      </div>
      {footer}
    </div>
  );
}
