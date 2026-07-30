import type { ReactNode } from "react";
import { BackOfficeShell } from "@/features/back-office";
import "./premium.css";

export default function AdministrationLayout({ children }: { children: ReactNode }) {
  return <BackOfficeShell>{children}</BackOfficeShell>;
}
