"use client";

import React from "react";
import { usePublicSettings } from "@/hooks/usePublicSettings";

/** Backend-driven promo toast (managed in /admin → Réglages). */
export default function PromoBanner() {
  const s = usePublicSettings();
  const [dismissed, setDismissed] = React.useState(false);

  if (!s.promo?.active || !s.promo.title || dismissed) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 left-4 z-40 max-w-[320px] rounded-2xl border border-[#ffd400]/50 bg-black/90 p-4 shadow-[0_10px_50px_rgba(255,212,0,0.25)] backdrop-blur-xl md:bottom-6 md:left-6"
    >
      <div className="stripes-thin h-1 w-full rounded" aria-hidden="true" />
      <p className="font-mono-lab mt-2 text-[10px] tracking-[0.3em] text-[#ffd400]">PROMO // LAB</p>
      <p className="font-display mt-1 text-xl leading-tight">{s.promo.title}</p>
      {s.promo.text && <p className="mt-1 text-sm text-neutral-300">{s.promo.text}</p>}
      <div className="mt-3 flex gap-2">
        <a href="#menu" className="btn-lab font-mono-lab flex-1 rounded-full px-4 py-2 text-center text-[11px] font-bold tracking-widest">
          VOIR →
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="font-mono-lab rounded-full border border-[#333] px-4 py-2 text-[11px] tracking-widest text-neutral-400 hover:text-white"
          aria-label="Fermer la promotion"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
