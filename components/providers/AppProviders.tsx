"use client";

import type { ReactNode } from "react";
import { ModalProvider } from "./ModalProvider";
import { QueryProvider } from "./QueryProvider";
import { SessionProvider } from "./SessionProvider";
import { SupabaseProvider } from "./SupabaseProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";
import type { SupportedLocale } from "@/i18n/config";

export function AppProviders({ children, locale = "fr" }: { children: ReactNode; locale?: SupportedLocale }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SupabaseProvider>
          <SessionProvider>
            <ToastProvider>
              <ModalProvider locale={locale}>{children}</ModalProvider>
            </ToastProvider>
          </SessionProvider>
        </SupabaseProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
