"use client";

import React from "react";
import { useCart, useLang } from "./Providers";
import { RESTAURANT } from "@/data/restaurant";

export default function CartDrawer() {
  const { lines, setQty, remove, total, count, open, setOpen, clear } = useCart();
  const { t } = useLang();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [type, setType] = React.useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const buildMessage = () => {
    const rows = lines.map((l) => `${l.qty}x ${l.item.name}${l.item.price ? ` — ${(l.item.price * l.qty).toFixed(1)} DT` : ""}`).join("\n");
    return (
      `LAB STATION ORDER\n\nClient: ${name || "-"}\nTél: ${phone || "-"}\nType: ${type === "pickup" ? "Pickup / À emporter" : `Livraison — ${address}`}\n\nCommande:\n${rows}\n\nTotal: ${total.toFixed(1)} DT`
    );
  };

  const whatsappUrl = `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(buildMessage())}`;

  const confirmOrder = async () => {
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, type, address, lines: lines.map((l) => ({ id: l.item.id, qty: l.qty })), total }),
      });
    } catch {}
    // Fallback: WhatsApp
    window.open(whatsappUrl, "_blank", "noopener");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={t("cart.title")}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
      <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col border-l border-[#26282c] bg-[#0b0c0e]">
        <div className="stripes h-1.5 w-full" aria-hidden />
        <div className="flex items-center justify-between p-5">
          <h2 className="font-display text-3xl">{t("cart.title")} <span className="text-[#ffd400]">({count})</span></h2>
          <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-[#333] text-xl hover:bg-[#ffd400] hover:text-black" aria-label="Fermer le panier">×</button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
          {lines.length === 0 && <p className="rounded-xl border border-dashed border-[#333] p-8 text-center text-neutral-400">{t("cart.empty")}</p>}
          {lines.map((l) => (
            <div key={l.item.id} className="flex items-center gap-3 rounded-xl border border-[#222] bg-[#121316] p-3">
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-lg">{l.item.name}</p>
                <p className="font-mono-lab text-[11px] tracking-widest text-[#ffd400]">
                  {l.item.price === null ? "PRIX LABO" : `${l.item.price.toFixed(1)} DT`}
                </p>
              </div>
              <div className="flex items-center rounded-full border border-[#333]" role="group" aria-label={`Quantité ${l.item.name}`}>
                <button onClick={() => setQty(l.item.id, l.qty - 1)} className="px-3 py-1.5 hover:text-[#ffd400]" aria-label="Diminuer">−</button>
                <span className="min-w-6 text-center font-bold">{l.qty}</span>
                <button onClick={() => setQty(l.item.id, l.qty + 1)} className="px-3 py-1.5 hover:text-[#ffd400]" aria-label="Augmenter">+</button>
              </div>
              <button onClick={() => remove(l.item.id)} className="text-neutral-500 hover:text-red-400" aria-label={`Retirer ${l.item.name}`}>✕</button>
            </div>
          ))}

          {lines.length > 0 && (
            <div className="space-y-3 rounded-xl border border-[#2a2c30] bg-[#101112] p-4">
              <div className="grid grid-cols-2 gap-2">
                <label className="col-span-1 block">
                  <span className="font-mono-lab text-[10px] tracking-widest text-neutral-400">{t("cart.name")}</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-[#2c2e33] bg-black px-3 py-2 text-sm outline-none focus:border-[#ffd400]" autoComplete="name" />
                </label>
                <label className="col-span-1 block">
                  <span className="font-mono-lab text-[10px] tracking-widest text-neutral-400">{t("cart.phone")}</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-[#2c2e33] bg-black px-3 py-2 text-sm outline-none focus:border-[#ffd400]" inputMode="tel" autoComplete="tel" />
                </label>
              </div>
              <div className="flex gap-2" role="group" aria-label={t("cart.type")}>
                {(["pickup", "delivery"] as const).map((v) => (
                  <button key={v} onClick={() => setType(v)} aria-pressed={type === v} className={`font-mono-lab flex-1 rounded-full px-4 py-2 text-[12px] tracking-widest ${type === v ? "bg-[#ffd400] font-bold text-black" : "border border-[#333] text-neutral-300"}`}>
                    {v === "pickup" ? t("cart.pickup") : t("cart.delivery")}
                  </button>
                ))}
              </div>
              {type === "delivery" && (
                <label className="block">
                  <span className="font-mono-lab text-[10px] tracking-widest text-neutral-400">{t("cart.address")}</span>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded-lg border border-[#2c2e33] bg-black px-3 py-2 text-sm outline-none focus:border-[#ffd400]" autoComplete="street-address" />
                </label>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-[#222] p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono-lab text-[12px] tracking-[0.3em] text-neutral-400">{t("cart.total")}</span>
            <span className="font-display text-3xl text-[#ffd400]">{total.toFixed(1)} DT</span>
          </div>
          {lines.length > 0 && (
            <button onClick={clear} className="font-mono-lab mt-1 text-[11px] tracking-widest text-neutral-500 hover:text-red-400">
              Vider le labo
            </button>
          )}
          <div className="mt-4 space-y-2">
            <button
              onClick={confirmOrder}
              disabled={lines.length === 0}
              className="btn-lab font-mono-lab w-full rounded-full px-6 py-3.5 text-[13px] font-bold tracking-[0.2em] disabled:opacity-40"
            >
              {t("cart.whatsapp")} →
            </button>
            <a href={RESTAURANT.phoneHref} className="btn-ghost font-mono-lab block rounded-full px-6 py-3 text-center text-[13px] font-bold tracking-[0.2em]">
              {t("cart.call")} — {RESTAURANT.phone}
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
