import { prisma } from "@/lib/prisma";

export async function getAllGalleries() {
  return prisma.galleryCategory.findMany({
    include: { items: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" }
  });
}

export async function getGallery(slug: string) {
  return prisma.galleryCategory.findUnique({
    where: { slug },
    include: { items: { orderBy: { order: "asc" } } }
  });
}

export async function createGallery(data: {
  slug: string;
  title: string;
  description: string;
  image: string;
  featured?: boolean;
}) {
  const maxOrder = await prisma.galleryCategory.findFirst({
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.galleryCategory.create({
    data: {
      ...data,
      featured: data.featured || false,
      order: (maxOrder?.order ?? 0) + 1
    },
    include: { items: true }
  });
}

export async function updateGallery(
  id: string,
  data: Partial<{
    slug: string;
    title: string;
    description: string;
    image: string;
    featured: boolean;
  }>
) {
  return prisma.galleryCategory.update({
    where: { id },
    data,
    include: { items: { orderBy: { order: "asc" } } }
  });
}

export async function deleteGallery(id: string) {
  return prisma.galleryCategory.delete({ where: { id } });
}

export async function createGalleryMedia(
  categoryId: string,
  data: {
    title: string;
    description: string;
    mediaType: "image" | "video";
    src: string;
    thumbnail: string;
  }
) {
  const maxOrder = await prisma.galleryMedia.findFirst({
    where: { categoryId },
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.galleryMedia.create({
    data: {
      categoryId,
      ...data,
      order: (maxOrder?.order ?? 0) + 1
    }
  });
}

export async function updateGalleryMedia(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    mediaType: "image" | "video";
    src: string;
    thumbnail: string;
  }>
) {
  return prisma.galleryMedia.update({
    where: { id },
    data
  });
}

export async function deleteGalleryMedia(id: string) {
  return prisma.galleryMedia.delete({ where: { id } });
}
