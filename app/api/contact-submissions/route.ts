import { NextResponse } from "next/server";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import type { ContactSubmission } from "@/lib/home-content";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactSubmission>;
    const name = clean(body.name);
    const email = clean(body.email);
    const subject = clean(body.subject);
    const message = clean(body.message);

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please provide your name, email, subject, and message." },
        { status: 400 }
      );
    }

    const content = await loadContentStore();
    const submission: ContactSubmission = {
      id: `contact-${Date.now()}`,
      name,
      email,
      phone: clean(body.phone),
      subject,
      message,
      status: "new",
      submittedAt: new Date().toISOString(),
      adminNote: ""
    };

    const saved = await saveContentStore({
      ...content,
      contactSubmissions: [submission, ...content.contactSubmissions]
    });

    return NextResponse.json({ submission, total: saved.contactSubmissions.length });
  } catch {
    return NextResponse.json({ error: "Unable to save your contact message right now." }, { status: 500 });
  }
}
