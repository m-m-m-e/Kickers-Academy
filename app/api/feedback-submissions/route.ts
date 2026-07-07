import { NextResponse } from "next/server";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import type { FeedbackSubmission } from "@/lib/home-content";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseRating(value: unknown) {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return 0;
  return Math.max(1, Math.min(5, Math.round(rating)));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = clean(body.message);
    const rating = parseRating(body.rating);
    const name = clean(body.name);

    if (!message || rating < 1) {
      return NextResponse.json(
        { error: "Please provide your feedback and a rating from 1 to 5." },
        { status: 400 }
      );
    }

    const content = await loadContentStore();
    const feedback: FeedbackSubmission = {
      id: `feedback-${Date.now()}`,
      name,
      message,
      rating,
      status: "pending",
      submittedAt: new Date().toISOString(),
      adminNote: ""
    };

    const saved = await saveContentStore({
      ...content,
      feedbackSubmissions: [feedback, ...content.feedbackSubmissions]
    });

    return NextResponse.json({ ok: true, feedback, total: saved.feedbackSubmissions.length }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save your feedback right now." }, { status: 500 });
  }
}
