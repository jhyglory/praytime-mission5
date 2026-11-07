"use client";

/* eslint-disable @next/next/no-img-element -- Approved hero raster uses Figma's exact crop. */
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AppPreview } from "./app-preview";

export function HeroPreview() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - index;
    setTheme(next === 0 ? "light" : "dark");
    tabs.current[next]?.focus();
  }
  return (
    <div className="hero-visual" data-figma-node="916:310 / 916:796">
      <img className="hero-object" src="/assets/offset-interval-b-refinement-v11-hero-only.png" width="1140" height="855" alt="" aria-hidden="true" fetchPriority="high" />
      <div className="hero-product">
        <div className="hero-preview-toggle" role="tablist" aria-label="앱 미리보기 테마">
          {(["light", "dark"] as const).map((value, index) => (
            <button key={value} ref={element => { tabs.current[index] = element; }} type="button" role="tab" id={`${id}-${value}`} aria-selected={theme === value} aria-controls={`${id}-panel`} tabIndex={theme === value ? 0 : -1} onClick={() => setTheme(value)} onKeyDown={event => onKeyDown(event, index)}>
              <span>{value === "light" ? "Light" : "Dark"}</span>
            </button>
          ))}
        </div>
        <div className="hero-preview-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${theme}`} tabIndex={0}>
          <AppPreview step="pause" hero theme={theme} />
        </div>
      </div>
    </div>
  );
}
