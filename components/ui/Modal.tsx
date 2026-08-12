"use client";

import type { ReactNode } from "react";
import { Dialog } from "./Dialog";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  closeLabel?: string;
};

export function Modal(props: ModalProps) {
  return <Dialog {...props} className="ui-modal" />;
}
