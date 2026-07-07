import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { defaultHomeContent, normalizeHomeContent, type HomeContentState, type JoinPageContent, type JoinRegistration } from "@/lib/home-content";
import { loadSiteContentRow, saveSiteContentRow } from "@/lib/site-content-store";

const CONTENT_KEY = "site";

async function loadContent(): Promise<HomeContentState> {
  const row = await loadSiteContentRow(CONTENT_KEY);

  if (!row) {
    return normalizeHomeContent(defaultHomeContent);
  }

  try {
    return normalizeHomeContent(JSON.parse(row.payload) as HomeContentState);
  } catch {
    return normalizeHomeContent(defaultHomeContent);
  }
}

async function saveContent(content: HomeContentState) {
  const normalized = normalizeHomeContent(content);

  await saveSiteContentRow(CONTENT_KEY, JSON.stringify(normalized));

  return normalized;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMultiline(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function getAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

function getProgramFromDateOfBirth(dateOfBirth: string) {
  const age = getAge(dateOfBirth);

  if (age === null) {
    return "Age group to be confirmed";
  }

  if (age <= 7) return "Under 7";
  if (age <= 9) return "Under 9";
  if (age <= 11) return "Under 11";
  if (age <= 13) return "Under 13";
  if (age <= 15) return "Under 15";
  return "Under 17";
}

function renderDetail(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;color:#6b7280;font-size:13px;width:42%">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:700">${escapeHtml(value || "Not provided")}</td>
    </tr>
  `;
}

function makeConfirmationMessage(registration: JoinRegistration, joinPage: JoinPageContent) {
  return `Hello ${registration.guardianName}, ${joinPage.emailIntro}`;
}

function makeEmailHtml(content: HomeContentState, registration: JoinRegistration, message: string) {
  const footer = content.footerContent;
  const joinPage = content.joinPage;
  const program = getProgramFromDateOfBirth(registration.dateOfBirth);
  const age = getAge(registration.dateOfBirth);

  return `
    <div style="margin:0;padding:0;background:#0b0b0b;font-family:Arial,sans-serif;color:#111827">
      <div style="max-width:720px;margin:0 auto;padding:28px 16px">
        <div style="overflow:hidden;border-radius:28px;background:#ffffff">
          <div style="background:linear-gradient(135deg,#111111,#dc2626);padding:30px;color:#ffffff">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="vertical-align:middle;text-align:left">
                  <p style="margin:0;font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#fecaca">${escapeHtml(footer.badgeLabel || "Official Academy")}</p>
                  <h1 style="margin:8px 0 0;font-size:28px;line-height:1.15;color:#ffffff !important">${escapeHtml(footer.brandName || "Kickers Academy")}</h1>
                </td>
              </tr>
            </table>
            <h2 style="margin:34px 0 0;font-size:34px;line-height:1.08">${escapeHtml(joinPage.emailTitle)}</h2>
            <p style="margin:14px 0 0;font-size:16px;line-height:1.7;color:#fee2e2">${escapeHtml(message)}</p>
          </div>

          <div style="padding:30px">
            <div style="border-radius:22px;background:#f9fafb;border:1px solid #e5e7eb;padding:22px">
              <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#dc2626;font-weight:800">Enrolled Program</p>
              <h3 style="margin:10px 0 0;font-size:26px;color:#111827">${escapeHtml(program)}</h3>
              <p style="margin:8px 0 0;color:#4b5563;line-height:1.7">${escapeHtml(joinPage.emailProgramNote)}</p>
              <p style="margin:10px 0 0;color:#6b7280;font-size:13px">Age calculated from date of birth: ${age === null ? "To be confirmed" : `${age} years old`}</p>
            </div>

            <div style="margin-top:24px">
              <h3 style="margin:0 0 12px;font-size:20px;color:#111827">Registration Information</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb">
                ${renderDetail("Player full name", registration.playerName)}
                ${renderDetail("Date of birth", registration.dateOfBirth)}
                ${renderDetail("Parent / guardian", registration.guardianName)}
                ${renderDetail("Guardian email", registration.guardianEmail)}
                ${renderDetail("Guardian phone", registration.guardianPhone)}
                ${renderDetail("Emergency contact", registration.emergencyContact)}
                ${renderDetail("Address", registration.address)}
                ${renderDetail("Place of residence", registration.residence)}
                ${renderDetail("Medical information", registration.medicalInformation)}
                ${renderDetail("Photo publication consent", registration.photoPublicationConsent === "accepted" ? "Accepted" : "Denied")}
              </table>
            </div>

            <div style="margin-top:24px;display:block;border-radius:22px;background:#111827;color:#ffffff;padding:22px">
              <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#fecaca;font-weight:800">Training Ground & Contact</p>
              <p style="margin:12px 0 0;line-height:1.7;color:#e5e7eb">${escapeHtml(joinPage.emailTrainingGroundNote)}</p>
              <p style="margin:16px 0 0;color:#ffffff"><strong>Training ground:</strong> ${escapeHtml(footer.location)}</p>
              <p style="margin:8px 0 0;color:#ffffff"><strong>Email:</strong> ${escapeHtml(footer.email)}</p>
              <p style="margin:8px 0 0;color:#ffffff"><strong>WhatsApp:</strong> ${escapeHtml(footer.whatsapp)}</p>
              <p style="margin:8px 0 0;color:#ffffff"><strong>Phone:</strong> ${escapeHtml(footer.phone)}</p>
            </div>

            <div style="margin-top:24px;border-radius:22px;background:#fff7ed;border:1px solid #fed7aa;padding:22px">
              <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#c2410c;font-weight:800">Jerseys & Kit</p>
              <p style="margin:12px 0 0;line-height:1.7;color:#7c2d12">${escapeHtml(joinPage.emailKitNote)}</p>
            </div>

            <p style="margin:26px 0 0;line-height:1.7;color:#374151">${formatMultiline(joinPage.emailSignOff)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getEmailDomain(email: string) {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

function isPublicMailbox(email: string) {
  const domain = getEmailDomain(email);
  return ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "aol.com"].includes(domain);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("bru_admin_session")?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured. Add RESEND_API_KEY to the environment first." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as { id?: string };
    const id = typeof body.id === "string" ? body.id.trim() : "";

    if (!id) {
      return NextResponse.json({ error: "Missing registration id" }, { status: 400 });
    }

    const content = await loadContent();
    const registration = content.joinRegistrations.find((item) => item.id === id);

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (!registration.guardianEmail) {
      return NextResponse.json({ error: "This registration does not have a guardian email." }, { status: 400 });
    }

    const configuredFrom = process.env.EMAIL_FROM?.trim() || "";
    const fallbackFrom = content.footerContent.email || "onboarding@resend.dev";
    const fromEmail = configuredFrom || fallbackFrom;

    if (isPublicMailbox(fromEmail)) {
      return NextResponse.json(
        {
          error:
            "Resend cannot send from Gmail, Yahoo, Outlook, or other public mailbox domains. Set EMAIL_FROM to an address on a verified Resend domain, for example no-reply@yourdomain.com."
        },
        { status: 400 }
      );
    }

    const message = makeConfirmationMessage(registration, content.joinPage);
    const subject = (content.joinPage.emailSubject || "Registration confirmed for {playerName}").replace(
      "{playerName}",
      registration.playerName
    );
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `${content.footerContent.brandName || "Kickers Academy"} <${fromEmail}>`,
        to: [registration.guardianEmail],
        reply_to: content.footerContent.email,
        subject,
        text: message,
        html: makeEmailHtml(content, registration, message)
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText || "Email provider rejected the message." }, { status: 502 });
    }

    const now = new Date().toISOString();
    const updatedRegistrations = content.joinRegistrations.map((item) =>
      item.id === registration.id
        ? {
            ...item,
            status: item.status === "pending" ? "approved" : item.status,
            reviewedAt: item.reviewedAt ?? now,
            emailConfirmedAt: now
          }
        : item
    );

    const saved = await saveContent({
      ...content,
      joinRegistrations: updatedRegistrations
    });
    const updatedRegistration = saved.joinRegistrations.find((item) => item.id === registration.id);

    return NextResponse.json({ ok: true, registration: updatedRegistration });
  } catch (error) {
    console.error("Failed to send registration email:", error);
    return NextResponse.json({ error: "Failed to send registration email" }, { status: 500 });
  }
}
