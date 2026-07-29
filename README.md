# Beaux Rivages — Version Candidate V1

Projet Next.js 15 regroupant les validations Beaux Rivages dans une seule base de production.

## Pages intégrées

- Accueil immersif
- Les trois maisons
- Destinations et expériences
- Carnet Beaux Rivages
- Avis voyageurs
- Parcours voyageur J-30 à après-séjour
- Personnalisez votre séjour
- Nos engagements
- Pourquoi nos voyageurs reviennent
- Les coulisses de Beaux Rivages
- Réservation directe
- Comparateur de maisons
- Mode Inspiration
- FAQ intelligente
- Pages détaillées des expériences
- Carte éditoriale et configurateur de séjour

## Identité

Le logo principal reprend le concept validé : B-vague, horizon et soleil. Le monogramme BR n’est plus utilisé comme logo principal.

## Lancer localement

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

La procédure détaillée se trouve dans
[`docs/engineering/INSTALLATION.md`](docs/engineering/INSTALLATION.md). Les
contributions suivent
[`docs/engineering/CONTRIBUTING.md`](docs/engineering/CONTRIBUTING.md).

## Validation avant livraison

```bash
npm run validate
npm run start -- --port 3100
SITE_URL=http://localhost:3100 npm run test:site
```

La première commande exécute lint, TypeScript strict, les tests d’intégrité et
le build de production. La seconde validation parcourt toutes les URLs internes
du site construit.

La préparation réelle est suivie dans
[`docs/PRODUCTION_READINESS_AUDIT_2026-07-29.md`](docs/PRODUCTION_READINESS_AUDIT_2026-07-29.md).
Tout déploiement suit le
[`Guide de déploiement`](docs/05_OPERATIONS/DeploymentGuide.md) et la
[`Checklist Go Live`](docs/05_OPERATIONS/GO_LIVE_CHECKLIST.md).

## Architecture de production

- `components/ui` contient les primitives du Design System.
- `features` accueille progressivement chaque domaine selon le gabarit Feature
  First, sans déplacement global de l’existant.
- `components/layouts`, `components/providers` et `components/states`
  centralisent les compositions et comportements transverses.
- `media/properties` contient un manifest typé par maison.
- `media/site.ts` est le registre des médias partagés et des destinations.
- `content/fr` constitue le point d’entrée éditorial français ; les futures
  langues doivent reprendre la même surface d’exports.
- `seo.ts`, `app/sitemap.ts` et `app/robots.ts` centralisent les fondations SEO.
- `platform` contient les contrats évolutifs du back-office, des calendriers,
  des réservations, des médias et de l’espace voyageur.
- `i18n` prépare les catalogues français, anglais et allemand.
- `docs` regroupe l’architecture, les conventions et la roadmap.

`lucide-react` est volontairement conservé comme bibliothèque d’icônes standard
pour les futurs composants du Design System. Son absence d’import actuel ne doit
pas être interprétée comme une autorisation de suppression.

Avant de retirer une dépendance, vérifier ses imports directs, ses usages
indirects, les composants prévus dans les sprints validés et son rôle documenté
dans cette architecture.

## À connecter avant mise en ligne commerciale

- moteur de réservation et synchronisation des disponibilités
- paiement sécurisé
- météo et marées en temps réel
- contenus définitifs du Carnet Île d’Oléron
- mentions légales et politique de confidentialité finales
