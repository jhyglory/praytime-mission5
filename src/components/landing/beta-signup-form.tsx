"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { SelectionControl } from "@/components/ui/selection-control";
import {
  ageOptions,
  appOptions,
  fieldErrorsFrom,
  osOptions,
  reasonOptions,
  reductionOptions,
  signupSchema,
  type FieldErrors,
  type SignupInput,
} from "@/lib/beta-signup";

type FormStatus = "idle" | "submitting" | "success" | "error" | "duplicate";
type FormValues = Omit<SignupInput, "os" | "consent"> & {
  os: SignupInput["os"] | "";
  consent: boolean;
};
const initial: FormValues = {
  nickname: "",
  email: "",
  os: "",
  signup_reason: [],
  age_range: null,
  target_apps: [],
  reduction_methods: [],
  consent: false,
};
const resultCopy = {
  submitting: [
    "신청을 접수하고 있습니다.",
    "중복 제출을 막고, 응답을 기다립니다.",
  ],
  success: ["사전신청이 접수되었습니다.", "관심을 보내주셔서 감사합니다."],
  error: [
    "신청을 접수하지 못했습니다.",
    "입력 내용은 유지됩니다. 잠시 후 다시 시도해주세요.",
  ],
  duplicate: ["이미 신청된 이메일입니다.", "기존 신청 내역이 있습니다."],
};

function attribution() {
  const params = new URLSearchParams(window.location.search);
  const value = (key: string) => params.get(key)?.slice(0, 200) || null;
  return {
    utm_source: value("utm_source"),
    utm_medium: value("utm_medium"),
    utm_campaign: value("utm_campaign"),
    utm_content: value("utm_content"),
    referrer: document.referrer.slice(0, 500) || null,
  };
}

export function BetaSignupForm() {
  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const form = useRef<HTMLFormElement>(null);
  const busy = useRef(false);
  const conversionSent = useRef(false);
  const company = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormValues>(name: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (status === "duplicate" || status === "error") setStatus("idle");
  }
  function toggle(
    name: "signup_reason" | "target_apps" | "reduction_methods",
    option: string,
  ) {
    const current = values[name] as string[];
    update(
      name,
      (current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]) as FormValues[typeof name],
    );
  }
  function focusInvalid(nextErrors: FieldErrors) {
    const first = [
      "nickname",
      "email",
      "os",
      "signup_reason",
      "age_range",
      "target_apps",
      "reduction_methods",
      "consent",
    ].find((name) => nextErrors[name as keyof SignupInput]);
    if (first)
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLInputElement>(`[name="${first}"]`)
          ?.focus(),
      );
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || status === "success") return;
    const parsed = signupSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors = fieldErrorsFrom(parsed.error.issues);
      setErrors(nextErrors);
      focusInvalid(nextErrors);
      return;
    }
    setErrors({});
    busy.current = true;
    setStatus("submitting");
    try {
      const response = await fetch("/api/beta-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          company: company.current?.value ?? "",
          attribution: attribution(),
        }),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json();
      if (
        response.status === 201 &&
        result.status === "success" &&
        result.receipt === true
      ) {
        setStatus("success");
        if (!conversionSent.current) {
          conversionSent.current = true;
          // Integration hook only. No analytics service or personal data is added.
          window.dispatchEvent(new CustomEvent("praytime:beta-signup-success"));
        }
        window.alert(`${resultCopy.success[0]}\n${resultCopy.success[1]}`);
      } else if (response.status === 409 && result.status === "duplicate") {
        setStatus("duplicate");
      } else if (
        response.status === 422 &&
        result.status === "invalid" &&
        result.errors
      ) {
        setStatus("idle");
        setErrors(result.errors);
        focusInvalid(result.errors);
      } else setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }
  const association = (name: keyof SignupInput, helper?: string) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby":
      [helper, errors[name] ? `${name}-error` : null]
        .filter(Boolean)
        .join(" ") || undefined,
  });
  const error = (name: keyof SignupInput) =>
    errors[name] ? (
      <p
        id={`${name}-error`}
        className="field-error text-[#ff948c] text-sm leading-[22px]"
        role="alert"
      >
        {errors[name]}
      </p>
    ) : null;
  const disabled = status === "submitting" || status === "success";
  return (
    <div className="beta-form-column min-w-0">
      <form
        ref={form}
        onSubmit={submit}
        noValidate
        className="beta-form flex flex-col gap-8"
        aria-label="베타 사전예약"
        aria-busy={status === "submitting"}
      >
        <div
          className="form-field flex min-w-0 flex-col gap-2 m-0 p-0 border-0 border-none"
          data-form-group="nickname"
        >
          <label htmlFor="nickname">이름 또는 닉네임 *</label>
          <input
            className="text-input w-full min-w-0 h-14 px-4 rounded-control border border-[rgb(241_241_238/45%)] text-foreground bg-surface transition-[border-color,background-color] duration-[var(--motion-ui-duration)] ease-praytime"
            id="nickname"
            name="nickname"
            autoComplete="nickname"
            value={values.nickname}
            placeholder="안내받을 이름을 적어주세요"
            onChange={(event) => update("nickname", event.target.value)}
            disabled={disabled}
            required
            {...association("nickname")}
          />
          {error("nickname")}
        </div>
        <div
          className="form-field flex min-w-0 flex-col gap-2 m-0 p-0 border-0 border-none"
          data-form-group="email"
        >
          <label htmlFor="email">이메일 *</label>
          <input
            className="text-input w-full min-w-0 h-14 px-4 rounded-control border border-[rgb(241_241_238/45%)] text-foreground bg-surface transition-[border-color,background-color] duration-[var(--motion-ui-duration)] ease-praytime"
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            placeholder="you@example.com"
            onChange={(event) => update("email", event.target.value)}
            disabled={disabled}
            required
            {...association("email", "email-helper")}
          />
          <p
            className="small-copy text-muted-foreground text-sm leading-[22px] font-normal"
            id="email-helper"
          >
            베타 안내를 받을 이메일을 적어주세요.
          </p>
          {error("email")}
        </div>
        <fieldset
          className="form-field flex min-w-0 flex-col gap-2 m-0 p-0 border-0 border-none"
          data-form-group="os"
          disabled={disabled}
          {...association("os")}
        >
          <legend>사용 기기 *</legend>
          <div className="options-grid grid grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2 options-grid--os grid-cols-1 lg:grid-cols-3">
            {osOptions.map((option) => (
              <SelectionControl
                key={option}
                name="os"
                type="radio"
                label={option}
                value={option}
                checked={values.os === option}
                onChange={() => update("os", option)}
                required
                {...association("os")}
              />
            ))}
          </div>
          {error("os")}
        </fieldset>
        <fieldset
          className="form-field flex min-w-0 flex-col gap-2 m-0 p-0 border-0 border-none"
          data-form-group="signup_reason"
          disabled={disabled}
          {...association("signup_reason")}
        >
          <legend>
            어떤 이유로 신청하시나요?
            <br />
            (복수 선택 가능) *
          </legend>
          <div className="options-grid grid grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2 options-grid--reasons">
            {reasonOptions.map((option) => (
              <SelectionControl
                key={option}
                name="signup_reason"
                label={option}
                value={option}
                checked={(values.signup_reason as readonly string[]).includes(
                  option,
                )}
                onChange={() => toggle("signup_reason", option)}
                {...association("signup_reason")}
              />
            ))}
          </div>
          {error("signup_reason")}
        </fieldset>
        <div
          className="form-field flex min-w-0 flex-col gap-2 m-0 p-0 border-0 border-none"
          data-form-group="age_range"
        >
          <label htmlFor="age_range">연령대 (선택)</label>
          <select
            className="text-input w-full min-w-0 h-14 px-4 rounded-control border border-[rgb(241_241_238/45%)] text-foreground bg-surface transition-[border-color,background-color] duration-[var(--motion-ui-duration)] ease-praytime"
            id="age_range"
            name="age_range"
            value={values.age_range ?? ""}
            onChange={(event) =>
              update(
                "age_range",
                event.target.value
                  ? (event.target.value as SignupInput["age_range"])
                  : null,
              )
            }
            disabled={disabled}
            {...association("age_range")}
          >
            <option value="">선택해 주세요</option>
            {ageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error("age_range")}
        </div>
        <fieldset
          className="form-field flex min-w-0 flex-col gap-2 m-0 p-0 border-0 border-none"
          data-form-group="target_apps"
          disabled={disabled}
          {...association("target_apps")}
        >
          <legend>
            가장 줄이고 싶은 앱<br />
            (선택, 복수 선택 가능)
          </legend>
          <div className="options-grid grid grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2 options-grid--apps grid-cols-2 lg:grid-cols-3">
            {appOptions.map((option) => (
              <SelectionControl
                key={option}
                name="target_apps"
                label={option}
                value={option}
                checked={(values.target_apps as readonly string[]).includes(
                  option,
                )}
                onChange={() => toggle("target_apps", option)}
                {...association("target_apps")}
              />
            ))}
          </div>
          {error("target_apps")}
        </fieldset>
        <fieldset
          className="form-field flex min-w-0 flex-col gap-2 m-0 p-0 border-0 border-none"
          data-form-group="reduction_methods"
          disabled={disabled}
          {...association("reduction_methods")}
        >
          <legend>
            최근 3개월 내 사용을 줄이려고 해본 방법
            <br /> (선택, 복수 선택 가능)
          </legend>
          <div className="options-grid grid grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2 options-grid--methods">
            {reductionOptions.map((option) => (
              <SelectionControl
                key={option}
                name="reduction_methods"
                label={option}
                value={option}
                checked={(
                  values.reduction_methods as readonly string[]
                ).includes(option)}
                onChange={() => toggle("reduction_methods", option)}
                {...association("reduction_methods")}
              />
            ))}
          </div>
          {error("reduction_methods")}
        </fieldset>
        <div hidden aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input
            ref={company}
            id="company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <fieldset
          className="form-field flex min-w-0 flex-col gap-2 m-0 p-0 border-0 border-none consent-field gap-2"
          data-form-group="consent"
          disabled={disabled}
        >
          <legend className="sr-only">필수 동의</legend>
          <SelectionControl
            id="consent"
            name="consent"
            label="[필수] 개인정보처리방침을 확인했으며 베타 신청 정보 수집 및 이용에 동의합니다."
            checked={values.consent}
            onChange={(event) => update("consent", event.target.checked)}
            required
            {...association("consent")}
          />
          <a
            className="privacy-link inline-flex items-center min-h-11 underline underline-offset-4 text-sm leading-[26px] font-medium"
            href="https://praytime.glorifier.kr/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            개인정보처리방침 보기
          </a>
          {error("consent")}
        </fieldset>
        <div className="submit-zone flex flex-col gap-3">
          <Button
            type="submit"
            state={status === "submitting" ? "submitting" : undefined}
            disabled={!values.consent || disabled}
          >
            {status === "submitting" ? "접수 중…" : "무료 사전예약하기"}
          </Button>
          <p className="small-copy text-muted-foreground text-sm leading-[22px] font-normal">
            * 표시 항목과 필수 동의를 확인해 주세요.
          </p>
        </div>
      </form>
      <div className="form-result-region" aria-live="polite" aria-atomic="true">
        {status !== "idle" && (
          <div
            className={`form-result flex flex-col gap-3 border border-[var(--line)] rounded-[18px] bg-surface p-6 mt-6 form-result--${status}`}
            role={
              status === "error" || status === "duplicate" ? "alert" : "status"
            }
          >
            <p className="result-heading text-2xl leading-[34px] font-bold">
              {resultCopy[status][0]}
            </p>
            <p className="small-copy text-muted-foreground text-sm leading-[22px] font-normal">
              {resultCopy[status][1]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
