const carnetNavigation = [
  { href: "#guides", title: "Nos adresses de cœur" },
  { href: "#carte", title: "Se laisser guider" },
  { href: "#journees-ideales", title: "Une journée à notre rythme" },
  { href: "/inspiration", title: "Vivre les îles autrement" },
  { href: "/nos-petits-bonheurs", title: "Nos petits bonheurs" },
];

export function CarnetNavigation() {
  return (
    <nav className="carnet-navigation" aria-label="Rubriques du Carnet">
      <div>
        {carnetNavigation.map((item, index) => (
          <a href={item.href} key={item.href}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
