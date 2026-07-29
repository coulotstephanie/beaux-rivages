import { Button, Container } from "@/components/ui";

type SystemStateProps = {
  code: "401" | "403" | "404" | "500" | "maintenance";
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
};

export function SystemState({
  code,
  eyebrow,
  title,
  description,
  action = { label: "Revenir à l’accueil", href: "/" },
}: SystemStateProps) {
  return (
    <main className="system-state" data-status={code}>
      <Container size="narrow">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <Button href={action.href}>{action.label}</Button>
      </Container>
    </main>
  );
}
