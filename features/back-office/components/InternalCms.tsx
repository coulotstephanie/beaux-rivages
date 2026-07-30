"use client";

import {
  Bold,
  Eye,
  Heading2,
  ImagePlus,
  Italic,
  Link,
  List,
  Plus,
  Save,
  Send,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const entries = [
  { id: "c1", title: "Le marché de La Flotte", type: "Marchés", status: "Publié", date: "29 juil. 2026" },
  { id: "c2", title: "Une journée à Chassiron", type: "Conseils", status: "Brouillon", date: "28 juil. 2026" },
  { id: "c3", title: "La Cabane de l’Huître", type: "Restaurants", status: "Publié", date: "25 juil. 2026" },
  { id: "c4", title: "Balade au coucher du soleil", type: "Articles", status: "À relire", date: "22 juil. 2026" },
  { id: "c5", title: "Festival Musiques au Pays de Pierre Loti", type: "Évènements", status: "Planifié", date: "20 juil. 2026" },
];
const categories = ["Carnet Beaux Rivages", "Restaurants", "Photos", "Bonnes adresses", "Articles", "Conseils", "Marchés", "Évènements"];
const media = [
  "/images/destination/guide-port-saint-martin.jpg",
  "/images/destination/marais-coucher-soleil.jpeg",
  "/images/destination/guide-phare-chassiron.jpg",
  "/images/destination/huitres-vin-blanc.jpg",
  "/images/destination/ruelle.jpeg",
  "/images/destination/pont-ile-de-re-rose.jpg",
];

export function InternalCms() {
  const [selected, setSelected] = useState(entries[1]);
  const [title, setTitle] = useState(entries[1].title);
  const [category, setCategory] = useState(entries[1].type);
  const [hero, setHero] = useState(media[2]);
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("");
  const format = (command: string) => document.execCommand(command);

  return <div className="bo-page">
    <div className="bo-page__heading"><div><p className="bo-eyebrow">Gouvernance éditoriale</p><h1>CMS & Carnet</h1><p>Écrire, illustrer, relire et publier sans toucher au code.</p></div><button className="bo-primary" type="button"><Plus /> Nouveau contenu</button></div>
    <div className="bo-cms-layout">
      <aside className="bo-card bo-content-list"><div className="bo-card__heading"><div><p className="bo-eyebrow">Contenus</p><h2>{entries.length} fiches</h2></div></div><label>Filtrer<select><option>Toutes les catégories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>{entries.map((entry) => <button type="button" key={entry.id} className={selected.id === entry.id ? "is-active" : ""} onClick={() => { setSelected(entry); setTitle(entry.title); setCategory(entry.type); }}><span><strong>{entry.title}</strong><small>{entry.type} · {entry.date}</small></span><i data-status={entry.status}>{entry.status}</i></button>)}</aside>
      <section className="bo-card bo-editor">
        <div className="bo-card__heading"><div><p className="bo-eyebrow">Éditeur</p><h2>{selected.status === "Brouillon" ? "Brouillon" : "Modifier le contenu"}</h2></div><div><button type="button" onClick={() => setPreview(true)}><Eye /> Aperçu</button><button type="button" onClick={() => setNotice("Brouillon enregistré localement.")}><Save /> Enregistrer</button></div></div>
        <div className="bo-editor-fields"><label>Titre<input value={title} onChange={(e) => setTitle(e.target.value)} /></label><label>Catégorie<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <label className="bo-slug">Adresse de la page <span>beaux-rivages.com/carnet/</span><input value={title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")} readOnly /></label>
        <div className="bo-wysiwyg-toolbar" role="toolbar" aria-label="Mise en forme"><button type="button" onClick={() => format("bold")} aria-label="Gras"><Bold /></button><button type="button" onClick={() => format("italic")} aria-label="Italique"><Italic /></button><button type="button" onClick={() => format("formatBlock")} aria-label="Intertitre"><Heading2 /></button><button type="button" onClick={() => format("insertUnorderedList")} aria-label="Liste"><List /></button><button type="button" aria-label="Lien"><Link /></button><button type="button" aria-label="Image"><ImagePlus /></button></div>
        <div className="bo-wysiwyg" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true"><h2>Le nord sauvage d’Oléron</h2><p>Au bout de l’île, le phare de Chassiron veille sur l’Atlantique. Une promenade idéale lorsque la lumière devient douce.</p><p>Partez tôt, prenez le temps de parcourir les jardins et poursuivez jusqu’aux écluses à poissons.</p><ul><li>Privilégier le matin ou la fin de journée</li><li>Prévoir une veste les jours de vent</li></ul></div>
        <section className="bo-media-picker"><div><p className="bo-eyebrow">Image principale</p><h3>Médiathèque</h3></div><button type="button"><ImagePlus /> Importer une image</button><div>{media.map((src) => <button type="button" key={src} className={hero === src ? "is-selected" : ""} onClick={() => setHero(src)}><Image src={src} alt="" fill sizes="(max-width: 560px) 50vw, 220px" />{hero === src && <span>Image choisie</span>}</button>)}</div></section>
        <div className="bo-publish-bar"><div><strong>État : {selected.status}</strong><small>La publication nécessite toujours une validation humaine.</small></div><button type="button" onClick={() => setNotice("Publication simulée. Aucune donnée distante n’a été modifiée.")}><Send /> Publier</button></div>
        {notice && <p className="bo-prepared" role="status">{notice}</p>}
      </section>
    </div>
    {preview && <div className="bo-preview-modal" role="dialog" aria-modal="true" aria-labelledby="cms-preview-title"><article><button type="button" onClick={() => setPreview(false)}>×</button><div className="bo-preview-modal__image"><Image src={hero} alt="" fill sizes="850px" /></div><div><p className="bo-eyebrow">{category}</p><h2 id="cms-preview-title">{title}</h2><p>Au bout de l’île, le phare de Chassiron veille sur l’Atlantique. Une promenade idéale lorsque la lumière devient douce.</p></div></article></div>}
  </div>;
}
