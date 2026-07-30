"use client";

import { QueryClient, QueryClientProvider, type DefaultOptions } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 0,
  },
};

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
