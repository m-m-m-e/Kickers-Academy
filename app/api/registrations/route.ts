// app/api/registrations/route.ts
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
    prisma.joinRegistration.findMany({ orderBy: { submittedAt: "desc" }, skip: page * pageSize, take: pageSize }),
    prisma.joinRegistration.count()
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// Public — the join form submits here without admin auth.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const created = await prisma.joinRegistration.create({
      data: {
        playerName: body.playerName ?? "",
        dateOfBirth: body.dateOfBirth ?? "",
        guardianName: body.guardianName ?? "",
        guardianEmail: body.guardianEmail ?? "",
        guardianPhone: body.guardianPhone ?? "",
        emergencyContact: body.emergencyContact ?? "",
        address: body.address ?? "",
        residence: body.residence ?? "",
        medicalInformation: body.medicalInformation ?? "",
        consent: Boolean(body.consent),
        photoPublicationConsent: body.photoPublicationConsent === "accepted" ? "accepted" : "denied"
      }
    });

    return NextResponse.json({ ok: true, registration: created });
  } catch (error) {
    console.error("Failed to create registration:", error);
    return NextResponse.json({ error: "Failed to create registration" }, { status: 500 });
  }
}