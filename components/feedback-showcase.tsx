"use client";

import { useEffect, useMemo, useState } from "react";
import type { FeedbackSubmission } from "@/lib/home-content";

const PAGE_SIZE = 5;

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < rating ? "text-yellow-300" : "text-white/20"}>
      ★
    </span>
  ));
}

export function FeedbackShowcase({ submissions }: { submissions: FeedbackSubmission[] }) {
  const approvedSubmissions = useMemo(
    () =>
      [...submissions]
        .filter((submission) => submission.status === "approved")
        .sort(
          (left, right) =>
            new Date(right.reviewedAt || right.submittedAt).getTime() - new Date(left.reviewedAt || left.submittedAt).getTime()
        ),
    [submissions]
  );
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(approvedSubmissions.length / PAGE_SIZE));

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    if (approvedSubmissions.length <= PAGE_SIZE || totalPages <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setPage((current) => (current + 1) % totalPages);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [approvedSubmissions.length, totalPages]);

  const visibleSubmissions = approvedSubmissions.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (!approvedSubmissions.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-red-300">Feedback</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Feedback from our visitors </h2>
      </div>

      <div className="p-0">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {visibleSubmissions.map((submission) => {
            const displayName = submission.name.trim() || "Anonymous";

            return (
              <article key={submission.id} className="flex h-full flex-col justify-between rounded-[1.75rem] border border-white/10 bg-black/15 p-5 backdrop-blur-sm">
                <div>
                  <div className="flex items-center gap-1 text-lg">{renderStars(submission.rating)}</div>
                  <p className="mt-4 text-lg leading-8 text-white">{submission.message}</p>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-white">{displayName}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
