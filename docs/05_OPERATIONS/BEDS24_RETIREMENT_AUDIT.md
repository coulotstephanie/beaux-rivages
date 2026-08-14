# Audit de retrait Beds24

Date de l'audit : 14 août 2026.

Base contrôlée : commit Production `2c5ab7e`.

## État du code actif

La recherche exhaustive dans l'arbre Git actif ne trouve aucune route, aucun client,
aucun composant d'administration, aucun déclencheur, aucune migration et aucune
variable d'environnement consacrés à Beds24.

Les composants génériques du channel manager sont conservés : ils ne contiennent
aucune référence à Beds24 et restent utilisés par les fonctions générales du site.

Les flux iCal directs et leur interprétation restent strictement inchangés.

## Variables Vercel

Les trois variables suivantes ont été vérifiées absentes de Vercel, y compris de
l'environnement Preview :

- `BEDS24_REFRESH_TOKEN` ;
- `BEDS24_AUDIT_REFRESH_TOKEN` ;
- `BEDS24_SETUP_REFRESH_TOKEN`.

Aucune autre variable Vercel n'a été modifiée.

## Inventaire historique local non suivi par Git

Les fichiers ci-dessous existent uniquement dans le dossier de travail local
historique. Ils ne font pas partie du commit Production, de cette branche ni des
déploiements Vercel. Ils sont volontairement laissés intacts afin de préserver le
travail local et l'historique :

- `app/api/admin/beds24-airbnb-price2/route.ts` ;
- `app/api/admin/beds24-permanent-sync/route.ts` ;
- `app/api/admin/beds24-properties-audit/route.ts` ;
- `app/api/admin/beds24-rates/route.ts` ;
- `components/admin/Beds24RateSyncAdmin.tsx` ;
- `data/beds24/le_nid_d_ete_tarifs_beaux_rivages_v2.csv` ;
- `docs/05_OPERATIONS/BEDS24_RATE_SYNC.md` ;
- `platform/beds24/airbnb-price2-payload.ts` ;
- `platform/beds24/airbnb-price2-service.ts` ;
- `platform/beds24/client.ts` ;
- `platform/beds24/contracts.ts` ;
- `platform/beds24/permanent-sync-repository.ts` ;
- `platform/beds24/permanent-sync.ts` ;
- `platform/beds24/rates.ts` ;
- `platform/beds24/service.ts` ;
- `platform/beds24/source-repository.ts` ;
- `supabase/migrations/20260810172000_beds24_preview_reader.sql` ;
- `supabase/migrations/20260810173000_fix_beds24_preview_reader_hash.sql` ;
- `supabase/migrations/20260810174000_remove_beds24_preview_reader.sql` ;
- `supabase/migrations/20260811190000_beds24_permanent_sync_queue.sql` ;
- `tests/beds24-permanent-sync.test.ts` ;
- `tests/beds24-rate-sync.test.ts`.

## Garde-fous

Le test `tests/beds24-neutralization.test.mjs` impose durablement :

- l'absence des anciennes routes API ;
- l'absence d'appels, de secrets ou de files Beds24 dans le code actif ;
- l'absence de déclencheur dans les crons, builds et scripts ;
- l'absence de commande Beds24 dans l'administration.

Ce retrait n'effectue aucune écriture Supabase, ne modifie aucune migration déjà
appliquée et ne contacte aucune plateforme externe.
