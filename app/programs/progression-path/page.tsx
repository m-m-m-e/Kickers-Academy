"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";

export default function ProgressionPathPage() {
  const { content } = useHomeContent();
  const progressionPath = content.programsProgressionPath;

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <section
          className="relative min-h-[76vh] overflow-hidden bg-cover bg-center px-6 py-24 sm:px-10 lg:px-16"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0.88)), url(${progressionPath.heroImage})`
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,31,38,0.44),transparent_34%),linear-gradient(120deg,rgba(0,0,0,0.12),rgba(0,0,0,0.78))]" />
          <div className="relative z-10 mx-auto flex min-h-[64vh] max-w-7xl items-end">
            <div className="max-w-5xl">
              <p className="text-sm uppercase tracking-[0.35em] text-red-200">{progressionPath.eyebrow}</p>
              <h1 className="mt-4 text-5xl font-black leading-tight text-white sm:text-6xl lg:text-8xl">
                {progressionPath.title}
              </h1>
              <p className="mt-6 max-w-4xl text-xl leading-9 text-zinc-100 sm:text-2xl">
                {progressionPath.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/programs" className="rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400">
                  Back to Programs
                </Link>
                <a href="#growth-map" className="rounded-full border border-white/10 bg-black/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/45">
                  View Growth Map
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16" id="growth-map">
          <div className="space-y-10">
            <article className="rounded-[2.2rem] border border-white/10 bg-panel p-6 shadow-glow lg:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Age Growth</p>
              <h2 className="mt-3 text-3xl font-black text-white">{progressionPath.ageTitle}</h2>
              <p className="mt-4 text-lg leading-8 text-zinc-300">
                {progressionPath.ageDescription}
              </p>
              <div className="mt-8 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                {content.programGroups.map((group, index) => (
                  <Link
                    key={group.id}
                    href={`/programs/${group.slug}`}
                    className="group relative rounded-2xl border border-white/10 bg-black/35 p-4 transition hover:border-red-400/40 hover:bg-black/50"
                  >
                    {index < content.programGroups.length - 1 ? (
                      <span className="absolute left-[calc(100%-0.15rem)] top-1/2 hidden h-px w-3 bg-red-500/40 xl:block" />
                    ) : null}
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-red-300">
                        Stage {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 text-xl font-black text-white">{group.ageGroup}</h3>
                    </div>
                    <span className="mt-5 inline-flex text-sm font-semibold text-red-300 transition group-hover:text-red-200">Open</span>
                  </Link>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-[2.2rem] border border-red-500/20 bg-[linear-gradient(180deg,rgba(214,31,38,0.16),rgba(255,255,255,0.035))] p-6 shadow-glow lg:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-200">Football Growth</p>
              <h2 className="mt-3 text-3xl font-black text-white">{progressionPath.footballTitle}</h2>
              <p className="mt-4 max-w-5xl text-lg leading-8 text-red-50/85">
                {progressionPath.footballDescription}
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {progressionPath.stages.map((stage, index) => (
                  <article
                    key={stage.id}
                    className="rounded-[1.6rem] border border-white/10 bg-black/45 p-5 shadow-glow transition hover:-translate-y-1 hover:border-red-400/40 hover:bg-black/60"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-red-400/50 bg-[#120607] text-sm font-black text-red-100 shadow-glow">
                      {index + 1}
                    </div>
                    <p className="text-xs uppercase tracking-[0.3em] text-red-300">Checkpoint {index + 1}</p>
                    <h3 className="mt-2 text-2xl font-black text-white">{stage.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-zinc-300">{stage.description}</p>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
