"use client";

import type { MenuItem } from "@/data/menu";

/**
 * Demo store — used when the deployment has no database (e.g. the public
 * Vercel demo). Edits made in /admin are stored in the visitor's browser and
 * applied instantly to the public menu, so the full "owner changes a price →
 * the site updates" flow is demonstrable without a backend.
 *
 * With a real database the API is used instead and this store stays empty.
 */

export interface DemoState {
  overrides: Record<string, Partial<MenuItem>>;
  created: MenuItem[];
  deleted: string[];
  settings: Record<string, unknown>;
}

const KEY = "lab-demo-state";
export const DEMO_EVENT = "lab:demo-update";

const EMPTY: DemoState = { overrides: {}, created: [], deleted: [], settings: {} };

export function loadDemo(): DemoState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return {
      overrides: parsed.overrides ?? {},
      created: parsed.created ?? [],
      deleted: parsed.deleted ?? [],
      settings: parsed.settings ?? {},
    };
  } catch {
    return EMPTY;
  }
}

export function saveDemo(next: DemoState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new Event(DEMO_EVENT));
}

export function isDemoActive() {
  return Object.keys(loadDemo().overrides).length > 0 || loadDemo().created.length > 0;
}

/** Apply demo overrides + created/deleted items to a base list. */
export function applyDemo(items: MenuItem[]): MenuItem[] {
  const d = loadDemo();
  if (!d.overrides && !d.created.length && !d.deleted.length) {
    if (!Object.keys(d.overrides).length && !d.created.length && !d.deleted.length) return items;
  }
  const deleted = new Set(d.deleted);
  const out = items
    .filter((i) => !deleted.has(i.id))
    .map((i) => (d.overrides[i.id] ? { ...i, ...d.overrides[i.id] } : i));
  for (const c of d.created) {
    if (!out.some((i) => i.id === c.id)) out.push(c);
  }
  return out;
}

/** Apply demo settings over API settings. */
export function applyDemoSettings<T extends Record<string, unknown>>(apiSettings: T): T {
  const d = loadDemo();
  if (!Object.keys(d.settings).length) return apiSettings;
  return { ...apiSettings, ...d.settings } as T;
}
