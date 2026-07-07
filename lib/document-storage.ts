import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

export const allowedMimeTypes = new Set([
  "application/pdf",
  "application/octet-stream"
]);

export const allowedExtensions = new Set([".pdf"]);

export type DocumentStorageResult = {
  name: string;
  url: string;
  provider: "blob" | "local";
  contentType: string;
  size: number;
};

export function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9._-]/gi, "-").replace(/-+/g, "-").toLowerCase();
}

export function getMimeType(extension: string) {
  if (extension === ".pdf") return "application/pdf";
  return "application/octet-stream";
}

export function getUploadDirectory() {
  return path.join(process.cwd(), "public", "uploads", "documents");
}

export function isAllowedDocument(fileName: string, mimeType: string) {
  const extension = path.extname(fileName).toLowerCase();
  return allowedExtensions.has(extension) && allowedMimeTypes.has(mimeType || "application/octet-stream");
}

export async function storeDocument(file: File, originalName: string): Promise<DocumentStorageResult> {
  const extension = path.extname(originalName).toLowerCase();
  const contentType = file.type || getMimeType(extension);
  const safeName = sanitizeFileName(originalName || `document${extension}`);
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

  const uploadDirectory = getUploadDirectory();
  await mkdir(uploadDirectory, { recursive: true });
  const storedPath = path.join(uploadDirectory, storedName);
  await writeFile(storedPath, bytes);

  return {
    name: storedName,
    url: `/api/uploads/document?name=${encodeURIComponent(storedName)}`,
    provider: "local",
    contentType,
    size: bytes.length
  };
}

export async function readDocumentBytes(name: string) {
  const safeName = path.basename(name);
  const extension = path.extname(safeName).toLowerCase();

  if (!safeName || !allowedExtensions.has(extension)) {
    return null;
  }

  if (/^https?:\/\//i.test(name)) {
    const response = await fetch(name);

    if (!response.ok) {
      return null;
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    return {
      bytes,
      contentType: response.headers.get("content-type") || getMimeType(extension),
      safeName
    };
  }

  const filePath = path.join(getUploadDirectory(), safeName);
  const bytes = await readFile(filePath);

  return {
    bytes,
    contentType: getMimeType(extension),
    safeName
  };
}
