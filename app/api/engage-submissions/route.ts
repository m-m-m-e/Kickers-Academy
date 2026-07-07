import { NextResponse } from "next/server";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import type { EngageSubmission } from "@/lib/home-content";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<EngageSubmission>;
    const name = clean(body.name);
    const email = clean(body.email);
    const engagementType = clean(body.engagementType);
    const skills = clean(body.skills);
    const message = clean(body.message);

    if (!name || !email || !engagementType || (!skills && !message)) {
      return NextResponse.json(
        { error: "Please provide your name, email, engagement type, and either skills or a message." },
        { status: 400 }
      );
    }

    const content = await loadContentStore();
    const submission: EngageSubmission = {
      id: `engage-${Date.now()}`,
      name,
      email,
      phone: clean(body.phone),
      engagementType,
      occupation: clean(body.occupation),
      skills,
      message,
      status: "new",
      submittedAt: new Date().toISOString(),
      adminNote: ""
    };

    const saved = await saveContentStore({
      ...content,
      engageSubmissions: [submission, ...content.engageSubmissions]
    });

    return NextResponse.json({ submission, total: saved.engageSubmissions.length });
  } catch {
    return NextResponse.json({ error: "Unable to save your engagement message right now." }, { status: 500 });
  }
}
