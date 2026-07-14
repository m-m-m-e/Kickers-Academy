// app/api/feedback-submissions/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import type { FeedbackSubmission, FeedbackSubmissionStatus } from "@/lib/home-content";
import { requireAdminSession } from "@/lib/require-admin-session";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(0, Number(searchParams.get("page") ?? 0));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? PAGE_SIZE)));

  const [items, total] = await Promise.all([
    prisma.feedbackSubmission.findMany({ orderBy: { submittedAt: "desc" }, skip: page * pageSize, take: pageSize }),
    prisma.feedbackSubmission.count()
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rating = Number.isFinite(body.rating) ? Math.min(5, Math.max(1, Math.round(body.rating))) : 5;
    const created = await prisma.feedbackSubmission.create({
      data: { name: body.name ?? "", message: body.message ?? "", rating }
    });

    const submission: FeedbackSubmission = {
      id: created.id,
      name: created.name,
      message: created.message,
      rating: created.rating,
      status: (created.status as FeedbackSubmissionStatus | undefined) ?? "pending",
      submittedAt: created.submittedAt.toISOString(),
      reviewedAt: created.reviewedAt?.toISOString(),
      adminNote: created.adminNote ?? ""
    };

    const content = await loadContentStore();
    await saveContentStore({
      ...content,
      feedbackSubmissions: [submission, ...content.feedbackSubmissions]
    });

    return NextResponse.json({ ok: true, submission });
  } catch (error) {
    console.error("Failed to create feedback submission:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}