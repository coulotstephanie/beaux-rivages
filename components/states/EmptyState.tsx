import type { ReactNode } from "react";
import { Button } from "@/components/ui";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: { label: string; href: string };
};

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <section className="ui-empty-state">
      {icon && <div aria-hidden="true">{icon}</div>}
      <h2>{title}</h2>
      <p>{description}</p>
      {action && <Button href={action.href}>{action.label}</Button>}
    </section>
  );
}
