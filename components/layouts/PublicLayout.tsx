import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ShellLayout } from "./ShellLayout";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <ShellLayout header={<Header />} footer={<Footer />} label="public">
      {children}
    </ShellLayout>
  );
}
