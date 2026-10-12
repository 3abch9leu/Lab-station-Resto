"use client";
import React from "react";

export default function LoadingScreen() {
  // NOTE: initial state must be identical on server and first client render.
  // A `typeof window` branch here caused a hydration mismatch (server: null,
  // client: loader div). Reduced-motion is handled inside the effect instead.
  const [done, setDone] = React.useState(false);
  const [gone, setGone] = React.useState(false);

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = window.setTimeout(() => setDone(true), reduced ? 60 : 1400);
    const t2 = window.setTimeout(() => setGone(true), reduced ? 120 : 1900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden={!done}
      aria-label="Chargement du laboratoire"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-500 ${done ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <div className="stripes h-1.5 w-full absolute top-0" />
      <p className="font-mono-lab text-[11px] tracking-[0.4em] text-[#ffd400]">INITIALIZING LAB…</p>
      <p className="font-display mt-4 text-6xl tracking-wide sm:text-7xl">
        LAB <span className="text-[#ffd400]">STATION</span>
      </p>
      <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-[#1a1b1e]" role="progressbar" aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-[#ffd400]" style={{ animation: "loadbar 1.3s cubic-bezier(.22,1,.36,1) forwards" }} />
      </div>
      <p className="font-mono-lab mt-4 text-[10px] tracking-[0.3em] text-neutral-500">CALIBRATING FLAVOR // 24°C // LAB-001</p>
      <div className="stripes h-1.5 w-full absolute bottom-0" />
    </div>
  );
}
