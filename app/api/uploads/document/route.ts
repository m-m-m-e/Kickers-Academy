import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-auth";
import {
  allowedExtensions,
  allowedMimeTypes,
  getMimeType,
  isAllowedDocument,
  readDocumentBytes,
  storeDocument
} from "@/lib/document-storage";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name") ?? "";
  const shouldDownload = request.nextUrl.searchParams.get("download") === "1";

  if (!name) {
    return NextResponse.json({ error: "Invalid document." }, { status: 400 });
  }

  try {
    const document = await readDocumentBytes(name);

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const extension = document.safeName.includes(".")
      ? "." + document.safeName.split(".").pop()?.toLowerCase()
      : "";

    return new Response(document.bytes, {
      headers: {
        "Content-Type": document.contentType || getMimeType(extension),
        "Content-Disposition": `${shouldDownload ? "attachment" : "inline"}; filename="${document.safeName}"`,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No document was uploaded." }, { status: 400 });
  }

  if (!isAllowedDocument(file.name, file.type || "application/octet-stream")) {
    return NextResponse.json({ error: "Only PDF documents are allowed." }, { status: 400 });
  }

  const stored = await storeDocument(file, file.name);

  return NextResponse.json({
    name: file.name,
    url: stored.url,
    provider: stored.provider,
    contentType: stored.contentType,
    size: stored.size
  });
}

