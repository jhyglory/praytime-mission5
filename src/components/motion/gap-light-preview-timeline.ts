import {
  GAP_LIGHT_BASE, GAP_LIGHT_CENTER, GAP_LIGHT_FINAL_WIDTH, GAP_LIGHT_HEIGHT,
  GAP_LIGHT_SLIT_WIDTH, GAP_LIGHT_TOP, GAP_LIGHT_TRAVELER_LENGTH,
} from "./gap-light-timeline";

/** Approved seven-second ivory choreography shared by the landing and preview. */
export const GAP_LIGHT_PREVIEW_DURATION = 7000;
export const GAP_LIGHT_PREVIEW_TIMING = {
  darkEnd: 400,
  fallEnd: 1300,
  impactEnd: 2000,
  riseStart: 2300,
  riseEnd: 4500,
  openEnd: 6500,
  end: GAP_LIGHT_PREVIEW_DURATION,
} as const;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const p = clamp(value);
  return p * p * (3 - 2 * p);
};

/** One clock drives the separate moving dash, connected trail and light fields. */
export function gapLightPreviewFrameAt(milliseconds: number) {
  const time = Number.isNaN(milliseconds) ? 0 : Math.max(0, Math.min(GAP_LIGHT_PREVIEW_DURATION, milliseconds));
  const { darkEnd, fallEnd, impactEnd, riseStart, riseEnd, openEnd, end } = GAP_LIGHT_PREVIEW_TIMING;
  const fall = clamp((time - darkEnd) / (fallEnd - darkEnd));
  const impact = smooth((time - fallEnd) / (impactEnd - fallEnd));
  const rise = smooth((time - riseStart) / (riseEnd - riseStart));
  const spread = smooth((time - riseEnd) / (openEnd - riseEnd));
  const settle = smooth((time - openEnd) / (end - openEnd));
  const sinceContact = time - fallEnd;
  const contactIgnition = smooth(sinceContact / 70);
  const contactPulse = 1 - smooth((sinceContact - 70) / 350);
  const length = GAP_LIGHT_TRAVELER_LENGTH;
  const startTop = 70;
  // Quadratic ease-in accelerates a short, centered dash toward the ground.
  // It never stretches or paints a persistent trace during its descent.
  const fallingTop = startTop + (GAP_LIGHT_BASE - length - startTop) * fall * fall;
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
    travelerOpacity: smooth((time - darkEnd) / 100) * (1 - smooth((time - (riseEnd - 180)) / 180)),
    // Keep the stationary dash through impact and the entire 300ms hold.
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
