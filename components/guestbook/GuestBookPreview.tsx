import Link from "next/link";
import { initialGuestBookEntries } from "@/features/guestbook";
import { GuestBook } from "./GuestBook";

export function GuestBookPreview() {
  const entries = initialGuestBookEntries.filter((entry) => entry.featured).slice(0, 5);
  return (
    <section className="guestbook-preview">
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Le Livre d’Or du Chai</p>
            <h2>Les mots laissés avant de refermer la porte.</h2>
          </div>
          <p>Des souvenirs manuscrits, conservés dans leur ton d’origine.</p>
        </div>
        <GuestBook entries={entries} compact />
        <Link className="primary-button" href="/livre-d-or">
          Voir tout le Livre d’Or <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
