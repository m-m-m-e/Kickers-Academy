"use client";

import { useMemo, useState } from "react";
import type { GalleryCategory, GalleryMediaItem, ImageContentItem } from "@/lib/home-content";
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

function makeMediaTitle(file: File) {
  return file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim() || "Gallery Media";
}

export function GalleryAdminManager() {
  const {
    content,
    updateGalleryHero,
    addGalleryCategory,
    updateGalleryCategory,
    deleteGalleryCategory,
    addGalleryMediaItem,
    updateGalleryMediaItem,
    deleteGalleryMediaItem
  } = useHomeContent();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(content.galleryCategories[0]?.id ?? null);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [mediaTablePage, setMediaTablePage] = useState(0);
  const selectedCategory = useMemo(
    () => content.galleryCategories.find((category) => category.id === selectedCategoryId) ?? content.galleryCategories[0] ?? null,
    [content.galleryCategories, selectedCategoryId]
  );
  const selectedItem = selectedCategory?.items.find((item) => item.id === selectedMediaId) ?? selectedCategory?.items[0] ?? null;
  const mediaItems = selectedCategory?.items ?? [];
  const mediaTotalPages = Math.max(1, Math.ceil(mediaItems.length / TABLE_PAGE_SIZE));
  const visibleMediaItems = mediaItems.slice(mediaTablePage * TABLE_PAGE_SIZE, mediaTablePage * TABLE_PAGE_SIZE + TABLE_PAGE_SIZE);

  const handleHeroChange = (field: keyof ImageContentItem, value: string) => {
    updateGalleryHero({ ...content.galleryHero, [field]: value });
  };

  const handleHeroFile = async (file: File | null) => {
    if (!file) return;
    const dataUrl = await uploadToDataUrl(file);
    updateGalleryHero({ ...content.galleryHero, image: dataUrl });
  };

  const handleHeroRemove = () => {
    updateGalleryHero({ ...content.galleryHero, image: "" });
  };

  const handleCategoryChange = (field: keyof GalleryCategory, value: string) => {
    if (!selectedCategory) return;
    updateGalleryCategory({ ...selectedCategory, [field]: value } as GalleryCategory);
  };

  const handleCategoryFile = async (file: File | null) => {
    if (!file || !selectedCategory) return;
    const dataUrl = await uploadToDataUrl(file);
    updateGalleryCategory({ ...selectedCategory, image: dataUrl });
  };

  const handleCategoryRemove = () => {
    if (!selectedCategory) return;
    updateGalleryCategory({ ...selectedCategory, image: "" });
  };

  const handleAddCategory = () => {
    const id = addGalleryCategory();
    setSelectedCategoryId(id);
  };

  const handleAddMedia = () => {
    if (!selectedCategory) return;
    const id = addGalleryMediaItem(selectedCategory.id);
    setSelectedMediaId(id);
    setMediaTablePage(0);
  };

  const handleMediaChange = (item: GalleryMediaItem, field: keyof GalleryMediaItem, value: string) => {
    if (!selectedCategory) return;
    updateGalleryMediaItem(selectedCategory.id, { ...item, [field]: value } as GalleryMediaItem);
  };

  const handleMediaFile = async (file: File | null, target: GalleryMediaItem | null) => {
    if (!file || !selectedCategory || !target) return;
    const dataUrl = await uploadToDataUrl(file);
    updateGalleryMediaItem(selectedCategory.id, { ...target, src: dataUrl, thumbnail: dataUrl });
  };

  const handleMediaRemove = (target: GalleryMediaItem | null) => {
    if (!selectedCategory || !target) return;
    updateGalleryMediaItem(selectedCategory.id, { ...target, src: "", thumbnail: "" });
  };

  const handleFolderUpload = async (files: FileList | null) => {
    if (!files || !selectedCategory) return;

    const mediaFiles = Array.from(files).filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"));

    for (const file of mediaFiles) {
      const dataUrl = await uploadToDataUrl(file);
      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      addGalleryMediaItem(selectedCategory.id, {
        id: `gallery-folder-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: makeMediaTitle(file),
        description: `Uploaded from folder: ${(file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name}`,
        mediaType,
        src: dataUrl,
        thumbnail: mediaType === "image" ? dataUrl : ""
      });
    }
    setMediaTablePage(0);
  };

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">Gallery Module</p>
          <h1 className="mt-3 text-4xl font-black">Manage gallery categories and media</h1>
          <p className="mt-4 max-w-4xl text-zinc-300">
            Upload and organize photos or videos under Training, Match Day, Gym, Parents, Community, and Events.
          </p>
        </div>

        <div className="mt-6">
          <AdminSaveButton />
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Gallery Hero</p>
              <h2 className="mt-2 text-2xl font-bold">Edit the gallery hero</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
            <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
              {content.galleryHero.image ? (
                <img src={content.galleryHero.image} alt={content.galleryHero.title} className="h-full w-full object-contain object-center" />
              ) : (
                <span>Upload hero image</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleHeroFile(event.target.files?.[0] ?? null)} />
            </label>
            <div className="space-y-3">
              <input
                value={content.galleryHero.title}
                onChange={(event) => handleHeroChange("title", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
              />
              <textarea
                value={content.galleryHero.description}
                onChange={(event) => handleHeroChange("description", event.target.value)}
                rows={8}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none"
              />
              <input
                value={content.galleryHero.image}
                onChange={(event) => handleHeroChange("image", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
              />
              <div className="flex flex-wrap gap-3">
                {content.galleryHero.image ? (
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

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={handleAddCategory} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
            Add Category
          </button>
          {content.galleryCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategoryId(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategoryId === category.id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {selectedCategory ? (
          <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-[2rem] border border-white/10 bg-panel p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">Category</p>
                  <h2 className="mt-2 text-2xl font-bold">{selectedCategory.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => deleteGalleryCategory(selectedCategory.id)}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                >
                  Delete Category
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <input
                  value={selectedCategory.title}
                  onChange={(event) => handleCategoryChange("title", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                />
                <textarea
                  value={selectedCategory.description}
                  onChange={(event) => handleCategoryChange("description", event.target.value)}
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none"
                />
                <input
                  value={selectedCategory.slug}
                  onChange={(event) => handleCategoryChange("slug", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                />
                <input
                  value={selectedCategory.image}
                  onChange={(event) => handleCategoryChange("image", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                />
                <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm text-zinc-400">
                  Upload category image
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => handleCategoryFile(event.target.files?.[0] ?? null)} />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCategoryRemove}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panelAlt p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">Media Items</p>
                  <h2 className="mt-2 text-2xl font-bold">Edit images and videos</h2>
                </div>
                <button type="button" onClick={handleAddMedia} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                  Add Media
                </button>
              </div>

              <div className="mt-5">
                <AdminSaveButton label="Save Gallery Media" />
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Bulk Folder Upload</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Select a folder from your computer and every image or video inside it will be added to this gallery category. You can still upload individual media below.
                </p>
                <label className="mt-4 flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-red-400/40 bg-red-500/10 px-4 py-5 text-center text-sm font-semibold text-red-100 transition hover:bg-red-500/15">
                  Upload Folder To {selectedCategory.title}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    // @ts-expect-error Browser folder upload support uses non-standard attributes.
                    webkitdirectory=""
                    directory=""
                    onChange={(event) => void handleFolderUpload(event.target.files)}
                  />
                </label>
              </div>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-zinc-400">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {visibleMediaItems.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedMediaId(item.id)}
                        className={`cursor-pointer transition hover:bg-white/5 ${selectedItem?.id === item.id ? "bg-red-500/10" : "bg-black/20"}`}
                      >
                        <td className="px-4 py-4 font-semibold text-white">{item.title || "Untitled media"}</td>
                        <td className="px-4 py-4 capitalize text-zinc-300">{item.mediaType}</td>
                        <td className="max-w-[18rem] truncate px-4 py-4 text-zinc-400">{item.src ? "Uploaded / linked" : "No source"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
                <span>
                  Showing {visibleMediaItems.length} of {mediaItems.length} media items. Page {mediaTablePage + 1} of {mediaTotalPages}.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={mediaTablePage === 0}
                    onClick={() => setMediaTablePage((page) => Math.max(0, page - 1))}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={mediaTablePage >= mediaTotalPages - 1}
                    onClick={() => setMediaTablePage((page) => Math.min(mediaTotalPages - 1, page + 1))}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>

              {selectedItem ? (
                <article className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
                      <label className="flex min-h-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                        {selectedItem.thumbnail ? (
                          <img src={selectedItem.thumbnail} alt={selectedItem.title} className="h-full w-full object-contain object-center" />
                        ) : (
                          <span>Upload media</span>
                        )}
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(event) => handleMediaFile(event.target.files?.[0] ?? null, selectedItem)}
                        />
                      </label>
                      <div className="space-y-3">
                        <input
                          value={selectedItem.title}
                          onChange={(event) => handleMediaChange(selectedItem, "title", event.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                        <textarea
                          value={selectedItem.description}
                          onChange={(event) => handleMediaChange(selectedItem, "description", event.target.value)}
                          rows={4}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                        <select
                          value={selectedItem.mediaType}
                          onChange={(event) => handleMediaChange(selectedItem, "mediaType", event.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                        <input
                          value={selectedItem.src}
                          onChange={(event) => handleMediaChange(selectedItem, "src", event.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                        <input
                          value={selectedItem.thumbnail}
                          onChange={(event) => handleMediaChange(selectedItem, "thumbnail", event.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                        <div className="flex flex-wrap gap-3">
                          <AdminSaveButton label="Save Media" />
                          <button
                            type="button"
                            onClick={() => {
                              deleteGalleryMediaItem(selectedCategory.id, selectedItem.id);
                              setSelectedMediaId(null);
                            }}
                            className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                          >
                            Delete
                          </button>
                          {selectedItem.thumbnail || selectedItem.src ? (
                            <button
                              type="button"
                              onClick={() => handleMediaRemove(selectedItem)}
                              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                            >
                              Remove Image
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
              ) : null}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
