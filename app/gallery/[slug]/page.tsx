import { GalleryDetailClient } from "@/components/gallery-detail-client";

export default async function GalleryCategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <GalleryDetailClient slug={slug} />;
}

