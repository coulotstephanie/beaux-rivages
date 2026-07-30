"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { calendarEvents, properties } from "../demo-data";
import type { CalendarEvent, CalendarView, StayKind } from "../types";

const days = Array.from({ length: 14 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 7, index + 1));
  return {
    iso: date.toISOString().slice(0, 10),
    day: new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: "UTC" }).format(date),
    number: index + 1,
  };
});
const viewLabels: CalendarView[] = ["jour", "semaine", "mois", "année"];
const kindLabels: Record<StayKind, string> = {
  direct: "Directe", external: "Externe", owner: "Propriétaire",
  maintenance: "Maintenance", housekeeping: "Ménage", blocked: "Bloqué",
};

export function ProfessionalCalendar() {
  const [view, setView] = useState<CalendarView>("semaine");
  const [events, setEvents] = useState(calendarEvents);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const visibleDays = useMemo(() => view === "jour" ? days.slice(2, 3) : view === "semaine" ? days.slice(0, 7) : days, [view]);

  const moveEvent = (propertyId: CalendarEvent["propertyId"], startsOn: string) => {
    if (!draggedId) return;
    setEvents((current) => current.map((event) => event.id === draggedId ? { ...event, propertyId, startsOn, endsOn: startsOn } : event));
    setDraggedId(null);
  };

  return (
    <div className="bo-page">
      <div className="bo-page__heading">
        <div><p className="bo-eyebrow">Planning central</p><h1>Calendrier</h1><p>Les trois maisons, dans une seule vue.</p></div>
        <button className="bo-primary" type="button" onClick={() => setSelected({ id: "new", propertyId: "chai", title: "", startsOn: "2026-08-01", endsOn: "2026-08-01", kind: "blocked" })}><Plus /> Ajouter</button>
      </div>
      <section className="bo-calendar-toolbar">
        <div className="bo-period"><button type="button" aria-label="Période précédente"><ChevronLeft /></button><strong>Août 2026</strong><button type="button" aria-label="Période suivante"><ChevronRight /></button><button type="button">Aujourd’hui</button></div>
        <div className="bo-segmented" role="group" aria-label="Vue du calendrier">
          {viewLabels.map((item) => <button key={item} type="button" aria-pressed={view === item} onClick={() => setView(item)}>{item}</button>)}
        </div>
      </section>
      <div className="bo-calendar-legend">{Object.entries(kindLabels).map(([kind, label]) => <span key={kind}><i data-kind={kind} />{label}</span>)}</div>
      <section className="bo-calendar">
        <div className="bo-calendar__corner">Maison</div>
        {visibleDays.map((day) => <div className="bo-calendar__day" key={day.iso}><small>{day.day}</small><strong>{day.number}</strong></div>)}
        {properties.map((property) => (
          <div className="bo-calendar__row" key={property.id} style={{ gridColumn: `1 / span ${visibleDays.length + 1}` }}>
            <div className="bo-calendar__property"><i style={{ backgroundColor: property.color }} /><strong>{property.shortName}</strong></div>
            {visibleDays.map((day) => (
              <div className="bo-calendar__cell" key={day.iso} onDragOver={(event) => event.preventDefault()} onDrop={() => moveEvent(property.id, day.iso)}>
                {events.filter((event) => event.propertyId === property.id && event.startsOn === day.iso).map((event) => (
                  <button draggable type="button" key={event.id} data-kind={event.kind} onDragStart={() => setDraggedId(event.id)} onClick={() => setSelected(event)}>
                    <strong>{event.title}</strong><small>{event.guest ?? kindLabels[event.kind]}</small>
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </section>
      <p className="bo-helper">Glissez une réservation vers une autre date ou une autre maison. Les changements restent locaux dans cette version d’architecture.</p>
      {selected && <CalendarEditor event={selected} onClose={() => setSelected(null)} onSave={(event) => { setEvents((current) => event.id === "new" ? [...current, { ...event, id: `e${current.length + 1}` }] : current.map((item) => item.id === event.id ? event : item)); setSelected(null); }} onDelete={selected.id === "new" ? undefined : () => { setEvents((current) => current.filter((item) => item.id !== selected.id)); setSelected(null); }} />}
    </div>
  );
}

function CalendarEditor({ event, onClose, onSave, onDelete }: { event: CalendarEvent; onClose: () => void; onSave: (event: CalendarEvent) => void; onDelete?: () => void }) {
  const [draft, setDraft] = useState(event);
  return <div className="bo-drawer-backdrop" role="presentation" onMouseDown={onClose}><aside className="bo-drawer" role="dialog" aria-modal="true" aria-labelledby="calendar-editor-title" onMouseDown={(e) => e.stopPropagation()}><div className="bo-drawer__heading"><div><p className="bo-eyebrow">Planning</p><h2 id="calendar-editor-title">{event.id === "new" ? "Ajouter au calendrier" : "Modifier l’événement"}</h2></div><button type="button" onClick={onClose}>×</button></div><label>Type<select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as StayKind })}>{Object.entries(kindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Maison<select value={draft.propertyId} onChange={(e) => setDraft({ ...draft, propertyId: e.target.value as CalendarEvent["propertyId"] })}>{properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Intitulé<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Ex. Blocage personnel" /></label><div className="bo-form-pair"><label>Du<input type="date" value={draft.startsOn} onChange={(e) => setDraft({ ...draft, startsOn: e.target.value })} /></label><label>Au<input type="date" value={draft.endsOn} onChange={(e) => setDraft({ ...draft, endsOn: e.target.value })} /></label></div><div className="bo-drawer__actions">{onDelete && <button className="bo-danger" type="button" onClick={onDelete}>Supprimer / débloquer</button>}<button className="bo-primary" type="button" onClick={() => onSave(draft)}>Enregistrer</button></div></aside></div>;
}
