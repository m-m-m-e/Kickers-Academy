"use client";

import { useMemo, useState } from "react";
import { createEmptyItem, type HomeSectionKey, type ImageContentItem } from "@/lib/home-content";
import { AdminSaveButton } from "@/components/admin-save-button";
import { useHomeContent } from "@/components/home-content-provider";

const sections: Array<{ key: HomeSectionKey; label: string }> = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "About Us" },
  { key: "programs", label: "Programs" },
  { key: "newsEvents", label: "News & Events" },
  { key: "merchandise", label: "Merchandise" },
  { key: "gallery", label: "Gallery" },
  { key: "actions", label: "Join / Engage / Contact" }
];

const sectionLabels: Record<HomeSectionKey, string> = {
  hero: "Hero Slides",
  about: "About Us",
  programs: "Programs",
  newsEvents: "News & Events",
  merchandise: "Merchandise",
  gallery: "Gallery",
  actions: "Join, Engage, Contact Us"
};

function uploadToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export function HomeAdminManager() {
  const { content, addSectionItem, updateSectionItem, deleteSectionItem } = useHomeContent();
  const [activeSection, setActiveSection] = useState<HomeSectionKey>("hero");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(content.heroSlides[0]?.id ?? null);
  const key = activeSection === "hero"
    ? "heroSlides"
    : activeSection === "about"
      ? "aboutItems"
      : activeSection === "programs"
        ? "programItems"
        : activeSection === "newsEvents"
          ? "newsItems"
          : activeSection === "merchandise"
            ? "merchandiseItems"
            : activeSection === "gallery"
              ? "galleryItems"
              : "actionCards";
  const currentItems = useMemo(() => content[key], [content, key]);
  const selectedItem = currentItems.find((item) => item.id === selectedItemId) ?? currentItems[0] ?? null;
  const isAbout = activeSection === "about";

  const handleChange = (item: ImageContentItem, field: keyof ImageContentItem, value: string) => {
    updateSectionItem(activeSection, { ...item, [field]: value });
  };

  const handleFile = async (item: ImageContentItem, file: File | null) => {
    if (!file) {
      return;
    }
    const dataUrl = await uploadToDataUrl(file);
    updateSectionItem(activeSection, { ...item, image: dataUrl });
  };

  const handleRemove = (item: ImageContentItem) => {
    updateSectionItem(activeSection, { ...item, image: "" });
  };

  const handleAdd = () => {
    const newItem = createEmptyItem(activeSection, currentItems.length + 1);
    addSectionItem(activeSection, newItem);
    setSelectedItemId(newItem.id);
  };

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">Home Module</p>
          <h1 className="mt-3 text-4xl font-black">Manage the home page sections</h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Choose any home section, create new items, edit content, upload images from your computer, or delete outdated items.
            Changes are reflected on the public home page in this prototype.
          </p>
        </div>

        <div className="mt-6">
          <AdminSaveButton />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeSection === section.key
                  ? "bg-red-500 text-white"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <section className="rounded-[2rem] border border-white/10 bg-panel p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Selected Module</p>
                <h2 className="mt-2 text-2xl font-bold">{sectionLabels[activeSection]}</h2>
              </div>
              {!isAbout ? (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Add New
                </button>
              ) : (
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200">
                  Single section
                </span>
              )}
            </div>

            {!isAbout ? (
              <div className="mt-6 space-y-3">
                {currentItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItemId(item.id)}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-red-400/40"
                  >
                    <p className="font-semibold text-white">{item.title || "Untitled item"}</p>
                    <p className="mt-1 text-sm text-zinc-400">{item.description || "No description yet."}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
                Edit the single About Us block here. The public page will show it as a centered text section with a background image.
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-panelAlt p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">CRUD Editor</p>
                <h2 className="mt-2 text-2xl font-bold">Edit the items in this module</h2>
              </div>
            </div>

            {selectedItem ? (
              <article className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-5">
                <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
                  <label className="flex min-h-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                    {selectedItem.image ? (
                      <img src={selectedItem.image} alt={selectedItem.title} className="h-full w-full object-contain object-center" />
                    ) : (
                      <span>Upload image</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleFile(selectedItem, event.target.files?.[0] ?? null)}
                    />
                  </label>

                  <div className="space-y-3">
                    <input
                      value={selectedItem.title}
                      onChange={(event) => handleChange(selectedItem, "title", event.target.value)}
                      placeholder={isAbout ? "Section heading" : "Title"}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                    />
                    <textarea
                      value={selectedItem.description}
                      onChange={(event) => handleChange(selectedItem, "description", event.target.value)}
                      placeholder={isAbout ? "About page text" : "Description"}
                      rows={isAbout ? 8 : 4}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                    />
                    <input
                      value={selectedItem.image}
                      onChange={(event) => handleChange(selectedItem, "image", event.target.value)}
                      placeholder="Image URL or uploaded file data"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                    />

                    <div className="flex flex-wrap gap-3">
                      {selectedItem.image ? (
                        <button
                          type="button"
                          onClick={() => handleRemove(selectedItem)}
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                        >
                          Remove Image
                        </button>
                      ) : null}
                      <AdminSaveButton label="Save Section" />
                      <button
                        type="button"
                        onClick={() => deleteSectionItem(activeSection, selectedItem.id)}
                        className={`rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 ${
                          isAbout ? "hidden" : ""
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-6 text-zinc-400">No item selected.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
