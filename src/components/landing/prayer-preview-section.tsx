import Link from "next/link";
import { listPrayers } from "@/lib/prayers/store";

export async function PrayerPreviewSection() {
  let prayer;
  let failed = false;
  try {
    prayer = (await listPrayers(1)).items[0];
  } catch {
    failed = true;
  }
  return (
    <section
      className="light-section bg-paper py-12 text-ink"
      aria-labelledby="prayer-preview-heading"
    >
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="prayer-preview-heading" className="!text-xl !leading-8">
            기도 가이드 미리보기
          </h2>
          <Link
            href="/admin/prayers"
            className="text-sm underline underline-offset-4"
          >
            기도문 관리 화면 →
          </Link>
        </div>
        <div className="mt-5 rounded-action border border-ink/10 bg-white p-5 md:p-6">
          {failed ? (
            <p className="text-sm leading-6 text-ink/70">
              기도문 DB 연결 설정이 필요하거나 일시적으로 불러올 수 없습니다.
              관리 화면에서 연결 상태를 확인해 주세요.
            </p>
          ) : prayer ? (
            <>
              <p className="text-xs text-ink/60">
                {prayer.category || "기도 가이드"}
              </p>
              <h3 className="mt-2 text-lg font-medium leading-8">
                {prayer.title}
              </h3>
              <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-7 text-ink/75">
                {prayer.content}
              </p>
              <Link
                href={`/admin/prayers/${prayer.id}`}
                className="mt-4 inline-block text-sm underline underline-offset-4"
              >
                기도문 전체 읽기
              </Link>
            </>
          ) : (
            <p className="text-sm text-ink/70">
              아직 등록된 기도문이 없습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
