import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GapLightPreview } from "@/components/dev/gap-light-preview";

export const metadata: Metadata = {
  title: "빛의 틈 · 로컬 모션 미리보기",
  description: "PrayTime 빛의 틈 모션 초안 검수 전용 화면",
  robots: { index: false, follow: false },
};

export default function GapLightPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <GapLightPreview />;
}
