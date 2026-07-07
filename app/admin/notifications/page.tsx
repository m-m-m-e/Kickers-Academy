"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AdminSaveButton } from "@/components/admin-save-button";
import { useHomeContent } from "@/components/home-content-provider";
import { getAdminNotifications } from "@/lib/admin-notifications";

function uploadToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export default function AdminNotificationsPage() {
  const { content, updateNotificationSettings } = useHomeContent();
  const notifications = useMemo(() => getAdminNotifications(content), [content]);
  const settings = content.notificationSettings;

  const uploadTone = async (file: File | null) => {
    if (!file) return;
    const toneUrl = await uploadToDataUrl(file);
    updateNotificationSettings({
      ...settings,
      toneUrl,
      toneName: file.name,
      soundEnabled: true
    });
  };

  const testTone = () => {
    if (!settings.toneUrl) return;
    const audio = new Audio(settings.toneUrl);
    void audio.play();
  };

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">Notifications Module</p>
          <h1 className="mt-3 text-4xl font-black">Incoming messages and admin alerts</h1>
          <p className="mt-4 max-w-4xl text-zinc-300">
            This module collects new submissions from Join, Contact Us, Engage, Support, and community connection forms.
          </p>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Notification Tone</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Upload the admin ringtone</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Upload a short audio file. Browsers may require the admin to click Enable Sound in the sidebar once before tones can play automatically.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-sm text-zinc-400">Current tone</p>
              <p className="mt-2 text-lg font-semibold text-white">{settings.toneName || "No tone uploaded yet"}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <label className="cursor-pointer rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
                  Upload Tone
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(event) => {
                      void uploadTone(event.target.files?.[0] ?? null);
                      event.target.value = "";
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={!settings.toneUrl}
                  onClick={testTone}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Test Tone
                </button>
                <button
                  type="button"
                  onClick={() => updateNotificationSettings({ ...settings, toneUrl: "", toneName: "" })}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                >
                  Remove Tone
                </button>
              </div>
            </div>

            <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(event) => updateNotificationSettings({ ...settings, soundEnabled: event.target.checked })}
              />
              <span className="text-sm text-zinc-200">Play tone when new admin notifications arrive</span>
            </label>

            <div className="mt-5">
              <AdminSaveButton label="Save Notification Settings" />
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Inbox</p>
                <h2 className="mt-3 text-2xl font-bold text-white">New items needing attention</h2>
              </div>
              <div className="rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white">
                {notifications.length} new
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {notifications.map((item) => (
                <Link key={item.id} href={item.href} className="block rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-red-400/40 hover:bg-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-red-300">{item.source}</p>
                    <p className="text-xs text-zinc-500">{new Date(item.submittedAt).toLocaleString()}</p>
                  </div>
                  <h3 className="mt-3 text-xl font-black text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
                </Link>
              ))}
              {notifications.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-zinc-400">
                  No new submissions right now.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
