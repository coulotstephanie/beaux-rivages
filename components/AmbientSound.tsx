"use client";

import { useEffect, useRef, useState } from "react";

type SoundMode = "off" | "waves" | "music";

const labels: Record<SoundMode, string> = {
  off: "Ambiance sonore",
  waves: "Vagues",
  music: "Musique & vagues",
};

export function AmbientSound() {
  const [mode, setMode] = useState<SoundMode>("off");
  const audioRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  useEffect(() => {
    return () => {
      void audioRef.current?.close();
    };
  }, []);

  const stop = () => {
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

  const play = async (nextMode: Exclude<SoundMode, "off">) => {
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
    waveGain.gain.value = nextMode === "music" ? 0.075 : 0.18;
    waveMotion.frequency.value = 0.11;
    motionDepth.gain.value = 0.11;

    waves.connect(waveFilter).connect(waveGain).connect(master);
    waveMotion.connect(motionDepth).connect(waveGain.gain);
    waves.start();
    waveMotion.start();

    nodesRef.current.push(waves, waveFilter, waveGain, waveMotion, motionDepth, master);

    if (nextMode === "music") {
      const musicBus = context.createGain();
      const musicMotion = context.createOscillator();
      const musicDepth = context.createGain();
      musicBus.gain.value = 0.72;
      musicMotion.frequency.value = 0.065;
      musicDepth.gain.value = 0.16;
      musicMotion.connect(musicDepth).connect(musicBus.gain);
      musicBus.connect(master);
      musicMotion.start();
      nodesRef.current.push(musicBus, musicMotion, musicDepth);

      // A warm suspended chord, deliberately slow and discreet behind the surf.
      const notes = [146.83, 220, 293.66, 369.99];
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const filter = context.createBiquadFilter();
        const drift = context.createOscillator();
        const driftDepth = context.createGain();
        oscillator.type = index % 2 ? "sine" : "triangle";
        oscillator.frequency.value = frequency;
        gain.gain.value = index === 0 ? 0.08 : 0.052;
        filter.type = "lowpass";
        filter.frequency.value = 900;
        drift.frequency.value = 0.025 + index * 0.009;
        driftDepth.gain.value = 0.8 + index * 0.15;
        drift.connect(driftDepth).connect(oscillator.detune);
        oscillator.connect(filter).connect(gain).connect(musicBus);
        oscillator.start();
        drift.start();
        nodesRef.current.push(oscillator, filter, gain, drift, driftDepth);
      });
    }

    setMode(nextMode);
  };

  const choose = (nextMode: SoundMode) => {
    if (nextMode === "off") {
      stop();
      setMode("off");
      return;
    }
    void play(nextMode);
  };

  return (
    <aside className="ambient-sound" aria-label="Ambiance sonore">
      <span className="ambient-sound__label">{labels[mode]}</span>
      <div className="ambient-sound__controls">
        <button
          type="button"
          className={mode === "waves" ? "is-active" : ""}
          onClick={() => choose(mode === "waves" ? "off" : "waves")}
          aria-pressed={mode === "waves"}
        >
          Vagues
        </button>
        <button
          type="button"
          className={mode === "music" ? "is-active" : ""}
          onClick={() => choose(mode === "music" ? "off" : "music")}
          aria-pressed={mode === "music"}
        >
          Musique douce
        </button>
      </div>
    </aside>
  );
}
