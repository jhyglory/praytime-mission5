"use client";

/* eslint-disable @next/next/no-img-element -- Retain the exact final supplied mockup. */
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

const minutes = [5, 10, 15] as const;

export function TimeSelectPreview() {
  const [selected, setSelected] = useState(1);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const gesture = useRef<{ x: number; swiped: boolean } | null>(null);
  function select(index: number, focus = false) {
    const next = (index + minutes.length) % minutes.length;
    setSelected(next);
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
      {/* The approved 10-minute initial state stays pixel-identical to the asset.
          Only a changed selection paints the native wheel over its UI slot. */}
      {selected !== 1 && <div className="wheel-native" aria-hidden="true">{slots.map((index, slot) => <div key={minutes[index]} className={`wheel-number wheel-number--${slot}`}><span>{String(minutes[index]).padStart(2, "0")}</span><small>분</small></div>)}<i className="wheel-indicator" /></div>}
      {minutes.map((value, index) => <button key={value} type="button" role="radio" aria-checked={selected === index} aria-label={`${value}분`} tabIndex={selected === index ? 0 : -1}
        className="wheel-hit-target" style={{ left: `${slots.indexOf(index) * 100 / 3}%` }}
        ref={element => { buttons.current[index] = element; }} onClick={() => select(index)}><span className="sr-only">{value}분</span></button>)}
    </div>
    <p className="sr-only" aria-live="polite" aria-atomic="true">{minutes[selected]}분 선택</p>
  </div>;
}
