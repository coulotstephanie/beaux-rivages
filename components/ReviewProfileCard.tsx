import Link from "next/link";
import type { PropertyReviewProfile } from "@/reviews";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, localizedHref } from "@/i18n/lot1-client";

export function ReviewProfileCard({ profile, locale = "fr" }: { profile: PropertyReviewProfile; locale?: SupportedLocale }) {
  const maxCount = Math.max(...profile.themes.map((theme) => theme.count));

  return (
    <article className="review-profile-card">
      <div className="review-profile-topline">
        <div>
          <p className="eyebrow">{profile.island}</p>
          <h3>{profile.property}</h3>
        </div>
        <div
          className="review-score"
          aria-label={tr(locale, `${profile.airbnbRating} sur 5`)}
        >
          <strong>{profile.airbnbRating}</strong>
          <span>/ 5</span>
          <small>{profile.airbnbReviewCount} {tr(locale, "avis Airbnb")}</small>
        </div>
      </div>

      {profile.accolade && <p className="review-accolade">{profile.accolade}</p>}
      <p className="review-summary">{profile.summary}</p>

      {profile.verifiedQuotes && (
        <div className="review-verified-quotes" aria-label={tr(locale, "Extraits d’avis voyageurs vérifiés")}>
          {profile.verifiedQuotes.map((review) => (
            <blockquote key={`${review.author}-${review.quote}`}>
              <p>« {review.quote} »</p>
              <footer>
                {review.author} {tr(locale, "· avis vérifié sur")} {review.platform}
              </footer>
            </blockquote>
          ))}
        </div>
      )}

      <div
        className="review-theme-list"
        aria-label={tr(locale, `Thèmes les plus cités pour ${profile.property}`)}
      >
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
        <Link href={localizedHref(locale, `/maisons/${profile.slug}`)}>
          {tr(locale, "Découvrir la maison")} <span>→</span>
        </Link>
        <div>
          <a href={profile.sourceUrl} target="_blank" rel="noreferrer">
            {tr(locale, "Voir sur Airbnb")}
          </a>
          {profile.otherSources?.map((source) => (
            <a href={source.sourceUrl} target="_blank" rel="noreferrer" key={source.platform}>
              {source.rating && source.scale && source.reviewCount
                ? `${source.rating}/${source.scale} · ${source.reviewCount} avis sur ${source.platform}`
                : `Voir sur ${source.platform}`}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
