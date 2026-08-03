"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const heroMessages = [
  { lines: ["Trois maisons.", "Deux îles."], accent: "Une même passion de l’hospitalité." },
  { lines: ["Là où les vacances"], accent: "prennent leur temps." },
  { lines: ["L’océan"], accent: "comme horizon." },
  { lines: ["Plus qu’une location."], accent: "Une maison où l’on revient." },
  { lines: ["Trois générations"], accent: "d’hospitalité." },
  { lines: ["Les plus beaux souvenirs"], accent: "commencent souvent ici." },
  { lines: ["Respirez."], accent: "Vous êtes déjà en vacances." },
] as const;

export function VideoOverlay() {
  const reduceMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);
  const [messageVisible, setMessageVisible] = useState(true);
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };
  const message = heroMessages[messageIndex];

  useEffect(() => {
    if (reduceMotion) return;

    const fadeOutTimer = window.setTimeout(() => setMessageVisible(false), 8000);
    const nextMessageTimer = window.setTimeout(() => {
      setMessageIndex((current) => (current + 1) % heroMessages.length);
      setMessageVisible(true);
    }, 8600);

    return () => {
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(nextMessageTimer);
    };
  }, [messageIndex, reduceMotion]);

  return (
    <motion.div
      className="immersive-overlay"
      initial="hidden"
      animate="visible"
      transition={{
        staggerChildren: reduceMotion ? 0 : 0.16,
        delayChildren: reduceMotion ? 0 : 0.35,
      }}
    >
      <motion.h1 variants={item} transition={transition}>
        <span className={`immersive-overlay__story ${messageVisible ? "is-visible" : ""}`}>
          {message.lines.map((line) => (
            <span className="immersive-overlay__story-line" key={line}>
              {line}
            </span>
          ))}
          <span className="immersive-overlay__story-accent">{message.accent}</span>
        </span>
      </motion.h1>
      <motion.p variants={item} transition={transition}>
        Des maisons de caractère, une hospitalité inspirée de trois générations d’excellence entre
        l’Île de Ré et l’Île d’Oléron.
      </motion.p>
      <motion.div variants={item} transition={transition} className="immersive-overlay__actions">
        <Link href="#maisons" className="immersive-button immersive-button--primary">
          Découvrir nos maisons
        </Link>
        <Link href="/reserver" className="immersive-button">
          Réserver
        </Link>
      </motion.div>
    </motion.div>
  );
}
