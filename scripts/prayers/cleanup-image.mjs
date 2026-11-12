#!/usr/bin/env node
import { createPrayerSeedClient } from "./client.mjs";
import { cleanupOrphanImage, validPrayerImagePath } from "./cleanup-lib.mjs";

const args = process.argv.slice(2);
const path = args.find(arg => !arg.startsWith("--"));
const apply = args.includes("--apply");
if (args.includes("--help")) {
  console.log("node --experimental-strip-types scripts/prayers/cleanup-image.mjs prayers/<record-uuid>/<upload-uuid>.<jpg|jpeg|png|webp> [--dry-run | --apply]\nDefault: validate one recorded path only; no network access. --apply checks exact DB references, refuses linked paths, then removes only the named orphan from prayer-covers.");
  process.exit(0);
}
async function main() {
  if (args.filter(arg => !arg.startsWith("--")).length !== 1 || args.some(arg => arg.startsWith("--") && !["--apply", "--dry-run"].includes(arg)) || apply && args.includes("--dry-run") || !validPrayerImagePath(path)) throw new Error("invalid arguments");
  if (!apply) {
    console.log(JSON.stringify({ mode: "dry-run", path, valid: true, linkedStatus: "not_checked", removed: false, databaseAccessed: false, storageAccessed: false }, null, 2));
    return;
  }
  const { client } = createPrayerSeedClient();
  const result = await cleanupOrphanImage(client, path);
  console.log(JSON.stringify({ mode: "apply", path, ...result }, null, 2));
  if (!["removed", "already_missing"].includes(result.status)) process.exitCode = 1;
}
main().catch(() => {
  console.error("과제용 연결 설정과 기록된 이미지 경로를 확인해 주세요. 정리되지 않은 경로는 같은 명령으로 재시도할 수 있습니다. --help에서 사용법을 볼 수 있습니다.");
  process.exitCode = 1;
});
