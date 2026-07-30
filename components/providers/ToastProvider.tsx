"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ToastViewport, type ToastItem } from "@/components/ui";

type ToastInput = Omit<ToastItem, "id"> & { id?: string };
type ToastContextValue = {
  notify: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const dismiss = useCallback(
    (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
    [],
  );
  const notify = useCallback((input: ToastInput) => {
    const id = input.id ?? crypto.randomUUID();
    setItems((current) => [...current, { ...input, id }]);
    return id;
  }, []);
  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
