export async function uploadFile(file: File, route: string) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(route, {
    method: "POST",
    body: formData
  });

  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    throw new Error(data.error || "Unable to upload file.");
  }

  return data.url;
}

export async function uploadImage(file: File) {
  return uploadFile(file, "/api/uploads/image");
}

export async function uploadMedia(file: File) {
  return uploadFile(file, "/api/uploads/media");
}
