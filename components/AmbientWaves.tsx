"use client";

import { useEffect, useRef, useState } from "react";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

export function AmbientWaves({ locale = "fr" }: { locale?: SupportedLocale }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const contextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  const stop = () => {
    for (const node of nodesRef.current) {
      if ("stop" in node) {
        try {
          (node as AudioBufferSourceNode | OscillatorNode).stop();
        } catch {
          // Le nœud peut avoir déjà été arrêté.
        }
      }
      node.disconnect();
    }
    nodesRef.current = [];
    setPlaying(false);
  };

  useEffect(() => {
    return () => {
      for (const node of nodesRef.current) node.disconnect();
      nodesRef.current = [];
      void contextRef.current?.close();
    };
  }, []);

  const play = async () => {
    setError("");
    try {
      const context = contextRef.current ?? new AudioContext();
      contextRef.current = context;
      await context.resume();
      stop();

      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, context.currentTime);
      master.gain.exponentialRampToValueAtTime(0.13, context.currentTime + 0.8);
      master.connect(context.destination);

      const buffer = context.createBuffer(1, context.sampleRate * 8, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;

      const waves = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      const motion = context.createOscillator();
      const depth = context.createGain();

      waves.buffer = buffer;
      waves.loop = true;
      filter.type = "lowpass";
      filter.frequency.value = 620;
      filter.Q.value = 0.8;
      gain.gain.value = 0.18;
      motion.frequency.value = 0.11;
      depth.gain.value = 0.11;
      waves.connect(filter).connect(gain).connect(master);
      motion.connect(depth).connect(gain.gain);
      waves.start();
      motion.start();

      nodesRef.current = [waves, filter, gain, motion, depth, master];
      setPlaying(true);
    } catch {
      stop();
      setError(tr(locale, "Le bruit des vagues n’a pas pu démarrer. Réessayez."));
    }
  };

  return (
    <aside className="ambient-waves" aria-label={tr(locale, "Ambiance sonore de l’océan")}>
      {error && (
        <span className="sr-only" role="status">
          {error}
        </span>
      )}
      <button
        type="button"
        className={playing ? "is-active" : ""}
        onClick={() => (playing ? stop() : void play())}
        aria-pressed={playing}
        aria-label={tr(
          locale,
          playing ? "Couper le bruit des vagues" : "Écouter le bruit des vagues",
        )}
      >
        <span aria-hidden="true">≈</span>
        {tr(locale, playing ? "Couper les vagues" : "Écouter les vagues")}
      </button>
    </aside>
  );
}
