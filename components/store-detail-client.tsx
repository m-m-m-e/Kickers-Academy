"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";
import type { StoreProduct } from "@/lib/home-content";

const cropMap: Record<string, string> = {
  jerseys: "center 18%",
  "full-kit": "center 24%",
  "track-pants": "center 28%",
  hoodies: "center 22%"
};

const shopLinkMap: Record<string, string> = {
  jerseys: "https://kickforlife.store/products/kickers-academy-t-shirts?variant=53365150744939",
  "full-kit": "https://kickforlife.store/products/kickers-academy-full-uniform?variant=53374879793515",
  "track-pants": "https://kickforlife.store/products/kickers-academy-track-suits?variant=53365183119723"
};

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-zinc-200">
      {children}
    </span>
  );
}

function ProductViewer({
  item,
  shopHref,
  onClose,
  onPrev,
  onNext
}: {
  item: StoreProduct | null;
  shopHref: string;
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
            <p className="text-xs uppercase tracking-[0.35em] text-red-300">Merchandise Viewer</p>
            <h3 className="mt-1 text-xl font-bold text-white">{item.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            Close
          </button>
        </div>
        <div className="relative h-[calc(88vh-73px)] w-full bg-black">
          <img src={item.image} alt={item.title} className="h-full w-full object-contain object-center" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pb-5 text-center sm:px-8 sm:pb-7">
            <Badge>{item.price}</Badge>
            <p className="mx-auto mt-4 max-w-5xl text-lg leading-8 text-zinc-100 sm:text-xl lg:text-2xl">
              {item.description}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
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
              <a
                href={shopHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white"
              >
                Shop
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StoreDetailClient({ slug }: { slug: string }) {
  const { content } = useHomeContent();
  const category = content.storeCategories.find((entry) => entry.slug === slug);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const products = useMemo(() => category?.products ?? [], [category]);
  const selectedProduct = selectedIndex === null ? null : products[selectedIndex] ?? null;
  const shopHref = category ? shopLinkMap[category.slug] ?? "https://www.kickforlife.store" : "https://www.kickforlife.store";

  if (!category) {
    return (
      <PublicShell>
        <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
          <div className="max-w-xl text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Store</p>
            <h1 className="mt-4 text-4xl font-black">Collection not found</h1>
            <Link href="/store" className="mt-8 inline-flex rounded-full bg-red-500 px-6 py-3 font-semibold text-white">
              Back to Store
            </Link>
          </div>
        </main>
      </PublicShell>
    );
  }

  const openProduct = (index: number) => {
    setSelectedIndex(index);
  };
  const closeProduct = () => setSelectedIndex(null);
  const nextProduct = () => setSelectedIndex((current) => ((current ?? 0) + 1) % products.length);
  const prevProduct = () => setSelectedIndex((current) => ((current ?? 0) - 1 + products.length) % products.length);

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <section
          className="relative min-h-[72vh] w-full overflow-hidden bg-cover bg-center px-6 py-24 text-center shadow-glow sm:px-10 lg:px-16 lg:py-32"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.14), rgba(0,0,0,0.84)), url(${category.image})`,
            backgroundPosition: cropMap[category.slug] ?? "center center"
          }}
        >
          <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-6xl items-center justify-center">
            <div className="w-full max-w-7xl rounded-[2rem] border border-white/10 bg-black/30 px-6 py-12 backdrop-blur-sm sm:px-10 lg:px-16">
              <p className="text-sm uppercase tracking-[0.35em] text-red-200">Store</p>
              <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl lg:text-8xl">{category.title}</h1>
              <p className="mx-auto mt-6 max-w-5xl text-xl leading-9 text-zinc-100 sm:text-2xl lg:text-3xl">
                {category.description}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={shopHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
                >
                  Shop
                </a>
                <Link
                  href="/store"
                  className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm font-semibold text-zinc-100 backdrop-blur transition hover:bg-black/40 hover:text-white"
                >
                  Back to Categories
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-12 max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openProduct(index)}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-panel text-left transition hover:-translate-y-1 hover:border-red-400/40"
              >
                <div className="relative aspect-[4/5] bg-black">
                  <img src={item.image} alt={item.title} className="h-full w-full object-contain object-center" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0" />
                  <div className="absolute left-2 top-2">
                    <Badge>{item.price}</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{item.description}</p>
                </div>
              </button>
            ))}
          </div>

        </div>
      </main>

      {selectedProduct ? (
        <ProductViewer item={selectedProduct} shopHref={shopHref} onClose={closeProduct} onPrev={prevProduct} onNext={nextProduct} />
      ) : null}
    </PublicShell>
  );
}
