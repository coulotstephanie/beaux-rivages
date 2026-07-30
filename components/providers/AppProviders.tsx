"use client";

import type { ReactNode } from "react";
import { ModalProvider } from "./ModalProvider";
import { QueryProvider } from "./QueryProvider";
import { SessionProvider } from "./SessionProvider";
import { SupabaseProvider } from "./SupabaseProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SupabaseProvider>
          <SessionProvider>
            <ToastProvider>
              <ModalProvider>{children}</ModalProvider>
            </ToastProvider>
          </SessionProvider>
        </SupabaseProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
