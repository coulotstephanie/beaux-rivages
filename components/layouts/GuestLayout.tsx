import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ShellLayout } from "./ShellLayout";

export function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <ShellLayout header={<Header />} footer={<Footer />} className="app-shell--guest" label="guest">
      {children}
    </ShellLayout>
  );
}
