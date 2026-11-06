import type { Metadata } from "next";

const title = "PrayTime — 기도로 멈추고 다시 선택하세요";
const description = "SNS를 열기 전 잠깐 기도하고, 지금도 필요한지 돌아보세요. 필요하지 않으면 돌아가고, 필요하면 5 · 10 · 15분을 정해 사용합니다.";

// Use the user's sharing artwork, separately from the unchanged Landing Hero.
// A transparent canvas keeps only the existing red Pause Mark in browser tabs.
const approvedAssets = {
  icon: "/assets/praytime-favicon.svg?v=red-pause",
  fallbackIcon: "/favicon.ico?v=red-pause",
  appleIcon: "/apple-touch-icon.png?v=red-pause",
  openGraph: { url: "/og/praytime-share-8b6783f5.png", width: 1711, height: 919, type: "image/png", alt: "PrayTime — 일상의 틈에서, 하나님과 마주하는 시간" },
};

export function buildSiteMetadata(siteUrl?: string): Metadata {
  let origin: URL | undefined;
  if (siteUrl) {
    const parsed = new URL(siteUrl);
    if (!["https:", "http:"].includes(parsed.protocol) || parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
      throw new Error("SITE_URL must be an HTTP(S) origin without credentials, path, query or hash");
    }
    origin = parsed;
  }
  const images = approvedAssets.openGraph ? [approvedAssets.openGraph] : undefined;
  return {
    title,
    description,
    metadataBase: origin ?? new URL("http://localhost:3000"),
    ...(origin ? { alternates: { canonical: "/" } } : {}),
    openGraph: {
      type: "website", locale: "ko_KR", siteName: "PrayTime", title, description,
      ...(origin ? { url: "/" } : {}),
      ...(images ? { images } : {}),
    },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, ...(images ? { images } : {}) },
    icons: {
      icon: [
        { url: approvedAssets.fallbackIcon, type: "image/x-icon", sizes: "16x16 32x32 48x48" },
        { url: approvedAssets.icon, type: "image/svg+xml", sizes: "any" },
      ],
      apple: { url: approvedAssets.appleIcon, type: "image/png", sizes: "180x180" },
    },
    // Release review must explicitly approve indexing; Preview stays noindex.
    robots: { index: false, follow: false },
  };
}
