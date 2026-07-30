# Reservations

## Rôle

Cette feature consolide le moteur de recherche de séjour existant sans le
réécrire. Elle orchestre :

- les calendriers et indisponibilités issus de `platform/calendar` ;
- les saisons, tarifs et durées de séjour de `platform/pricing` ;
- la validation des demandes avec Zod ;
- le calendrier responsive utilisé par le parcours `/reserver`.

## Structure

- `components/` : calendrier accessible ;
- `hooks/` : chargement annulable du calendrier ;
- `services/` : orchestration disponibilité + devis ;
- `repositories/` : contrats et adaptateurs vers les briques historiques ;
- `schemas/` : validation de la recherche ;
- `types/` : contrats publics ;
- `tests/` : règles de chevauchement et validation.

## Décisions

`ReservationEngineService` reçoit ses repositories par injection. Les
adaptateurs actuels conservent les services éprouvés afin de protéger les API,
les calendriers iCal, Supabase et le calcul saisonnier existants.

Une plage suit la convention `[arrivée, départ)` : un nouveau séjour peut
commencer le jour du départ du précédent. Le prix reste non contractuel jusqu’à
la création effective d’une réservation.

## Hors périmètre du Sprint 2

Paiement, contrat, création définitive d’une réservation, promotions nouvelles
et publication vers les plateformes.
