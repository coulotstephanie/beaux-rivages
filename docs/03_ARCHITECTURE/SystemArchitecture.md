# System Architecture

Source canonique : [SYSTEM_ARCHITECTURE.md](../SYSTEM_ARCHITECTURE.md).  
État réel :
[SYSTEM_ARCHITECTURE_TRACEABILITY.md](../SYSTEM_ARCHITECTURE_TRACEABILITY.md).

Le domaine `features/carnet` ajoute une couche éditoriale Feature First :
validation Zod, recherche pure, repository Supabase et interface CMS. Les
fiches publiées sont séparées des brouillons par PostgreSQL RLS et chaque
modification crée une version immuable.
