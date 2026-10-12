"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useLang } from "./Providers";
import { RESTAURANT } from "@/data/restaurant";
import { Stripes } from "./ui";
import { goTunnel } from "./Tunnel";
import CountUp from "./CountUp";

const Burger3D = dynamic(() => import("./Burger3D"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[320px] animate-pulse rounded-3xl bg-white/5 sm:h-[420px] lg:h-[520px]"
      aria-hidden="true"
    />
  ),
});

// Staggered letter reveal — starts as the loader exits (~1.9s).
function Rise({ text, base }: { text: string; base: number }) {
  return (
    <span className="block" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden="true" className="rise-letter" style={{ animationDelay: `${base + i * 75}ms` }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero({
  explodeRef,
}: {
  explodeRef: React.MutableRefObject<number>;
}) {
  const { t } = useLang();
  const titleRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      explodeRef.current = Math.min(1, y / (window.innerHeight * 0.9));
      if (
        titleRef.current &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        titleRef.current.style.transform = "translateY(" + y * 0.12 + "px)";
        titleRef.current.style.opacity = String(
          Math.max(0, 1 - y / (window.innerHeight * 0.75))
        );
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [explodeRef]);

  const goToMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    goTunnel("menu");
  };

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-24"
      aria-label="Lab Station hero"
    >
      <div
        className="font-mono-lab pointer-events-none absolute left-4 top-20 hidden text-[10px] tracking-[0.3em] text-neutral-500 md:block"
        aria-hidden="true"
      >
        <span className="block">SPECIMEN #001</span>
        <span className="block">TEMP: 24C</span>
        <span className="block">STATUS: ACTIVE</span>
      </div>
      <div
        className="font-mono-lab pointer-events-none absolute right-4 top-20 hidden text-right text-[10px] tracking-[0.3em] text-neutral-500 md:block"
        aria-hidden="true"
      >
        <span className="block">FLAVOR LEVEL: HIGH</span>
        <span className="block">LAB-001 // ARIANA</span>
        <span className="block">36.86N 10.19E</span>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="font-mono-lab mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffd400]/40 bg-[#ffd400]/10 px-4 py-1.5 text-[11px] tracking-[0.3em] text-[#ffd400]">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffd400]"
              aria-hidden="true"
            />
            {t("hero.kicker")}
          </p>
          <h1 ref={titleRef} className="font-display leading-[0.88]">
            <span className="block text-[17vw] sm:text-7xl lg:text-8xl xl:text-[7.5rem]">
              <Rise text="LAB" base={1950} />
            </span>
            <span className="text-glow block text-[17vw] text-[#ffd400] sm:text-7xl lg:text-8xl xl:text-[7.5rem]">
              <Rise text="STATION" base={2175} />
            </span>
            <span className="font-mono-lab mt-4 block text-xs tracking-[0.4em] text-neutral-300 sm:text-sm">
              {t("hero.title1")} {t("hero.title2")}
            </span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-300 sm:text-lg">
            {t("hero.sub")}
          </p>
          <p className="font-mono-lab mt-2 text-[11px] tracking-[0.35em] text-neutral-500">
            {RESTAURANT.categoriesLine}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#menu"
              onClick={goToMenu}
              className="btn-lab font-mono-lab rounded-full px-7 py-3.5 text-[13px] font-bold tracking-[0.2em]"
            >
              {t("hero.cta1")} <span aria-hidden="true">-&gt;</span>
            </Link>
            <Link
              href="#lieu"
              className="btn-ghost font-mono-lab rounded-full px-7 py-3.5 text-[13px] font-bold tracking-[0.2em]"
            >
              {t("hero.cta2")}
            </Link>
          </div>

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {[
              { v: <CountUp to={17} suffix="+" />, l: "BURGERS" },
              { v: <CountUp to={10} />, l: "TACOS" },
              { v: <CountUp to={4.5} decimals={1} />, l: "GOOGLE" },
            ].map(({ v, l }) => (
              <div
                key={l}
                className="metal-panel rounded-lg px-3 py-3 text-center"
              >
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl text-[#ffd400]">{v}</dd>
                <dd className="font-mono-lab text-[10px] tracking-[0.25em] text-neutral-400">
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div
            className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd400]/15 blur-[100px]"
            aria-hidden="true"
          />
          <Burger3D explodeRef={explodeRef} />
          <div
            className="font-mono-lab pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[10px] tracking-[0.3em] text-neutral-400"
            aria-hidden="true"
          >
            <span className="h-px w-8 bg-[#ffd400]/60" />
            <span>DRAG // HOVER TO INSPECT</span>
            <span className="h-px w-8 bg-[#ffd400]/60" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10">
        <div className="overflow-hidden border-y border-[#222] bg-black/60 py-2.5 backdrop-blur">
          <div
            className="animate-marquee flex w-max gap-8 whitespace-nowrap"
            aria-hidden="true"
          >
            {[0, 1].map((k) => (
              <span
                key={k}
                className="font-display text-lg tracking-wider text-neutral-300"
              >
                SMOKED BRISKET{" "}
                <span className="text-[#ffd400]">{"//"}</span> CRISPY CHICKEN{" "}
                <span className="text-[#ffd400]">{"//"}</span> TEXAS RIBS{" "}
                <span className="text-[#ffd400]">{"//"}</span> 100% MEAT{" "}
                <span className="text-[#ffd400]">{"//"}</span> BRISKET LAB{" "}
                <span className="text-[#ffd400]">{"//"}</span> FULL CHEESE{" "}
                <span className="text-[#ffd400]">{"//"}</span> SUPER SPICY{" "}
                <span className="text-[#ffd400]">{"//"}</span>{" "}
              </span>
            ))}
          </div>
        </div>
        <Stripes className="h-2 w-full opacity-80" />
        <p className="font-mono-lab mt-4 text-center text-[10px] tracking-[0.4em] text-neutral-500">
          {t("hero.scroll")}
        </p>
      </div>
    </section>
  );
}
