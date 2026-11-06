import type { Metadata } from "next";

const title = "PrayTime — 기도로 멈추고 다시 선택하세요";
const description = "SNS를 열기 전 잠깐 기도하고, 지금도 필요한지 돌아보세요. 필요하지 않으면 돌아가고, 필요하면 5 · 10 · 15분을 정해 사용합니다.";

// Reuse the approved Hero artwork and the existing solid red Pause Mark.
// The favicon uses a square Navy tile for crisp rendering at browser-tab sizes.
const approvedAssets = {
  icon: "/assets/praytime-favicon.svg",
  fallbackIcon: "/favicon.ico",
  appleIcon: "/apple-touch-icon.png",
  openGraph: { url: "/assets/hero-atmosphere.png", width: 1895, height: 830, alt: "PrayTime — 행동 전의 틈, Offset Interval" },
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
