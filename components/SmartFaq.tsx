"use client";

import { useState } from "react";
import { smartFaqs } from "@/faqData";
const categories = ["Toutes", ...new Set(smartFaqs.map(([category]) => category))];

export function SmartFaq() {
  const [active, setActive] = useState("Toutes");
  const visible = active === "Toutes" ? smartFaqs : smartFaqs.filter(([category]) => category === active);
  return <div className="smart-faq">
    <div className="smart-faq__filters" aria-label="Filtrer les questions par thème">{categories.map((category) => <button type="button" key={category} onClick={() => setActive(category)} className={active === category ? "is-active" : ""} aria-pressed={active === category}>{category}</button>)}</div>
    <div className="smart-faq__list">{visible.map(([category, question, answer]) => <details key={question}><summary><span>{category}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div>
  </div>;
}
