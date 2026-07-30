import type { ReactNode } from "react";
import { DashboardLayout } from "./DashboardLayout";

type AdminLayoutProps = {
  children: ReactNode;
  header: ReactNode;
  navigation: ReactNode;
};

export function AdminLayout(props: AdminLayoutProps) {
  return (
    <div data-workspace="admin">
      <DashboardLayout {...props} />
    </div>
  );
}
