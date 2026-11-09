"use client";

/* eslint-disable @next/next/no-img-element -- Retain the exact final supplied mockup. */
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { MOTION_EASING } from "@/lib/motion";

const minutes = [5, 10, 15] as const;

export function TimeSelectPreview() {
  const [selected, setSelected] = useState(1);
  const [interacted, setInteracted] = useState(false);
  const [wrapping, setWrapping] = useState<number | null>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const gesture = useRef<{ x: number; swiped: boolean } | null>(null);
  useLayoutEffect(() => {
    const element = overlay.current;
    if (!interacted || !element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || typeof element.animate !== "function") return;
    // Native playback also starts reliably when the first click follows a scroll.
    const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: MOTION_EASING });
    const onReduced = () => { if (reduced.matches) animation.cancel(); };
    reduced.addEventListener("change", onReduced);
    return () => { animation.cancel(); reduced.removeEventListener("change", onReduced); };
  }, [interacted]);
  useLayoutEffect(() => {
    if (wrapping === null || wrapping < 0) return;
    const element = overlay.current?.querySelector<HTMLElement>(`[data-wheel-value="${minutes[wrapping]}"]`);
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || typeof element.animate !== "function") return;
    // Restart even when the same side number wraps on consecutive selections.
    const animation = element.animate([
      { offset: 0, opacity: 0 },
      { offset: .35, opacity: 0 },
      { offset: 1, opacity: .45 },
    ], { duration: 360, easing: MOTION_EASING });
    const onReduced = () => { if (reduced.matches) animation.cancel(); };
    reduced.addEventListener("change", onReduced);
    return () => { animation.cancel(); reduced.removeEventListener("change", onReduced); };
  }, [selected, wrapping]);
  function select(index: number, focus = false) {
    const next = (index + minutes.length) % minutes.length;
    if (next !== selected) {
      const before = [(selected + 2) % 3, selected, (selected + 1) % 3];
      const after = [(next + 2) % 3, next, (next + 1) % 3];
      setWrapping(minutes.findIndex((_, index) => Math.abs(before.indexOf(index) - after.indexOf(index)) > 1));
      setInteracted(true);
      setSelected(next);
    }
    if (focus) buttons.current[next]?.focus({ preventScroll: true });
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    select(event.key === "Home" ? 0 : event.key === "End" ? 2 : selected + (event.key === "ArrowRight" ? 1 : -1), true);
  }
  function release(event: PointerEvent<HTMLDivElement>) {
    if (!gesture.current || Math.abs(event.clientX - gesture.current.x) < 24) return;
    gesture.current.swiped = true;
    select(selected + (event.clientX < gesture.current.x ? 1 : -1));
  }
  const slots = [(selected + 2) % 3, selected, (selected + 1) % 3];
  return <div className="time-mockup">
    <img src="/assets/time-select-wheel.png" width="330" height="715.42" alt="PrayTime 시간 선택 미리보기. 필요한 시간만 선택하고, 시간이 끝나면 다시 멈춥니다. 이 시간만 사용하기." />
    <div className="time-wheel" role="radiogroup" aria-label="사용 시간 미리보기" data-selected={minutes[selected]}
      onKeyDown={keyboard}
      onPointerDown={event => { gesture.current = { x: event.clientX, swiped: false }; }}
      onPointerUp={release}
      onPointerCancel={() => { gesture.current = null; }}
      onClickCapture={event => { if (gesture.current?.swiped) { event.preventDefault(); event.stopPropagation(); gesture.current = null; } }}>
      {/* Keep the initial raster untouched, then retain stable keyed numbers so
          returning to10 animates too. The wrapping side fades instead of crossing the center. */}
      <div ref={overlay} className="wheel-native" aria-hidden="true" data-wheel-active={interacted}>{minutes.map((value, index) => <div key={value} className={`wheel-number wheel-number--${slots.indexOf(index)}`} data-wheel-value={value} data-wheel-wrap={wrapping === index || undefined}><span>{String(value).padStart(2, "0")}</span><small>분</small></div>)}<i className="wheel-indicator" /></div>
      {minutes.map((value, index) => <button key={value} type="button" role="radio" aria-checked={selected === index} aria-label={`${value}분`} tabIndex={selected === index ? 0 : -1}
        className="wheel-hit-target" data-wheel-wrap={wrapping === index || undefined} style={{ left: `${slots.indexOf(index) * 100 / 3}%` }}
        ref={element => { buttons.current[index] = element; }} onClick={() => select(index)}><span className="sr-only">{value}분</span></button>)}
    </div>
    <p className="sr-only m-0" aria-live="polite" aria-atomic="true">{minutes[selected]}분 선택</p>
  </div>;
}
