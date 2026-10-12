"use client";
import React from "react";
import { Reveal, SectionHead } from "./ui";
import { useLang } from "./Providers";

const STEPS = [
  { n: "01", title: "SÉLECTION", fr: "Viandes fraîches, brisket & ribs préparés lentement. Rien n'entre au labo sans contrôle.", en: "Fresh meats, slow-prepped brisket & ribs. Nothing enters the lab unchecked." },
  { n: "02", title: "FUMAGE", fr: "Fumage basse température : le goût profond, la texture fondante.", en: "Low & slow smoke: deep flavor, melt-in-mouth texture." },
  { n: "03", title: "ASSEMBLAGE", fr: "Buns toastés, sauces Lab, cheddar affiné, oignons caramélisés.", en: "Toasted buns, Lab sauces, aged cheddar, caramelized onions." },
  { n: "04", title: "RÉSULTAT", fr: "Servi chaud, généreux, photographié avant d'être dévoré.", en: "Served hot, generous, photographed before devoured." },
];

export default function AboutLab() {
  const { lang, t } = useLang();
  const [active, setActive] = React.useState(1);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / r.height));
      setActive(Math.min(3, Math.floor(p * 4)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="lab" ref={ref} className="relative z-10 scroll-mt-24 border-y border-[#1c1e21] bg-[#08080a]/80 py-20 backdrop-blur" aria-label={t("nav.about")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead code="PROTOCOLE 01 // THE LAB" title={t("about.title")} sub="INGRÉDIENT → PRÉPARATION → BURGER → RÉSULTAT" />
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="max-w-xl text-lg leading-relaxed text-neutral-300">
                {lang === "en"
                  ? "Lab Station is not another burger spot. It is a food laboratory on Avenue Hédi Nouira, Ariana — where premium burgers, signature tacos and smoked meats are engineered like experiments."
                  : lang === "ar"
                    ? "لاب ستايشن ليس مطعم برجر عادي. إنه مختبر طعام في شارع الهادي نويرة، أريانة — حيث تُصنع البرجر والتاكوس واللحوم المدخنة كتجارب دقيقة."
                    : "Lab Station n'est pas un énième spot à burgers. C'est un laboratoire culinaire sur l'Avenue Hédi Nouira à l'Ariana — où burgers premium, tacos signatures et viandes fumées sont assemblés comme des expériences."}
              </p>
            </Reveal>
            <ol className="mt-8 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s.n}>
                  <button
                    onClick={() => setActive(i)}
                    aria-current={active === i}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${active === i ? "border-[#ffd400]/70 bg-[#ffd400]/10 glow-lab" : "border-[#222] bg-[#101112] hover:border-[#444]"}`}
                  >
                    <span className={`font-display text-3xl ${active === i ? "text-[#ffd400]" : "text-neutral-600"}`}>{s.n}</span>
                    <span>
                      <span className="font-display block tracking-wide">{s.title}</span>
                      <span className="block text-sm text-neutral-400">{lang === "en" ? s.en : s.fr}</span>
                    </span>
                    {active === i && <span className="font-mono-lab ms-auto text-[10px] tracking-widest text-[#ffd400]">● ACTIVE</span>}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Workstation visual */}
          <Reveal delay={120} className="relative">
            <div className="metal-panel relative overflow-hidden rounded-2xl p-6 sm:p-8" aria-hidden>
              <div className="font-mono-lab flex justify-between text-[10px] tracking-[0.3em] text-neutral-500">
                <span>STATION-07</span><span className="text-[#ffd400]">● REC</span>
              </div>
              {/* progress */}
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#222]">
                <div className="h-full rounded-full bg-[#ffd400] transition-all duration-700" style={{ width: `${((active + 1) / 4) * 100}%` }} />
              </div>
              {/* burger assembly schematic */}
              <div className="mt-8 flex flex-col items-center gap-1.5 py-4">
                {[
                  { w: "w-56", c: "bg-[#e0a458]", l: "TOP BUN" },
                  { w: "w-64", c: "bg-[#5da23a]", l: "LETTUCE" },
                  { w: "w-52", c: "bg-[#c1272d]", l: "TOMATO" },
                  { w: "w-72", c: "bg-[#ffb300]", l: "CHEESE" },
                  { w: "w-64", c: "bg-[#4a2410]", l: "PATTY / BRISKET" },
                  { w: "w-56", c: "bg-[#d99a4e]", l: "BOTTOM BUN" },
                ].map((b, i) => (
                  <div
                    key={b.l}
                    className={`flex ${b.w} items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ${b.c} ${i <= 1 + active ? "translate-x-0 opacity-100" : "translate-x-8 opacity-30"}`}
                    style={{ transform: `translateX(${(i - active) * (active >= i ? 0 : 14)}px)` }}
                  >
                    <span className="font-mono-lab text-[10px] font-bold tracking-widest text-black/80">{b.l}</span>
                    <span className="font-mono-lab text-[10px] text-black/60">0{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="font-mono-lab mt-4 flex justify-between text-[10px] tracking-[0.25em] text-neutral-500">
                <span>TEMP 182°C</span><span>FLAVOR: HIGH</span><span>EXPERIMENT {(active + 1) * 25}%</span>
              </div>
              <div className="stripes mt-5 h-2 w-full opacity-80" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
