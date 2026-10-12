"use client";
import React from "react";
import Image from "next/image";
import { Reveal, SectionHead, Stripes } from "./ui";
import { useLang } from "./Providers";
import { PHOTO_CREDITS } from "@/data/menu";

const W = "https://thumb.wikimedia.org/wikipedia/commons/thumb";

const SHOTS = [
  { src: `${W}/9/9a/French_tacos_from_French_Tacos_on_London_Road.jpg/960px-French_tacos_from_French_Tacos_on_London_Road.jpg`, label: "TACOS", span: "tall" },
  { src: `${W}/2/26/Hickory_Hillz_BBQ_-_May_2022_-_Sarah_Stierch_05.jpg/960px-Hickory_Hillz_BBQ_-_May_2022_-_Sarah_Stierch_05.jpg`, label: "SMOKED MEAT", span: "" },
  { src: `${W}/d/d6/Princes_hot_chicken.jpg/960px-Princes_hot_chicken.jpg`, label: "NASHVILLE HOT", span: "" },
  { src: `${W}/d/d5/French_tacos_from_Morocco.jpg/960px-French_tacos_from_Morocco.jpg`, label: "TACOS", span: "wide" },
  { src: `${W}/3/34/Cheesesteak_%2819386149993%29.jpg/960px-Cheesesteak_%2819386149993%29.jpg`, label: "PHILLY", span: "" },
  { src: `${W}/3/3a/Tacos_al_pastor.jpg/960px-Tacos_al_pastor.jpg`, label: "TACOS", span: "tall" },
  { src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop", label: "BURGERS", span: "" },
  { src: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1000&auto=format&fit=crop", label: "SIDES", span: "" },
];

export default function Gallery() {
  const { lang } = useLang();
  return (
    <section id="galerie" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6" aria-label="Galerie">
      <SectionHead code="PROTOCOLE 03 // GALERIE" title={lang === "ar" ? "المعرض" : "GALERIE"} sub="BURGERS • TACOS • SMOKED • THE LAB" />
      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4">
        {SHOTS.map((s, i) => (
          <Reveal
            key={i}
            delay={(i % 4) * 70}
            className={`${s.span === "tall" ? "row-span-2" : ""} ${s.span === "wide" ? "col-span-2" : ""}`}
          >
            <figure className="group relative h-full min-h-[180px] overflow-hidden rounded-xl border border-[#222]">
              <Image
                src={s.src}
                alt={`Lab Station — ${s.label}`}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" aria-hidden="true" />
              <figcaption className="font-mono-lab absolute bottom-3 left-3 flex items-center gap-2 text-[10px] tracking-[0.3em] text-white">
                <span className="h-1.5 w-1.5 bg-[#ffd400]" aria-hidden="true" /> {s.label}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <p className="font-mono-lab mt-4 text-center text-[10px] tracking-[0.25em] text-neutral-600">{PHOTO_CREDITS}</p>
      <Stripes className="mt-12 h-2 opacity-70 stripes-fade" thin />
    </section>
  );
}
