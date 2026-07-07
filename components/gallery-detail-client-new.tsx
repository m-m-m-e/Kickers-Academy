"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";
import type { GalleryMediaItem } from "@/lib/home-content";

const cropMap: Record<string, string> = {
  training: "center 18%",
  "match-day": "center 28%",
  gym: "center 25%",
  parents: "center 35%",
  community: "center 22%",
  events: "center 30%"
};

const tintMap: Record<string, string> = {
  training: "from-red-500/25",
  "match-day": "from-white/18",
  gym: "from-red-400/22",
  parents: "from-white/12",
  community: "from-red-600/22",
  events: "from-white/10"
};

function MediaViewer({
  item,
  onClose,
  onPrev,
  onNext
}: {
  item: GalleryMediaItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-3 py-4 sm:px-6 sm:py-8">
      <div className="relative h-[88vh] w-full max-w-[96rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] shadow-glow">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-red-300">Gallery Viewer</p>
            <h3 className="mt-1 text-xl font-bold text-white">{item.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            Close
          </button>
        </div>
        <div className="relative h-[calc(88vh-73px)] w-full overflow-auto bg-black">
          <div className="flex h-full w-full items-center justify-center">
            {item.mediaType === "video" ? (
              <video controls autoPlay className="h-full max-h-full w-full max-w-full object-contain">
                <source src={item.src} />
              </video>
            ) : (
              <img src={item.src} alt={item.title} className="h-full max-h-full w-full max-w-full object-contain" />
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pb-5 text-center sm:px-8 sm:pb-7">
            <p className="mx-auto mt-4 max-w-5xl text-lg leading-8 text-zinc-100 sm:text-xl lg:text-2xl">
              {item.description}
            </p>
            {item.mediaType !== "video" ? (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={onPrev}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
                >
                  Previous
                </button>
                <button
                  onClick={onNext}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryDetailClient({ slug }: { slug: string }) {
  const { content } = useHomeContent();
  const category = content.galleryCategories.find((entry) => entry.slug === slug);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");

  const items = useMemo(() => category?.items ?? [], [category]);
  const imageItems = useMemo(() => items.filter((item) => item.mediaType === "image"), [items]);
  const videoItems = useMemo(() => items.filter((item) => item.mediaType === "video"), [items]);
  const activeItems = activeTab === "images" ? imageItems : videoItems;
  const selectedItem = selectedIndex === null ? null : activeItems[selectedIndex] ?? null;

  if (!category) {
    return (
      <PublicShell>
        <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
          <div className="max-w-xl text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Gallery</p>
            <h1 className="mt-4 text-4xl font-black">Category not found</h1>
            <Link href="/gallery" className="mt-8 inline-flex rounded-full bg-red-500 px-6 py-3 font-semibold text-white">
              Back to Gallery
            </Link>
          </div>
        </main>
      </PublicShell>
    );
  }

  const closeItem = () => setSelectedIndex(null);
  const openFilteredItem = (index: number) => setSelectedIndex(index);
  const nextItem = () => setSelectedIndex((current) => ((current ?? 0) + 1) % activeItems.length);
  const prevItem = () => setSelectedIndex((current) => ((current ?? 0) - 1 + activeItems.length) % activeItems.length);
  const switchTab = (tab: "images" | "videos") => {
    setActiveTab(tab);
    setSelectedIndex(null);
  };

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <section
          className="relative min-h-[72vh] w-full overflow-hidden bg-cover bg-center px-6 py-24 text-center shadow-glow sm:px-10 lg:px-16 lg:py-32"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.84)), url(${category.image})`,
            backgroundPosition: cropMap[category.slug] ?? "center center"
          }}
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${tintMap[category.slug] ?? "from-white/10"} via-transparent to-black/65`}
          />
          <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-6xl items-center justify-center">
            <div className="w-full max-w-7xl rounded-[2rem] border border-white/10 bg-black/30 px-6 py-12 backdrop-blur-sm sm:px-10 lg:px-16">
              <p className="text-sm uppercase tracking-[0.35em] text-red-200">Gallery</p>
              <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl lg:text-8xl">{category.title}</h1>
              <p className="mx-auto mt-6 max-w-6xl text-xl leading-9 text-zinc-100 sm:text-2xl lg:text-3xl">
                {category.description}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/gallery" className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm font-semibold text-zinc-100 backdrop-blur transition hover:bg-black/40 hover:text-white">
                  Back to Categories
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-12 max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => switchTab("images")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeTab === "images"
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
              }`}
            >
              Images ({imageItems.length})
            </button>
            <button
              type="button"
              onClick={() => switchTab("videos")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeTab === "videos"
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
              }`}
            >
              Videos ({videoItems.length})
            </button>
          </div>

          <div className="mt-8">
            {activeItems.length ? (
              <div className="flex flex-wrap justify-center gap-3">
                {activeItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openFilteredItem(index)}
                    className="group w-full max-w-[11.5rem] flex-[1_1_11rem] overflow-hidden rounded-2xl border border-white/10 bg-panel text-left transition hover:-translate-y-1 hover:border-red-400/40"
                  >
                    <div className="relative aspect-square overflow-hidden bg-black">
                      {item.mediaType === "video" ? (
                        <video
                          muted
                          playsInline
                          loop
                          autoPlay
                          preload="metadata"
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          poster={item.thumbnail || undefined}
                        >
                          <source src={item.src} />
                        </video>
                      ) : (
                        <img
                          src={item.thumbnail || item.src}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/0" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-panel p-10 text-center text-zinc-300">
                No {activeTab} added yet.
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedItem ? (
        <MediaViewer item={selectedItem} onClose={closeItem} onPrev={prevItem} onNext={nextItem} />
      ) : null}
    </PublicShell>
  );
}
