"use client";
import React from "react";
import Link from "next/link";
import { RESTAURANT, SOCIALS } from "@/data/restaurant";
import { Stripes } from "./ui";
import { useLang } from "./Providers";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative z-10 border-t border-[#1c1e21] bg-[#060607]" aria-label="Pied de page">
      <Stripes className="h-2 w-full opacity-80" />
      {/* Giant showpiece marquee */}
      <div className="overflow-hidden border-b border-[#151619] py-6" aria-hidden="true">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <span key={k} className="font-display text-[16vw] leading-none text-transparent md:text-[9rem]" style={{ WebkitTextStroke: "1px #2e3035" }}>
              LAB STATION <span style={{ WebkitTextStroke: "1px #ffd400" }}>— ENGINEERED FOR CRAVINGS — </span>
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-[#ffd400] font-display text-xl text-black" aria-hidden>LS</span>
            <span className="font-display text-2xl">LAB STATION</span>
          </p>
          <p className="font-mono-lab mt-3 text-[11px] tracking-[0.3em] text-[#ffd400]">BURGERS • TACOS • SMOKED MEATS</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
            Futuristic food laboratory — Avenue Hédi Nouira, Ariana. Engineered for cravings.
          </p>
          <p className="font-mono-lab mt-4 text-[10px] tracking-[0.3em] text-neutral-600">SPECIMEN #001 // EXPERIMENT COMPLETE</p>
        </div>
        <nav aria-label="Navigation secondaire">
          <h3 className="font-mono-lab text-[11px] tracking-[0.3em] text-neutral-500">NAVIGATION</h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {[["#top", t("nav.home")], ["#menu", t("nav.menu")], ["#lab", t("nav.about")], ["#galerie", t("nav.gallery")], ["#avis", t("nav.reviews")], ["#lieu", t("nav.location")]].map(([href, label]) => (
              <li key={href}><Link href={href} className="text-neutral-300 hover:text-[#ffd400]">{label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h3 className="font-mono-lab text-[11px] tracking-[0.3em] text-neutral-500">CONTACT</h3>
          <address className="mt-4 space-y-2 text-[15px] not-italic text-neutral-300">
            <p>{RESTAURANT.address.street}<br />{RESTAURANT.address.city}, {RESTAURANT.address.country}</p>
            <p><a href={RESTAURANT.phoneHref} className="text-[#ffd400] hover:underline">{RESTAURANT.phone}</a></p>
            <p><a href={`mailto:${RESTAURANT.email}`} className="hover:text-white">{RESTAURANT.email}</a></p>
          </address>
          <div className="mt-4 flex gap-2">
            {SOCIALS.facebook && (
              <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#333] px-4 py-2 text-sm hover:border-[#ffd400] hover:text-[#ffd400]" aria-label="Lab Station sur Facebook">
                Facebook
              </a>
            )}
            <a href="/admin" className="rounded-full border border-[#333] px-4 py-2 text-sm text-neutral-500 hover:border-[#ffd400] hover:text-[#ffd400]">
              Admin
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-mono-lab text-[11px] tracking-[0.3em] text-neutral-500">HORAIRES</h3>
          <p className="mt-4 text-[15px] text-neutral-300">Lun — Dim<br /><span className="font-mono-lab text-[#ffd400]">12:00 — 01:00</span><br /><span className="text-sm text-neutral-500">Ven: 14:00 — 01:00</span></p>
          <a href={RESTAURANT.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost font-mono-lab mt-5 inline-block rounded-full px-6 py-2.5 text-[12px] font-bold tracking-[0.2em]">
            ITINÉRAIRE →
          </a>
        </div>
      </div>
      <div className="border-t border-[#151619]">
        <div className="font-mono-lab mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-[11px] tracking-widest text-neutral-600 sm:flex-row sm:px-6">
          <span>{t("footer.rights")}</span>
          <span>STATUS: ACTIVE // TEMP 24°C // LAB-001</span>
        </div>
      </div>
    </footer>
  );
}
