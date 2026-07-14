import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-auth";
import { isAllowedImage, storeImage } from "@/lib/image-storage";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image was uploaded." }, { status: 400 });
  }

  if (!isAllowedImage(file.name, file.type || "application/octet-stream")) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }

  try {
    const stored = await storeImage(file, file.name);

    return NextResponse.json({
      name: stored.name,
      url: stored.url,
      provider: stored.provider,
      contentType: stored.contentType,
      size: stored.size
    });
  } catch (error) {
    console.error("Failed to upload image:", error);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
