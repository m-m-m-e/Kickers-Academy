"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { useHomeContent } from "@/components/home-content-provider";
import type { EngageSubmission } from "@/lib/home-content";

const initialConnectionForm = {
  requesterName: "",
  requesterEmail: "",
  requesterPhone: "",
  reason: ""
};

function getPublicProfileTitle(connection: EngageSubmission) {
  return connection.occupation || connection.engagementType || "Community Contributor";
}

function getProfileNumber(index: number) {
  return `Community Profile ${String(index + 1).padStart(2, "0")}`;
}

export function EngageNetworkPageClient() {
  const { content } = useHomeContent();
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [selectedConnection, setSelectedConnection] = useState<EngageSubmission | null>(null);
  const [connectionForm, setConnectionForm] = useState(initialConnectionForm);
  const [requestStatus, setRequestStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [requestMessage, setRequestMessage] = useState("");

  const approvedConnections = useMemo(
    () => content.engageSubmissions.filter((submission) => submission.status === "approved"),
    [content.engageSubmissions]
  );

  const engagementTypes = useMemo(
    () => ["All", ...Array.from(new Set(approvedConnections.map((connection) => connection.engagementType).filter(Boolean)))],
    [approvedConnections]
  );

  const visibleConnections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return approvedConnections.filter((connection) => {
      const searchable = [
        connection.occupation,
        connection.engagementType,
        connection.skills,
        connection.message
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesType = activeType === "All" || connection.engagementType === activeType;

      return matchesSearch && matchesType;
    });
  }, [activeType, approvedConnections, query]);

  const updateConnectionForm = (field: keyof typeof connectionForm, value: string) => {
    setConnectionForm((current) => ({ ...current, [field]: value }));
  };

  const openConnectionRequest = (connection: EngageSubmission) => {
    setSelectedConnection(connection);
    setConnectionForm(initialConnectionForm);
    setRequestStatus("idle");
    setRequestMessage("");
  };

  const submitConnectionRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedConnection) return;

    setRequestStatus("sending");
    setRequestMessage("Sending your private connection request...");

    try {
      const response = await fetch("/api/engage-connection-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...connectionForm,
          targetSubmissionId: selectedConnection.id
        })
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to send your connection request.");
      }

      setConnectionForm(initialConnectionForm);
      setRequestStatus("sent");
      setRequestMessage("Your request has been sent privately to the academy. The admin will review and guide the connection.");
    } catch (error) {
      setRequestStatus("error");
      setRequestMessage(error instanceof Error ? error.message : "Unable to send your connection request.");
    }
  };

  return (
    <PublicShell>
      <main className="bg-[#050505] px-6 pb-20 pt-32 text-white">
        <section className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(214,31,38,0.24),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 shadow-glow sm:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">Engage Network</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">Find skills, support, and involvement through the academy.</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-zinc-300">
            Public profiles protect personal privacy. You can search by occupation, skill, service, or involvement, then request a connection through Kickers Academy.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/engage#engage-form" className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400">
              Join The Network
            </Link>
            <Link href="/engage#support-academy" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10">
              Support The Academy
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-7xl rounded-[1.8rem] border border-white/10 bg-panel p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">Search by skill, occupation, service, or involvement</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Example: doctor, transport, tutor, media, sponsor, mentor..."
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              />
            </label>
            <div className="flex flex-wrap items-end gap-2">
              {engagementTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${activeType === type ? "bg-red-500 text-white" : "border border-white/10 bg-white/5 text-zinc-200"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-7xl">
          {visibleConnections.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleConnections.map((connection, index) => (
                <article key={connection.id} className="rounded-[1.8rem] border border-white/10 bg-panel p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-200">
                      {connection.engagementType}
                    </p>
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{getProfileNumber(index)}</p>
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-white">{getPublicProfileTitle(connection)}</h2>
                  <p className="mt-2 text-sm font-semibold text-red-200">Private academy-mediated contact</p>
                  <p className="mt-4 leading-7 text-zinc-300">{connection.skills}</p>
                  {connection.message ? <p className="mt-4 rounded-2xl bg-black/30 p-4 leading-7 text-zinc-200">{connection.message}</p> : null}
                  <button
                    type="button"
                    onClick={() => openConnectionRequest(connection)}
                    className="mt-5 inline-flex rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                  >
                    Request Private Connection
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-panel p-8 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">No Matches Yet</p>
              <h2 className="mt-3 text-3xl font-black text-white">No approved public profiles match this search.</h2>
              <p className="mx-auto mt-4 max-w-3xl leading-8 text-zinc-300">
                Try another skill or engagement type, or submit your own profile so the network can keep growing.
              </p>
              <Link href="/engage#engage-form" className="mt-6 inline-flex rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400">
                Join The Network
              </Link>
            </div>
          )}
        </section>

        {selectedConnection ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-6" onClick={() => setSelectedConnection(null)}>
            <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#090909] p-6 shadow-glow" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-red-300">Private Connection Request</p>
                  <h2 className="mt-2 text-3xl font-black text-white">{getPublicProfileTitle(selectedConnection)}</h2>
                  <p className="mt-2 text-sm text-zinc-400">The academy will receive this request and guide the connection safely.</p>
                </div>
                <button type="button" onClick={() => setSelectedConnection(null)} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                  Close
                </button>
              </div>

              <form className="mt-6 space-y-4" onSubmit={submitConnectionRequest}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Your Name</span>
                    <input value={connectionForm.requesterName} onChange={(event) => updateConnectionForm("requesterName", event.target.value)} required className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Your Email</span>
                    <input type="email" value={connectionForm.requesterEmail} onChange={(event) => updateConnectionForm("requesterEmail", event.target.value)} required className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm text-zinc-300">Phone / WhatsApp</span>
                    <input value={connectionForm.requesterPhone} onChange={(event) => updateConnectionForm("requesterPhone", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm text-zinc-300">Why do you want this connection?</span>
                    <textarea value={connectionForm.reason} onChange={(event) => updateConnectionForm("reason", event.target.value)} required rows={5} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  </label>
                </div>
                {requestMessage ? (
                  <div className={`rounded-2xl border px-4 py-3 text-sm ${requestStatus === "error" ? "border-red-500/30 bg-red-500/10 text-red-100" : "border-white/10 bg-white/5 text-zinc-100"}`}>
                    {requestMessage}
                  </div>
                ) : null}
                <button type="submit" disabled={requestStatus === "sending"} className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60">
                  Send Private Request
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </main>
    </PublicShell>
  );
}
