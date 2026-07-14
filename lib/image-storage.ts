import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif"
]);

const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"]);

export type ImageStorageResult = {
  name: string;
  url: string;
  provider: "blob" | "local";
  contentType: string;
  size: number;
};

export function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9._-]/gi, "-").replace(/-+/g, "-").toLowerCase();
}

export function getImageUploadDirectory() {
  return path.join(process.cwd(), "public", "uploads", "images");
}

export function isAllowedImage(fileName: string, mimeType: string) {
  const extension = path.extname(fileName).toLowerCase();
  return allowedImageExtensions.has(extension) && allowedImageMimeTypes.has(mimeType || "application/octet-stream");
}

export async function storeImage(file: File, originalName: string): Promise<ImageStorageResult> {
  const extension = path.extname(originalName).toLowerCase();
  const contentType = file.type || "application/octet-stream";
  const safeName = sanitizeFileName(originalName || `image${extension}`);
  const storedName = `${Date.now()}-${randomUUID()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (blobToken) {
    const blob = await put(storedName, bytes, {
      access: "public",
      addRandomSuffix: false,
      contentType
    });

    return {
      name: storedName,
      url: blob.url,
      provider: "blob",
      contentType,
      size: bytes.length
    };
  }

  const uploadDirectory = getImageUploadDirectory();
  await mkdir(uploadDirectory, { recursive: true });
  const storedPath = path.join(uploadDirectory, storedName);
  await writeFile(storedPath, bytes);

  return {
    name: storedName,
    url: `/uploads/images/${encodeURIComponent(storedName)}`,
    provider: "local",
    contentType,
    size: bytes.length
  };
}
