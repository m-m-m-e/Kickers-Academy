"use client";

import { useMemo, useState } from "react";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";
import { PublicModuleHero } from "@/components/public-module-hero";
import { TypingAboutSection } from "@/components/typing-about-section";
import { IconListDisplay } from "@/components/about-display-components";
import type { AboutCoach } from "@/lib/home-content";

function CoachViewer({
  coach,
  onClose,
  onPrev,
  onNext
}: {
  coach: AboutCoach | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!coach) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-3 py-4 sm:px-6 sm:py-8">
      <div className="relative h-[88vh] w-full max-w-[92rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] shadow-glow">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-red-300">Coach Profile</p>
            <h3 className="mt-1 text-xl font-bold text-white">{coach.name}</h3>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            Close
          </button>
        </div>

        <div className="grid h-[calc(88vh-73px)] overflow-auto bg-black lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-h-[26rem] bg-black">
            {coach.image ? (
              <img src={coach.image} alt={coach.name} className="h-full w-full object-contain object-center" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">No image</div>
            )}
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">{coach.program}</p>
            <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">{coach.name}</h2>
            <p className="mt-6 text-lg leading-9 text-zinc-200">{coach.philosophy}</p>
            {coach.philosophyPoints?.length ? (
              <div className="mt-8">
                <IconListDisplay items={coach.philosophyPoints} icons={coach.philosophyIcons} />
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onPrev}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={onNext}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { content } = useHomeContent();
  const coaches = useMemo(() => content.aboutCoaches, [content.aboutCoaches]);
  const sections = useMemo(() => {
    const seen = new Set<string>();

    return content.aboutSections.filter((section) => {
      if (seen.has(section.id)) {
        return false;
      }

      seen.add(section.id);
      return true;
    });
  }, [content.aboutSections]);
  const [selectedCoachIndex, setSelectedCoachIndex] = useState<number | null>(null);
  const selectedCoach = selectedCoachIndex === null ? null : coaches[selectedCoachIndex] ?? null;
  const openCoach = (index: number) => setSelectedCoachIndex(index);
  const closeCoach = () => setSelectedCoachIndex(null);
  const nextCoach = () => setSelectedCoachIndex((current) => ((current ?? 0) + 1) % coaches.length);
  const prevCoach = () => setSelectedCoachIndex((current) => ((current ?? 0) - 1 + coaches.length) % coaches.length);

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <PublicModuleHero
          eyebrow={content.aboutItems[0]?.title ?? "About the Team"}
          title={content.aboutItems[0]?.title ?? "Everything that shapes who we are."}
          description={
            content.aboutItems[0]?.description ??
            "Scroll through the story of the club. Each section is now designed as a clear, image-led card so the text stays readable on every screen size."
          }
          image={content.aboutItems[0]?.image ?? content.aboutSections[0]?.image}
        />

        <div className="mx-auto mt-12 max-w-7xl px-6 space-y-10">
          {sections.map((section, index) => (
            <TypingAboutSection key={`${section.id}-${index}`} item={section} index={index} />
          ))}

          <section className="overflow-hidden rounded-[2.2rem] p-6 sm:p-8 lg:p-10">
            <div className="max-w-4xl">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">The Technical Team</p>
              <h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">Meet our coaches</h2>
              <p className="mt-5 text-xl leading-8 text-zinc-300">
                At Kickers Academy, our coaches are the foundation of our player development program.  
                They are dedicated professionals who are passionate about nurturing young footballers both on and off the pitch.  
            
              </p>
            </div>

            <div className="mx-auto mt-8 flex max-w-6xl flex-wrap justify-center gap-6">
              {coaches.map((coach, index) => (
                <button
                  key={coach.id}
                  type="button"
                  onClick={() => openCoach(index)}
                  className="group w-full max-w-[22rem] flex-[1_1_18rem] overflow-hidden rounded-[1.8rem] text-left shadow-[0_22px_70px_rgba(0,0,0,0.42)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(214,31,38,0.18)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-black">
                    {coach.image ? (
                      <img
                        src={coach.image}
                        alt={coach.name}
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-500">No image</div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.45),rgba(0,0,0,0.88))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="text-xs uppercase tracking-[0.32em] text-zinc-300">{coach.program}</p>
                      <h3 className="mt-2 text-2xl font-black text-white">{coach.name}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {selectedCoach ? (
        <CoachViewer coach={selectedCoach} onClose={closeCoach} onPrev={prevCoach} onNext={nextCoach} />
      ) : null}
    </PublicShell>
  );
}
