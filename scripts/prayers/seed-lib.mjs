import { createHash } from "node:crypto";
import { PrayerInputSchema } from "../../src/lib/prayers/model.ts";

export const sourceFields = ["id", "category", "category_full", "title_kr", "keyword_kr", "scripture_ref", "scripture_kr", "prayer_kr"];
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
export const semanticDigest = value => createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");

export function analyzeSource(source) {
  const issues = [], records = [], seenIds = new Set(), bodies = new Map();
  if (!Array.isArray(source)) return { scanned: 0, records, issues: [{ location: "$", reason: "최상위 구조는 기도문 배열이어야 합니다." }], duplicates: [] };
  for (const [index, record] of source.entries()) {
    const location = `$[${index}]`, start = issues.length;
    if (!record || Array.isArray(record) || typeof record !== "object") {
      issues.push({ location, reason: "기도문 객체가 아닙니다." }); continue;
    }
    for (const field of sourceFields) if (typeof record[field] !== "string" || !record[field].trim()) issues.push({ location, field, reason: "원본 필수 문자열이 누락되었거나 비어 있습니다." });
    const source_key = typeof record.id === "string" ? `praytime:ko:${record.id}` : null;
    if (source_key && seenIds.has(source_key)) issues.push({ location, source_key, field: "id", reason: "원본 ID가 중복됩니다." });
    if (source_key) seenIds.add(source_key);
    if (typeof record.id === "string" && !/^[A-Za-z0-9_-]{1,120}$/.test(record.id)) issues.push({ location, field: "id", reason: "원본 ID 형식이 올바르지 않습니다." });
    const parsed = PrayerInputSchema.safeParse({ title: record.title_kr, content: record.prayer_kr, category: record.category, category_full: record.category_full, keyword: record.keyword_kr, scripture_ref: record.scripture_ref, scripture_text: record.scripture_kr, language: "ko" });
    if (!parsed.success) for (const issue of parsed.error.issues) issues.push({ location, source_key, field: issue.path.join("."), reason: issue.message });
    if (issues.length === start && parsed.success) {
      records.push({ ...parsed.data, source_key, source_payload: record });
      const content = record.prayer_kr;
      bodies.set(content, [...(bodies.get(content) ?? []), record.id]);
    }
  }
  return { scanned: source.length, records, issues, duplicates: [...bodies.values()].filter(ids => ids.length > 1) };
}

export function compareSources(left, right) {
  const equal = semanticDigest(left) === semanticDigest(right);
  if (!Array.isArray(left) || !Array.isArray(right)) return { equal, added: [], missing: [], conflicts: [], orderChanged: false };
  const a = new Map(left.filter(r => r && typeof r.id === "string").map(r => [r.id, r]));
  const b = new Map(right.filter(r => r && typeof r.id === "string").map(r => [r.id, r]));
  return {
    equal,
    added: [...b.keys()].filter(id => !a.has(id)),
    missing: [...a.keys()].filter(id => !b.has(id)),
    conflicts: [...a.keys()].filter(id => b.has(id) && semanticDigest(a.get(id)) !== semanticDigest(b.get(id))),
    orderChanged: JSON.stringify([...a.keys()]) !== JSON.stringify([...b.keys()]),
  };
}

// One database batch: ignored source_key conflicts do not update existing rows.
// `inserted` comes from returned INSERT rows, not an optimistic requested count.
export async function seedRecords(client, records) {
  if (!records.length) return { scanned: 0, inserted: 0, skipped: 0, failed: 0 };
  const failure = { scanned: records.length, inserted: 0, skipped: 0, failed: records.length, error: "기도문 적재에 실패했습니다. 대상 연결·migration·권한을 확인해 주세요." };
  try {
    const { data, error } = await client.from("prayers").upsert(records, { onConflict: "source_key", ignoreDuplicates: true }).select("source_key");
    if (error || !Array.isArray(data) || data.length > records.length) return failure;
    return { scanned: records.length, inserted: data.length, skipped: records.length - data.length, failed: 0 };
  } catch {
    // A lost response can leave commit status unknown. A safe rerun resolves it via source_key.
    return { ...failure, outcomeUnknown: true };
  }
}

export function seedEnvironment(env) {
  if (env.VERCEL_ENV === "production") throw new Error("과제용 CMS 스크립트는 운영 배포 환경에서 실행할 수 없습니다.");
  if (env.PRAYER_CMS_ENABLED !== "true") throw new Error("PRAYER_CMS_ENABLED=true로 과제용 CMS 연결을 명시해 주세요.");
  const projectRef = env.PRAYER_CMS_PROJECT_REF || "cibcyeyznfmywacfiokh";
  if (!/^[a-z]{20}$/.test(projectRef)) throw new Error("과제용 프로젝트 식별자는 영문 소문자 20자여야 합니다.");
  let url;
  try { url = new URL(env.SUPABASE_URL); } catch { throw new Error("과제용 SUPABASE_URL 설정이 필요합니다."); }
  const expected = `https://${projectRef}.supabase.co`;
  if (url.origin !== expected || url.pathname !== "/" || url.search || url.hash || url.username || url.password || ["yxiubxjpapiacvhbkxvd.supabase.co", "rnfyujkglbluobwligxa.supabase.co"].includes(url.hostname)) throw new Error("기존 운영/다른 서비스가 아닌 지정된 과제 전용 Supabase 프로젝트를 연결해 주세요.");
  const key = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  let legacy = false;
  if (!key?.startsWith("sb_secret_")) {
    try { legacy = JSON.parse(Buffer.from(key?.split(".")[1] ?? "", "base64url").toString()).role === "service_role"; } catch { /* never print key material */ }
    if (!legacy) throw new Error("서버 전용 SUPABASE_SECRET_KEY 설정이 필요합니다.");
  }
  return { url: url.origin, key, legacy };
}
