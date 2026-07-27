import type { ReactNode } from "react";

export function Badge({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <span className={`ui-badge${light ? " ui-badge--light" : ""}`}>{children}</span>;
}
