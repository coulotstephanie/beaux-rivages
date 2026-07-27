# Déploiement — Beaux Rivages V1 Candidate

## Prérequis

- Node.js 20 ou 22 LTS
- installation reproductible avec `npm ci`
- domaine canonique configuré sur `https://www.beaux-rivages.com`
- hébergement compatible Next.js 15

## Commandes

```bash
npm ci
npm run validate
npm run start
```

La sortie `.next` doit être construite sur la plateforme cible. Le projet
n’utilise actuellement aucune variable d’environnement obligatoire.

## Contrôles après mise en ligne

- vérifier `/robots.txt` et `/sitemap.xml`
- vérifier les canonicals en production
- tester une demande de réservation sur mobile et ordinateur
- vérifier les liens `mailto:` et `tel:`
- confirmer la lecture du film d’accueil sur Safari iOS et Chrome Android
- contrôler les en-têtes de sécurité et de cache
- soumettre le sitemap aux outils pour webmasters

## Validations humaines avant ouverture commerciale

- mentions légales, CGV et politique de confidentialité
- tarifs, options et conditions d’annulation
- méthode de calcul des statistiques voyageurs
- droits de diffusion de chaque photographie et vidéo
- destinataire final des demandes de réservation
