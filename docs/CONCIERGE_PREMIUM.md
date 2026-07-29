# Concierge Premium

L’espace `/personnaliser` présente les expériences Beaux Rivages en français, anglais et allemand. Le catalogue, les tarifs et les demandes proviennent de Supabase.

Le voyageur compose un panier, saisit la référence et l’e-mail de sa réservation, puis transmet sa demande. Le serveur vérifie cette identité, recharge les prix depuis le catalogue et crée la commande et ses lignes. Stéphanie confirme ensuite la disponibilité depuis le Back Office avant paiement. Ce fonctionnement évite tout débit pour une expérience non disponible.

Les demandes spéciales couvrent anniversaires, mariages, demandes en mariage, bébés, surprises, allergies et régimes alimentaires. Une notification interne est produite pour chaque nouvelle demande.

## Paiement

`concierge_orders.payment_id` relie la commande au moteur Stripe existant. Les statuts `payment_pending` puis `paid` préparent la confirmation et la facture sans dupliquer le cycle de paiement. Le paiement ne doit être déclenché qu’après validation interne des expériences soumises à disponibilité.

## Administration

La rubrique **Conciergerie** affiche les commandes et demandes spéciales, permet de les confirmer, refuser, préparer et clôturer. Le catalogue est stocké dans `concierge_categories` et `concierge_experiences`; les rôles `admin` et `concierge` peuvent le gérer sous RLS.

## Données personnelles

Le panier reste local jusqu’à sa transmission. L’identité est vérifiée côté serveur et aucun historique privé n’est conservé dans le navigateur. Les écritures sont limitées, validées par Zod et protégées contre les requêtes d’origine tierce.
