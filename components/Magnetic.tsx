"use client";

import React from "react";

/** Magnetic hover — child drifts toward the pointer, snaps back on leave. */
export default function Magnetic({
  children,
  strength = 22,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${((x / r.width) * strength).toFixed(1)}px, ${((y / r.height) * strength).toFixed(1)}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`inline-block transition-transform duration-200 ease-out ${className}`}>
      {children}
    </div>
  );
}
