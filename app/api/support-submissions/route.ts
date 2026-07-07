import { NextResponse } from "next/server";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import type { SupportSubmission } from "@/lib/home-content";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SupportSubmission>;
    const name = clean(body.name);
    const email = clean(body.email);
    const supportType = clean(body.supportType);

    if (!name || !email || !supportType) {
      return NextResponse.json(
        { error: "Please provide your name, email, and the support option you prefer." },
        { status: 400 }
      );
    }

    const content = await loadContentStore();
    const submission: SupportSubmission = {
      id: `support-${Date.now()}`,
      name,
      email,
      phone: clean(body.phone),
      supportType,
      supportDetails: clean(body.supportDetails),
      preferredPaymentStream: clean(body.preferredPaymentStream) || "To be discussed",
      amount: clean(body.amount),
      status: "new",
      submittedAt: new Date().toISOString(),
      adminNote: ""
    };

    const saved = await saveContentStore({
      ...content,
      supportSubmissions: [submission, ...content.supportSubmissions]
    });

    return NextResponse.json({ submission, total: saved.supportSubmissions.length });
  } catch {
    return NextResponse.json({ error: "Unable to save your support request right now." }, { status: 500 });
  }
}
