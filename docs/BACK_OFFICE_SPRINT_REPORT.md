# Rapport — Back Office Beaux Rivages

## Livré

- tableau de bord opérationnel du jour ;
- recherche et gestion du cycle de vie des réservations ;
- ajout manuel avec détection de conflit ;
- blocage manuel de dates ;
- historique et indicateurs voyageurs ;
- vue logements, occupation et revenus directs ;
- centre contrats/factures ;
- statistiques directes et répartition des nuits ;
- mode pilotage iCal, e-mails, paiements et alertes ;
- exports CSV protégés ;
- interface responsive mobile, tablette et desktop.

## Architecture

- `components/AdminDashboard.tsx` : interface et parcours administrateur ;
- `platform/admin/contracts.ts` : contrats typés du Back Office ;
- `platform/database/back-office.ts` : agrégation et commandes Supabase ;
- `app/api/admin/operations/route.ts` : API de lecture et de mutation ;
- `platform/database/schemas.ts` : validation Zod des commandes ;
- `docs/BACK_OFFICE.md` : guide d’exploitation et sécurité.

## Protections

- authentification administrative requise ;
- secret conservé uniquement pendant la session navigateur ;
- validation stricte et limitation des requêtes ;
- contrôle Same-Origin sur les mutations ;
- journal d’audit ;
- blocage des doubles réservations par PostgreSQL ;
- aucun paiement Stripe LIVE.

## Intervention humaine restante

- création des utilisateurs Supabase Auth et attribution des rôles si plusieurs
  personnes doivent accéder à l’outil ;
- clés Stripe TEST et webhook Stripe TEST ;
- validation juridique des contrats ;
- connexion Yousign et Resend.
