#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createPrayerSeedClient } from "./client.mjs";
import { analyzeSource, compareSources, seedRecords, semanticDigest } from "./seed-lib.mjs";

const args = process.argv.slice(2);
const input = args.find((arg, i) => !arg.startsWith("--") && args[i - 1] !== "--compare");
const compareIndex = args.indexOf("--compare");
const comparePath = compareIndex < 0 ? null : args[compareIndex + 1];
const apply = args.includes("--apply");
const allowed = new Set(["--apply", "--dry-run", "--compare", "--help"]);
if (args.includes("--help")) {
  console.log("node --experimental-strip-types scripts/prayers/seed.mjs [source.json] [--compare other.json] [--dry-run | --apply]\nDefault: validate the repository JSON, dry-run without database access. --apply adds missing source keys only.");
  process.exit(0);
}
async function main() {
  if (args.some(arg => arg.startsWith("--") && !allowed.has(arg)) || args.includes("--dry-run") && apply || compareIndex >= 0 && (!comparePath || comparePath.startsWith("--"))) throw new Error("인수를 확인해 주세요. --help에서 사용법을 볼 수 있습니다.");
  const sourcePath = input || new URL("../../data/prayer-guides-ko.json", import.meta.url);
  const bytes = await readFile(sourcePath);
  const source = JSON.parse(bytes.toString("utf8"));
  const analysis = analyzeSource(source);
  const other = comparePath ? JSON.parse(await readFile(comparePath, "utf8")) : null;
  const comparison = other === null ? null : compareSources(source, other);
  const second = other === null ? null : analyzeSource(other);
  const report = { mode: apply ? "apply" : "dry-run", sha256: createHash("sha256").update(bytes).digest("hex"), semanticSha256: semanticDigest(source), scanned: analysis.scanned, valid: analysis.records.length, inserted: 0, skipped: 0, failed: analysis.issues.length ? analysis.scanned - analysis.records.length : 0, duplicateContent: analysis.duplicates, issues: analysis.issues, comparison, comparisonIssues: second?.issues ?? [], databaseAccessed: false };
  if (analysis.issues.length || second?.issues.length || comparison && !comparison.equal) {
    console.log(JSON.stringify(report, null, 2));
    throw new Error(comparison && !comparison.equal ? "원본 간 차이가 있어 실제 적재를 보류합니다. 임의로 합치거나 최신 원본을 선택하지 않았습니다." : "전체 검증에 실패하여 적재하지 않았습니다.");
  }
  if (!apply) { console.log(JSON.stringify(report, null, 2)); return; }
  const { client, legacy } = createPrayerSeedClient();
  const result = await seedRecords(client, analysis.records);
  console.log(JSON.stringify({ ...report, ...result, databaseAccessed: true, legacyServerKeyFallback: legacy }, null, 2));
  if (result.failed) process.exitCode = 1;
}
main().catch(error => {
  // Environment/validation errors are authored messages. Never log SDK requests, headers or keys.
  const known = error instanceof Error && !error.message.includes("sb_secret_") && !error.message.includes("eyJ");
  console.error(known && (error.message.includes("설정") || error.message.includes("적재") || error.message.includes("인수") || error.message.includes("검증") || error.message.includes("프로젝트") || error.message.includes("운영 배포")) ? error.message : "원본 JSON 경로·형식과 과제용 연결 설정을 확인해 주세요.");
  process.exitCode = 1;
});
