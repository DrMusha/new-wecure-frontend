function normalizeBaseUrl(value: string) {
  return value.replace(/\/$/, "");
}

function getSiteOrigin() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const normalized = candidate.startsWith("http")
      ? candidate
      : `https://${candidate}`;

    return normalizeBaseUrl(normalized);
  }

  return "";
}

export function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (configured) {
    const normalized = normalizeBaseUrl(configured);
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      return normalized;
    }

    if (typeof window !== "undefined") {
      return normalized;
    }

    const siteOrigin = getSiteOrigin();
    if (siteOrigin) {
      return `${siteOrigin}${normalized}`;
    }
  }

  if (typeof window !== "undefined") {
    return "/backend";
  }

  const siteOrigin = getSiteOrigin();
  if (siteOrigin) {
    return `${siteOrigin}/backend`;
  }

  return "http://16.171.43.249";
}
