// app/api/registrations/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import { prisma } from "@/lib/prisma";
import type { JoinRegistration, JoinRegistrationStatus } from "@/lib/home-content";
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

    const registration: JoinRegistration = {
      id: created.id,
      playerName: created.playerName,
      dateOfBirth: created.dateOfBirth,
      guardianName: created.guardianName,
      guardianEmail: created.guardianEmail,
      guardianPhone: created.guardianPhone,
      emergencyContact: created.emergencyContact,
      address: created.address,
      residence: created.residence,
      medicalInformation: created.medicalInformation,
      consent: created.consent,
      photoPublicationConsent: created.photoPublicationConsent as "accepted" | "denied",
      status: created.status as JoinRegistrationStatus,
      submittedAt: created.submittedAt.toISOString(),
      reviewedAt: created.reviewedAt?.toISOString(),
      adminNote: created.adminNote ?? "",
      whatsappConfirmedAt: created.whatsappConfirmedAt?.toISOString(),
      emailConfirmedAt: created.emailConfirmedAt?.toISOString()
    };

    const content = await loadContentStore();
    await saveContentStore({
      ...content,
      joinRegistrations: [registration, ...content.joinRegistrations]
    });

    return NextResponse.json({ ok: true, registration });
  } catch (error) {
    console.error("Failed to create registration:", error);
    return NextResponse.json({ error: "Failed to create registration" }, { status: 500 });
  }
}