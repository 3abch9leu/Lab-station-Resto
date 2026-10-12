"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import MenuModal from "@/components/MenuModal";
import AboutLab from "@/components/AboutLab";
import Experiment from "@/components/Experiment";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Location from "@/components/Location";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import Cursor from "@/components/Cursor";
import Magnetic from "@/components/Magnetic";
import Tunnel from "@/components/Tunnel";
import ScrollProgress from "@/components/ScrollProgress";
import PromoBanner from "@/components/PromoBanner";
import { useCart } from "@/components/Providers";

const LabScene = dynamic(() => import("@/components/LabScene"), { ssr: false });

function StickyOrder() {
  const { count, setOpen } = useCart();
  return (
    <Magnetic strength={14} className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="btn-lab font-mono-lab flex items-center gap-2 rounded-full px-6 py-3.5 text-[13px] font-bold tracking-[0.2em] shadow-2xl glow-lab"
        aria-label={`Commander, ${count} articles dans le panier`}
      >
        COMMANDER <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-black text-[11px] text-[#ffd400]">{count}</span>
      </button>
    </Magnetic>
  );
}

export default function HomePage() {
  const explodeRef = React.useRef(0);
  const scrollRef = React.useRef(0);

  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = h > 0 ? window.scrollY / h : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <LoadingScreen />
      <Tunnel />
      <LabScene scrollRef={scrollRef} />
      {/* cinematic film grain */}
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[65]" />
      <Navbar />
      <PromoBanner />
      <main className="relative">
        <Hero explodeRef={explodeRef} />
        <MenuSection />
        <AboutLab />
        <Experiment />
        <Gallery />
        <Reviews />
        <Location />
      </main>
      <Footer />
      <MenuModal />
      <CartDrawer />
      <StickyOrder />
    </>
  );
}
