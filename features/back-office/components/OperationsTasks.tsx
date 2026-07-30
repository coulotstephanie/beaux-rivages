"use client";

import { Check, ChevronRight, ClipboardCheck, Plus, X } from "lucide-react";
import { useState } from "react";

type Status = "À faire" | "En cours" | "Terminé";
type Priority = "Basse" | "Normale" | "Haute" | "Urgente";
type Task = { id: number; title: string; type: string; property: string; due: string; status: Status; priority: Priority };

const initialTasks: Task[] = [
  { id: 1, title: "Ménage après départ", type: "Ménage", property: "Villa Raie Manta", due: "Aujourd’hui · 11:00", status: "En cours", priority: "Haute" },
  { id: 2, title: "Contrôler le chauffe-eau", type: "Maintenance", property: "Le Nid d’Été", due: "Aujourd’hui · 14:00", status: "À faire", priority: "Urgente" },
  { id: 3, title: "Préparer le Pack Signature", type: "Pack Signature", property: "Le Chai des Tortues", due: "Aujourd’hui · 16:00", status: "À faire", priority: "Normale" },
  { id: 4, title: "Appeler Sophie pour les vélos", type: "Appel client", property: "Villa Raie Manta", due: "Aujourd’hui · 15:30", status: "Terminé", priority: "Basse" },
];

const checklists = ["Arrivée", "Départ", "Ménage", "Contrôle qualité", "Hivernage", "Ouverture saison", "Décoration Noël", "Décoration Halloween"];
const checklistSteps = ["Aérer et vérifier la température", "Contrôler linge et literie", "Tester Wi-Fi et équipements", "Préparer les attentions voyageurs", "Photographier le contrôle final"];

export function OperationsTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState<"tasks" | "checklists">("tasks");
  const [drawer, setDrawer] = useState(false);
  const [activeChecklist, setActiveChecklist] = useState("Arrivée");
  const [checked, setChecked] = useState<number[]>([0, 1]);

  const advance = (id: number) => setTasks((items) => items.map((task) => task.id === id ? { ...task, status: task.status === "À faire" ? "En cours" : "Terminé" } : task));

  return (
    <main className="bo-page">
      <header className="bo-page__heading"><div><p className="bo-eyebrow">Smart Operations</p><h1>Tâches & checklists</h1><p>Organisez le travail quotidien sans perdre le fil.</p></div><button className="bo-primary" type="button" onClick={() => setDrawer(true)}><Plus /> Nouvelle tâche</button></header>
      <div className="bo-tabs" role="tablist"><button role="tab" aria-selected={view === "tasks"} onClick={() => setView("tasks")}>Tâches</button><button role="tab" aria-selected={view === "checklists"} onClick={() => setView("checklists")}>Checklists personnalisables</button></div>
      {view === "tasks" ? (
        <section className="bo-task-board">
          {(["À faire", "En cours", "Terminé"] as Status[]).map((status) => <div key={status}><header><strong>{status}</strong><span>{tasks.filter((task) => task.status === status).length}</span></header>{tasks.filter((task) => task.status === status).map((task) => <article key={task.id} data-priority={task.priority.toLowerCase()}><small>{task.type} · {task.priority}</small><h2>{task.title}</h2><p>{task.property}</p><time>{task.due}</time>{status !== "Terminé" && <button type="button" onClick={() => advance(task.id)}>{status === "À faire" ? "Commencer" : "Terminer"} <ChevronRight /></button>}</article>)}</div>)}
        </section>
      ) : (
        <div className="bo-checklist-layout">
          <aside className="bo-card bo-checklist-types">{checklists.map((name) => <button key={name} className={activeChecklist === name ? "is-active" : ""} onClick={() => { setActiveChecklist(name); setChecked([]); }}><ClipboardCheck />{name}<ChevronRight /></button>)}<button className="bo-add-template"><Plus /> Nouveau modèle</button></aside>
          <section className="bo-card bo-checklist"><div className="bo-card__heading"><div><p className="bo-eyebrow">Modèle personnalisable</p><h2>{activeChecklist}</h2></div><button type="button">Modifier le modèle</button></div><p className="bo-progress"><span style={{ width: `${checked.length / checklistSteps.length * 100}%` }} /></p><small>{checked.length} étape(s) sur {checklistSteps.length}</small>{checklistSteps.map((step, index) => <label key={step} className={checked.includes(index) ? "is-checked" : ""}><input type="checkbox" checked={checked.includes(index)} onChange={() => setChecked((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index])} /><i><Check /></i><span>{step}</span></label>)}<button className="bo-primary" type="button">Enregistrer la progression</button></section>
        </div>
      )}
      {drawer && <div className="bo-drawer-backdrop"><aside className="bo-drawer"><div className="bo-drawer__heading"><h2>Nouvelle tâche</h2><button onClick={() => setDrawer(false)}><X /></button></div><label>Type<select><option>Ménage</option><option>Maintenance</option><option>Courses</option><option>Appel client</option><option>Relance</option><option>Préparation Pack Signature</option><option>Contrôle qualité</option></select></label><label>Intitulé<input placeholder="Ce qu’il faut faire" /></label><div className="bo-form-pair"><label>Priorité<select><option>Basse</option><option>Normale</option><option>Haute</option><option>Urgente</option></select></label><label>Logement<select><option>Le Chai des Tortues</option><option>Villa Raie Manta</option><option>Le Nid d’Été</option></select></label></div><div className="bo-drawer__actions"><button className="bo-primary" onClick={() => setDrawer(false)}>Créer la tâche</button></div></aside></div>}
    </main>
  );
}
