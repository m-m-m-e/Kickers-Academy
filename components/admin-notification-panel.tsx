"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAdminNotifications } from "@/lib/admin-notifications";
import { useHomeContent } from "@/components/home-content-provider";

export function AdminNotificationPanel() {
  const { content } = useHomeContent();
  const [open, setOpen] = useState(false);
  const [soundReady, setSoundReady] = useState(false);
  const previousIdsRef = useRef<string[]>([]);
  const notifications = useMemo(() => getAdminNotifications(content), [content]);
  const notificationIds = useMemo(() => notifications.map((item) => item.id), [notifications]);

  useEffect(() => {
    const previousIds = previousIdsRef.current;
    const hasNewNotification = previousIds.length > 0 && notificationIds.some((id) => !previousIds.includes(id));
    previousIdsRef.current = notificationIds;

    if (!hasNewNotification || !content.notificationSettings.soundEnabled || !content.notificationSettings.toneUrl || !soundReady) {
      return;
    }

    const audio = new Audio(content.notificationSettings.toneUrl);
    audio.play().catch(() => {
      setSoundReady(false);
    });
  }, [content.notificationSettings.soundEnabled, content.notificationSettings.toneUrl, notificationIds, soundReady]);

  const unlockSound = () => {
    if (!content.notificationSettings.toneUrl) {
      setSoundReady(true);
      return;
    }

    const audio = new Audio(content.notificationSettings.toneUrl);
    audio.volume = 0.01;
    void audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        setSoundReady(true);
      })
      .catch(() => setSoundReady(false));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
      >
        <span>
          <span className="block text-xs uppercase tracking-[0.3em] text-red-300">Notifications</span>
          <span className="mt-1 block text-sm text-zinc-300">{notifications.length} new item{notifications.length === 1 ? "" : "s"}</span>
        </span>
        <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">{notifications.length}</span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-50 mt-3 max-h-[26rem] overflow-auto rounded-2xl border border-white/10 bg-black/95 p-3 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-2">
            <Link href="/admin/notifications" className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">
              Open Module
            </Link>
            {!soundReady ? (
              <button type="button" onClick={unlockSound} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                Enable Sound
              </button>
            ) : null}
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 8).map((item) => (
              <Link key={item.id} href={item.href} className="block rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-red-300">{item.source}</p>
                  <p className="text-[11px] text-zinc-500">{new Date(item.submittedAt).toLocaleString()}</p>
                </div>
                <h3 className="mt-2 text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-400">{item.description}</p>
              </Link>
            ))}
            {notifications.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
                No new form messages right now.
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
