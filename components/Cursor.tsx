"use client";

import React from "react";

/** Lab crosshair cursor — desktop fine-pointers only, never on touch/reduced-motion. */
export default function Cursor() {
  const dot = React.useRef<HTMLDivElement>(null);
  const ring = React.useRef<HTMLDivElement>(null);
  // NOTE: starts false on BOTH server and first client render (no hydration
  // mismatch), then enables in a microtask after mount on fine pointers only.
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const activate = () => setEnabled(true);
    if (typeof queueMicrotask === "function") queueMicrotask(activate);
    else setTimeout(activate, 0);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("lab-cursor");
    const target = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };
    const hot = { v: false };
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
      if (dot.current) dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const t = e.target as HTMLElement | null;
      hot.v = !!t?.closest("a, button, [role='button'], input, select, textarea, [data-hot]");
    };
    const onLeave = () => {
      visible = false;
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px) scale(${hot.v ? 1.9 : 1})`;
        ring.current.style.borderColor = hot.v ? "#ffd400" : "rgba(255,212,0,0.45)";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("lab-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95]">
      <div ref={ring} className="absolute left-0 top-0 opacity-0 transition-opacity" style={{ transform: "translate(-100px,-100px)" }}>
        <span className="block h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[border-color] duration-200" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 opacity-0 transition-opacity" style={{ transform: "translate(-100px,-100px)" }}>
        <span className="relative block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd400]">
          <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-[#ffd400]/60" />
          <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-[#ffd400]/60" />
        </span>
      </div>
    </div>
  );
}
