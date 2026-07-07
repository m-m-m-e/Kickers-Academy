import { ProgramDetailClient } from "@/components/program-detail-client";

export default async function ProgramDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProgramDetailClient slug={slug} />;
}

