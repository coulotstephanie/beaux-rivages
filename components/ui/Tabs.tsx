"use client";

import { useId, useState, type ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultValue?: string;
  label: string;
};

export function Tabs({ items, defaultValue, label }: TabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(defaultValue ?? items[0]?.id ?? "");
  const current = items.find((item) => item.id === active);

  return (
    <div className="ui-tabs">
      <div role="tablist" aria-label={label}>
        {items.map((item) => (
          <button
            type="button"
            role="tab"
            id={`${baseId}-tab-${item.id}`}
            aria-controls={`${baseId}-panel-${item.id}`}
            aria-selected={item.id === active}
            tabIndex={item.id === active ? 0 : -1}
            key={item.id}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {current && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${current.id}`}
          aria-labelledby={`${baseId}-tab-${current.id}`}
        >
          {current.content}
        </div>
      )}
    </div>
  );
}
