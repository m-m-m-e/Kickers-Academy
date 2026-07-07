import { StoreDetailClient } from "@/components/store-detail-client";

export default async function StoreCategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <StoreDetailClient slug={slug} />;
}
