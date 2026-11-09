import { z } from "zod";

export const osOptions = ["iPhone", "Android", "둘 다 / 잘 모르겠어요"] as const;
export const reasonOptions = ["SNS·숏폼 사용을 줄이고 싶어서", "무심코 SNS를 여는 습관을 줄이고 싶어서", "스마트폰을 보는 시간을 기도로 바꾸고 싶어서", "기도 습관을 만들고 싶어서", "자녀의 스마트폰 사용을 관리하고 싶어서", "PrayTime이 어떤 서비스인지 궁금해서", "기타"] as const;
export const ageOptions = ["10대", "20~24", "25~29", "30~34", "35~39", "40대", "50대", "60대 이상"] as const;
export const appOptions = ["Instagram", "YouTube", "TikTok", "Threads", "X", "기타"] as const;
export const reductionOptions = ["iPhone 스크린타임 / Android 디지털 웰빙", "별도 차단 앱", "앱 삭제 또는 로그아웃", "알림 끄기", "집중모드", "스스로 사용시간 정하기 / 디지털 금식", "해본 적 없음"] as const;

export const signupSchema = z.object({
  nickname: z.string().trim().min(1, "이름(닉네임)을 입력해 주세요.").max(40, "이름이 너무 깁니다."),
  email: z.string().trim().min(1, "이메일을 입력해 주세요.").max(255, "이메일이 너무 깁니다.").pipe(z.email("올바른 이메일 주소를 입력해 주세요.")).transform(value => value.toLowerCase()),
  os: z.enum(osOptions, { error: "사용 기기를 선택해 주세요." }),
  signup_reason: z.array(z.enum(reasonOptions)).min(1, "신청 사유를 선택해 주세요.").max(7),
  age_range: z.enum(ageOptions).nullable(),
  target_apps: z.array(z.enum(appOptions)).max(6),
  reduction_methods: z.array(z.enum(reductionOptions)).max(7),
  consent: z.literal(true, { error: "개인정보 수집 및 이용에 동의해 주세요." }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type FieldErrors = Partial<Record<keyof SignupInput, string>>;
export const attributionSchema = z.object({
  utm_source: z.string().max(200).nullable().default(null),
  utm_medium: z.string().max(200).nullable().default(null),
  utm_campaign: z.string().max(200).nullable().default(null),
  utm_content: z.string().max(200).nullable().default(null),
  referrer: z.string().max(500).nullable().default(null),
});
export const requestSchema = signupSchema.extend({
  company: z.string().max(200).default(""),
  attribution: attributionSchema.default({ utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, referrer: null }),
});

export type SignupRequest = z.infer<typeof requestSchema>;
export type SignupPayload = Omit<SignupInput, "consent" | "signup_reason"> & { signup_reason: string } & z.infer<typeof attributionSchema>;

export function toPayload(input: SignupRequest): SignupPayload {
  // Business fields shared with the legacy form; the server adds consent metadata.
  return {
    nickname: input.nickname,
    email: input.email,
    os: input.os,
    signup_reason: [...new Set(input.signup_reason)].join(", "),
    age_range: input.age_range,
    target_apps: [...new Set(input.target_apps)],
    reduction_methods: [...new Set(input.reduction_methods)],
    ...input.attribution,
  };
}

export function fieldErrorsFrom(issues: readonly { path: PropertyKey[]; message: string }[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0] as keyof SignupInput;
    if (key && !(key in errors)) errors[key] = issue.message;
  }
  return errors;
}
