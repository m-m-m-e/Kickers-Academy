"use client";

import { useMemo, useState } from "react";
import type { ImageContentItem, ProgramMediaItem, ProgramsProgressionPathContent } from "@/lib/home-content";
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

export function ProgramsAdminManager() {
  const {
    content,
    updateProgramsHero,
    updateProgramsProgressionPath,
    addProgressionPathStage,
    updateProgressionPathStage,
    deleteProgressionPathStage,
    addProgramGroup,
    updateProgramGroup,
    deleteProgramGroup,
    addProgramSubSection,
    updateProgramSubSection,
    deleteProgramSubSection,
    addProgramMediaItem,
    updateProgramMediaItem,
    deleteProgramMediaItem
  } = useHomeContent();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(content.programGroups[0]?.id ?? null);
  const [isEditingProgressionPath, setIsEditingProgressionPath] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const selectedGroup = useMemo(
    () => content.programGroups.find((group) => group.id === selectedGroupId) ?? content.programGroups[0] ?? null,
    [content.programGroups, selectedGroupId]
  );
  const selectedMedia = selectedGroup?.mediaItems.find((item) => item.id === selectedMediaId) ?? selectedGroup?.mediaItems[0] ?? null;

  const handleHeroChange = (field: keyof ImageContentItem, value: string) => {
    updateProgramsHero({ ...content.programsHero, [field]: value });
  };

  const handleHeroFile = async (file: File | null) => {
    if (!file) return;
    const dataUrl = await uploadToDataUrl(file);
    updateProgramsHero({ ...content.programsHero, image: dataUrl });
  };

  const handleHeroRemove = () => {
    updateProgramsHero({ ...content.programsHero, image: "" });
  };

  const handleProgressionChange = (
    field: keyof Omit<ProgramsProgressionPathContent, "stages" | "teaserCheckpoints">,
    value: string
  ) => {
    updateProgramsProgressionPath({
      ...content.programsProgressionPath,
      [field]: value
    });
  };

  const handleTeaserCheckpointChange = (index: number, value: string) => {
    const teaserCheckpoints = [...content.programsProgressionPath.teaserCheckpoints];
    teaserCheckpoints[index] = value;
    updateProgramsProgressionPath({
      ...content.programsProgressionPath,
      teaserCheckpoints
    });
  };

  const addTeaserCheckpoint = () => {
    updateProgramsProgressionPath({
      ...content.programsProgressionPath,
      teaserCheckpoints: [...content.programsProgressionPath.teaserCheckpoints, "New card checkpoint"]
    });
  };

  const deleteTeaserCheckpoint = (index: number) => {
    updateProgramsProgressionPath({
      ...content.programsProgressionPath,
      teaserCheckpoints: content.programsProgressionPath.teaserCheckpoints.filter((_, itemIndex) => itemIndex !== index)
    });
  };

  const handleProgressionStageChange = (
    stageId: string,
    field: "title" | "description",
    value: string
  ) => {
    const stage = content.programsProgressionPath.stages.find((item) => item.id === stageId);
    if (!stage) return;
    updateProgressionPathStage({ ...stage, [field]: value });
  };

  const handleProgressionFile = async (file: File | null) => {
    if (!file) return;
    const dataUrl = await uploadToDataUrl(file);
    handleProgressionChange("teaserImage", dataUrl);
  };

  const handleProgressionHeroFile = async (file: File | null) => {
    if (!file) return;
    const dataUrl = await uploadToDataUrl(file);
    handleProgressionChange("heroImage", dataUrl);
  };

  const handleProgressionImageRemove = () => {
    handleProgressionChange("teaserImage", "");
  };

  const handleProgressionHeroImageRemove = () => {
    handleProgressionChange("heroImage", "");
  };

  const handleGroupChange = (field: keyof typeof selectedGroup, value: string) => {
    if (!selectedGroup) return;
    updateProgramGroup({ ...selectedGroup, [field]: value } as typeof selectedGroup);
  };

  const handleGroupFile = async (file: File | null) => {
    if (!file || !selectedGroup) return;
    const dataUrl = await uploadToDataUrl(file);
    updateProgramGroup({ ...selectedGroup, image: dataUrl });
  };

  const handleGroupRemove = () => {
    if (!selectedGroup) return;
    updateProgramGroup({ ...selectedGroup, image: "" });
  };

  const handleAddGroup = () => {
    const id = addProgramGroup();
    setSelectedGroupId(id);
  };

  const handleSubChange = (subId: string, field: "title" | "description", value: string) => {
    if (!selectedGroup) return;
    const sub = selectedGroup.subSections.find((item) => item.id === subId);
    if (!sub) return;
    updateProgramSubSection(selectedGroup.id, { ...sub, [field]: value });
  };

  const handleSubAdd = () => {
    if (!selectedGroup) return;
    addProgramSubSection(selectedGroup.id);
  };

  const handleMediaAdd = () => {
    if (!selectedGroup) return;
    const id = addProgramMediaItem(selectedGroup.id);
    setSelectedMediaId(id);
  };

  const handleMediaChange = (item: ProgramMediaItem, field: keyof ProgramMediaItem, value: string) => {
    if (!selectedGroup) return;
    updateProgramMediaItem(selectedGroup.id, { ...item, [field]: value });
  };

  const handleMediaTypeChange = (item: ProgramMediaItem, mediaType: "image" | "video") => {
    if (!selectedGroup) return;
    updateProgramMediaItem(selectedGroup.id, { ...item, mediaType });
  };

  const handleMediaSourceFile = async (item: ProgramMediaItem, file: File | null) => {
    if (!file || !selectedGroup) return;
    const dataUrl = await uploadToDataUrl(file);
    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    updateProgramMediaItem(selectedGroup.id, {
      ...item,
      mediaType,
      src: dataUrl,
      thumbnail: mediaType === "image" ? dataUrl : item.thumbnail
    });
  };

  const handleMediaThumbnailFile = async (item: ProgramMediaItem, file: File | null) => {
    if (!file || !selectedGroup) return;
    const dataUrl = await uploadToDataUrl(file);
    updateProgramMediaItem(selectedGroup.id, { ...item, thumbnail: dataUrl });
  };

  const handleMediaDelete = (item: ProgramMediaItem) => {
    if (!selectedGroup) return;
    deleteProgramMediaItem(selectedGroup.id, item.id);
    setSelectedMediaId(null);
  };

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">Programs Module</p>
          <h1 className="mt-3 text-4xl font-black">Manage the programs page</h1>
          <p className="mt-4 max-w-4xl text-zinc-300">
            Control the full-width hero, the age-group cards, and the detailed sub-sections for each program.
          </p>
        </div>

        <div className="mt-6">
          <AdminSaveButton />
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Programs Hero</p>
              <h2 className="mt-2 text-2xl font-bold">Edit the page hero</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
            <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
              {content.programsHero.image ? (
                <img src={content.programsHero.image} alt={content.programsHero.title} className="h-full w-full object-contain object-center" />
              ) : (
                <span>Upload hero image</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleHeroFile(event.target.files?.[0] ?? null)} />
            </label>

            <div className="space-y-3">
              <input
                value={content.programsHero.title}
                onChange={(event) => handleHeroChange("title", event.target.value)}
                placeholder="Hero title"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
              />
              <textarea
                value={content.programsHero.description}
                onChange={(event) => handleHeroChange("description", event.target.value)}
                placeholder="Hero text"
                rows={8}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
              />
              <input
                value={content.programsHero.image}
                onChange={(event) => handleHeroChange("image", event.target.value)}
                placeholder="Image URL or uploaded file data"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
              />
              <div className="flex flex-wrap gap-3">
                {content.programsHero.image ? (
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
          <button
            type="button"
            onClick={handleAddGroup}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Add Age Group
          </button>
          {content.programGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => {
                setSelectedGroupId(group.id);
                setSelectedMediaId(null);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedGroupId === group.id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                {group.ageGroup}
              </span>
            </button>
          ))}
        </div>

        {selectedGroup ? (
          <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-[2rem] border border-white/10 bg-panel p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">Selected Group</p>
                  <h2 className="mt-2 text-2xl font-bold">{selectedGroup.ageGroup}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => deleteProgramGroup(selectedGroup.id)}
                    className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                  >
                    Delete Group
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <input
                  value={selectedGroup.ageGroup}
                  onChange={(event) => handleGroupChange("ageGroup", event.target.value)}
                  placeholder="Age group label"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={selectedGroup.title}
                  onChange={(event) => handleGroupChange("title", event.target.value)}
                  placeholder="Group title"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={selectedGroup.description}
                  onChange={(event) => handleGroupChange("description", event.target.value)}
                  placeholder="Group description"
                  rows={7}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={selectedGroup.slug}
                  onChange={(event) => handleGroupChange("slug", event.target.value)}
                  placeholder="Slug"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={selectedGroup.image}
                  onChange={(event) => handleGroupChange("image", event.target.value)}
                  placeholder="Image URL or uploaded file data"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                />
                <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm text-zinc-400">
                  Upload group image from computer
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => handleGroupFile(event.target.files?.[0] ?? null)} />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleGroupRemove}
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
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">Sub Sections</p>
                  <h2 className="mt-2 text-2xl font-bold">Edit the internal content</h2>
                </div>
                <button
                  type="button"
                  onClick={handleSubAdd}
                  className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Add Sub Section
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {selectedGroup.subSections.map((sub) => (
                  <article key={sub.id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        value={sub.title}
                        onChange={(event) => handleSubChange(sub.id, "title", event.target.value)}
                        placeholder="Sub section title"
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                      />
                      <button
                        type="button"
                        onClick={() => deleteProgramSubSection(selectedGroup.id, sub.id)}
                        className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200"
                      >
                        Delete
                      </button>
                    </div>
                    <textarea
                      value={sub.description}
                      onChange={(event) => handleSubChange(sub.id, "description", event.target.value)}
                      rows={4}
                      placeholder="Sub section description"
                      className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                    />
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {selectedGroup ? (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Program Gallery</p>
                <h2 className="mt-2 text-2xl font-bold">Manage the gallery for {selectedGroup.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                  These items appear below the program cards on the public program detail page. The public view shows
                  five images at a time, then lets visitors move through the rest with numbered pages and Previous / Next buttons.
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button
                  type="button"
                  onClick={handleMediaAdd}
                  className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Add Gallery Item
                </button>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  {selectedGroup.mediaItems.length} items in {Math.max(1, Math.ceil(selectedGroup.mediaItems.length / 5))} pages
                </p>
              </div>
            </div>

            <div className="mt-5">
              <AdminSaveButton label="Save Program Gallery" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {selectedGroup.mediaItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedMediaId(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedMedia?.id === item.id
                      ? "bg-white text-black"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
                  }`}
                >
                  {item.title || "Untitled Media"}
                </button>
              ))}
            </div>

            {selectedMedia ? (
              <div className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
                <div className="space-y-4">
                  <label className="flex min-h-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                    {selectedMedia.thumbnail || selectedMedia.src ? (
                      <img
                        src={selectedMedia.thumbnail || selectedMedia.src}
                        alt={selectedMedia.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>Upload source file</span>
                    )}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(event) => handleMediaSourceFile(selectedMedia, event.target.files?.[0] ?? null)}
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm text-zinc-400">
                    Upload thumbnail image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleMediaThumbnailFile(selectedMedia, event.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    {(["image", "video"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleMediaTypeChange(selectedMedia, type)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          selectedMedia.mediaType === type
                            ? "bg-white text-black"
                            : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <input
                    value={selectedMedia.title}
                    onChange={(event) => handleMediaChange(selectedMedia, "title", event.target.value)}
                    placeholder="Media title"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                  />
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    This title and thumbnail will show on the public gallery card.
                  </p>
                  <textarea
                    value={selectedMedia.description}
                    onChange={(event) => handleMediaChange(selectedMedia, "description", event.target.value)}
                    placeholder="Media description"
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 leading-8 text-white outline-none placeholder:text-zinc-500"
                  />
                  <input
                    value={selectedMedia.src}
                    onChange={(event) => handleMediaChange(selectedMedia, "src", event.target.value)}
                    placeholder="Source URL or uploaded file data"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                  />
                  <input
                    value={selectedMedia.thumbnail}
                    onChange={(event) => handleMediaChange(selectedMedia, "thumbnail", event.target.value)}
                    placeholder="Thumbnail URL or uploaded file data"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleMediaDelete(selectedMedia)}
                    className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                  >
                    Delete Media
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-zinc-400">
                No media added for this program yet.
              </div>
            )}
          </section>
        ) : null}

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panelAlt p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Progression Path</p>
              <h2 className="mt-2 text-2xl font-bold">Progression Path submodule</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                This controls the teaser on the Programs page and the full Progression Path page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isEditingProgressionPath ? (
                <button
                  type="button"
                  onClick={() => addProgressionPathStage()}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100"
                >
                  Add Checkpoint
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setIsEditingProgressionPath((current) => !current)}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
              >
                {isEditingProgressionPath ? "Close Progression Path" : "Edit Progression Path"}
              </button>
            </div>
          </div>

          <div className="mt-5">
            <AdminSaveButton label="Save Progression Path" />
          </div>

          {!isEditingProgressionPath ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
              <div className="min-h-[170px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                {content.programsProgressionPath.teaserImage ? (
                  <img
                    src={content.programsProgressionPath.teaserImage}
                    alt={content.programsProgressionPath.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[170px] items-center justify-center text-sm text-zinc-500">
                    No teaser image
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-red-300">
                  {content.programsProgressionPath.teaserEyebrow}
                </p>
                <h3 className="mt-3 text-2xl font-black text-white">{content.programsProgressionPath.teaserTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{content.programsProgressionPath.teaserDescription}</p>
                <p className="mt-4 text-sm text-zinc-500">
                  {content.programsProgressionPath.stages.length} football growth checkpoints
                </p>
              </div>
            </div>
          ) : (
            <>
              <section className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Programs Page Card</p>
                <h3 className="mt-2 text-xl font-bold">Edit the exact card shown inside Programs</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  These fields control the image, text, button label, and right-side panel content on the Programs page.
                </p>
                <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
                  <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                    {content.programsProgressionPath.teaserImage ? (
                      <img
                        src={content.programsProgressionPath.teaserImage}
                        alt={content.programsProgressionPath.teaserTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>Upload card image</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleProgressionFile(event.target.files?.[0] ?? null)}
                    />
                  </label>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <input
                      value={content.programsProgressionPath.teaserImage}
                      onChange={(event) => handleProgressionChange("teaserImage", event.target.value)}
                      placeholder="Card image URL or uploaded file data"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500 lg:col-span-2"
                    />
                  <input
                    value={content.programsProgressionPath.teaserEyebrow}
                    onChange={(event) => handleProgressionChange("teaserEyebrow", event.target.value)}
                    placeholder="Card eyebrow"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                  />
                  <input
                    value={content.programsProgressionPath.teaserButtonLabel}
                    onChange={(event) => handleProgressionChange("teaserButtonLabel", event.target.value)}
                    placeholder="Button label"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                  />
                  <input
                    value={content.programsProgressionPath.teaserTitle}
                    onChange={(event) => handleProgressionChange("teaserTitle", event.target.value)}
                    placeholder="Card title"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500 lg:col-span-2"
                  />
                  <textarea
                    value={content.programsProgressionPath.teaserDescription}
                    onChange={(event) => handleProgressionChange("teaserDescription", event.target.value)}
                    placeholder="Card description"
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 leading-7 text-white outline-none placeholder:text-zinc-500 lg:col-span-2"
                  />
                  <input
                    value={content.programsProgressionPath.teaserPanelEyebrow}
                    onChange={(event) => handleProgressionChange("teaserPanelEyebrow", event.target.value)}
                    placeholder="Right panel eyebrow"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                  />
                  <input
                    value={content.programsProgressionPath.teaserPanelTitle}
                    onChange={(event) => handleProgressionChange("teaserPanelTitle", event.target.value)}
                    placeholder="Right panel title"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                  />
                  <textarea
                    value={content.programsProgressionPath.teaserPanelDescription}
                    onChange={(event) => handleProgressionChange("teaserPanelDescription", event.target.value)}
                    placeholder="Right panel description"
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 leading-7 text-white outline-none placeholder:text-zinc-500 lg:col-span-2"
                  />
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4 lg:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-red-300">Card Checkpoints</p>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                          These are the checkpoints shown inside the Programs page card before the user opens the full Progression Path.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addTeaserCheckpoint}
                        className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Add Card Checkpoint
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {content.programsProgressionPath.teaserCheckpoints.map((checkpoint, index) => (
                        <div key={`${checkpoint}-${index}`} className="flex gap-2">
                          <input
                            value={checkpoint}
                            onChange={(event) => handleTeaserCheckpointChange(index, event.target.value)}
                            placeholder={`Card checkpoint ${index + 1}`}
                            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                          />
                          <button
                            type="button"
                            onClick={() => deleteTeaserCheckpoint(index)}
                            className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                    {content.programsProgressionPath.teaserImage ? (
                      <button
                        type="button"
                        onClick={handleProgressionImageRemove}
                        className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                      >
                        Remove Card Image
                      </button>
                    ) : null}
                  </div>
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Submodule Hero Image</p>
                <h3 className="mt-2 text-xl font-bold">Edit the Progression Path page hero image</h3>
                <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
                  <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                    {content.programsProgressionPath.heroImage ? (
                      <img
                        src={content.programsProgressionPath.heroImage}
                        alt={content.programsProgressionPath.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>Upload hero image</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleProgressionHeroFile(event.target.files?.[0] ?? null)}
                    />
                  </label>

                  <div className="space-y-3">
                    <input
                      value={content.programsProgressionPath.heroImage}
                      onChange={(event) => handleProgressionChange("heroImage", event.target.value)}
                      placeholder="Hero image URL or uploaded file data"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                    />
                    {content.programsProgressionPath.heroImage ? (
                      <button
                        type="button"
                        onClick={handleProgressionHeroImageRemove}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                      >
                        Remove Hero Image
                      </button>
                    ) : null}
                  </div>
                </div>
              </section>

              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                <input
                  value={content.programsProgressionPath.eyebrow}
                  onChange={(event) => handleProgressionChange("eyebrow", event.target.value)}
                  placeholder="Submodule eyebrow"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={content.programsProgressionPath.title}
                  onChange={(event) => handleProgressionChange("title", event.target.value)}
                  placeholder="Submodule title"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={content.programsProgressionPath.description}
                  onChange={(event) => handleProgressionChange("description", event.target.value)}
                  placeholder="Hero description"
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 leading-7 text-white outline-none placeholder:text-zinc-500 lg:col-span-2"
                />
                <input
                  value={content.programsProgressionPath.ageTitle}
                  onChange={(event) => handleProgressionChange("ageTitle", event.target.value)}
                  placeholder="Age growth title"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={content.programsProgressionPath.footballTitle}
                  onChange={(event) => handleProgressionChange("footballTitle", event.target.value)}
                  placeholder="Football growth title"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={content.programsProgressionPath.ageDescription}
                  onChange={(event) => handleProgressionChange("ageDescription", event.target.value)}
                  placeholder="Age growth description"
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 leading-7 text-white outline-none placeholder:text-zinc-500"
                />
                <textarea
                  value={content.programsProgressionPath.footballDescription}
                  onChange={(event) => handleProgressionChange("footballDescription", event.target.value)}
                  placeholder="Football growth description"
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 leading-7 text-white outline-none placeholder:text-zinc-500"
                />
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                {content.programsProgressionPath.stages.map((stage, index) => (
                  <article key={stage.id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-red-300">Checkpoint {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => deleteProgressionPathStage(stage.id)}
                        className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200"
                      >
                        Delete
                      </button>
                    </div>
                    <input
                      value={stage.title}
                      onChange={(event) => handleProgressionStageChange(stage.id, "title", event.target.value)}
                      placeholder="Checkpoint title"
                      className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                    />
                    <textarea
                      value={stage.description}
                      onChange={(event) => handleProgressionStageChange(stage.id, "description", event.target.value)}
                      rows={4}
                      placeholder="Checkpoint description"
                      className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                    />
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
