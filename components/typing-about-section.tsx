"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ImageContentItem } from "@/lib/home-content";

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function splitParagraphs(text: string) {
  return text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getPointItems(item: ImageContentItem) {
  if (item.listItems?.length) {
    return item.listItems;
  }

  if (item.id === "leadership-philosophy") {
    return [
      "Lead by example on and off the pitch",
      "Communicate clearly and consistently",
      "Protect standards, culture, and accountability",
      "Serve players, families, and the wider community"
    ];
  }

  return [];
}

function SectionPointCards({ item }: { item: ImageContentItem }) {
  const points = getPointItems(item);

  if (!points.length) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {points.map((point, index) => (
          <div
            key={point}
            className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-black text-white shadow-[0_10px_30px_rgba(255,255,255,0.08)]">
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold leading-7 text-white">{point}</p>
                {item.itemIcons?.[index] ? (
                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-zinc-400">{item.itemIcons[index]}</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TypingAboutSection({
  item,
  index = 0
}: {
  item: ImageContentItem;
  index?: number;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.3);
  const paragraphs = useMemo(() => splitParagraphs(item.description), [item.description]);
  const points = getPointItems(item);
  const styleVariant = index % 3;
  const isLeadSection = index === 0 || item.id === "about-us";

  if (isLeadSection) {
    return (
      <article
        ref={ref}
        id={item.id}
        className={`scroll-mt-28 relative left-1/2 w-[100vw] -translate-x-1/2 transition duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="relative min-h-[76vh] overflow-hidden bg-black sm:min-h-[80vh] lg:min-h-[86vh]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover object-center scale-110"
              loading="lazy"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.86),rgba(0,0,0,0.56),rgba(0,0,0,0.84))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,31,38,0.22),transparent_32%)]" />
          <div className="relative mx-auto flex min-h-[76vh] max-w-7xl items-center px-6 py-16 sm:min-h-[80vh] sm:px-10 lg:min-h-[86vh] lg:px-16">
            <div className="max-w-4xl rounded-[2rem] bg-black/35 p-6 text-white backdrop-blur-sm sm:p-8 lg:p-10">
              <p className="text-sm uppercase tracking-[0.35em] text-red-200">About</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">{item.title}</h2>
              {item.summary ? <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-200 sm:text-lg">{item.summary}</p> : null}
              <div className="mt-6 space-y-4 text-base leading-8 text-zinc-100 sm:text-lg">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="max-w-3xl">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      ref={ref}
      id={item.id}
      className={`scroll-mt-28 transition duration-700 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-[2.2rem] bg-[#070707] shadow-[0_24px_70px_rgba(0,0,0,0.28)] ${
          styleVariant === 2 ? "min-h-[34rem]" : ""
        }`}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className={`absolute inset-0 h-full w-full object-cover opacity-28 ${
              styleVariant === 0
                ? "scale-125 translate-x-[15%] object-[center_20%]"
                : styleVariant === 1
                  ? "scale-125 -translate-x-[15%] object-[center_35%]"
                  : "scale-115 object-[center_28%]"
            }`}
            loading="lazy"
          />
        ) : null}
        <div
          className={`absolute inset-0 ${
            styleVariant === 0
              ? "bg-[linear-gradient(90deg,rgba(0,0,0,0.94),rgba(0,0,0,0.72),rgba(0,0,0,0.30))]"
              : styleVariant === 1
                ? "bg-[linear-gradient(270deg,rgba(0,0,0,0.94),rgba(0,0,0,0.72),rgba(0,0,0,0.30))]"
                : "bg-[linear-gradient(180deg,rgba(0,0,0,0.92),rgba(0,0,0,0.60),rgba(0,0,0,0.88))]"
          }`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />
        <div
          className={`absolute inset-y-0 w-[22rem] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] ${
            styleVariant === 1 ? "right-0" : "left-0"
          }`}
        />

        <div
          className={`relative z-10 flex min-h-[28rem] items-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12 ${
            styleVariant === 1 ? "justify-end" : "justify-start"
          } ${styleVariant === 2 ? "lg:min-h-[36rem]" : ""}`}
        >
          <div
            className={`max-w-4xl rounded-[2rem] bg-black/35 p-6 text-white backdrop-blur-sm sm:p-8 lg:p-10 ${
              styleVariant === 1 ? "lg:ml-auto" : ""
            } ${styleVariant === 0 ? "lg:ml-4 lg:-rotate-[0.6deg]" : ""} ${
              styleVariant === 1 ? "lg:mr-4 lg:rotate-[0.6deg]" : ""
            } ${styleVariant === 2 ? "lg:max-w-3xl lg:mx-auto lg:-rotate-[0.3deg]" : ""}`}
          >
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-300">Section {index + 1}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">{item.title}</h2>

            {item.summary ? <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-200 sm:text-lg">{item.summary}</p> : null}

            <div className={`mt-6 space-y-4 text-base leading-8 text-zinc-100 sm:text-lg ${points.length ? "max-w-none" : "max-w-2xl"}`}>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {points.length ? <SectionPointCards item={item} /> : null}
          </div>
        </div>
      </div>
    </article>
  );
}
