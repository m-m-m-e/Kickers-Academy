// app/api/engage-requests/[id]/route.ts
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
      "status", "adminNote", "requesterName", "requesterEmail", "requesterPhone",
      "targetOccupation", "targetEngagementType", "reason"
    ] as const) {
      if (key in body) data[key] = body[key];
    }
    const updated = await prisma.engageConnectionRequest.update({ where: { id }, data });
    return NextResponse.json({ ok: true, request: updated });
  } catch (error) {
    console.error("Failed to update connection request:", error);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
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
    await prisma.engageConnectionRequest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete connection request:", error);
    return NextResponse.json({ error: "Failed to delete request" }, { status: 500 });
  }
}