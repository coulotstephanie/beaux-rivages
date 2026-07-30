"use client";

import { useEffect, useRef, type DialogHTMLAttributes, type ReactNode } from "react";
import { Button } from "./Button";
import { classNames } from "@/lib/class-names";

export type DialogProps = Omit<DialogHTMLAttributes<HTMLDialogElement>, "open"> & {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  closeLabel?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  closeLabel = "Fermer",
  className,
  ...props
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={classNames("ui-dialog", className)}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      aria-labelledby="ui-dialog-title"
      aria-describedby={description ? "ui-dialog-description" : undefined}
      {...props}
    >
      <div className="ui-dialog__header">
        <div>
          <h2 id="ui-dialog-title">{title}</h2>
          {description && <p id="ui-dialog-description">{description}</p>}
        </div>
        <Button variant="ghost" onClick={onClose} ariaLabel={closeLabel}>
          ×
        </Button>
      </div>
      <div className="ui-dialog__body">{children}</div>
    </dialog>
  );
}
