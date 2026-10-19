"use client";
import React from "react";
import { HOURS, getOpenStatus } from "@/data/hours";
import { RESTAURANT } from "@/data/restaurant";
import { Reveal, SectionHead } from "./ui";
import { useLang } from "./Providers";
import { usePublicSettings } from "@/hooks/usePublicSettings";

export default function Location() {
  const { t } = useLang();
  const s = usePublicSettings();
  // Backend hours override static defaults once loaded (identical first paint).
  const hours = s.hours && s.hours.length === 7 ? s.hours : HOURS;
  const [status, setStatus] = React.useState(() => getOpenStatus(new Date()));
  React.useEffect(() => {
    const id = setInterval(() => setStatus(getOpenStatus(new Date())), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="lieu" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6" aria-label="Location Lab Station">
      <SectionHead code="PROTOCOLE 06 // LOCATION" title={t("location.title")} sub="AV. HÉDI NOUIRA — ARIANA, TUNISIA" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="metal-panel rounded-2xl p-7 sm:p-9">
            <p className={`font-mono-lab inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] tracking-[0.25em] ${status.open ? "border-[#ffd400]/60 text-[#ffd400]" : "border-red-500/60 text-red-400"}`} role="status">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping-soft absolute h-2 w-2 rounded-full ${status.open ? "bg-[#ffd400]" : "bg-red-500"}`} />
                <span className={`h-2 w-2 rounded-full ${status.open ? "bg-[#ffd400]" : "bg-red-500"}`} />
              </span>
              {status.label} — {status.detail}
            </p>
            <h3 className="font-display mt-5 text-4xl leading-none sm:text-5xl">LAB STATION</h3>
            <address className="mt-3 text-lg not-italic leading-relaxed text-neutral-300">
              {RESTAURANT.address.street}<br />
              {RESTAURANT.address.city}, {RESTAURANT.address.country}<br />
              {RESTAURANT.phones.map((p, i) => (
                <span key={p.tel}>
                  {i > 0 && <br />}
                  <a href={`tel:${p.tel}`} className="mt-1 inline-block font-display text-2xl tracking-wide text-[#ffd400] hover:underline">
                    {p.label}
                  </a>
                </span>
              ))}
            </address>

            <div className="mt-6">
              <h4 className="font-mono-lab text-[11px] tracking-[0.3em] text-neutral-400">HORAIRES // CONFIGURABLE</h4>
              <ul className="mt-3 divide-y divide-[#222]">
                {hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-neutral-300">{h.day}</span>
                    <span className="font-mono-lab text-neutral-400">{h.open} — {h.close}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 flex flex-col gap-2.5">
              <a href={RESTAURANT.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-lab font-mono-lab rounded-full px-6 py-3.5 text-center text-[13px] font-bold tracking-[0.2em]">
                {t("location.directions")} →
              </a>
              <div className="grid grid-cols-2 gap-2.5">
                {RESTAURANT.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="btn-ghost font-mono-lab rounded-full px-4 py-3.5 text-center text-[12px] font-bold tracking-[0.15em]">
                    {t("location.call")} {p.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="overflow-hidden rounded-2xl border border-[#222]">
            <iframe
              title="Lab Station — carte Google Maps"
              src="https://www.google.com/maps?q=Lab+Station+Avenue+H%C3%A9di+Nouira+Ariana+Tunisia&output=embed"
              className="h-[420px] w-full grayscale invert-[0.92] contrast-[0.9] lg:h-full lg:min-h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
