import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "기도문 관리 | PrayTime",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="light-section min-h-dvh bg-paper text-ink [color-scheme:light]">
      <a href="#cms-main" className="skip-link">
        관리 화면 본문으로
      </a>
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link
            href="/"
            className="text-lg font-medium tracking-[.16em]"
            aria-label="PrayTime 랜딩페이지"
          >
            PRAYTIME
          </Link>
          <nav
            aria-label="기도문 관리 메뉴"
            className="flex items-center gap-5 text-sm"
          >
            <Link
              href="/admin/prayers"
              className="underline-offset-4 hover:underline"
            >
              기도문 목록
            </Link>
            <Link
              href="/admin/prayers/new"
              className="underline-offset-4 hover:underline"
            >
              새 기도문
            </Link>
            <Link href="/" className="underline-offset-4 hover:underline">
              랜딩으로
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <p className="rounded-control border border-ink/15 bg-white px-4 py-3 text-sm leading-6 text-ink/75">
          인증 없는 과제용 관리 화면입니다. 누구나 등록·수정·삭제할 수 있습니다.
          공개 가능한 일반 기도문과 테스트 이미지만 사용해 주세요.
        </p>
      </div>
      <main
        id="cms-main"
        tabIndex={-1}
        className="mx-auto max-w-6xl px-6 py-10 md:py-14"
      >
        {children}
      </main>
    </div>
  );
}
