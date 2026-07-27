# Back Office Beaux Rivages

## Objectif

Le Back Office `/administration` est l’outil d’exploitation quotidien de Beaux
Rivages. Il lit et modifie les données Supabase uniquement par la couche métier
`platform/database`. Aucun composant React ne se connecte directement à la base.

## Rubriques

- **Aujourd’hui** : arrivées, départs, séjours en cours, demandes, paiements à
  suivre et contrats non signés.
- **Réservations** : recherche, planning à venir, ajout manuel, changement de
  statut, annulation et blocage de dates.
- **Voyageurs** : coordonnées, historique, nombre de nuits et présence
  d’animaux.
- **Logements** : état, occupation, répartition direct/plateformes et accès aux
  tarifs et calendriers.
- **Documents** : contrats, factures et état de signature.
- **Statistiques** : chiffre d’affaires direct, durée moyenne, part directe et
  occupation par logement.
- **Pilotage** : sources iCal, synchronisations, erreurs de paiement, e-mails,
  alertes et exports CSV.

## Sécurité

L’API `/api/admin/operations` impose :

1. le jeton `ADMIN_API_TOKEN` ;
2. une origine identique pour toute mutation ;
3. une limitation de débit ;
4. une validation Zod stricte ;
5. les contraintes anti-chevauchement PostgreSQL ;
6. une entrée dans `audit_logs` après chaque action ;
7. des réponses sans cache.

Le jeton saisi dans l’interface est conservé dans `sessionStorage`, jamais dans
une URL ou un stockage persistant. Cette protection est adaptée au pilotage
initial. Avant d’ajouter plusieurs collaborateurs, remplacer le jeton par
Supabase Auth et appliquer les rôles `admin`, `concierge` et `read_only` déjà
prévus en base.

## Données et limites

- Les revenus présentés sont ceux des réservations directes confirmées.
- iCal transmet les dates occupées, mais aucun prix Airbnb, Booking ou Abritel.
- Le taux d’occupation combine les réservations directes et les blocages iCal.
- Les préférences libres et demandes particulières restent dans le snapshot de
  devis en attendant un écran d’édition voyageur dédié.
- Les actions destructrices ne suppriment jamais une réservation : elles changent
  son statut en `cancelled` ou `declined`.

## Stripe TEST — étape suivante

L’adaptateur, les routes, les statuts de paiement, la journalisation et la
supervision existent. Pour activer les essais, une intervention humaine reste
nécessaire :

1. créer ou ouvrir le compte Stripe ;
2. fournir les clés **de test** dans Vercel ;
3. créer le webhook de test ;
4. exécuter les scénarios accepté, refusé, 3-D Secure, remboursement et
   expiration ;
5. valider la règle de génération du contrat après acompte ou paiement complet.

Aucune clé réelle ne doit être copiée dans Git et aucun paiement LIVE ne doit
être activé avant la validation complète de ces scénarios.
