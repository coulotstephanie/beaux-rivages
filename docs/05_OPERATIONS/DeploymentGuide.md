# Guide de déploiement

Utiliser trois projets isolés : local, préproduction et production. Ne jamais
partager clés Supabase, Stripe, cookies ou webhooks entre eux.

## Preview

1. partir d’une Pull Request approuvée ;
2. exécuter `npm ci` puis `npm run validate` ;
3. vérifier qu’aucun secret n’est commité ;
4. déployer la Preview Vercel ;
5. lancer `SITE_URL=<preview> npm run test:site`.

## Préproduction

1. sauvegarder la base cible ;
2. examiner migrations et rollbacks ;
3. lancer `supabase db push --linked` avec le projet explicitement lié ;
4. lancer `supabase test db` et la recette applicative ;
5. vérifier `/api/health`, journaux, alertes et webhooks TEST ;
6. faire signer la recette responsive, accessibilité et métier.

## Production

1. obtenir l’approbation Go Live ;
2. confirmer sauvegarde et point de restauration ;
3. appliquer les migrations avant le trafic dépendant du schéma ;
4. déployer exactement le commit validé ;
5. vérifier accueil, réservation, authentification, santé et journaux ;
6. surveiller erreurs, latence et base pendant au moins 30 minutes.

Un rollback applicatif redéploie le dernier commit sain. Une migration n’est
annulée qu’après vérification de son script et des données déjà écrites.
