# Chai calendar source audit — 2026-08-14

Read-only public-calendar diagnostic before correction:

- Chai live Airbnb source exposed `2026-08-28` → `2026-09-01`.
- The same interval existed in the Chai Supabase fallback snapshot.
- The validated reference calendar assigns Laura Hurter (`2026-08-29` → `2026-08-31`) to Le Nid d’Été.
- The Chai’s validated Airbnb reservation Angéline Burlet remains `2026-08-22` → `2026-08-28`.
- Property slug routing and the six Airbnb/Booking environment-variable names were distinct in code.

The correction is scoped to the exact Chai/Airbnb interval. No external calendar or reservation is changed.
