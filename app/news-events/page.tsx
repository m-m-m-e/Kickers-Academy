"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";
import { PublicModuleHero } from "@/components/public-module-hero";
import { formatNewsEventDate, getActiveNewsEvents, getNewsEventTime } from "@/lib/news-events-utils";
import type { ImageContentItem } from "@/lib/home-content";

const tintMap: Record<string, string> = {
  "latest-fixture": "from-red-500/30",
  "club-update": "from-white/18",
  "event-spotlight": "from-red-400/24"
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isSameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function getMonthDays(date: Date) {
  const firstDay = startOfMonth(date);
  const lastDay = endOfMonth(date);
  const days: Date[] = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    days.push(new Date(firstDay.getFullYear(), firstDay.getMonth(), index - firstDay.getDay() + 1));
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(date.getFullYear(), date.getMonth(), day));
  }

  while (days.length % 7 !== 0) {
    const previous = days[days.length - 1];
    days.push(new Date(previous.getFullYear(), previous.getMonth(), previous.getDate() + 1));
  }

  return days;
}

function getItemsForDay(items: ImageContentItem[], day: Date) {
  return items.filter((item) => {
    const time = getNewsEventTime(item);
    return time !== null && isSameDay(new Date(time), day);
  });
}

export default function NewsEventsPage() {
  const { content } = useHomeContent();
  const visibleItems = getActiveNewsEvents(content.newsItems).slice(0, 6);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const calendarDays = useMemo(() => getMonthDays(calendarMonth), [calendarMonth]);
  const datedItems = useMemo(
    () =>
      [...content.newsItems]
        .filter((item) => getNewsEventTime(item) !== null)
        .sort((a, b) => (getNewsEventTime(a) ?? 0) - (getNewsEventTime(b) ?? 0)),
    [content.newsItems]
  );

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <PublicModuleHero
          eyebrow="News & Events"
          title={content.newsEventsHero.title}
          description={content.newsEventsHero.description}
          image={content.newsEventsHero.image}
        >
          <Link
            href="/news-events/archive"
            className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 backdrop-blur transition hover:bg-red-500/20"
          >
            View past news and events
          </Link>
        </PublicModuleHero>

        <div className="mx-auto mt-12 max-w-7xl px-6">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">News and Events</p>
            <h2 className="mt-3 text-4xl font-black text-white">Latest News and Events</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <Link
                key={item.id}
                href={`/news-events/${item.slug ?? item.id}`}
                className="group overflow-hidden rounded-[2.2rem] border border-white/10 bg-panel transition hover:-translate-y-1 hover:border-red-400/40"
              >
                <div className="relative h-60 overflow-hidden bg-black">
                  <img src={item.image} alt={item.title} className="h-full w-full object-contain object-center" />
                  <div className={`absolute inset-0 bg-gradient-to-b ${tintMap[item.slug ?? item.id] ?? "from-white/10"} via-transparent to-black/55`} />
                </div>
                <div className="p-6 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-red-300">{item.kind === "event" ? "Event" : "News"}</p>
                  <h2 className="mt-3 text-3xl font-black text-white">{item.title}</h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-zinc-500">{formatNewsEventDate(item.occurrenceDate)}</p>
                  <p className="mt-4 text-zinc-300">{item.description}</p>
                  <span className="mt-6 inline-flex text-sm font-semibold text-red-300 transition group-hover:text-red-200">
                    Open article
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <section className="mx-auto mt-16 max-w-7xl px-6">
          <div className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Calendar</p>
                <h2 className="mt-3 text-4xl font-black text-white">Plan around academy dates</h2>
                <p className="mt-3 max-w-3xl text-zinc-300">
                  Browse future and past new and events for early preparation and follow what has already happened.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
              <h3 className="text-center text-2xl font-black text-white">
                {new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(calendarMonth)}
              </h3>
              <div className="min-w-[44rem]">
                <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.25em] text-zinc-500">
                  {weekdayLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-7 gap-2">
                  {calendarDays.map((day) => {
                    const dayItems = getItemsForDay(datedItems, day);
                    const inMonth = day.getMonth() === calendarMonth.getMonth();

                    return (
                      <div
                        key={day.toISOString()}
                        className={`min-h-[7.5rem] rounded-2xl border p-3 text-left ${
                          inMonth ? "border-white/10 bg-white/5" : "border-white/5 bg-white/[0.02] text-zinc-600"
                        }`}
                      >
                        <p className="text-sm font-bold text-zinc-200">{day.getDate()}</p>
                        <div className="mt-2 space-y-1">
                          {dayItems.slice(0, 2).map((item) => (
                            <Link
                              key={item.id}
                              href={`/news-events/${item.slug ?? item.id}`}
                              className="block rounded-lg bg-red-500/15 px-2 py-1 text-[11px] font-semibold leading-4 text-red-100 transition hover:bg-red-500/25"
                            >
                              {item.title}
                            </Link>
                          ))}
                          {dayItems.length > 2 ? <p className="text-[11px] text-zinc-500">+{dayItems.length - 2} more</p> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
