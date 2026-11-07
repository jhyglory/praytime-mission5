export const GAP_LIGHT_FALL_SPEED = 0.7;
const darkEnd = 200;
const fallEnd = darkEnd + 750 / GAP_LIGHT_FALL_SPEED;
export const GAP_LIGHT_DURATION = fallEnd + 1850 + 1100 + 300;
const referenceScale = 1200 / 1139;
export const GAP_LIGHT_VIEW_WIDTH = 1200;
export const GAP_LIGHT_VIEW_HEIGHT = 1381 * referenceScale;
export const GAP_LIGHT_CENTER = 600;
export const GAP_LIGHT_TOP = 188 * referenceScale;
export const GAP_LIGHT_BASE = 1158 * referenceScale;
export const GAP_LIGHT_HEIGHT = GAP_LIGHT_BASE - GAP_LIGHT_TOP;
export const GAP_LIGHT_FINAL_WIDTH = 46 * referenceScale;
export const GAP_LIGHT_TRAVELER_LENGTH = GAP_LIGHT_HEIGHT * 0.04 * 1.2 * 1.5;
export const GAP_LIGHT_SLIT_WIDTH = 3.8;

export const GAP_LIGHT_TIMING = {
  darkEnd, fallEnd, riseStart: fallEnd, impactEnd: fallEnd + 500,
  riseEnd: fallEnd + 1850, openEnd: fallEnd + 1850 + 1100, end: GAP_LIGHT_DURATION,
} as const;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const p = clamp(value);
  return p * p * (3 - 2 * p);
};

// One clock owns the traveling light, its separate trail, surface and radiance.
export function gapLightFrameAt(milliseconds: number) {
  const time = Number.isNaN(milliseconds) ? 0 : Math.max(0, Math.min(GAP_LIGHT_DURATION, milliseconds));
  const { darkEnd, fallEnd, riseStart, impactEnd, riseEnd, openEnd, end } = GAP_LIGHT_TIMING;
  const fall = clamp((time - darkEnd) / (fallEnd - darkEnd));
  const impact = smooth((time - fallEnd) / (impactEnd - fallEnd));
  const rise = smooth((time - riseStart) / (riseEnd - riseStart));
  const spread = smooth((time - riseEnd) / (openEnd - riseEnd));
  const settle = smooth((time - openEnd) / (end - openEnd));
  const contactIgnition = smooth((time - fallEnd) / 90);
  const length = GAP_LIGHT_TRAVELER_LENGTH;
  const startTop = 70;
  const fallingTop = startTop + (GAP_LIGHT_BASE - length - startTop) * smooth(fall);
  const risingTop = GAP_LIGHT_BASE - length - (GAP_LIGHT_BASE - length - GAP_LIGHT_TOP) * rise;
  const faceWidth = GAP_LIGHT_SLIT_WIDTH + (GAP_LIGHT_FINAL_WIDTH - GAP_LIGHT_SLIT_WIDTH) * spread;
  const floorExpansion = impact * (0.46 + 0.54 * spread);

  return {
    time,
    phase: time < darkEnd ? "dark" : time < fallEnd ? "fall" : time < impactEnd ? "impact" : time < riseEnd ? "rise" : time < openEnd ? "open" : time < end ? "settle" : "complete",
    // A small, smooth lateral drift keeps the upright dash from free-falling
    // rigidly. It returns to the exact center before contact and stays there.
    travelerX: time < fallEnd ? GAP_LIGHT_CENTER - 12 * Math.sin(Math.PI * fall) ** 2 : GAP_LIGHT_CENTER,
    travelerY: time < fallEnd ? fallingTop : risingTop,
    travelerLength: length,
    travelerOpacity: smooth((time - darkEnd) / 90) * (1 - smooth((time - (riseEnd - 160)) / 160)),
    travelerCoreOpacity: time < riseStart ? 1 : 0,
    joinedY: risingTop,
    joinedHeight: GAP_LIGHT_BASE - risingTop,
    revealTop: GAP_LIGHT_BASE - GAP_LIGHT_HEIGHT * rise,
    revealHeight: GAP_LIGHT_HEIGHT * rise,
    slitOpacity: time >= riseStart ? 1 - spread : 0,
    faceX: GAP_LIGHT_CENTER - faceWidth / 2,
    faceWidth,
    faceOpacity: smooth(spread / 0.08),
    ambientOpacity: 0.18 * rise + 0.72 * spread + 0.1 * settle,
    ambientRevealY: GAP_LIGHT_BASE - GAP_LIGHT_HEIGHT * rise - (GAP_LIGHT_TOP + 100) * spread,
    ambientRadius: 130 + 230 * spread,
    nearGlowWidth: 12 + (GAP_LIGHT_FINAL_WIDTH + 44 - 12) * spread,
    midGlowWidth: 36 + (GAP_LIGHT_FINAL_WIDTH + 128 - 36) * spread,
    floorOpacity: 0.65 * impact + 0.25 * spread + 0.1 * settle,
    floorRadius: 500 * floorExpansion,
    floorRY: 105 * floorExpansion,
    floorInnerRadius: 230 * impact * (0.35 + 0.65 * spread),
    floorInnerRY: 55 * impact * (0.35 + 0.65 * spread),
    contactOpacity: contactIgnition * (0.95 - 0.4 * rise + 0.25 * spread + 0.2 * settle),
    contactRadius: 32 + 18 * spread,
    contactRY: 10 + 6 * spread,
    impactOpacity: 0.7 * impact * (1 - spread),
    impactRadius: 130 * impact,
    impactRY: 45 * impact,
  };
}
