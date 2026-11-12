import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const mocked = vi.hoisted(() => ({ client: vi.fn() }));
vi.mock("../src/lib/prayers/config", async importOriginal => ({ ...await importOriginal<typeof import("../src/lib/prayers/config")>(), getPrayerClient: mocked.client }));
import { CmsError, getPrayer, listPrayers } from "../src/lib/prayers/store";
import type { Prayer } from "../src/lib/prayers/model";

const rows: Prayer[] = Array.from({ length: 42 }, (_, index) => ({
  id: `3abcc89d-5a42-4204-a248-${String(index + 1).padStart(12, "0")}`,
  title: `QA title ${index + 1}`, content: "QA body", category: null, category_full: null,
  keyword: null, scripture_ref: null, scripture_text: null, language: "ko", image_path: null,
  source_key: null, source_payload: null, created_at: "2026-11-12T00:00:00.000Z", updated_at: "2026-11-12T01:00:00.000Z",
}));
function provider(data = rows) {
  const count = vi.fn().mockResolvedValue({ count: data.length, error: null });
  const query = { order: vi.fn(), range: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn() };
  query.order.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.range.mockImplementation(async (start: number, end: number) => ({ data: data.slice(start, end + 1), error: null }));
  query.maybeSingle.mockResolvedValue({ data: data[0] ?? null, error: null });
  const select = vi.fn((_columns: string, options?: { head?: boolean }) => options?.head ? count() : query);
  const from = vi.fn().mockReturnValue({ select });
  mocked.client.mockReturnValue({ from });
  return { count, query, select, from };
}
beforeEach(() => { vi.clearAllMocks(); });

describe("prayer server store pagination and outage semantics", () => {
  it("counts all rows but fetches only20 using a stable modified-time and unique-id order", async () => {
    const { query, select } = provider();
    const result = await listPrayers(2);
    expect(select).toHaveBeenCalledWith("id", { count: "exact", head: true });
    expect(query.order.mock.calls).toEqual([["updated_at", { ascending: false }], ["id", { ascending: false }]]);
    expect(query.range).toHaveBeenCalledWith(20, 39);
    expect(result).toMatchObject({ total: 42, page: 2, pageCount: 3 });
    expect(result.items).toHaveLength(20);
    expect(result.items[0].id).toBe(rows[20].id);
  });

  it("clamps an out-of-range page to the current last page", async () => {
    const { query } = provider();
    const result = await listPrayers(999);
    expect(query.range).toHaveBeenCalledWith(40, 59);
    expect(result).toMatchObject({ total: 42, page: 3, pageCount: 3 });
    expect(result.items).toHaveLength(2);
  });

  it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])("normalizes invalid page %s to page1", async page => {
    const { query } = provider();
    expect(await listPrayers(page)).toMatchObject({ page: 1 });
    expect(query.range).toHaveBeenCalledWith(0, 19);
  });

  it("recovers the previous page after the last item of a last page is deleted", async () => {
    const { query } = provider(rows.slice(0, 40));
    const result = await listPrayers(3);
    expect(result).toMatchObject({ total: 40, page: 2, pageCount: 2 });
    expect(query.range).toHaveBeenCalledWith(20, 39);
  });

  it("returns a genuine empty collection with page1, not an outage", async () => {
    const { query } = provider([]);
    expect(await listPrayers(9)).toEqual({ items: [], total: 0, page: 1, pageCount: 1 });
    expect(query.range).toHaveBeenCalledWith(0, 19);
  });

  it("distinguishes a failed count from a genuine empty collection", async () => {
    const { count, query } = provider([]);
    count.mockResolvedValue({ count: null, error: { message: "provider unavailable" } });
    await expect(listPrayers()).rejects.toMatchObject({ code: "DATABASE_UNAVAILABLE" });
    expect(query.range).not.toHaveBeenCalled();
  });

  it("distinguishes a row-query failure from an empty page", async () => {
    const { query } = provider();
    query.range.mockResolvedValue({ data: null, error: { message: "provider unavailable" } });
    await expect(listPrayers()).rejects.toMatchObject({ code: "DATABASE_UNAVAILABLE" });
  });

  it("keeps missing configuration distinct from database failure", async () => {
    provider();
    mocked.client.mockImplementation(() => { throw new CmsError("CONFIGURATION_REQUIRED", "과제용 설정이 필요합니다."); });
    await expect(listPrayers()).rejects.toMatchObject({ code: "CONFIGURATION_REQUIRED" });
  });
});

describe("prayer server store single-record reads", () => {
  it("does not access the provider for a malformed identifier", async () => {
    provider();
    expect(await getPrayer("not-a-uuid")).toBeNull();
    expect(mocked.client).not.toHaveBeenCalled();
  });

  it("returns null only when a valid identifier is genuinely missing", async () => {
    const { query } = provider();
    query.maybeSingle.mockResolvedValue({ data: null, error: null });
    expect(await getPrayer(rows[0].id)).toBeNull();
    expect(query.eq).toHaveBeenCalledWith("id", rows[0].id);
  });

  it("returns the complete stored text and metadata for a matching row", async () => {
    const { query } = provider();
    const record = { ...rows[0], content: "QA line1\n\nQA line2", source_payload: { original: "QA" } };
    query.maybeSingle.mockResolvedValue({ data: record, error: null });
    expect(await getPrayer(record.id)).toEqual(record);
  });

  it("never reports a provider failure as a missing prayer", async () => {
    const { query } = provider();
    query.maybeSingle.mockResolvedValue({ data: null, error: { message: "provider unavailable" } });
    await expect(getPrayer(rows[0].id)).rejects.toMatchObject({ code: "DATABASE_UNAVAILABLE" });
  });
});
