"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cmsAction } from "./ui";

export function DeletePrayer({
  id,
  title,
  page = 1,
}: {
  id: string;
  title: string;
  page?: number;
}) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const active = useRef(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  async function remove() {
    if (active.current) return;
    active.current = true;
    setBusy(true);
    setFailure("");
    try {
      const response = await fetch(`/api/prayers/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "삭제하지 못했습니다. 다시 시도해 주세요.",
        );
      dialog.current?.close();
      const query = new URLSearchParams({ page: String(page) });
      if (data.warning) query.set("warning", data.warning);
      router.push(`/admin/prayers?${query}`);
      router.refresh();
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : "삭제하지 못했습니다. 다시 시도해 주세요.",
      );
    } finally {
      active.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <button
        type="button"
        className={`${cmsAction} !border-[#b42318]/30 !text-[#b42318]`}
        onClick={() => {
          setFailure("");
          dialog.current?.showModal();
          cancel.current?.focus();
        }}
      >
        삭제
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="delete-prayer-title"
        aria-describedby="delete-prayer-description"
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
        className="fixed inset-0 m-auto w-[min(480px,calc(100%_-_32px))] rounded-action border border-ink/20 bg-paper p-6 text-ink shadow-xl backdrop:bg-navy/70"
      >
        <h2 id="delete-prayer-title" className="!text-2xl !leading-9">
          기도문을 삭제할까요?
        </h2>
        <p
          id="delete-prayer-description"
          className="mt-4 whitespace-pre-wrap break-words text-sm leading-6"
        >
          <strong>{title}</strong>
          <br />
          삭제하면 되돌릴 수 없습니다. 연결된 대표 이미지도 정리합니다.
        </p>
        {failure && (
          <p role="alert" className="mt-4 text-sm text-[#b42318]">
            {failure}
          </p>
        )}
        <p role="status" className="mt-3 text-sm" aria-live="polite">
          {busy ? "삭제 중…" : ""}
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            ref={cancel}
            type="button"
            className={cmsAction}
            disabled={busy}
            onClick={() => dialog.current?.close()}
          >
            취소
          </button>
          <button
            type="button"
            className={`${cmsAction} !border-[#b42318] !bg-[#b42318] !text-white`}
            disabled={busy}
            onClick={remove}
          >
            {busy ? "삭제 중…" : "삭제 확정"}
          </button>
        </div>
      </dialog>
    </>
  );
}
