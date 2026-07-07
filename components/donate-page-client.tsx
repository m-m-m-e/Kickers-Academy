"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { PublicModuleHero } from "@/components/public-module-hero";
import { useHomeContent } from "@/components/home-content-provider";

const initialEngageForm = {
  name: "",
  email: "",
  phone: "",
  engagementType: "Parent or guardian",
  occupation: "",
  skills: "",
  message: ""
};

const supportOptions = [
  "Training equipment",
  "Support a player",
  "Support an away game day",
  "Become a sponsor",
  "Direct financial support"
];

const paymentStreams = ["To be discussed", "Mpesa - coming soon", "PayPal - coming soon", "Bank transfer - coming soon"];

const initialSupportForm = {
  name: "",
  email: "",
  phone: "",
  supportType: supportOptions[0],
  supportDetails: "",
  preferredPaymentStream: paymentStreams[0],
  amount: ""
};

function DonatePageShell() {
  const { content } = useHomeContent();
  const page = content.donatePage;
  const [selectedGratitude, setSelectedGratitude] = useState<(typeof page.gratitudeCards)[number] | null>(null);
  const [form, setForm] = useState(initialEngageForm);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [supportForm, setSupportForm] = useState(initialSupportForm);
  const [supportStatus, setSupportStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [supportMessage, setSupportMessage] = useState("");

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateSupportForm = (field: keyof typeof supportForm, value: string) => {
    setSupportForm((current) => ({ ...current, [field]: value }));
  };

  const submitEngageForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("sending");
    setSubmitMessage("Sending your engagement message...");

    try {
      const response = await fetch("/api/engage-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to send your message.");
      }

      setForm(initialEngageForm);
      setSubmitStatus("sent");
      setSubmitMessage("Thank you. Your message has reached Kickers Academy and the team will review it.");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error instanceof Error ? error.message : "Unable to send your message.");
    }
  };

  const submitSupportForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSupportStatus("sending");
    setSupportMessage("Sending your support request...");

    try {
      const response = await fetch("/api/support-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(supportForm)
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to send your support request.");
      }

      setSupportForm(initialSupportForm);
      setSupportStatus("sent");
      setSupportMessage("Thank you. Your support request has been received and the academy will contact you with the right next step.");
    } catch (error) {
      setSupportStatus("error");
      setSupportMessage(error instanceof Error ? error.message : "Unable to send your support request.");
    }
  };

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <PublicModuleHero eyebrow="Engage" title={page.hero.title} description={page.hero.description} image={page.hero.image} />

        <div className="mx-auto mt-12 max-w-7xl px-6">
          <section className="grid gap-4 md:grid-cols-3">
            <Link href="/engage/network" className="group rounded-[1.6rem] border border-white/10 bg-panel p-5 transition hover:-translate-y-1 hover:border-red-400/40">
              <h2 className="text-2xl font-black text-white">Community Network</h2>
              <p className="mt-3 leading-7 text-zinc-300">View approved parents, professionals, volunteers, sponsors, and partners connected through the academy.</p>
              <span className="mt-5 inline-flex rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-red-400">Open Network</span>
            </Link>
            <a href="#support-academy" className="group rounded-[1.6rem] border border-white/10 bg-panel p-5 transition hover:-translate-y-1 hover:border-red-400/40">
              <h2 className="text-2xl font-black text-white">Support Academy</h2>
              <p className="mt-3 leading-7 text-zinc-300">Send a support request for equipment, a player, an away day, sponsorship, or direct financial support.</p>
              <span className="mt-5 inline-flex rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-red-400">Support Now</span>
            </a>
            <a href="#engage-form" className="group rounded-[1.6rem] border border-white/10 bg-panel p-5 transition hover:-translate-y-1 hover:border-red-400/40">
              <h2 className="text-2xl font-black text-white">Make A Connection</h2>
              <p className="mt-3 leading-7 text-zinc-300">Share your skills, occupation, service, or idea so the academy can connect the right people.</p>
              <span className="mt-5 inline-flex rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-red-400">Connect</span>
            </a>
          </section>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Engage Network</p>
            <h2 className="mt-3 text-3xl font-black text-white">{page.engageIntroTitle}</h2>
            <p className="mt-4 max-w-5xl text-lg leading-8 text-zinc-300">{page.engageIntroDescription}</p>
            <div className="mx-auto mt-6 grid max-w-3xl gap-4 justify-items-center">
              {page.engagePathways.map((item) => (
                <article key={item.id} className="w-full rounded-[1.6rem] border border-white/10 bg-black/30 p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-red-300">Pathway</p>
                  <h3 className="mt-4 text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 leading-7 text-zinc-300">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="engage-form" className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Engage Form</p>
            <h2 className="mt-3 text-3xl font-black text-white">{page.formTitle}</h2>
            <p className="mt-4 leading-8 text-zinc-300">{page.formDescription}</p>
            <form className="mt-8 space-y-5" onSubmit={submitEngageForm}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Full Name / Organization</span>
                  <input type="text" value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Your name or company" required className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Email</span>
                  <input type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} placeholder="you@example.com" required className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
              </div>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">How do you want to engage?</span>
                <select value={form.engagementType} onChange={(event) => updateForm("engagementType", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none">
                  <option>Parent or guardian</option>
                  <option>Community member</option>
                  <option>Sponsor or partner</option>
                  <option>Volunteer or mentor</option>
                  <option>Professional service</option>
                  <option>Donate or support</option>
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Phone / WhatsApp</span>
                  <input type="text" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="+000 000 000" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Occupation / Organization</span>
                  <input type="text" value={form.occupation} onChange={(event) => updateForm("occupation", event.target.value)} placeholder="Doctor, teacher, business, clinic..." className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
              </div>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Skills, services, or resources you can share</span>
                <textarea value={form.skills} onChange={(event) => updateForm("skills", event.target.value)} rows={4} placeholder="Medical support, tutoring, transport, media, sponsorship, mentorship..." required className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Message / Connection Idea</span>
                <textarea value={form.message} onChange={(event) => updateForm("message", event.target.value)} rows={6} placeholder="Tell us how you would like to connect with the academy or community..." className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
              </label>
              {submitMessage ? (
                <div className={`rounded-2xl border px-4 py-3 text-sm ${submitStatus === "error" ? "border-red-500/30 bg-red-500/10 text-red-100" : "border-white/10 bg-white/5 text-zinc-100"}`}>
                  {submitMessage}
                </div>
              ) : null}
              <button type="submit" disabled={submitStatus === "sending"} className="inline-flex rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60">
                {page.submitLabel}
              </button>
            </form>
          </section>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Support & Donate</p>
            <h2 className="mt-3 text-3xl font-black text-white">What your help makes possible</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {page.impactPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-zinc-200">
                  {point}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Ways To Give</p>
            <h2 className="mt-3 text-3xl font-black text-white">Choose how you want to support</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {page.supportWays.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(214,31,38,0.08))] p-5 shadow-glow"
                >
                  <div className={`h-1 w-20 rounded-full bg-gradient-to-r ${item.accent} to-transparent`} />
                  <h3 className="mt-5 text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-zinc-300">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="support-academy" className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(214,31,38,0.22),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 sm:p-8">
            <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Support The Academy</p>
                <h2 className="mt-3 text-4xl font-black text-white">Tell us the exact way you want to stand with the players.</h2>
                <p className="mt-4 leading-8 text-zinc-300">
                  This form records your support intention now. When Mpesa, PayPal, bank transfer, and other financial streams are connected, this same section can guide supporters directly to the right payment route.
                </p>
                <div className="mt-6 grid gap-3">
                  {supportOptions.map((option) => (
                    <div key={option} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-200">
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <form className="rounded-[1.8rem] border border-white/10 bg-black/35 p-5 sm:p-6" onSubmit={submitSupportForm}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Full Name / Organization</span>
                    <input value={supportForm.name} onChange={(event) => updateSupportForm("name", event.target.value)} required placeholder="Your name or company" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Email</span>
                    <input type="email" value={supportForm.email} onChange={(event) => updateSupportForm("email", event.target.value)} required placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Phone / WhatsApp</span>
                    <input value={supportForm.phone} onChange={(event) => updateSupportForm("phone", event.target.value)} placeholder="+000 000 000" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Support Option</span>
                    <select value={supportForm.supportType} onChange={(event) => updateSupportForm("supportType", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none">
                      {supportOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Amount / Value</span>
                    <input value={supportForm.amount} onChange={(event) => updateSupportForm("amount", event.target.value)} placeholder="Optional amount or estimated value" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Preferred Financial Stream</span>
                    <select value={supportForm.preferredPaymentStream} onChange={(event) => updateSupportForm("preferredPaymentStream", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none">
                      {paymentStreams.map((stream) => (
                        <option key={stream}>{stream}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm text-zinc-300">Support Details</span>
                    <textarea value={supportForm.supportDetails} onChange={(event) => updateSupportForm("supportDetails", event.target.value)} rows={5} placeholder="Example: I can buy 10 balls, sponsor transport for one away game, support one player, or discuss monthly sponsorship." className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                </div>
                {supportMessage ? (
                  <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${supportStatus === "error" ? "border-red-500/30 bg-red-500/10 text-red-100" : "border-white/10 bg-white/5 text-zinc-100"}`}>
                    {supportMessage}
                  </div>
                ) : null}
                <button type="submit" disabled={supportStatus === "sending"} className="mt-5 inline-flex rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60">
                  Send Support Request
                </button>
              </form>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] bg-transparent p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-300">Gratitude</p>
            <h2 className="mt-3 text-3xl font-black text-white">Thank you for your support</h2>
           
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {page.gratitudeCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedGratitude(card)}
                  className="group overflow-hidden rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] text-left shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-md transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.36)]"
                >
                  <div className="relative h-56 bg-transparent">
                    <img src={card.image} alt={card.title} className="h-full w-full object-cover object-center" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.22),rgba(0,0,0,0.78))]" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                      <p className="text-xs uppercase tracking-[0.35em] text-zinc-200">{card.name}</p>
                      <p className="mt-2 text-lg font-bold text-white">{card.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {selectedGratitude ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-3 py-4 sm:px-6 sm:py-8" onClick={() => setSelectedGratitude(null)}>
            <div className="relative h-[88vh] w-full max-w-[96rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] shadow-glow" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-red-300">Gratitude</p>
                  <h3 className="mt-1 text-xl font-bold text-white">{selectedGratitude.name}</h3>
                </div>
                <button onClick={() => setSelectedGratitude(null)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  Close
                </button>
              </div>
              <div className="relative h-[calc(88vh-73px)] w-full bg-black">
                <img src={selectedGratitude.image} alt={selectedGratitude.title} className="h-full w-full object-contain object-center" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-5 text-center sm:px-8 sm:pb-7">
                  <p className="text-sm uppercase tracking-[0.35em] text-red-200">{selectedGratitude.name}</p>
                  <h4 className="mx-auto mt-3 max-w-4xl text-3xl font-black text-white sm:text-5xl">{selectedGratitude.title}</h4>
                  <p className="mx-auto mt-4 max-w-5xl text-lg leading-8 text-zinc-100 sm:text-xl lg:text-2xl">
                    {selectedGratitude.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </PublicShell>
  );
}

export function DonatePageClient() {
  return <DonatePageShell />;
}
