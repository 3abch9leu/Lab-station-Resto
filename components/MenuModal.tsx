"use client";

import React from "react";
import Image from "next/image";
import { MENU, SAUCES, itemImage, type MenuItem } from "@/data/menu";
import { useCart, useLang, useModal, type CartExtra } from "./Providers";
import { shareWhatsApp } from "./ShareMenu";

function ModalContent({ m, onClose }: { m: MenuItem; onClose: () => void }) {
  const [qty, setQty] = React.useState(1);
  const [size, setSize] = React.useState<string | undefined>(m.sizes[0]?.label);
  const [sauces, setSauces] = React.useState<string[]>([]);
  const [extras, setExtras] = React.useState<CartExtra[]>([]);
  const { add, setOpen } = useCart();
  const { t } = useLang();

  // Add-ons available for this item (supplements category).
  const addons = React.useMemo(() => MENU.filter((x) => x.category === "supplements"), []);

  const sizePrice =
    m.sizes.find((s) => s.label === size)?.price ?? m.price ?? 0;
  const extrasTotal = extras.reduce((s, e) => s + e.price, 0);
  const unit = sizePrice + extrasTotal;

  const toggleSauce = (id: string) =>
    setSauces((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const toggleExtra = (a: MenuItem) =>
    setExtras((p) =>
      p.some((e) => e.id === a.id)
        ? p.filter((e) => e.id !== a.id)
        : [...p, { id: a.id, name: a.name, price: a.price ?? 0 }]
    );

  return (
    <div
      className="metal-panel relative max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="stripes h-1.5 w-full" aria-hidden="true" />
      <div className="relative h-64 sm:h-72">
        <Image src={itemImage(m)} alt={m.name + " — Lab Station"} fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111214] via-transparent to-transparent" aria-hidden="true" />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-xl backdrop-blur hover:bg-[#ffd400] hover:text-black"
          aria-label="Fermer"
          autoFocus
        >
          ×
        </button>
        <span className="font-mono-lab absolute left-4 top-4 rounded bg-black/70 px-2 py-1 text-[10px] tracking-[0.25em] text-[#ffd400]">
          {m.code} {"//"} EXPERIMENT
        </span>
        <span className="price-badge font-display absolute -bottom-2 right-5 grid h-24 w-24 rotate-6 place-items-center rounded-full text-center text-xl">
          {m.price === null && !m.sizes.length ? <span className="text-xs">LABO</span> : <>{sizePrice.toFixed(1)}<br /><span className="text-xs">DT</span></>}
        </span>
      </div>

      <div className="p-6 sm:p-8">
        {m.variant && <p className="font-mono-lab text-[11px] tracking-[0.3em] text-[#ffd400]">{m.variant}</p>}
        <h3 className="font-display mt-1 text-4xl sm:text-5xl">{m.name}</h3>
        <p className="mt-3 text-neutral-300">{m.description}</p>

        <h4 className="font-mono-lab mt-6 text-[11px] tracking-[0.3em] text-neutral-400">COMPOSITION {"//"} INGREDIENTS</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {m.ingredients.map((ing) => (
            <li key={ing} className="rounded-full border border-[#2e3035] bg-[#17181b] px-3.5 py-1.5 text-sm text-neutral-200">
              {ing}
            </li>
          ))}
        </ul>

        {/* Sizes (L / 2XL) */}
        {m.sizes.length > 0 && (
          <section className="mt-6">
            <h4 className="font-mono-lab text-[11px] tracking-[0.3em] text-neutral-400">TAILLE</h4>
            <div className="mt-3 flex gap-2" role="group" aria-label="Taille">
              {m.sizes.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSize(s.label)}
                  aria-pressed={size === s.label}
                  className={`flex-1 rounded-xl border px-4 py-3 text-left transition ${size === s.label ? "border-[#ffd400] bg-[#ffd400]/10 glow-lab" : "border-[#2e3035] bg-[#121316] hover:border-[#555]"}`}
                >
                  <span className="font-display block text-xl text-[#ffd400]">{s.label}</span>
                  <span className="font-mono-lab text-[11px] text-neutral-400">{s.price.toFixed(1)} DT</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Sauces */}
        {m.sauces.length > 0 && (
          <section className="mt-6">
            <h4 className="font-mono-lab text-[11px] tracking-[0.3em] text-neutral-400">SAUCES {"//"} AU CHOIX</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {SAUCES.filter((s) => m.sauces.includes(s.id)).map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleSauce(s.id)}
                  aria-pressed={sauces.includes(s.id)}
                  className={`font-mono-lab rounded-full px-4 py-2 text-[11px] tracking-widest transition ${sauces.includes(s.id) ? "bg-[#ffd400] font-bold text-black" : "border border-[#2e3035] bg-[#121316] text-neutral-300 hover:border-[#ffd400]/60"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Add-ons (supplements) */}
        {addons.length > 0 && (
          <section className="mt-6">
            <h4 className="font-mono-lab text-[11px] tracking-[0.3em] text-neutral-400">SUPPLÉMENTS</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {addons.map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggleExtra(a)}
                  aria-pressed={extras.some((e) => e.id === a.id)}
                  className={`font-mono-lab rounded-full px-3.5 py-1.5 text-[11px] tracking-wider transition ${extras.some((e) => e.id === a.id) ? "bg-white font-bold text-black" : "border border-[#2e3035] bg-[#121316] text-neutral-300 hover:border-[#ffd400]/60"}`}
                >
                  {a.name} +{a.price?.toFixed(1)}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-[#333]" role="group" aria-label="Quantité">
            <button onClick={() => setQty((v) => Math.max(1, v - 1))} className="px-4 py-2.5 text-xl hover:text-[#ffd400]" aria-label="Diminuer">−</button>
            <span className="font-display min-w-8 text-center text-xl" aria-live="polite">{qty}</span>
            <button onClick={() => setQty((v) => Math.min(20, v + 1))} className="px-4 py-2.5 text-xl hover:text-[#ffd400]" aria-label="Augmenter">+</button>
          </div>
          <p className="font-display text-2xl text-[#ffd400]">{(unit * qty).toFixed(1)} DT</p>
          <span className="font-mono-lab text-[10px] tracking-widest text-neutral-500">
            {m.priceVerified ? "✓ " + t("menu.verify") : "◷ " + t("menu.toconfirm")}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => {
              if (m.price !== null || m.sizes.length > 0) {
                add(
                  m,
                  qty,
                  {
                    size,
                    sizePrice: m.sizes.length ? sizePrice : undefined,
                    sauces: sauces.length ? sauces : undefined,
                    extras: extras.length ? extras : undefined,
                  }
                );
                onClose();
                setOpen(true);
              }
            }}
            disabled={m.price === null && !m.sizes.length}
            className="btn-lab font-mono-lab flex-1 rounded-full px-6 py-3.5 text-[13px] font-bold tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {m.price === null && !m.sizes.length
              ? t("menu.toconfirm")
              : "+ " + t("menu.add") + " — " + (unit * qty).toFixed(1) + " DT"}
          </button>
          <button
            onClick={() => {
              const url = `${window.location.origin}/#menu`;
              shareWhatsApp(url, `🍔 ${m.name} — LAB STATION Ariana`);
            }}
            className="font-mono-lab rounded-full border border-[#2e3035] px-5 py-3.5 text-[12px] tracking-widest text-neutral-300 transition hover:border-[#25D366] hover:text-white"
            aria-label={`Partager ${m.name} sur WhatsApp`}
          >
            PARTAGER
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuModal() {
  const { selected, setSelected } = useModal();
  const close = React.useCallback(() => setSelected(null), [setSelected]);

  React.useEffect(() => {
    if (!selected) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected, close]);

  if (!selected) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={selected.name + " — détails"}
      onClick={close}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      <ModalContent key={selected.id} m={selected} onClose={close} />
    </div>
  );
}
