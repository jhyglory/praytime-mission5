import Link from "next/link";
import { redirect } from "next/navigation";
import { listPrayers, CmsError } from "@/lib/prayers/store";
import {
  CmsConnectionError,
  CmsState,
  cmsAction,
  displayDate,
  returnPage,
} from "@/components/prayers/ui";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export default async function PrayersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const page = returnPage(query.page);
  if (
    query.page !== undefined &&
    (Array.isArray(query.page) || query.page !== String(page))
  )
    redirect("/admin/prayers?page=1");
  let result;
  try {
    result = await listPrayers(page);
  } catch (error) {
    return (
      <>
        <h1 className="mb-6 !text-3xl !leading-10">기도문 목록</h1>
        <CmsConnectionError
          configured={
            error instanceof CmsError && error.code !== "CONFIGURATION_REQUIRED"
          }
        />
      </>
    );
  }
  if (result.page !== page)
    redirect(
      `/admin/prayers?page=${result.page}${query.warning ? "&warning=" + encodeURIComponent(String(query.warning)) : ""}`,
    );
  return (
    <>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="!text-3xl !leading-10">기도문 목록</h1>
          <p className="mt-2 text-sm text-ink/70">
            전체 {result.total}개 · 최신 수정순
          </p>
        </div>
        <Button asChild className="!h-12 !min-h-12 !text-base">
          <Link href="/admin/prayers/new">새 기도문 등록</Link>
        </Button>
      </div>
      {query.warning && (
        <p
          className="mb-6 rounded-control border border-ink/20 bg-white p-4 text-sm leading-6"
          role="status"
        >
          {String(query.warning).slice(0, 500)}
        </p>
      )}
      {!result.total ? (
        <CmsState title="등록된 기도문이 없습니다">
          <p>새 기도문을 등록하거나 초기 데이터 적재를 진행해 주세요.</p>
          <Link
            href="/admin/prayers/new"
            className="mt-3 inline-block underline underline-offset-4"
          >
            첫 기도문 등록하기
          </Link>
        </CmsState>
      ) : (
        <>
          <ul className="space-y-3" aria-label="등록된 기도문">
            {result.items.map((prayer) => (
              <li
                key={prayer.id}
                className="rounded-action border border-ink/15 bg-white p-5"
              >
                <Link
                  href={`/admin/prayers/${prayer.id}?page=${result.page}`}
                  className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                >
                  <h2 className="!text-lg !font-medium !leading-8">
                    {prayer.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs leading-5 text-ink/65">
                    <span>{prayer.category || "분류 없음"}</span>
                    <time dateTime={prayer.updated_at}>
                      수정 {displayDate(prayer.updated_at)}
                    </time>
                    <span>상세 보기 →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <nav
            aria-label="기도문 페이지"
            className="mt-8 flex flex-wrap items-center justify-between gap-4"
          >
            {result.page > 1 ? (
              <Link
                className={cmsAction}
                href={`/admin/prayers?page=${result.page - 1}`}
              >
                ← 이전
              </Link>
            ) : (
              <span aria-disabled="true" className={`${cmsAction} opacity-40`}>
                ← 이전
              </span>
            )}
            <p className="text-sm" aria-live="polite">
              {result.page} / {result.pageCount} 페이지
            </p>
            {result.page < result.pageCount ? (
              <Link
                className={cmsAction}
                href={`/admin/prayers?page=${result.page + 1}`}
              >
                다음 →
              </Link>
            ) : (
              <span aria-disabled="true" className={`${cmsAction} opacity-40`}>
                다음 →
              </span>
            )}
          </nav>
        </>
      )}
    </>
  );
}
