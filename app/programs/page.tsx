"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";
import { PublicModuleHero } from "@/components/public-module-hero";

const programTintMap: Record<string, string> = {
  "under-7": "from-red-500/35",
  "under-9": "from-white/20",
  "under-11": "from-red-400/30",
  "under-13": "from-white/15",
  "under-15": "from-red-600/30",
  "under-17": "from-white/10"
};

export default function ProgramsPage() {
  const { content } = useHomeContent();

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <PublicModuleHero
          eyebrow="Programs"
          title={content.programsHero.title}
          description={content.programsHero.description}
          image={content.programsHero.image}
        />

        <div className="mx-auto mt-12 max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {content.programGroups.map((group) => (
              <Link
                key={group.id}
                href={`/programs/${group.slug}`}
                className="group overflow-hidden rounded-[2.2rem] border border-white/10 bg-panel transition hover:-translate-y-1 hover:border-red-400/40"
              >
                <div className="relative h-60 overflow-hidden bg-black">
                  <img
                    src={group.image}
                    alt={group.title}
                    className="h-full w-full object-contain object-center"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-b ${programTintMap[group.slug] ?? "from-white/10"} via-transparent to-black/55`} />
                </div>
                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">{group.ageGroup}</p>
                  <h2 className="mt-3 text-3xl font-black text-white">{group.title}</h2>
                  <p className="mt-4 text-zinc-300">{group.description}</p>
                  <span className="mt-6 inline-flex text-sm font-semibold text-red-300 transition group-hover:text-red-200">
                    Open program
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <section className="mt-12 overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#090909] shadow-glow">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div
                className="relative min-h-[34rem] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.84)), url(${content.programsProgressionPath.teaserImage})`
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(214,31,38,0.42),transparent_32%),linear-gradient(120deg,rgba(0,0,0,0.16),rgba(0,0,0,0.82))]" />
                <div className="relative z-10 flex h-full min-h-[34rem] flex-col justify-end p-6 sm:p-8 lg:p-10">
                  <p className="text-sm uppercase tracking-[0.35em] text-red-200">{content.programsProgressionPath.teaserEyebrow}</p>
                  <h2 className="mt-3 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
                    {content.programsProgressionPath.teaserTitle}
                  </h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-100">
                    {content.programsProgressionPath.teaserDescription}
                  </p>
                  <Link
                    href="/programs/progression-path"
                    className="mt-7 inline-flex w-fit rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
                  >
                    {content.programsProgressionPath.teaserButtonLabel}
                  </Link>
                </div>
              </div>

              <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015))] p-6 sm:p-8 lg:p-10">
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">{content.programsProgressionPath.teaserPanelEyebrow}</p>
                <h3 className="mt-3 text-3xl font-black text-white">{content.programsProgressionPath.teaserPanelTitle}</h3>
                <p className="mt-5 text-lg leading-8 text-zinc-300">
                  {content.programsProgressionPath.teaserPanelDescription}
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {content.programsProgressionPath.teaserCheckpoints.map((item, index) => (
                    <div key={`${item}-${index}`} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-sm font-semibold text-zinc-100">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
