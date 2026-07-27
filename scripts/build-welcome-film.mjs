import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const ffmpeg = process.env.FFMPEG_PATH;
if (!ffmpeg || !fs.existsSync(ffmpeg)) throw new Error("Set FFMPEG_PATH to a working ffmpeg binary.");

const out = path.join(root, "film-kit");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "beaux-rivages-film-"));
fs.mkdirSync(out, { recursive: true });

const P = (value) => path.join(root, value);
const D = (value) => path.join("/Users/scoulot/Downloads", value);
const segments = [
  { kind: "video", src: P("public/videos/beaux-rivages-hero.mp4"), duration: 6, label: "Océan — ouverture" },
  { kind: "photo", src: P("public/images/destination/pont-ile-de-re-rose.jpg"), duration: 5, label: "Pont de l’Île de Ré" },
  { kind: "photo", src: P("public/images/destination/fort-boyard-depuis-plage.jpg"), duration: 5, label: "Fort Boyard" },
  { kind: "photo", src: P("public/images/destination/marais-coucher-soleil.jpeg"), duration: 5, label: "Marais" },
  { kind: "video", src: D("beaux-rivages-video-demo.mp4"), start: 1, duration: 6, label: "Vélo sur les îles" },
  { kind: "photo", src: P("public/images/destination/huitres-vin-blanc.jpg"), duration: 5, label: "Huîtres" },
  { kind: "photo", src: P("public/images/destination/petit-dejeuner-ocean.jpg"), duration: 5, label: "Petit-déjeuner face à l’océan" },
  { kind: "photo", src: P("public/images/destination/pique-nique-plage.jpg"), duration: 5, label: "Art de vivre sur la plage" },
  { kind: "photo", src: P("public/images/properties/villa-raie-manta/salon-vue-mer.jpeg"), duration: 4, label: "Villa Raie Manta" },
  { kind: "photo", src: P("public/images/properties/villa-raie-manta/vue-ocean.jpeg"), duration: 4, label: "Villa Raie Manta — océan" },
  { kind: "video", src: P("public/videos/chai-des-tortues-film-sans-son.mp4"), start: 4, duration: 8, label: "Le Chai des Tortues" },
  { kind: "photo", src: P("public/images/properties/nid-d-ete/airbnb-salon-1.jpeg"), duration: 4, label: "Le Nid d’Été" },
  { kind: "photo", src: P("public/images/properties/nid-d-ete/acces-plage.jpeg"), duration: 4, label: "Le Nid d’Été — plage" },
  { kind: "photo", src: P("public/images/properties/chai-des-tortues/editorial/chambre-attention.png"), duration: 4, label: "Attention en chambre" },
  { kind: "photo", src: P("public/images/properties/chai-des-tortues/editorial/cafe-matinal-exterieur.png"), duration: 4, label: "Hospitalité" },
  { kind: "logo", src: P("brand-kit/logos/png/logo-horizontal-blanc-4096.png"), duration: 6, label: "Signature Beaux Rivages" },
];

const run = (args) => {
  const result = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
};

const width = 1920;
const height = 1080;
const fps = 25;
const fade = 0.3;
const files = [];

segments.forEach((segment, index) => {
  const target = path.join(tmp, `${String(index).padStart(2, "0")}.mp4`);
  const common = `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},setsar=1,fps=${fps},format=yuv420p`;
  if (segment.kind === "photo") {
    const frames = segment.duration * fps;
    run(["-loop", "1", "-i", segment.src, "-t", String(segment.duration), "-vf", `scale=2400:1350:force_original_aspect_ratio=increase,crop=2400:1350,zoompan=z='min(zoom+0.00035,1.035)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${width}x${height}:fps=${fps},${common}`, "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18", target]);
  } else if (segment.kind === "logo") {
    run(["-loop", "1", "-i", segment.src, "-t", String(segment.duration), "-vf", `scale=1150:-2:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=#16354A,${common}`, "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "16", target]);
  } else {
    run(["-ss", String(segment.start ?? 0), "-i", segment.src, "-t", String(segment.duration), "-vf", common, "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18", target]);
  }
  files.push(target);
});

const silent = path.join(tmp, "silent.mp4");
const xfadeInputs = files.flatMap((file) => ["-i", file]);
let elapsed = segments[0].duration;
const xfadeFilters = [];
for (let index = 1; index < segments.length; index += 1) {
  const previous = index === 1 ? "[0:v]" : `[x${index - 1}]`;
  const offset = elapsed - fade * index;
  xfadeFilters.push(`${previous}[${index}:v]xfade=transition=fade:duration=${fade}:offset=${offset.toFixed(2)}[x${index}]`);
  elapsed += segments[index].duration;
}
run([...xfadeInputs, "-filter_complex", xfadeFilters.join(";"), "-map", `[x${segments.length - 1}]`, "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18", silent]);

const duration = segments.reduce((sum, segment) => sum + segment.duration, 0) - fade * (segments.length - 1);
const music = path.join(tmp, "music.m4a");
const musicFilter = [
  `sine=f=146.83:d=${duration}:r=48000,volume=0.022[a]`,
  `sine=f=220:d=${duration}:r=48000,volume=0.014[b]`,
  `sine=f=293.66:d=${duration}:r=48000,volume=0.010[c]`,
  `anoisesrc=d=${duration}:c=pink:r=48000,lowpass=f=900,highpass=f=80,volume=0.006[n]`,
  `[a][b][c][n]amix=inputs=4:normalize=0,afade=t=in:st=0:d=5,afade=t=out:st=${Math.max(0, duration - 6)}:d=6,alimiter=limit=0.8[out]`,
].join(";");
run(["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-filter_complex", musicFilter, "-map", "[out]", "-t", String(duration), "-c:a", "aac", "-b:a", "192k", music]);

const master = path.join(out, "beaux-rivages-film-accueil-1080p.mp4");
run(["-i", silent, "-i", music, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", master]);
run(["-i", master, "-vf", "scale=3840:2160:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", path.join(out, "beaux-rivages-film-accueil-4k.mp4")]);
run(["-i", master, "-t", "30", "-vf", "fade=t=out:st=29:d=1", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", path.join(out, "beaux-rivages-film-30s.mp4")]);
run(["-i", master, "-vf", "crop=608:1080:656:0,scale=1080:1920", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", path.join(out, "beaux-rivages-film-vertical-instagram.mp4")]);
run(["-i", master, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-movflags", "+faststart", path.join(out, "beaux-rivages-hero-web.mp4")]);
run(["-i", master, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", path.join(out, "beaux-rivages-hero-web.webm")]);

fs.writeFileSync(path.join(out, "EDIT_DECISIONS.md"), `# Film d’accueil Beaux Rivages v1.0

Durée : ${duration} secondes.

## Intention

Le montage progresse du territoire vers les gestes, puis vers les trois maisons et enfin l’attention portée à l’accueil. Les plans verticaux instables, les vidéos privées et l’appartement extérieur à la collection ont été écartés.

## Séquencier

${segments.map((segment, index) => `${index + 1}. ${segment.label} — ${segment.duration} s`).join("\n")}

## Son

Ambiance instrumentale originale sans droits tiers : nappe harmonique minimaliste et texture marine. Aucun morceau commercial n’est incorporé.

## Note 4K

Le master 4K combine photographies HD et sources vidéo 720p/1080p mises à l’échelle. Un tournage natif 4K reste recommandé pour une future v2 cinéma.
`);
console.log(`Film kit built in ${out}`);
