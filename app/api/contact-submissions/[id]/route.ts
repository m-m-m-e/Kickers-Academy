// app/api/contact-submissions/[id]/route.ts
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
    const updated = await prisma.contactSubmission.update({ where: { id }, data });
    return NextResponse.json({ ok: true, submission: updated });
  } catch (error) {
    console.error("Failed to update contact submission:", error);
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
    await prisma.contactSubmission.update({ where: { id }, data: { status: "archived" } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to archive contact submission:", error);
    return NextResponse.json({ error: "Failed to archive submission" }, { status: 500 });
  }
}