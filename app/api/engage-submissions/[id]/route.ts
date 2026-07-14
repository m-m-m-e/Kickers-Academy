// app/api/engage-submissions/[id]/route.ts
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
    for (const key of [
      "status", "adminNote", "name", "email", "phone", "engagementType", "occupation", "skills", "message"
    ] as const) {
      if (key in body) data[key] = body[key];
    }
    const updated = await prisma.engageSubmission.update({ where: { id }, data });
    return NextResponse.json({ ok: true, submission: updated });
  } catch (error) {
    console.error("Failed to update engage submission:", error);
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
    await prisma.engageSubmission.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete engage submission:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}