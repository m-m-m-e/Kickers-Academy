"use client";

import { useEffect, useState } from "react";
import type { ImageContentItem } from "@/lib/home-content";

export function GallerySlideshow({ items }: { items: ImageContentItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [items.length]);

  const item = items[active];
  if (!item) {
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-panel p-4 shadow-glow">
      <div className="overflow-hidden rounded-[1.5rem]">
        <div className="relative aspect-video bg-black">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-all duration-700"
          />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-white">{item.title}</h3>
        <p className="mt-2 text-zinc-300">{item.description}</p>
      </div>
    </div>
  );
}

