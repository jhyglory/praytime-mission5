import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { checkWriteOrigin, cmsFailure, parsePrayerForm } from "../src/lib/prayers/http";
import { CmsError } from "../src/lib/prayers/config";

function formRequest(changes: Record<string, string | File> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ title: "QA 제목", content: "QA 본문\n둘째 줄", language: "ko", image_action: "keep", ...changes })) data.set(key, value);
  return new Request("https://praytime.test/api/prayers", { method: "POST", headers: { Origin: "https://praytime.test" }, body: data });
}

describe("prayer request validation boundary", () => {
  it("retains complete content and meaningful line breaks", async () => {
    const result = await parsePrayerForm(formRequest({ content: "  QA 본문\n\n둘째 줄  " }));
    // Multipart serializes line endings as CRLF; blank lines and surrounding spaces survive.
    expect(result).toMatchObject({ input: { content: "  QA 본문\r\n\r\n둘째 줄  ", language: "ko" }, image: null, action: "keep" });
  });

  it.each(["title", "content"] as const)("returns a field error for whitespace-only %s", async key => {
    expect(await parsePrayerForm(formRequest({ [key]: " \n " }))).toMatchObject({ fields: { [key]: expect.any(String) } });
  });

  it("rejects a title longer than its validated limit rather than truncating it", async () => {
    expect(await parsePrayerForm(formRequest({ title: "가".repeat(301) }))).toMatchObject({ fields: { title: expect.any(String) } });
  });

  it("never lets submitted identifiers, source payload or image paths become editable fields", async () => {
    const result = await parsePrayerForm(formRequest({ id: "forged", source_key: "forged", image_path: "someone-elses-file.png", source_payload: "forged", updated_at: "1900-01-01" }));
    expect(result).toHaveProperty("input");
    if (!("input" in result)) throw new Error("Expected a valid form");
    for (const key of ["id", "source_key", "image_path", "source_payload", "updated_at"]) expect(result.input).not.toHaveProperty(key);
  });

  it("requires multipart form input", async () => {
    const request = new Request("https://praytime.test/api/prayers", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    await expect(parsePrayerForm(request)).rejects.toMatchObject({ status: 415 });
  });

  it("rejects a declared oversized request", async () => {
    const request = formRequest();
    request.headers.set("Content-Length", String(3 * 1024 * 1024 + 1));
    await expect(parsePrayerForm(request)).rejects.toMatchObject({ status: 413 });
  });

  it("enforces the streamed byte limit even without Content-Length", async () => {
    const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(new Uint8Array(3 * 1024 * 1024 + 1)); controller.close(); } });
    const init: RequestInit & { duplex: "half" } = { method: "POST", headers: { "Content-Type": "multipart/form-data; boundary=qa" }, body: stream, duplex: "half" };
    await expect(parsePrayerForm(new Request("https://praytime.test/api/prayers", init))).rejects.toMatchObject({ status: 413 });
  });

  it("rejects unknown image actions", async () => {
    expect(await parsePrayerForm(formRequest({ image_action: "delete-everything" }))).toMatchObject({ fields: { image: expect.any(String) } });
  });

  it("requires a real file for replacement", async () => {
    expect(await parsePrayerForm(formRequest({ image_action: "replace" }))).toMatchObject({ fields: { image: expect.any(String) } });
  });

  it.each(["keep", "remove"])("rejects a new upload combined with %s", async action => {
    const image = new File(["QA not an image"], "qa.png", { type: "image/png" });
    expect(await parsePrayerForm(formRequest({ image_action: action, image }))).toMatchObject({ fields: { image: expect.any(String) } });
  });

  it("rejects a zero-byte named image", async () => {
    expect(await parsePrayerForm(formRequest({ image_action: "replace", image: new File([], "empty.png", { type: "image/png" }) }))).toMatchObject({ fields: { image: expect.any(String) } });
  });
});

describe("prayer origin and error boundary", () => {
  it("accepts a same-origin browser mutation", () => {
    expect(() => checkWriteOrigin(formRequest())).not.toThrow();
  });

  it("rejects foreign or cross-site browser mutations", () => {
    const foreign = formRequest(); foreign.headers.set("Origin", "https://foreign.invalid");
    expect(() => checkWriteOrigin(foreign)).toThrow(CmsError);
    const crossSite = formRequest(); crossSite.headers.set("Sec-Fetch-Site", "cross-site");
    expect(() => checkWriteOrigin(crossSite)).toThrow(CmsError);
  });

  it("does not expose an internal provider error or secret through the response", async () => {
    const response = cmsFailure(new Error("provider SQL error; sb_secret_QA_should_never_be_visible"));
    expect(response.status).toBe(502);
    expect(await response.text()).not.toMatch(/provider|SQL|sb_secret/);
  });

  it("preserves the safe configuration error separately from an empty collection", async () => {
    const response = cmsFailure(new CmsError("CONFIGURATION_REQUIRED", "과제용 연결 설정이 필요합니다.", 503));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ code: "CONFIGURATION_REQUIRED" });
  });
});
