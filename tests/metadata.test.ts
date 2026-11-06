import { describe, expect, it } from "vitest";
import { buildSiteMetadata } from "../src/lib/site-metadata";

describe("Submission metadata", () => {
  it("uses approved local assets without inventing a production canonical", () => {
    const metadata = buildSiteMetadata();
    expect(String(metadata.metadataBase)).toBe("http://localhost:3000/");
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).toMatchObject({ images: [{ url: "/og/praytime-share-7e4689d8.png", width: 1711, height: 919, type: "image/png" }] });
    expect(metadata.icons).toEqual({
      icon: [
        { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
        { url: "/assets/praytime-favicon.svg", type: "image/svg+xml", sizes: "any" },
      ],
      apple: { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    });
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: [{ url: "/og/praytime-share-7e4689d8.png", alt: "PrayTime — 일상의 틈에서, 하나님과 마주하는 시간" }] });
  });
  it("binds canonical and share metadata to the configured deployment origin", () => {
    const metadata = buildSiteMetadata("https://mission5.example.com");
    expect(String(metadata.metadataBase)).toBe("https://mission5.example.com/");
    expect(metadata.alternates).toEqual({ canonical: "/" });
    expect(metadata.openGraph).toMatchObject({ url: "/", locale: "ko_KR", siteName: "PrayTime" });
  });
  it.each(["not a URL", "javascript:alert(1)", "https://user:password@example.com", "https://example.com/path", "https://example.com/?test=1"])("rejects invalid SITE_URL %s", value => {
    expect(() => buildSiteMetadata(value)).toThrow();
  });
});
