"use client";
import React from "react";

export function Stripes({ className = "", thin = false }: { className?: string; thin?: boolean }) {
  return (
    <div aria-hidden className={`${thin ? "stripes-thin" : "stripes"} ${className}`} />
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionHead({ code, title, sub }: { code: string; title: string; sub: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3">
        <span className="font-mono-lab text-[11px] tracking-[0.3em] text-[#ffd400]">{code}</span>
        <span className="h-px w-16 bg-[#ffd400]/60" />
        <span className="font-mono-lab text-[11px] tracking-[0.3em] text-neutral-400">STATUS: ACTIVE</span>
      </div>
      <h2 className="font-display mt-3 text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
        {title}
      </h2>
      <p className="font-mono-lab mt-3 text-xs tracking-[0.25em] text-neutral-400">{sub}</p>
    </div>
  );
}
