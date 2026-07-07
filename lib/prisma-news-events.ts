import { prisma } from "@/lib/prisma";

export async function getAllNewsEvents() {
  return prisma.newsEvent.findMany({
    orderBy: { publishedAt: "desc" }
  });
}

export async function getNewsEvent(slug: string) {
  return prisma.newsEvent.findUnique({
    where: { slug }
  });
}

export async function createNewsEvent(data: {
  slug: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  kind: "news" | "event";
  featured?: boolean;
  publishedAt: Date;
}) {
  const maxOrder = await prisma.newsEvent.findFirst({
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.newsEvent.create({
    data: {
      ...data,
      featured: data.featured || false,
      order: (maxOrder?.order ?? 0) + 1
    }
  });
}

export async function updateNewsEvent(
  id: string,
  data: Partial<{
    slug: string;
    title: string;
    description: string;
    content: string;
    image: string;
    kind: "news" | "event";
    featured: boolean;
    publishedAt: Date;
  }>
) {
  return prisma.newsEvent.update({
    where: { id },
    data
  });
}

export async function deleteNewsEvent(id: string) {
  return prisma.newsEvent.delete({ where: { id } });
}

export async function getNewsByKind(kind: "news" | "event") {
  return prisma.newsEvent.findMany({
    where: { kind },
    orderBy: { publishedAt: "desc" }
  });
}

export async function getFeaturedNewsEvents(limit: number = 5) {
  return prisma.newsEvent.findMany({
    where: { featured: true },
    orderBy: { publishedAt: "desc" },
    take: limit
  });
}
