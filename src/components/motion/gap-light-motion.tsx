"use client";

import { forwardRef, useId, useImperativeHandle, useLayoutEffect, useRef } from "react";
import {
  GAP_LIGHT_BASE, GAP_LIGHT_CENTER, GAP_LIGHT_DURATION, GAP_LIGHT_FINAL_WIDTH,
  GAP_LIGHT_HEIGHT, GAP_LIGHT_SLIT_WIDTH, GAP_LIGHT_TIMING, GAP_LIGHT_TOP,
  GAP_LIGHT_TRAVELER_LENGTH, GAP_LIGHT_VIEW_HEIGHT, GAP_LIGHT_VIEW_WIDTH, gapLightFrameAt,
} from "./gap-light-timeline";
import { GAP_LIGHT_PREVIEW_DURATION, GAP_LIGHT_PREVIEW_TIMING, gapLightPreviewFrameAt } from "./gap-light-preview-timeline";
import styles from "./gap-light-motion.module.css";

const LINE_COLOR = "#FFFFF6";
type GapLightFrame = ReturnType<typeof gapLightFrameAt> & Partial<Pick<ReturnType<typeof gapLightPreviewFrameAt>, "nearGlowOpacity" | "midGlowOpacity" | "farGlowOpacity">>;
const frameFunctions: Record<"landing" | "preview", (time: number) => GapLightFrame> = {
  landing: gapLightFrameAt,
  preview: gapLightPreviewFrameAt,
};

export type GapLightPlaybackState = "idle" | "waiting" | "playing" | "paused" | "complete" | "still" | "reduced";
export type GapLightMotionHandle = {
  replay(): void;
  pause(): void;
  resume(): void;
  seek(timeMs: number): void;
  showFinal(): void;
};
export type GapLightMotionProps = {
  mode?: "animate" | "still";
  playbackId?: number;
  className?: string;
  visibilityThreshold?: number;
  startDelayMs?: number;
  /** Opt into the approved ivory preset; the older default remains for comparison. */
  variant?: "landing" | "preview";
  onProgress?: (timeMs: number) => void;
  onStateChange?: (state: GapLightPlaybackState) => void;
};

/** Shared ivory light choreography for the landing and development preview. */
export const GapLightMotion = forwardRef<GapLightMotionHandle, GapLightMotionProps>(function GapLightMotion({
  mode = "animate", playbackId = 0, className, visibilityThreshold = 0, startDelayMs = 0, variant = "landing", onProgress, onStateChange,
}, ref) {
  const instance = `gap-light-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const id = (name: string) => `${instance}-${name}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const controller = useRef<GapLightMotionHandle | null>(null);
  const callbacks = useRef({ onProgress, onStateChange });
  const preview = variant === "preview";
  const duration = preview ? GAP_LIGHT_PREVIEW_DURATION : GAP_LIGHT_DURATION;
  const timing = preview ? GAP_LIGHT_PREVIEW_TIMING : GAP_LIGHT_TIMING;
  const frameAt = frameFunctions[variant];
  const final = frameAt(duration);
  const centerY = (GAP_LIGHT_TOP + GAP_LIGHT_BASE) / 2;

  useLayoutEffect(() => { callbacks.current = { onProgress, onStateChange }; }, [onProgress, onStateChange]);
  useImperativeHandle(ref, () => ({
    replay: () => controller.current?.replay(),
    pause: () => controller.current?.pause(),
    resume: () => controller.current?.resume(),
    seek: time => controller.current?.seek(time),
    showFinal: () => controller.current?.showFinal(),
  }), []);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const get = (name: string) => svg.querySelector<SVGElement>(`[data-gap-part="${name}"]`)!;
    const parts = {
      ambient: get("ambient"), ambientMask: get("ambient-mask"), feather: get("ambient-feather"),
      outerGlow: get("ambient-outer"), midGlow: get("ambient-mid"), nearGlow: get("ambient-near"),
      floor: get("floor-spread"), floorOuter: get("floor-outer"), floorInner: get("floor-inner"),
      pool: get("impact-pool"), contact: get("contact"), contactGlow: get("contact-glow"),
      trail: get("trail"), trailCore: get("trail-core"), trailGlow: get("trail-glow"), trailFeather: get("trail-feather"), face: get("face"), faceRect: get("face-rect"),
      traveler: get("traveler"), travelerCore: get("traveler-core"), travelerHalo: get("traveler-halo"),
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, elapsed = 0, startedAt = 0;
    let delayTimer = 0;
    let delayReady = startDelayMs <= 0;
    let wantsPlay = mode === "animate";
    let inView = typeof IntersectionObserver === "undefined";
    let disposed = false;
    let lastState: GapLightPlaybackState | undefined;
    let maskActive: boolean | undefined;
    const set = (element: SVGElement, name: string, value: number) => element.setAttribute(name, String(value));
    const notify = (state: GapLightPlaybackState) => {
      svg.dataset.motionState = state;
      if (lastState !== state) { lastState = state; callbacks.current.onStateChange?.(state); }
    };
    const paint = (time: number) => {
      const value = frameAt(time);
      const masked = value.time < timing.openEnd;
      if (maskActive !== masked) {
        maskActive = masked;
        if (masked) parts.ambient.setAttribute("mask", `url(#${parts.ambientMask.id})`);
        else parts.ambient.removeAttribute("mask");
      }
      set(parts.feather, "y1", value.ambientRevealY);
      set(parts.feather, "y2", value.ambientRevealY + 64);
      set(parts.outerGlow, "rx", value.ambientRadius);
      for (const [element, width] of [[parts.midGlow, value.midGlowWidth], [parts.nearGlow, value.nearGlowWidth]] as const) {
        set(element, "x", GAP_LIGHT_CENTER - width / 2); set(element, "width", width);
      }
      set(parts.ambient, "opacity", value.ambientOpacity);
      if (value.nearGlowOpacity !== undefined) {
        set(parts.nearGlow, "opacity", value.nearGlowOpacity);
        set(parts.midGlow, "opacity", value.midGlowOpacity ?? 0.22);
        set(parts.outerGlow, "opacity", value.farGlowOpacity ?? 1);
      }
      set(parts.floor, "opacity", value.floorOpacity);
      set(parts.floorOuter, "rx", value.floorRadius); set(parts.floorOuter, "ry", value.floorRY);
      set(parts.floorInner, "rx", value.floorInnerRadius); set(parts.floorInner, "ry", value.floorInnerRY);
      set(parts.pool, "rx", value.impactRadius); set(parts.pool, "ry", value.impactRY); set(parts.pool, "opacity", value.impactOpacity);
      set(parts.contact, "opacity", value.contactOpacity);
      set(parts.contactGlow, "rx", value.contactRadius); set(parts.contactGlow, "ry", value.contactRY);
      // During ascent, paint the overlapping head/trail core only ONCE.
      // Matching two translucent rectangles still leaves antialiased seams.
      for (const element of [parts.trailCore, parts.trailGlow]) {
        set(element, "y", value.joinedY); set(element, "height", value.joinedHeight);
      }
      set(parts.trailFeather, "y1", value.joinedY - 24);
      set(parts.trailFeather, "y2", value.joinedY + 8);
      set(parts.trail, "opacity", value.slitOpacity);
      set(parts.face, "opacity", value.faceOpacity);
      set(parts.faceRect, "x", value.faceX); set(parts.faceRect, "width", value.faceWidth);
      set(parts.traveler, "opacity", value.travelerOpacity);
      set(parts.travelerCore, "x", value.travelerX - GAP_LIGHT_SLIT_WIDTH / 2);
      set(parts.travelerCore, "y", value.travelerY);
      set(parts.travelerCore, "opacity", value.travelerCoreOpacity);
      set(parts.travelerHalo, "cx", value.travelerX);
      set(parts.travelerHalo, "cy", value.travelerY + value.travelerLength / 2);
      svg.dataset.elapsed = String(value.time);
      svg.dataset.phase = value.phase;
      callbacks.current.onProgress?.(value.time);
    };
    const stop = () => {
      cancelAnimationFrame(frame); frame = 0;
      window.clearTimeout(delayTimer); delayTimer = 0;
    };
    const finish = (state: GapLightPlaybackState) => {
      stop(); wantsPlay = false; elapsed = duration;
      paint(elapsed); notify(reduced.matches ? "reduced" : state);
    };
    const pause = (manual: boolean) => {
      if (manual) wantsPlay = false;
      if (frame) elapsed = Math.min(duration, elapsed + performance.now() - startedAt);
      stop(); paint(elapsed);
      if (elapsed >= duration) { finish(lastState === "still" ? "still" : "complete"); return; }
      notify("paused");
    };
    const tick = (now: number) => {
      frame = 0;
      if (disposed) return;
      const time = Math.min(duration, elapsed + now - startedAt);
      paint(time);
      if (time >= duration) { elapsed = duration; wantsPlay = false; notify("complete"); return; }
      frame = requestAnimationFrame(tick);
    };
    const play = () => {
      if (disposed || frame || delayTimer || !wantsPlay || elapsed >= duration || !inView || document.hidden || reduced.matches) return;
      if (!delayReady) {
        notify("waiting");
        delayTimer = window.setTimeout(() => {
          delayTimer = 0;
          if (disposed || !wantsPlay || !inView || document.hidden || reduced.matches) return;
          delayReady = true; play();
        }, Math.max(0, startDelayMs));
        return;
      }
      startedAt = performance.now(); notify("playing"); frame = requestAnimationFrame(tick);
    };
    const replay = () => {
      stop();
      if (reduced.matches) { finish("reduced"); return; }
      elapsed = 0; delayReady = startDelayMs <= 0; wantsPlay = true; paint(0); notify("paused"); play();
    };
    controller.current = {
      replay,
      pause: () => { if (reduced.matches) finish("reduced"); else pause(true); },
      resume: () => { if (reduced.matches) finish("reduced"); else { wantsPlay = true; play(); } },
      seek: time => {
        if (reduced.matches) { finish("reduced"); return; }
        stop(); wantsPlay = false; delayReady = true;
        elapsed = Number.isNaN(time) ? 0 : Math.max(0, Math.min(duration, time));
        paint(elapsed); notify(elapsed >= duration ? "complete" : "paused");
      },
      showFinal: () => finish("still"),
    };
    const onVisibility = () => { if (document.hidden) pause(false); else play(); };
    const onReduced = () => { if (reduced.matches) finish("reduced"); };
    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(entries => {
      if (disposed) return;
      inView = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= visibilityThreshold);
      if (inView) play(); else if (frame || delayTimer) pause(false);
    }, { threshold: visibilityThreshold });
    if (mode === "still" || reduced.matches) finish(mode === "still" ? "still" : "reduced");
    else { paint(0); notify("paused"); }
    // Observe static instances too: imperative replay/seek can activate them.
    observer?.observe(svg);
    play();
    reduced.addEventListener("change", onReduced);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true; stop(); controller.current = null;
      observer?.disconnect(); reduced.removeEventListener("change", onReduced);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mode, playbackId, visibilityThreshold, startDelayMs, frameAt, duration, timing]);

  return <svg ref={svgRef} className={[styles.canvas, preview && styles.preview, className].filter(Boolean).join(" ")} viewBox={`0 0 ${GAP_LIGHT_VIEW_WIDTH} ${GAP_LIGHT_VIEW_HEIGHT}`} width={GAP_LIGHT_VIEW_WIDTH} height={GAP_LIGHT_VIEW_HEIGHT} style={{ aspectRatio: `${GAP_LIGHT_VIEW_WIDTH} / ${GAP_LIGHT_VIEW_HEIGHT}` }} role="img" aria-labelledby={id("title")} data-gap-light-motion data-motion-variant={variant} data-motion-state={mode === "still" ? "still" : "idle"} data-duration={duration} data-start-delay={startDelayMs}>
    <title id={id("title")}>짧은 빛이 내려와 바닥을 밝히고 다시 올라가 아이보리 발광면을 여는 모습</title>
    <defs>
      <radialGradient id={id("ambientColor")}><stop stopColor={preview ? "#FFFFF8" : "#FFF6E2"} stopOpacity={preview ? "1" : ".12"} /><stop offset=".25" stopColor={preview ? "#FFFFF8" : "#FFF6E2"} stopOpacity={preview ? ".4" : ".1"} /><stop offset=".6" stopColor={preview ? "#FFFFF8" : "#FFF6E2"} stopOpacity={preview ? ".08" : ".035"} /><stop offset="1" stopColor={preview ? "#FFFFF8" : "#FFF6E2"} stopOpacity="0" /></radialGradient>
      <radialGradient id={id("floorOuter")}><stop stopColor={preview ? "#FFFEF3" : "#FFF6E4"} stopOpacity={preview ? ".48" : ".42"} /><stop offset=".25" stopColor={preview ? "#FFFEF3" : "#FFF6E4"} stopOpacity=".22" /><stop offset=".6" stopColor={preview ? "#FFFEF3" : "#FFF6E4"} stopOpacity={preview ? ".035" : ".06"} /><stop offset={preview ? ".88" : "1"} stopColor={preview ? "#FFFEF3" : "#FFF6E4"} stopOpacity="0" /></radialGradient>
      <radialGradient id={id("floorInner")}><stop stopColor={preview ? "#FFFFF7" : "#FFFAEB"} stopOpacity={preview ? ".7" : ".62"} /><stop offset=".25" stopColor={preview ? "#FFFFF7" : "#FFFAEB"} stopOpacity=".34" /><stop offset=".65" stopColor={preview ? "#FFFFF7" : "#FFFAEB"} stopOpacity=".07" /><stop offset="1" stopColor={preview ? "#FFFFF7" : "#FFFAEB"} stopOpacity="0" /></radialGradient>
      <radialGradient id={id("contactColor")}><stop stopColor="#FFFFF5" stopOpacity=".95" /><stop offset=".3" stopColor="#FFFBEA" stopOpacity=".45" /><stop offset="1" stopColor="#FFFBEA" stopOpacity="0" /></radialGradient>
      <radialGradient id={id("movingAura")}><stop stopColor="#FFFFF4" stopOpacity=".6" /><stop offset=".3" stopColor="#FFFFF4" stopOpacity=".18" /><stop offset="1" stopColor="#FFFFF4" stopOpacity="0" /></radialGradient>
      <filter id={id("nearBlur")} filterUnits="userSpaceOnUse" x="0" y="0" width={GAP_LIGHT_VIEW_WIDTH} height={GAP_LIGHT_VIEW_HEIGHT}><feGaussianBlur stdDeviation={preview ? "12" : "28"} /></filter>
      <filter id={id("midBlur")} filterUnits="userSpaceOnUse" x="0" y="0" width={GAP_LIGHT_VIEW_WIDTH} height={GAP_LIGHT_VIEW_HEIGHT}><feGaussianBlur stdDeviation={preview ? "48" : "68"} /></filter>
      {preview && <>
        <linearGradient id={id("faceColor")} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#FFFDF0" /><stop offset=".22" stopColor="#FFFFFA" /><stop offset=".5" stopColor="#FFFFFE" /><stop offset=".78" stopColor="#FFFFFA" /><stop offset="1" stopColor="#FFFDF0" /></linearGradient>
        <filter id={id("faceSoftness")} filterUnits="userSpaceOnUse" x="0" y="0" width={GAP_LIGHT_VIEW_WIDTH} height={GAP_LIGHT_VIEW_HEIGHT}><feGaussianBlur stdDeviation=".8" /></filter>
      </>}
      <filter id={id("trailBlur")} filterUnits="userSpaceOnUse" x="0" y="0" width={GAP_LIGHT_VIEW_WIDTH} height={GAP_LIGHT_VIEW_HEIGHT}><feGaussianBlur stdDeviation="5" /></filter>
      <linearGradient id={id("revealFade")} data-gap-part="ambient-feather" gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="0" y2="-36"><stop stopColor="black" /><stop offset="1" stopColor="white" /></linearGradient>
      <mask id={id("ambientMask")} data-gap-part="ambient-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={GAP_LIGHT_VIEW_WIDTH} height={GAP_LIGHT_VIEW_HEIGHT}><rect width={GAP_LIGHT_VIEW_WIDTH} height={GAP_LIGHT_VIEW_HEIGHT} fill={`url(#${id("revealFade")})`} /></mask>
      <linearGradient id={id("trailFeather")} data-gap-part="trail-feather" gradientUnits="userSpaceOnUse" x1="0" y1={GAP_LIGHT_TOP - 24} x2="0" y2={GAP_LIGHT_TOP + 8}><stop stopColor="black" /><stop offset="1" stopColor="white" /></linearGradient>
      <mask id={id("trailGlowMask")} maskUnits="userSpaceOnUse" x="0" y="0" width={GAP_LIGHT_VIEW_WIDTH} height={GAP_LIGHT_VIEW_HEIGHT}><rect width={GAP_LIGHT_VIEW_WIDTH} height={GAP_LIGHT_VIEW_HEIGHT} fill={`url(#${id("trailFeather")})`} /></mask>
    </defs>
    <g data-gap-layer="background"><rect width={GAP_LIGHT_VIEW_WIDTH} height={GAP_LIGHT_VIEW_HEIGHT} fill="#080E26" /></g>
    <g className={styles.light} data-gap-layer="ambient" data-gap-part="ambient">
      <ellipse data-gap-part="ambient-outer" cx={GAP_LIGHT_CENTER} cy={centerY} rx={final.ambientRadius} ry={GAP_LIGHT_HEIGHT * .66} fill={`url(#${id("ambientColor")})`} opacity={final.farGlowOpacity} />
      <rect data-gap-part="ambient-mid" x={GAP_LIGHT_CENTER - final.midGlowWidth / 2} y={GAP_LIGHT_TOP} width={final.midGlowWidth} height={GAP_LIGHT_HEIGHT} fill={preview ? "#FFFFF6" : "#FFF4DD"} opacity={final.midGlowOpacity ?? ".22"} filter={`url(#${id("midBlur")})`} />
      <rect data-gap-part="ambient-near" x={GAP_LIGHT_CENTER - final.nearGlowWidth / 2} y={GAP_LIGHT_TOP} width={final.nearGlowWidth} height={GAP_LIGHT_HEIGHT} fill={preview ? "#FFFFF4" : "#FFF4DD"} opacity={final.nearGlowOpacity ?? ".45"} filter={`url(#${id("nearBlur")})`} />
    </g>
    <g className={styles.light} data-gap-layer="floor-spread" data-gap-part="floor-spread">
      <ellipse data-gap-part="floor-outer" cx={GAP_LIGHT_CENTER} cy={GAP_LIGHT_BASE + 12} rx={final.floorRadius} ry={final.floorRY} fill={`url(#${id("floorOuter")})`} />
      <ellipse data-gap-part="floor-inner" cx={GAP_LIGHT_CENTER} cy={GAP_LIGHT_BASE + 8} rx={final.floorInnerRadius} ry={final.floorInnerRY} fill={`url(#${id("floorInner")})`} />
      <ellipse data-gap-part="impact-pool" cx={GAP_LIGHT_CENTER} cy={GAP_LIGHT_BASE} rx={final.impactRadius} ry={final.impactRY} opacity={final.impactOpacity} fill={`url(#${id("floorInner")})`} />
    </g>
    <g className={styles.light} data-gap-layer="floor-contact" data-gap-part="contact"><ellipse data-gap-part="contact-glow" cx={GAP_LIGHT_CENTER} cy={GAP_LIGHT_BASE} rx={final.contactRadius} ry={final.contactRY} fill={`url(#${id("contactColor")})`} /></g>
    <g className={styles.transient} data-gap-layer="trail" data-gap-part="trail" opacity="0">
      <rect data-gap-part="trail-glow" x={GAP_LIGHT_CENTER - 7} y={GAP_LIGHT_TOP} width="14" height={GAP_LIGHT_HEIGHT} fill={LINE_COLOR} opacity=".4" filter={`url(#${id("trailBlur")})`} mask={`url(#${id("trailGlowMask")})`} />
      <rect data-gap-part="trail-core" x={GAP_LIGHT_CENTER - GAP_LIGHT_SLIT_WIDTH / 2} y={GAP_LIGHT_TOP} width={GAP_LIGHT_SLIT_WIDTH} height={GAP_LIGHT_HEIGHT} fill={LINE_COLOR} />
    </g>
    <g className={styles.light} data-gap-layer="face" data-gap-part="face"><rect data-gap-part="face-rect" x={GAP_LIGHT_CENTER - GAP_LIGHT_FINAL_WIDTH / 2} y={GAP_LIGHT_TOP} width={GAP_LIGHT_FINAL_WIDTH} height={GAP_LIGHT_HEIGHT} fill={preview ? `url(#${id("faceColor")})` : "#FEF9E7"} filter={preview ? `url(#${id("faceSoftness")})` : undefined} /></g>
    <g className={styles.transient} data-gap-layer="traveler" data-gap-part="traveler" opacity="0"><ellipse data-gap-part="traveler-halo" cx={GAP_LIGHT_CENTER} cy={70 + GAP_LIGHT_TRAVELER_LENGTH / 2} rx="7" ry={GAP_LIGHT_TRAVELER_LENGTH * .8} fill={`url(#${id("movingAura")})`} /><rect data-gap-part="traveler-core" x={GAP_LIGHT_CENTER - GAP_LIGHT_SLIT_WIDTH / 2} y="70" width={GAP_LIGHT_SLIT_WIDTH} height={GAP_LIGHT_TRAVELER_LENGTH} opacity={final.travelerCoreOpacity} fill={LINE_COLOR} /></g>
  </svg>;
});
