import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import { prisma } from "@/lib/prisma";
import type { JoinRegistration, JoinRegistrationStatus } from "@/lib/home-content";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidStatus(value: unknown): value is JoinRegistrationStatus {
  return value === "pending" || value === "approved" || value === "rejected" || value === "deleted";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const created = await prisma.joinRegistration.create({
      data: {
        playerName: clean(body.playerName),
        dateOfBirth: clean(body.dateOfBirth),
        guardianName: clean(body.guardianName),
        guardianEmail: clean(body.guardianEmail),
        guardianPhone: clean(body.guardianPhone),
        emergencyContact: clean(body.emergencyContact),
        address: clean(body.address),
        residence: clean(body.residence),
        medicalInformation: clean(body.medicalInformation),
        consent: Boolean(body.consent),
        photoPublicationConsent: body.photoPublicationConsent === "accepted" ? "accepted" : "denied",
        status: "pending"
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

    const requiredFields = [
      registration.playerName,
      registration.dateOfBirth,
      registration.guardianName,
      registration.guardianEmail,
      registration.guardianPhone,
      registration.emergencyContact,
      registration.residence
    ];

    if (requiredFields.some((field) => !field) || !registration.consent) {
      return NextResponse.json({ error: "Please complete the required registration details." }, { status: 400 });
    }

    const content = await loadContentStore();
    const saved = await saveContentStore({
      ...content,
      joinRegistrations: [registration, ...content.joinRegistrations]
    });

    return NextResponse.json({ ok: true, registration, content: saved }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit join registration:", error);
    return NextResponse.json({ error: "Failed to submit registration" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("bru_admin_session")?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = clean(body.id);

    if (!id) {
      return NextResponse.json({ error: "Missing registration id" }, { status: 400 });
    }

    const content = await loadContentStore();
    const nextRegistrations = content.joinRegistrations.map((registration) => {
      if (registration.id !== id) {
        return registration;
      }

      const nextStatus = isValidStatus(body.status) ? body.status : registration.status;
      const now = new Date().toISOString();

      return {
        ...registration,
        status: nextStatus,
        reviewedAt: nextStatus !== "pending" ? now : registration.reviewedAt,
        adminNote: clean(body.adminNote) || registration.adminNote || "",
        whatsappConfirmedAt: body.whatsappConfirmed ? now : registration.whatsappConfirmedAt,
        emailConfirmedAt: body.emailConfirmed ? now : registration.emailConfirmedAt
      };
    });

    const saved = await saveContentStore({
      ...content,
      joinRegistrations: nextRegistrations
    });

    return NextResponse.json({ ok: true, content: saved });
  } catch (error) {
    console.error("Failed to update join registration:", error);
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
  }
}
