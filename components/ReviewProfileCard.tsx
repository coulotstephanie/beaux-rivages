import Link from "next/link";
import type { PropertyReviewProfile } from "@/reviews";

export function ReviewProfileCard({ profile }: { profile: PropertyReviewProfile }) {
  const maxCount = Math.max(...profile.themes.map((theme) => theme.count));

  return (
    <article className="review-profile-card">
      <div className="review-profile-topline">
        <div>
          <p className="eyebrow">{profile.island}</p>
          <h3>{profile.property}</h3>
        </div>
        <div className="review-score" aria-label={`${profile.airbnbRating} sur 5`}>
          <strong>{profile.airbnbRating}</strong>
          <span>/ 5</span>
          <small>{profile.airbnbReviewCount} avis Airbnb</small>
        </div>
      </div>

      {profile.accolade && <p className="review-accolade">{profile.accolade}</p>}
      <p className="review-summary">{profile.summary}</p>

      <div className="review-theme-list" aria-label={`Thèmes les plus cités pour ${profile.property}`}>
        {profile.themes.map((theme) => (
          <div className="review-theme" key={theme.label}>
            <div className="review-theme-label">
              <span>{theme.label}</span>
              <strong>{theme.count}</strong>
            </div>
            <div className="review-theme-track" aria-hidden="true">
              <span style={{ width: `${Math.max(12, (theme.count / maxCount) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="review-card-actions">
        <Link href={`/maisons/${profile.slug}`}>Découvrir la maison <span>→</span></Link>
        <a href={profile.sourceUrl} target="_blank" rel="noreferrer">Voir sur Airbnb</a>
      </div>
    </article>
  );
}
