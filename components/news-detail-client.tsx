"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";
import { formatNewsEventDate, getActiveNewsEvents } from "@/lib/news-events-utils";

const cropMap: Record<string, string> = {
  "latest-fixture": "center 20%",
  "club-update": "center 35%",
  "event-spotlight": "center 28%"
};

export function NewsDetailClient({ slug }: { slug: string }) {
  const { content } = useHomeContent();
  const item = content.newsItems.find((entry) => (entry.slug ?? entry.id) === slug);

  if (!item) {
    return (
      <PublicShell>
        <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
          <div className="max-w-xl text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">News & Events</p>
            <h1 className="mt-4 text-4xl font-black">Article not found</h1>
            <Link href="/news-events" className="mt-8 inline-flex rounded-full bg-red-500 px-6 py-3 font-semibold text-white">
              Back to News & Events
            </Link>
          </div>
        </main>
      </PublicShell>
    );
  }

  const related = getActiveNewsEvents(content.newsItems).filter((entry) => entry.id !== item.id).slice(0, 3);
  const articleText = item.article || item.description;
  const paragraphs = articleText.split(/\n{2,}/).filter((paragraph) => paragraph.trim());
  const leadParagraph = paragraphs[0] ?? item.description;
  const bodyParagraphs = paragraphs.length > 1 ? paragraphs.slice(1) : [];

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-28 text-white">
        <section className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-black uppercase tracking-[0.28em] text-red-200">
                {item.kind === "event" ? "Event" : "News"}
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                {formatNewsEventDate(item.occurrenceDate)}
              </p>
            </div>
            <Link href="/news-events" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-white/10">
              Back to News & Events
            </Link>
          </div>

          <article className="mt-6 overflow-hidden rounded-[1.8rem] border border-white/10 bg-panel shadow-glow">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-black p-3">
                <div className="flex h-full min-h-[22rem] items-center justify-center overflow-hidden rounded-[1.2rem] bg-[#070707]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-[38rem] w-full object-contain object-center"
                      style={{ objectPosition: cropMap[item.slug ?? item.id] ?? "center center" }}
                    />
                  ) : null}
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-xs font-black uppercase tracking-[0.35em] text-red-300">{item.kind === "event" ? "Event Report" : "News Feature"}</p>
                <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {item.title}
                </h1>
                <p className="mt-5 border-l-4 border-red-500 pl-5 text-lg font-semibold leading-8 text-zinc-200 sm:text-xl">
                  {item.description}
                </p>
                <div className="mt-7 text-lg leading-9 text-zinc-100">
                  <p>
                    <span className="float-left mr-3 mt-1 text-6xl font-black leading-[0.82] text-red-500">
                      {leadParagraph.charAt(0)}
                    </span>
                    {leadParagraph.slice(1)}
                  </p>
                  {bodyParagraphs.map((paragraph, index) => (
                    <p key={`${item.id}-paragraph-${index}`} className="mt-5">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </section>

        <div className="mx-auto mt-16 max-w-7xl px-6">
          <div className="mb-6 flex items-end justify-between gap-4 border-t border-white/10 pt-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-red-300">Other News & Events</p>
              <h2 className="mt-2 text-2xl font-black text-white">Continue exploring the module</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((entry) => (
              <Link
                key={entry.id}
                href={`/news-events/${entry.slug ?? entry.id}`}
                className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-panel transition hover:-translate-y-1 hover:border-red-400/40"
              >
                <div className="h-48 bg-black">
                  <img src={entry.image} alt={entry.title} className="h-full w-full object-contain object-center" />
                </div>
                <div className="p-5 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-red-300">{entry.kind === "event" ? "Event" : "News"}</p>
                  <h2 className="mt-2 text-xl font-black text-white">{entry.title}</h2>
                  <p className="mt-3 text-sm text-zinc-300">{entry.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
