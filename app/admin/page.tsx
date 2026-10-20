"use client";

import React from "react";
import Link from "next/link";
import { MENU, type MenuItem } from "@/data/menu";
import { HOURS as STATIC_HOURS, type DayHours } from "@/data/hours";
import { loadDemo, saveDemo, applyDemo } from "@/lib/demo-store";

interface OrderRow {
  id: string;
  customer: string;
  phone: string;
  type: string;
  address: string;
  lines: { id: string; qty: number }[];
  total: number;
  status: string;
  createdAt: string;
}

const STATUSES = ["new", "preparing", "ready", "done", "cancelled"] as const;

async function api(path: string, init?: RequestInit) {
  const r = await fetch(path, { headers: { "Content-Type": "application/json" }, ...init });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((data as { error?: string }).error || `HTTP ${r.status}`);
  return data as Record<string, unknown>;
}

function OrdersTab({ demo }: { demo: boolean }) {
  const [orders, setOrders] = React.useState<OrderRow[]>([]);
  const [err, setErr] = React.useState("");

  const load = React.useCallback(() => {
    if (demo) {
      setErr("");
      setOrders([]);
      return;
    }
    api("/api/orders?limit=50")
      .then((d) => setOrders((d.orders as OrderRow[]) ?? []))
      .catch((e: Error) => setErr(e.message));
  }, [demo]);

  React.useEffect(() => {
    if (demo) return;
    const id = window.setInterval(load, 15000);
    return () => window.clearInterval(id);
  }, [load, demo]);

  const setStatus = (id: string, status: string) => {
    api(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
      .then(() => setOrders((p) => p.map((o) => (o.id === id ? { ...o, status } : o))))
      .catch((e: Error) => setErr(e.message));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-mono-lab text-xs tracking-[0.3em] text-neutral-400">
          COMMANDES ({orders.length}) {demo ? "// DÉMO — ACTIVE APRÈS BRANCHEMENT DE LA BASE" : "// AUTO-REFRESH 15s"}
        </h2>
        <button onClick={load} className="font-mono-lab rounded-full border border-[#333] px-4 py-1.5 text-[11px] tracking-widest hover:border-[#ffd400] hover:text-[#ffd400]">
          RAFRAÎCHIR
        </button>
      </div>
      {err && <p className="mt-2 text-sm text-red-400" role="alert">{err}</p>}
      <div className="mt-4 grid gap-3">
        {orders.length === 0 && (
          <p className="rounded-xl border border-dashed border-[#333] p-8 text-center text-neutral-400">
            {demo
              ? "Les commandes en temps réel s'afficheront ici une fois la base de données connectée (déploiement en 2 minutes sur Vercel + Neon/Supabase)."
              : "Aucune commande pour le moment."}
          </p>
        )}
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-[#26282c] bg-[#101112] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`font-mono-lab rounded-full px-3 py-1 text-[11px] font-bold tracking-widest ${o.status === "new" ? "bg-[#ffd400] text-black" : "bg-[#222] text-neutral-300"}`}>
                {o.status.toUpperCase()}
              </span>
              <span className="font-display text-xl">{o.customer || "—"} <span className="text-sm text-neutral-400">{o.phone}</span></span>
              <span className="font-mono-lab ms-auto text-[11px] text-neutral-500">
                {new Date(o.createdAt).toLocaleString("fr-FR")} • {o.type}
              </span>
            </div>
            <ul className="mt-2 text-sm text-neutral-300">
              {o.lines.map((l, i) => (
                <li key={i}>{l.qty}× {l.id}</li>
              ))}
            </ul>
            {o.address && <p className="mt-1 text-sm text-neutral-400">📍 {o.address}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="font-display text-2xl text-[#ffd400]">{o.total.toFixed(1)} DT</span>
              <span className="ms-auto flex flex-wrap gap-1.5">
                {STATUSES.filter((s) => s !== o.status).map((s) => (
                  <button key={s} onClick={() => setStatus(o.id, s)} className="font-mono-lab rounded-full border border-[#333] px-3 py-1 text-[11px] tracking-widest hover:border-[#ffd400] hover:text-[#ffd400]">
                    → {s}
                  </button>
                ))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuTab({ demo }: { demo: boolean }) {
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const [err, setErr] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const [draft, setDraft] = React.useState({ id: "", name: "", category: "burgers", price: "" });

  const load = React.useCallback(() => {
    if (demo) {
      setItems(applyDemo(MENU));
      return;
    }
    api("/api/admin/menu")
      .then((d) => setItems((d.items as MenuItem[]) ?? []))
      .catch((e: Error) => setErr(e.message));
  }, [demo]);

  React.useEffect(() => {
    // Deferred so state updates never happen synchronously inside the effect.
    queueMicrotask(load);
  }, [load]);

  const patch = (id: string, body: object) => {
    if (demo) {
      const d = loadDemo();
      d.overrides[id] = { ...(d.overrides[id] || {}), ...(body as Partial<MenuItem>) };
      saveDemo(d);
      setItems(applyDemo(MENU));
      return;
    }
    api(`/api/admin/menu/${id}`, { method: "PATCH", body: JSON.stringify(body) })
      .then((d) => setItems((p) => p.map((m) => (m.id === id ? (d.item as MenuItem) : m))))
      .catch((e: Error) => setErr(e.message));
  };

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const id = draft.id.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    if (demo) {
      const d = loadDemo();
      d.created = [
        ...d.created.filter((x) => x.id !== id),
        {
          id,
          name: draft.name.trim().toUpperCase(),
          category: draft.category as MenuItem["category"],
          description: "",
          ingredients: [],
          price: draft.price === "" ? null : Number(draft.price),
          priceVerified: draft.price !== "",
          sizes: [],
          sauces: [],
          image: MENU[0].image,
          tags: [],
          spicyLevel: 0,
          available: true,
          code: "LAB-NEW",
        },
      ];
      saveDemo(d);
      setMsg("Item créé (démo locale).");
      setDraft({ id: "", name: "", category: "burgers", price: "" });
      load();
      return;
    }
    api("/api/admin/menu", {
      method: "POST",
      body: JSON.stringify({
        id,
        name: draft.name.trim().toUpperCase(),
        category: draft.category,
        price: draft.price === "" ? null : Number(draft.price),
        priceVerified: draft.price !== "",
        code: "LAB-X",
      }),
    })
      .then(() => {
        setMsg("Item créé.");
        setDraft({ id: "", name: "", category: "burgers", price: "" });
        load();
      })
      .catch((e: Error) => setErr(e.message));
  };

  const remove = (id: string) => {
    if (!window.confirm(`Supprimer ${id} ?`)) return;
    if (demo) {
      const d = loadDemo();
      d.deleted = [...new Set([...d.deleted, id])];
      d.created = d.created.filter((x) => x.id !== id);
      saveDemo(d);
      setItems(applyDemo(MENU));
      return;
    }
    api(`/api/admin/menu/${id}`, { method: "DELETE" })
      .then(() => setItems((p) => p.filter((m) => m.id !== id)))
      .catch((e: Error) => setErr(e.message));
  };

  return (
    <div>
      <h2 className="font-mono-lab text-xs tracking-[0.3em] text-neutral-400">MENU — {items.length} ITEMS</h2>
      {err && <p className="mt-2 text-sm text-red-400" role="alert">{err}</p>}
      {msg && <p className="mt-2 text-sm text-[#ffd400]" role="status">{msg}</p>}

      <form onSubmit={create} className="mt-4 grid gap-2 rounded-xl border border-[#2a2c30] bg-[#101112] p-4 sm:grid-cols-5" aria-label="Créer un item">
        <input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} placeholder="id (ex: mega-mix)" required className="rounded-lg border border-[#333] bg-black px-3 py-2 text-sm outline-none focus:border-[#ffd400]" aria-label="ID" />
        <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="NOM" required className="rounded-lg border border-[#333] bg-black px-3 py-2 text-sm outline-none focus:border-[#ffd400]" aria-label="Nom" />
        <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="rounded-lg border border-[#333] bg-black px-3 py-2 text-sm" aria-label="Catégorie">
          {["burgers", "tacos", "supplements", "sides", "drinks", "desserts"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="Prix DT (vide = —)" inputMode="decimal" className="rounded-lg border border-[#333] bg-black px-3 py-2 text-sm outline-none focus:border-[#ffd400]" aria-label="Prix" />
        <button className="btn-lab font-mono-lab rounded-full py-2 text-xs font-bold tracking-widest">+ CRÉER</button>
      </form>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((m) => (
          <div key={m.id} className={`rounded-xl border p-4 ${m.available ? "border-[#26282c] bg-[#101112]" : "border-red-900 bg-[#140b0b] opacity-75"}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-display text-xl">{m.name} <span className="font-mono-lab text-[10px] text-neutral-500">{m.code} • {m.category}</span></p>
              <button onClick={() => remove(m.id)} className="text-neutral-600 hover:text-red-400" aria-label={`Supprimer ${m.name}`}>✕</button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <label className="flex items-center gap-2">
                Prix:
                <input type="number" step="0.1" min="0" value={m.price ?? ""} placeholder="—" onChange={(e) => patch(m.id, { price: e.target.value === "" ? null : Number(e.target.value), priceVerified: e.target.value !== "" })} className="w-24 rounded-lg border border-[#333] bg-black px-2 py-1 outline-none focus:border-[#ffd400]" />
              </label>
              <button onClick={() => patch(m.id, { available: !m.available })} aria-pressed={m.available} className={`font-mono-lab rounded-full px-3 py-1 text-[11px] ${m.available ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                {m.available ? "DISPONIBLE" : "INDISPONIBLE"}
              </button>
              <button onClick={() => patch(m.id, { featured: !m.featured })} aria-pressed={!!m.featured} className={`font-mono-lab rounded-full px-3 py-1 text-[11px] ${m.featured ? "bg-[#ffd400] text-black" : "bg-[#222] text-neutral-400"}`}>
                ★ SIGNATURE
              </button>
            </div>
            {m.sizes.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {m.sizes.map((s, si) => (
                  <label key={s.label} className="flex items-center gap-1 text-[11px] text-neutral-400">
                    {s.label}
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={s.price}
                      onChange={(e) => {
                        const next = m.sizes.map((x, j) => (j === si ? { ...x, price: Number(e.target.value) } : x));
                        patch(m.id, { sizes: next });
                      }}
                      className="w-20 rounded border border-[#333] bg-black px-2 py-1 font-mono-lab text-[11px] outline-none focus:border-[#ffd400]"
                      aria-label={`Prix ${s.label} — ${m.name}`}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ demo }: { demo: boolean }) {
  const [hours, setHours] = React.useState<DayHours[]>(STATIC_HOURS);
  const [promo, setPromo] = React.useState({ active: false, title: "", text: "" });
  const [restaurant, setRestaurant] = React.useState({ rating: 4.5, reviewCount: 2394 });
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    api("/api/settings")
      .then((d) => {
        if (Array.isArray(d.hours)) setHours(d.hours as DayHours[]);
        const p = d.promo as typeof promo | undefined;
        if (p && typeof p === "object") setPromo({ active: !!p.active, title: String(p.title ?? ""), text: String(p.text ?? "") });
        const r = d.restaurant as typeof restaurant | undefined;
        if (r && typeof r === "object") setRestaurant({ rating: Number(r.rating) || 4.5, reviewCount: Number(r.reviewCount) || 0 });
      })
      .catch(() => {});
  }, []);

  const save = (key: string, value: unknown) => {
    if (demo) {
      const d = loadDemo();
      d.settings = { ...d.settings, [key]: value };
      saveDemo(d);
      setMsg(`${key} sauvegardé ✓ (démo locale)`);
      return;
    }
    api("/api/settings", { method: "PUT", body: JSON.stringify({ key, value }) })
      .then(() => setMsg(`${key} sauvegardé ✓`))
      .catch((e: Error) => setMsg(`Erreur: ${e.message}`));
  };

  return (
    <div className="grid gap-8">
      {msg && <p className="text-sm text-[#ffd400]" role="status">{msg}</p>}
      <section aria-label="Horaires">
        <h2 className="font-mono-lab text-xs tracking-[0.3em] text-neutral-400">HORAIRES</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {hours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-2 rounded-lg border border-[#222] bg-[#101112] px-4 py-2.5 text-sm">
              <span className="w-24">{h.day}</span>
              <input value={h.open} onChange={(e) => setHours((p) => p.map((x, j) => (j === i ? { ...x, open: e.target.value } : x)))} className="w-20 rounded border border-[#333] bg-black px-2 py-1 font-mono-lab" aria-label={`Ouverture ${h.day}`} />
              <span className="text-neutral-500">—</span>
              <input value={h.close} onChange={(e) => setHours((p) => p.map((x, j) => (j === i ? { ...x, close: e.target.value } : x)))} className="w-20 rounded border border-[#333] bg-black px-2 py-1 font-mono-lab" aria-label={`Fermeture ${h.day}`} />
            </div>
          ))}
        </div>
        <button onClick={() => save("hours", hours)} className="btn-lab font-mono-lab mt-3 rounded-full px-6 py-2 text-xs font-bold tracking-widest">SAUVER HORAIRES</button>
      </section>

      <section aria-label="Promotion">
        <h2 className="font-mono-lab text-xs tracking-[0.3em] text-neutral-400">PROMO (bandeau public)</h2>
        <div className="mt-3 space-y-2 rounded-xl border border-[#222] bg-[#101112] p-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={promo.active} onChange={(e) => setPromo({ ...promo, active: e.target.checked })} className="h-4 w-4 accent-[#ffd400]" /> Promo active
          </label>
          <input value={promo.title} onChange={(e) => setPromo({ ...promo, title: e.target.value })} placeholder="Titre (ex: MENU DU LABO)" className="w-full rounded-lg border border-[#333] bg-black px-3 py-2 text-sm outline-none focus:border-[#ffd400]" aria-label="Titre promo" />
          <input value={promo.text} onChange={(e) => setPromo({ ...promo, text: e.target.value })} placeholder="Texte (ex: -20% sur les tacos ce week-end)" className="w-full rounded-lg border border-[#333] bg-black px-3 py-2 text-sm outline-none focus:border-[#ffd400]" aria-label="Texte promo" />
          <button onClick={() => save("promo", promo)} className="btn-lab font-mono-lab rounded-full px-6 py-2 text-xs font-bold tracking-widest">SAUVER PROMO</button>
        </div>
      </section>

      <section aria-label="Restaurant">
        <h2 className="font-mono-lab text-xs tracking-[0.3em] text-neutral-400">NOTE GOOGLE</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#222] bg-[#101112] p-4 text-sm">
          <label className="flex items-center gap-2">Note:
            <input type="number" step="0.1" min="0" max="5" value={restaurant.rating} onChange={(e) => setRestaurant({ ...restaurant, rating: Number(e.target.value) })} className="w-20 rounded border border-[#333] bg-black px-2 py-1" />
          </label>
          <label className="flex items-center gap-2">Avis:
            <input type="number" min="0" value={restaurant.reviewCount} onChange={(e) => setRestaurant({ ...restaurant, reviewCount: Number(e.target.value) })} className="w-28 rounded border border-[#333] bg-black px-2 py-1" />
          </label>
          <button onClick={() => save("restaurant", restaurant)} className="btn-lab font-mono-lab rounded-full px-6 py-2 text-xs font-bold tracking-widest">SAUVER</button>
        </div>
      </section>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = React.useState<boolean | null>(null);
  const [demo, setDemo] = React.useState(false);
  const [user, setUser] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [err, setErr] = React.useState("");
  const [tab, setTab] = React.useState<"orders" | "menu" | "settings">("orders");

  React.useEffect(() => {
    fetch("/api/admin/session")
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        // No database on this deployment → open in demo mode (no login wall,
        // everything stored in the browser) so the dashboard is explorable.
        if (r.status === 503 || (r.status === 401 && d.demo)) {
          setDemo(true);
          setAuthed(true);
          setUser("démo");
          return;
        }
        if (r.ok) {
          setAuthed(true);
          setUser(String(d.username ?? ""));
          return;
        }
        setAuthed(false);
      })
      .catch(() => setAuthed(false));
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    api("/api/admin/login", { method: "POST", body: JSON.stringify({ username: user, password: pw }) })
      .then((d) => {
        setAuthed(true);
        setUser(String(d.username ?? user));
        setPw("");
      })
      .catch(() => setErr("Identifiants incorrects."));
  };

  const logout = () => {
    if (demo) {
      setAuthed(false);
      setDemo(false);
      return;
    }
    api("/api/admin/session", { method: "POST" }).finally(() => {
      setAuthed(false);
      setUser("");
      setPw("");
    });
  };

  if (authed === null) {
    return (
      <main className="mx-auto grid min-h-svh max-w-md place-items-center px-4">
        <p className="font-mono-lab text-xs tracking-[0.3em] text-neutral-500">VÉRIFICATION SESSION…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="mx-auto grid min-h-svh max-w-md place-items-center px-4">
        <form onSubmit={login} className="metal-panel w-full rounded-2xl p-8" aria-label="Connexion admin">
          <div className="stripes h-1.5 w-full rounded" aria-hidden="true" />
          <h1 className="font-display mt-5 text-4xl">LAB <span className="text-[#ffd400]">ADMIN</span></h1>
          <label className="mt-5 block">
            <span className="font-mono-lab text-[11px] tracking-widest">UTILISATEUR</span>
            <input value={user} onChange={(e) => setUser(e.target.value)} className="mt-1 w-full rounded-lg border border-[#333] bg-black px-4 py-3 outline-none focus:border-[#ffd400]" autoComplete="username" />
          </label>
          <label className="mt-3 block">
            <span className="font-mono-lab text-[11px] tracking-widest">MOT DE PASSE</span>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1 w-full rounded-lg border border-[#333] bg-black px-4 py-3 outline-none focus:border-[#ffd400]" autoComplete="current-password" />
          </label>
          {err && <p className="mt-3 text-sm text-red-400" role="alert">{err}</p>}
          <button className="btn-lab font-mono-lab mt-5 w-full rounded-full py-3 text-sm font-bold tracking-widest">ENTRER →</button>
          <Link href="/" className="mt-4 block text-center text-sm text-neutral-400 hover:text-white">← Retour au site</Link>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {demo && (
        <div className="mb-6 rounded-xl border border-[#ffd400]/50 bg-[#ffd400]/10 p-4" role="status">
          <p className="font-mono-lab text-[11px] tracking-[0.2em] text-[#ffd400]">MODE DÉMO — AUCUNE BASE DE DONNÉES SUR CE DÉPLOIEMENT</p>
          <p className="mt-1 text-sm text-neutral-300">
            Les modifications que vous faites ici sont stockées dans ce navigateur et s&apos;appliquent
            immédiatement au site public (ouvre-le dans un autre onglet pour voir). Avec une base de
            données réelle, tout est sauvegardé pour de vrai et accessible depuis n&apos;importe quel appareil.
          </p>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl sm:text-5xl">LAB <span className="text-[#ffd400]">ADMIN</span> <span className="font-mono-lab align-middle text-xs text-neutral-500">{user}</span></h1>
        <div className="flex gap-2">
          <Link href="/" className="btn-ghost font-mono-lab rounded-full px-6 py-2.5 text-xs font-bold tracking-widest">VOIR LE SITE</Link>
          <button onClick={logout} className="font-mono-lab rounded-full border border-red-900 px-6 py-2.5 text-xs tracking-widest text-red-400 hover:bg-red-950">{demo ? "QUITTER" : "SORTIR"}</button>
        </div>
      </div>

      <div className="mt-6 flex gap-2" role="tablist" aria-label="Sections admin">
        {(["orders", "menu", "settings"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`font-mono-lab rounded-full px-6 py-2.5 text-xs tracking-[0.2em] ${tab === t ? "bg-[#ffd400] font-bold text-black" : "border border-[#333] text-neutral-300 hover:text-white"}`}>
            {t === "orders" ? "COMMANDES" : t === "menu" ? "MENU" : "RÉGLAGES"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "orders" && <OrdersTab demo={demo} />}
        {tab === "menu" && <MenuTab demo={demo} />}
        {tab === "settings" && <SettingsTab demo={demo} />}
      </div>
    </main>
  );
}
