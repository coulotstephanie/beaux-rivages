export function EditorialDivider({ label }: { label?: string }) {
  return (
    <div className="editorial-divider" aria-hidden="true">
      <span />
      {label && <small>{label}</small>}
      <span />
    </div>
  );
}
