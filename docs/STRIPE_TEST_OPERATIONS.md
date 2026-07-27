# Stripe TEST — Beaux Rivages

## Garde-fous

- Seules les clés `sk_test_` sont acceptées pendant la recette.
- `STRIPE_ALLOW_LIVE=false` reste obligatoire.
- Aucun paiement n’est créé tant que `STRIPE_WEBHOOK_SECRET` n’est pas présent.
- Le montant est relu depuis Supabase : le navigateur et le lien voyageur ne
  peuvent pas imposer un montant.
- Chaque événement Stripe est réclamé une seule fois dans `payment_events`.
- Un événement en échec peut être rejoué par Stripe.
- Les remboursements sont réservés au Back Office et journalisés.

## Variables Vercel

| Variable | Valeur pendant la recette |
|---|---|
| `STRIPE_SECRET_KEY` | nouvelle clé `sk_test_…`, sensible |
| `STRIPE_WEBHOOK_SECRET` | secret `whsec_…` du webhook TEST, sensible |
| `STRIPE_ALLOW_LIVE` | `false` |
| `BOOKING_DEPOSIT_PERCENTAGE` | conservée pour compatibilité ; le montant contractuel de Supabase prévaut |

Toute modification de variable nécessite un nouveau déploiement Vercel.

## Webhook TEST

URL :

`https://www.beaux-rivages.com/api/payments/webhook`

Événements :

- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

La signature Stripe est vérifiée avant toute lecture de l’événement. Un webhook
sans signature ou avec une signature invalide reçoit HTTP 400.

## Cycle de paiement

1. L’espace voyageur demande un acompte, un solde ou un paiement intégral.
2. Le serveur relit la réservation et les paiements dans Supabase.
3. Une ligne `payments` en attente est créée.
4. Stripe Checkout est créé avec une clé d’idempotence.
5. Le webhook confirme ou refuse le paiement.
6. La réservation passe à `confirmed` dès que l’acompte contractuel est atteint.
7. Les événements et changements apparaissent dans le mode Pilotage.

## Cartes de recette Stripe

Utiliser uniquement les cartes officielles proposées par Stripe dans son
environnement de test :

- paiement accepté ;
- paiement refusé ;
- authentification 3-D Secure ;
- session expirée ;
- remboursement partiel et intégral.

Ne jamais tester avec une vraie carte bancaire.

## Passage en production

Interdit tant que tous les scénarios ne sont pas validés. Le passage LIVE exige
un jeu séparé de clés, un webhook LIVE distinct, une validation métier et
`STRIPE_ALLOW_LIVE=true` lors d’un déploiement explicitement approuvé.
