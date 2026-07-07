import { prisma } from "@/lib/prisma";
import type { StoreCategory, StoreProduct } from "@/lib/home-content";

export async function getAllStoreCategories() {
  return prisma.storeCategory.findMany({
    include: { products: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" }
  });
}

export async function getStoreCategory(slug: string) {
  return prisma.storeCategory.findUnique({
    where: { slug },
    include: { products: { orderBy: { order: "asc" } } }
  });
}

export async function createStoreCategory(data: {
  slug: string;
  title: string;
  description: string;
  image: string;
  featured?: boolean;
}) {
  const maxOrder = await prisma.storeCategory.findFirst({
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.storeCategory.create({
    data: {
      ...data,
      order: (maxOrder?.order ?? 0) + 1
    },
    include: { products: true }
  });
}

export async function updateStoreCategory(
  id: string,
  data: Partial<{
    slug: string;
    title: string;
    description: string;
    image: string;
    featured: boolean;
  }>
) {
  return prisma.storeCategory.update({
    where: { id },
    data,
    include: { products: { orderBy: { order: "asc" } } }
  });
}

export async function deleteStoreCategory(id: string) {
  return prisma.storeCategory.delete({ where: { id } });
}

export async function createStoreProduct(
  categoryId: string,
  data: {
    title: string;
    description: string;
    image: string;
    price: string;
    featured?: boolean;
    colorOptions?: string[];
    sizeOptions?: string[];
    supportsNumber?: boolean;
    supportsName?: boolean;
    supportsCustomMade?: boolean;
  }
) {
  const maxOrder = await prisma.storeProduct.findFirst({
    where: { categoryId },
    orderBy: { order: "desc" },
    select: { order: true }
  });

  return prisma.storeProduct.create({
    data: {
      categoryId,
      title: data.title,
      description: data.description,
      image: data.image,
      price: data.price,
      featured: data.featured || false,
      colorOptions: Array.isArray(data.colorOptions) ? data.colorOptions.join(",") : "",
      sizeOptions: Array.isArray(data.sizeOptions) ? data.sizeOptions.join(",") : "",
      supportsNumber: data.supportsNumber || false,
      supportsName: data.supportsName || false,
      supportsCustomMade: data.supportsCustomMade || false,
      order: (maxOrder?.order ?? 0) + 1
    }
  });
}

export async function updateStoreProduct(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    image: string;
    price: string;
    featured: boolean;
    colorOptions: string[];
    sizeOptions: string[];
    supportsNumber: boolean;
    supportsName: boolean;
    supportsCustomMade: boolean;
  }>
) {
  const updateData: any = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.colorOptions !== undefined)
    updateData.colorOptions = Array.isArray(data.colorOptions) ? data.colorOptions.join(",") : "";
  if (data.sizeOptions !== undefined)
    updateData.sizeOptions = Array.isArray(data.sizeOptions) ? data.sizeOptions.join(",") : "";
  if (data.supportsNumber !== undefined) updateData.supportsNumber = data.supportsNumber;
  if (data.supportsName !== undefined) updateData.supportsName = data.supportsName;
  if (data.supportsCustomMade !== undefined) updateData.supportsCustomMade = data.supportsCustomMade;

  return prisma.storeProduct.update({
    where: { id },
    data: updateData
  });
}

export async function deleteStoreProduct(id: string) {
  return prisma.storeProduct.delete({ where: { id } });
}

// Helper to convert comma-separated strings back to arrays
export function parseStoreProduct(product: any): StoreProduct {
  return {
    ...product,
    customizationPrice: product.customizationPrice ?? "$0",
    nameOnlyPrice: product.nameOnlyPrice ?? product.customizationPrice ?? product.price ?? "$0",
    numberOnlyPrice: product.numberOnlyPrice ?? product.customizationPrice ?? product.price ?? "$0",
    nameAndNumberPrice: product.nameAndNumberPrice ?? product.customizationPrice ?? product.price ?? "$0",
    colorOptions: product.colorOptions ? product.colorOptions.split(",").filter(Boolean) : [],
    sizeOptions: product.sizeOptions ? product.sizeOptions.split(",").filter(Boolean) : []
  };
}
