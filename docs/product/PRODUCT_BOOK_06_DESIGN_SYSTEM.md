# Beaux Rivages — Design System

Version : 1.0  
Auteur : Product Design & Front-end Architecture  
Statut : document de référence

## 1. Objet

Ce document définit le langage visuel et interactif de Beaux Rivages : tokens, composants, compositions, responsive, animations et accessibilité.

Il complète la [Spécification UX](PRODUCT_BOOK_02_UX.md). Le Design System garantit une expérience homogène entre le site public, la réservation, l’espace voyageur, le Concierge et le Back Office.

## 2. Statuts

- **DÉPLOYÉ** : disponible dans le code ;
- **PARTIEL** : présent mais incomplet ou non généralisé ;
- **CIBLE** : composant ou règle à industrialiser ;
- **INTERDIT** : usage à ne pas introduire.

## 3. Principes

| Référence | Règle |
|---|---|
| DS-001 | L’élégance vient de la hiérarchie, de l’espace, de la lumière et de la qualité des images, jamais d’une accumulation d’effets. |
| DS-002 | Un même besoin possède un même composant et les mêmes états. |
| DS-003 | Les interfaces publiques sont émotionnelles ; les interfaces opérationnelles privilégient clarté et rapidité. |
| DS-004 | La marque reste reconnaissable dans les deux contextes. |
| DS-005 | Toute interaction fonctionne au clavier, au toucher et avec une technologie d’assistance. |
| DS-006 | Responsive et états d’erreur font partie du composant, pas d’une correction ultérieure. |
| DS-007 | Une animation accompagne la compréhension et respecte les préférences système. |
| DS-008 | Les tokens portent une intention sémantique, pas uniquement une valeur visuelle. |

## 4. Fondations de marque

### Ton

- premium sans ostentation ;
- chaleureux sans folklore ;
- calme sans lenteur imposée ;
- éditorial sans sacrifier la lisibilité ;
- humain, précis et accueillant.

### Signature visuelle

- grands espaces respirants ;
- photographie authentique et immersive ;
- bleu profond pour l’ancrage ;
- tons sable et coquillage pour la chaleur ;
- or discret pour les repères premium ;
- titres éditoriaux à fort contraste de taille ;
- formes arrondies maîtrisées ;
- ombres légères.

## 5. Tokens de couleur

### Tokens déployés

| Token | Valeur | Usage actuel |
|---|---|---|
| `--ink` | `#102b35` | texte principal |
| `--deep` | `#0a2733` | fonds profonds et actions |
| `--sand` | `#eee7dc` | surface sable |
| `--shell` | `#fbfaf7` | fond principal |
| `--accent` | `#ad7650` | accent chaud |
| `--gold` | `#b59463` | détail premium |
| `--gold-text` | `#755d3c` | or lisible sur fond clair |
| `--line` | `rgba(16,43,53,.14)` | séparateurs |

### Tokens sémantiques cibles

```css
:root {
  --color-bg-page: var(--shell);
  --color-bg-subtle: var(--sand);
  --color-bg-inverse: var(--deep);
  --color-text-primary: var(--ink);
  --color-text-secondary: #52666d;
  --color-text-inverse: #ffffff;
  --color-border-default: var(--line);
  --color-action-primary: var(--deep);
  --color-action-accent: var(--gold-text);
  --color-focus: var(--gold);
  --color-success: #2f6d59;
  --color-warning: #8a641f;
  --color-danger: #9a3d38;
  --color-info: #315f77;
}
```

Règles :

- ne jamais utiliser la couleur seule pour transmettre un état ;
- le texte or utilise `--gold-text` sur fond clair ;
- le blanc sur photo exige un voile assurant le contraste ;
- succès, alerte et erreur disposent d’une icône et d’un libellé ;
- tout nouveau couple texte/fond respecte WCAG AA.

## 6. Typographie

### Familles actuelles

- titres : Georgia, serif de repli ;
- identité : Optima / Avenir Next et repli sans-serif ;
- interface et corps : Arial / Helvetica et repli sans-serif.

### Cible

Définir trois rôles :

- `--font-display` : titres éditoriaux ;
- `--font-brand` : identité et signatures ;
- `--font-body` : lecture et interface.

Les polices web futures sont :

- auto-hébergées ;
- sous licence vérifiée ;
- chargées en WOFF2 ;
- limitées aux graisses réellement utilisées ;
- configurées par `next/font`.

### Échelle

| Rôle | Taille cible |
|---|---|
| Display XL | `clamp(3.6rem, 8vw, 7rem)` |
| Display L | `clamp(2.9rem, 6vw, 5rem)` |
| Titre section | `clamp(2.3rem, 4.5vw, 4rem)` |
| Titre carte | `clamp(1.5rem, 2vw, 2.2rem)` |
| Corps large | `1.125rem` |
| Corps | `1rem` |
| Petit | `.875rem` |
| Légende | `.75rem` |

Règles :

- corps minimum 16 px sur mobile ;
- interligne de lecture entre 1.5 et 1.85 ;
- largeur optimale 60 à 75 caractères ;
- capitales réservées aux libellés courts ;
- `text-wrap: balance` pour titres, `pretty` pour paragraphes ;
- aucun texte essentiel intégré à une image.

## 7. Espacement

Échelle cible sur base 4 px :

| Token | Valeur |
|---|---:|
| `--space-1` | 4 px |
| `--space-2` | 8 px |
| `--space-3` | 12 px |
| `--space-4` | 16 px |
| `--space-5` | 24 px |
| `--space-6` | 32 px |
| `--space-7` | 48 px |
| `--space-8` | 64 px |
| `--space-9` | 96 px |
| `--space-10` | 128 px |

Les espacements fluides utilisent `clamp()` entre tokens. Une page ne crée pas sa propre échelle.

## 8. Rayons, ombres et mouvements

### Déployé

| Token | Valeur |
|---|---|
| `--radius-sm` | 12 px |
| `--radius-md` | 24 px |
| `--radius-lg` | 40 px |
| `--shadow-soft` | ombre diffuse premium |
| `--transition` | 300 ms, courbe douce |

### Cible

- `--radius-pill: 999px` pour boutons et filtres ;
- `--shadow-overlay` pour menus et dialogues ;
- `--duration-fast: 150ms` ;
- `--duration-normal: 300ms` ;
- `--duration-slow: 600ms` ;
- `--ease-standard` et `--ease-emphasized`.

Une ombre ne remplace jamais un contour requis pour percevoir une limite.

## 9. Mise en page

### Conteneurs déployés

| Variante | Largeur |
|---|---|
| `default` | 1 200 px maximum |
| `wide` | 1 360 px maximum |
| `narrow` | 860 px maximum |

Les marges latérales actuelles sont de 24 à 32 px selon la variante.

### Grille cible

- desktop : 12 colonnes ;
- tablette : 8 colonnes ;
- mobile : 4 colonnes ;
- gouttières fluides ;
- alignement des sections sur les mêmes lignes guides ;
- pleine largeur réservée aux héros, films, cartes et galeries.

## 10. Breakpoints

Le CSS actuel contient de nombreux seuils proches entre 540 et 1 050 px.

**Écart DS-RWD-01 :** cette dispersion complique la maintenance.

Breakpoints cibles :

| Nom | Seuil indicatif |
|---|---:|
| `sm` | 640 px |
| `md` | 768 px |
| `lg` | 1 024 px |
| `xl` | 1 280 px |
| `2xl` | 1 440 px |

Les composants privilégient leur espace disponible plutôt que le modèle d’appareil. Les container queries peuvent compléter les breakpoints globaux.

## 11. Primitives UI déployées

### `Button`

Variantes : `primary`, `secondary`, `ghost`.

Comportements :

- liens internes avec Next Link ;
- ancres, téléphone et e-mail en lien natif ;
- liens externes dans un nouvel onglet avec protection ;
- hauteur minimale actuelle de 52 px ;
- libellé ou `ariaLabel` explicite.

Cible :

- prendre en charge `<button>` et états `disabled`, `loading`, icône seule ;
- tailles `sm`, `md`, `lg` ;
- ne pas traduire une action en lien lorsque son effet est une mutation.

### `Card`

Variantes : `default`, `glass`, `dark`.

Règles :

- élément sémantique configurable ;
- la carte entière n’est cliquable que si elle représente une destination unique ;
- pas de liens interactifs imbriqués ;
- le verre reste lisible sans support de `backdrop-filter`.

### `Container`

Variantes : `default`, `wide`, `narrow`.

Règle : aucune largeur de page concurrente ne doit être recréée localement.

### `Section`

Tons : `light`, `sand`, `dark`.

Règles :

- espacement vertical cohérent ;
- possibilité de conteneur intégré ;
- chaque section possède un titre accessible lorsque nécessaire.

### `Heading`

Options : eyebrow, titre, description, alignement, version claire et niveau `h1..h3`.

Règles :

- le niveau traduit la structure du document, pas la taille visuelle ;
- une page comporte un seul `h1` principal ;
- `id` stable pour les ancres.

### `Badge`

Variantes claire et sombre.

Usage : catégorie, statut court ou repère éditorial. Un badge non interactif ne ressemble pas à un bouton.

### `Divider`

Séparateur décoratif masqué aux technologies d’assistance.

## 12. Composants à industrialiser

| Composant | États obligatoires |
|---|---|
| `IconButton` | normal, hover, focus, pressed, disabled |
| `Input` | vide, rempli, focus, erreur, disabled, readonly |
| `Textarea` | mêmes états et compteur optionnel |
| `Select` | clavier, recherche éventuelle, erreur |
| `Checkbox` | checked, mixed, disabled, erreur |
| `RadioGroup` | sélection unique et navigation fléchée |
| `Switch` | état explicite, jamais pour une action immédiate |
| `Field` | label, aide, erreur et association ARIA |
| `FormSummary` | synthèse d’erreurs avec liens vers champs |
| `Dialog` | focus piégé, fermeture et restauration |
| `Drawer` | tactile, responsive et accessible |
| `Popover` | positionnement, Échap et clic extérieur |
| `Tabs` | rôles ARIA et navigation clavier |
| `Accordion` | état annoncé et bouton réel |
| `Toast` | information non bloquante annoncée |
| `Alert` | info, succès, avertissement, erreur |
| `Skeleton` | taille stable, masqué aux lecteurs |
| `Spinner` | libellé accessible |
| `EmptyState` | raison et prochaine action |
| `Table` | titres, tri, responsive et pagination |
| `DataList` | alternative mobile à la table |
| `Calendar` | clavier, dates indisponibles et plage |
| `Chart` | résumé textuel et données tabulaires |
| `Pagination` | curseurs et état courant |
| `Breadcrumb` | navigation hiérarchique |

## 13. Formulaires

Structure :

1. label visible ;
2. contrôle ;
3. aide éventuelle ;
4. erreur reliée par `aria-describedby`.

Règles :

- pas de placeholder comme seul label ;
- champs obligatoires indiqués en texte ;
- validation au moment utile, sans agressivité ;
- aucune saisie perdue après erreur ;
- erreur en langage humain et actionnable ;
- synthèse en tête pour les formulaires longs ;
- focus sur la synthèse après échec de soumission ;
- format attendu expliqué avant saisie ;
- clavier mobile adapté avec `inputMode` et `autocomplete`.

## 14. Boutons et actions

Hiérarchie :

- primaire : prochaine action principale ;
- secondaire : alternative ;
- ghost : navigation éditoriale ;
- danger : action destructive confirmée.

Règles :

- une seule action primaire dominante par zone ;
- surface tactile minimale 44 × 44 px ;
- verbes précis : « Confirmer la réservation », pas « OK » ;
- chargement remplace le libellé sans changer brutalement la largeur ;
- action destructive avec cible et conséquence ;
- double soumission empêchée.

## 15. Navigation

### En-tête

- logo vers l’accueil ;
- état courant ;
- menu utilisable au clavier ;
- menu mobile avec focus contrôlé ;
- fermeture par Échap ;
- aucune disparition d’action lors du zoom.

### Navigation Back Office

- sections stables ;
- compteur seulement s’il est actionnable ;
- priorité du jour visible ;
- menu latéral repliable sans perdre les libellés accessibles ;
- navigation mobile en drawer.

## 16. Dialogues, lightboxes et overlays

- nom accessible ;
- focus initial pertinent ;
- focus contenu dans l’overlay ;
- Échap ferme sauf opération critique en cours ;
- fermeture explicite ;
- arrière-plan non interactif ;
- focus restauré au déclencheur ;
- défilement arrière bloqué ;
- lightbox utilisable avec flèches, swipe et boutons ;
- compteur et texte alternatif disponibles.

Les composants `ImageLightbox` et galeries constituent une base déployée, à rapprocher d’une primitive Dialog partagée.

## 17. Images et vidéos

### Images

- `next/image` ;
- dimensions ou conteneur stable ;
- `sizes` adapté ;
- priorité uniquement au média LCP ;
- texte alternatif utile pour une image informative ;
- `alt=""` pour un décor ;
- légende distincte de l’alternative ;
- crédit et licence conservés ;
- photo du logement utilisée pour représenter une maison.

### Vidéos

- poster ;
- son coupé par défaut ;
- contrôle lecture/pause et son ;
- sous-titres lorsque parole ;
- aucune lecture forcée si économie de données ou mouvement réduit ;
- alternative statique ;
- pas de vidéo essentielle sans transcription.

## 18. Son

- aucun son automatique ;
- activation explicite ;
- bouton permettant arrêt immédiat ;
- état annoncé par `aria-pressed` ;
- volume modéré ;
- piste et licence documentées ;
- arrêt lors du démontage ;
- erreur de lecture récupérable ;
- aucune musique essentielle à la compréhension.

## 19. Animation

Usages admis :

- transition d’état ;
- apparition légère ;
- retour de confirmation ;
- déplacement guidant la continuité ;
- parallaxe très légère sur contenu décoratif.

Usages interdits :

- animation permanente attirant l’attention ;
- déplacement empêchant la lecture ;
- parallaxe forte ;
- transition longue sur une tâche urgente ;
- information transmise uniquement par mouvement.

Avec `prefers-reduced-motion: reduce` :

- parallaxe supprimée ;
- zoom décoratif supprimé ;
- défilement instantané ou discret ;
- transitions non essentielles désactivées.

## 20. États communs

Tout composant de données prévoit :

| État | Présentation |
|---|---|
| chargement initial | skeleton stable |
| action en cours | contrôle désactivé et libellé |
| vide | explication et action utile |
| erreur récupérable | message et réessai |
| erreur bloquante | conséquence et contact |
| succès | confirmation locale et annoncée |
| hors ligne | données disponibles et actions différées distinguées |
| accès refusé | aucune fuite de donnée |
| conflit | choix de recharger ou résoudre |

## 21. Responsive public

### Mobile

- contenu prioritaire en premier ;
- une colonne par défaut ;
- navigation et récapitulatifs repliables ;
- action principale accessible sans masquer le contenu ;
- galeries en défilement tactile ;
- formulaires sans zoom forcé ;
- cartes sans hauteur artificielle excessive.

### Tablette

- grilles de deux colonnes lorsque lisibles ;
- touch targets conservés ;
- aucun comportement dépendant du hover.

### Desktop

- largeur de lecture limitée ;
- composition éditoriale asymétrique possible ;
- hover comme enrichissement, jamais comme seul accès.

## 22. Responsive Back Office

- desktop : tables, calendrier large et panneaux latéraux ;
- tablette : colonnes simplifiées et drawer de détail ;
- mobile : cartes opérationnelles, actions prioritaires et saisie à une main ;
- tables avec alternative condensée ;
- colonnes secondaires masquées avec accès au détail ;
- barre d’action collante uniquement si elle ne couvre pas les champs.

## 23. Accessibilité WCAG AA

### Obligatoire

- structure sémantique ;
- lien d’évitement ;
- ordre de titres ;
- focus visible ;
- navigation clavier complète ;
- contrastes AA ;
- zoom à 200 % sans perte ;
- reflow à 320 px ;
- alternatives textuelles ;
- labels et erreurs reliés ;
- statuts annoncés ;
- langue de page et changements de langue ;
- contrôle du temps ;
- réduction du mouvement.

### Déployé

- lien « Aller au contenu principal » ;
- focus global visible ;
- lightbox clavier ;
- préférences de mouvement partiellement prises en compte ;
- libellés accessibles sur plusieurs contrôles médias.

### À renforcer

- audits automatisés axe sur toutes les routes ;
- tests clavier des modules admin ;
- contrastes vérifiés par token ;
- annonces live homogènes ;
- Dialog partagé ;
- graphiques avec équivalent tabulaire.

## 24. Internationalisation

- aucun texte métier concaténé lorsque l’ordre grammatical varie ;
- labels assez flexibles pour l’allemand ;
- pas de largeur fixe dépendant du français ;
- nombres, devises, dates et heures formatés par locale ;
- attribut `lang` sur les passages étrangers ;
- icônes non dépendantes d’un sens culturel ambigu ;
- mise en page prête pour une extension future, sans promesse RTL immédiate.

## 25. Contenu

- titres courts et évocateurs sur le public ;
- actions explicites ;
- aucune vente agressive ;
- « expérience » ou « attention » lorsque justifié ;
- conditions visibles avant paiement ;
- erreurs sans jargon technique ;
- dates absolues lorsque le relatif peut être ambigu ;
- prix avec unité.

## 26. Architecture CSS

Cible :

```text
styles/
  tokens.css
  reset.css
  typography.css
  utilities.css
components/ui/
  Button/
  Field/
  Dialog/
  ...
features/
  <feature>/components/
```

Règles :

- tokens globaux ;
- styles de primitive proches du composant ;
- variantes typées ;
- aucune répétition massive de classes ;
- aucune règle globale dépendant d’un ordre DOM fragile ;
- nommage stable ;
- suppression des styles morts vérifiée.

**Écart DS-CSS-01 :** `app/globals.css` concentre actuellement une grande partie des styles et de nombreux breakpoints. Une extraction progressive est requise, sans réécriture globale risquée.

## 27. API des composants

- props minimales et sémantiques ;
- `className` autorisé comme extension, pas comme remplacement des variantes ;
- événements nommés `on<Action>` ;
- composants contrôlés pour les formulaires complexes ;
- `forwardRef` lorsque le focus doit être piloté ;
- attributs HTML natifs transmis ;
- types exportés lorsque consommés hors du module ;
- pas de `any` ;
- composition plutôt que nombreuses options booléennes.

## 28. Tests

Chaque primitive couvre :

- rendu ;
- variantes ;
- clavier ;
- focus ;
- nom et rôle accessibles ;
- états disabled/loading/error ;
- interaction ;
- responsive critique ;
- mouvement réduit.

Outils cibles :

- tests unitaires React ;
- Testing Library ;
- axe ;
- Playwright pour parcours ;
- snapshots visuels ciblés ;
- Lighthouse CI.

Les snapshots ne remplacent pas les assertions de comportement.

## 29. Documentation et gouvernance

Chaque composant documente :

- objectif ;
- variantes ;
- props ;
- états ;
- exemples recommandés ;
- contre-exemples ;
- accessibilité ;
- responsive ;
- statut de stabilité.

Une Storybook ou documentation équivalente est une cible. Les composants expérimentaux sont identifiés et ne deviennent stables qu’après usage dans au moins deux contextes pertinents.

## 30. Registre des écarts

| Référence | Priorité | Écart |
|---|---|---|
| DS-GAP-001 | haute | primitives de formulaire et Dialog manquants |
| DS-GAP-002 | haute | authentification et interfaces admin utilisent encore des composants très spécifiques |
| DS-GAP-003 | haute | CSS global volumineux |
| DS-GAP-004 | moyenne | breakpoints trop nombreux |
| DS-GAP-005 | haute | tests accessibilité automatisés incomplets |
| DS-GAP-006 | moyenne | tokens sémantiques incomplets |
| DS-GAP-007 | moyenne | typographie non centralisée par rôles |
| DS-GAP-008 | moyenne | Storybook absent |
| DS-GAP-009 | haute | états loading/error/empty non mutualisés |
| DS-GAP-010 | moyenne | graphiques sans primitive accessible commune |

## 31. Définition de terminé

Un composant est terminé lorsque :

- il répond à un besoin réutilisable ;
- son API est typée et documentée ;
- ses variantes utilisent les tokens ;
- tous ses états sont présents ;
- clavier, focus et lecteur d’écran sont vérifiés ;
- il fonctionne de 320 px au desktop ;
- mouvement réduit et contraste sont contrôlés ;
- ses tests passent ;
- il ne duplique pas une primitive existante ;
- son adoption et sa dépréciation éventuelle sont documentées.
