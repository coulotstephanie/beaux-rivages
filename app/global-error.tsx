"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body>
        <main
          style={{
            maxWidth: 720,
            margin: "10vh auto",
            padding: 24,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <p>Beaux Rivages</p>
          <h1>Le site rencontre un imprévu.</h1>
          <p>Veuillez réessayer. Si le problème persiste, revenez dans quelques instants.</p>
          <button type="button" onClick={reset}>
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
