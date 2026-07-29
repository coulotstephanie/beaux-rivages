# Sprint 2 — Moteur de réservation

## Audit

Le dépôt disposait déjà d’un moteur fonctionnel : calendrier iCal, cache,
contrôle des chevauchements, saisons, tarifs nuit par nuit, durées minimum et
maximum, promotions, tables Supabase et API de devis. Le calendrier public
utilisait toutefois directement l’API et la validation était dupliquée dans les
routes.

## Convergence réalisée

- création de `features/reservations` selon Feature First ;
- injection de repositories dans le service d’orchestration ;
- adaptateurs vers les services existants, sans duplication du calcul ;
- validation Zod centralisée pour `/api/quote` ;
- extraction du chargement du calendrier dans un hook annulable ;
- conservation d’un export compatible pour les imports historiques.

## Sécurité et accessibilité

La route conserve son rate limiting et n’accepte que les maisons, dates,
compositions, options et expériences connues. Le calendrier conserve ses
libellés accessibles, son état dynamique et sa navigation clavier.

## Données

Aucune migration n’est nécessaire. Les tables, contraintes d’occupation,
saisons et tarifs du socle de production restent les sources existantes.

## Suite

Avant toute réservation réelle, une future PR devra relier l’orchestration à la
transaction de création existante et appliquer la capacité propre à chaque
maison côté serveur. Le paiement reste explicitement hors de ce sprint.
