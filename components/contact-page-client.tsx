"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { PublicShell } from "@/components/public-shell";
import { PublicModuleHero } from "@/components/public-module-hero";
import { useHomeContent } from "@/components/home-content-provider";
import { buildMapEmbedUrl } from "@/lib/map-url";

const iconShell = "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white";

const initialContactForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

const initialFeedbackForm = {
  name: "",
  rating: 0,
  message: ""
};

function getContactHref(label: string, value: string, fallbackHref: string) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("email")) {
    return value.startsWith("mailto:") ? value : `mailto:${value}`;
  }

  if (normalizedLabel.includes("phone")) {
    return value.startsWith("tel:") ? value : `tel:${value.replace(/\s+/g, "")}`;
  }

  if (normalizedLabel.includes("whatsapp")) {
    if (value.startsWith("https://wa.me/")) return value;
    return `https://wa.me/${value.replace(/\D/g, "")}`;
  }

  return fallbackHref;
}

function ContactIcon({ icon }: { icon: "tiktok" | "facebook" | "instagram" | "youtube" }) {
  switch (icon) {
    case "tiktok":
      return (
        <span className={iconShell}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M16.5 3c.4 2.8 2.1 4.5 4.5 4.7V11c-1.7.1-3.4-.4-4.8-1.3v5.6c0 3.4-2.7 6.2-6.1 6.2-3.4 0-6.1-2.8-6.1-6.2 0-3.4 2.7-6.2 6.1-6.2.4 0 .8 0 1.2.1v3.7c-.4-.1-.8-.2-1.2-.2-1.3 0-2.4 1.1-2.4 2.5s1.1 2.5 2.4 2.5c1.4 0 2.6-1.2 2.6-2.8V3h3.8z" />
          </svg>
        </span>
      );
    case "facebook":
      return (
        <span className={iconShell}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.6 1.7-1.6h1.5V4.6c-.3 0-1.4-.1-2.7-.1-2.6 0-4.4 1.6-4.4 4.6v1.8H7v3.1h2.6v8h3.9z" />
          </svg>
        </span>
      );
    case "instagram":
      return (
        <span className={iconShell}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </span>
      );
    case "youtube":
      return (
        <span className={iconShell}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M21.8 8.2c0-1.6-1.2-2.8-2.8-2.8H5c-1.6 0-2.8 1.2-2.8 2.8v7.6c0 1.6 1.2 2.8 2.8 2.8h14c1.6 0 2.8-1.2 2.8-2.8V8.2zM10 15.1V8.9l5.5 3.1L10 15.1z" />
          </svg>
        </span>
      );
  }
}

export function ContactPageClient() {
  const { content } = useHomeContent();
  const page = content.contactPage;
  const [form, setForm] = useState(initialContactForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [feedbackForm, setFeedbackForm] = useState(initialFeedbackForm);
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const mapSrc = buildMapEmbedUrl(page.mapLink, page.mapQuery);
  const ratingOptions = useMemo(() => [1, 2, 3, 4, 5], []);

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== "sending") {
      setStatus("idle");
      setMessage("");
    }
  };

  const updateFeedbackForm = (field: keyof typeof feedbackForm, value: string | number) => {
    setFeedbackForm((current) => ({ ...current, [field]: value }));
    if (feedbackStatus !== "sending") {
      setFeedbackStatus("idle");
      setFeedbackMessage("");
    }
  };

  const submitContactForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("Sending your message...");

    try {
      const response = await fetch("/api/contact-submissions", {
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

      setForm(initialContactForm);
      setStatus("sent");
      setMessage("Thank you. Your message has reached Kickers Academy.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send your message.");
    }
  };

  const submitFeedbackForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (feedbackForm.rating < 1) {
      setFeedbackStatus("error");
      setFeedbackMessage("Please choose a rating before submitting your feedback.");
      return;
    }

    setFeedbackStatus("sending");
    setFeedbackMessage("Sending your feedback...");

    try {
      const response = await fetch("/api/feedback-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(feedbackForm)
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to send your feedback.");
      }

      setFeedbackForm(initialFeedbackForm);
      setFeedbackStatus("sent");
      setFeedbackMessage("Thank you. Your feedback has been sent for admin review.");
    } catch (error) {
      setFeedbackStatus("error");
      setFeedbackMessage(error instanceof Error ? error.message : "Unable to send your feedback.");
    }
  };

  return (
    <PublicShell>
      <main className="bg-[#050505] pb-20 pt-20 text-white">
        <PublicModuleHero eyebrow="Contact Us" title={page.hero.title} description={page.hero.description} image={page.hero.image} />

        <div className="mx-auto mt-12 grid max-w-7xl gap-8 px-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Social Media</p>
              <h2 className="mt-3 text-3xl font-black text-white">Follow the team</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {page.socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 transition hover:border-red-400/40 hover:bg-white/5"
                  >
                    <ContactIcon icon={social.icon} />
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-red-200">{social.name}</p>
                      <p className="mt-3 text-lg font-semibold text-white">{social.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Contact Details</p>
              <h2 className="mt-3 text-3xl font-black text-white">Get in touch</h2>
              <div className="mt-6 space-y-4">
                {page.contacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={getContactHref(contact.label, contact.value, contact.href)}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 transition hover:border-red-400/40 hover:bg-white/5"
                  >
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-red-200">{contact.label}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{contact.value}</p>
                    </div>
                    <span className="text-sm text-zinc-400">Open</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Feedback Form</p>
              <h2 className="mt-3 text-3xl font-black text-white">Share your review</h2>
              <p className="mt-4 text-zinc-300">
                Leave a rating and a short review. Names are optional, and approved feedback will appear on the home page after admin verification.
              </p>

              <form className="mt-8 space-y-5" onSubmit={submitFeedbackForm}>
                <label className="space-y-2 block">
                  <span className="text-sm text-zinc-300">Name, if you want to show it</span>
                  <input
                    type="text"
                    value={feedbackForm.name}
                    onChange={(event) => updateFeedbackForm("name", event.target.value)}
                    placeholder="Anonymous or your name"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                  />
                </label>

                <div className="space-y-2">
                  <span className="text-sm text-zinc-300">Rating</span>
                  <div className="flex flex-wrap gap-2">
                    {ratingOptions.map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => updateFeedbackForm("rating", rating)}
                        className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                          feedbackForm.rating >= rating
                            ? "border-yellow-400/50 bg-yellow-400/15 text-yellow-200"
                            : "border-white/10 bg-black/30 text-zinc-300 hover:bg-white/5"
                        }`}
                        aria-pressed={feedbackForm.rating >= rating}
                      >
                        <span className="mr-2 text-base leading-none text-yellow-300">★</span>
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="space-y-2 block">
                  <span className="text-sm text-zinc-300">Your review</span>
                  <textarea
                    rows={6}
                    value={feedbackForm.message}
                    onChange={(event) => updateFeedbackForm("message", event.target.value)}
                    required
                    placeholder="Tell us what you think..."
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                  />
                </label>

                {feedbackMessage ? (
                  <div className={`rounded-2xl border px-4 py-3 text-sm ${feedbackStatus === "error" ? "border-red-500/30 bg-red-500/10 text-red-100" : "border-white/10 bg-white/5 text-zinc-100"}`}>
                    {feedbackMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={feedbackStatus === "sending"}
                  className="inline-flex rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {feedbackStatus === "sending" ? "Sending..." : "Submit Feedback"}
                </button>
              </form>
            </div>
          </section>

          <section className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Message Form</p>
              <h2 className="mt-3 text-3xl font-black text-white">{page.formTitle}</h2>
              <p className="mt-4 text-zinc-300">{page.formDescription}</p>
              <form className="mt-8 space-y-5" onSubmit={submitContactForm}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Full Name</span>
                    <input type="text" value={form.name} onChange={(event) => updateForm("name", event.target.value)} required placeholder="Your name" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Email</span>
                    <input type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} required placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                </div>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Phone / WhatsApp</span>
                  <input type="text" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="+000 000 000" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Subject</span>
                  <input type="text" value={form.subject} onChange={(event) => updateForm("subject", event.target.value)} required placeholder="How can we help?" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Message</span>
                  <textarea rows={6} value={form.message} onChange={(event) => updateForm("message", event.target.value)} required placeholder="Write your message here..." className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </label>
                {message ? (
                  <div className={`rounded-2xl border px-4 py-3 text-sm ${status === "error" ? "border-red-500/30 bg-red-500/10 text-red-100" : "border-white/10 bg-white/5 text-zinc-100"}`}>
                    {message}
                  </div>
                ) : null}
                <button type="submit" disabled={status === "sending"} className="inline-flex rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60">
                  {status === "sending" ? "Sending..." : page.submitLabel}
                </button>
              </form>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-panel">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Training Location</p>
                <h2 className="mt-2 text-3xl font-black text-white">{page.mapTitle}</h2>
              </div>
              {mapSrc ? (
                <iframe
                  title={page.mapTitle}
                  src={mapSrc}
                  className="h-[420px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : page.mapImage ? (
                <div className="h-[420px] bg-black">
                  <img src={page.mapImage} alt={page.mapTitle} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-[420px] bg-black">
                  <div className="flex h-full w-full items-center justify-center px-6 text-center text-zinc-400">
                    Add a map link or image in the admin panel to show the training location.
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
