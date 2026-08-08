# Centre de Pilotage V4

## Décision

V4 est une plateforme modulaire, pas une accumulation d'écrans. Supabase reste
la source de vérité transactionnelle; Next.js fournit deux surfaces distinctes :
le site public, en lecture dynamique, et le Centre de Pilotage authentifié.

Les identifiants fonctionnels stables sont définis dans
`platform/admin/module-registry.ts`. Chaque module possède ses contrats, son
repository, ses routes, ses permissions et ses tests. Aucun module ne lit les
tables privées d'un autre module directement : il utilise un contrat ou un
événement documenté.

## Domaines

| Domaine      | Responsabilité                                       | Modules      |
| ------------ | ---------------------------------------------------- | ------------ |
| Identity     | sessions, rôles, MFA, journal de connexion           | utilisateurs |
| Content      | pages, maisons, blocs, médias, galeries, SEO, Carnet | contenus     |
| Distribution | disponibilités, tarifs, promotions, canaux           | calendrier   |
| Operations   | séjours, ménage, maintenance, conciergerie           | exploitation |
| Reputation   | avis et réponses                                     | avis         |
| Analytics    | acquisition, conversion, occupation et revenu        | statistiques |
| Platform     | réglages, liens, alertes, sauvegardes                | paramètres   |

## Règles invariantes

1. Une publication de contenu est une écriture en base et devient visible sans
   build ni déploiement.
2. Une mutation crée un audit append-only. Les entités éditoriales enregistrent
   en plus un instantané restaurable.
3. L'override journalier de prix est la priorité finale. Vacances scolaires,
   disponibilité et prix sont des couches distinctes et ne s'écrasent jamais.
4. Les connecteurs Airbnb et Booking consomment les événements du domaine de
   distribution. Un échec crée une alerte; il ne revient jamais silencieusement
   sur la valeur précédente.
5. Le rôle `editor` gère le contenu; `concierge` opère les séjours;
   `read_only` ne mute rien; `admin` configure la plateforme.

## Socle de données V4

La migration `20260810100000_pilotage_v4_cms_foundation.sql` introduit :

- `cms_pages` et `cms_blocks` pour composer toutes les pages et maisons ;
- un panneau SEO extensible en JSON validé par les contrats applicatifs ;
- `cms_media_assets`, `cms_galleries` et `cms_gallery_items` ;
- `cms_page_versions` pour restaurer un état complet ;
- `site_settings` et `managed_links` pour sortir les coordonnées et liens du code ;
- `cms_audit_log` pour la traçabilité transverse.

Les instantanés sont créés par `cms_capture_page_version` dans la même
transaction que la mutation. Ils englobent la page et ses blocs : des triggers
ligne par ligne produiraient des versions partielles.

## Livraison incrémentale

### Phase 1 — cockpit et distribution

Unifier le shell d'administration, finaliser les couches du calendrier, les
overrides de tarifs et promotions, les rôles, l'expiration de session et le
journal des connexions. Les capacités existantes sont migrées, pas réécrites.

### Phase 2 — CMS et médiathèque

Brancher le site public sur les pages dynamiques, puis livrer éditeurs de pages,
maisons, SEO, médias, galeries, vidéos, Carnet, coordonnées et liens. Prévoir un
import idempotent du contenu TypeScript actuel et un mode aperçu.

### Phase 3 — réputation et mesure

Connecter avis, Analytics et Search Console; ajouter alertes de qualité (lien
cassé, média ou texte ALT manquant) et widgets configurables du cockpit.

### Phase 4 — durcissement et autonomie

Activer MFA, scénarios de restauration, sauvegardes vérifiées, observabilité,
budgets de performance et procédures d'exploitation.

## Critère de sortie d'un module

Un module n'est livré que si ses permissions RLS, audit, restauration,
validation, états vide/erreur, tests et procédure opératrice sont présents. Une
intégration externe doit aussi exposer son état de synchronisation et sa reprise.
