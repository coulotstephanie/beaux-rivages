"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "./Button";

export type DropdownItem = {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
};

type DropdownProps = {
  label: ReactNode;
  items: DropdownItem[];
  ariaLabel: string;
};

export function Dropdown({ label, items, ariaLabel }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="ui-dropdown" ref={root}>
      <Button
        variant="secondary"
        ariaLabel={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
      </Button>
      {open && (
        <div role="menu">
          {items.map((item) => (
            <button
              type="button"
              role="menuitem"
              disabled={item.disabled}
              key={item.id}
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
