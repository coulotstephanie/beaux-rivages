import type { ReactNode } from "react";
import { ShellLayout } from "./ShellLayout";

type DashboardLayoutProps = {
  children: ReactNode;
  header: ReactNode;
  navigation: ReactNode;
};

export function DashboardLayout({ children, header, navigation }: DashboardLayoutProps) {
  return (
    <ShellLayout
      header={header}
      sidebar={navigation}
      className="app-shell--dashboard"
      label="dashboard"
    >
      {children}
    </ShellLayout>
  );
}
