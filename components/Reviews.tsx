"use client";
import React from "react";
import { RESTAURANT } from "@/data/restaurant";
import { REVIEWS } from "@/data/reviews";
import { Reveal, SectionHead, Stripes } from "./ui";
import { useLang } from "./Providers";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import CountUp from "./CountUp";

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n} sur 5 étoiles`} className="text-[#ffd400]">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

export default function Reviews() {
  const { t } = useLang();
  const s = usePublicSettings();
  const rating = s.restaurant?.rating ?? RESTAURANT.rating;
  const reviewCount = s.restaurant?.reviewCount ?? RESTAURANT.reviewCount;
  return (
    <section id="avis" className="relative z-10 scroll-mt-24 border-y border-[#1c1e21] bg-[#08080a]/85 py-20 backdrop-blur" aria-label="Avis Google">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead code="PROTOCOLE 05 // PREUVES" title={t("reviews.title")} sub="GOOGLE REVIEWS // VERIFIED" />
        <div className="grid items-start gap-8 lg:grid-cols-[320px_1fr]">
          <Reveal>
            <div className="metal-panel rounded-2xl p-8 text-center">
              <p className="font-display text-7xl text-[#ffd400]">{rating.toFixed(1)}</p>
              <p className="mt-1 text-2xl"><Stars n={5} /></p>
              <p className="font-mono-lab mt-3 text-[11px] tracking-[0.25em] text-neutral-400">
                <CountUp to={reviewCount} />+ GOOGLE REVIEWS
              </p>
              <a
                href={RESTAURANT.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost font-mono-lab mt-6 inline-block rounded-full px-6 py-3 text-[12px] font-bold tracking-[0.2em]"
              >
                READ ALL REVIEWS →
              </a>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {REVIEWS.map((r, i) => (
              <Reveal key={i} delay={i * 70}>
                <blockquote className="h-full rounded-2xl border border-[#222] bg-[#101112] p-6">
                  <Stars n={r.rating} />
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-200">“{r.text}”</p>
                  <footer className="font-mono-lab mt-4 text-[11px] tracking-widest text-neutral-500">
                    {r.author} • {r.source} • {r.date}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <Stripes className="mx-auto mt-12 h-2 max-w-7xl opacity-60 stripes-fade" thin />
    </section>
  );
}
