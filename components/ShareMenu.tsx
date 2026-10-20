"use client";

import React from "react";

/** Social share helpers — the "link in bio" tools a restaurant owner actually uses. */
export function shareUrl(url: string, text: string) {
  if (typeof window === "undefined") return;
  if (navigator.share) {
    navigator.share({ title: "LAB STATION", text, url }).catch(() => {});
    return;
  }
  const link = `${url}?text=${encodeURIComponent(text)}`;
  window.open(link, "_blank", "noopener,noreferrer");
}

export function shareWhatsApp(url: string, text: string) {
  if (typeof window === "undefined") return;
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener,noreferrer");
}

export function shareFacebook(url: string) {
  if (typeof window === "undefined") return;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
}

export async function copyLink(url: string) {
  if (typeof window === "undefined") return false;
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

/** Floating "share the menu" pill (mobile-first, bottom-left). */
export default function ShareMenuButton() {
  const [open, setOpen] = React.useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "";

  const items = [
    {
      label: "WhatsApp",
      action: () => shareWhatsApp(url, "🍔 La carte LAB STATION (Ariana) — burgers, tacos, viandes fumées :"),
    },
    { label: "Facebook", action: () => shareFacebook(url) },
    {
      label: "Copier le lien",
      action: async () => {
        await copyLink(url);
        setOpen(false);
      },
    },
  ];

  return (
    <div className="fixed bottom-5 left-4 z-40 hidden sm:block">
      <div className="flex flex-col items-start gap-2">
        {open &&
          items.map((i) => (
            <button
              key={i.label}
              onClick={i.action}
              className="font-mono-lab rounded-full border border-[#ffd400]/50 bg-black/85 px-4 py-2 text-[11px] tracking-widest text-white backdrop-blur transition hover:bg-[#ffd400] hover:text-black"
            >
              {i.label}
            </button>
          ))}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="font-mono-lab flex items-center gap-2 rounded-full border border-[#2a2c30] bg-black/70 px-4 py-2.5 text-[11px] tracking-[0.2em] text-neutral-300 backdrop-blur transition hover:border-[#ffd400] hover:text-[#ffd400]"
        >
          <span aria-hidden>↗</span> PARTAGER LA CARTE
        </button>
      </div>
    </div>
  );
}
