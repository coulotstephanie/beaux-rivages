# Beaux Rivages Revenue & Marketing Engine

## Périmètre V1

Le module réunit dans le Back Office :

- CRM voyageurs enrichi et historique commercial ;
- niveaux de fidélité Découverte, Insulaire, Grand Large et Ambassadeur ;
- cartes cadeaux sécurisées avec code unique, jeton QR haché, expiration et solde ;
- codes privilèges conditionnés par canal, durée, saison, maison et fidélité ;
- parrainage et historique des avantages ;
- catalogue « Personnalisez votre séjour » ;
- recommandations d’expériences selon le profil du séjour ;
- campagnes FR, EN et DE avec éditeur par blocs ;
- règles d’automatisation et demandes d’avis ;
- KPI, analyses et assistant commercial déterministe.

## Sécurité et activation

Toutes les écritures passent par `/api/admin/revenue`, protégé par le jeton administrateur, le contrôle d’origine et une limitation de débit. Les tables Supabase utilisent RLS. Les jetons de cartes cadeaux ne sont conservés que sous forme de hash.

La création d’une campagne ne déclenche aucun envoi. L’envoi réel nécessite :

- `EMAIL_PROVIDER` et `EMAIL_PROVIDER_API_KEY` ;
- `NEWSLETTER_PROVIDER` et `NEWSLETTER_API_KEY` ;
- une validation du consentement marketing et du double opt-in ;
- un worker ou une tâche planifiée authentifiée.

Les cartes cadeaux sont créées en base, mais leur vente en ligne nécessite le branchement du paiement Stripe et l’activation après webhook confirmé.

La variable `SUPABASE_SECRET_KEY` de Vercel doit contenir une vraie clé serveur Supabase. Une valeur factice ou une clé publique provoque volontairement un refus `Invalid API key`.

## Sources de vérité

- Supabase : voyageurs, réservations, fidélité, cartes, promotions, campagnes et avis.
- Moteur tarifaire : prix des nuitées et règles de séjour.
- Revenue Engine : segmentation, recommandations, KPI et règles commerciales.
- Guest Journey : messages transactionnels liés à la réservation.

## Exploitation

Le module se trouve dans **Administration → Revenue & Marketing**. Les campagnes restent en brouillon ou programmées tant qu’aucun fournisseur n’est activé.
