"use client";

import React from "react";
import Image from "next/image";
import { CATEGORIES, MENU, formatPrice, type MenuCategory, type MenuItem } from "@/data/menu";
import { useCart, useLang, useModal } from "./Providers";
import { Reveal, SectionHead, Stripes } from "./ui";

type Filter = MenuCategory | "all";
type TagFilter = "all" | "spicy" | "signature" | "smoked" | "cheesy";

const TAG_FILTERS: { id: TagFilter; label: string }[] = [
  { id: "all", label: "TOUT" },
  { id: "signature", label: "★ SIGNATURE" },
  { id: "spicy", label: "🔥 SPICY" },
  { id: "smoked", label: "SMOKED" },
  { id: "cheesy", label: "CHEESY" },
];

export function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const { t } = useLang();
  const { add } = useCart();
  const { setSelected } = useModal();

  // Spotlight + 3D tilt via CSS vars (no re-renders, skipped on reduced motion).
  const onTilt = (e: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--ry", `${((px - 0.5) * 9).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - py) * 9).toFixed(2)}deg`);
  };
  const onUntilt = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <Reveal delay={(index % 3) * 80}>
      <article
        className="lab-card spotlight tilt-3d metal-panel group overflow-hidden rounded-2xl"
        onPointerMove={onTilt}
        onPointerLeave={onUntilt}
        aria-label={`${item.name} — ${formatPrice(item.price)}`}
      >
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#1a1c1f] to-[#0a0b0c] sm:h-56">
          <Image
            src={item.image}
            alt={`${item.name} — Lab Station`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-1"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" aria-hidden />
          {/* specimen code */}
          <span className="font-mono-lab absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-[10px] tracking-[0.25em] text-[#ffd400] backdrop-blur">
            {item.code}
          </span>
          {/* price badge */}
          <span
            className="price-badge font-display absolute -bottom-1 right-3 grid h-20 w-20 rotate-6 place-items-center rounded-full text-center text-lg leading-none transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110"
            aria-label={`Prix: ${formatPrice(item.price)}`}
          >
            {item.price === null ? <span className="text-[10px]">LABO</span> : <>{item.price.toFixed(1)}<br /><span className="text-xs">DT</span></>}
          </span>
          {item.spicyLevel > 0 && (
            <span className="absolute right-3 top-3 rounded-full bg-red-600/90 px-2.5 py-1 text-[11px] font-bold" aria-label={item.spicyLevel === 2 ? "Super spicy" : "Spicy"}>
              {item.spicyLevel === 2 ? "🔥🔥" : "🔥"}
            </span>
          )}
          {item.tags.includes("smoked") && (
            <span className="font-mono-lab absolute bottom-3 left-3 rounded bg-[#ffd400] px-2 py-1 text-[10px] font-bold tracking-widest text-black">SMOKED</span>
          )}
        </div>

        <div className="p-5 pt-4">
          {item.variant && <p className="font-mono-lab text-[10px] tracking-[0.3em] text-[#ffd400]">{item.variant}</p>}
          <h3 className="font-display mt-1 text-2xl leading-none tracking-wide">{item.name}</h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-neutral-300">{item.description}</p>
          <p className="font-mono-lab mt-2 flex items-center gap-1.5 text-[10px] tracking-widest text-neutral-500">
            <span className={`h-1.5 w-1.5 rounded-full ${item.priceVerified ? "bg-emerald-400" : "bg-amber-400"}`} aria-hidden />
            {item.priceVerified ? t("menu.verify") : t("menu.toconfirm")}
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setSelected(item)}
              className="font-mono-lab flex-1 rounded-full border border-[#333] px-4 py-2.5 text-[12px] tracking-widest text-white transition hover:border-[#ffd400] hover:text-[#ffd400]"
              aria-haspopup="dialog"
            >
              {t("menu.view")}
            </button>
            <button
              onClick={() => { if (item.price !== null) { add(item); } else { setSelected(item); } }}
              className="btn-lab font-mono-lab flex-1 rounded-full px-4 py-2.5 text-[12px] font-bold tracking-widest"
              aria-label={`Ajouter ${item.name} au panier`}
            >
              + {t("menu.add")}
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function MenuSection() {
  const { t } = useLang();
  const [cat, setCat] = React.useState<Filter>("all");
  const [tag, setTag] = React.useState<TagFilter>("all");
  const [q, setQ] = React.useState("");
  // Live menu from the backend, static verified data as instant fallback.
  const [remote, setRemote] = React.useState<MenuItem[] | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/menu", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { items?: MenuItem[] } | null) => {
        if (alive && d && Array.isArray(d.items) && d.items.length > 0) setRemote(d.items);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const items = React.useMemo(() => {
    const base = remote ?? MENU;
    return base.filter((m) => {
      if (cat !== "all" && m.category !== cat) return false;
      if (tag === "spicy" && !(m.tags.includes("spicy") || m.tags.includes("super-spicy"))) return false;
      if (tag === "signature" && !m.tags.includes("signature")) return false;
      if (tag === "smoked" && !m.tags.includes("smoked")) return false;
      if (tag === "cheesy" && !m.tags.includes("cheesy")) return false;
      if (q.trim()) {
        const hay = `${m.name} ${m.description} ${m.ingredients.join(" ")}`.toLowerCase();
        if (!hay.includes(q.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [cat, tag, q, remote]);

  return (
    <section id="menu" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6" aria-label="Menu Lab Station">
      <SectionHead code="PROTOCOLE 02 // MENU" title={t("menu.title")} sub={t("menu.sub")} />

      {/* Category selector */}
      <div className="sticky top-[65px] z-30 -mx-4 bg-[#050505]/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6" role="tablist" aria-label="Catégories du menu">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={cat === c.id}
              onClick={() => setCat(c.id)}
              className={`font-mono-lab shrink-0 rounded-full px-5 py-2.5 text-[12px] tracking-[0.2em] transition ${cat === c.id ? "bg-[#ffd400] font-bold text-black glow-lab" : "border border-[#2c2e33] text-neutral-300 hover:border-[#ffd400]/60 hover:text-white"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {TAG_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setTag(f.id)}
              aria-pressed={tag === f.id}
              className={`font-mono-lab rounded-full px-3 py-1 text-[11px] tracking-widest ${tag === f.id ? "bg-white text-black" : "bg-[#151619] text-neutral-400 hover:text-white"}`}
            >
              {f.label}
            </button>
          ))}
          <label className="ms-auto flex min-w-44 flex-1 items-center gap-2 rounded-full border border-[#2c2e33] bg-[#101112] px-4 py-1.5 sm:max-w-64">
            <span aria-hidden>⌕</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("menu.search")}
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
              aria-label={t("menu.search")}
            />
          </label>
        </div>
      </div>

      <p className="font-mono-lab mt-4 text-[11px] tracking-[0.25em] text-neutral-500" role="status" aria-live="polite">
        {items.length} SPÉCIMEN{items.length > 1 ? "S" : ""} {"//"} EXPERIMENT COMPLETE
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m, i) => (
          <MenuCard key={m.id} item={m} index={i} />
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-10 rounded-xl border border-dashed border-[#333] p-10 text-center text-neutral-400">
          Aucun spécimen trouvé. Réinitialisez les filtres du labo.
        </p>
      )}

      <Stripes className="mt-14 h-2 w-full opacity-70 stripes-fade" />
    </section>
  );
}
