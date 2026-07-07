import { prisma } from "@/lib/prisma";

export async function getHomeContent() {
  const [heroSlides, aboutSections, footerContent] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
    prisma.aboutSection.findMany({ orderBy: { order: "asc" } }),
    prisma.footerContent.findFirst()
  ]);

  return {
    heroSlides: heroSlides.map((slide) => ({
      id: slide.id,
      title: slide.title,
      description: slide.description,
      image: slide.image
    })),
    aboutSections: aboutSections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      image: section.image,
      slug: section.slug
    })),
        footerContent: footerContent
      ? {
          brandName: footerContent.brandName,
          badgeLabel: footerContent.badgeLabel,
          badgeImage: (footerContent as any).badgeImage ?? "",
          description: footerContent.description,
          location: footerContent.location,
          email: footerContent.email,
          whatsapp: footerContent.whatsapp,
          phone: footerContent.phone
        }
      : null
  };
}

export async function createHeroSlide(data: {
  title: string;
  description: string;
  image: string;
}) {
  const maxOrder = await prisma.heroSlide.findFirst({
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.heroSlide.create({
    data: {
      ...data,
      order: (maxOrder?.order ?? 0) + 1
    }
  });
}

export async function updateHeroSlide(
  id: string,
  data: Partial<{ title: string; description: string; image: string }>
) {
  return prisma.heroSlide.update({
    where: { id },
    data
  });
}

export async function deleteHeroSlide(id: string) {
  return prisma.heroSlide.delete({ where: { id } });
}

export async function createAboutSection(data: {
  slug: string;
  title: string;
  description: string;
  image: string;
}) {
  const maxOrder = await prisma.aboutSection.findFirst({
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.aboutSection.create({
    data: {
      ...data,
      order: (maxOrder?.order ?? 0) + 1
    }
  });
}

export async function updateAboutSection(
  id: string,
  data: Partial<{
    slug: string;
    title: string;
    description: string;
    image: string;
  }>
) {
  return prisma.aboutSection.update({
    where: { id },
    data
  });
}

export async function deleteAboutSection(id: string) {
  return prisma.aboutSection.delete({ where: { id } });
}
