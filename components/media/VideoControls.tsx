"use client";

export function VideoControls({ playing, muted, onPlay, onMute }: {
  playing: boolean;
  muted: boolean;
  onPlay: () => void;
  onMute: () => void;
}) {
  return <div className="video-controls" role="group" aria-label="Commandes vidéo">
    <button type="button" onClick={onPlay}>{playing ? "Pause" : "Lecture"}</button>
    <button type="button" onClick={onMute}>{muted ? "Activer le son" : "Couper le son"}</button>
  </div>;
}

