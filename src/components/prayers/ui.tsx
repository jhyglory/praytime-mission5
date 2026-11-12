import Link from "next/link";
import type { ReactNode } from "react";

export const cmsInput =
  "w-full min-w-0 rounded-control border border-ink/30 bg-white px-4 py-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:opacity-60";
export const cmsAction =
  "inline-flex min-h-11 items-center justify-center rounded-control border border-ink/25 bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-wait disabled:opacity-50";

export function CmsState({
  title,
  children,
  role,
}: {
  title: string;
  children: ReactNode;
  role?: "alert" | "status";
}) {
  return (
    <div
      className="rounded-action border border-ink/15 bg-white p-6"
      role={role}
    >
      <h2 className="!text-xl !leading-8">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-ink/75">{children}</div>
    </div>
  );
}

export function CmsConnectionError({
  configured = false,
}: {
  configured?: boolean;
}) {
  return (
    <CmsState
      title={
        configured
          ? "기도문을 불러오지 못했습니다"
          : "기도문 DB 연결 설정을 확인해 주세요"
      }
      role="alert"
    >
      <p>
        {configured
          ? "일시적인 연결 오류일 수 있습니다. 잠시 후 다시 시도해 주세요."
          : "과제용 Supabase 연결 또는 서버 환경변수 설정이 필요합니다. 기도문이 없는 상태와는 다릅니다."}
      </p>
      <p className="mt-3">
        <Link className="underline underline-offset-4" href="/admin/prayers">
          다시 불러오기
        </Link>
      </p>
    </CmsState>
  );
}

export function displayDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
export function returnPage(value: string | string[] | undefined) {
  const s = Array.isArray(value) ? value[0] : value;
  return s && /^[1-9]\d*$/.test(s) && Number.isSafeInteger(Number(s))
    ? Number(s)
    : 1;
}
