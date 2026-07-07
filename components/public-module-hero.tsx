"use client";

import type { ReactNode } from "react";

type PublicModuleHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  children?: ReactNode;
};

export function PublicModuleHero({ eyebrow, title, description, image, children }: PublicModuleHeroProps) {
  return (
    <section
      className="relative min-h-[72vh] w-full overflow-hidden bg-cover bg-center px-6 py-24 text-center shadow-glow sm:px-10 lg:px-16 lg:py-32"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.88)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="mx-auto flex min-h-[72vh] max-w-6xl items-center justify-center">
        <div className="w-full max-w-7xl rounded-[2rem] border border-white/10 bg-black/30 px-6 py-12 backdrop-blur-sm sm:px-10 lg:px-16">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">{eyebrow}</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl lg:text-8xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-6xl text-xl leading-9 text-zinc-100 sm:text-2xl lg:text-3xl">{description}</p>
          {children ? <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
