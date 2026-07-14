// app/api/engage-submissions/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import type { EngageSubmission, EngageSubmissionStatus } from "@/lib/home-content";
import { requireAdminSession } from "@/lib/require-admin-session";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(0, Number(searchParams.get("page") ?? 0));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? PAGE_SIZE)));

  const [items, total] = await Promise.all([
    prisma.engageSubmission.findMany({ orderBy: { submittedAt: "desc" }, skip: page * pageSize, take: pageSize }),
    prisma.engageSubmission.count()
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await prisma.engageSubmission.create({
      data: {
        name: body.name ?? "",
        email: body.email ?? "",
        phone: body.phone ?? "",
        engagementType: body.engagementType ?? "",
        occupation: body.occupation ?? "",
        skills: body.skills ?? "",
        message: body.message ?? ""
      }
    });

    const submission: EngageSubmission = {
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      engagementType: created.engagementType,
      occupation: created.occupation,
      skills: created.skills,
      message: created.message,
      status: (created.status as EngageSubmissionStatus | undefined) ?? "new",
      submittedAt: created.submittedAt.toISOString(),
      adminNote: created.adminNote ?? ""
    };

    const content = await loadContentStore();
    await saveContentStore({
      ...content,
      engageSubmissions: [submission, ...content.engageSubmissions]
    });

    return NextResponse.json({ ok: true, submission });
  } catch (error) {
    console.error("Failed to create engage submission:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}