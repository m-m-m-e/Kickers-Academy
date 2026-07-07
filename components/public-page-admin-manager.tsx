"use client";

import { useMemo, useState } from "react";
import type {
  ContactDetailLink,
  ContactPageContent,
  ContactSubmission,
  ContactSocialLink,
  DonateGratitudeCard,
  DonatePageContent,
  DonateSupportWay,
  EngageConnectionRequest,
  EngageSubmission,
  SupportSubmission,
  ImageContentItem,
  JoinPageContent,
  JoinRegistration
} from "@/lib/home-content";
import { AdminSaveButton } from "@/components/admin-save-button";
import { useHomeContent } from "@/components/home-content-provider";
import { buildMapEmbedUrl } from "@/lib/map-url";

type PageKind = "join" | "contact" | "donate";
const TABLE_PAGE_SIZE = 20;

const contactIcons: ContactSocialLink["icon"][] = ["tiktok", "facebook", "instagram", "youtube"];

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < rating ? "text-yellow-300" : "text-white/20"}>
      ★
    </span>
  ));
}

function uploadToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

function uploadImageToPage(
  file: File | null,
  apply: (image: string) => void
) {
  if (!file) return;
  return uploadToDataUrl(file).then(apply);
}

async function uploadDocumentFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/uploads/document", {
    method: "POST",
    body: formData
  });
  const data = (await response.json()) as { error?: string; name?: string; url?: string };

  if (!response.ok || !data.url) {
    throw new Error(data.error || "Unable to upload document.");
  }

  return {
    name: data.name || file.name,
    url: data.url
  };
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function makeConfirmationMessage(registration: JoinRegistration) {
  return `Hello ${registration.guardianName}, ${registration.playerName}'s registration has been reviewed and approved successfully. Welcome to Kickers Academy. We will contact you with the next training steps.`;
}

function makeWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

function makeMailLink(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function getConsentDocumentHref(documentUrl: string) {
  if (!documentUrl) return "";
  if (documentUrl.startsWith("data:")) return "/api/join-consent-document";
  if (documentUrl.startsWith("/uploads/documents/")) {
    return `/api/uploads/document?name=${encodeURIComponent(documentUrl.split("/").pop() ?? "")}`;
  }
  return documentUrl;
}

function getDownloadDocumentHref(documentUrl: string) {
  const href = getConsentDocumentHref(documentUrl);
  if (href.startsWith("/api/uploads/document?")) return `${href}&download=1`;
  return href;
}

export function PublicPageAdminManager({ kind }: { kind: PageKind }) {
  const {
    content,
    updateJoinPage,
    updateContactPage,
    updateDonatePage,
    updateEngageConnectionRequest,
    updateEngageConnectionRequestStatus,
    deleteEngageConnectionRequest,
    updateEngageSubmission,
    updateEngageSubmissionStatus,
    deleteEngageSubmission,
    updateSupportSubmission,
    updateSupportSubmissionStatus,
    deleteSupportSubmission,
    updateFooterContent,
    updateJoinRegistration,
    updateJoinRegistrationStatus,
    deleteJoinRegistration,
    updateContactSubmission,
    updateContactSubmissionStatus,
    deleteContactSubmission,
    updateFeedbackSubmission,
    updateFeedbackSubmissionStatus
  } = useHomeContent();
  const [emailStatusById, setEmailStatusById] = useState<Record<string, { status: "sending" | "sent" | "error"; message: string }>>({});
  const [registrationTablePage, setRegistrationTablePage] = useState(0);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null);
  const [contactTablePage, setContactTablePage] = useState(0);
  const [selectedContactSubmissionId, setSelectedContactSubmissionId] = useState<string | null>(null);
  const [engageTablePage, setEngageTablePage] = useState(0);
  const [selectedEngageSubmissionId, setSelectedEngageSubmissionId] = useState<string | null>(null);
  const [connectionRequestTablePage, setConnectionRequestTablePage] = useState(0);
  const [selectedConnectionRequestId, setSelectedConnectionRequestId] = useState<string | null>(null);
  const [supportTablePage, setSupportTablePage] = useState(0);
  const [selectedSupportSubmissionId, setSelectedSupportSubmissionId] = useState<string | null>(null);
  const [feedbackTablePage, setFeedbackTablePage] = useState(0);
  const [selectedFeedbackSubmissionId, setSelectedFeedbackSubmissionId] = useState<string | null>(null);

  const page = useMemo(() => {
    if (kind === "join") return content.joinPage;
    if (kind === "contact") return content.contactPage;
    return content.donatePage;
  }, [content.contactPage, content.donatePage, content.joinPage, kind]);

  const updatePage = (next: JoinPageContent | ContactPageContent | DonatePageContent) => {
    if (kind === "join") updateJoinPage(next as JoinPageContent);
    if (kind === "contact") updateContactPage(next as ContactPageContent);
    if (kind === "donate") updateDonatePage(next as DonatePageContent);
  };

  const updateHero = async (file: File | null) => {
    if (!file) return;
    const image = await uploadToDataUrl(file);
    updatePage({ ...page, hero: { ...page.hero, image } } as typeof page);
  };

  const removeHeroImage = () => {
    updatePage({ ...page, hero: { ...page.hero, image: "" } } as typeof page);
  };

  const updateHeroField = (field: keyof ImageContentItem, value: string) => {
    updatePage({ ...page, hero: { ...page.hero, [field]: value } } as typeof page);
  };

  const sendRegistrationEmail = async (registration: JoinRegistration) => {
    setEmailStatusById((current) => ({
      ...current,
      [registration.id]: { status: "sending", message: "Sending confirmation email..." }
    }));

    try {
      const response = await fetch("/api/join-registrations/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: registration.id })
      });
      const data = (await response.json()) as { error?: string; registration?: JoinRegistration };

      if (!response.ok) {
        throw new Error(data.error || "Unable to send confirmation email.");
      }

      updateJoinRegistration(data.registration ?? { ...registration, emailConfirmedAt: new Date().toISOString() });
      setEmailStatusById((current) => ({
        ...current,
        [registration.id]: { status: "sent", message: "Confirmation email sent successfully." }
      }));
    } catch (error) {
      setEmailStatusById((current) => ({
        ...current,
        [registration.id]: {
          status: "error",
          message: error instanceof Error ? error.message : "Unable to send confirmation email."
        }
      }));
    }
  };

  if (kind === "join") {
    const joinPage = page as JoinPageContent;
    const pendingRegistrations = content.joinRegistrations.filter((registration) => registration.status === "pending").length;
    const registrationTotalPages = Math.max(1, Math.ceil(content.joinRegistrations.length / TABLE_PAGE_SIZE));
    const visibleRegistrations = content.joinRegistrations.slice(
      registrationTablePage * TABLE_PAGE_SIZE,
      registrationTablePage * TABLE_PAGE_SIZE + TABLE_PAGE_SIZE
    );
    const selectedRegistration =
      content.joinRegistrations.find((registration) => registration.id === selectedRegistrationId) ??
      content.joinRegistrations[0] ??
      null;

    return (
      <main className="p-6 lg:p-10">
        <div className="max-w-7xl">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.35em] text-red-200">Join Module</p>
            <h1 className="mt-3 text-4xl font-black">Manage the join page</h1>
            <p className="mt-4 max-w-4xl text-zinc-300">Control the registration hero, process copy, form copy, and review applications before anyone is officially registered.</p>
          </div>

          <div className="mt-6">
            <AdminSaveButton />
          </div>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                {joinPage.hero.image ? (
                  <img src={joinPage.hero.image} alt={joinPage.hero.title} className="h-full w-full object-contain object-center" />
                ) : (
                  <div className="px-6 py-4">
                    <p className="text-sm font-semibold text-white">No hero image selected</p>
                    <p className="mt-2 text-xs leading-5 text-zinc-400">
                      Select an image for the Join page hero. This preview appears while the upload is pending.
                    </p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(event) => void updateHero(event.target.files?.[0] ?? null)} />
              </label>
              <div className="space-y-3">
                <input value={joinPage.hero.title} onChange={(event) => updateHeroField("title", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <textarea value={joinPage.hero.description} onChange={(event) => updateHeroField("description", event.target.value)} rows={6} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={joinPage.hero.image} onChange={(event) => updateHeroField("image", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <div className="flex flex-wrap gap-3">
                  {joinPage.hero.image ? (
                    <button
                      type="button"
                      onClick={removeHeroImage}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                    >
                      Remove Image
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8 xl:col-span-2">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Registration Process</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input value={joinPage.processTitle} onChange={(event) => updatePage({ ...joinPage, processTitle: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <textarea value={joinPage.processDescription} onChange={(event) => updatePage({ ...joinPage, processDescription: event.target.value })} rows={3} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
              </div>
              <div className="mt-5 space-y-3">
                {joinPage.processSteps.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex gap-3">
                    <input
                      value={item}
                      onChange={(event) => {
                        const processSteps = [...joinPage.processSteps];
                        processSteps[index] = event.target.value;
                        updatePage({ ...joinPage, processSteps });
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updatePage({ ...joinPage, processSteps: joinPage.processSteps.filter((_, i) => i !== index) })}
                      className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updatePage({ ...joinPage, processSteps: [...joinPage.processSteps, "New process step"] })}
                  className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Add Process Step
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Requirements</p>
              <div className="mt-4 space-y-3">
                {joinPage.requirements.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex gap-3">
                    <input
                      value={item}
                      onChange={(event) => {
                        const requirements = [...joinPage.requirements];
                        requirements[index] = event.target.value;
                        updatePage({ ...joinPage, requirements });
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updatePage({ ...joinPage, requirements: joinPage.requirements.filter((_, i) => i !== index) })}
                      className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updatePage({ ...joinPage, requirements: [...joinPage.requirements, "New requirement"] })}
                  className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Add Requirement
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Required Information</p>
              <div className="mt-4 space-y-3">
                {joinPage.requiredInformation.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex gap-3">
                    <input
                      value={item}
                      onChange={(event) => {
                        const requiredInformation = [...joinPage.requiredInformation];
                        requiredInformation[index] = event.target.value;
                        updatePage({ ...joinPage, requiredInformation });
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updatePage({ ...joinPage, requiredInformation: joinPage.requiredInformation.filter((_, i) => i !== index) })}
                      className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updatePage({ ...joinPage, requiredInformation: [...joinPage.requiredInformation, "New information item"] })}
                  className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Add Information Item
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8 xl:col-span-2">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Form Copy</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <input value={joinPage.formTitle} onChange={(event) => updatePage({ ...joinPage, formTitle: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={joinPage.submitLabel} onChange={(event) => updatePage({ ...joinPage, submitLabel: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <textarea value={joinPage.formDescription} onChange={(event) => updatePage({ ...joinPage, formDescription: event.target.value })} rows={3} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-3" />
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8 xl:col-span-2">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Photo Consent Document</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Parent read and download document</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                Upload the PDF parents should read before choosing Allow or Deny on photo/video publication consent. If no document is uploaded, the public page uses the built-in consent page.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Document Name</span>
                  <input
                    value={joinPage.photoConsentDocumentName}
                    onChange={(event) => updatePage({ ...joinPage, photoConsentDocumentName: event.target.value })}
                    placeholder="Photo & Video Publication Consent"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-zinc-300">Document URL</span>
                  <input
                    value={joinPage.photoConsentDocumentUrl}
                    onChange={(event) => updatePage({ ...joinPage, photoConsentDocumentUrl: event.target.value })}
                    placeholder="Upload a PDF or paste a document URL"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm text-zinc-300">Small public description</span>
                  <textarea
                    value={joinPage.photoConsentDocumentDescription}
                    onChange={(event) => updatePage({ ...joinPage, photoConsentDocumentDescription: event.target.value })}
                    rows={3}
                    placeholder="Short guidance shown beside the Allow / Deny buttons"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                  />
                </label>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
                  Upload PDF
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      if (!file) return;
                      void uploadDocumentFile(file)
                        .then((document) => {
                          updatePage({
                            ...joinPage,
                            photoConsentDocumentName: document.name,
                            photoConsentDocumentUrl: document.url
                          });
                        })
                        .catch((error) => {
                          window.alert(error instanceof Error ? error.message : "Unable to upload document.");
                        });
                      event.target.value = "";
                    }}
                  />
                </label>
                {joinPage.photoConsentDocumentUrl ? (
                  <>
                    <a
                      href={getConsentDocumentHref(joinPage.photoConsentDocumentUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                    >
                      Read PDF
                    </a>
                    <a
                      href={getDownloadDocumentHref(joinPage.photoConsentDocumentUrl)}
                      className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Download PDF
                    </a>
                    <button
                      type="button"
                      onClick={() => updatePage({ ...joinPage, photoConsentDocumentUrl: "" })}
                      className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                    >
                      Remove Document
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-zinc-400">No uploaded document yet. The built-in consent document will be shown.</span>
                )}
              </div>
              <div className="mt-5">
                <AdminSaveButton label="Save Consent Document" />
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8 xl:col-span-2">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Confirmation Email Content</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Edit the approved registration email</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                These fields control the email sent after approval. Use {"{playerName}"} in the subject if you want the player's name inserted automatically.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  value={joinPage.emailSubject}
                  onChange={(event) => updatePage({ ...joinPage, emailSubject: event.target.value })}
                  placeholder="Email subject"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2"
                />
                <input
                  value={joinPage.emailTitle}
                  onChange={(event) => updatePage({ ...joinPage, emailTitle: event.target.value })}
                  placeholder="Email title"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2"
                />
                <textarea
                  value={joinPage.emailIntro}
                  onChange={(event) => updatePage({ ...joinPage, emailIntro: event.target.value })}
                  rows={4}
                  placeholder="Intro message"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2"
                />
                <textarea
                  value={joinPage.emailProgramNote}
                  onChange={(event) => updatePage({ ...joinPage, emailProgramNote: event.target.value })}
                  rows={3}
                  placeholder="Program note"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                />
                <textarea
                  value={joinPage.emailTrainingGroundNote}
                  onChange={(event) => updatePage({ ...joinPage, emailTrainingGroundNote: event.target.value })}
                  rows={3}
                  placeholder="Training ground note"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                />
                <textarea
                  value={joinPage.emailKitNote}
                  onChange={(event) => updatePage({ ...joinPage, emailKitNote: event.target.value })}
                  rows={3}
                  placeholder="Jersey and kit information"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                />
                <textarea
                  value={joinPage.emailSignOff}
                  onChange={(event) => updatePage({ ...joinPage, emailSignOff: event.target.value })}
                  rows={3}
                  placeholder="Email sign-off"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                />
              </div>
              <div className="mt-5">
                <AdminSaveButton label="Save Email Content" />
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8 xl:col-span-2">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">Registration Applications</p>
                  <h2 className="mt-3 text-3xl font-black text-white">Admin verification queue</h2>
                  <p className="mt-3 max-w-3xl text-zinc-300">
                    New submissions stay pending until an admin approves or rejects them. Edit the verification WhatsApp and email below, then click save to store them in the database.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200">
                  {pendingRegistrations} pending
                </div>
              </div>

              <div className="mt-5">
                <AdminSaveButton label="Save Registration Applications" />
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Verification Sender Contacts</p>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                  These are the academy contacts used for registration confirmation. They also update the footer contacts so the public site stays consistent.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Verification WhatsApp Number</span>
                    <input
                      value={content.footerContent.whatsapp}
                      onChange={(event) => updateFooterContent({ ...content.footerContent, whatsapp: event.target.value })}
                      placeholder="+000 000 000"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Verification Email Address</span>
                    <input
                      value={content.footerContent.email}
                      onChange={(event) => updateFooterContent({ ...content.footerContent, email: event.target.value })}
                      placeholder="info@kickersacademy.com"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                    />
                  </label>
                </div>
                <div className="mt-5">
                  <AdminSaveButton label="Save Verification Contacts" />
                </div>
              </div>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-zinc-400">
                    <tr>
                      <th className="px-4 py-3">Player</th>
                      <th className="px-4 py-3">Guardian</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {visibleRegistrations.map((registration) => (
                      <tr
                        key={registration.id}
                        onClick={() => setSelectedRegistrationId(registration.id)}
                        className={`cursor-pointer transition hover:bg-white/5 ${selectedRegistration?.id === registration.id ? "bg-red-500/10" : "bg-black/20"}`}
                      >
                        <td className="px-4 py-4 font-semibold text-white">{registration.playerName}</td>
                        <td className="px-4 py-4 text-zinc-300">{registration.guardianName}</td>
                        <td className="px-4 py-4 text-zinc-300">{new Date(registration.submittedAt).toLocaleString()}</td>
                        <td className="px-4 py-4 capitalize text-zinc-300">{registration.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
                <span>
                  Showing {visibleRegistrations.length} of {content.joinRegistrations.length} registrations. Page {registrationTablePage + 1} of {registrationTotalPages}.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={registrationTablePage === 0}
                    onClick={() => setRegistrationTablePage((page) => Math.max(0, page - 1))}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={registrationTablePage >= registrationTotalPages - 1}
                    onClick={() => setRegistrationTablePage((page) => Math.min(registrationTotalPages - 1, page + 1))}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>

              {selectedRegistration ? (() => {
                const confirmationMessage = makeConfirmationMessage(selectedRegistration);
                const emailStatus = emailStatusById[selectedRegistration.id];
                const isFinalDecision = selectedRegistration.status !== "pending";

                return (
                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-red-300">{selectedRegistration.status}</p>
                        <h3 className="mt-2 text-2xl font-black text-white">{selectedRegistration.playerName}</h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          Submitted {new Date(selectedRegistration.submittedAt).toLocaleString()} by {selectedRegistration.guardianName}
                        </p>
                      </div>
                      {isFinalDecision ? (
                        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 capitalize">
                          {selectedRegistration.status}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => updateJoinRegistrationStatus(selectedRegistration.id, "approved")} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
                            Approve
                          </button>
                          <button type="button" onClick={() => updateJoinRegistrationStatus(selectedRegistration.id, "rejected")} className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
                            Reject
                          </button>
                          <button type="button" onClick={() => deleteJoinRegistration(selectedRegistration.id)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 grid gap-3 text-sm text-zinc-300 md:grid-cols-2 xl:grid-cols-3">
                      <p><span className="text-zinc-500">Date of birth:</span> {selectedRegistration.dateOfBirth}</p>
                      <p><span className="text-zinc-500">Email:</span> {selectedRegistration.guardianEmail}</p>
                      <p><span className="text-zinc-500">Phone:</span> {selectedRegistration.guardianPhone}</p>
                      <p><span className="text-zinc-500">Emergency:</span> {selectedRegistration.emergencyContact}</p>
                      <p><span className="text-zinc-500">Residence:</span> {selectedRegistration.residence}</p>
                      <p><span className="text-zinc-500">Address:</span> {selectedRegistration.address || "Not provided"}</p>
                      <p>
                        <span className="text-zinc-500">Photo publication:</span>{" "}
                        <span className={selectedRegistration.photoPublicationConsent === "accepted" ? "text-emerald-300" : "text-red-300"}>
                          {selectedRegistration.photoPublicationConsent === "accepted" ? "Accepted" : "Denied"}
                        </span>
                      </p>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm text-zinc-400">Photo publication consent</span>
                        <select
                          value={selectedRegistration.photoPublicationConsent}
                          onChange={(event) =>
                            updateJoinRegistration({
                              ...selectedRegistration,
                              photoPublicationConsent: event.target.value === "accepted" ? "accepted" : "denied"
                            })
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        >
                          <option value="accepted">Accepted</option>
                          <option value="denied">Denied</option>
                        </select>
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm text-zinc-400">Medical information</span>
                        <textarea
                          value={selectedRegistration.medicalInformation}
                          onChange={(event) => updateJoinRegistration({ ...selectedRegistration, medicalInformation: event.target.value })}
                          rows={3}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm text-zinc-400">Admin note</span>
                        <textarea
                          value={selectedRegistration.adminNote ?? ""}
                          onChange={(event) => updateJoinRegistration({ ...selectedRegistration, adminNote: event.target.value })}
                          rows={3}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                      </label>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-red-300">Confirmation Message</p>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">{confirmationMessage}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {selectedRegistration.status === "approved" ? (
                          <>
                            <a
                              href={makeWhatsAppLink(selectedRegistration.guardianPhone, confirmationMessage)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => updateJoinRegistration({ ...selectedRegistration, whatsappConfirmedAt: new Date().toISOString() })}
                              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                            >
                              Send WhatsApp
                            </a>
                            <button
                              type="button"
                              disabled={emailStatus?.status === "sending"}
                              onClick={() => void sendRegistrationEmail(selectedRegistration)}
                              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {emailStatus?.status === "sending" ? "Sending Email..." : "Send Email"}
                            </button>
                            <a
                              href={makeMailLink(
                                selectedRegistration.guardianEmail,
                                content.joinPage.emailSubject.replace("{playerName}", selectedRegistration.playerName),
                                `${confirmationMessage}\n\nRegards,\nKickers Academy`
                              )}
                              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                            >
                              Open Email App
                            </a>
                          </>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-500">
                            Confirmation sending becomes available after approval.
                          </span>
                        )}
                        <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-400">
                          Verification sender: {content.footerContent.whatsapp} / {content.footerContent.email}
                        </span>
                      </div>
                      {emailStatus ? (
                        <p className={`mt-3 text-sm ${emailStatus.status === "error" ? "text-red-200" : "text-emerald-200"}`}>
                          {emailStatus.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })() : (
                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-6 text-zinc-300">
                  No registration selected.
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    );
  }

  if (kind === "contact") {
    const contactPage = page as ContactPageContent;
    const contactTotalPages = Math.max(1, Math.ceil(content.contactSubmissions.length / TABLE_PAGE_SIZE));
    const visibleContactSubmissions = content.contactSubmissions.slice(
      contactTablePage * TABLE_PAGE_SIZE,
      contactTablePage * TABLE_PAGE_SIZE + TABLE_PAGE_SIZE
    );
    const selectedContactSubmission =
      content.contactSubmissions.find((submission) => submission.id === selectedContactSubmissionId) ??
      content.contactSubmissions[0] ??
      null;
    const feedbackTotalPages = Math.max(1, Math.ceil(content.feedbackSubmissions.length / TABLE_PAGE_SIZE));
    const visibleFeedbackSubmissions = content.feedbackSubmissions.slice(
      feedbackTablePage * TABLE_PAGE_SIZE,
      feedbackTablePage * TABLE_PAGE_SIZE + TABLE_PAGE_SIZE
    );
    const selectedFeedbackSubmission =
      content.feedbackSubmissions.find((submission) => submission.id === selectedFeedbackSubmissionId) ??
      content.feedbackSubmissions[0] ??
      null;

    return (
      <main className="p-6 lg:p-10">
        <div className="max-w-7xl">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.35em] text-red-200">Contact Module</p>
            <h1 className="mt-3 text-4xl font-black">Manage the contact page</h1>
            <p className="mt-4 max-w-4xl text-zinc-300">Edit the hero, social links, contact cards, message form text, and map settings.</p>
          </div>

          <div className="mt-6">
            <AdminSaveButton />
          </div>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                {contactPage.hero.image ? (
                  <img src={contactPage.hero.image} alt={contactPage.hero.title} className="h-full w-full object-contain object-center" />
                ) : (
                  <div className="px-6 py-4">
                    <p className="text-sm font-semibold text-white">No hero image selected</p>
                    <p className="mt-2 text-xs leading-5 text-zinc-400">
                      Add a hero image for the Contact page so users see a rich preview while the media loads.
                    </p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(event) => void updateHero(event.target.files?.[0] ?? null)} />
              </label>
              <div className="space-y-3">
                <input value={contactPage.hero.title} onChange={(event) => updateHeroField("title", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <textarea value={contactPage.hero.description} onChange={(event) => updateHeroField("description", event.target.value)} rows={6} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={contactPage.hero.image} onChange={(event) => updateHeroField("image", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <div className="flex flex-wrap gap-3">
                  {contactPage.hero.image ? (
                    <button
                      type="button"
                      onClick={removeHeroImage}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                    >
                      Remove Image
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Social Links</p>
              <div className="mt-4 space-y-3">
                {contactPage.socials.map((item, index) => (
                  <div key={item.id} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                    <input value={item.name} onChange={(event) => {
                      const socials = [...contactPage.socials];
                      socials[index] = { ...item, name: event.target.value };
                      updatePage({ ...contactPage, socials });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <input value={item.handle} onChange={(event) => {
                      const socials = [...contactPage.socials];
                      socials[index] = { ...item, handle: event.target.value };
                      updatePage({ ...contactPage, socials });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <input value={item.href} onChange={(event) => {
                      const socials = [...contactPage.socials];
                      socials[index] = { ...item, href: event.target.value };
                      updatePage({ ...contactPage, socials });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <div className="flex gap-2">
                      <select value={item.icon} onChange={(event) => {
                        const socials = [...contactPage.socials];
                        socials[index] = { ...item, icon: event.target.value as ContactSocialLink["icon"] };
                        updatePage({ ...contactPage, socials });
                      }} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none">
                        {contactIcons.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                      </select>
                      <button type="button" onClick={() => updatePage({ ...contactPage, socials: contactPage.socials.filter((_, i) => i !== index) })} className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => updatePage({ ...contactPage, socials: [...contactPage.socials, { id: makeId("contact-social"), name: "New Social", handle: "@kickersacademy", href: "#", icon: "facebook" }] })} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                  Add Social
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Contact Cards</p>
              <div className="mt-4 space-y-3">
                {contactPage.contacts.map((item, index) => (
                  <div key={item.id} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                    <input value={item.label} onChange={(event) => {
                      const contacts = [...contactPage.contacts];
                      contacts[index] = { ...item, label: event.target.value };
                      updatePage({ ...contactPage, contacts });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <input value={item.value} onChange={(event) => {
                      const contacts = [...contactPage.contacts];
                      contacts[index] = { ...item, value: event.target.value };
                      updatePage({ ...contactPage, contacts });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <input value={item.href} onChange={(event) => {
                      const contacts = [...contactPage.contacts];
                      contacts[index] = { ...item, href: event.target.value };
                      updatePage({ ...contactPage, contacts });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <button type="button" onClick={() => updatePage({ ...contactPage, contacts: contactPage.contacts.filter((_, i) => i !== index) })} className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
                      Delete
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => updatePage({ ...contactPage, contacts: [...contactPage.contacts, { id: makeId("contact-detail"), label: "New Detail", value: "New value", href: "#" }] })} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                  Add Contact
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8 xl:col-span-2">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Form and Map</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Paste a Google Maps embed URL or another map link in the first field. If you leave it empty, the fallback search text will still generate a map.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input value={contactPage.formTitle} onChange={(event) => updatePage({ ...contactPage, formTitle: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={contactPage.submitLabel} onChange={(event) => updatePage({ ...contactPage, submitLabel: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={contactPage.mapTitle} onChange={(event) => updatePage({ ...contactPage, mapTitle: event.target.value })} placeholder="Map section title" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
                <textarea value={contactPage.formDescription} onChange={(event) => updatePage({ ...contactPage, formDescription: event.target.value })} rows={3} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
                <input
                  value={contactPage.mapLink}
                  onChange={(event) => updatePage({ ...contactPage, mapLink: event.target.value })}
                  placeholder="Map link or embed URL"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2"
                />
                <input
                  value={contactPage.mapQuery}
                  onChange={(event) => updatePage({ ...contactPage, mapQuery: event.target.value })}
                  placeholder="Fallback map search text"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2"
                />
                <label className="flex min-h-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400 md:col-span-2">
                  {contactPage.mapImage ? (
                    <img src={contactPage.mapImage} alt={contactPage.mapTitle} className="h-full w-full object-cover" />
                  ) : (
                    <span>Upload map image or screenshot</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      void uploadImageToPage(event.target.files?.[0] ?? null, (image) =>
                        updatePage({ ...contactPage, mapImage: image })
                      );
                    }}
                  />
                </label>
                {contactPage.mapImage ? (
                  <button
                    type="button"
                    onClick={() => updatePage({ ...contactPage, mapImage: "" })}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 md:col-span-2"
                  >
                    Remove Map Image
                  </button>
                ) : null}
              {contactPage.mapLink ? (
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30 md:col-span-2">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-red-300">Map Preview</p>
                    </div>
                    <iframe
                      title={contactPage.mapTitle || "Contact map preview"}
                      src={buildMapEmbedUrl(contactPage.mapLink, contactPage.mapQuery)}
                      className="h-[320px] w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8 xl:col-span-2">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">Contact Messages</p>
                  <h2 className="mt-3 text-3xl font-black text-white">Messages from the public contact form</h2>
                  <p className="mt-3 max-w-3xl text-zinc-300">
                    New contact messages arrive here and also appear in the Notifications module.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200">
                  {content.contactSubmissions.filter((submission) => submission.status === "new").length} new
                </div>
              </div>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-zinc-400">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {visibleContactSubmissions.map((submission) => (
                      <tr
                        key={submission.id}
                        onClick={() => setSelectedContactSubmissionId(submission.id)}
                        className={`cursor-pointer transition hover:bg-white/5 ${selectedContactSubmission?.id === submission.id ? "bg-red-500/10" : "bg-black/20"}`}
                      >
                        <td className="px-4 py-4 font-semibold text-white">{submission.name}</td>
                        <td className="px-4 py-4 text-zinc-300">{submission.subject}</td>
                        <td className="px-4 py-4 text-zinc-300">{new Date(submission.submittedAt).toLocaleString()}</td>
                        <td className="px-4 py-4 capitalize text-zinc-300">{submission.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
                <span>
                  Showing {visibleContactSubmissions.length} of {content.contactSubmissions.length} messages. Page {contactTablePage + 1} of {contactTotalPages}.
                </span>
                <div className="flex gap-2">
                  <button type="button" disabled={contactTablePage === 0} onClick={() => setContactTablePage((page) => Math.max(0, page - 1))} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40">
                    Previous
                  </button>
                  <button type="button" disabled={contactTablePage >= contactTotalPages - 1} onClick={() => setContactTablePage((page) => Math.min(contactTotalPages - 1, page + 1))} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40">
                    Next
                  </button>
                </div>
              </div>

              {selectedContactSubmission ? (
                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-red-300">{selectedContactSubmission.status}</p>
                      <h3 className="mt-2 text-2xl font-black text-white">{selectedContactSubmission.subject}</h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        From {selectedContactSubmission.name} / {selectedContactSubmission.email}
                      </p>
                      {selectedContactSubmission.phone ? (
                        <p className="mt-1 text-sm text-zinc-500">Phone / WhatsApp: {selectedContactSubmission.phone}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => updateContactSubmissionStatus(selectedContactSubmission.id, "read")} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
                        Mark Read
                      </button>
                      <button type="button" onClick={() => deleteContactSubmission(selectedContactSubmission.id)} className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
                        Archive
                      </button>
                    </div>
                  </div>
                  <p className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-zinc-200">
                    {selectedContactSubmission.message}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={makeMailLink(
                        selectedContactSubmission.email,
                        `Re: ${selectedContactSubmission.subject}`,
                        `Hello ${selectedContactSubmission.name},\n\nThank you for contacting Kickers Academy. We received your message about "${selectedContactSubmission.subject}" and would like to continue the conversation.\n\nRegards,\nKickers Academy`
                      )}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                    >
                      Email Sender
                    </a>
                    {selectedContactSubmission.phone ? (
                      <a
                        href={makeWhatsAppLink(
                          selectedContactSubmission.phone,
                          `Hello ${selectedContactSubmission.name}, thank you for contacting Kickers Academy about "${selectedContactSubmission.subject}". We would like to continue the conversation.`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                      >
                        WhatsApp Sender
                      </a>
                    ) : null}
                  </div>
                  <label className="mt-4 block space-y-2">
                    <span className="text-sm text-zinc-400">Admin note</span>
                    <textarea
                      value={selectedContactSubmission.adminNote ?? ""}
                      onChange={(event) => updateContactSubmission({ ...selectedContactSubmission, adminNote: event.target.value })}
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                    />
                  </label>
                  <div className="mt-5">
                    <AdminSaveButton label="Save Contact Messages" />
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-6 text-zinc-300">
                  No contact message selected.
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8 xl:col-span-2">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">Feedback Reviews</p>
                  <h2 className="mt-3 text-3xl font-black text-white">Approve visitor reviews</h2>
                  <p className="mt-3 max-w-3xl text-zinc-300">
                    Feedback stays pending until an admin approves it. Approved reviews appear on the home page between the gallery and the action cards.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200">
                  {content.feedbackSubmissions.filter((submission) => submission.status === "pending").length} pending
                </div>
              </div>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-zinc-400">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {visibleFeedbackSubmissions.map((submission) => (
                      <tr
                        key={submission.id}
                        onClick={() => setSelectedFeedbackSubmissionId(submission.id)}
                        className={`cursor-pointer transition hover:bg-white/5 ${selectedFeedbackSubmission?.id === submission.id ? "bg-red-500/10" : "bg-black/20"}`}
                      >
                        <td className="px-4 py-4 font-semibold text-white">{submission.name.trim() || "Anonymous"}</td>
                        <td className="px-4 py-4 text-zinc-300">{renderStars(submission.rating)}</td>
                        <td className="px-4 py-4 text-zinc-300">{new Date(submission.submittedAt).toLocaleString()}</td>
                        <td className="px-4 py-4 capitalize text-zinc-300">{submission.status}</td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedFeedbackSubmissionId(submission.id);
                            }}
                            className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!visibleFeedbackSubmissions.length ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                          No feedback reviews yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
                <span>
                  Showing {visibleFeedbackSubmissions.length} of {content.feedbackSubmissions.length} reviews. Page {feedbackTablePage + 1} of {feedbackTotalPages}.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={feedbackTablePage === 0}
                    onClick={() => setFeedbackTablePage((pageNumber) => Math.max(0, pageNumber - 1))}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={feedbackTablePage >= feedbackTotalPages - 1}
                    onClick={() => setFeedbackTablePage((pageNumber) => Math.min(feedbackTotalPages - 1, pageNumber + 1))}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>

              {selectedFeedbackSubmission ? (
                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-red-300">{selectedFeedbackSubmission.status}</p>
                      <h3 className="mt-2 text-2xl font-black text-white">{selectedFeedbackSubmission.name.trim() || "Anonymous"}</h3>
                      <div className="mt-2 flex items-center gap-1 text-lg">{renderStars(selectedFeedbackSubmission.rating)}</div>
                      <p className="mt-1 text-sm text-zinc-400">Submitted {new Date(selectedFeedbackSubmission.submittedAt).toLocaleString()}</p>
                      {selectedFeedbackSubmission.reviewedAt ? (
                        <p className="mt-1 text-sm text-zinc-500">Reviewed {new Date(selectedFeedbackSubmission.reviewedAt).toLocaleString()}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateFeedbackSubmissionStatus(selectedFeedbackSubmission.id, "approved")}
                        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFeedbackSubmissionStatus(selectedFeedbackSubmission.id, "rejected")}
                        className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <p className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-zinc-200">
                    {selectedFeedbackSubmission.message}
                  </p>
                  <label className="mt-4 block space-y-2">
                    <span className="text-sm text-zinc-400">Admin note</span>
                    <textarea
                      value={selectedFeedbackSubmission.adminNote ?? ""}
                      onChange={(event) => updateFeedbackSubmission({ ...selectedFeedbackSubmission, adminNote: event.target.value })}
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                    />
                  </label>
                  <div className="mt-5">
                    <AdminSaveButton label="Save Feedback Reviews" />
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-6 text-zinc-300">
                  No feedback review selected.
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    );
  }

  const donatePage = page as DonatePageContent;
  const engageTotalPages = Math.max(1, Math.ceil(content.engageSubmissions.length / TABLE_PAGE_SIZE));
  const visibleEngageSubmissions = content.engageSubmissions.slice(
    engageTablePage * TABLE_PAGE_SIZE,
    engageTablePage * TABLE_PAGE_SIZE + TABLE_PAGE_SIZE
  );
  const selectedEngageSubmission =
    content.engageSubmissions.find((submission) => submission.id === selectedEngageSubmissionId) ??
    content.engageSubmissions[0] ??
    null;
  const connectionRequestTotalPages = Math.max(1, Math.ceil(content.engageConnectionRequests.length / TABLE_PAGE_SIZE));
  const visibleConnectionRequests = content.engageConnectionRequests.slice(
    connectionRequestTablePage * TABLE_PAGE_SIZE,
    connectionRequestTablePage * TABLE_PAGE_SIZE + TABLE_PAGE_SIZE
  );
  const selectedConnectionRequest =
    content.engageConnectionRequests.find((request) => request.id === selectedConnectionRequestId) ??
    content.engageConnectionRequests[0] ??
    null;
  const supportTotalPages = Math.max(1, Math.ceil(content.supportSubmissions.length / TABLE_PAGE_SIZE));
  const visibleSupportSubmissions = content.supportSubmissions.slice(
    supportTablePage * TABLE_PAGE_SIZE,
    supportTablePage * TABLE_PAGE_SIZE + TABLE_PAGE_SIZE
  );
  const selectedSupportSubmission =
    content.supportSubmissions.find((submission) => submission.id === selectedSupportSubmissionId) ??
    content.supportSubmissions[0] ??
    null;

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">Engage Module</p>
          <h1 className="mt-3 text-4xl font-black">Manage the engage page</h1>
          <p className="mt-4 max-w-4xl text-zinc-300">Edit the community engagement content, support and donate section, gratitude cards, and incoming engagement submissions.</p>
        </div>

        <div className="mt-6">
          <AdminSaveButton />
        </div>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                {donatePage.hero.image ? (
                  <img src={donatePage.hero.image} alt={donatePage.hero.title} className="h-full w-full object-contain object-center" />
                ) : (
                  <div className="px-6 py-4">
                    <p className="text-sm font-semibold text-white">No hero image selected</p>
                    <p className="mt-2 text-xs leading-5 text-zinc-400">
                      Choose a hero image for the Engage page to improve the preview while the real media loads.
                    </p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(event) => void updateHero(event.target.files?.[0] ?? null)} />
              </label>
            <div className="space-y-3">
              <input value={donatePage.hero.title} onChange={(event) => updateHeroField("title", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
              <textarea value={donatePage.hero.description} onChange={(event) => updateHeroField("description", event.target.value)} rows={8} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
              <input value={donatePage.hero.image} onChange={(event) => updateHeroField("image", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
              <div className="flex flex-wrap gap-3">
                {donatePage.hero.image ? (
                  <button
                    type="button"
                    onClick={removeHeroImage}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                  >
                    Remove Image
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Connection Requests</p>
              <h2 className="mt-3 text-3xl font-black text-white">Private community connection inbox</h2>
              <p className="mt-3 max-w-3xl text-zinc-300">
                These are requests from people who found an approved skill or occupation on the public network. Personal details stay private and the academy controls the introduction.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200">
              {content.engageConnectionRequests.length} requests
            </div>
          </div>

          <div className="mt-5">
            <AdminSaveButton label="Save Connection Requests" />
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Requester</th>
                    <th className="px-4 py-3">Wants</th>
                    <th className="px-4 py-3">Target Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {visibleConnectionRequests.map((request) => (
                    <tr key={request.id} className="bg-black/20 text-zinc-200">
                      <td className="px-4 py-3 font-semibold text-white">{request.requesterName}</td>
                      <td className="px-4 py-3">{request.targetOccupation}</td>
                      <td className="px-4 py-3">{request.targetEngagementType}</td>
                      <td className="px-4 py-3 capitalize">{request.status}</td>
                      <td className="px-4 py-3">{new Date(request.submittedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedConnectionRequestId(request.id)}
                          className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!visibleConnectionRequests.length ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                        No private connection requests yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: connectionRequestTotalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setConnectionRequestTablePage(index)}
                  className={`h-8 min-w-8 rounded-full px-2.5 text-xs font-semibold ${connectionRequestTablePage === index ? "bg-red-500 text-white" : "bg-white/5 text-zinc-300"}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setConnectionRequestTablePage((pageNumber) => Math.max(0, pageNumber - 1))} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200">
                Previous
              </button>
              <button type="button" onClick={() => setConnectionRequestTablePage((pageNumber) => Math.min(connectionRequestTotalPages - 1, pageNumber + 1))} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200">
                Next
              </button>
            </div>
          </div>

          {selectedConnectionRequest ? (
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <input value={selectedConnectionRequest.requesterName} onChange={(event) => updateEngageConnectionRequest({ ...selectedConnectionRequest, requesterName: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedConnectionRequest.requesterEmail} onChange={(event) => updateEngageConnectionRequest({ ...selectedConnectionRequest, requesterEmail: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedConnectionRequest.requesterPhone} onChange={(event) => updateEngageConnectionRequest({ ...selectedConnectionRequest, requesterPhone: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedConnectionRequest.targetOccupation} onChange={(event) => updateEngageConnectionRequest({ ...selectedConnectionRequest, targetOccupation: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedConnectionRequest.targetEngagementType} onChange={(event) => updateEngageConnectionRequest({ ...selectedConnectionRequest, targetEngagementType: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
                <textarea value={selectedConnectionRequest.reason} onChange={(event) => updateEngageConnectionRequest({ ...selectedConnectionRequest, reason: event.target.value })} rows={5} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
                <textarea value={selectedConnectionRequest.adminNote ?? ""} onChange={(event) => updateEngageConnectionRequest({ ...selectedConnectionRequest, adminNote: event.target.value })} rows={4} placeholder="Admin note" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={makeMailLink(
                    selectedConnectionRequest.requesterEmail,
                    "Kickers Academy connection request",
                    `Hello ${selectedConnectionRequest.requesterName},\n\nThank you for requesting a connection through the Kickers Academy Engage Network. We are reviewing your request for ${selectedConnectionRequest.targetOccupation} and will guide the next step.\n\nRegards,\nKickers Academy`
                  )}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                >
                  Email Requester
                </a>
                {selectedConnectionRequest.requesterPhone ? (
                  <a
                    href={makeWhatsAppLink(
                      selectedConnectionRequest.requesterPhone,
                      `Hello ${selectedConnectionRequest.requesterName}, thank you for requesting a connection through Kickers Academy Engage Network. We are reviewing your request for ${selectedConnectionRequest.targetOccupation}.`
                    )}
                    target="_blank"
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                  >
                    WhatsApp Requester
                  </a>
                ) : null}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {(["new", "contacted", "connected", "archived"] as EngageConnectionRequest["status"][]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateEngageConnectionRequestStatus(selectedConnectionRequest.id, status, selectedConnectionRequest.adminNote)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${selectedConnectionRequest.status === status ? "bg-red-500 text-white" : "border border-white/10 bg-white/5 text-zinc-200"}`}
                  >
                    {status}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    deleteEngageConnectionRequest(selectedConnectionRequest.id);
                    setSelectedConnectionRequestId(null);
                  }}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-red-300">Engage Intro</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              value={donatePage.engageIntroTitle}
              onChange={(event) => updatePage({ ...donatePage, engageIntroTitle: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2"
            />
            <textarea
              value={donatePage.engageIntroDescription}
              onChange={(event) => updatePage({ ...donatePage, engageIntroDescription: event.target.value })}
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2"
            />
          </div>
          <div className="mt-5 space-y-3">
            {donatePage.engagePathways.map((item, index) => (
              <div key={item.id} className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[1fr_auto]">
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={item.title}
                    onChange={(event) => {
                      const engagePathways = [...donatePage.engagePathways];
                      engagePathways[index] = { ...item, title: event.target.value };
                      updatePage({ ...donatePage, engagePathways });
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none md:col-span-2"
                  />
                  <textarea
                    value={item.description}
                    onChange={(event) => {
                      const engagePathways = [...donatePage.engagePathways];
                      engagePathways[index] = { ...item, description: event.target.value };
                      updatePage({ ...donatePage, engagePathways });
                    }}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none md:col-span-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => updatePage({ ...donatePage, engagePathways: donatePage.engagePathways.filter((_, i) => i !== index) })}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                updatePage({
                  ...donatePage,
                  engagePathways: [
                    ...donatePage.engagePathways,
                    { id: makeId("engage-pathway"), title: "New Engage Pathway", description: "Describe this community engagement pathway." }
                  ]
                })
              }
              className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Add Engage Pathway
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-red-300">Engage Form</p>
          <h2 className="mt-3 text-3xl font-black text-white">Edit the public engagement form</h2>
          <p className="mt-3 max-w-3xl text-zinc-300">
            These fields control the headline, supporting copy, and submit button on the public Engage form.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-zinc-300">Form title</span>
              <input
                value={donatePage.formTitle}
                onChange={(event) => updatePage({ ...donatePage, formTitle: event.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-zinc-300">Form description</span>
              <textarea
                value={donatePage.formDescription}
                onChange={(event) => updatePage({ ...donatePage, formDescription: event.target.value })}
                rows={6}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-zinc-300">Submit button label</span>
              <input
                value={donatePage.submitLabel}
                onChange={(event) => updatePage({ ...donatePage, submitLabel: event.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              />
            </label>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Engage Submissions</p>
              <h2 className="mt-3 text-3xl font-black text-white">Community connection inbox</h2>
              <p className="mt-3 max-w-3xl text-zinc-300">Review parents, community members, sponsors, partners, volunteers, and professionals who want to connect with the academy.</p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200">
              {content.engageSubmissions.length} submissions
            </div>
          </div>

          <div className="mt-5">
            <AdminSaveButton label="Save Engage Submissions" />
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Occupation</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {visibleEngageSubmissions.map((submission) => (
                    <tr key={submission.id} className="bg-black/20 text-zinc-200">
                      <td className="px-4 py-3 font-semibold text-white">{submission.name}</td>
                      <td className="px-4 py-3">{submission.engagementType}</td>
                      <td className="px-4 py-3">{submission.occupation || "Not provided"}</td>
                      <td className="px-4 py-3 capitalize">{submission.status}</td>
                      <td className="px-4 py-3">{new Date(submission.submittedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedEngageSubmissionId(submission.id)}
                          className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!visibleEngageSubmissions.length ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                        No engagement submissions yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: engageTotalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setEngageTablePage(index)}
                  className={`h-8 min-w-8 rounded-full px-2.5 text-xs font-semibold ${engageTablePage === index ? "bg-red-500 text-white" : "bg-white/5 text-zinc-300"}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEngageTablePage((pageNumber) => Math.max(0, pageNumber - 1))} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200">
                Previous
              </button>
              <button type="button" onClick={() => setEngageTablePage((pageNumber) => Math.min(engageTotalPages - 1, pageNumber + 1))} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200">
                Next
              </button>
            </div>
          </div>

          {selectedEngageSubmission ? (
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <input value={selectedEngageSubmission.name} onChange={(event) => updateEngageSubmission({ ...selectedEngageSubmission, name: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedEngageSubmission.email} onChange={(event) => updateEngageSubmission({ ...selectedEngageSubmission, email: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedEngageSubmission.phone} onChange={(event) => updateEngageSubmission({ ...selectedEngageSubmission, phone: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedEngageSubmission.engagementType} onChange={(event) => updateEngageSubmission({ ...selectedEngageSubmission, engagementType: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedEngageSubmission.occupation} onChange={(event) => updateEngageSubmission({ ...selectedEngageSubmission, occupation: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
                <textarea value={selectedEngageSubmission.skills} onChange={(event) => updateEngageSubmission({ ...selectedEngageSubmission, skills: event.target.value })} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
                <textarea value={selectedEngageSubmission.message} onChange={(event) => updateEngageSubmission({ ...selectedEngageSubmission, message: event.target.value })} rows={5} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
                <textarea value={selectedEngageSubmission.adminNote ?? ""} onChange={(event) => updateEngageSubmission({ ...selectedEngageSubmission, adminNote: event.target.value })} rows={4} placeholder="Admin note" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={makeMailLink(
                    selectedEngageSubmission.email,
                    "Kickers Academy Engage connection",
                    `Hello ${selectedEngageSubmission.name},\n\nThank you for reaching out to Kickers Academy through the Engage module. We would like to continue the conversation about ${selectedEngageSubmission.engagementType}.\n\nRegards,\nKickers Academy`
                  )}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                >
                  Email
                </a>
                {selectedEngageSubmission.phone ? (
                  <a
                    href={makeWhatsAppLink(
                      selectedEngageSubmission.phone,
                      `Hello ${selectedEngageSubmission.name}, thank you for reaching out to Kickers Academy through Engage. We would like to continue the conversation.`
                    )}
                    target="_blank"
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                  >
                    WhatsApp
                  </a>
                ) : null}
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-semibold text-zinc-400">
                  Approving makes this visible on /engage/network
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {(["new", "contacted", "approved", "archived"] as EngageSubmission["status"][]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateEngageSubmissionStatus(selectedEngageSubmission.id, status, selectedEngageSubmission.adminNote)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${selectedEngageSubmission.status === status ? "bg-red-500 text-white" : "border border-white/10 bg-white/5 text-zinc-200"}`}
                  >
                    {status}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    deleteEngageSubmission(selectedEngageSubmission.id);
                    setSelectedEngageSubmissionId(null);
                  }}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Support Requests</p>
              <h2 className="mt-3 text-3xl font-black text-white">Academy support inbox</h2>
              <p className="mt-3 max-w-3xl text-zinc-300">
                Track people who want to support training equipment, individual players, away game days, sponsorship, or direct financial support.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200">
              {content.supportSubmissions.length} support requests
            </div>
          </div>

          <div className="mt-5">
            <AdminSaveButton label="Save Support Requests" />
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Support Type</th>
                    <th className="px-4 py-3">Payment Stream</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {visibleSupportSubmissions.map((submission) => (
                    <tr key={submission.id} className="bg-black/20 text-zinc-200">
                      <td className="px-4 py-3 font-semibold text-white">{submission.name}</td>
                      <td className="px-4 py-3">{submission.supportType}</td>
                      <td className="px-4 py-3">{submission.preferredPaymentStream || "To be discussed"}</td>
                      <td className="px-4 py-3 capitalize">{submission.status}</td>
                      <td className="px-4 py-3">{new Date(submission.submittedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedSupportSubmissionId(submission.id)}
                          className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!visibleSupportSubmissions.length ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                        No support requests yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: supportTotalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSupportTablePage(index)}
                  className={`h-8 min-w-8 rounded-full px-2.5 text-xs font-semibold ${supportTablePage === index ? "bg-red-500 text-white" : "bg-white/5 text-zinc-300"}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setSupportTablePage((pageNumber) => Math.max(0, pageNumber - 1))} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200">
                Previous
              </button>
              <button type="button" onClick={() => setSupportTablePage((pageNumber) => Math.min(supportTotalPages - 1, pageNumber + 1))} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200">
                Next
              </button>
            </div>
          </div>

          {selectedSupportSubmission ? (
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <input value={selectedSupportSubmission.name} onChange={(event) => updateSupportSubmission({ ...selectedSupportSubmission, name: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedSupportSubmission.email} onChange={(event) => updateSupportSubmission({ ...selectedSupportSubmission, email: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedSupportSubmission.phone} onChange={(event) => updateSupportSubmission({ ...selectedSupportSubmission, phone: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedSupportSubmission.supportType} onChange={(event) => updateSupportSubmission({ ...selectedSupportSubmission, supportType: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedSupportSubmission.amount} onChange={(event) => updateSupportSubmission({ ...selectedSupportSubmission, amount: event.target.value })} placeholder="Amount or estimated value" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <input value={selectedSupportSubmission.preferredPaymentStream} onChange={(event) => updateSupportSubmission({ ...selectedSupportSubmission, preferredPaymentStream: event.target.value })} placeholder="Preferred financial stream" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                <textarea value={selectedSupportSubmission.supportDetails} onChange={(event) => updateSupportSubmission({ ...selectedSupportSubmission, supportDetails: event.target.value })} rows={5} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
                <textarea value={selectedSupportSubmission.adminNote ?? ""} onChange={(event) => updateSupportSubmission({ ...selectedSupportSubmission, adminNote: event.target.value })} rows={4} placeholder="Admin note" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={makeMailLink(
                    selectedSupportSubmission.email,
                    "Kickers Academy support request",
                    `Hello ${selectedSupportSubmission.name},\n\nThank you for offering to support Kickers Academy through ${selectedSupportSubmission.supportType}. We would like to guide the next step and confirm details.\n\nRegards,\nKickers Academy`
                  )}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                >
                  Email
                </a>
                {selectedSupportSubmission.phone ? (
                  <a
                    href={makeWhatsAppLink(
                      selectedSupportSubmission.phone,
                      `Hello ${selectedSupportSubmission.name}, thank you for offering to support Kickers Academy through ${selectedSupportSubmission.supportType}. We would like to guide the next step.`
                    )}
                    target="_blank"
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                  >
                    WhatsApp
                  </a>
                ) : null}
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-semibold text-zinc-400">
                  Payment streams can be attached here later
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {(["new", "contacted", "fulfilled", "archived"] as SupportSubmission["status"][]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateSupportSubmissionStatus(selectedSupportSubmission.id, status, selectedSupportSubmission.adminNote)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${selectedSupportSubmission.status === status ? "bg-red-500 text-white" : "border border-white/10 bg-white/5 text-zinc-200"}`}
                  >
                    {status}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    deleteSupportSubmission(selectedSupportSubmission.id);
                    setSelectedSupportSubmissionId(null);
                  }}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Support Ways</p>
            <div className="mt-4 space-y-3">
              {donatePage.supportWays.map((item, index) => (
                <div key={item.id} className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
                    <input value={item.title} onChange={(event) => {
                      const supportWays = [...donatePage.supportWays];
                      supportWays[index] = { ...item, title: event.target.value };
                      updatePage({ ...donatePage, supportWays });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <input value={item.accent} onChange={(event) => {
                      const supportWays = [...donatePage.supportWays];
                      supportWays[index] = { ...item, accent: event.target.value };
                      updatePage({ ...donatePage, supportWays });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                  </div>
                  <div className="space-y-3">
                    <textarea value={item.description} onChange={(event) => {
                      const supportWays = [...donatePage.supportWays];
                      supportWays[index] = { ...item, description: event.target.value };
                      updatePage({ ...donatePage, supportWays });
                    }} rows={5} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <button type="button" onClick={() => updatePage({ ...donatePage, supportWays: donatePage.supportWays.filter((_, i) => i !== index) })} className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => updatePage({ ...donatePage, supportWays: [...donatePage.supportWays, { id: makeId("support-way"), title: "New Support Way", description: "Describe the support option here.", accent: "from-white/15" }] })} className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">
                Add Support Way
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Impact Points</p>
            <div className="mt-4 space-y-3">
              {donatePage.impactPoints.map((item, index) => (
                <div key={`${item}-${index}`} className="flex gap-3">
                  <input value={item} onChange={(event) => {
                    const impactPoints = [...donatePage.impactPoints];
                    impactPoints[index] = event.target.value;
                    updatePage({ ...donatePage, impactPoints });
                  }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                  <button type="button" onClick={() => updatePage({ ...donatePage, impactPoints: donatePage.impactPoints.filter((_, i) => i !== index) })} className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200">
                    Delete
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => updatePage({ ...donatePage, impactPoints: [...donatePage.impactPoints, "New impact point"] })} className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">
                Add Impact Point
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8 xl:col-span-2">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Gratitude Cards</p>
            <div className="mt-4 space-y-4">
              {donatePage.gratitudeCards.map((card, index) => (
                <div key={card.id} className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="space-y-3">
                    <label className="flex min-h-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-sm text-zinc-400">
                      {card.image ? <img src={card.image} alt={card.title} className="h-full w-full object-contain object-center" /> : <span>Upload image</span>}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0] ?? null;
                          if (!file) return;
                          const image = await uploadToDataUrl(file);
                          const gratitudeCards = [...donatePage.gratitudeCards];
                          gratitudeCards[index] = { ...card, image };
                          updatePage({ ...donatePage, gratitudeCards });
                        }}
                      />
                    </label>
                    {card.image ? (
                      <button type="button" onClick={() => {
                        const gratitudeCards = [...donatePage.gratitudeCards];
                        gratitudeCards[index] = { ...card, image: "" };
                        updatePage({ ...donatePage, gratitudeCards });
                      }} className="w-full rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200">
                        Remove Image
                      </button>
                    ) : null}
                  </div>
                  <div className="space-y-3">
                    <input value={card.name} onChange={(event) => {
                      const gratitudeCards = [...donatePage.gratitudeCards];
                      gratitudeCards[index] = { ...card, name: event.target.value };
                      updatePage({ ...donatePage, gratitudeCards });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <input value={card.title} onChange={(event) => {
                      const gratitudeCards = [...donatePage.gratitudeCards];
                      gratitudeCards[index] = { ...card, title: event.target.value };
                      updatePage({ ...donatePage, gratitudeCards });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <textarea value={card.description} onChange={(event) => {
                      const gratitudeCards = [...donatePage.gratitudeCards];
                      gratitudeCards[index] = { ...card, description: event.target.value };
                      updatePage({ ...donatePage, gratitudeCards });
                    }} rows={6} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <input value={card.image} onChange={(event) => {
                      const gratitudeCards = [...donatePage.gratitudeCards];
                      gratitudeCards[index] = { ...card, image: event.target.value };
                      updatePage({ ...donatePage, gratitudeCards });
                    }} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
                    <button type="button" onClick={() => updatePage({ ...donatePage, gratitudeCards: donatePage.gratitudeCards.filter((_, i) => i !== index) })} className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => updatePage({ ...donatePage, gratitudeCards: [...donatePage.gratitudeCards, { id: makeId("gratitude"), name: "New Supporter", title: "New Gratitude Card", description: "Describe the supporter here.", image: "" }] })} className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">
                Add Gratitude Card
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8 xl:col-span-2">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Support Text</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input value={donatePage.supportMessageTitle} onChange={(event) => updatePage({ ...donatePage, supportMessageTitle: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
              <input value={donatePage.goodToKnowTitle} onChange={(event) => updatePage({ ...donatePage, goodToKnowTitle: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
              <textarea value={donatePage.supportMessageDescription} onChange={(event) => updatePage({ ...donatePage, supportMessageDescription: event.target.value })} rows={7} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
              <textarea value={donatePage.goodToKnowDescription} onChange={(event) => updatePage({ ...donatePage, goodToKnowDescription: event.target.value })} rows={7} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
