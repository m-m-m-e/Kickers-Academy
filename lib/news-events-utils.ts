import type { ImageContentItem } from "@/lib/home-content";

export function getNewsEventTime(item: ImageContentItem) {
  if (!item.occurrenceDate) return null;
  const time = new Date(item.occurrenceDate).getTime();
  return Number.isNaN(time) ? null : time;
}

export function isPastNewsEvent(item: ImageContentItem, now = Date.now()) {
  const time = getNewsEventTime(item);
  return time !== null && time < now;
}

export function getActiveNewsEvents(items: ImageContentItem[], now = Date.now()) {
  return items
    .filter((item) => item.pinned || !isPastNewsEvent(item, now))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const aTime = getNewsEventTime(a) ?? Number.MAX_SAFE_INTEGER;
      const bTime = getNewsEventTime(b) ?? Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
}

export function getArchivedNewsEvents(items: ImageContentItem[], now = Date.now()) {
  return items
    .filter((item) => !item.pinned && isPastNewsEvent(item, now))
    .sort((a, b) => (getNewsEventTime(b) ?? 0) - (getNewsEventTime(a) ?? 0));
}

export function formatNewsEventDate(value: string | undefined) {
  if (!value) return "Date not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(date);
}
