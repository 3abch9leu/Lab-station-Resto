"use client";

import React from "react";
import Link from "next/link";
import { useCart, useLang } from "./Providers";
import Magnetic from "./Magnetic";
import { RESTAURANT } from "@/data/restaurant";
import { getOpenStatus } from "@/data/hours";

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);
  const [status, setStatus] = React.useState(() => getOpenStatus(new Date()));

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    const id = setInterval(() => setStatus(getOpenStatus(new Date())), 60000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(id);
    };
  }, []);

  const links = [
    { href: "#top", label: t("nav.home") },
    { href: "#menu", label: t("nav.menu") },
    { href: "#lab", label: t("nav.about") },
    { href: "#galerie", label: t("nav.gallery") },
    { href: "#avis", label: t("nav.reviews") },
    { href: "#lieu", label: t("nav.location") },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-[#26282c]" : "bg-transparent"}`}>
      <div className="stripes h-1 w-full" aria-hidden />
      <nav
        aria-label="Navigation principale"
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all sm:px-6 ${scrolled ? "py-2.5" : "py-4"}`}
      >
        <Link href="#top" className="group flex items-center gap-3" aria-label="Lab Station — accueil">
          <span className="grid h-10 w-10 place-items-center rounded-sm bg-[#ffd400] font-display text-xl text-black transition-transform group-hover:rotate-6" aria-hidden>
            LS
          </span>
          <span className="leading-none">
            <span className="font-display block text-xl tracking-wide">LAB STATION</span>
            <span className="font-mono-lab block text-[10px] tracking-[0.3em] text-[#ffd400]">FOOD LAB • ARIANA</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="nav-link font-mono-lab text-[12px] tracking-[0.2em] text-neutral-200 hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span
            className={`font-mono-lab hidden items-center gap-2 rounded-full border px-3 py-1 text-[11px] tracking-widest sm:flex ${status.open ? "border-[#ffd400]/50 text-[#ffd400]" : "border-red-500/50 text-red-400"}`}
            role="status"
            aria-live="polite"
            title={status.detail}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping-soft absolute h-2 w-2 rounded-full ${status.open ? "bg-[#ffd400]" : "bg-red-500"}`} />
              <span className={`h-2 w-2 rounded-full ${status.open ? "bg-[#ffd400]" : "bg-red-500"}`} />
            </span>
            {status.label}
          </span>

          <div className="hidden items-center overflow-hidden rounded-full border border-[#2a2c30] text-[11px] md:flex" role="group" aria-label="Langue">
            {(["fr", "en", "ar"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-2.5 py-1.5 font-mono-lab uppercase ${lang === l ? "bg-[#ffd400] text-black" : "text-neutral-300 hover:text-white"}`}
              >
                {l}
              </button>
            ))}
          </div>

          <Magnetic strength={18}>
            <button
              onClick={() => setOpen(true)}
              className="btn-lab font-mono-lab flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold tracking-widest"
              aria-label={`Ouvrir le panier, ${count} articles`}
            >
              {t("nav.order")} <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-black text-[11px] text-[#ffd400]">{count}</span>
            </button>
          </Magnetic>

          <button
            className="grid h-10 w-10 place-items-center rounded-md border border-[#2a2c30] lg:hidden"
            onClick={() => setMobile((v) => !v)}
            aria-expanded={mobile}
            aria-label={mobile ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span aria-hidden className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-white transition-transform ${mobile ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-white ${mobile ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-white transition-transform ${mobile ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`overflow-hidden transition-all duration-300 lg:hidden ${mobile ? "max-h-96" : "max-h-0"}`}>
        <ul className="space-y-1 border-t border-[#222] bg-[#0a0a0b]/95 px-4 py-4 backdrop-blur-xl">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setMobile(false)}
                className="font-display block rounded px-2 py-2.5 text-2xl tracking-wide hover:bg-[#ffd400] hover:text-black"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="flex gap-2 pt-2">
            {(["fr", "en", "ar"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`rounded-full border px-4 py-1.5 text-sm uppercase ${lang === l ? "bg-[#ffd400] text-black" : "border-[#333] text-white"}`}>
                {l}
              </button>
            ))}
          </li>
          <li className="pt-1">
            {RESTAURANT.phones.map((p, i) => (
              <span key={p.tel} className="block">
                {i > 0 && <br />}
                <a href={`tel:${p.tel}`} className="font-mono-lab text-sm tracking-widest text-[#ffd400]">{p.label}</a>
              </span>
            ))}
          </li>
        </ul>
      </div>
    </header>
  );
}
