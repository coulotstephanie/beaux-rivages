# Channel Manager Premium

Le module `/administration` → **Channel Manager** centralise les connexions, mappings d’annonces, disponibilités, synchronisations, conflits et journaux.

## Architecture

Le cœur ne dépend d’aucune plateforme. Chaque intégration implémente `ChannelConnector` et est enregistrée dans le registre de connecteurs. Airbnb, Booking.com et Abritel/Vrbo disposent aujourd’hui de la synchronisation iCal. Google Vacation Rentals, Holidu, Expedia et HomeToGo sont prévus dans le registre et le schéma.

Les APIs partenaires officielles devront être raccordées pour importer ou exporter les prix, coordonnées voyageurs, paiements, commentaires et règles de séjour. Aucun scraping ni simulation d’accès partenaire n’est effectué.

## Flux

1. Une synchronisation crée un `channel_sync_jobs` avec une clé d’idempotence.
2. Le moteur importe les calendriers et normalise leurs événements.
3. Les contraintes d’exclusion de `occupancy_blocks` empêchent les doubles réservations.
4. Un écart devient un `channel_conflicts` avec proposition et historique de résolution.
5. Chaque mutation produit un `channel_audit_logs`.
6. Un job échoué peut être rejoué ; les actions réversibles sont identifiées.

## Sécurité

`/api/admin/channel-manager` exige le jeton administrateur. Les écritures imposent aussi la même origine et une validation Zod stricte. Les tables sont protégées par RLS et réservées aux administrateurs.

Les secrets partenaires doivent être placés dans le coffre de l’hébergeur et référencés via `credentials_reference`, jamais enregistrés en clair.

## Exploitation

- Compléter les identifiants d’annonces dans **Plateformes**.
- Configurer les URLs iCal privées dans les variables Vercel existantes.
- Lancer une synchronisation par maison dans **Synchronisations**.
- Examiner les erreurs, les conflits puis les résoudre ou rejouer les jobs.
