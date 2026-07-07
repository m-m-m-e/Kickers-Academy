"use client";

import Link from "next/link";
import { useState } from "react";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";
import { formatNewsEventDate, getArchivedNewsEvents } from "@/lib/news-events-utils";

const ARCHIVE_PAGE_SIZE = 6;

export default function NewsEventsArchivePage() {
  const { content } = useHomeContent();
  const archivedItems = getArchivedNewsEvents(content.newsItems);
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(archivedItems.length / ARCHIVE_PAGE_SIZE));
  const visibleItems = archivedItems.slice(page * ARCHIVE_PAGE_SIZE, page * ARCHIVE_PAGE_SIZE + ARCHIVE_PAGE_SIZE);

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-32 text-white">
        <section className="mx-auto max-w-7xl px-6">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Past News & Events</p>
            <h1 className="mt-3 text-5xl font-black text-white sm:text-6xl">Past moments and completed events</h1>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              Access our past news and events.
            </p>
            <Link href="/news-events" className="mt-7 inline-flex rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white">
              Back to Current News
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <Link
                key={item.id}
                href={`/news-events/${item.slug ?? item.id}`}
                className="group overflow-hidden rounded-[2.2rem] border border-white/10 bg-panel transition hover:-translate-y-1 hover:border-red-400/40"
              >
                <div className="relative h-56 overflow-hidden bg-black">
                  {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-contain object-center" /> : null}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/70" />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-red-300">{item.kind === "event" ? "Event" : "News"}</p>
                  <h2 className="mt-3 text-2xl font-black text-white">{item.title}</h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-zinc-500">{formatNewsEventDate(item.occurrenceDate)}</p>
                  <p className="mt-4 text-sm leading-7 text-zinc-300">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {archivedItems.length ? (
            <div className="mt-10 grid gap-4 px-1 py-2 text-sm text-zinc-300 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index)}
                    className={`h-9 w-9 rounded-full text-sm font-semibold transition ${
                      page === index
                        ? "bg-red-500 text-white"
                        : "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
              <div className="hidden md:block" />
            </div>
          ) : null}

          {!archivedItems.length ? (
            <div className="mt-12 rounded-[2rem] border border-white/10 bg-panel p-10 text-center text-zinc-300">
              No past news or events yet.
            </div>
          ) : null}
        </section>
      </main>
    </PublicShell>
  );
}
