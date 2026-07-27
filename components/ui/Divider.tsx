export function Divider({ light = false }: { light?: boolean }) {
  return <hr className={`ui-divider${light ? " ui-divider--light" : ""}`} aria-hidden="true" />;
}
