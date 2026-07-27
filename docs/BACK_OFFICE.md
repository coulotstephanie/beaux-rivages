# Back-office

## Périmètre préparé

Le snapshot `platform/content/snapshot.ts` agrège propriétés, recommandations,
expériences, tarifs, FAQ, actualités et médias. Les changements sont versionnés
avec un contrôle `expectedVersion` pour éviter l’écrasement concurrent.

## Sécurité obligatoire avant interface

1. Authentification par fournisseur fiable.
2. Autorisation par rôles `editor`, `publisher`, `administrator`.
3. Journal d’audit immuable.
4. Validation de schéma côté serveur.
5. Prévisualisation avant publication.
6. Stockage des médias par URL signée, avec contrôle des droits.

Une route `/admin` publique n’a volontairement pas été créée. L’interface pourra
consommer `ContentAdminService` après branchement d’un adaptateur authentifié.

## Migration recommandée

- Phase 1 : JSON versionné dans Git et export de brouillons.
- Phase 2 : PostgreSQL avec historique des révisions.
- Phase 3 : stockage objet pour les médias et transformations CDN.
