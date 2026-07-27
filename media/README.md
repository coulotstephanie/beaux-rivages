# Médiathèque Beaux Rivages

`media.json` est le catalogue éditorial commun. Les fichiers physiques restent rangés dans `public/images/properties`, `public/images/destination`, `public/brand` et `public/videos` afin de préserver les URLs publiques.

Le moteur `pickMedia()` filtre par maison, émotion, saison, type et tags, puis classe les résultats par priorité. Toute nouvelle ressource publiée doit recevoir une fiche avant utilisation dynamique.

