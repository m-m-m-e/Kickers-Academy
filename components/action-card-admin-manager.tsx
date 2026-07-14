"use client";

import { useMemo } from "react";
import type { ImageContentItem } from "@/lib/home-content";
import { AdminSaveButton } from "@/components/admin-save-button";
import { useHomeContent } from "@/components/home-content-provider";
import { uploadImage } from "@/lib/admin-upload";

type ActionCardKind = "join" | "donate" | "contact";

const config: Record<
  ActionCardKind,
  {
    title: string;
    eyebrow: string;
    fallbackIndex: number;
    keywords: string[];
  }
> = {
  join: {
    title: "Join Card",
    eyebrow: "Join",
    fallbackIndex: 0,
    keywords: ["join"]
  },
  donate: {
    title: "Engage Card",
    eyebrow: "Engage",
    fallbackIndex: 1,
    keywords: ["engage", "donate"]
  },
  contact: {
    title: "Contact Card",
    eyebrow: "Contact Us",
    fallbackIndex: 2,
    keywords: ["contact"]
  }
};

export function ActionCardAdminManager({ kind }: { kind: ActionCardKind }) {
  const { content, updateActionCard, updateActionCardImage } = useHomeContent();
  const settings = config[kind];

  const selectedItem = useMemo(() => {
    const matched = content.actionCards.find((item) =>
      settings.keywords.some((keyword) => item.title.toLowerCase().includes(keyword))
    );

    return matched ?? content.actionCards[settings.fallbackIndex] ?? content.actionCards[0] ?? null;
  }, [content.actionCards, settings.fallbackIndex, settings.keywords]);

  const handleChange = (field: keyof ImageContentItem, value: string) => {
    if (!selectedItem) return;
    updateActionCard({ ...selectedItem, [field]: value });
  };

  const handleFile = async (file: File | null) => {
    if (!file || !selectedItem) return;
    const url = await uploadImage(file);
    updateActionCardImage(selectedItem.id, url);
  };

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">{settings.eyebrow} Module</p>
          <h1 className="mt-3 text-4xl font-black">Manage the {settings.title.toLowerCase()}</h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Edit the image, title, and description for the {settings.eyebrow.toLowerCase()} card that appears on the home page.
          </p>
        </div>

        <div className="mt-6">
          <AdminSaveButton />
        </div>

        {selectedItem ? (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
              <label className="flex min-h-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                {selectedItem.image ? (
                  <img src={selectedItem.image} alt={selectedItem.title} className="h-full w-full object-cover" />
                ) : (
                  <span>Upload card image</span>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} />
              </label>

              <div className="space-y-4">
                <input
                  value={selectedItem.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                  placeholder="Card title"
                />
                <textarea
                  value={selectedItem.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none"
                  placeholder="Card description"
                />
                <input
                  value={selectedItem.image}
                  onChange={(event) => handleChange("image", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                  placeholder="Image URL or uploaded file data"
                />
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-zinc-300">
                  This card powers the public home card and the matching public page.
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 text-zinc-300">
            No card selected.
          </div>
        )}
      </div>
    </main>
  );
}
