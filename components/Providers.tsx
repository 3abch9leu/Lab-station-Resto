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
    const parsed = JSON.parse(raw) as {
      id: string;
      qty: number;
      size?: string;
      sizePrice?: number;
      sauces?: string[];
      extras?: CartExtra[];
    }[];
    return parsed
      .map((p) => {
        const item = MENU.find((m) => m.id === p.id);
        if (!item) return null;
        const options: CartOptions | undefined =
          p.size || p.sauces?.length || p.extras?.length
            ? { size: p.size, sizePrice: p.sizePrice, sauces: p.sauces, extras: p.extras }
            : undefined;
        return { item, qty: Math.max(1, Math.min(20, p.qty)), options };
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
export interface CartExtra { id: string; name: string; price: number }
export interface CartOptions {
  size?: string;         // "L" | "2XL"
  sizePrice?: number;
  sauces?: string[];     // sauce ids
  extras?: CartExtra[];
}
export interface CartLine {
  item: MenuItem;
  qty: number;
  options?: CartOptions;
}
/** Unit price of a line = chosen size price (or base) + extras. */
export const lineUnitPrice = (l: CartLine) =>
  (l.options?.sizePrice ?? l.item.price ?? 0) +
  (l.options?.extras ?? []).reduce((s, e) => s + e.price, 0);

const CartCtx = createContext<{
  lines: CartLine[];
  add: (item: MenuItem, qty?: number, options?: CartOptions) => void;
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
      localStorage.setItem(
        "lab-cart",
        JSON.stringify(
          lines.map((l) => ({
            id: l.item.id,
            qty: l.qty,
            size: l.options?.size,
            sizePrice: l.options?.sizePrice,
            sauces: l.options?.sauces,
            extras: l.options?.extras,
          }))
        )
      );
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

  // Lines are keyed by item + chosen options, so "L" and "2XL" (or different
  // sauces) stay separate lines in the cart.
  const lineKey = (item: MenuItem, o?: CartOptions) =>
    [item.id, o?.size ?? "", (o?.sauces ?? []).slice().sort().join("+"), (o?.extras ?? []).map((e) => e.id).sort().join("+")].join("|");

  const add = useCallback((item: MenuItem, qty = 1, options?: CartOptions) => {
    const key = lineKey(item, options);
    setLines((prev) => {
      const found = prev.find((l) => lineKey(l.item, l.options) === key);
      if (found) return prev.map((l) => (lineKey(l.item, l.options) === key ? { ...l, qty: Math.min(20, l.qty + qty) } : l));
      return [...prev, { item, qty, options }];
    });
  }, []);
  const remove = useCallback(
    (id: string) => setLines((p) => p.filter((l) => lineKey(l.item, l.options) !== id)),
    []
  );
  const setQty = useCallback((id: string, qty: number) => {
    setLines((p) =>
      qty <= 0
        ? p.filter((l) => lineKey(l.item, l.options) !== id)
        : p.map((l) => (lineKey(l.item, l.options) === id ? { ...l, qty } : l))
    );
  }, []);
  const clear = useCallback(() => setLines([]), []);
  const total = useMemo(() => lines.reduce((s, l) => s + lineUnitPrice(l) * l.qty, 0), [lines]);
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
