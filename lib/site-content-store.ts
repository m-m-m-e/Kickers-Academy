import { prisma } from "@/lib/prisma";
import { defaultHomeContent, normalizeHomeContent, type HomeContentState } from "@/lib/home-content";

export type SiteContentRow = {
  id: string;
  key: string;
  payload: string;
};

export async function loadSiteContentRow(key: string): Promise<SiteContentRow | null> {
  return prisma.siteContent.findUnique({
    where: { key },
    select: { id: true, key: true, payload: true }
  });
}

export async function saveSiteContentRow(key: string, payload: string) {
  return prisma.siteContent.upsert({
    where: { key },
    create: { key, payload },
    update: { payload },
    select: { id: true, key: true, payload: true }
  });
}

export async function loadNormalizedSiteContent(): Promise<HomeContentState> {
  const row = await loadSiteContentRow("site");

  if (!row) {
    return normalizeHomeContent(defaultHomeContent);
  }

  try {
    return normalizeHomeContent(JSON.parse(row.payload) as HomeContentState);
  } catch {
    return normalizeHomeContent(defaultHomeContent);
  }
}
