"use client";

import React from "react";

/** Signature lab-tunnel transition. Trigger anywhere with `goTunnel("menu")`. */
export function goTunnel(targetId: string) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  window.dispatchEvent(new CustomEvent<string>("lab:tunnel", { detail: targetId }));
}

export default function Tunnel() {
  const [phase, setPhase] = React.useState<"idle" | "in" | "hold" | "out">("idle");
  const [label, setLabel] = React.useState("MENU");

  React.useEffect(() => {
    const timers: number[] = [];
    const onGo = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!id) return;
      setLabel(id.replace("#", "").toUpperCase());
      setPhase("in");
      timers.push(
        window.setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
          setPhase("hold");
        }, 500)
      );
      timers.push(window.setTimeout(() => setPhase("out"), 720));
      timers.push(window.setTimeout(() => setPhase("idle"), 1250));
    };
    window.addEventListener("lab:tunnel", onGo);
    return () => {
      window.removeEventListener("lab:tunnel", onGo);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  if (phase === "idle") return null;
  const big = phase === "out";
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#050505] transition-all duration-500 ${
        phase === "in" ? "scale-100 opacity-100" : phase === "hold" ? "scale-105 opacity-100" : "scale-125 opacity-0"
      } ${big ? "pointer-events-none" : ""}`}
    >
      <div className="stripes absolute inset-x-0 top-0 h-3" />
      <div className="stripes absolute inset-x-0 bottom-0 h-3" />
      <p className="font-mono-lab text-[11px] tracking-[0.5em] text-[#ffd400]">TRANSIT // LABORATORY TUNNEL</p>
      <p className="font-display mt-4 text-6xl tracking-wide sm:text-8xl">
        {label === "MENU" ? <>LE <span className="text-[#ffd400]">MENU</span></> : label}
      </p>
      <div className="mt-6 h-1.5 w-56 overflow-hidden rounded-full bg-[#1c1e21]">
        <div className={`h-full bg-[#ffd400] transition-all ${phase === "in" ? "w-full duration-500" : "w-0"}`} />
      </div>
    </div>
  );
}
