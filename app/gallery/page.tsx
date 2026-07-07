"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";
import { PublicModuleHero } from "@/components/public-module-hero";

const tintMap: Record<string, string> = {
  training: "from-red-500/30",
  "match-day": "from-white/18",
  gym: "from-red-400/24",
  parents: "from-white/12",
  community: "from-red-600/24",
  events: "from-white/10"
};

function MediaTypeBadge({ type }: { type: "image" | "video" }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-zinc-100">
      {type}
    </span>
  );
}

export default function GalleryPage() {
  const { content } = useHomeContent();

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <PublicModuleHero eyebrow="Gallery" title={content.galleryHero.title} description={content.galleryHero.description} image={content.galleryHero.image} />

        <div className="mx-auto mt-12 max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {content.galleryCategories.map((category) => (
              <Link
                key={category.id}
                href={`/gallery/${category.slug}`}
                className="group overflow-hidden rounded-[2.2rem] border border-white/10 bg-panel transition hover:-translate-y-1 hover:border-red-400/40"
              >
                <div className="relative h-60 overflow-hidden bg-black">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-contain object-center"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-b ${tintMap[category.slug] ?? "from-white/10"} via-transparent to-black/55`} />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm uppercase tracking-[0.35em] text-red-300">{category.title}</p>
                    {category.featured && category.slug !== "training" ? (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-3xl font-black text-white">{category.title}</h2>
                  <p className="mt-4 text-zinc-300">{category.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-zinc-400">
                    <span>{category.items.length} items</span>
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
