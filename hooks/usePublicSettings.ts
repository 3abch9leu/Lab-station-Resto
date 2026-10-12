"use client";

import React from "react";
import type { DayHours } from "@/data/hours";

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
      .catch(() => ({}));
  }
  return cache;
}

/** Backend-driven hours/promo/rating with instant static fallback. */
export function usePublicSettings(): PublicSettings {
  const [s, setS] = React.useState<PublicSettings>({});
  React.useEffect(() => {
    let alive = true;
    getPublicSettings().then((v) => {
      if (alive) setS(v);
    });
    return () => {
      alive = false;
    };
  }, []);
  return s;
}
