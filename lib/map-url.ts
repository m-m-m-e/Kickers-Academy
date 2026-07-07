export function buildMapEmbedUrl(mapLink: string, fallbackQuery = "") {
  const rawLink = mapLink.trim();
  const query = fallbackQuery.trim();

  if (!rawLink) {
    return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : "";
  }

  try {
    const url = new URL(rawLink);
    const hostname = url.hostname.replace(/^www\./, "");

    if (!hostname.includes("google.com")) {
      return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : "";
    }

    if (url.pathname.includes("/maps/embed") || url.searchParams.get("output") === "embed") {
      return rawLink;
    }

    const candidate =
      url.searchParams.get("q") ||
      url.searchParams.get("query") ||
      url.searchParams.get("destination") ||
      url.searchParams.get("destination_place_id");

    if (candidate) {
      return `https://www.google.com/maps?q=${encodeURIComponent(candidate)}&output=embed`;
    }

    const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/);
    if (placeMatch?.[1]) {
      return `https://www.google.com/maps?q=${encodeURIComponent(decodeURIComponent(placeMatch[1].replace(/\+/g, " ")))}&output=embed`;
    }

    if (query) {
      return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }

    return "";
  } catch {
    return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : "";
  }
}
