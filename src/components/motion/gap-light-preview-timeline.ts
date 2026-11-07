import {
  GAP_LIGHT_BASE, GAP_LIGHT_CENTER, GAP_LIGHT_FINAL_WIDTH, GAP_LIGHT_HEIGHT,
  GAP_LIGHT_SLIT_WIDTH, GAP_LIGHT_TOP, GAP_LIGHT_TRAVELER_LENGTH,
} from "./gap-light-timeline";
import { smootherstep as smooth } from "@/lib/motion";

/** Keep the1.3x choreography, adding time only to the slow descent. */
export const GAP_LIGHT_PREVIEW_PLAYBACK_RATE = 1.3;
export const GAP_LIGHT_PREVIEW_SLOW_EXTENSION = 400;
const originalFallDuration = 900 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE;
const originalSlowDuration = originalFallDuration / 2;
const slowDuration = originalSlowDuration + GAP_LIGHT_PREVIEW_SLOW_EXTENSION;
const rampDuration = slowDuration / 4;
const rampStart = slowDuration - rampDuration;
const glideRate = (originalSlowDuration - rampDuration / 2) / (slowDuration - rampDuration / 2);
export const GAP_LIGHT_PREVIEW_DURATION = 7000 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE + GAP_LIGHT_PREVIEW_SLOW_EXTENSION;
export const GAP_LIGHT_PREVIEW_TIMING = {
  darkEnd: 400 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE,
  fallEnd: 1300 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE + GAP_LIGHT_PREVIEW_SLOW_EXTENSION,
  impactEnd: 2000 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE + GAP_LIGHT_PREVIEW_SLOW_EXTENSION,
  riseStart: 2300 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE + GAP_LIGHT_PREVIEW_SLOW_EXTENSION,
  riseEnd: 4500 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE + GAP_LIGHT_PREVIEW_SLOW_EXTENSION,
  openEnd: 6500 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE + GAP_LIGHT_PREVIEW_SLOW_EXTENSION,
  end: GAP_LIGHT_PREVIEW_DURATION,
} as const;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** One clock drives the separate moving dash, connected trail and light fields. */
export function gapLightPreviewFrameAt(milliseconds: number) {
  const time = Number.isNaN(milliseconds) ? 0 : Math.max(0, Math.min(GAP_LIGHT_PREVIEW_DURATION, milliseconds));
  const { darkEnd, fallEnd, impactEnd, riseStart, riseEnd, openEnd, end } = GAP_LIGHT_PREVIEW_TIMING;
  const fallElapsed = Math.max(0, Math.min(fallEnd - darkEnd, time - darkEnd));
  const ramp = clamp((fallElapsed - rampStart) / rampDuration);
  // Integral of smootherstep: the source clock joins the original magnetic
  // pull at exactly its old rate and acceleration, without a speed kink.
  const rampIntegral = ramp ** 4 * (2.5 + ramp * (-3 + ramp));
  const sourceFallTime = fallElapsed < slowDuration
    ? glideRate * fallElapsed + (1 - glideRate) * rampDuration * rampIntegral
    : originalSlowDuration + fallElapsed - slowDuration;
  const fall = clamp(sourceFallTime / originalFallDuration);
  const impact = smooth((time - fallEnd) / (impactEnd - fallEnd));
  const rise = smooth((time - riseStart) / (riseEnd - riseStart));
  const spread = smooth((time - riseEnd) / (openEnd - riseEnd));
  const settle = smooth((time - openEnd) / (end - openEnd));
  const sinceContact = time - fallEnd;
  const contactIgnition = smooth(sinceContact / (70 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE));
  const contactPulse = 1 - smooth((sinceContact - 70 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE) / (350 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE));
  const length = GAP_LIGHT_TRAVELER_LENGTH;
  const startTop = 70;
  // Glide first, then let the ground pull most of the distance in the last
  // part of the fall. Both curves settle with zero velocity/acceleration,
  // so the magnetic catch has no impact snap, overshoot or descent trace.
  const magneticPull = fall ** 8 * (45 + fall * (-80 + 36 * fall));
  const fallingProgress = clamp(0.15 * smooth(fall) + 0.85 * magneticPull);
  const fallingTop = startTop + (GAP_LIGHT_BASE - length - startTop) * fallingProgress;
  const risingTop = GAP_LIGHT_BASE - length - (GAP_LIGHT_BASE - length - GAP_LIGHT_TOP) * rise;
  const faceWidth = GAP_LIGHT_SLIT_WIDTH + (GAP_LIGHT_FINAL_WIDTH - GAP_LIGHT_SLIT_WIDTH) * spread;
  const floorExpansion = impact * (0.46 + 0.54 * spread);
  const groundScale = 1.4;

  return {
    time,
    phase: time < darkEnd ? "dark" : time < fallEnd ? "fall" : time < impactEnd ? "impact" : time < riseStart ? "hold" : time < riseEnd ? "rise" : time < openEnd ? "open" : time < end ? "settle" : "complete",
    travelerX: GAP_LIGHT_CENTER,
    travelerY: time < fallEnd ? fallingTop : risingTop,
    travelerLength: length,
    travelerOpacity: smooth((time - darkEnd) / (100 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE)) * (1 - smooth((time - (riseEnd - 180 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE)) / (180 / GAP_LIGHT_PREVIEW_PLAYBACK_RATE))),
    // Keep the stationary dash through impact and the proportionally shorter hold.
    // At lift-off, one identical opaque core replaces it to avoid a join.
    travelerCoreOpacity: time < riseStart ? 1 : 0,
    joinedY: risingTop,
    joinedHeight: GAP_LIGHT_BASE - risingTop,
    revealTop: GAP_LIGHT_BASE - GAP_LIGHT_HEIGHT * rise,
    revealHeight: GAP_LIGHT_HEIGHT * rise,
    slitOpacity: time >= riseStart ? 1 - spread : 0,
    faceX: GAP_LIGHT_CENTER - faceWidth / 2,
    faceWidth,
    faceOpacity: smooth(spread / 0.08),
    ambientOpacity: 0.12 * rise + 0.83 * spread + 0.05 * settle,
    ambientRevealY: GAP_LIGHT_BASE - GAP_LIGHT_HEIGHT * rise - (GAP_LIGHT_TOP + 100) * spread,
    ambientRadius: 100 + 320 * spread,
    nearGlowWidth: 8 + (GAP_LIGHT_FINAL_WIDTH + 28 - 8) * spread,
    midGlowWidth: 24 + (GAP_LIGHT_FINAL_WIDTH + 100 - 24) * spread,
    nearGlowOpacity: 0.12 * rise + 0.54 * spread + 0.02 * settle,
    midGlowOpacity: 0.03 * rise + 0.08 * spread + 0.01 * settle,
    farGlowOpacity: 0.004 * rise + 0.028 * spread + 0.003 * settle,
    floorOpacity: 0.65 * impact + 0.25 * spread + 0.1 * settle,
    floorRadius: 500 * floorExpansion * groundScale,
    floorRY: 105 * floorExpansion * groundScale,
    floorInnerRadius: 230 * impact * (0.35 + 0.65 * spread) * groundScale,
    floorInnerRY: 55 * impact * (0.35 + 0.65 * spread) * groundScale,
    contactOpacity: contactIgnition * (0.5 + 0.4 * contactPulse + 0.1 * spread),
    contactRadius: (32 + 18 * spread) * groundScale,
    contactRY: (10 + 6 * spread) * groundScale,
    impactOpacity: 0.7 * impact * (1 - spread),
    impactRadius: 130 * impact * groundScale,
    impactRY: 45 * impact * groundScale,
  };
}
