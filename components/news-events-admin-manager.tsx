"use client";

import { useMemo, useState } from "react";
import type { ImageContentItem } from "@/lib/home-content";
import { AdminSaveButton } from "@/components/admin-save-button";
import { useHomeContent } from "@/components/home-content-provider";

const TABLE_PAGE_SIZE = 20;

function uploadToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export function NewsEventsAdminManager() {
  const {
    content,
    updateNewsEventsHero,
    addSectionItem,
    updateSectionItem,
    deleteSectionItem
  } = useHomeContent();

  const [selectedId, setSelectedId] = useState<string | null>(content.newsItems[0]?.id ?? null);
  const [tablePage, setTablePage] = useState(0);
  const selectedItem = useMemo(
    () => content.newsItems.find((item) => item.id === selectedId) ?? content.newsItems[0] ?? null,
    [content.newsItems, selectedId]
  );
  const totalPages = Math.max(1, Math.ceil(content.newsItems.length / TABLE_PAGE_SIZE));
  const visibleNewsItems = content.newsItems.slice(tablePage * TABLE_PAGE_SIZE, tablePage * TABLE_PAGE_SIZE + TABLE_PAGE_SIZE);

  const handleHeroChange = (field: keyof ImageContentItem, value: string) => {
    updateNewsEventsHero({ ...content.newsEventsHero, [field]: value });
  };

  const handleHeroFile = async (file: File | null) => {
    if (!file) return;
    const dataUrl = await uploadToDataUrl(file);
    updateNewsEventsHero({ ...content.newsEventsHero, image: dataUrl });
  };

  const handleHeroRemove = () => {
    updateNewsEventsHero({ ...content.newsEventsHero, image: "" });
  };

  const handleAdd = () => {
    const nextItem = {
      id: `news-${Date.now()}`,
      title: "New News Item",
      description: "Write the article text here.",
      image: "",
      slug: `news-${Date.now()}`,
      kind: "news" as const,
      article: "Write the full article body here.",
      occurrenceDate: new Date().toISOString().slice(0, 16),
      pinned: false
    };
    addSectionItem("newsEvents", nextItem);
    setSelectedId(nextItem.id);
    setTablePage(0);
  };

  const handleChange = (field: keyof ImageContentItem, value: string) => {
    if (!selectedItem) return;
    updateSectionItem("newsEvents", { ...selectedItem, [field]: value } as ImageContentItem);
  };

  const handlePinnedChange = (value: boolean) => {
    if (!selectedItem) return;
    updateSectionItem("newsEvents", { ...selectedItem, pinned: value } as ImageContentItem);
  };

  const handleFile = async (file: File | null) => {
    if (!file || !selectedItem) return;
    const dataUrl = await uploadToDataUrl(file);
    updateSectionItem("newsEvents", { ...selectedItem, image: dataUrl } as ImageContentItem);
  };

  const handleItemRemove = () => {
    if (!selectedItem) return;
    updateSectionItem("newsEvents", { ...selectedItem, image: "" } as ImageContentItem);
  };

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">News & Events Module</p>
          <h1 className="mt-3 text-4xl font-black">Manage news, events, and related stories</h1>
          <p className="mt-4 max-w-4xl text-zinc-300">
            Edit the hero and the article list that appears on the public news module and detail pages.
          </p>
        </div>

        <div className="mt-6">
          <AdminSaveButton />
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">News Hero</p>
              <h2 className="mt-2 text-2xl font-bold">Edit the page hero</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
            <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
              {content.newsEventsHero.image ? (
                <img src={content.newsEventsHero.image} alt={content.newsEventsHero.title} className="h-full w-full object-contain object-center" />
              ) : (
                <span>Upload hero image</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleHeroFile(event.target.files?.[0] ?? null)} />
            </label>

            <div className="space-y-3">
              <input
                value={content.newsEventsHero.title}
                onChange={(event) => handleHeroChange("title", event.target.value)}
                placeholder="Hero title"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
              />
              <textarea
                value={content.newsEventsHero.description}
                onChange={(event) => handleHeroChange("description", event.target.value)}
                placeholder="Hero text"
                rows={8}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
              />
              <input
                value={content.newsEventsHero.image}
                onChange={(event) => handleHeroChange("image", event.target.value)}
                placeholder="Image URL or uploaded file data"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
              />
              <div className="flex flex-wrap gap-3">
                {content.newsEventsHero.image ? (
                  <button
                    type="button"
                    onClick={handleHeroRemove}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                  >
                    Remove Image
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">News & Events Table</p>
              <h2 className="mt-2 text-2xl font-bold">Created news and events</h2>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Add News / Event
            </button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Pinned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {visibleNewsItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer transition hover:bg-white/5 ${selectedId === item.id ? "bg-red-500/10" : "bg-black/20"}`}
                  >
                    <td className="px-4 py-4 font-semibold text-white">{item.title || "Untitled item"}</td>
                    <td className="px-4 py-4 capitalize text-zinc-300">{item.kind ?? "news"}</td>
                    <td className="px-4 py-4 text-zinc-300">{item.occurrenceDate || "No date"}</td>
                    <td className="px-4 py-4 text-zinc-300">{item.pinned ? "Pinned" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
            <span>
              Showing {visibleNewsItems.length} of {content.newsItems.length} items. Page {tablePage + 1} of {totalPages}.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={tablePage === 0}
                onClick={() => setTablePage((page) => Math.max(0, page - 1))}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={tablePage >= totalPages - 1}
                onClick={() => setTablePage((page) => Math.min(totalPages - 1, page + 1))}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {selectedItem ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Selected Item</p>
                <h2 className="mt-2 text-2xl font-bold">{selectedItem.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => deleteSectionItem("newsEvents", selectedItem.id)}
                className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
              >
                Delete Item
              </button>
            </div>

            <div className="mt-5">
              <AdminSaveButton label="Save News / Event" />
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="space-y-3">
                <label className="flex min-h-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                  {selectedItem.image ? (
                    <img src={selectedItem.image} alt={selectedItem.title} className="h-full w-full object-contain object-center" />
                  ) : (
                    <span>Upload item image</span>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} />
                </label>
                {selectedItem.image ? (
                  <button
                    type="button"
                    onClick={handleItemRemove}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200"
                  >
                    Remove Image
                  </button>
                ) : null}
              </div>

              <div className="space-y-3">
                <input
                  value={selectedItem.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  placeholder="Title"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={selectedItem.slug ?? ""}
                  onChange={(event) => handleChange("slug", event.target.value)}
                  placeholder="Slug"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <select
                  value={selectedItem.kind ?? "news"}
                  onChange={(event) => handleChange("kind", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                >
                  <option value="news">News</option>
                  <option value="event">Event</option>
                </select>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Calendar date and time</span>
                  <input
                    type="datetime-local"
                    value={selectedItem.occurrenceDate ?? ""}
                    onChange={(event) => handleChange("occurrenceDate", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                  />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedItem.pinned)}
                    onChange={(event) => handlePinnedChange(event.target.checked)}
                  />
                  <span className="text-sm text-zinc-200">
                    Pin this item so it remains visible after its date passes.
                  </span>
                </label>
                <textarea
                  value={selectedItem.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  placeholder="Short card/hero summary"
                  rows={7}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={selectedItem.article ?? selectedItem.description}
                  onChange={(event) => handleChange("article", event.target.value)}
                  placeholder="Full article text"
                  rows={18}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={selectedItem.image}
                  onChange={(event) => handleChange("image", event.target.value)}
                  placeholder="Image URL or uploaded file data"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <AdminSaveButton label="Save News / Event" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
