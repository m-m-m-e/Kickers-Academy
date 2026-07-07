"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { GallerySlideshow } from "@/components/gallery-slideshow";
import { FeedbackShowcase } from "@/components/feedback-showcase";
import { useHomeContent } from "@/components/home-content-provider";
import { getActiveNewsEvents } from "@/lib/news-events-utils";

export default function HomePage() {
  const { content } = useHomeContent();
  const homeNewsItems = getActiveNewsEvents(content.newsItems).slice(0, 3);
  const getActionHref = (title: string) => {
    const normalized = title.toLowerCase();

    if (normalized.includes("join")) return "/join-register";
    if (normalized.includes("donate") || normalized.includes("engage")) return "/engage";
    return "/contact";
  };

  return (
    <PublicShell>
      <HeroSlideshow slides={content.heroSlides} />

      <section className="mx-auto max-w-7xl px-6 py-8">
        {content.aboutItems[0] ? (
          <Link
            href="/about"
            className="group relative block overflow-hidden rounded-[3rem] bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.32), rgba(0,0,0,0.86)), url(${content.aboutItems[0].image})`
            }}
            aria-label="Open the About page"
          >
            <div className="flex min-h-[32rem] items-center justify-center px-3 py-6 text-center sm:px-5 lg:px-8 lg:py-10">
              <div className="mx-auto max-w-5xl rounded-[2rem] bg-black/35 px-6 py-8 backdrop-blur-sm transition duration-300 group-hover:bg-black/45 sm:px-8 lg:px-12">
                <p className="text-sm uppercase tracking-[0.35em] text-red-200">About Us</p>
                <h2 className="mt-3 text-5xl font-black text-white sm:text-6xl lg:text-7xl">Who we are</h2>
                <p className="mx-auto mt-4 max-w-4xl text-lg leading-8 text-zinc-100 sm:text-xl">
                  {content.aboutItems[0].description}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <span className="inline-flex rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition group-hover:bg-red-400">
                    Know Us More
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Programs</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Programs built for growth</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {content.programItems.map((item) => (
            <Link
              key={item.id}
              href="/programs"
              className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-panelAlt transition hover:-translate-y-1 hover:border-red-400/40"
              aria-label={`Open the Programs page for ${item.title}`}
            >
              <div className="h-52 bg-black">
                <img src={item.image} alt={item.title} className="h-full w-full object-contain object-center" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-red-300 transition group-hover:text-red-200">
                  Open programs
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">News and Events</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Latest updates and club moments</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {homeNewsItems.map((item) => (
            <Link
              key={item.id}
              href="/news-events"
              className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-panel transition hover:-translate-y-1 hover:border-red-400/40"
              aria-label={`Open the News and Events page for ${item.title}`}
            >
              <div className="h-52 bg-black">
                <img src={item.image} alt={item.title} className="h-full w-full object-contain object-center" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-red-300 transition group-hover:text-red-200">
                  Open news
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Merchandise</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Official merch with a strong club identity</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {content.merchandiseItems.map((item) => (
            <Link
              key={item.id}
              href="/store"
              className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-panelAlt transition hover:-translate-y-1 hover:border-red-400/40"
              aria-label={`Open the Store page for ${item.title}`}
            >
              <div className="h-52 bg-black">
                <img src={item.image} alt={item.title} className="h-full w-full object-contain object-center" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-red-300 transition group-hover:text-red-200">
                  Open store
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.35em] text-red-300">Gallery</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Slideshow gallery</h2>
        <div className="mt-8">
          <Link href="/gallery" className="block" aria-label="Open the Gallery page">
            <GallerySlideshow items={content.galleryItems} />
          </Link>
          <div className="mt-4">
            <Link href="/gallery" className="inline-flex text-sm font-semibold text-red-300 hover:text-red-200">
              Open gallery
            </Link>
          </div>
        </div>
      </section>

      <FeedbackShowcase submissions={content.feedbackSubmissions} />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {content.actionCards.map((item) => (
            <Link
              key={item.id}
              href={getActionHref(item.title)}
              className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-panel transition hover:-translate-y-1 hover:border-red-400/40"
              aria-label={`Open the ${item.title} page`}
            >
              <div className="h-52 bg-black">
                <img src={item.image} alt={item.title} className="h-full w-full object-contain object-center" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-zinc-300">{item.description}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-red-300 transition group-hover:text-red-200">
                  Open page
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
