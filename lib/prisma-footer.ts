import { prisma } from "@/lib/prisma";

export async function getFooterContent() {
  return prisma.footerContent.findFirst();
}

export async function updateFooterContent(
  id: string,
  data: Partial<{
    brandName: string;
    badgeLabel: string;
    badgeImage: string;
    description: string;
    location: string;
    email: string;
    whatsapp: string;
    phone: string;
  }>
) {
  return prisma.footerContent.update({
    where: { id },
    data
  });
}

export async function getFooterLinks() {
  return prisma.footerLink.findMany({
    orderBy: { order: "asc" }
  });
}

export async function createFooterLink(data: { label: string; href: string }) {
  const maxOrder = await prisma.footerLink.findFirst({
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.footerLink.create({
    data: {
      ...data,
      order: (maxOrder?.order ?? 0) + 1
    }
  });
}

export async function updateFooterLink(
  id: string,
  data: Partial<{
    label: string;
    href: string;
  }>
) {
  return prisma.footerLink.update({
    where: { id },
    data
  });
}

export async function deleteFooterLink(id: string) {
  return prisma.footerLink.delete({ where: { id } });
}

export async function getFooterSocials() {
  return prisma.footerSocial.findMany({
    orderBy: { order: "asc" }
  });
}

export async function createFooterSocial(data: {
  label: string;
  href: string;
  icon: string;
}) {
  const maxOrder = await prisma.footerSocial.findFirst({
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.footerSocial.create({
    data: {
      ...data,
      order: (maxOrder?.order ?? 0) + 1
    }
  });
}

export async function updateFooterSocial(
  id: string,
  data: Partial<{
    label: string;
    href: string;
    icon: string;
  }>
) {
  return prisma.footerSocial.update({
    where: { id },
    data
  });
}

export async function deleteFooterSocial(id: string) {
  return prisma.footerSocial.delete({ where: { id } });
}

export async function getFooterBrands() {
  return prisma.footerBrand.findMany({
    orderBy: { order: "asc" }
  });
}

export async function createFooterBrand(data: {
  label: string;
  href: string;
  kind: "sponsor" | "partner";
  badgeImage?: string;
}) {
  const maxOrder = await prisma.footerBrand.findFirst({
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.footerBrand.create({
    data: {
      ...data,
      badgeImage: data.badgeImage ?? "",
      order: (maxOrder?.order ?? 0) + 1
    }
  });
}

export async function updateFooterBrand(
  id: string,
  data: Partial<{
    label: string;
    href: string;
    kind: "sponsor" | "partner";
    badgeImage: string;
  }>
) {
  return prisma.footerBrand.update({
    where: { id },
    data
  });
}

export async function deleteFooterBrand(id: string) {
  return prisma.footerBrand.delete({ where: { id } });
}
