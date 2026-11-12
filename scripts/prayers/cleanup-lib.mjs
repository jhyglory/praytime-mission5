import { isPrayerId } from "../../src/lib/prayers/model.ts";

export function validPrayerImagePath(path) {
  if (typeof path !== "string") return false;
  const match = /^prayers\/([0-9a-f-]{36})\/([0-9a-f-]{36})\.(jpg|jpeg|png|webp)$/.exec(path);
  return Boolean(match && isPrayerId(match[1]) && isPrayerId(match[2]));
}

/** Reprocess one recorded cleanup failure. No bucket scan or row mutation. */
export async function cleanupOrphanImage(client, path) {
  if (!validPrayerImagePath(path)) return { status: "invalid", removed: false, message: "기도문 이미지 경로 형식이 올바르지 않습니다." };
  try {
    const { count, error } = await client.from("prayers").select("id", { count: "exact", head: true }).eq("image_path", path);
    if (error || typeof count !== "number" || count < 0) return { status: "error", removed: false, message: "이미지 연결 상태를 확인하지 못해 정리하지 않았습니다." };
    if (count > 0) return { status: "linked", removed: false, message: "현재 기도문에 연결된 이미지이므로 정리를 거부했습니다." };
    const result = await client.storage.from("prayer-covers").remove([path]);
    if (result.error || !Array.isArray(result.data)) return { status: "error", removed: false, message: "미연결 이미지 정리에 실패했습니다. 같은 경로로 재시도할 수 있습니다." };
    return { status: result.data.length ? "removed" : "already_missing", removed: result.data.length > 0, message: result.data.length ? "지정한 미연결 이미지 한 건을 정리했습니다." : "지정한 이미지는 이미 존재하지 않습니다." };
  } catch {
    return { status: "error", removed: false, message: "연결 또는 정리 결과를 확인하지 못했습니다. 같은 경로로 재시도해 주세요." };
  }
}
