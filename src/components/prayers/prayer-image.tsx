"use client";
/* eslint-disable @next/next/no-img-element -- Local previews and server-mediated image proxy. */
import { useState } from "react";
export function PrayerImage({
  id,
  title,
  version,
}: {
  id: string;
  title: string;
  version: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return failed ? (
    <p
      className="rounded-control border border-ink/15 p-4 text-sm"
      role="status"
    >
      대표 이미지를 불러오지 못했습니다. 기도문 본문은 계속 읽을 수 있습니다.
    </p>
  ) : (
    <figure className="relative overflow-hidden rounded-action border border-ink/10 bg-ink/5">
      <img
        className="max-h-[480px] w-full object-contain"
        src={`/api/prayers/${id}/image?v=${encodeURIComponent(version)}`}
        alt={`${title} 대표 이미지`}
        width={960}
        height={540}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {!loaded && (
        <figcaption
          className="absolute inset-x-0 top-4 text-center text-sm"
          role="status"
        >
          이미지 불러오는 중…
        </figcaption>
      )}
    </figure>
  );
}
