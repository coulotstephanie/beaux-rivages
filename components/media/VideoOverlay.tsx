"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export function VideoOverlay() {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };
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
        Trois maisons.
        <br />
        Deux îles.
        <br />
        <span>Une même passion de l’hospitalité.</span>
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
