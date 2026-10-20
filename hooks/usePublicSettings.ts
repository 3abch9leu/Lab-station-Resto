"use client";

import React from "react";
import type { DayHours } from "@/data/hours";
import { applyDemoSettings } from "@/lib/demo-store";

export interface PublicSettings {
  hours?: DayHours[];
  promo?: { active: boolean; title: string; text: string };
  restaurant?: { rating: number; reviewCount: number };
}

// Shared cached promise — one network request no matter how many components ask.
let cache: Promise<PublicSettings> | null = null;

export function getPublicSettings(): Promise<PublicSettings> {
  if (!cache) {
    cache = fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<PublicSettings>) : {}))
      .then((s) => applyDemoSettings(s as Record<string, unknown>) as PublicSettings)
      .catch(() => ({}));
  }
  return cache;
}

/** Backend-driven hours/promo/rating with instant static fallback. */
export function usePublicSettings(): PublicSettings {
  const [s, setS] = React.useState<PublicSettings>({});
  React.useEffect(() => {
    let alive = true;
    const load = () => {
      getPublicSettings().then((v) => {
        if (alive) setS(v);
      });
    };
    load();
    const onChange = () => {
      cache = null;
      load();
    };
    window.addEventListener("lab:demo-update", onChange);
    return () => {
      alive = false;
      window.removeEventListener("lab:demo-update", onChange);
    };
  }, []);
  return s;
}
