// app/api/contact-submissions/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import type { ContactSubmission, ContactSubmissionStatus } from "@/lib/home-content";
import { requireAdminSession } from "@/lib/require-admin-session";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(0, Number(searchParams.get("page") ?? 0));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? PAGE_SIZE)));

  const [items, total] = await Promise.all([
    prisma.contactSubmission.findMany({ orderBy: { submittedAt: "desc" }, skip: page * pageSize, take: pageSize }),
    prisma.contactSubmission.count()
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await prisma.contactSubmission.create({
      data: {
        name: body.name ?? "",
        email: body.email ?? "",
        phone: body.phone ?? "",
        subject: body.subject ?? "",
        message: body.message ?? ""
      }
    });

    const submission: ContactSubmission = {
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      subject: created.subject,
      message: created.message,
      status: (created.status as ContactSubmissionStatus | undefined) ?? "new",
      submittedAt: created.submittedAt.toISOString(),
      adminNote: created.adminNote ?? ""
    };

    const content = await loadContentStore();
    await saveContentStore({
      ...content,
      contactSubmissions: [submission, ...content.contactSubmissions]
    });

    return NextResponse.json({ ok: true, submission });
  } catch (error) {
    console.error("Failed to create contact submission:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}