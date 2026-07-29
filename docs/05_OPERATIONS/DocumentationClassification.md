# Classification de la documentation opérationnelle

| Niveau | Contenu | Dépôt public |
| --- | --- | --- |
| Public | Principes généraux, architecture et responsabilités non sensibles | Autorisé |
| Interne | Processus de travail sans secret ni donnée personnelle | Interdit par défaut |
| Confidentiel | Accès, urgence, contacts privés, voyageurs, sécurité | Interdit |
| Secret | Identifiants, clés, mots de passe, codes actifs | Strictement interdit |

## Processus

1. Le propriétaire attribue une classification.
2. Les destinataires sont limités au besoin d’en connaître.
3. Toute extraction destinée au public est relue.
4. Les secrets sont stockés dans un gestionnaire de secrets, jamais dans un
   document.
5. Les accès et versions sont revus régulièrement.

