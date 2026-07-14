import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/mp4",
  "audio/x-m4a"
]);

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
  ".mp4",
  ".webm",
  ".ogg",
  ".ogv",
  ".mov",
  ".mp3",
  ".wav",
  ".aac",
  ".m4a"
]);

export type MediaStorageResult = {
  name: string;
  url: string;
  provider: "blob" | "local";
  contentType: string;
  size: number;
};

export function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9._-]/gi, "-").replace(/-+/g, "-").toLowerCase();
}

export function getMediaUploadDirectory() {
  return path.join(process.cwd(), "public", "uploads", "media");
}

export function isAllowedMedia(fileName: string, mimeType: string) {
  const extension = path.extname(fileName).toLowerCase();
  const normalizedMimeType = mimeType.toLowerCase();
  return allowedExtensions.has(extension) && allowedMimeTypes.has(normalizedMimeType);
}

export async function storeMedia(file: File, originalName: string): Promise<MediaStorageResult> {
  const extension = path.extname(originalName).toLowerCase();
  const contentType = file.type || "application/octet-stream";
  const safeName = sanitizeFileName(originalName || `media${extension}`);
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

  const uploadDirectory = getMediaUploadDirectory();
  await mkdir(uploadDirectory, { recursive: true });
  const storedPath = path.join(uploadDirectory, storedName);
  await writeFile(storedPath, bytes);

  return {
    name: storedName,
    url: `/uploads/media/${encodeURIComponent(storedName)}`,
    provider: "local",
    contentType,
    size: bytes.length
  };
}
