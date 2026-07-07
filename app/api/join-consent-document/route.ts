import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "node:path";
import { defaultHomeContent, normalizeHomeContent, type HomeContentState } from "@/lib/home-content";
import { loadSiteContentRow } from "@/lib/site-content-store";

const CONTENT_KEY = "site";

function safeFileName(name: string) {
  return (name || "photo-consent-document").replace(/[^a-z0-9._-]/gi, "-").replace(/-+/g, "-").toLowerCase();
}

function responseFromDataUrl(documentUrl: string, fileName: string, shouldDownload: boolean) {
  const [metadata = "", payload = ""] = documentUrl.split(",");
  const mimeType = metadata.match(/^data:([^;]+)/)?.[1] || "application/octet-stream";
  const isBase64 = metadata.includes(";base64");
  const bytes = isBase64 ? Buffer.from(payload, "base64") : Buffer.from(decodeURIComponent(payload), "utf8");
  const disposition = shouldDownload ? "attachment" : "inline";

  return new Response(bytes, {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `${disposition}; filename="${safeFileName(fileName)}"`
    }
  });
}

async function loadJoinPage() {
  const row = await loadSiteContentRow(CONTENT_KEY);

  if (!row) {
    return defaultHomeContent.joinPage;
  }

  try {
    const parsed = JSON.parse(row.payload) as HomeContentState;
    return normalizeHomeContent(parsed).joinPage;
  } catch {
    return defaultHomeContent.joinPage;
  }
}

export async function GET(request: NextRequest) {
  const joinPage = await loadJoinPage();
  const documentUrl = joinPage.photoConsentDocumentUrl;
  const shouldDownload = request.nextUrl.searchParams.get("download") === "1";

  if (!documentUrl) {
    return NextResponse.redirect(new URL("/join-register/photo-consent", request.url));
  }

  if (documentUrl.startsWith("data:")) {
    return responseFromDataUrl(documentUrl, joinPage.photoConsentDocumentName, shouldDownload);
  }

  if (documentUrl.startsWith("/uploads/documents/")) {
    const name = path.basename(documentUrl);
    return NextResponse.redirect(new URL(`/api/uploads/document?name=${encodeURIComponent(name)}${shouldDownload ? "&download=1" : ""}`, request.url));
  }

  return NextResponse.redirect(new URL(documentUrl, request.url));
}
