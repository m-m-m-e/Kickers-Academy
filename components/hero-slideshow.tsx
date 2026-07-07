"use client";

import { useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/home-content";

export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];
  if (!slide) {
    return null;
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url(${slide.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.72))]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-end px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-red-200">
            {active + 1} / {slides.length}
          </p>
          <h2 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">{slide.title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-200">{slide.description}</p>
        </div>
      </div>
    </section>
  );
}

