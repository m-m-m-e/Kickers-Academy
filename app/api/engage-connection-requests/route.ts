import { NextResponse } from "next/server";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import type { EngageConnectionRequest } from "@/lib/home-content";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<EngageConnectionRequest>;
    const targetSubmissionId = clean(body.targetSubmissionId);
    const requesterName = clean(body.requesterName);
    const requesterEmail = clean(body.requesterEmail);
    const reason = clean(body.reason);
    const content = await loadContentStore();
    const target = content.engageSubmissions.find(
      (submission) => submission.id === targetSubmissionId && submission.status === "approved"
    );

    if (!target) {
      return NextResponse.json({ error: "That community connection is not available." }, { status: 404 });
    }

    if (!requesterName || !requesterEmail || !reason) {
      return NextResponse.json(
        { error: "Please provide your name, email, and the reason you want this connection." },
        { status: 400 }
      );
    }

    const connectionRequest: EngageConnectionRequest = {
      id: `connection-${Date.now()}`,
      targetSubmissionId: target.id,
      targetOccupation: target.occupation || "Community member",
      targetEngagementType: target.engagementType,
      requesterName,
      requesterEmail,
      requesterPhone: clean(body.requesterPhone),
      reason,
      status: "new",
      submittedAt: new Date().toISOString(),
      adminNote: ""
    };

    const saved = await saveContentStore({
      ...content,
      engageConnectionRequests: [connectionRequest, ...content.engageConnectionRequests]
    });

    return NextResponse.json({ connectionRequest, total: saved.engageConnectionRequests.length });
  } catch {
    return NextResponse.json({ error: "Unable to send your connection request right now." }, { status: 500 });
  }
}
