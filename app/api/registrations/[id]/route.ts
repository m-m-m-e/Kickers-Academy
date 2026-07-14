// app/api/registrations/[id]/route.ts
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

    // Whitelist editable fields only.
    for (const key of [
      "status", "adminNote", "medicalInformation", "photoPublicationConsent",
      "address", "residence"
    ] as const) {
      if (key in body) data[key] = body[key];
    }
    if ("status" in body && body.status !== "pending") data.reviewedAt = new Date();
    if ("whatsappConfirmedAt" in body) data.whatsappConfirmedAt = new Date(body.whatsappConfirmedAt);
    if ("emailConfirmedAt" in body) data.emailConfirmedAt = new Date(body.emailConfirmedAt);

    const updated = await prisma.joinRegistration.update({ where: { id }, data });
    return NextResponse.json({ ok: true, registration: updated });
  } catch (error) {
    console.error("Failed to update registration:", error);
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
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
    await prisma.joinRegistration.update({ where: { id }, data: { status: "deleted" } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete registration:", error);
    return NextResponse.json({ error: "Failed to delete registration" }, { status: 500 });
  }
}