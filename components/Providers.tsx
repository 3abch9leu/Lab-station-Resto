"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/data/i18n";
import { STRINGS } from "@/data/i18n";
import type { MenuItem } from "@/data/menu";
import { MENU } from "@/data/menu";

function readLang(): Lang {
  try {
    const l = localStorage.getItem("lab-lang");
    if (l === "fr" || l === "en" || l === "ar") return l;
  } catch {}
  return "fr";
}

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem("lab-cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { id: string; qty: number }[];
    return parsed
      .map((p) => {
        const item = MENU.find((m) => m.id === p.id);
        return item ? { item, qty: Math.max(1, Math.min(20, p.qty)) } : null;
      })
      .filter(Boolean) as CartLine[];
  } catch {
    return [];
  }
}

// ---------- Language ----------
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "fr",
  setLang: () => {},
  t: (k) => k,
});
export const useLang = () => useContext(LangCtx);

// ---------- Cart ----------
export interface CartLine { item: MenuItem; qty: number; note?: string }
const CartCtx = createContext<{
  lines: CartLine[];
  add: (item: MenuItem, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
}>({
  lines: [], add: () => {}, remove: () => {}, setQty: () => {}, clear: () => {},
  total: 0, count: 0, open: false, setOpen: () => {},
});
export const useCart = () => useContext(CartCtx);

// ---------- Modal (selected menu item) ----------
const ModalCtx = createContext<{ selected: MenuItem | null; setSelected: (m: MenuItem | null) => void }>({
  selected: null, setSelected: () => {},
});
export const useModal = () => useContext(ModalCtx);

export function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: initial state is intentionally the default on BOTH server and first
  // client render. Reading localStorage in the initializer caused a hydration
  // mismatch for returning visitors. Persisted prefs hydrate in a microtask
  // after mount (before paint), and the persist effect is guarded so it never
  // overwrites storage with defaults before hydration runs.
  const [lang, setLang] = useState<Lang>("fr");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    const run = () => {
      setLang(readLang());
      setLines(readCart());
      hydrated.current = true;
    };
    if (typeof queueMicrotask === "function") queueMicrotask(run);
    else setTimeout(run, 0);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem("lab-cart", JSON.stringify(lines.map((l) => ({ id: l.item.id, qty: l.qty }))));
    } catch {}
  }, [lines]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("lab-lang", lang); } catch {}
  }, [lang]);

  // Lenis smooth scrolling (disabled for reduced motion)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: { destroy: () => void; raf: (t: number) => void } | null = null;
    let raf = 0;
    (async () => {
      try {
        const Lenis = (await import("lenis")).default;
        lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
        const loop = (t: number) => {
          lenis?.raf(t);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      } catch {}
    })();
    return () => {
      cancelAnimationFrame(raf);
      try { lenis?.destroy(); } catch {}
    };
  }, []);

  const t = useCallback((k: string) => STRINGS[lang][k] ?? STRINGS.fr[k] ?? k, [lang]);

  const add = useCallback((item: MenuItem, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.item.id === item.id);
      if (found) return prev.map((l) => (l.item.id === item.id ? { ...l, qty: Math.min(20, l.qty + qty) } : l));
      return [...prev, { item, qty }];
    });
  }, []);
  const remove = useCallback((id: string) => setLines((p) => p.filter((l) => l.item.id !== id)), []);
  const setQty = useCallback((id: string, qty: number) => {
    setLines((p) => (qty <= 0 ? p.filter((l) => l.item.id !== id) : p.map((l) => (l.item.id === id ? { ...l, qty } : l))));
  }, []);
  const clear = useCallback(() => setLines([]), []);
  const total = useMemo(() => lines.reduce((s, l) => s + (l.item.price ?? 0) * l.qty, 0), [lines]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const langVal = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  const cartVal = useMemo(
    () => ({ lines, add, remove, setQty, clear, total, count, open, setOpen }),
    [lines, add, remove, setQty, clear, total, count, open]
  );
  const modalVal = useMemo(() => ({ selected, setSelected }), [selected]);

  return (
    <LangCtx.Provider value={langVal}>
      <CartCtx.Provider value={cartVal}>
        <ModalCtx.Provider value={modalVal}>{children}</ModalCtx.Provider>
      </CartCtx.Provider>
    </LangCtx.Provider>
  );
}
