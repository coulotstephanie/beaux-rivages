# Rapport — Architecture Supabase Enterprise

Date : 27 juillet 2026
Projet : `ydqtqfkzmovjdkmldhqr`
Région : West EU — Irlande

## État

Les trois migrations versionnées sont appliquées et alignées entre le dépôt et
Supabase :

- `20260727170000_production_booking_foundation.sql` ;
- `20260727171000_seed_current_catalog_and_rates.sql` ;
- `20260727172000_verify_production_booking_foundation.sql`.

La troisième migration vérifie le schéma et exécute des écritures d'essai dans
une sous-transaction volontairement annulée. Aucun jeu de données de test n'est
conservé.

## Schéma livré

- catalogue : `properties`, `property_media` ;
- tarification : `seasons`, `rates`, `promotions`, `options`,
  `property_options` ;
- voyageurs : `users`, `app_user_roles`, `guests`, `consents` ;
- réservation : `reservations`, `reservation_guests`,
  `reservation_options` ;
- finance : `invoices`, `payments` ;
- contrats : `contracts`, `signatures` ;
- communication : `transactional_emails` ;
- calendriers : `calendar_sources`, `calendar_events`,
  `occupancy_blocks`, `availability`, `sync_runs` ;
- exploitation : `audit_logs`.

Le détail des colonnes, relations et responsabilités figure dans
`docs/SUPABASE_ENTERPRISE_ARCHITECTURE.md`.

## Sécurité et concurrence

- RLS active sur toutes les tables métier ;
- aucune politique d'accès anonyme aux données métier ;
- rôles `admin`, `concierge`, `read_only` ;
- accès voyageur limité à ses propres réservations, factures, paiements et
  contrats ;
- buckets Storage privés ;
- clé serveur uniquement dans Vercel, chiffrée et jamais exposée au navigateur ;
- contrainte GiST, verrou transactionnel par logement et trigger de garde contre
  les doubles réservations ;
- création de réservation atomique et idempotente ;
- audit avant/après sur les réservations, paiements, contrats, tarifs et
  promotions.

## Fonctions PostgreSQL

- `generate_reservation_number` ;
- `is_property_available` ;
- `calculate_stay_price` ;
- `create_direct_reservation` ;
- `replace_calendar_events` ;
- `refresh_availability` ;
- `guard_occupancy_conflicts` ;
- fonctions de synchronisation, audit, notification et `updated_at`.

## Storage

Buckets privés :

- `contracts` ;
- `signed-contracts` ;
- `photos` ;
- `avatars` ;
- `documents` ;
- `guestbook` ;
- `invoices`.

## Couche TypeScript

Les repositories sont isolés dans `platform/database` :

- réservations ;
- disponibilité ;
- calendriers ;
- catalogue et médias ;
- tarifs ;
- paiements ;
- contrats ;
- audit ;
- administration et exports ;
- Storage privé.

Les composants React ne dépendent pas du client Supabase. Les entrées de
réservation sont validées avec Zod. Les types de la base ont été générés depuis
le projet distant dans `platform/database/database.types.ts`.

## Données initiales

- 3 logements ;
- 15 règles tarifaires ;
- saisons et promotions actuelles ;
- options et prix propres à chaque logement ;
- 6 sources iCal Airbnb/Booking ;
- 58 événements importés ;
- 58 blocages d'occupation ;
- 6 sources sur 6 au statut sain après synchronisation.

## Tests

- ESLint : réussi sans avertissement ;
- TypeScript strict : réussi ;
- tests applicatifs : 42 réussis ;
- build Next.js : réussi, 68 pages ;
- test distant de persistance : réussi ;
- répétition idempotente : réussie ;
- conflit de dates : rejeté avec le code PostgreSQL `23P01` ;
- accès anonyme aux réservations : rejeté ;
- lecture des tarifs Supabase par les API Next.js : réussie ;
- synchronisation des six calendriers vers Supabase : réussie.

Le fichier pgTAP est fourni dans
`supabase/tests/production_booking_foundation.sql`. Son exécution par la CLI
nécessite Docker Desktop. La migration de vérification distante couvre les
garanties critiques sans conserver ses données d'essai.

## Sauvegardes

- scripts de sauvegarde et restauration contrôlée fournis ;
- migrations et retours arrière versionnés ;
- les sauvegardes automatiques quotidiennes nécessitent Supabase Pro ;
- les fichiers Storage exigent une sauvegarde distincte.

## Limites avant paiement réel

- l'interface publique termine encore sur une demande par e-mail ;
- Stripe TEST, Resend et Yousign ne sont pas encore configurés ;
- les contrats doivent être validés juridiquement ;
- Supabase Pro est recommandé avant l'ouverture commerciale ;
- une authentification Supabase des administrateurs devra remplacer à terme le
  jeton d'administration transitoire.
