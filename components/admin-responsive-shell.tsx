"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminNotificationPanel } from "@/components/admin-notification-panel";
import { AdminSidebarNav } from "@/components/admin-sidebar-nav";
import { useHomeContent } from "@/components/home-content-provider";

type SidebarItem = {
  label: string;
  href: string;
};

export function AdminResponsiveShell({
  items,
  children
}: {
  items: SidebarItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { hasUnsavedChanges, saveStatus, saveContent } = useHomeContent();

  const saveLabel =
    saveStatus === "saving"
      ? "Saving..."
      : saveStatus === "saved" && !hasUnsavedChanges
        ? "Saved"
        : hasUnsavedChanges
          ? "Save Changes"
          : "Saved";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/95 px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-red-300">Admin Console</p>
            <h1 className="mt-1 text-lg font-bold">Kickers Academy</h1>
          </div>
          <button
            type="button"
            disabled={saveStatus === "saving" || !hasUnsavedChanges}
            onClick={() => void saveContent()}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-400"
          >
            {saveLabel}
          </button>
          <button
            type="button"
            aria-label="Toggle admin menu"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {open ? (
          <>
            <button
              type="button"
              aria-label="Close admin menu overlay"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]"
            />
            <aside className="fixed right-3 top-20 z-50 w-[min(20rem,calc(100vw-1.5rem))] rounded-[1.5rem] border border-white/10 bg-black/95 px-5 py-6 shadow-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-red-300">Admin Console</p>
              <h1 className="mt-2 text-2xl font-bold">Kickers Academy</h1>
              <div className="mt-8 max-h-[60vh] overflow-y-auto pr-2">
                <div className="mb-4">
                  <AdminNotificationPanel />
                </div>
                <AdminSidebarNav items={items} />
              </div>
              <div className="pt-4">
                <AdminLogoutButton />
              </div>
            </aside>
          </>
        ) : null}
      </div>

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-white/10 bg-black px-5 py-6 lg:block">
          <p className="text-xs uppercase tracking-[0.35em] text-red-300">Admin Console</p>
          <h1 className="mt-2 text-2xl font-bold">Kickers Academy</h1>
          <div className="mt-6">
            <AdminNotificationPanel />
          </div>
          <AdminSidebarNav items={items} />
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-red-300">Content Save</p>
            <p className="mt-2 text-sm text-zinc-400">
              {saveStatus === "error"
                ? "Save failed. Try again."
                : hasUnsavedChanges
                  ? "You have unsaved changes."
                  : "All changes are saved."}
            </p>
            <button
              type="button"
              disabled={saveStatus === "saving" || !hasUnsavedChanges}
              onClick={() => void saveContent()}
              className="mt-4 w-full rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-400"
            >
              {saveLabel}
            </button>
          </div>
          <div className="pt-4">
            <AdminLogoutButton />
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
