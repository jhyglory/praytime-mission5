import { describe, expect, it, vi } from "vitest";
import { createPrayerSeedClient } from "../scripts/prayers/client.mjs";
import { cleanupOrphanImage, validPrayerImagePath } from "../scripts/prayers/cleanup-lib.mjs";

const path = "prayers/5e4b8572-ff51-4cc9-9cb4-1d901c19a7f1/032ea449-f7d8-4fa0-85b4-32e3f4d9b592.png";
const env = { PRAYER_CMS_ENABLED: "true", SUPABASE_URL: "https://cibcyeyznfmywacfiokh.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_cli_test" };

function fixture(count: number | null, queryError: unknown = null, storageError: unknown = null) {
  const eq = vi.fn(async () => ({ count, error: queryError }));
  const select = vi.fn(() => ({ eq }));
  const remove = vi.fn(async () => ({ data: storageError ? null : [{ name: path }], error: storageError }));
  const bucket = vi.fn(() => ({ remove }));
  return { client: { from: vi.fn(() => ({ select })), storage: { from: bucket } }, eq, select, bucket, remove };
}

describe("prayer CLI server transport", () => {
  it("sends modern secret only as apikey and enforces fresh bounded fetches", async () => {
    const transport = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(async () => new Response("[]", { status: 200, headers: { "content-type": "application/json" } }));
    const { client } = createPrayerSeedClient(env, transport);
    await client.from("prayers").select("id").limit(1);
    expect(transport).toHaveBeenCalledTimes(1);
    const init = transport.mock.calls[0][1]!;
    const headers = new Headers(init.headers);
    expect(headers.get("apikey")).toBe(env.SUPABASE_SECRET_KEY);
    expect(headers.has("Authorization")).toBe(false);
    expect(init.cache).toBe("no-store");
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(init.signal?.aborted).toBe(false);
  });
  it("preserves a genuine legacy service-role JWT Authorization", async () => {
    const jwt = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ role: "service_role" })).toString("base64url")}.signature`;
    const transport = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(async () => new Response("[]", { status: 200, headers: { "content-type": "application/json" } }));
    const { client, legacy } = createPrayerSeedClient({ ...env, SUPABASE_SECRET_KEY: "", SUPABASE_SERVICE_ROLE_KEY: jwt }, transport);
    await client.from("prayers").select("id").limit(1);
    expect(legacy).toBe(true);
    expect(new Headers(transport.mock.calls[0][1]!.headers).get("Authorization")).toBe(`Bearer ${jwt}`);
  });
});

describe("exact orphan image cleanup", () => {
  it("validates both UUIDs, the confined prefix and only allowed extensions", () => {
    expect(validPrayerImagePath(path)).toBe(true);
    for (const value of ["../" + path, path.replace(".png", ".svg"), path.replace("prayers/", "other/"), path.replace("5e4b8572-ff51-4cc9-9cb4-1d901c19a7f1", "------------------------------------"), path + "?token=x"]) {
      expect(validPrayerImagePath(value)).toBe(false);
    }
  });
  it("refuses any currently linked image without touching Storage", async () => {
    const test = fixture(1);
    expect(await cleanupOrphanImage(test.client, path)).toMatchObject({ status: "linked", removed: false });
    expect(test.client.from).toHaveBeenCalledWith("prayers");
    expect(test.select).toHaveBeenCalledWith("id", { count: "exact", head: true });
    expect(test.eq).toHaveBeenCalledWith("image_path", path);
    expect(test.bucket).not.toHaveBeenCalled();
    expect(test.remove).not.toHaveBeenCalled();
  });
  it("removes only the exact unlinked path from the dedicated bucket", async () => {
    const test = fixture(0);
    expect(await cleanupOrphanImage(test.client, path)).toMatchObject({ status: "removed", removed: true });
    expect(test.bucket).toHaveBeenCalledWith("prayer-covers");
    expect(test.remove).toHaveBeenCalledExactlyOnceWith([path]);
  });
  it.each([null, -1])("fails closed when exact reference count is unavailable: %s", async count => {
    const test = fixture(count);
    expect(await cleanupOrphanImage(test.client, path)).toMatchObject({ status: "error", removed: false });
    expect(test.remove).not.toHaveBeenCalled();
  });
  it("does not expose provider errors and permits a safe retry after failed removal", async () => {
    const test = fixture(0, null, { message: "private provider metadata" });
    const failed = await cleanupOrphanImage(test.client, path);
    expect(failed).toMatchObject({ status: "error", removed: false });
    expect(JSON.stringify(failed)).not.toContain("private provider metadata");
    const retry = fixture(0);
    expect(await cleanupOrphanImage(retry.client, path)).toMatchObject({ status: "removed", removed: true });
  });
  it("never makes a query for malformed paths", async () => {
    const test = fixture(0);
    expect(await cleanupOrphanImage(test.client, "../unrelated.png")).toMatchObject({ status: "invalid" });
    expect(test.client.from).not.toHaveBeenCalled();
    expect(test.bucket).not.toHaveBeenCalled();
  });
});
