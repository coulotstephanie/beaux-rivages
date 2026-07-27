import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const kit = path.join(root, "brand-kit");
const dirs = ["logos/svg", "logos/png", "logos/pdf", "logos/eps", "logos/ai-compatible", "digital", "signage", "mockups"];
dirs.forEach((dir) => fs.mkdirSync(path.join(kit, dir), { recursive: true }));

const C = {
  navy: "#16354A",
  ocean: "#1F4E6D",
  sand: "#D8C3A5",
  ivory: "#F7F3EA",
  stone: "#8D8A83",
  gold: "#B99A63",
  black: "#111315",
  white: "#FFFFFF",
};
const baseline = "TROIS MAISONS. DEUX ÎLES. UNE MÊME PASSION DE L’HOSPITALITÉ.";

const monogram = (color = C.navy) => `
  <g fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 19V81M26 20H48C62 20 69 27 69 37C69 47 61 53 48 53H26M48 53C64 53 74 62 76 79" stroke-width="5.2"/>
    <path d="M52 20V81M52 20H69C82 20 89 27 89 37C89 47 81 53 69 53H52M69 53L91 81" stroke-width="3.2"/>
    <path d="M14 69C31 61 43 61 58 69C73 77 85 77 100 68" stroke-width="2.2"/>
    <path d="M18 76C32 70 44 70 58 77C72 84 84 84 97 77" stroke-width="1.25"/>
  </g>`;

const svg = ({ width, height, body, bg, label = "Logo Beaux Rivages" }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
${bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ""}
${body}
</svg>`;

const wording = (x, y, color, anchor = "start", size = 31, baselineSize = 8) => `
  <text x="${x}" y="${y}" fill="${color}" text-anchor="${anchor}" font-family="Optima, 'Avenir Next', sans-serif" font-size="${size}" letter-spacing="${size * .19}" font-weight="500">BEAUX RIVAGES</text>
  <text x="${x}" y="${y + 24}" fill="${color}" text-anchor="${anchor}" font-family="Optima, 'Avenir Next', sans-serif" font-size="${baselineSize}" letter-spacing="2.15">${baseline}</text>`;

const variants = {
  "logo-horizontal-bleu-nuit": svg({ width: 760, height: 150, body: `<g transform="translate(28 18)">${monogram()}</g>${wording(162, 70, C.navy)}` }),
  "logo-horizontal-blanc": svg({ width: 760, height: 150, bg: C.navy, body: `<g transform="translate(28 18)">${monogram(C.white)}</g>${wording(162, 70, C.white)}` }),
  "logo-horizontal-noir": svg({ width: 760, height: 150, body: `<g transform="translate(28 18)">${monogram(C.black)}</g>${wording(162, 70, C.black)}` }),
  "logo-horizontal-or": svg({ width: 760, height: 150, bg: C.navy, body: `<g transform="translate(28 18)">${monogram(C.gold)}</g>${wording(162, 70, C.gold)}` }),
  "logo-vertical-bleu-nuit": svg({ width: 520, height: 430, body: `<g transform="translate(200 36) scale(1.15)">${monogram()}</g>${wording(260, 250, C.navy, "middle", 31, 7.5)}` }),
  "logo-carre-bleu-nuit": svg({ width: 512, height: 512, bg: C.ivory, body: `<g transform="translate(196 68) scale(1.2)">${monogram()}</g>${wording(256, 300, C.navy, "middle", 28, 7)}` }),
  "monogramme-bleu-nuit": svg({ width: 120, height: 110, body: monogram() }),
  "monogramme-blanc": svg({ width: 120, height: 110, bg: C.navy, body: monogram(C.white) }),
  "monogramme-noir": svg({ width: 120, height: 110, body: monogram(C.black) }),
  "monogramme-or": svg({ width: 120, height: 110, bg: C.navy, body: monogram(C.gold) }),
  "monogramme-gravure": svg({ width: 120, height: 110, body: monogram(C.black) }),
  "monogramme-broderie": svg({ width: 120, height: 110, body: monogram(C.navy).replaceAll('stroke-width="1.25"', 'stroke-width="2.2"') }),
  "favicon": svg({ width: 120, height: 120, bg: C.navy, body: `<g transform="translate(7 7)">${monogram(C.white)}</g>` }),
};

for (const [name, data] of Object.entries(variants)) {
  fs.writeFileSync(path.join(kit, "logos/svg", `${name}.svg`), data);
}

const signage = [
  "ENTRÉE", "LE CHAI DES TORTUES", "VILLA RAIE MANTA", "LE NID D’ÉTÉ", "RÉCEPTION",
  "CONCIERGERIE", "PARKING", "PRIVÉ", "CHAMBRES", "SALLE DE BAIN", "CUISINE", "SORTIE", "WI-FI",
];
for (const title of signage) {
  const slug = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  fs.writeFileSync(path.join(kit, "signage", `${slug}.svg`), svg({
    width: 600, height: 240, bg: C.ivory,
    label: `Plaque ${title}`,
    body: `<rect x="9" y="9" width="582" height="222" rx="5" fill="none" stroke="${C.navy}" stroke-width="2"/>
      <g transform="translate(242 28) scale(.95)">${monogram(C.navy)}</g>
      <text x="300" y="176" text-anchor="middle" fill="${C.navy}" font-family="Optima, sans-serif" font-size="22" letter-spacing="4">${title}</text>`,
  }));
}

const mockups = [
  ["carte-de-visite", "CARTE DE VISITE", C.ivory, C.navy],
  ["plaque-laiton", "PLAQUE · LAITON BROSSÉ", C.gold, C.navy],
  ["plaque-bois", "PLAQUE · BOIS MASSIF", "#8B6847", C.ivory],
  ["plaque-plexiglas", "PLAQUE · PLEXIGLAS", "#E8F0F2", C.navy],
  ["plaque-ardoise", "PLAQUE · ARDOISE", "#31383B", C.white],
  ["plaque-pierre", "PLAQUE · PIERRE", "#C8C0B2", C.navy],
  ["peignoir", "PEIGNOIR · BRODERIE", C.white, C.navy],
  ["serviette", "SERVIETTE · BRODERIE", C.sand, C.navy],
  ["carnet", "LE CARNET BEAUX RIVAGES", C.navy, C.gold],
  ["site-internet", "SITE INTERNET", C.ivory, C.navy],
  ["signature-email", "SIGNATURE E-MAIL", C.white, C.navy],
  ["tote-bag", "TOTE BAG", C.sand, C.navy],
  ["bouteille-eau", "BOUTEILLE D’EAU", "#E3EEF0", C.navy],
  ["coffret-accueil", "COFFRET D’ACCUEIL", C.navy, C.gold],
];
for (const [slug, title, bg, color] of mockups) {
  fs.writeFileSync(path.join(kit, "mockups", `${slug}.svg`), svg({
    width: 1200, height: 800, bg,
    label: `Mockup ${title}`,
    body: `<rect x="110" y="110" width="980" height="580" rx="18" fill="none" stroke="${color}" stroke-width="2" opacity=".65"/>
      <g transform="translate(540 190) scale(1.1)">${monogram(color)}</g>
      <text x="600" y="425" text-anchor="middle" fill="${color}" font-family="Optima, sans-serif" font-size="40" letter-spacing="10">BEAUX RIVAGES</text>
      <text x="600" y="474" text-anchor="middle" fill="${color}" font-family="Optima, sans-serif" font-size="13" letter-spacing="3">${baseline}</text>
      <text x="600" y="625" text-anchor="middle" fill="${color}" font-family="Avenir Next, sans-serif" font-size="13" letter-spacing="4">${title}</text>`,
  }));
}

const palette = {
  "Bleu nuit": { hex: C.navy, rgb: "22, 53, 74", cmyk: "70, 28, 0, 71" },
  "Bleu océan": { hex: C.ocean, rgb: "31, 78, 109", cmyk: "72, 28, 0, 57" },
  "Or champagne": { hex: C.gold, rgb: "185, 154, 99", cmyk: "0, 17, 46, 27" },
  "Sable": { hex: C.sand, rgb: "216, 195, 165", cmyk: "0, 10, 24, 15" },
  "Blanc cassé": { hex: C.ivory, rgb: "247, 243, 234", cmyk: "0, 2, 5, 3" },
  "Gris pierre": { hex: C.stone, rgb: "141, 138, 131", cmyk: "0, 2, 7, 45" },
};
fs.writeFileSync(path.join(kit, "palette.json"), JSON.stringify(palette, null, 2));

const eps = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 760 150
%%Title: Beaux Rivages — logo horizontal
%%Creator: Beaux Rivages Brand Kit
/navy {0.703 0.284 0 0.710 setcmykcolor} def
/O /Optima findfont 31 scalefont def
navy 5.2 setlinewidth 1 setlinecap 1 setlinejoin
54 37 moveto 54 99 lineto
54 98 moveto 76 98 lineto 90 98 97 91 97 81 curveto 97 71 89 65 76 65 curveto 54 65 lineto
76 65 moveto 92 65 102 56 104 39 curveto stroke
80 98 moveto 80 37 lineto 80 98 moveto 97 98 110 91 110 81 curveto 110 71 102 65 97 65 curveto
97 65 moveto 119 37 lineto stroke
O setfont 162 70 moveto (BEAUX RIVAGES) show
showpage
%%EOF`;
fs.writeFileSync(path.join(kit, "logos/eps/logo-horizontal-bleu-nuit.eps"), eps);
fs.writeFileSync(path.join(kit, "logos/ai-compatible/logo-horizontal-bleu-nuit.ai"), eps);

for (const [name, data] of Object.entries(variants)) {
  for (const size of [1024, 2048, 4096]) {
    await sharp(Buffer.from(data)).resize({ width: size }).png().toFile(path.join(kit, "logos/png", `${name}-${size}.png`));
  }
}
await sharp(Buffer.from(variants.favicon)).resize(512, 512).png().toFile(path.join(kit, "digital", "icon-512.png"));
await sharp(Buffer.from(variants.favicon)).resize(192, 192).png().toFile(path.join(kit, "digital", "icon-192.png"));
await sharp(Buffer.from(variants.favicon)).resize(180, 180).png().toFile(path.join(kit, "digital", "apple-touch-icon.png"));
await sharp(Buffer.from(variants.favicon)).resize(32, 32).png().toFile(path.join(kit, "digital", "favicon-32.png"));
await sharp(Buffer.from(variants["logo-horizontal-blanc"])).resize(1200, 630, { fit: "contain", background: C.navy }).png().toFile(path.join(kit, "digital", "opengraph.png"));

const manifest = { name: "Beaux Rivages", short_name: "Beaux Rivages", description: "Trois maisons. Deux îles. Une même passion de l’hospitalité.", start_url: "/", display: "standalone", background_color: C.ivory, theme_color: C.navy, icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" }] };
fs.writeFileSync(path.join(kit, "digital", "manifest.webmanifest"), JSON.stringify(manifest, null, 2));

console.log(`Brand kit generated in ${kit}`);
