import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrayer, CmsError } from "@/lib/prayers/store";
import { isPrayerId } from "@/lib/prayers/model";
import {
  CmsConnectionError,
  cmsAction,
  displayDate,
  returnPage,
} from "@/components/prayers/ui";
import { PrayerImage } from "@/components/prayers/prayer-image";
import { DeletePrayer } from "@/components/prayers/delete-prayer";

export const dynamic = "force-dynamic";
export default async function PrayerDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  if (!isPrayerId(id)) notFound();
  const query = await searchParams;
  const page = returnPage(query.page);
  let prayer;
  try {
    prayer = await getPrayer(id);
  } catch (error) {
    return (
      <CmsConnectionError
        configured={
          error instanceof CmsError && error.code !== "CONFIGURATION_REQUIRED"
        }
      />
    );
  }
  if (!prayer) notFound();
  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={`/admin/prayers?page=${page}`}
        className="mb-5 inline-block text-sm underline underline-offset-4"
      >
        ← 목록으로
      </Link>
      {query.warning && (
        <p
          className="mb-5 rounded-control border border-ink/20 bg-white p-4 text-sm"
          role="status"
        >
          {String(query.warning).slice(0, 500)}
        </p>
      )}
      <header className="mb-8">
        <p className="mb-3 text-sm text-ink/65">
          {prayer.category_full || prayer.category || "분류 없음"}
          {prayer.keyword ? ` · ${prayer.keyword}` : ""}
        </p>
        <h1 className="!text-3xl !leading-[1.5]">{prayer.title}</h1>
        <p className="mt-4 text-xs text-ink/65">
          언어 {prayer.language} · 수정{" "}
          <time dateTime={prayer.updated_at}>
            {displayDate(prayer.updated_at)}
          </time>
        </p>
      </header>
      {prayer.image_path ? (
        <PrayerImage
          id={prayer.id}
          title={prayer.title}
          version={prayer.updated_at}
        />
      ) : (
        <p className="mb-6 rounded-control border border-ink/10 p-4 text-sm text-ink/65">
          대표 이미지 없음
        </p>
      )}
      {(prayer.scripture_ref || prayer.scripture_text) && (
        <section
          className="my-7 rounded-action border-l-2 border-signal bg-white p-5"
          aria-label="성경구절"
        >
          <h2 className="!text-base !font-medium !leading-7">
            {prayer.scripture_ref || "성경구절"}
          </h2>
          {prayer.scripture_text && (
            <p className="mt-2 whitespace-pre-wrap break-words text-base leading-8">
              {prayer.scripture_text}
            </p>
          )}
        </section>
      )}
      <section className="my-8" aria-labelledby="prayer-content-heading">
        <h2 id="prayer-content-heading" className="mb-4 !text-lg !leading-8">
          기도문
        </h2>
        <p className="whitespace-pre-wrap break-words text-lg leading-9">
          {prayer.content}
        </p>
      </section>
      {prayer.source_key && (
        <p className="mb-6 break-all text-xs leading-5 text-ink/60">
          원본 식별자: {prayer.source_key}
        </p>
      )}
      <div className="flex flex-wrap gap-3 border-t border-ink/15 pt-6">
        <Link
          className={cmsAction}
          href={`/admin/prayers/${id}/edit?page=${page}`}
        >
          수정
        </Link>
        <DeletePrayer id={id} title={prayer.title} page={page} />
      </div>
    </article>
  );
}
