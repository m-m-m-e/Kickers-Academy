"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";

const cropMap: Record<string, string> = {
  "under-7": "center 15%",
  "under-9": "center 30%",
  "under-11": "center 25%",
  "under-13": "center 20%",
  "under-15": "center 40%",
  "under-17": "center 12%"
};

const tintMap: Record<string, string> = {
  "under-7": "from-red-500/25",
  "under-9": "from-white/18",
  "under-11": "from-red-400/22",
  "under-13": "from-white/12",
  "under-15": "from-red-600/24",
  "under-17": "from-white/10"
};

const PROGRAM_GALLERY_PAGE_SIZE = 5;

export function ProgramDetailClient({ slug }: { slug: string }) {
  const { content } = useHomeContent();
  const group = content.programGroups.find((item) => item.slug === slug);
  const [galleryPage, setGalleryPage] = useState(0);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const galleryItems = useMemo(
    () => group?.mediaItems.filter((item) => item.mediaType === "image") ?? [],
    [group]
  );
  const galleryTotalPages = Math.max(1, Math.ceil(galleryItems.length / PROGRAM_GALLERY_PAGE_SIZE));
  const visibleGalleryItems = galleryItems.slice(
    galleryPage * PROGRAM_GALLERY_PAGE_SIZE,
    galleryPage * PROGRAM_GALLERY_PAGE_SIZE + PROGRAM_GALLERY_PAGE_SIZE
  );
  const selectedGalleryItem = selectedGalleryIndex === null ? null : galleryItems[selectedGalleryIndex] ?? null;

  if (!group) {
    return (
      <PublicShell>
        <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
          <div className="max-w-xl text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Programs</p>
            <h1 className="mt-4 text-4xl font-black">Program not found</h1>
            <Link href="/programs" className="mt-8 inline-flex rounded-full bg-red-500 px-6 py-3 font-semibold text-white">
              Back to Programs
            </Link>
          </div>
        </main>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <section
          className="relative min-h-[72vh] w-full overflow-hidden bg-cover bg-center px-6 py-24 text-center shadow-glow sm:px-10 lg:px-16 lg:py-32"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.84)), url(${group.image})`,
            backgroundPosition: cropMap[group.slug] ?? "center center"
          }}
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${tintMap[group.slug] ?? "from-white/10"} via-transparent to-black/65`}
          />
          <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-6xl items-center justify-center">
            <div className="w-full max-w-7xl rounded-[2rem] border border-white/10 bg-black/30 px-6 py-12 backdrop-blur-sm sm:px-10 lg:px-16">
              <p className="text-sm uppercase tracking-[0.35em] text-red-200">Programs</p>
              <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl lg:text-8xl">{group.title}</h1>
              <p className="mx-auto mt-6 max-w-6xl text-xl leading-9 text-zinc-100 sm:text-2xl lg:text-3xl">
                {group.description}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/programs" className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm font-semibold text-zinc-100 backdrop-blur transition hover:bg-black/40 hover:text-white">
                  Back to Programs
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-12 max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {group.subSections.map((section) => (
              <article key={section.id} className="rounded-[2.2rem] border border-white/10 bg-panel p-6 shadow-glow">
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">{section.title}</p>
                <p className="mt-4 text-lg leading-8 text-zinc-200">{section.description}</p>
              </article>
            ))}
          </div>

          <section className="mt-12 overflow-hidden rounded-[2.2rem] bg-[#090909]">
            <div className="px-6 py-5 sm:px-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Program Gallery</p>
              <h2 className="mt-2 text-3xl font-black text-white">Images from this program</h2>
            </div>

            {galleryItems.length ? (
              <div className="px-6 py-6 sm:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {visibleGalleryItems.map((item, index) => (
                    <article
                      key={item.id}
                      className="group overflow-hidden rounded-2xl bg-black/40 transition hover:-translate-y-1 hover:bg-black/55"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedGalleryIndex(galleryPage * PROGRAM_GALLERY_PAGE_SIZE + index)}
                        className="relative block aspect-square w-full bg-black"
                        aria-label={`Open ${item.title} in full view`}
                      >
                        <img
                          src={item.thumbnail || item.src}
                          alt={item.title}
                          className="h-full w-full object-contain object-center"
                        />
                        <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/5" />
                      </button>
                      <div className="p-4">
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-center gap-4 pt-6">
                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.from({ length: galleryTotalPages }, (_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setGalleryPage(index)}
                        className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                          galleryPage === index
                            ? "bg-red-500 text-white"
                            : "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={galleryPage === 0}
                      onClick={() => setGalleryPage((current) => Math.max(0, current - 1))}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={galleryPage >= galleryTotalPages - 1}
                      onClick={() => setGalleryPage((current) => Math.min(galleryTotalPages - 1, current + 1))}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-10 sm:px-8">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-8 text-center text-zinc-300">
                  Add image items to this program in the admin module to show them here.
                </div>
              </div>
            )}
          </section>

        </div>
      </main>

      {selectedGalleryItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-3 py-4 sm:px-6 sm:py-8">
          <div className="relative flex h-[88vh] w-full max-w-[96rem] items-center justify-center overflow-hidden rounded-[2rem] bg-[#090909] shadow-glow">
            <button
              type="button"
              onClick={() => setSelectedGalleryIndex(null)}
              className="absolute right-5 top-5 z-20 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              Close
            </button>

            <div className="flex h-full w-full flex-col items-center justify-end gap-8 bg-black px-6 py-8 pb-10 pt-16">
              <div className="flex w-full flex-1 min-h-0 items-center justify-center">
                <img
                  src={selectedGalleryItem.src}
                  alt={selectedGalleryItem.title}
                  className="h-auto max-h-full w-auto max-w-full object-contain object-center"
                />
              </div>
              <div className="flex w-full justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedGalleryIndex((current) =>
                      current === null ? 0 : (current - 1 + galleryItems.length) % galleryItems.length
                    )
                  }
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedGalleryIndex((current) =>
                      current === null ? 0 : (current + 1) % galleryItems.length
                    )
                  }
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PublicShell>
  );
}
