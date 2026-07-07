import { prisma } from "@/lib/prisma";

export async function getAllPrograms() {
  return prisma.programGroup.findMany({
    include: { subSections: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" }
  });
}

export async function getProgram(slug: string) {
  return prisma.programGroup.findUnique({
    where: { slug },
    include: { subSections: { orderBy: { order: "asc" } } }
  });
}

export async function createProgram(data: {
  slug: string;
  ageGroup: string;
  title: string;
  description: string;
  image: string;
  featured?: boolean;
}) {
  const maxOrder = await prisma.programGroup.findFirst({
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.programGroup.create({
    data: {
      ...data,
      featured: data.featured || false,
      order: (maxOrder?.order ?? 0) + 1
    },
    include: { subSections: true }
  });
}

export async function updateProgram(
  id: string,
  data: Partial<{
    slug: string;
    ageGroup: string;
    title: string;
    description: string;
    image: string;
    featured: boolean;
  }>
) {
  return prisma.programGroup.update({
    where: { id },
    data,
    include: { subSections: { orderBy: { order: "asc" } } }
  });
}

export async function deleteProgram(id: string) {
  return prisma.programGroup.delete({ where: { id } });
}

export async function createProgramSubSection(
  programGroupId: string,
  data: {
    title: string;
    description: string;
  }
) {
  const maxOrder = await prisma.programSubSection.findFirst({
    where: { programGroupId },
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.programSubSection.create({
    data: {
      programGroupId,
      ...data,
      order: (maxOrder?.order ?? 0) + 1
    }
  });
}

export async function updateProgramSubSection(
  id: string,
  data: Partial<{
    title: string;
    description: string;
  }>
) {
  return prisma.programSubSection.update({
    where: { id },
    data
  });
}

export async function deleteProgramSubSection(id: string) {
  return prisma.programSubSection.delete({ where: { id } });
}
