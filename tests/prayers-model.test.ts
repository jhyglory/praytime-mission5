import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { PrayerInputSchema, PRAYER_LIMITS, isPrayerId } from "../src/lib/prayers/model";
import { analyzeSource, compareSources, seedEnvironment, seedRecords } from "../scripts/prayers/seed-lib.mjs";

const source = JSON.parse(readFileSync(new URL("../data/prayer-guides-ko.json", import.meta.url), "utf8"));
const base = { title: "제목", content: "첫 문장\n\n둘째 문장", language: "ko" };

describe("prayer source and managed schema", () => {
  it("validates all 100 real records while preserving every original field and text", () => {
    const result = analyzeSource(source);
    expect(result.scanned).toBe(100);
    expect(result.records).toHaveLength(100);
    expect(result.issues).toEqual([]);
    expect(result.duplicates).toEqual([]);
    for (let i = 0; i < source.length; i++) {
      const original = source[i], record = result.records[i];
      expect(record).toMatchObject({ source_key: `praytime:ko:${original.id}`, title: original.title_kr, content: original.prayer_kr, category: original.category, category_full: original.category_full, keyword: original.keyword_kr, scripture_ref: original.scripture_ref, scripture_text: original.scripture_kr, language: "ko" });
      expect(record.source_payload).toEqual(original);
    }
  });
  it("preserves content whitespace, line breaks and scripture punctuation without silent truncation", () => {
    const parsed = PrayerInputSchema.parse({ ...base, title: " 앞뒤 공백 ", content: "  첫째\n\n둘째  ", scripture_text: "말씀\n둘째 줄" });
    expect(parsed.content).toBe("  첫째\n\n둘째  ");
    expect(parsed.title).toBe(" 앞뒤 공백 ");
    expect(parsed.scripture_text).toBe("말씀\n둘째 줄");
  });
  it.each([undefined, "", " \n\t ", 123])("rejects missing/blank/wrong-type required content %s", content => {
    expect(PrayerInputSchema.safeParse({ ...base, content }).success).toBe(false);
  });
  it("rejects oversized content but accepts the exact documented boundary", () => {
    expect(PrayerInputSchema.safeParse({ ...base, content: "가".repeat(PRAYER_LIMITS.content) }).success).toBe(true);
    expect(PrayerInputSchema.safeParse({ ...base, content: "가".repeat(PRAYER_LIMITS.content + 1) }).success).toBe(false);
  });
  it("normalizes empty optional fields, defaults language and rejects client-supplied metadata", () => {
    const parsed = PrayerInputSchema.parse({ title: "제목", content: "본문", category: "  ", scripture_text: "" });
    expect(parsed.category).toBeNull();
    expect(parsed.scripture_text).toBeNull();
    expect(parsed.language).toBe("ko");
    for (const field of ["id", "created_at", "updated_at", "source_key", "source_payload", "image_path"]) {
      expect(PrayerInputSchema.safeParse({ ...base, [field]: "untrusted" }).success).toBe(false);
    }
  });
  it("validates UUIDs separately from original source identifiers", () => {
    expect(isPrayerId("5e4b8572-ff51-4cc9-9cb4-1d901c19a7f1")).toBe(true);
    expect(isPrayerId("guide_001")).toBe(false);
    expect(isPrayerId("' or 1=1")).toBe(false);
  });
  it("reports malformed records and duplicate IDs before attempting any storage", () => {
    const malformed = [source[0], { ...source[0] }, null, { id: "broken" }];
    const result = analyzeSource(malformed);
    expect(result.scanned).toBe(4);
    expect(result.records).toHaveLength(1);
    expect(result.issues.some(issue => issue.reason.includes("중복"))).toBe(true);
    expect(result.issues.every(issue => issue.location.startsWith("$["))).toBe(true);
    expect(analyzeSource({ prayers: source }).issues[0].location).toBe("$");
  });
  it("distinguishes formatting/key order from source content, missing IDs and array order", () => {
    const reorderedKeys = source.map((row: Record<string, string>) => Object.fromEntries(Object.entries(row).reverse()));
    expect(compareSources(source, JSON.parse(JSON.stringify(reorderedKeys, null, 4))).equal).toBe(true);
    const changed = [{ ...source[0], prayer_kr: source[0].prayer_kr + "\n" }, ...source.slice(1, -1), { ...source.at(-1), id: "guide_101" }];
    expect(compareSources(source, changed)).toMatchObject({ equal: false, added: ["guide_101"], missing: ["guide_100"], conflicts: ["guide_001"] });
    expect(compareSources(source, [...source].reverse())).toMatchObject({ equal: false, conflicts: [], added: [], missing: [], orderChanged: true });
  });
});

describe("safe additive seed", () => {
  it("returns actual new/skipped counts and preserves administrator changes on rerun", async () => {
    const records = analyzeSource(source).records;
    const stored = new Map<string, Record<string, unknown>>();
    const upsert = vi.fn((rows: typeof records, options: { onConflict: string; ignoreDuplicates: boolean }) => {
      expect(options).toEqual({ onConflict: "source_key", ignoreDuplicates: true });
      const inserted: { source_key: string }[] = [];
      for (const row of rows) if (!stored.has(row.source_key)) { stored.set(row.source_key, row); inserted.push({ source_key: row.source_key }); }
      return { select: async () => ({ data: inserted, error: null }) };
    });
    const client = { from: vi.fn(() => ({ upsert })) };
    expect(await seedRecords(client, records)).toEqual({ scanned: 100, inserted: 100, skipped: 0, failed: 0 });
    stored.set(records[0].source_key, { ...stored.get(records[0].source_key), title: "관리자가 수정한 제목" });
    expect(await seedRecords(client, records)).toEqual({ scanned: 100, inserted: 0, skipped: 100, failed: 0 });
    expect(stored.get(records[0].source_key)?.title).toBe("관리자가 수정한 제목");
  });
  it("never reports success on a database failure and never reflects provider error data", async () => {
    const client = { from: () => ({ upsert: () => ({ select: async () => ({ data: null, error: { message: "private provider detail" } }) }) }) };
    const result = await seedRecords(client, analyzeSource(source).records);
    expect(result).toMatchObject({ inserted: 0, skipped: 0, failed: 100 });
    expect(JSON.stringify(result)).not.toContain("private provider detail");
  });
  it("reports a lost-response outcome without claiming any insert and is safe to retry", async () => {
    const client = { from: () => ({ upsert: () => ({ select: async () => { throw new Error("private transport detail"); } }) }) };
    const result = await seedRecords(client, analyzeSource(source).records);
    expect(result).toMatchObject({ inserted: 0, skipped: 0, failed: 100, outcomeUnknown: true });
    expect(JSON.stringify(result)).not.toContain("private transport detail");
  });
  it("requires an explicit dedicated-project opt-in and a server-only key", () => {
    expect(() => seedEnvironment({})).toThrow(/PRAYER_CMS_ENABLED/);
    const env = { PRAYER_CMS_ENABLED: "true", SUPABASE_URL: "https://cibcyeyznfmywacfiokh.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" };
    expect(seedEnvironment(env)).toMatchObject({ url: env.SUPABASE_URL, legacy: false });
    expect(() => seedEnvironment({ ...env, SUPABASE_URL: "https://yxiubxjpapiacvhbkxvd.supabase.co" })).toThrow(/전용/);
    expect(() => seedEnvironment({ ...env, SUPABASE_URL: "https://rnfyujkglbluobwligxa.supabase.co" })).toThrow(/전용/);
    expect(() => seedEnvironment({ ...env, SUPABASE_SECRET_KEY: "sb_publishable_example" })).toThrow(/서버 전용/);
    expect(() => seedEnvironment({ ...env, VERCEL_ENV: "production" })).toThrow(/운영 배포/);
    expect(() => seedEnvironment({ ...env, SUPABASE_URL: "https://anotherdemoproject.supabase.co" })).toThrow(/지정된 과제 전용/);
    expect(() => seedEnvironment({ ...env, PRAYER_CMS_PROJECT_REF: "bad-ref" })).toThrow(/20자/);
    expect(() => seedEnvironment({ ...env, PRAYER_CMS_PROJECT_REF: "rnfyujkglbluobwligxa", SUPABASE_URL: "https://rnfyujkglbluobwligxa.supabase.co" })).toThrow(/과제 전용/);
    expect(() => seedEnvironment({ ...env, SUPABASE_URL: env.SUPABASE_URL + "/other" })).toThrow(/과제 전용/);
  });
});
