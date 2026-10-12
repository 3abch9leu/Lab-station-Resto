"use client";

import React from "react";
import Image from "next/image";

/**
 * Realistic hero visual — a living food photo (GIF-like) instead of a
 * procedural 3D model: levitating burger emblem with slow zoom, rising
 * steam, orbiting lab rings, mouse-tilt depth and scroll response.
 * Same props as before so <Hero/> needs no changes.
 */
const BURGER_IMG =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop";

const CHIPS = [
  { label: "SMOKED BRISKET", left: "2%", top: "16%", depth: 26, delay: "0s" },
  { label: "CHEDDAR FONDU", left: "80%", top: "28%", depth: 42, delay: "1.4s" },
  { label: "CRISPY CHICKEN", left: "6%", top: "70%", depth: 34, delay: "2.2s" },
  { label: "TEXAS RIBS", left: "76%", top: "72%", depth: 22, delay: "0.7s" },
];

export default function Burger3D({
  explodeRef,
}: {
  explodeRef?: React.MutableRefObject<number>;
}) {
  const zone = React.useRef<HTMLDivElement>(null);
  const tilt = React.useRef<HTMLDivElement>(null);
  const rise = React.useRef<HTMLDivElement>(null);
  const chips = React.useRef<(HTMLDivElement | null)[]>([]);
  const target = React.useRef({ x: 0, y: 0 });
  const cur = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const loop = () => {
      cur.current.x += (target.current.x - cur.current.x) * 0.06;
      cur.current.y += (target.current.y - cur.current.y) * 0.06;
      const { x, y } = cur.current;
      if (tilt.current) {
        tilt.current.style.transform =
          "rotateX(" + (-y * 14).toFixed(2) + "deg) rotateY(" + (x * 16).toFixed(2) + "deg)";
      }
      chips.current.forEach((el) => {
        if (!el) return;
        const d = Number(el.dataset.depth ?? 24);
        el.style.translate = (x * d).toFixed(1) + "px " + (-y * d).toFixed(1) + "px";
      });
      const e = explodeRef?.current ?? 0;
      if (rise.current) {
        rise.current.style.transform =
          "translateY(" + (-e * 60).toFixed(1) + "px) scale(" + (1 + e * 0.12).toFixed(3) + ")";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [explodeRef]);

  const onMove = (e: React.PointerEvent) => {
    const r = zone.current?.getBoundingClientRect();
    if (!r) return;
    target.current.x = (e.clientX - r.left) / r.width - 0.5;
    target.current.y = (e.clientY - r.top) / r.height - 0.5;
  };
  const onLeave = () => {
    target.current.x = 0;
    target.current.y = 0;
  };

  return (
    <div
      ref={zone}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative h-[340px] w-full sm:h-[440px] lg:h-[540px]"
      style={{ perspective: "1100px" }}
      role="img"
      aria-label="Burger signature Lab Station — viande fumée, cheddar fondant"
    >
      {/* halo */}
      <div
        className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd400]/20 blur-[90px]"
        aria-hidden="true"
      />

      <div ref={tilt} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {/* orbiting rings */}
        <div
          className="animate-spin-slow absolute left-1/2 top-1/2 h-[86%] max-h-[460px] w-[86%] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#ffd400]/50"
          aria-hidden="true"
        />
        <div
          className="animate-spin-slow absolute left-1/2 top-1/2 h-[100%] max-h-[520px] w-[100%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          style={{ animationDirection: "reverse", animationDuration: "40s" }}
          aria-hidden="true"
        />
        {/* orbit dots */}
        <span
          className="absolute left-1/2 top-[4%] h-2.5 w-2.5 rounded-full bg-[#ffd400] glow-lab"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-[8%] left-[12%] h-1.5 w-1.5 rounded-full bg-white/70"
          aria-hidden="true"
        />

        <div ref={rise} className="absolute inset-0">
          <div className="animate-floaty absolute left-1/2 top-1/2 h-[68%] max-h-[380px] w-[68%] max-w-[380px] -translate-x-1/2 -translate-y-1/2">
            {/* burger photo emblem */}
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-[#ffd400] shadow-[0_0_80px_rgba(255,212,0,0.35),0_30px_80px_rgba(0,0,0,0.8)]">
              <Image
                src={BURGER_IMG}
                alt=""
                fill
                sizes="(max-width: 768px) 80vw, 32vw"
                priority
                className="animate-kenburns object-cover"
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 35%, transparent 55%, rgba(0,0,0,0.55) 100%)",
                }}
                aria-hidden="true"
              />
            </div>

            {/* steam */}
            <div className="pointer-events-none absolute -top-2 left-1/2 h-full w-1/2 -translate-x-1/2" aria-hidden="true">
              <span
                className="animate-steam absolute left-[30%] top-[30%] h-16 w-8 rounded-full bg-white/25 blur-md"
              />
              <span
                className="animate-steam absolute left-[60%] top-[36%] h-12 w-6 rounded-full bg-white/20 blur-md"
                style={{ animationDelay: "1.6s" }}
              />
              <span
                className="animate-steam absolute left-[45%] top-[28%] h-20 w-7 rounded-full bg-white/15 blur-lg"
                style={{ animationDelay: "3s" }}
              />
            </div>

            {/* price badge */}
            <div
              className="price-badge font-display absolute -right-3 top-4 grid h-24 w-24 rotate-12 place-items-center rounded-full text-center text-xl leading-tight sm:h-28 sm:w-28"
              aria-hidden="true"
            >
              <span>
                16.9
                <span className="block text-xs">DT ★</span>
              </span>
            </div>
            {/* specimen tag */}
            <div
              className="font-mono-lab absolute -left-2 bottom-6 rounded bg-black/80 px-3 py-1.5 text-[10px] tracking-[0.25em] text-[#ffd400] backdrop-blur"
              aria-hidden="true"
            >
              LAB-001 {"//"} SIGNATURE
            </div>
          </div>
        </div>

        {/* floating ingredient chips */}
        {CHIPS.map((c, i) => (
          <div
            key={c.label}
            ref={(el) => {
              chips.current[i] = el;
            }}
            data-depth={c.depth}
            className="animate-floaty absolute"
            style={{ left: c.left, top: c.top, animationDelay: c.delay }}
            aria-hidden="true"
          >
            <span className="font-mono-lab flex items-center gap-2 whitespace-nowrap rounded-full border border-[#ffd400]/40 bg-black/75 px-3.5 py-2 text-[10px] tracking-[0.2em] text-white shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd400]" />
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
