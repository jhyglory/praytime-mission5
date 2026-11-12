import { z } from "zod";

export const PAGE_SIZE = 20;
export const PRAYER_LIMITS = {
  title: 300, content: 20_000, category: 80, category_full: 200,
  keyword: 100, scripture_ref: 200, scripture_text: 2_000, language: 16,
} as const;

// Validate whitespace without changing meaningful line breaks or the supplied text.
const requiredText = (max: number, label: string) => z.string({ error: `${label}을 입력해 주세요.` })
  .min(1, `${label}을 입력해 주세요.`)
  .max(max, `${label}은 ${max.toLocaleString("ko-KR")}자 이하로 입력해 주세요.`)
  .refine(value => value.trim().length > 0, `${label}을 입력해 주세요.`);
const optionalText = (max: number, label: string) => z.string({ error: `${label} 형식을 확인해 주세요.` })
  .max(max, `${label}은 ${max.toLocaleString("ko-KR")}자 이하로 입력해 주세요.`)
  .nullable().optional().transform(value => value?.trim() ? value : null);

export const PrayerInputSchema = z.object({
  title: requiredText(PRAYER_LIMITS.title, "제목"),
  content: requiredText(PRAYER_LIMITS.content, "기도문 본문"),
  category: optionalText(PRAYER_LIMITS.category, "카테고리"),
  category_full: optionalText(PRAYER_LIMITS.category_full, "카테고리 설명"),
  keyword: optionalText(PRAYER_LIMITS.keyword, "키워드"),
  scripture_ref: optionalText(PRAYER_LIMITS.scripture_ref, "성경구절 출처"),
  scripture_text: optionalText(PRAYER_LIMITS.scripture_text, "성경구절 본문"),
  language: z.string({ error: "언어 코드를 확인해 주세요." }).min(2, "언어 코드를 입력해 주세요.").max(PRAYER_LIMITS.language, "언어 코드는 16자 이하로 입력해 주세요.")
    .regex(/^[a-z]{2,3}(?:-[A-Z]{2})?$/, "언어 코드를 확인해 주세요. (예: ko, en, en-US)")
    .default("ko"),
}).strict();

export type PrayerInput = z.infer<typeof PrayerInputSchema>;
export type Prayer = PrayerInput & {
  id: string;
  source_key: string | null;
  image_path: string | null;
  source_payload: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export function isPrayerId(value: string): boolean {
  return z.uuid().safeParse(value).success;
}
