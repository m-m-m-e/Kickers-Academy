"use client";

import { useHomeContent } from "@/components/home-content-provider";

export function AdminSaveButton({ label = "Save Changes" }: { label?: string }) {
  const { hasUnsavedChanges, saveStatus, saveContent } = useHomeContent();

  const buttonLabel =
    saveStatus === "saving"
      ? "Saving..."
      : saveStatus === "saved" && !hasUnsavedChanges
        ? "Saved"
        : hasUnsavedChanges
          ? label
          : "Saved";

  const helper =
    saveStatus === "error"
      ? "Save failed. Please try again."
      : hasUnsavedChanges
        ? "Unsaved edits are waiting. Save to write them to the database."
        : "All edits are saved in the database.";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
      <button
        type="button"
        disabled={saveStatus === "saving" || !hasUnsavedChanges}
        onClick={() => void saveContent()}
        className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-400"
      >
        {buttonLabel}
      </button>
      <span className={`text-sm ${saveStatus === "error" ? "text-red-200" : "text-zinc-400"}`}>{helper}</span>
    </div>
  );
}
