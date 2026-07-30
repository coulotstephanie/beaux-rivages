"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Modal } from "@/components/ui";

type ModalState = {
  title: string;
  description?: string;
  content: ReactNode;
};

type ModalContextValue = {
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState | null>(null);
  const closeModal = useCallback(() => setModal(null), []);
  const openModal = useCallback((next: ModalState) => setModal(next), []);
  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Modal
        open={Boolean(modal)}
        onClose={closeModal}
        title={modal?.title ?? ""}
        description={modal?.description}
      >
        {modal?.content}
      </Modal>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
}
