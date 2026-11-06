import { describe, expect, it } from "vitest";
import { buildSiteMetadata } from "../src/lib/site-metadata";

describe("Submission metadata", () => {
  it("uses approved local assets without inventing a production canonical", () => {
    const metadata = buildSiteMetadata();
    expect(String(metadata.metadataBase)).toBe("http://localhost:3000/");
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).toMatchObject({ images: [{ url: "/assets/hero-atmosphere.png", width: 1895, height: 830 }] });
    expect(metadata.icons).toEqual({
      icon: [
        { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
        { url: "/assets/praytime-favicon.svg", type: "image/svg+xml", sizes: "any" },
      ],
      apple: { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    });
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
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
