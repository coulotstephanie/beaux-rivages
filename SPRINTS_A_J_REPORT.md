# Sprints A à J — Rapport de fondations

## Livré

### A — Back-office

- snapshot de contenu unifié et versionné ;
- contrats pour propriétés, recommandations, expériences, tarifs, FAQ,
  actualités et médias ;
- dépôt de contenu injectable ;
- service d’administration avec rôles et contrôle des suppressions.

L’interface `/admin` n’est pas exposée avant authentification et stockage
writable, afin d’éviter un faux back-office non sécurisé.

### B — Calendriers

- contrat fournisseur indépendant ;
- parseur iCal ;
- normalisation, tri, déduplication et exclusion des annulations ;
- documentation des protections SSRF, timeout et fraîcheur.

### C — Réservation

- parcours existant conservé ;
- contrats de réservation, statuts et persistance ;
- passerelle de paiement future découplée.

### D — Espace voyageur

- modèle typé pour réservations, arrivée, guides, recommandations, documents et
  expériences sélectionnées.

### E — Médias

- catalogue administrable avec propriété, destination, saison, type, tags,
  crédit et état des droits ;
- fonction de recherche et filtres combinables.

### F — Internationalisation

- locales cibles FR, EN et DE ;
- catalogues typés initiaux ;
- français seul marqué comme prêt pour la production ;
- stratégie d’URLs et de migration documentée.

### G — Core Web Vitals

- architecture serveur conservée par défaut ;
- composants clients limités aux interactions ;
- stratégie images, cache, reduced-motion et bundles maintenue ;
- mesure Lighthouse finale réservée à l’URL réellement déployée.

### H — GitHub et Vercel

- `.gitignore`, `.env.example`, `.nvmrc`, `vercel.json` ;
- pipeline GitHub Actions avec `npm ci` et validation complète ;
- aucun secret renseigné dans les fichiers versionnables.

Le dossier fourni ne contient pas encore de métadonnées `.git` : la création du
dépôt et la connexion GitHub restent des opérations externes.

### I — Documentation

- architecture ;
- back-office ;
- calendriers et réservation ;
- i18n ;
- guide développeur ;
- roadmap ;
- déploiement.

### J — Audit externe

L’audit indépendant identifie comme frein principal l’absence de disponibilité
temps réel et de persistance de la demande, avant les questions de présentation.
Il est disponible dans `docs/INDEPENDENT_CONVERSION_AUDIT.md`.

## Validation

- lint : OK
- TypeScript strict : OK
- tests : 16/16
- build : OK
- crawl : 67 URLs internes

## Prochaine décision structurante

Choisir ensemble l’authentification, PostgreSQL et le stockage média. Cette
décision permettra d’ouvrir le back-office et l’espace voyageur sans créer une
seconde architecture provisoire.
