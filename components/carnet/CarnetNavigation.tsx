const carnetNavigation = [
  { href: "#guides", title: "Guides" },
  { href: "#carte", title: "Carte" },
  { href: "#journees-ideales", title: "Journées idéales" },
  { href: "/inspiration", title: "Inspiration" },
];

export function CarnetNavigation() {
  return (
    <nav className="carnet-navigation" aria-label="Rubriques du Carnet">
      <div>
        {carnetNavigation.map((item, index) => <a href={item.href} key={item.href}><span>{String(index + 1).padStart(2, "0")}</span>{item.title}</a>)}
      </div>
    </nav>
  );
}
