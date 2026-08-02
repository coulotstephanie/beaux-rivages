# Centre Tarifaire Beaux Rivages

Le Centre Tarifaire accessible à `/administration/tarifs` est la source interne unique des prix de Beaux Rivages. Le devis public, les réservations directes, les réservations manuelles, les contrats, les e-mails, le portail voyageur et les indicateurs utilisent tous `platform/pricing/service.ts`.

## Données pilotées

- tarifs par nuit et par logement ;
- saisons et minimums de nuits ;
- jours d’arrivée autorisés ;
- suppléments et options ;
- promotions fixes ou en pourcentage ;
- exceptions quotidiennes ;
- historique des modifications.

Les montants d’une réservation sont figés au moment de sa création. Une modification tarifaire ultérieure ne réécrit jamais un ancien contrat.

## Import, export et copie

L’export CSV contient une ligne par nuit (`date`, `prix_eur`, `saison`, `minimum_nuits`). L’import applique des dérogations journalières validées côté serveur et les inscrit dans l’historique. La duplication annuelle recrée les saisons dans l’année cible. La copie entre logements réplique les saisons, les règles d’arrivée et les suppléments ; elle doit toujours être relue avant utilisation.

## Synchronisations externes

Les lignes Airbnb et Booking décrivent uniquement l’état de futurs connecteurs officiels ou d’un Channel Manager. Aucun prix n’est envoyé vers une plateforme dans cette version et le verrou de base interdit l’activation accidentelle d’un envoi automatique.

## Mise en service

1. relire la migration `20260803100000_pricing_center.sql` ;
2. sauvegarder la base ;
3. appliquer la migration Supabase dans l’environnement de validation ;
4. régénérer les types avec `npm run db:types` ;
5. tester une modification sur chaque logement et contrôler le devis public ;
6. seulement après validation, appliquer la migration en production puis déployer le build.
