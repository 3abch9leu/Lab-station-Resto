"use client";

import React from "react";
import Image from "next/image";
import { formatPrice, type MenuItem } from "@/data/menu";
import { useCart, useLang, useModal } from "./Providers";

function ModalContent({ m, onClose }: { m: MenuItem; onClose: () => void }) {
  // Fresh state per item — parent renders <ModalContent key={m.id}/> so qty resets.
  const [qty, setQty] = React.useState(1);
  const { add, setOpen } = useCart();
  const { t } = useLang();

  return (
    <div
      className="metal-panel relative max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="stripes h-1.5 w-full" aria-hidden="true" />
      <div className="relative h-64 sm:h-72">
        <Image src={m.image} alt={m.name + " — Lab Station"} fill className="object-cover" sizes="100vw" />
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
          {m.price === null ? <span className="text-xs">LABO</span> : <>{m.price.toFixed(1)}<br /><span className="text-xs">DT</span></>}
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

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-[#333]" role="group" aria-label="Quantité">
            <button onClick={() => setQty((v) => Math.max(1, v - 1))} className="px-4 py-2.5 text-xl hover:text-[#ffd400]" aria-label="Diminuer">−</button>
            <span className="font-display min-w-8 text-center text-xl" aria-live="polite">{qty}</span>
            <button onClick={() => setQty((v) => Math.min(20, v + 1))} className="px-4 py-2.5 text-xl hover:text-[#ffd400]" aria-label="Augmenter">+</button>
          </div>
          <p className="font-display text-2xl text-[#ffd400]">
            {m.price === null ? formatPrice(null) : (m.price * qty).toFixed(1) + " DT"}
          </p>
          <span className="font-mono-lab text-[10px] tracking-widest text-neutral-500">
            {m.priceVerified ? "✓ " + t("menu.verify") : "◷ " + t("menu.toconfirm")}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => {
              if (m.price !== null) {
                add(m, qty);
                onClose();
                setOpen(true);
              }
            }}
            disabled={m.price === null}
            className="btn-lab font-mono-lab flex-1 rounded-full px-6 py-3.5 text-[13px] font-bold tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {m.price === null ? t("menu.toconfirm") : "+ " + t("menu.add") + " — " + (m.price * qty).toFixed(1) + " DT"}
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
