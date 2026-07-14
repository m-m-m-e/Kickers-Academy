// app/api/support-submissions/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import type { SupportSubmission, SupportSubmissionStatus } from "@/lib/home-content";
import { requireAdminSession } from "@/lib/require-admin-session";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(0, Number(searchParams.get("page") ?? 0));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? PAGE_SIZE)));

  const [items, total] = await Promise.all([
    prisma.supportSubmission.findMany({ orderBy: { submittedAt: "desc" }, skip: page * pageSize, take: pageSize }),
    prisma.supportSubmission.count()
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await prisma.supportSubmission.create({
      data: {
        name: body.name ?? "",
        email: body.email ?? "",
        phone: body.phone ?? "",
        supportType: body.supportType ?? "",
        supportDetails: body.supportDetails ?? "",
        preferredPaymentStream: body.preferredPaymentStream ?? "",
        amount: body.amount ?? ""
      }
    });

    const submission: SupportSubmission = {
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      supportType: created.supportType,
      supportDetails: created.supportDetails,
      preferredPaymentStream: created.preferredPaymentStream,
      amount: created.amount,
      status: (created.status as SupportSubmissionStatus | undefined) ?? "new",
      submittedAt: created.submittedAt.toISOString(),
      adminNote: created.adminNote ?? ""
    };

    const content = await loadContentStore();
    await saveContentStore({
      ...content,
      supportSubmissions: [submission, ...content.supportSubmissions]
    });

    return NextResponse.json({ ok: true, submission });
  } catch (error) {
    console.error("Failed to create support submission:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}