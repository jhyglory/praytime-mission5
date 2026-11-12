import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const mocked = vi.hoisted(() => ({ client: vi.fn(), existing: vi.fn() }));
vi.mock("../src/lib/prayers/config", async importOriginal => ({ ...await importOriginal<typeof import("../src/lib/prayers/config")>(), getPrayerClient: mocked.client }));
vi.mock("../src/lib/prayers/store", async importOriginal => ({ ...await importOriginal<typeof import("../src/lib/prayers/store")>(), getPrayer: mocked.existing }));
import { savePrayer, deletePrayer } from "../src/lib/prayers/mutations";
import type { Prayer, PrayerInput } from "../src/lib/prayers/model";

const id = "3abcc89d-5a42-4204-a248-13fa85b1985c";
const oldPath = `prayers/${id}/eaa341a4-ff45-4c17-bb3a-ff75caf7a53b.png`;
const input: PrayerInput = { title: "QA title", content: "QA body\nkeep this line", category: null, category_full: null, keyword: null, scripture_ref: null, scripture_text: null, language: "ko" };
const existing: Prayer = { ...input, id, source_key: "praytime:ko:guide_001", image_path: oldPath, source_payload: { id: "guide_001" }, created_at: "2026-11-12T00:00:00.000Z", updated_at: "2026-11-12T01:00:00.000Z" };
const image = { bytes: new Uint8Array([1, 2, 3]), mime: "image/png", extension: "png" as const };
function provider() {
  const query = { insert: vi.fn(), update: vi.fn(), delete: vi.fn(), eq: vi.fn(), select: vi.fn(), single: vi.fn(), maybeSingle: vi.fn() };
  for (const method of ["insert", "update", "delete", "eq", "select"] as const) query[method].mockReturnValue(query);
  query.single.mockResolvedValue({ data: { id }, error: null });
  query.maybeSingle.mockResolvedValue({ data: { id }, error: null });
  const storage = { upload: vi.fn().mockResolvedValue({ error: null }), remove: vi.fn().mockResolvedValue({ error: null }) };
  const db = { from: vi.fn().mockReturnValue(query), storage: { from: vi.fn().mockReturnValue(storage) } };
  mocked.client.mockReturnValue(db);
  return { query, storage };
}
beforeEach(() => { vi.clearAllMocks(); mocked.existing.mockResolvedValue(existing); });

describe("prayer mutation file consistency", () => {
  it("keeps the current image without upload or cleanup on an ordinary text edit", async () => {
    const { query, storage } = provider();
    expect(await savePrayer(input, null, "keep", id)).toEqual({ id });
    expect(query.update).toHaveBeenCalledWith({ ...input, image_path: oldPath });
    expect(query.eq).toHaveBeenCalledWith("updated_at", existing.updated_at);
    expect(storage.upload).not.toHaveBeenCalled();
    expect(storage.remove).not.toHaveBeenCalled();
  });

  it("uploads a replacement, connects it in DB, and only then removes the previous file", async () => {
    const { query, storage } = provider();
    const order: string[] = [];
    storage.upload.mockImplementation(async () => { order.push("upload"); return { error: null }; });
    query.maybeSingle.mockImplementation(async () => { order.push("DB saved"); return { data: { id }, error: null }; });
    storage.remove.mockImplementation(async () => { order.push("cleanup old"); return { error: null }; });
    expect(await savePrayer(input, image, "replace", id)).toEqual({ id });
    const newPath = storage.upload.mock.calls[0][0];
    expect(newPath).toMatch(new RegExp(`^prayers/${id}/[0-9a-f-]{36}\\.png$`));
    expect(query.update).toHaveBeenCalledWith({ ...input, image_path: newPath });
    expect(storage.remove).toHaveBeenCalledWith([oldPath]);
    expect(order).toEqual(["upload", "DB saved", "cleanup old"]);
  });

  it("cleans only the new upload after DB save failure and preserves the existing file", async () => {
    const { query, storage } = provider();
    query.maybeSingle.mockResolvedValue({ data: null, error: { message: "DB unavailable" } });
    await expect(savePrayer(input, image, "replace", id)).rejects.toMatchObject({ code: "SAVE_FAILED" });
    const newPath = storage.upload.mock.calls[0][0];
    expect(storage.remove).toHaveBeenCalledWith([newPath]);
    expect(storage.remove).not.toHaveBeenCalledWith([oldPath]);
  });

  it("does not mutate DB or delete the old file when upload fails", async () => {
    const { query, storage } = provider();
    storage.upload.mockRejectedValue(new Error("network unavailable"));
    await expect(savePrayer(input, image, "replace", id)).rejects.toMatchObject({ code: "UPLOAD_FAILED" });
    expect(query.update).not.toHaveBeenCalled();
    expect(query.insert).not.toHaveBeenCalled();
    expect(storage.remove).toHaveBeenCalledWith([storage.upload.mock.calls[0][0]]);
    expect(storage.remove).not.toHaveBeenCalledWith([oldPath]);
  });

  it("treats a concurrent edit as conflict and cleans the unlinked new file", async () => {
    const { query, storage } = provider();
    query.maybeSingle.mockResolvedValue({ data: null, error: null });
    await expect(savePrayer(input, image, "replace", id)).rejects.toMatchObject({ code: "CONFLICT", status: 409 });
    expect(storage.remove).toHaveBeenCalledWith([storage.upload.mock.calls[0][0]]);
    expect(storage.remove).not.toHaveBeenCalledWith([oldPath]);
  });

  it("reports old-file cleanup separately after a successful image removal", async () => {
    const { query, storage } = provider();
    storage.remove.mockResolvedValue({ error: { message: "storage unavailable" } });
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await savePrayer(input, null, "remove", id);
    expect(query.update).toHaveBeenCalledWith({ ...input, image_path: null });
    expect(result.id).toBe(id);
    expect(result.warning).toBeTruthy();
    quiet.mockRestore();
  });

  it("does not remove a file when DB deletion fails", async () => {
    const { query, storage } = provider();
    query.maybeSingle.mockResolvedValue({ data: null, error: { message: "DB unavailable" } });
    await expect(deletePrayer(id)).rejects.toMatchObject({ code: "DELETE_FAILED" });
    expect(storage.remove).not.toHaveBeenCalled();
  });

  it("handles an already missing record before trying to delete its file", async () => {
    const { query, storage } = provider();
    mocked.existing.mockResolvedValue(null);
    await expect(deletePrayer(id)).rejects.toMatchObject({ code: "NOT_FOUND", status: 404 });
    expect(query.delete).not.toHaveBeenCalled();
    expect(storage.remove).not.toHaveBeenCalled();
  });
});
