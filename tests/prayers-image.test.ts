import { describe, expect, it, vi } from "vitest";
import sharp from "sharp";

vi.mock("server-only", () => ({}));

import { validatePrayerImage } from "../src/lib/prayers/image";

const MAX_BYTES = 2_097_152;

async function encoded(format: "jpeg" | "png" | "webp") {
  return sharp({ create: { width: 32, height: 48, channels: 3, background: { r: 244, g: 236, b: 223 } } })[format]().toBuffer();
}
function upload(bytes: Uint8Array, name: string, type: string) {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe("prayer cover image validation", () => {
  it.each([
    ["jpeg", "image/jpeg", "jpg"],
    ["png", "image/png", "png"],
    ["webp", "image/webp", "webp"],
  ] as const)("accepts actual %s bytes when MIME and extension agree", async (format, mime, extension) => {
    const bytes = await encoded(format);
    const result = await validatePrayerImage(upload(bytes, `prayer.${extension}`, mime));
    expect(result.mime).toBe(mime);
    expect(result.extension).toBe(extension);
    expect(Buffer.from(result.bytes)).toEqual(bytes);
  });

  it("accepts the standard .jpeg extension and upper-case file extension", async () => {
    const bytes = await encoded("jpeg");
    expect((await validatePrayerImage(upload(bytes, "cover.JPEG", "image/jpeg"))).extension).toBe("jpg");
  });

  it("rejects an empty upload", async () => {
    await expect(validatePrayerImage(upload(new Uint8Array(), "empty.png", "image/png"))).rejects.toThrow();
  });

  it("rejects files larger than 2 MiB before decoding", async () => {
    const bytes = new Uint8Array(MAX_BYTES + 1);
    bytes.set((await encoded("png")).subarray(0, 32));
    await expect(validatePrayerImage(upload(bytes, "large.png", "image/png"))).rejects.toThrow();
  });

  it("rejects a renamed executable/text payload even when its MIME claims PNG", async () => {
    await expect(validatePrayerImage(upload(new TextEncoder().encode("not an image"), "image.png", "image/png"))).rejects.toThrow();
  });

  it("rejects actual PNG bytes carrying a JPEG MIME type", async () => {
    await expect(validatePrayerImage(upload(await encoded("png"), "image.jpg", "image/jpeg"))).rejects.toThrow();
  });

  it("rejects an extension that does not match the actual image format", async () => {
    await expect(validatePrayerImage(upload(await encoded("png"), "image.webp", "image/png"))).rejects.toThrow();
  });

  it("rejects unsupported MIME and extension regardless of payload bytes", async () => {
    await expect(validatePrayerImage(upload(await encoded("png"), "image.svg", "image/svg+xml"))).rejects.toThrow();
  });

  it("rejects truncated image data instead of accepting only its signature", async () => {
    await expect(validatePrayerImage(upload((await encoded("png")).subarray(0, 24), "broken.png", "image/png"))).rejects.toThrow();
  });
});
