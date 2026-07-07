"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";

export function PhotoConsentDocumentClient() {
  return (
    <PublicShell>
      <main className="bg-[#050505] px-6 pb-20 pt-28 text-white print:bg-white print:px-0 print:pt-0 print:text-black">
        <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-panel p-6 shadow-glow sm:p-10 print:border-0 print:bg-white print:p-8 print:shadow-none">
          <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
            <Link href="/join-register" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100">
              Back to Registration
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              Download / Save as PDF
            </button>
          </div>

          <div className="mt-8 border-b border-white/10 pb-6 print:mt-0 print:border-black">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300 print:text-black">Kickers Academy</p>
            <h1 className="mt-3 text-4xl font-black print:text-3xl">Player Photo & Video Publication Consent</h1>
            <p className="mt-4 text-zinc-300 print:text-black">
              This document explains how a parent or guardian may allow or deny publication of a registered academy player's
              photos or videos.
            </p>
          </div>

          <div className="mt-8 space-y-7 text-base leading-8 text-zinc-200 print:text-black">
            <section>
              <h2 className="text-2xl font-black text-white print:text-black">1. Purpose of the Consent</h2>
              <p className="mt-3">
                Kickers Academy may capture photos or videos during training sessions, match days, tournaments, community
                activities, academy events, and official academy programs. These materials help document player development,
                celebrate academy life, communicate with families, and promote the academy's work.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white print:text-black">2. Where Photos or Videos May Appear</h2>
              <p className="mt-3">
                If consent is accepted, photos or videos may be used on the academy website, gallery, news and events posts,
                social media pages, posters, brochures, academy presentations, match reports, and other official academy
                communication materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white print:text-black">3. If Consent Is Denied</h2>
              <p className="mt-3">
                If the parent or guardian denies consent, the academy should avoid publishing identifiable photos or videos
                of the player. The player may still participate in academy activities and registration review.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white print:text-black">4. Safety and Respect</h2>
              <p className="mt-3">
                Kickers Academy should use player images respectfully and should not knowingly publish content that harms,
                humiliates, misrepresents, or endangers a player. Sensitive personal information should not be published
                alongside player media.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white print:text-black">5. Changing the Decision</h2>
              <p className="mt-3">
                A parent or guardian may contact the academy to update the photo publication decision. The academy can then
                update the player's registration record from accepted to denied, or from denied to accepted.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/30 p-5 print:border-black print:bg-white">
              <h2 className="text-xl font-black text-white print:text-black">Parent / Guardian Acknowledgement</h2>
              <p className="mt-3">
                By selecting either "I Accept" or "I Deny" on the registration form, the parent or guardian confirms they
                have read this consent information and understand the effect of their decision.
              </p>
            </section>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
