// app/api/engage-submissions/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
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
    return NextResponse.json({ ok: true, submission: created });
  } catch (error) {
    console.error("Failed to create engage submission:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}