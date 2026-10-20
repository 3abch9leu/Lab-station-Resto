"use client";

import React from "react";
import { MENU, type MenuItem } from "@/data/menu";
import { applyDemo } from "@/lib/demo-store";

/**
 * Live menu: API first (real database), static data as fallback, with any
 * demo-mode overrides applied on top. Re-syncs when the admin changes
 * something in the same browser (custom event) or another tab (storage).
 */
export function useLiveMenu(): { items: MenuItem[]; source: string; demo: boolean } {
  const [items, setItems] = React.useState<MenuItem[]>(MENU);
  const [source, setSource] = React.useState("static");
  const [demo, setDemo] = React.useState(false);

  React.useEffect(() => {
    let alive = true;

    const load = () => {
      fetch("/api/menu", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { items?: MenuItem[]; source?: string } | null) => {
          if (!alive) return;
          const base = d?.items?.length ? d.items : MENU;
          const merged = applyDemo(base);
          setItems(merged);
          setSource(d?.source ?? "static");
          setDemo(d?.source === "static");
        })
        .catch(() => {
          if (!alive) return;
          setItems(applyDemo(MENU));
          setSource("static");
          setDemo(true);
        });
    };

    load();
    const onChange = () => load();
    window.addEventListener("lab:demo-update", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      alive = false;
      window.removeEventListener("lab:demo-update", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return { items, source, demo };
}
