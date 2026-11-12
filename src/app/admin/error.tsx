"use client";
import { cmsAction } from "@/components/prayers/ui";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div role="alert">
      <h2 className="!text-2xl !leading-9">화면을 불러오지 못했습니다</h2>
      <p className="my-4">
        잠시 후 다시 시도해 주세요. 저장 결과가 불확실하면 목록을 먼저 확인해
        주세요.
      </p>
      <button className={cmsAction} onClick={reset}>
        다시 시도
      </button>
    </div>
  );
}
