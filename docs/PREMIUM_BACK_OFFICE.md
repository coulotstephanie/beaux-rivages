# Back Office Premium Beaux Rivages

Le Back Office est accessible depuis `/administration`. Il centralise les réservations, voyageurs, logements, contrats, paiements, messages, demandes de conciergerie, ménage, maintenance, statistiques et intégrations.

## Modules

- **Aujourd’hui** : arrivées, départs, voyageurs présents, demandes, paiements, contrats, maintenance, notifications et horizon à sept jours.
- **Calendrier** : planning unifié par maison et origine, relié aux sources iCal existantes.
- **Réservations** : recherche, création manuelle, blocage de dates et changement de statut.
- **Voyageurs** : historique CRM synthétique.
- **Paiements** : transactions, soldes et cautions.
- **Messages** : Guest Journey Engine existant, sans duplication.
- **Conciergerie** : attentions, surprises, Packs Signature et demandes particulières.
- **Ménage** : check-lists interactives par maison.
- **Maintenance** : création, priorité, assignation et résolution des incidents.
- **Paramètres** : état des connexions et centre de notifications.

## Sécurité et données

Les écritures passent exclusivement par `/api/admin/operations`, qui impose une
session Supabase Auth et un rôle autorisé, une origine identique, la validation
Zod et un journal d’audit. Les tables opérationnelles disposent de RLS et de
politiques réservées aux rôles internes. Les montants sont stockés en centimes.

Migration : `20260729124500_premium_back_office.sql`.

## Exploitation

Configurer en production `SUPABASE_URL`, `SUPABASE_SECRET_KEY`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. La clé
serveur ne doit jamais être exposée au navigateur.

Le Back Office utilise exclusivement les comptes individuels Supabase Auth et
les rôles internes. Aucun secret administrateur partagé n’est accepté.

Après une évolution de schéma :

```bash
npm run db:push
npm run db:types
npm run validate
```

Les flux Airbnb, Booking et Abritel restent limités aux informations disponibles dans leurs calendriers iCal tant qu’une API partenaire n’est pas connectée.
