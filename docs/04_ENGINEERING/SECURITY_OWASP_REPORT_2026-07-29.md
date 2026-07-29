# Rapport sécurité OWASP — 29 juillet 2026

## Verdict

**Conformité partielle — production non autorisée.**

## Contrôles avec preuve

- validation Zod des entrées sensibles ;
- signature Stripe vérifiée sur le corps brut ;
- autorisation centralisée par JWT Supabase et rôles internes ;
- contrôle d’origine sur les mutations administratives ;
- RLS et politiques présentes dans les migrations ;
- `supabase db lint --linked --level warning` sans erreur ;
- HSTS, anti-framing, `nosniff`, Referrer-Policy et Permissions-Policy ;
- limitation de débit bornée en mémoire ;
- réponses administratives sensibles en `private, no-store` ;
- secrets exclus du dépôt et aucune clé littérale détectée par les tests.

## Risques ouverts

| Niveau | Risque                                                        | Mesure avant Go Live                                               |
| ------ | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| P0     | RLS des trois migrations en attente non testée sur miroir     | tests de politiques avec rôles anonym, voyageur et staff           |
| P1     | absence de Content-Security-Policy                            | déployer d’abord en report-only, analyser puis imposer             |
| P1     | fallback `ADMIN_API_TOKEN` actif sauf désactivation explicite | migrer les comptes puis fixer `ADMIN_TOKEN_FALLBACK_ENABLED=false` |
| P1     | rate limiting local non partagé entre instances Vercel        | utiliser un stockage distribué et fiable                           |
| P1     | monitoring/alertes de sécurité non démontrés                  | centraliser erreurs, audit et alertes                              |
| P2     | rotation des secrets non attestée                             | créer un registre daté hors Git                                    |

## Lecture OWASP Top 10

- contrôle d’accès : architecture correcte, preuve RLS de préproduction absente ;
- cryptographie : TLS imposé par Vercel/Supabase, rotation non attestée ;
- injection : requêtes Supabase paramétrées et validation, tests miroir requis ;
- conception : idempotence et séparation des responsabilités présentes ;
- mauvaise configuration : CSP et inventaire des variables restent ouverts ;
- composants vulnérables : audit de dépendances CI à joindre ;
- authentification : JWT vérifié, fallback historique à fermer ;
- intégrité : CI et migrations versionnées, sauvegarde non démontrée ;
- journalisation : audits SQL présents, agrégation/alertes absentes ;
- SSRF : aucune récupération arbitraire identifiée, connecteurs à surveiller.
