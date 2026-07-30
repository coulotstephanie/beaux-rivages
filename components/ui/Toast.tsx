"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { classNames } from "@/lib/class-names";

export type ToastItem = {
  id: string;
  title: string;
  description?: ReactNode;
  variant?: "info" | "success" | "warning" | "danger";
};

type ToastProps = ToastItem & {
  onDismiss: (id: string) => void;
};

export function Toast({ id, title, description, variant = "info", onDismiss }: ToastProps) {
  return (
    <div
      className={classNames("ui-toast", `ui-toast--${variant}`)}
      role={variant === "danger" ? "alert" : "status"}
    >
      <div>
        <strong>{title}</strong>
        {description && <div>{description}</div>}
      </div>
      <Button variant="ghost" onClick={() => onDismiss(id)} ariaLabel="Fermer">
        ×
      </Button>
    </div>
  );
}

export function ToastViewport({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="ui-toast-viewport" aria-live="polite" aria-relevant="additions">
      {items.map((item) => (
        <Toast key={item.id} {...item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
