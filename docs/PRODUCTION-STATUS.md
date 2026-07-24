# Beaux Rivages — état de production

Date : 24 juillet 2026
Version : 1.0 RC locale

## Livré dans le code source

- Application Next.js 15 avec App Router
- Page d’accueil immersive
- Pages Le Chai des Tortues, Villa Raie Manta et Le Nid d’Été
- Carnet Beaux Rivages et recommandations locales
- Parcours de demande de réservation et personnalisation
- Pages avis, destinations, expériences, engagements, contact et mot de Stéphanie
- Sitemap, robots.txt dynamique et métadonnées globales
- Bibliothèque locale de photos et vidéos
- Documentation Vercel et variables d’environnement

## Contrôles effectués

- Arborescence et fichiers principaux présents
- Médias locaux présents
- Routes principales présentes
- Configuration Next.js, TypeScript et Vercel présente

## Contrôle encore bloqué dans l’environnement de travail

`npm install` ne termine pas, car le registre de paquets de l’environnement expire avant la fin du téléchargement. En conséquence, `npm run build` n’a pas encore pu être certifié ici.

## Prochaine porte de sortie

1. Ouvrir le dépôt sur Vercel ou sur un ordinateur avec Node.js 22.
2. Exécuter `npm install`.
3. Exécuter `npm run lint` puis `npm run build`.
4. Corriger les éventuelles erreurs remontées.
5. Déployer la Release Candidate.

## Limites fonctionnelles de la RC

- Le formulaire produit une demande de réservation, pas une réservation instantanée.
- Les disponibilités ne sont pas encore synchronisées avec Airbnb ou Booking.
- Aucun paiement en ligne n’est actif.
- Les données météo et marées ne sont pas encore connectées à une API en production.
