import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-auth";
import { isAllowedMedia, storeMedia } from "@/lib/media-storage";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }

  if (!isAllowedMedia(file.name, file.type || "application/octet-stream")) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  try {
    const stored = await storeMedia(file, file.name);
    return NextResponse.json({
      name: stored.name,
      url: stored.url,
      provider: stored.provider,
      contentType: stored.contentType,
      size: stored.size
    });
  } catch (error) {
    console.error("Failed to upload media:", error);
    return NextResponse.json({ error: "Failed to upload media." }, { status: 500 });
  }
}
