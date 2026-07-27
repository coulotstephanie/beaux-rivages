import Link from "next/link";

type BrandLogoProps = { compact?: boolean; light?: boolean };

export function BrandLogo({ compact = false, light = false }: BrandLogoProps) {
  return (
    <Link href="/" className={`brand-logo${compact ? " compact" : ""}${light ? " light" : ""}`}>
      <span className="sr-only">Accueil Beaux Rivages.</span>
      <svg className="brand-symbol" viewBox="0 0 88 88" aria-hidden="true">
        <g className="brand-sun">
          <path d="M55 13v8M42 18l5 7M68 18l-5 7M76 30l-8 3M34 30l8 3" />
          <path d="M45 34c2-10 18-10 20 0" />
        </g>
        <g className="brand-wave">
          <path d="M27 18v52" />
          <path d="M27 20h19c13 0 20 7 20 16 0 8-6 14-15 16" />
          <path d="M27 49h22c14 0 22 7 22 17" />
          <path d="M19 60c13-8 23-8 36 0s22 8 32 1" />
          <path d="M17 68c13-8 24-8 37 0s22 8 32 1" />
        </g>
      </svg>
      {!compact && (
        <span className="brand-wording">
          <strong>Beaux Rivages</strong>
          <small>L’hospitalité des îles</small>
        </span>
      )}
    </Link>
  );
}
