"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";
import { PublicModuleHero } from "@/components/public-module-hero";

export default function StorePage() {
  const { content } = useHomeContent();

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <PublicModuleHero eyebrow="Store" title={content.storeHero.title} description={content.storeHero.description} image={content.storeHero.image} />

        <div className="mx-auto mt-12 max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-6">
            {content.storeCategories.map((category) => (
              <Link
                key={category.id}
                href={`/store/${category.slug}`}
                className="group w-full max-w-sm flex-[1_1_18rem] overflow-hidden rounded-[2.2rem] border border-white/10 bg-panel transition hover:-translate-y-1 hover:border-red-400/40"
              >
                <div className="relative h-60 overflow-hidden bg-black">
                  <img src={category.image} alt={category.title} className="h-full w-full object-contain object-center" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/55" />
                </div>
                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">{category.title}</p>
                  <h2 className="mt-3 text-3xl font-black text-white">{category.title}</h2>
                  <p className="mt-4 text-zinc-300">{category.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-zinc-400">
                    <span>{category.products.length} items</span>
                  </div>
                  <div className="mt-6 inline-flex rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                    View Collection
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
