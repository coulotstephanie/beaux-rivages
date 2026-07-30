import type { ReactNode } from "react";
import { DashboardLayout } from "./DashboardLayout";

type OwnerLayoutProps = {
  children: ReactNode;
  header: ReactNode;
  navigation: ReactNode;
};

export function OwnerLayout(props: OwnerLayoutProps) {
  return (
    <div data-workspace="owner">
      <DashboardLayout {...props} />
    </div>
  );
}
