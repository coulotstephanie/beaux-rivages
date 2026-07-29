"use client";

import { useEffect, useRef, useState } from "react";

type SoundMode = "off" | "waves" | "music";

const labels: Record<SoundMode, string> = {
  off: "Ambiance sonore",
  waves: "Vagues",
  music: "Bach · Air",
};

export function AmbientSound() {
  const [mode, setMode] = useState<SoundMode>("off");
  const [error, setError] = useState("");
  const audioRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  useEffect(() => {
    const music = musicRef.current;
    return () => {
      music?.pause();
      void audioRef.current?.close();
    };
  }, []);

  const stopNodes = () => {
    for (const node of nodesRef.current) {
      if ("stop" in node) {
        try {
          (node as AudioBufferSourceNode | OscillatorNode).stop();
        } catch {
          // The node may already have stopped.
        }
      }
      node.disconnect();
    }
    nodesRef.current = [];
  };

  const stop = () => {
    stopNodes();
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  };

  const playWaves = async () => {
    const AudioContextClass = window.AudioContext;
    const context = audioRef.current ?? new AudioContextClass();
    audioRef.current = context;
    await context.resume();
    stop();

    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.13, context.currentTime + 0.8);
    master.connect(context.destination);

    const buffer = context.createBuffer(1, context.sampleRate * 8, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = Math.random() * 2 - 1;
    }

    const waves = context.createBufferSource();
    const waveFilter = context.createBiquadFilter();
    const waveGain = context.createGain();
    const waveMotion = context.createOscillator();
    const motionDepth = context.createGain();

    waves.buffer = buffer;
    waves.loop = true;
    waveFilter.type = "lowpass";
    waveFilter.frequency.value = 620;
    waveFilter.Q.value = 0.8;
    waveGain.gain.value = 0.18;
    waveMotion.frequency.value = 0.11;
    motionDepth.gain.value = 0.11;

    waves.connect(waveFilter).connect(waveGain).connect(master);
    waveMotion.connect(motionDepth).connect(waveGain.gain);
    waves.start();
    waveMotion.start();

    nodesRef.current.push(waves, waveFilter, waveGain, waveMotion, motionDepth, master);
    setMode("waves");
  };

  const choose = async (nextMode: SoundMode) => {
    setError("");
    if (nextMode === "off") {
      stop();
      setMode("off");
      return;
    }
    try {
      if (nextMode === "waves") {
        await playWaves();
        return;
      }
      stop();
      if (!musicRef.current) return;
      musicRef.current.volume = 0.28;
      await musicRef.current.play();
      setMode("music");
    } catch {
      stop();
      setMode("off");
      setError("La musique n’a pas pu démarrer. Réessayez.");
    }
  };

  return (
    <aside className="ambient-sound" aria-label="Ambiance sonore">
      <audio
        ref={musicRef}
        src="/audio/bach-air-on-the-g-string.ogg"
        preload="none"
        loop
      />
      <span className="ambient-sound__label">{labels[mode]}</span>
      {error && <span className="sr-only" role="status">{error}</span>}
      <div className="ambient-sound__controls">
        <button
          type="button"
          className={mode === "waves" ? "is-active" : ""}
          onClick={() => void choose(mode === "waves" ? "off" : "waves")}
          aria-pressed={mode === "waves"}
        >
          Vagues
        </button>
        <button
          type="button"
          className={mode === "music" ? "is-active" : ""}
          onClick={() => void choose(mode === "music" ? "off" : "music")}
          aria-pressed={mode === "music"}
          title="Jean-Sébastien Bach, Air sur la corde de sol · Enregistrement du domaine public"
        >
          Musique classique
        </button>
      </div>
    </aside>
  );
}
