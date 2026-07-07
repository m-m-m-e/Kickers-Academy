"use client";

import { useMemo, useState } from "react";
import type { AboutCoach, ImageContentItem } from "@/lib/home-content";
import { AdminSaveButton } from "@/components/admin-save-button";
import { useHomeContent } from "@/components/home-content-provider";

function uploadToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export function AboutAdminManager() {
  const {
    content,
    addAboutSection,
    updateAboutHero,
    updateAboutSection,
    deleteAboutSection,
    addAboutCoach,
    updateAboutCoach,
    deleteAboutCoach
  } = useHomeContent();
  const [selectedId, setSelectedId] = useState<string | null>(content.aboutSections[0]?.id ?? null);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(content.aboutCoaches[0]?.id ?? null);
  const heroItem = content.aboutItems[0] ?? null;
  const currentItems = useMemo(() => content.aboutSections, [content.aboutSections]);
  const selectedItem = currentItems.find((item) => item.id === selectedId) ?? currentItems[0] ?? null;
  const selectedCoach = content.aboutCoaches.find((coach) => coach.id === selectedCoachId) ?? content.aboutCoaches[0] ?? null;

  const handleAdd = () => {
    const newItemId = addAboutSection({
      id: `about-${Date.now()}`,
      title: "New About Section",
      description: "Write the section content here.",
      image: ""
    });
    setSelectedId(newItemId);
  };

  const handleChange = (item: ImageContentItem, field: keyof ImageContentItem, value: string) => {
    updateAboutSection({ ...item, [field]: value });
  };

  const parseLines = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);

  const handleListItemsChange = (item: ImageContentItem, value: string) => {
    updateAboutSection({ ...item, listItems: parseLines(value) });
  };

  const handleFile = async (item: ImageContentItem, file: File | null) => {
    if (!file) return;
    const dataUrl = await uploadToDataUrl(file);
    updateAboutSection({ ...item, image: dataUrl });
  };

  const handleHeroChange = (field: keyof ImageContentItem, value: string) => {
    if (!heroItem) {
      return;
    }
    updateAboutHero({ ...heroItem, [field]: value });
  };

  const handleHeroFile = async (file: File | null) => {
    if (!file || !heroItem) {
      return;
    }
    const dataUrl = await uploadToDataUrl(file);
    updateAboutHero({ ...heroItem, image: dataUrl });
  };

  const handleHeroRemove = () => {
    if (!heroItem) {
      return;
    }
    updateAboutHero({ ...heroItem, image: "" });
  };

  const handleRemove = (item: ImageContentItem) => {
    updateAboutSection({ ...item, image: "" });
  };

  const handleAddCoach = () => {
    const id = addAboutCoach();
    setSelectedCoachId(id);
  };

  const handleCoachChange = (coach: AboutCoach, field: keyof AboutCoach, value: string) => {
    updateAboutCoach({ ...coach, [field]: value });
  };

  const handleCoachPointsChange = (coach: AboutCoach, value: string) => {
    updateAboutCoach({ ...coach, philosophyPoints: parseLines(value) });
  };

  const handleItemIconsChange = (item: ImageContentItem, value: string) => {
    updateAboutSection({ ...item, itemIcons: value.split(",").map(v => v.trim()).filter(Boolean) });
  };

  const handleDisplayTypeChange = (item: ImageContentItem, value: string) => {
    updateAboutSection({ ...item, displayType: value as any });
  };

  const handleSummaryChange = (item: ImageContentItem, value: string) => {
    updateAboutSection({ ...item, summary: value });
  };

  const handleCoachFile = async (coach: AboutCoach, file: File | null) => {
    if (!file) return;
    const dataUrl = await uploadToDataUrl(file);
    updateAboutCoach({ ...coach, image: dataUrl });
  };

  const handleCoachIconsChange = (coach: AboutCoach, value: string) => {
    const icons = value.split(",").map(v => v.trim()).filter(Boolean);
    updateAboutCoach({ ...coach, philosophyIcons: icons });
  };

  const handleCoachRemoveImage = (coach: AboutCoach) => {
    updateAboutCoach({ ...coach, image: "" });
  };

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">About Module</p>
          <h1 className="mt-3 text-4xl font-black">Manage the About page content</h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Create, edit, upload images for, and delete the sections that appear on the public About page.
          </p>
        </div>

        <div className="mt-6">
          <AdminSaveButton />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Add New Section
          </button>
          {currentItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedId === item.id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">About Hero</p>
              <h2 className="mt-2 text-2xl font-bold">Edit the full-width hero</h2>
            </div>
          </div>

          {heroItem ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
              <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                {heroItem.image ? (
                  <img src={heroItem.image} alt={heroItem.title} className="h-full w-full object-contain object-center" />
                ) : (
                  <span>Upload hero background image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleHeroFile(event.target.files?.[0] ?? null)}
                />
              </label>

              <div className="space-y-3">
                <input
                  value={heroItem.title}
                  onChange={(event) => handleHeroChange("title", event.target.value)}
                  placeholder="Hero label or small title"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={heroItem.description}
                  onChange={(event) => handleHeroChange("description", event.target.value)}
                  placeholder="Hero text"
                  rows={9}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={heroItem.image}
                  onChange={(event) => handleHeroChange("image", event.target.value)}
                  placeholder="Image URL or uploaded file data"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <div className="flex flex-wrap gap-3">
                  {heroItem.image ? (
                    <button
                      type="button"
                      onClick={handleHeroRemove}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                    >
                      Remove Image
                    </button>
                  ) : null}
                </div>
                <p className="text-sm text-zinc-400">
                  This content is used as the hero background and the intro text on the public About page.
                </p>
              </div>
            </div>
          ) : null}
        </section>

        {selectedItem ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6">
            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                {selectedItem.image ? (
                  <img src={selectedItem.image} alt={selectedItem.title} className="h-full w-full object-contain object-center" />
                ) : (
                  <span>Upload background image</span>
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
                  placeholder="Section title"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={selectedItem.description}
                  onChange={(event) => handleChange(selectedItem, "description", event.target.value)}
                  placeholder="Section text"
                  rows={10}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={(selectedItem.listItems ?? []).join("\n")}
                  onChange={(event) => handleListItemsChange(selectedItem, event.target.value)}
                  placeholder="List items (one per line)"
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <select
                  value={selectedItem.displayType ?? "paragraph"}
                  onChange={(event) => handleDisplayTypeChange(selectedItem, event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                >
                  <option value="paragraph">Display as: Paragraph (typewriter)</option>
                  <option value="accordion">Display as: Accordion (expandable)</option>
                  <option value="grid">Display as: Grid (3-column)</option>
                  <option value="row">Display as: Row (4-column)</option>
                  <option value="iconList">Display as: Icon List (bullets with icons)</option>
                  <option value="callout">Display as: Callout (highlighted)</option>
                </select>
                <textarea
                  value={(selectedItem.itemIcons ?? []).join(", ")}
                  onChange={(event) => handleItemIconsChange(selectedItem, event.target.value)}
                  placeholder="Icons or emojis (comma-separated, e.g., 🤝, 💪, 🙌)"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={selectedItem.summary ?? ""}
                  onChange={(event) => handleSummaryChange(selectedItem, event.target.value)}
                  placeholder="Summary (shown in accordion/callout when collapsed)"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={selectedItem.image}
                  onChange={(event) => handleChange(selectedItem, "image", event.target.value)}
                  placeholder="Image URL or uploaded file data"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
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
                    onClick={() => deleteAboutSection(selectedItem.id)}
                    className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panelAlt p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Our Coaches</p>
              <h2 className="mt-2 text-2xl font-bold">Manage the coaches submodule</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                Add the people behind the work, their image, their program or team responsibility, and their coaching
                philosophy.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddCoach}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Add Coach
            </button>
          </div>

          <div className="mt-5">
            <AdminSaveButton label="Save Coaches" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {content.aboutCoaches.map((coach) => (
              <button
                key={coach.id}
                type="button"
                onClick={() => setSelectedCoachId(coach.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCoachId === coach.id
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
                }`}
              >
                {coach.name}
              </button>
            ))}
          </div>

          {selectedCoach ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
              <label className="flex min-h-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                {selectedCoach.image ? (
                  <img src={selectedCoach.image} alt={selectedCoach.name} className="h-full w-full object-cover" />
                ) : (
                  <span>Upload coach image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleCoachFile(selectedCoach, event.target.files?.[0] ?? null)}
                />
              </label>

              <div className="space-y-3">
                <input
                  value={selectedCoach.name}
                  onChange={(event) => handleCoachChange(selectedCoach, "name", event.target.value)}
                  placeholder="Coach name"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={selectedCoach.program}
                  onChange={(event) => handleCoachChange(selectedCoach, "program", event.target.value)}
                  placeholder="Program or team responsibility"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={selectedCoach.philosophy}
                  onChange={(event) => handleCoachChange(selectedCoach, "philosophy", event.target.value)}
                  placeholder="Coach philosophy"
                  rows={7}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={(selectedCoach.philosophyPoints ?? []).join("\n")}
                  onChange={(event) => handleCoachPointsChange(selectedCoach, event.target.value)}
                  placeholder="Coaching philosophy bullet points (one per line)"
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={(selectedCoach.philosophyIcons ?? []).join(", ")}
                  onChange={(event) => handleCoachIconsChange(selectedCoach, event.target.value)}
                  placeholder="Icons for philosophy points (comma-separated, e.g., 🎯, 📚, 🌟, 🤝)"
                  rows={2}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={selectedCoach.image}
                  onChange={(event) => handleCoachChange(selectedCoach, "image", event.target.value)}
                  placeholder="Image URL or uploaded file data"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />

                <div className="flex flex-wrap gap-3">
                  {selectedCoach.image ? (
                    <button
                      type="button"
                      onClick={() => handleCoachRemoveImage(selectedCoach)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                    >
                      Remove Image
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => deleteAboutCoach(selectedCoach.id)}
                    className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                  >
                    Delete Coach
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
