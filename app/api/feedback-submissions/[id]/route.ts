// app/api/feedback-submissions/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function PATCH(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params; // Await the params
    const body = await request.json();
    const data: Record<string, unknown> = {};
    for (const key of ["status", "adminNote"] as const) {
      if (key in body) data[key] = body[key];
    }
    if ("status" in body) data.reviewedAt = new Date();

    const updated = await prisma.feedbackSubmission.update({ where: { id }, data });
    return NextResponse.json({ ok: true, submission: updated });
  } catch (error) {
    console.error("Failed to update feedback submission:", error);
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params; // Await the params
    await prisma.feedbackSubmission.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete feedback submission:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}