"use client";
import React from "react";
import Image from "next/image";
import { MENU, itemImage } from "@/data/menu";
import { useCart, useModal } from "./Providers";
import { Reveal, SectionHead } from "./ui";

const PICKS = ["cent-pourcent-meat", "texas-ribs", "brisket-lab-burger", "tacos-brisket"];

export default function Experiment() {
  const { add, setOpen } = useCart();
  const { setSelected } = useModal();
  const items = PICKS.map((id) => MENU.find((m) => m.id === id)!).filter(Boolean);

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-label="The Experiment — signatures">
      <SectionHead code="PROTOCOLE 04 // THE EXPERIMENT" title="SIGNATURES" sub="100% MEAT • TEXAS RIBS • BRISKET LAB • FULL CHEESE" />
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((m, i) => (
          <Reveal key={m.id} delay={i * 90}>
            <article className="lab-card group relative overflow-hidden rounded-2xl border border-[#222] bg-[#0c0d0f]">
              <div className="relative h-72 sm:h-80">
                <Image src={itemImage(m)} alt={`${m.name} — Lab Station`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, 50vw" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" aria-hidden />
                <span className="font-mono-lab absolute left-4 top-4 rounded bg-[#ffd400] px-2.5 py-1 text-[10px] font-bold tracking-[0.25em] text-black">
                  EXP-{String(i + 1).padStart(2, "0")}
                </span>
                <span className="price-badge font-display absolute right-4 top-4 grid h-20 w-20 rotate-6 place-items-center rounded-full text-lg transition-transform group-hover:scale-110">
                  {m.price?.toFixed(1)}<span className="text-xs">DT</span>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-4xl leading-none sm:text-5xl">{m.name}</h3>
                  <p className="mt-2 max-w-md text-sm text-neutral-300">{m.ingredients.slice(0, 5).join(" • ")}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setSelected(m)} className="font-mono-lab rounded-full border border-white/30 px-5 py-2.5 text-[12px] tracking-widest backdrop-blur hover:border-[#ffd400] hover:text-[#ffd400]">
                      VOIR
                    </button>
                    <button onClick={() => { add(m); setOpen(true); }} className="btn-lab font-mono-lab rounded-full px-5 py-2.5 text-[12px] font-bold tracking-widest">
                      + AJOUTER
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
