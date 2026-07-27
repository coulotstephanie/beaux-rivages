# Préparation à l’exploitation commerciale

## Installation

```bash
npm ci
cp .env.example .env.local
npm run validate
```

Ne jamais renseigner une clé réelle dans Git. Les secrets de production sont
configurés dans Vercel et les fichiers `.env*` locaux restent ignorés.

## Parcours préparé

1. consultation d’une maison ;
2. synchronisation des calendriers Airbnb et Booking ;
3. choix de dates disponibles ;
4. calcul journalier du prix, frais, options et promotions ;
5. vérification finale via `/api/quote` ;
6. création future de la réservation persistée ;
7. génération du contrat HTML/PDF ;
8. acompte, paiement intégral ou solde via Stripe Checkout ;
9. espace sécurisé « Mon Séjour » ;
10. emails transactionnels et suivi du séjour.

La réservation persistée n’est pas encore activée : une base de données et un
`ReservationRepository` transactionnel sont obligatoires avant d’accepter un
paiement.

## Stripe

Variables : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`STRIPE_ALLOW_LIVE` et `BOOKING_DEPOSIT_PERCENTAGE`.

Utiliser d’abord une clé `sk_test_`. Une clé `sk_live_` est refusée tant que
`STRIPE_ALLOW_LIVE` n’est pas explicitement égal à `true`.

Routes :

- `POST /api/payments/checkout` ;
- `POST /api/payments/webhook`.

Le webhook est vérifié avec la signature Stripe. Le futur
`PaymentRepository` assurera l’idempotence, la mise à jour de l’acompte et du
solde, ainsi que le suivi des remboursements.

## Signature électronique

`ElectronicSignatureProvider` définit l’envoi, le suivi et le téléchargement
du document signé. Variables : `SIGNATURE_PROVIDER`, `SIGNATURE_API_KEY` et
`SIGNATURE_WEBHOOK_SECRET`. Yousign ou DocuSign pourra être ajouté sans
modifier le contrat.

## Emails

`TransactionalEmailProvider` accepte Resend, SendGrid ou Brevo via
`EMAIL_PROVIDER` et `EMAIL_PROVIDER_API_KEY`. Modèles disponibles :

- confirmation ;
- acompte reçu ;
- paiement complet ;
- contrat disponible ;
- pré-arrivée ;
- arrivée ;
- pendant le séjour ;
- départ ;
- remerciement.

## Mesure et conversions

- GA4 : `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Search Console : `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- Google Ads : `NEXT_PUBLIC_GOOGLE_ADS_ID`.
- Meta Pixel : `NEXT_PUBLIC_META_PIXEL_ID`.

La couche d’événements émet : `page_view`, `view_property`,
`search_availability`, `booking_started`, `booking_completed`,
`contact_click`, `phone_click` et `email_click`. Aucun script tiers n’est chargé
sans identifiant configuré. Google Ads et Meta devront en plus être conditionnés
au consentement du visiteur avant activation.

## Newsletter

Variables : `NEWSLETTER_PROVIDER` et `NEWSLETTER_API_KEY`. Le contrat
`NewsletterProvider` prévoit Brevo ou Mailchimp, double opt-in et
désinscription. L’API refuse toute inscription sans consentement explicite et
ne journalise qu’un hash de l’adresse.

## Actions manuelles obligatoires

- choisir et provisionner la base de données ;
- confirmer les tarifs et taxes de séjour ;
- valider juridiquement le contrat et ses annexes ;
- configurer Stripe en test, puis effectuer les scénarios 3-D Secure,
  remboursement et webhooks ;
- choisir Yousign/DocuSign et le prestataire d’emails ;
- configurer la newsletter et son registre de consentement ;
- valider le domaine dans Search Console ;
- mettre en place une plateforme de consentement avant Ads ou Meta ;
- effectuer une recette comptable, RGPD et sécurité avant d’activer les
  paiements réels.
