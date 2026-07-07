"use client";

import { useState } from "react";
import { PublicShell } from "@/components/public-shell";
import { PublicModuleHero } from "@/components/public-module-hero";
import { useHomeContent } from "@/components/home-content-provider";

const emptyForm = {
  playerName: "",
  dateOfBirth: "",
  guardianName: "",
  guardianEmail: "",
  guardianPhone: "",
  emergencyContact: "",
  address: "",
  residence: "",
  medicalInformation: "",
  photoPublicationConsent: "denied",
  consent: false
};

function getConsentDocumentHref(documentUrl: string) {
  if (!documentUrl) return "/join-register/photo-consent";
  if (documentUrl.startsWith("data:")) return "/api/join-consent-document";
  if (documentUrl.startsWith("/uploads/documents/")) {
    return `/api/uploads/document?name=${encodeURIComponent(documentUrl.split("/").pop() ?? "")}`;
  }
  return documentUrl;
}

function getDownloadDocumentHref(documentUrl: string) {
  const href = getConsentDocumentHref(documentUrl);
  if (href.startsWith("/api/uploads/document?")) return `${href}&download=1`;
  if (href === "/api/join-consent-document") return href;
  return href;
}

export function JoinRegisterClient() {
  const { content } = useHomeContent();
  const page = content.joinPage;
  const consentDocumentHref = getConsentDocumentHref(page.photoConsentDocumentUrl);
  const downloadDocumentHref = getDownloadDocumentHref(page.photoConsentDocumentUrl);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const updateField = (field: keyof typeof emptyForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== "submitting") {
      setStatus("idle");
      setMessage("");
    }
  };

  const submitRegistration = async () => {
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/join-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit registration");
      }

      setForm(emptyForm);
      setStatus("success");
      setMessage("Registration submitted for review. The academy team will verify it before confirming through WhatsApp and email.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit registration. Please try again.");
    }
  };

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <PublicModuleHero eyebrow="Join" title={page.hero.title} description={page.hero.description} image={page.hero.image} />

        <div className="mx-auto mt-12 grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Requirements</p>
            <h2 className="mt-3 text-3xl font-black text-white">Before you begin</h2>
            <div className="mt-6 space-y-4">
              {page.requirements.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-zinc-200">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-red-500/20 bg-red-500/10 p-5 text-zinc-100">
              <p className="text-sm uppercase tracking-[0.35em] text-red-200">Required Information</p>
              <ul className="mt-4 space-y-3 text-base leading-7">
                {page.requiredInformation.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Registration Process</p>
              <h3 className="mt-3 text-2xl font-black text-white">{page.processTitle}</h3>
              <p className="mt-3 text-base leading-7 text-zinc-300">{page.processDescription}</p>
              <div className="mt-5 space-y-3">
                {page.processSteps.map((step, index) => (
                  <div key={`${step}-${index}`} className="flex gap-3 rounded-2xl bg-white/5 px-4 py-4 text-zinc-200">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Registration Form</p>
            <h2 className="mt-3 text-3xl font-black text-white">{page.formTitle}</h2>
            <p className="mt-4 max-w-2xl text-zinc-300">{page.formDescription}</p>

            <form className="mt-8 space-y-5" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Player's Full Name</span>
                  <input type="text" value={form.playerName} onChange={(event) => updateField("playerName", event.target.value)} placeholder="Enter full name" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Date of Birth</span>
                  <input type="date" value={form.dateOfBirth} onChange={(event) => updateField("dateOfBirth", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Parent / Guardian Full Name</span>
                  <input type="text" value={form.guardianName} onChange={(event) => updateField("guardianName", event.target.value)} placeholder="Enter parent or guardian full name" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Parent / Guardian Email</span>
                  <input type="email" value={form.guardianEmail} onChange={(event) => updateField("guardianEmail", event.target.value)} placeholder="guardian@example.com" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Parent / Guardian Contact Information</span>
                  <input type="text" value={form.guardianPhone} onChange={(event) => updateField("guardianPhone", event.target.value)} placeholder="Phone number" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Emergency Contact Information</span>
                  <input type="text" value={form.emergencyContact} onChange={(event) => updateField("emergencyContact", event.target.value)} placeholder="Emergency contact" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Address (Optional)</span>
                  <input type="text" value={form.address} onChange={(event) => updateField("address", event.target.value)} placeholder="Street address or area" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Place of Residence</span>
                  <input type="text" value={form.residence} onChange={(event) => updateField("residence", event.target.value)} placeholder="Town / city / suburb" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Medical Information, if any</span>
                <textarea rows={5} value={form.medicalInformation} onChange={(event) => updateField("medicalInformation", event.target.value)} placeholder="Allergies, medications, or anything the coaches should know" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
              </label>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-red-300">Photo Publication Consent</p>
                    <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-400">
                      {page.photoConsentDocumentDescription ||
                        "Choose if the academy may publish the player's photos/videos for official academy communication."}
                    </p>
                  </div>
                  {page.photoConsentDocumentUrl ? (
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={consentDocumentHref}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-semibold text-zinc-100 transition hover:bg-black/50"
                      >
                        Read PDF
                      </a>
                      <a
                        href={downloadDocumentHref}
                        className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600"
                      >
                        Download PDF
                      </a>
                    </div>
                  ) : (
                    <a
                      href={consentDocumentHref}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-semibold text-zinc-100 transition hover:bg-black/50"
                    >
                      Read / PDF
                    </a>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <label className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${form.photoPublicationConsent === "accepted" ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-100" : "border-white/10 bg-black/25 text-zinc-200 hover:bg-black/40"}`}>
                    <input
                      type="radio"
                      name="photoPublicationConsent"
                      value="accepted"
                      checked={form.photoPublicationConsent === "accepted"}
                      onChange={(event) => updateField("photoPublicationConsent", event.target.value)}
                      className="sr-only"
                    />
                    Allow
                  </label>
                  <label className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${form.photoPublicationConsent === "denied" ? "border-red-400/50 bg-red-500/15 text-red-100" : "border-white/10 bg-black/25 text-zinc-200 hover:bg-black/40"}`}>
                    <input
                      type="radio"
                      name="photoPublicationConsent"
                      value="denied"
                      checked={form.photoPublicationConsent === "denied"}
                      onChange={(event) => updateField("photoPublicationConsent", event.target.value)}
                      className="sr-only"
                    />
                    Deny
                  </label>
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <input type="checkbox" checked={form.consent} onChange={(event) => updateField("consent", event.target.checked)} className="mt-1" />
                <span className="text-sm leading-6 text-zinc-200">
                  I confirm that the information above is accurate and that a parent or guardian has given consent for this registration.
                </span>
              </label>

              {message ? (
                <div className={`rounded-2xl px-4 py-4 text-sm leading-6 ${status === "success" ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-100" : "border border-red-400/30 bg-red-500/10 text-red-100"}`}>
                  {message}
                </div>
              ) : null}

              <button type="button" onClick={submitRegistration} disabled={status === "submitting"} className="inline-flex rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60">
                {status === "submitting" ? "Submitting..." : page.submitLabel}
              </button>
            </form>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
