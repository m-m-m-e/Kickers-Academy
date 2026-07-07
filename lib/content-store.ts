import { loadSiteContentRow, saveSiteContentRow } from "@/lib/site-content-store";
import { defaultHomeContent, normalizeHomeContent, type HomeContentState } from "@/lib/home-content";

const CONTENT_KEY = "site";

export async function loadContentStore(): Promise<HomeContentState> {
  const row = await loadSiteContentRow(CONTENT_KEY);

  if (!row) {
    return normalizeHomeContent(defaultHomeContent);
  }

  try {
    return normalizeHomeContent(JSON.parse(row.payload) as HomeContentState);
  } catch {
    return normalizeHomeContent(defaultHomeContent);
  }
}

export async function saveContentStore(content: HomeContentState) {
  const normalized = normalizeHomeContent(content);

  await saveSiteContentRow(CONTENT_KEY, JSON.stringify(normalized));

  return normalized;
}
