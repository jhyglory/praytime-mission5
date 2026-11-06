"use client";

import { useEffect } from "react";

// The approved Hero raster contains both the object and its ambient light.
// Move that one plane coherently, within the stricter background-light limit.
const MAX_TRAVEL = 2.5;

export function HeroPointerMotion() {
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const eligible = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let attached = false;
    let bounds: { left: number; top: number; width: number; height: number } | null = null;
    let pointer: { x: number; y: number } | null = null;

    const measure = () => {
      const rect = hero.getBoundingClientRect();
      bounds = { left: rect.left + window.scrollX, top: rect.top + window.scrollY, width: rect.width, height: rect.height };
    };

    const reset = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      pointer = null;
      hero.style.removeProperty("--hero-pointer-x");
      hero.style.removeProperty("--hero-pointer-y");
      hero.dataset.pointerState = "idle";
    };

    const paint = () => {
      frame = 0;
      if (!pointer || !bounds || !bounds.width || !bounds.height || document.hidden) return;
      const x = Math.max(-1, Math.min(1, ((pointer.x - bounds.left) / bounds.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((pointer.y - bounds.top) / bounds.height - 0.5) * 2));
      const distance = Math.max(1, Math.hypot(x, y));
      hero.style.setProperty("--hero-pointer-x", `${(-x / distance * MAX_TRAVEL).toFixed(3)}px`);
      hero.style.setProperty("--hero-pointer-y", `${(-y / distance * MAX_TRAVEL).toFixed(3)}px`);
      hero.dataset.pointerState = "active";
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !event.isPrimary || document.hidden) return;
      pointer = { x: event.pageX, y: event.pageY };
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const enter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !event.isPrimary) return;
      measure();
      move(event);
    };

    const resize = () => {
      reset();
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    const visibility = () => { if (document.hidden) reset(); };

    const detach = () => {
      if (!attached) return;
      hero.removeEventListener("pointerenter", enter);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      hero.removeEventListener("pointercancel", reset);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
      attached = false;
    };

    const configure = () => {
      detach();
      reset();
      hero.dataset.pointerMotion = eligible.matches ? "enabled" : "disabled";
      if (!eligible.matches) return;
      measure();
      hero.addEventListener("pointerenter", enter, { passive: true });
      hero.addEventListener("pointermove", move, { passive: true });
      hero.addEventListener("pointerleave", reset, { passive: true });
      hero.addEventListener("pointercancel", reset, { passive: true });
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("blur", reset);
      document.addEventListener("visibilitychange", visibility);
      attached = true;
    };

    configure();
    eligible.addEventListener("change", configure);
    return () => {
      eligible.removeEventListener("change", configure);
      detach();
      reset();
      delete hero.dataset.pointerMotion;
      delete hero.dataset.pointerState;
    };
  }, []);

  return null;
}
