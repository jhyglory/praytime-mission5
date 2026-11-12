"use client";
/* eslint-disable @next/next/no-img-element -- Local previews and server-mediated image proxy. */

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PrayerInputSchema, type Prayer } from "@/lib/prayers/model";
import { cmsAction, cmsInput } from "./ui";
import { PrayerImage } from "./prayer-image";

type Values = Record<
  | "title"
  | "content"
  | "category"
  | "category_full"
  | "keyword"
  | "scripture_ref"
  | "scripture_text"
  | "language",
  string
>;
type Result = {
  id?: string;
  warning?: string;
  error?: string;
  fields?: Record<string, string>;
};
const fields = [
  { key: "title", label: "제목", max: 300, required: true },
  { key: "category", label: "카테고리", max: 80 },
  { key: "category_full", label: "카테고리 설명", max: 200 },
  { key: "keyword", label: "주제어", max: 100 },
  { key: "language", label: "언어", max: 16, required: true },
  { key: "scripture_ref", label: "성경구절 출처", max: 200 },
  { key: "scripture_text", label: "성경구절 본문", max: 2000, multiline: true },
  {
    key: "content",
    label: "기도문 본문",
    max: 20000,
    multiline: true,
    required: true,
  },
] as const;

export function PrayerForm({
  prayer,
  page = 1,
}: {
  prayer?: Prayer;
  page?: number;
}) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const activeRequest = useRef<XMLHttpRequest | null>(null);
  const previewUrl = useRef<string | null>(null);
  const inFlight = useRef(false);
  const [values, setValues] = useState<Values>({
    title: prayer?.title ?? "",
    content: prayer?.content ?? "",
    category: prayer?.category ?? "",
    category_full: prayer?.category_full ?? "",
    keyword: prayer?.keyword ?? "",
    scripture_ref: prayer?.scripture_ref ?? "",
    scripture_text: prayer?.scripture_text ?? "",
    language: prayer?.language ?? "ko",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);
  const [imageAction, setImageAction] = useState<"keep" | "replace" | "remove">(
    "keep",
  );

  useEffect(
    () => () => {
      activeRequest.current?.abort();
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    },
    [],
  );
  function chooseFile(next: File | null) {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    const url = next ? URL.createObjectURL(next) : "";
    previewUrl.current = url || null;
    setFile(next);
    setPreview(url);
    setPreviewFailed(false);
  }

  function showErrors(next: Record<string, string>) {
    setErrors(next);
    requestAnimationFrame(() => {
      const first = form.current?.querySelector<HTMLElement>(
        "[aria-invalid='true']",
      );
      first?.focus();
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setFailure("");
    const parsed = PrayerInputSchema.safeParse(values);
    const issues: Record<string, string> = {};
    if (!parsed.success)
      for (const issue of parsed.error.issues)
        issues[String(issue.path[0])] ??= issue.message;
    if (imageAction === "replace" && !file)
      issues.image = "업로드할 이미지를 선택해 주세요.";
    if (file && imageAction === "replace") {
      if (file.size > 2_097_152 || file.size === 0)
        issues.image = "이미지는 0바이트보다 크고 2 MiB 이하여야 합니다.";
      else if (
        !/\.(jpe?g|png|webp)$/i.test(file.name) ||
        !["image/jpeg", "image/png", "image/webp"].includes(file.type)
      )
        issues.image = "JPEG, PNG, WebP 이미지만 선택해 주세요.";
    }
    if (Object.keys(issues).length) {
      showErrors(issues);
      return;
    }
    setErrors({});
    inFlight.current = true;
    setBusy(true);
    setProgress(file && imageAction === "replace" ? 0 : null);
    const data = new FormData();
    for (const [key, value] of Object.entries(values)) data.set(key, value);
    data.set("image_action", imageAction);
    if (file && imageAction === "replace") data.set("image", file);
    let navigating = false;
    try {
      const result = await new Promise<Result>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        activeRequest.current = xhr;
        xhr.open(
          prayer ? "PUT" : "POST",
          prayer ? `/api/prayers/${prayer.id}` : "/api/prayers",
        );
        xhr.timeout = 60_000;
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          let body: Result;
          try {
            body = JSON.parse(xhr.responseText);
          } catch {
            reject(
              new Error(
                "서버 응답을 확인하지 못했습니다. 목록에서 저장 여부를 확인한 후 다시 시도해 주세요.",
              ),
            );
            return;
          }
          if (xhr.status >= 200 && xhr.status < 300 && body.id) resolve(body);
          else {
            if (body.fields) showErrors(body.fields);
            reject(
              new Error(
                body.error ||
                  "저장하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.",
              ),
            );
          }
        };
        xhr.onerror = () =>
          reject(
            new Error(
              "네트워크 연결을 확인해 주세요. 저장 결과가 불확실하면 목록을 먼저 확인해 주세요.",
            ),
          );
        xhr.ontimeout = () =>
          reject(
            new Error(
              "응답이 지연되고 있습니다. 목록에서 저장 여부를 확인한 후 다시 시도해 주세요.",
            ),
          );
        xhr.onabort = () => reject(new Error("요청이 취소되었습니다."));
        xhr.send(data);
      });
      const query = new URLSearchParams({ page: String(page) });
      if (result.warning) query.set("warning", result.warning);
      navigating = true;
      router.push(`/admin/prayers/${result.id}?${query}`);
      router.refresh();
    } catch (error) {
      navigating = false;
      setFailure(
        error instanceof Error
          ? error.message
          : "저장하지 못했습니다. 다시 시도해 주세요.",
      );
    } finally {
      activeRequest.current = null;
      if (!navigating) {
        inFlight.current = false;
        setBusy(false);
        setProgress(null);
      }
    }
  }

  return (
    <form
      ref={form}
      onSubmit={submit}
      noValidate
      className="max-w-3xl space-y-6"
      aria-label={prayer ? "기도문 수정" : "기도문 등록"}
      aria-busy={busy}
    >
      <p className="text-sm leading-6 text-ink/70">
        * 항목은 필수입니다. 본문의 줄바꿈은 그대로 저장됩니다.
      </p>
      {fields.map((field) => {
        const name = field.key;
        const common = {
          id: `prayer-${name}`,
          name,
          value: values[name],
          disabled: busy,
          required: "required" in field && field.required,
          maxLength: field.max,
          "aria-invalid": Boolean(errors[name]),
          "aria-describedby": errors[name] ? `prayer-${name}-error` : undefined,
          className: cmsInput,
          onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => setValues((old) => ({ ...old, [name]: e.target.value })),
        };
        return (
          <div key={name} className="space-y-2">
            <label htmlFor={common.id} className="block text-sm font-medium">
              {field.label}
              {common.required ? " *" : " (선택)"}
            </label>
            {"multiline" in field && field.multiline ? (
              <textarea
                {...common}
                rows={name === "content" ? 10 : 4}
                className={`${cmsInput} resize-y leading-7`}
              />
            ) : (
              <input {...common} autoComplete="off" />
            )}
            {errors[name] && (
              <p id={`prayer-${name}-error`} className="text-sm text-[#b42318]">
                {errors[name]}
              </p>
            )}
          </div>
        );
      })}
      <fieldset
        disabled={busy}
        className="space-y-3 rounded-action border border-ink/15 p-5"
      >
        <legend className="px-2 text-sm font-medium">
          대표 이미지 (선택, 한 장)
        </legend>
        {prayer?.image_path && (
          <div className="flex flex-wrap gap-5 text-sm">
            <label className="flex min-h-11 items-center gap-2">
              <input
                type="radio"
                name="image_action"
                value="keep"
                checked={imageAction === "keep"}
                onChange={() => {
                  setImageAction("keep");
                  chooseFile(null);
                }}
              />
              기존 이미지 유지
            </label>
            <label className="flex min-h-11 items-center gap-2">
              <input
                type="radio"
                name="image_action"
                value="replace"
                checked={imageAction === "replace"}
                onChange={() => setImageAction("replace")}
              />
              새 이미지로 교체
            </label>
            <label className="flex min-h-11 items-center gap-2">
              <input
                type="radio"
                name="image_action"
                value="remove"
                checked={imageAction === "remove"}
                onChange={() => {
                  setImageAction("remove");
                  chooseFile(null);
                }}
              />
              이미지 제거
            </label>
          </div>
        )}
        <label htmlFor="prayer-image" className="block text-sm">
          JPEG · PNG · WebP, 최대 2 MiB
        </label>
        <input
          id="prayer-image"
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          disabled={
            busy || Boolean(prayer?.image_path && imageAction !== "replace")
          }
          aria-invalid={Boolean(errors.image)}
          aria-describedby={
            errors.image ? "prayer-image-error" : "prayer-image-help"
          }
          onChange={(e) => {
            const selected = e.target.files?.[0] ?? null;
            chooseFile(selected);
            setImageAction(selected ? "replace" : "keep");
          }}
          className="block min-h-11 max-w-full text-sm file:mr-3 file:rounded-lg file:border file:border-ink/25 file:bg-white file:px-4 file:py-2"
        />
        <p id="prayer-image-help" className="text-xs leading-5 text-ink/65">
          선택한 파일은 저장할 때 업로드됩니다. 개인 기도제목이나 개인정보가
          담긴 이미지는 올리지 마세요.
        </p>
        {errors.image && (
          <p id="prayer-image-error" className="text-sm text-[#b42318]">
            {errors.image}
          </p>
        )}
        {preview && !previewFailed && (
          <img
            src={preview}
            onError={() => setPreviewFailed(true)}
            alt="선택한 대표 이미지 미리보기"
            className="max-h-60 max-w-full rounded-control object-contain"
            width={640}
            height={360}
          />
        )}
        {!preview && prayer?.image_path && imageAction === "keep" && (
          <PrayerImage
            id={prayer.id}
            title={prayer.title}
            version={prayer.updated_at}
          />
        )}
        {previewFailed && (
          <p className="text-sm text-ink/65" role="status">
            선택한 이미지의 미리보기를 표시할 수 없습니다. 파일 형식을 확인해
            주세요.
          </p>
        )}
        {!preview && (!prayer?.image_path || imageAction === "remove") && (
          <p className="text-sm text-ink/65">연결된 대표 이미지가 없습니다.</p>
        )}
      </fieldset>
      <div role="status" aria-live="polite" className="text-sm text-ink/75">
        {busy &&
          (progress !== null
            ? progress < 100
              ? `이미지 업로드 중… ${progress}%`
              : "업로드 완료 · 기도문 저장 중…"
            : "기도문 저장 중…")}
      </div>
      {failure && (
        <p
          role="alert"
          className="rounded-control border border-[#b42318]/25 bg-white p-4 text-sm leading-6 text-[#b42318]"
        >
          {failure}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          state={busy ? "submitting" : "default"}
          className="!h-12 !min-h-12 !text-base"
        >
          {busy ? "저장 중…" : prayer ? "수정 저장" : "기도문 등록"}
        </Button>
        <Link
          aria-disabled={busy || undefined}
          tabIndex={busy ? -1 : undefined}
          onClick={(event) => {
            if (busy) event.preventDefault();
          }}
          className={`${cmsAction} ${busy ? "pointer-events-none opacity-50" : ""}`}
          href={
            prayer
              ? `/admin/prayers/${prayer.id}?page=${page}`
              : `/admin/prayers?page=${page}`
          }
        >
          취소
        </Link>
      </div>
    </form>
  );
}
