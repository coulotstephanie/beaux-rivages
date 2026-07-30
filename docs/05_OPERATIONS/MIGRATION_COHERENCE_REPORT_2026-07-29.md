# Rapport de cohérence des migrations — 29 juillet 2026

## Décision

**Partiellement conforme — migration de production interdite à ce stade.**

## Preuves acquises

- les 12 versions déjà inscrites dans l’historique Supabase, de
  `20260727170000` à `20260729153000`, ont toutes un fichier local ;
- la migration distante `20260729153000_yield_management.sql` a été réintégrée
  avec son rollback et son code applicatif ;
- les 15 migrations locales ont chacune un rollback non vide ;
- aucune version dupliquée, migration orpheline ou rollback orphelin n’est
  détecté par `node scripts/verify-migration-integrity.mjs` ;
- `supabase db lint --linked --level warning` ne relève aucune erreur ;
- le dry-run Supabase identifie exactement trois migrations non appliquées :
  `20260729160000`, `20260730001000` et `20260730010000`.

## Écart de schéma observé

Les types générés depuis la base distante diffèrent des types Git sur les
tables introduites par les trois migrations en attente. Cet écart est attendu,
mais prouve que le schéma Git et le schéma distant ne sont pas encore
identiques. Aucun push ne sera effectué avant sauvegarde et préproduction.

## Contrôles restant obligatoires

- exécuter toute la chaîne sur une base vierge ;
- restaurer un dump dans un projet Supabase de préproduction isolé ;
- comparer le schéma restauré au schéma attendu ;
- appliquer les trois migrations sur ce miroir et relancer lint, tests RLS et
  génération des types ;
- vérifier les rollbacks avec des données représentatives.

Ces contrôles nécessitent Docker ou les outils PostgreSQL ainsi qu’un projet
miroir. Ils n’ont pas été simulés et restent donc non validés.
